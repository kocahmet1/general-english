import {
  collection,
  collectionGroup,
  getDocs,
  query,
  Timestamp,
  where,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAllExams } from './examService';
import { getLocalExams } from './localStorageService';
import { sampleReadingPassages } from '../data/readingPassages';
import { listeningTests } from '../data/listeningQuestions';
import { optionLabel, percent } from '../hooks/useActivitySession';
import {
  GRAMMAR_CATEGORY_LABELS,
  IELTS_SECTION_LABELS,
  LISTENING_PASSAGE_LABELS,
  LISTENING_QUESTION_TYPE_LABELS,
  READING_QUESTION_TYPE_LABELS,
  type GrammarCategory,
  type IELTSSpeakingSection,
} from '../types';
import type { ActivityDetail, ActivityQuestionResult, ActivityRecord } from '../types/activity';

export interface AdminStudent {
  uid: string;
  email?: string;
  lastSeenAt?: Date;
  createdAt?: Date;
}

export interface StudentReport {
  records: ActivityRecord[];
  /** Full essay text by writing submission id, for the report's detail view. */
  writingTexts: Record<string, string>;
  /** Sources that could not be read (usually Firestore rules). */
  warnings: string[];
}

const toDate = (value: unknown): Date | undefined => {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (value && typeof (value as { toDate?: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate();
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  return undefined;
};

const describeError = (error: unknown): string => {
  const code = (error as { code?: string })?.code;
  if (code === 'permission-denied') return 'Firestore kuralları okumaya izin vermiyor';
  if (code === 'failed-precondition') return 'Firestore indeksi gerekiyor';
  return error instanceof Error ? error.message : String(error);
};

// ───────────────────────── students ─────────────────────────

/**
 * Students come from users/{uid} profile docs. Older accounts never wrote that
 * doc, so their ids are also discovered from data they left behind; those show
 * up without an email until they visit the app again.
 */
export async function listStudents(): Promise<{ students: AdminStudent[]; warnings: string[] }> {
  const byId = new Map<string, AdminStudent>();
  const warnings: string[] = [];

  try {
    const snap = await getDocs(collection(db, 'users'));
    snap.forEach(docSnap => {
      const data = docSnap.data({ serverTimestamps: 'estimate' });
      byId.set(docSnap.id, {
        uid: docSnap.id,
        email: typeof data.email === 'string' ? data.email : undefined,
        lastSeenAt: toDate(data.lastSeenAt),
        createdAt: toDate(data.createdAt),
      });
    });
  } catch (error) {
    warnings.push(`Kullanıcı listesi okunamadı: ${describeError(error)}`);
  }

  // Best effort: collection-group reads need their own Firestore rule. The small
  // stats docs exist for anyone who has used exams, reading, listening or speaking.
  const discovered = await Promise.allSettled([getDocs(collectionGroup(db, 'stats'))]);
  discovered.forEach(result => {
    if (result.status !== 'fulfilled') return;
    result.value.forEach(docSnap => {
      const userDoc = docSnap.ref.parent.parent;
      if (!userDoc || userDoc.parent.id !== 'users' || byId.has(userDoc.id)) return;
      byId.set(userDoc.id, { uid: userDoc.id });
    });
  });

  const students = Array.from(byId.values()).sort((a, b) => {
    const seen = (b.lastSeenAt?.getTime() ?? 0) - (a.lastSeenAt?.getTime() ?? 0);
    if (seen !== 0) return seen;
    return (a.email || `~${a.uid}`).localeCompare(b.email || `~${b.uid}`);
  });

  return { students, warnings };
}

// ───────────────────────── per-student report ─────────────────────────

async function readSource<T>(
  label: string,
  warnings: string[],
  load: () => Promise<T[]>,
): Promise<T[]> {
  try {
    return await load();
  } catch (error) {
    warnings.push(`${label}: ${describeError(error)}`);
    return [];
  }
}

function inRange(date: Date | undefined, from: Date, to: Date): date is Date {
  return !!date && date >= from && date <= to;
}

function mapActivityDoc(id: string, data: DocumentData): ActivityRecord | null {
  const startedAt = toDate(data.startedAt);
  const endedAt = toDate(data.endedAt);
  if (!startedAt || !endedAt || !data.type) return null;
  return {
    id,
    type: data.type,
    title: data.title || '',
    subtitle: data.subtitle,
    itemId: data.itemId,
    sourceId: data.sourceId,
    status: data.status === 'completed' ? 'completed' : 'in_progress',
    startedAt,
    endedAt,
    durationSeconds: typeof data.durationSeconds === 'number' ? data.durationSeconds : undefined,
    totalQuestions: data.totalQuestions,
    answeredCount: data.answeredCount,
    correctCount: data.correctCount,
    scorePercent: data.scorePercent,
    scoreLabel: data.scoreLabel,
    bandScore: data.bandScore,
    details: Array.isArray(data.details) ? data.details : undefined,
    questions: Array.isArray(data.questions) ? data.questions : undefined,
    feedbackSummary: data.feedbackSummary,
  };
}

const scoreDetails = (feedback: DocumentData | undefined): ActivityDetail[] => {
  if (!feedback) return [];
  const rows: ActivityDetail[] = [];
  if (typeof feedback.grammarScore === 'number') rows.push({ label: 'Gramer', value: `${feedback.grammarScore}/100` });
  if (typeof feedback.vocabularyScore === 'number') rows.push({ label: 'Kelime bilgisi', value: `${feedback.vocabularyScore}/100` });
  if (typeof feedback.structureScore === 'number') rows.push({ label: 'Yapı', value: `${feedback.structureScore}/100` });
  if (typeof feedback.contentScore === 'number') rows.push({ label: 'İçerik', value: `${feedback.contentScore}/100` });
  if (Array.isArray(feedback.errors)) rows.push({ label: 'Bulunan hata', value: String(feedback.errors.length) });
  return rows;
};

const toAnswerList = (answers: unknown): { questionId: number; selectedAnswer: string; isCorrect: boolean }[] => {
  if (!answers || typeof answers !== 'object') return [];
  return Object.entries(answers as Record<string, DocumentData>).map(([key, value]) => ({
    questionId: Number(value?.questionId ?? key),
    selectedAnswer: String(value?.selectedAnswer ?? ''),
    isCorrect: Boolean(value?.isCorrect),
  }));
};

const LEGACY_NOTE = 'Bu kayıt etkinlik takibi eklenmeden önce oluşturuldu; süre bilgisi yok.';

/**
 * Everything one student did between `from` and `to`, newest first.
 * Attempts from the activity log come first; data saved before the log existed
 * is added as legacy records unless an activity-log record already covers it.
 */
export async function getStudentReport(uid: string, from: Date, to: Date): Promise<StudentReport> {
  const warnings: string[] = [];
  const fromTs = Timestamp.fromDate(from);
  const toTs = Timestamp.fromDate(to);
  const userCol = (name: string) => collection(db, 'users', uid, name);

  const [activityDocs, writingDocs, speakingDocs, readingDocs, listeningDocs, mistakeDocs] = await Promise.all([
    readSource('Etkinlik kaydı', warnings, async () =>
      (await getDocs(query(userCol('activityLog'), where('endedAt', '>=', fromTs), where('endedAt', '<=', toTs)))).docs),
    readSource('Yazma gönderileri', warnings, async () =>
      (await getDocs(query(userCol('writingSubmissions'), where('submittedAt', '>=', fromTs), where('submittedAt', '<=', toTs)))).docs),
    readSource('Konuşma seansları', warnings, async () =>
      (await getDocs(query(userCol('speakingSessions'), where('startedAt', '>=', fromTs), where('startedAt', '<=', toTs)))).docs),
    readSource('Okuma ilerlemesi', warnings, async () => (await getDocs(userCol('readingProgress'))).docs),
    readSource('Dinleme ilerlemesi', warnings, async () => (await getDocs(userCol('listeningProgress'))).docs),
    readSource('Sınav yanlışları', warnings, async () =>
      (await getDocs(query(userCol('mistakes'), where('timestamp', '>=', fromTs), where('timestamp', '<=', toTs)))).docs),
  ]);

  const records: ActivityRecord[] = activityDocs
    .map(d => mapActivityDoc(d.id, d.data()))
    .filter((r): r is ActivityRecord => r !== null);

  const fromLog = [...records];
  const logged = (type: ActivityRecord['type']) => fromLog.filter(r => r.type === type);
  const writingTexts: Record<string, string> = {};

  // Writing submissions
  const loggedWriting = new Set(logged('writing').map(r => r.sourceId).filter(Boolean));
  writingDocs.forEach(docSnap => {
    const data = docSnap.data();
    if (typeof data.originalText === 'string') writingTexts[docSnap.id] = data.originalText;
    if (loggedWriting.has(docSnap.id)) return;
    const submittedAt = toDate(data.submittedAt);
    if (!submittedAt) return;
    const context = data.evaluationContext as DocumentData | undefined;
    const feedback = data.feedback as DocumentData | undefined;
    records.push({
      id: `legacy-writing-${docSnap.id}`,
      type: 'writing',
      title: data.promptTitle || context?.promptTitle || 'Serbest Yazı',
      subtitle: context?.examType ? String(context.examType).toUpperCase() : undefined,
      itemId: data.promptId,
      sourceId: docSnap.id,
      status: 'completed',
      startedAt: submittedAt,
      endedAt: submittedAt,
      scorePercent: typeof feedback?.overallScore === 'number' ? feedback.overallScore : undefined,
      scoreLabel: typeof feedback?.overallScore === 'number' ? `${feedback.overallScore}/100` : undefined,
      feedbackSummary: feedback?.summary,
      details: [
        { label: 'Kelime sayısı', value: String(data.wordCount ?? '—') },
        ...scoreDetails(feedback),
        ...(feedback ? [] : [{ label: 'Not', value: 'AI değerlendirmesi yok' }]),
      ],
      legacy: true,
    });
  });

  // Speaking sessions
  const loggedSpeaking = new Set(logged('speaking').map(r => r.sourceId).filter(Boolean));
  speakingDocs.forEach(docSnap => {
    if (loggedSpeaking.has(docSnap.id)) return;
    const data = docSnap.data();
    const startedAt = toDate(data.startedAt);
    if (!startedAt) return;
    const feedback = data.feedback as DocumentData | undefined;
    const question = data.question as DocumentData | undefined;
    const seconds = Number(data.duration) || 0;
    records.push({
      id: `legacy-speaking-${docSnap.id}`,
      type: 'speaking',
      title: question?.topic || 'Konuşma',
      subtitle: question?.section ? IELTS_SECTION_LABELS[question.section as IELTSSpeakingSection] : undefined,
      itemId: data.questionId,
      sourceId: docSnap.id,
      status: 'completed',
      startedAt,
      endedAt: toDate(data.completedAt) || startedAt,
      bandScore: typeof feedback?.overallBandScore === 'number' ? feedback.overallBandScore : undefined,
      scoreLabel: typeof feedback?.overallBandScore === 'number' ? `Band ${feedback.overallBandScore}` : undefined,
      feedbackSummary: feedback?.summary,
      details: [
        ...(question?.questionText ? [{ label: 'Soru', value: String(question.questionText) }] : []),
        { label: 'Konuşma süresi', value: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}` },
        ...(feedback ? [
          { label: 'Akıcılık', value: String(feedback.fluencyScore ?? '—') },
          { label: 'Kelime bilgisi', value: String(feedback.vocabularyScore ?? '—') },
          { label: 'Gramer', value: String(feedback.grammarScore ?? '—') },
          { label: 'Telaffuz', value: String(feedback.pronunciationScore ?? '—') },
          ...(feedback.transcript ? [{ label: 'Transkript', value: String(feedback.transcript) }] : []),
        ] : []),
      ],
      legacy: true,
    });
  });

  // Reading / listening progress: one doc per passage, overwritten on retakes.
  // Skip it when the activity log already has an attempt at that passage from the same time on.
  const coveredByLog = (type: ActivityRecord['type'], itemId: string, since: Date) =>
    logged(type).some(r => r.itemId === itemId && r.endedAt.getTime() >= since.getTime() - 60_000);

  readingDocs.forEach(docSnap => {
    const data = docSnap.data();
    const passageId = String(data.passageId || docSnap.id);
    const startedAt = toDate(data.startedAt);
    const completedAt = toDate(data.completedAt);
    const endedAt = completedAt || startedAt;
    if (!startedAt || !inRange(endedAt, from, to) || coveredByLog('reading', passageId, startedAt)) return;
    const passage = sampleReadingPassages.find(p => p.id === passageId);
    const answers = toAnswerList(data.answers);
    const correct = answers.filter(a => a.isCorrect).length;
    const questions: ActivityQuestionResult[] = answers.map(a => {
      const q = passage?.questions.find(item => item.id === a.questionId);
      return {
        prompt: q?.questionText || `Soru ${a.questionId}`,
        given: q ? optionLabel(q.options, a.selectedAnswer) : a.selectedAnswer,
        expected: q ? optionLabel(q.options, q.correctAnswer) : undefined,
        isCorrect: a.isCorrect,
        tag: q ? READING_QUESTION_TYPE_LABELS[q.questionType] : undefined,
      };
    });
    records.push({
      id: `legacy-reading-${docSnap.id}`,
      type: 'reading',
      title: passage?.title || passageId,
      subtitle: passage?.difficulty,
      itemId: passageId,
      status: completedAt ? 'completed' : 'in_progress',
      startedAt,
      endedAt,
      totalQuestions: passage?.questions.length,
      answeredCount: answers.length,
      correctCount: correct,
      scorePercent: typeof data.score === 'number' ? data.score : percent(correct, answers.length),
      questions,
      details: [
        ...(passage ? [{ label: 'Seviye', value: passage.difficulty }, { label: 'Konu', value: passage.topic }] : []),
      ],
      legacy: true,
    });
  });

  listeningDocs.forEach(docSnap => {
    const data = docSnap.data();
    const testId = String(data.testId || docSnap.id);
    const startedAt = toDate(data.startedAt);
    const completedAt = toDate(data.completedAt);
    const endedAt = completedAt || startedAt;
    if (!startedAt || !inRange(endedAt, from, to) || coveredByLog('listening', testId, startedAt)) return;
    const test = listeningTests.find(t => t.id === testId);
    const answers = toAnswerList(data.answers);
    const correct = answers.filter(a => a.isCorrect).length;
    records.push({
      id: `legacy-listening-${docSnap.id}`,
      type: 'listening',
      title: test?.title || testId,
      subtitle: test ? `${LISTENING_PASSAGE_LABELS[test.section]} · ${test.difficulty}` : undefined,
      itemId: testId,
      status: completedAt ? 'completed' : 'in_progress',
      startedAt,
      endedAt,
      totalQuestions: test?.questions.length,
      answeredCount: answers.length,
      correctCount: correct,
      scorePercent: typeof data.score === 'number' ? data.score : percent(correct, answers.length),
      questions: answers.map(a => {
        const q = test?.questions.find(item => item.id === a.questionId);
        return {
          prompt: q?.questionText || `Soru ${a.questionId}`,
          given: q ? optionLabel(q.options, a.selectedAnswer) : a.selectedAnswer,
          expected: q ? optionLabel(q.options, q.correctAnswer) : undefined,
          isCorrect: a.isCorrect,
          tag: q ? LISTENING_QUESTION_TYPE_LABELS[q.questionType] : undefined,
        };
      }),
      details: [{ label: 'Ses dinleme sayısı', value: String(data.audioPlayCount ?? '—') }],
      legacy: true,
    });
  });

  // Exam mistakes: before the activity log, exams only stored wrong answers.
  // Group the ones no logged attempt covers by exam and day.
  const examAttempts = logged('exam');
  const uncovered = mistakeDocs
    .map(d => ({ id: d.id, ...d.data(), timestamp: toDate(d.data().timestamp) }) as DocumentData & { id: string; timestamp?: Date })
    .filter(m => m.timestamp && !examAttempts.some(r =>
      r.itemId === m.examId &&
      m.timestamp!.getTime() >= r.startedAt.getTime() - 60_000 &&
      m.timestamp!.getTime() <= r.endedAt.getTime() + 10 * 60_000));

  if (uncovered.length > 0) {
    const examNames = new Map<string, string>();
    try {
      (await getAllExams()).forEach(e => examNames.set(e.id, e.name));
    } catch {
      // Exams may live only in local storage.
    }
    try {
      getLocalExams().forEach(e => { if (!examNames.has(e.id)) examNames.set(e.id, e.name); });
    } catch {
      // Ignore: names are a nicety.
    }

    const groups = new Map<string, (DocumentData & { id: string; timestamp?: Date })[]>();
    uncovered.forEach(m => {
      const key = `${m.examId}|${m.timestamp!.toDateString()}`;
      groups.set(key, [...(groups.get(key) || []), m]);
    });
    groups.forEach((items, key) => {
      items.sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());
      const examId = String(items[0].examId || '');
      records.push({
        id: `legacy-exam-${key}`,
        type: 'exam',
        title: examNames.get(examId) || 'Sınav',
        itemId: examId,
        status: 'completed',
        startedAt: items[0].timestamp!,
        endedAt: items[items.length - 1].timestamp!,
        questions: items.map(m => ({
          prompt: String(m.questionText || `Soru ${m.questionId}`),
          given: String(m.selectedAnswer ?? ''),
          expected: m.correctAnswer != null ? String(m.correctAnswer) : undefined,
          isCorrect: false,
          tag: GRAMMAR_CATEGORY_LABELS[m.grammarCategory as GrammarCategory] || undefined,
        })),
        details: [
          { label: 'Kayıtlı yanlış', value: String(items.length) },
          { label: 'Not', value: 'Bu tarihten önce sınavlarda yalnızca yanlış cevaplar kaydediliyordu; doğru sayısı ve süre bilinmiyor.' },
        ],
        legacy: true,
      });
    });
  }

  records.forEach(r => {
    if (r.legacy && r.type !== 'exam') {
      r.details = [...(r.details || []), { label: 'Not', value: LEGACY_NOTE }];
    }
  });

  records.sort((a, b) => b.endedAt.getTime() - a.endedAt.getTime());
  return { records, writingTexts, warnings };
}
