import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle, ArrowLeft, Award, BookOpen, Check, ChevronRight, Clock, FileText, Gauge, GraduationCap,
  Headphones, Lock, Pause, Play, RefreshCw, RotateCcw, SkipForward, Target,
} from 'lucide-react';
import { PageBack } from './LearningLayout';
import { ListeningFormatTabs } from './ListeningFormatTabs';
import { IeltsListeningSheet } from './IeltsListeningSheet';
import { useIeltsAudio } from '../hooks/useIeltsAudio';
import { useActivitySession, percent } from '../hooks/useActivitySession';
import type {
  IeltsAudioCue, IeltsListeningMode, IeltsListeningPart, IeltsListeningProgress, IeltsListeningTest, IeltsPartAudio,
} from '../types/ieltsListening';
import {
  bandForRaw, expectedLabel, formatBand, givenLabel, markPart, markTest, partQuestions, partRange, questionPrompt,
  questionTypeLabel, rawForBand, testQuestions, type IeltsMark,
} from '../services/ieltsListeningScoring';
import '../listening.css';
import '../ielts-listening.css';

interface IeltsListeningProps {
  tests: IeltsListeningTest[];
  audio: Record<string, Record<number, IeltsPartAudio>>;
  /** False when nobody is logged in: progress then lives only in this page. */
  canSave: boolean;
  /** Separates unsaved answers in this browser per user. */
  draftKey: string;
  loadProgress: (testId: string) => Promise<IeltsListeningProgress | null>;
  saveProgress: (progress: IeltsListeningProgress) => Promise<void>;
  resetProgress: (testId: string) => Promise<void>;
  onClose: () => void;
}

const TARGET_BAND = 6.5;
const MODE_LABEL: Record<IeltsListeningMode, string> = { practice: 'Pratik modu', exam: 'Sınav modu' };

const formatTime = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/* Unsaved answers survive a reload in this browser. Storage can be missing or blocked. */
const draftStorageKey = (draftKey: string, testId: string) => `ielts-listening-draft:${draftKey}:${testId}`;
function readDraft(key: string): Record<number, string> {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch { return {}; }
}
function writeDraft(key: string, responses: Record<number, string>) {
  try { localStorage.setItem(key, JSON.stringify(responses)); } catch { /* ignore */ }
}
function clearDraft(key: string) {
  try { localStorage.removeItem(key); } catch { /* ignore */ }
}

function isComplete(test: IeltsListeningTest, progress: IeltsListeningProgress | null) {
  return Boolean(progress) && test.parts.every(p => progress!.submittedParts.includes(p.number));
}

export function IeltsListening({ tests, audio, canSave, draftKey, loadProgress, saveProgress, resetProgress, onClose }: IeltsListeningProps) {
  const [params, setParams] = useSearchParams();
  const test = tests.find(t => t.id === params.get('test')) ?? null;
  const view = params.get('view');
  const partNumber = Number(params.get('part')) || 1;

  const [summaries, setSummaries] = useState<Record<string, IeltsListeningProgress | null>>({});
  const [progress, setProgress] = useState<IeltsListeningProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [loadVersion, setLoadVersion] = useState(0);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const sessionParts = useRef<Set<number>>(new Set());
  const session = useActivitySession(test?.id ?? null);
  const topRef = useRef<HTMLDivElement>(null);

  const go = useCallback((next: { test?: string | null; part?: number; view?: string }) => {
    const p: Record<string, string> = {};
    if (next.test) p.test = next.test;
    if (next.test && next.part) p.part = String(next.part);
    if (next.test && next.view) p.view = next.view;
    setParams(p);
    topRef.current?.scrollIntoView({ block: 'start' });
  }, [setParams]);

  // List view: last state of every test.
  useEffect(() => {
    if (test) return;
    let alive = true;
    Promise.all(tests.map(async t => {
      try { return [t.id, await loadProgress(t.id)] as const; } catch { return [t.id, null] as const; }
    })).then(entries => { if (alive) setSummaries(Object.fromEntries(entries)); });
    return () => { alive = false; };
  }, [test, tests, loadProgress]);

  // Test view: saved progress plus answers typed but not yet submitted in this browser.
  useEffect(() => {
    setProgress(null);
    setLoadError('');
    setSaveError('');
    setConfirmReset(false);
    sessionParts.current = new Set();
    if (!test) return;
    let alive = true;
    setLoading(true);
    loadProgress(test.id)
      .then(saved => {
        if (!alive || !saved) return;
        const draft = readDraft(draftStorageKey(draftKey, test.id));
        const locked = new Set(saved.submittedParts.flatMap(n => partQuestions(test.parts.find(p => p.number === n)!).map(r => r.question.number)));
        const merged = { ...saved.responses };
        Object.entries(draft).forEach(([k, v]) => { if (!locked.has(Number(k))) merged[Number(k)] = v; });
        setProgress({ ...saved, responses: merged });
      })
      .catch(() => { if (alive) setLoadError('Kayıtlı ilerlemeniz yüklenemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [test, draftKey, loadProgress, loadVersion]);

  const persist = useCallback(async (next: IeltsListeningProgress) => {
    if (!canSave) return;
    setSaving(true);
    try {
      await saveProgress(next);
      setSaveError('');
    } catch {
      setSaveError('Cevaplarınız kaydedilemedi. Sayfadan ayrılmadan önce “Tekrar kaydet” düğmesine basın.');
    } finally {
      setSaving(false);
    }
  }, [canSave, saveProgress]);

  const startTest = async (mode: IeltsListeningMode) => {
    if (!test) return;
    const fresh: IeltsListeningProgress = { testId: test.id, format: 'ielts', mode, responses: {}, submittedParts: [], startedAt: new Date() };
    clearDraft(draftStorageKey(draftKey, test.id));
    setProgress(fresh);
    go({ test: test.id, part: 1 });
    await persist(fresh);
  };

  const updateResponse = (number: number, value: string) => {
    if (!test) return;
    setProgress(prev => {
      if (!prev) return prev;
      const responses = { ...prev.responses, [number]: value };
      writeDraft(draftStorageKey(draftKey, test.id), responses);
      return { ...prev, responses };
    });
  };

  const recordActivity = (next: IeltsListeningProgress) => {
    if (!test) return;
    const all = markTest(test, next.responses);
    const byNumber = new Map(all.map(m => [m.number, m]));
    const sessionRefs = test.parts.filter(p => sessionParts.current.has(p.number)).flatMap(partQuestions);
    const correct = sessionRefs.filter(r => byNumber.get(r.question.number)?.isCorrect).length;
    const complete = isComplete(test, next);
    const partScores = test.parts
      .filter(p => next.submittedParts.includes(p.number))
      .map(p => `Part ${p.number}: ${markPart(p, next.responses).filter(m => m.isCorrect).length}/${partQuestions(p).length}`);
    session.record({
      type: 'listening',
      title: test.title,
      subtitle: `IELTS · ${MODE_LABEL[next.mode]} · ${next.submittedParts.length}/${test.parts.length} bölüm`,
      itemId: test.id,
      status: complete ? 'completed' : 'in_progress',
      totalQuestions: testQuestions(test).length,
      answeredCount: sessionRefs.length,
      correctCount: correct,
      scorePercent: percent(correct, sessionRefs.length),
      scoreLabel: complete ? `${next.rawScore}/40 · Band ${formatBand(next.band ?? 0)} (tahmini)` : undefined,
      details: [
        { label: 'Format', value: 'IELTS Listening (4 bölüm, 40 soru)' },
        { label: 'Mod', value: MODE_LABEL[next.mode] },
        { label: 'Bölüm puanları', value: partScores.join(' · ') },
        ...(complete ? [{ label: 'Toplam', value: `${next.rawScore}/40 · tahmini band ${formatBand(next.band ?? 0)}` }] : []),
      ],
      questions: sessionRefs.map(({ group, question }) => {
        const mark = byNumber.get(question.number);
        return {
          prompt: `${question.number}. ${questionPrompt(group, question)}`,
          given: givenLabel(group, question, next.responses[question.number]),
          expected: expectedLabel(group, question),
          isCorrect: Boolean(mark?.isCorrect),
          tag: questionTypeLabel(group),
        };
      }),
    });
  };

  const submitPart = async (part: IeltsListeningPart) => {
    if (!test || !progress || progress.submittedParts.includes(part.number)) return;
    const submittedParts = [...progress.submittedParts, part.number].sort((a, b) => a - b);
    let next: IeltsListeningProgress = { ...progress, submittedParts };
    if (isComplete(test, next)) {
      const raw = markTest(test, next.responses).filter(m => m.isCorrect).length;
      next = { ...next, rawScore: raw, band: bandForRaw(raw), completedAt: new Date() };
    }
    sessionParts.current.add(part.number);
    setProgress(next);
    writeDraft(draftStorageKey(draftKey, test.id), next.responses);
    recordActivity(next);
    if (next.mode === 'exam') {
      if (isComplete(test, next)) go({ test: test.id, view: 'results' });
      else go({ test: test.id, part: test.parts.find(p => !submittedParts.includes(p.number))!.number });
    } else if (isComplete(test, next)) {
      go({ test: test.id, view: 'results' });
    }
    await persist(next);
  };

  const doReset = async () => {
    if (!test) return;
    try {
      if (canSave) await resetProgress(test.id);
    } catch {
      setSaveError('Test sıfırlanamadı. Lütfen tekrar deneyin.');
      return;
    }
    clearDraft(draftStorageKey(draftKey, test.id));
    session.restart();
    sessionParts.current = new Set();
    setProgress(null);
    setConfirmReset(false);
    go({ test: test.id });
  };

  /* ───────────── views ───────────── */

  const header = (
    <div className="listening-header il-header">
      <div className="listening-title">
        <Headphones size={24} />
        <h2>Dinleme</h2>
      </div>
      <ListeningFormatTabs active="ielts" />
      <PageBack onClick={onClose} />
    </div>
  );

  let body: React.ReactNode;
  if (!test) {
    body = <TestList tests={tests} summaries={summaries} onOpen={id => go({ test: id })} />;
  } else if (loading) {
    body = <p className="il-status" role="status">İlerlemeniz yükleniyor…</p>;
  } else if (loadError) {
    body = <div className="il-alert" role="alert"><AlertCircle size={18} /><span>{loadError}</span><button type="button" className="il-btn" onClick={() => setLoadVersion(v => v + 1)}>Tekrar dene</button></div>;
  } else if (!progress) {
    body = <ModeChooser test={test} canSave={canSave} onBack={() => go({})} onStart={startTest} />;
  } else if (view === 'results' && isComplete(test, progress)) {
    body = (
      <Results
        test={test}
        progress={progress}
        confirmReset={confirmReset}
        onAskReset={() => setConfirmReset(true)}
        onCancelReset={() => setConfirmReset(false)}
        onReset={doReset}
        onReview={n => go({ test: test.id, part: n })}
        onBack={() => go({})}
      />
    );
  } else {
    const part = test.parts.find(p => p.number === partNumber) ?? test.parts[0];
    body = (
      <TestShell
        test={test}
        part={part}
        progress={progress}
        audio={audio[test.id]}
        onSelectPart={n => go({ test: test.id, part: n })}
        onShowResults={() => go({ test: test.id, view: 'results' })}
        onChange={updateResponse}
        onSubmit={submitPart}
        onBack={() => go({})}
        confirmReset={confirmReset}
        onAskReset={() => setConfirmReset(true)}
        onCancelReset={() => setConfirmReset(false)}
        onReset={doReset}
      />
    );
  }

  return (
    <div className="activity-page">
      <div className="listening-panel activity-panel il-panel" ref={topRef}>
        {header}
        <div className="listening-content">
          {!canSave && <p className="il-note" role="note"><Lock size={15} />Giriş yapmadınız: cevaplarınız kaydedilmeyecek ve öğretmeninizin raporunda görünmeyecek.</p>}
          {saveError && progress && (
            <div className="il-alert" role="alert"><AlertCircle size={18} /><span>{saveError}</span><button type="button" className="il-btn" disabled={saving} onClick={() => void persist(progress)}>Tekrar kaydet</button></div>
          )}
          {body}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════ list ═══════════════════════════════ */

function TestList({ tests, summaries, onOpen }: { tests: IeltsListeningTest[]; summaries: Record<string, IeltsListeningProgress | null>; onOpen: (id: string) => void }) {
  return (
    <div className="il-list">
      <div className="toefl-intro il-intro">
        <div>
          <span className="toefl-eyebrow">IELTS LISTENING · 4 PARTS · 40 QUESTIONS</span>
          <h3>Gerçek sınav formatında tam dinleme testleri.</h3>
          <p>Her test dört bölümden oluşur: günlük bir konuşma, bir konuşmacının anlattığı bilgi, öğrenciler arasında bir tartışma ve kısa bir ders. Kayıt sınavdaki gibi okuma süreleriyle ilerler; cevapları dinlerken yazarsınız. Band {TARGET_BAND} için 40 sorudan en az {rawForBand(TARGET_BAND)} doğru gerekir.</p>
        </div>
        <span className="toefl-practice-label">Yaklaşık 30 dakika</span>
      </div>
      <div className="test-grid il-test-grid">
        {tests.map(test => {
          const p = summaries[test.id];
          const complete = isComplete(test, p ?? null);
          const started = Boolean(p);
          return (
            <article key={test.id} className={`test-card il-card ${complete ? 'completed' : ''}`}>
              <div className="test-card-header">
                <span className={`il-level il-level-${test.difficulty}`}>{test.level}</span>
                {p && <span className="il-mode-chip">{MODE_LABEL[p.mode]}</span>}
                {complete && <span className="completed-badge"><Check size={16} /></span>}
              </div>
              <h3 className="test-card-title" lang="en">{test.title}</h3>
              <p className="toefl-card-context">{test.description}</p>
              <div className="test-card-meta">
                <span><Clock size={14} />~30 dk</span>
                <span><Target size={14} />40 soru</span>
                <span><Headphones size={14} />4 bölüm</span>
              </div>
              {complete && p?.rawScore !== undefined && (
                <p className="il-card-score"><strong>{p.rawScore}/40</strong> · tahmini band {formatBand(p.band ?? 0)}</p>
              )}
              {started && !complete && <p className="il-card-score">{p!.submittedParts.length}/4 bölüm tamamlandı</p>}
              <button type="button" className="start-btn" onClick={() => onOpen(test.id)}>
                <Headphones size={18} />
                <span>{complete ? 'Sonuçlar' : started ? 'Devam et' : 'Başla'}</span>
              </button>
            </article>
          );
        })}
      </div>
      <BandTable />
    </div>
  );
}

function BandTable() {
  const rows: Array<[string, string]> = [['39–40', '9.0'], ['35–38', '8.0–8.5'], ['30–34', '7.0–7.5'], ['26–29', '6.5'], ['23–25', '6.0'], ['18–22', '5.5'], ['16–17', '5.0'], ['13–15', '4.5']];
  return (
    <details className="il-bands">
      <summary>Doğru sayısı ve band karşılığı</summary>
      <table>
        <thead><tr><th scope="col">Doğru (40 üzerinden)</th><th scope="col">Band</th></tr></thead>
        <tbody>{rows.map(([raw, band]) => <tr key={raw} className={band === '6.5' ? 'is-target' : undefined}><td>{raw}</td><td>{band}</td></tr>)}</tbody>
      </table>
      <p>Bu testler gerçek sınavdan biraz daha kolay hazırlandı. Buradaki band, gerçek sınavda alacağınız puandan yaklaşık yarım band yüksek çıkabilir.</p>
    </details>
  );
}

/* ═══════════════════════════════ start ═══════════════════════════════ */

function ModeChooser({ test, canSave, onBack, onStart }: { test: IeltsListeningTest; canSave: boolean; onBack: () => void; onStart: (mode: IeltsListeningMode) => void }) {
  return (
    <div className="il-start">
      <button type="button" className="il-back" onClick={onBack}><ArrowLeft size={16} />Testler</button>
      <h3 lang="en">{test.title}</h3>
      <p className="il-start-lead">{test.description}</p>
      <div className="il-mode-grid">
        <button type="button" className="il-mode-card" onClick={() => onStart('practice')}>
          <span className="il-mode-icon"><GraduationCap size={22} /></span>
          <strong>Pratik modu <em>Önerilen</em></strong>
          <span>Kaydı durdurup geri sarabilir, yavaşlatabilirsiniz. Her bölümü bitirince cevaplarınızı, açıklamaları ve cevabın geçtiği yeri hemen görürsünüz. Strateji ipuçları açıktır.</span>
        </button>
        <button type="button" className="il-mode-card" onClick={() => onStart('exam')}>
          <span className="il-mode-icon"><Award size={22} /></span>
          <strong>Sınav modu</strong>
          <span>Gerçek sınav gibi: her bölümün kaydı bir kez çalar, geri saramazsınız ve bölümleri sırayla yaparsınız. Sonuçlar ve açıklamalar dört bölüm bitince açılır.</span>
        </button>
      </div>
      <ul className="il-start-notes">
        <li>Kulaklık kullanın ve sessiz bir yerde çalışın.</li>
        <li>Cevaplarınızı dinlerken yazın. Yazım hataları ve kelime sınırı sınavdaki gibi kontrol edilir; büyük/küçük harf önemli değildir.</li>
        <li>Yanlış cevap puan götürmez: hiçbir soruyu boş bırakmayın.</li>
        {!canSave && <li>Giriş yapmadığınız için sonuçlarınız kaydedilmeyecek.</li>}
      </ul>
    </div>
  );
}

/* ═══════════════════════════════ test ═══════════════════════════════ */

interface ShellProps {
  test: IeltsListeningTest;
  part: IeltsListeningPart;
  progress: IeltsListeningProgress;
  audio?: Record<number, IeltsPartAudio>;
  onSelectPart: (n: number) => void;
  onShowResults: () => void;
  onChange: (number: number, value: string) => void;
  onSubmit: (part: IeltsListeningPart) => Promise<void>;
  onBack: () => void;
  confirmReset: boolean;
  onAskReset: () => void;
  onCancelReset: () => void;
  onReset: () => void;
}

function TestShell({ test, part, progress, audio, onSelectPart, onShowResults, onChange, onSubmit, onBack, confirmReset, onAskReset, onCancelReset, onReset }: ShellProps) {
  const complete = isComplete(test, progress);
  const exam = progress.mode === 'exam';
  const firstOpen = test.parts.find(p => !progress.submittedParts.includes(p.number))?.number;
  // Exam mode goes in order; a part is open once every part before it is submitted.
  const canOpen = (n: number) => !exam || complete || progress.submittedParts.includes(n) || n === firstOpen;
  const current = canOpen(part.number) ? part : test.parts.find(p => p.number === firstOpen) ?? part;

  return (
    <div className="il-test">
      <div className="il-test-head">
        <button type="button" className="il-back" onClick={onBack}><ArrowLeft size={16} />Testler</button>
        <div className="il-test-title">
          <h3 lang="en">{test.title}</h3>
          <span className="il-mode-chip">{MODE_LABEL[progress.mode]}</span>
        </div>
        <nav className="il-part-tabs" aria-label="Bölümler">
          {test.parts.map(p => {
            const submitted = progress.submittedParts.includes(p.number);
            const showScore = submitted && (!exam || complete);
            const score = showScore ? markPart(p, progress.responses).filter(m => m.isCorrect).length : null;
            const [a, b] = partRange(p);
            return (
              <button
                key={p.number}
                type="button"
                className={`il-part-tab ${p.number === current.number ? 'is-active' : ''} ${submitted ? 'is-done' : ''}`}
                aria-current={p.number === current.number ? 'step' : undefined}
                aria-label={`Part ${p.number}, ${score !== null ? `${score}/${b - a + 1} doğru` : submitted ? 'bitti' : `sorular ${a}–${b}`}${canOpen(p.number) ? '' : ', kilitli'}`}
                disabled={!canOpen(p.number)}
                onClick={() => onSelectPart(p.number)}
              >
                <span className="il-part-name">Part {p.number}</span>
                <span className="il-part-sub">{score !== null ? `${score}/${b - a + 1} doğru` : submitted ? 'Bitti' : `Sorular ${a}–${b}`}</span>
              </button>
            );
          })}
          {complete && <button type="button" className="il-part-tab is-results" onClick={onShowResults}><span className="il-part-name">Sonuçlar</span><span className="il-part-sub">Toplam puan</span></button>}
        </nav>
      </div>
      <PartView key={`${test.id}-${current.number}`} test={test} part={current} progress={progress} partAudio={audio?.[current.number]} onChange={onChange} onSubmit={onSubmit} onSelectPart={onSelectPart} onShowResults={onShowResults} />
      <div className="il-test-foot">
        {confirmReset ? (
          <div className="il-confirm" role="alertdialog" aria-label="Testi sıfırla">
            <span>Bütün cevaplarınız silinecek ve test baştan başlayacak. Emin misiniz?</span>
            <button type="button" className="il-btn danger" onClick={onReset}>Evet, sıfırla</button>
            <button type="button" className="il-btn" onClick={onCancelReset}>Vazgeç</button>
          </div>
        ) : (
          <button type="button" className="il-link" onClick={onAskReset}><RotateCcw size={14} />Testi baştan başlat</button>
        )}
      </div>
    </div>
  );
}

interface PartViewProps {
  test: IeltsListeningTest;
  part: IeltsListeningPart;
  progress: IeltsListeningProgress;
  partAudio?: IeltsPartAudio;
  onChange: (number: number, value: string) => void;
  onSubmit: (part: IeltsListeningPart) => Promise<void>;
  onSelectPart: (n: number) => void;
  onShowResults: () => void;
}

function PartView({ test, part, progress, partAudio, onChange, onSubmit, onSelectPart, onShowResults }: PartViewProps) {
  const exam = progress.mode === 'exam';
  const complete = isComplete(test, progress);
  const submitted = progress.submittedParts.includes(part.number);
  const showFeedback = submitted && (!exam || complete);
  // Exam mode: the recording plays once, without seeking, until the whole test is finished.
  const freeAudio = !exam || complete;
  const audioAllowed = !submitted || freeAudio;
  const base = import.meta.env.BASE_URL;
  const audio = useIeltsAudio(partAudio && audioAllowed ? `${base}${partAudio.src}` : null);
  const [confirming, setConfirming] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const marks = useMemo(() => new Map<number, IeltsMark>(markPart(part, progress.responses).map(m => [m.number, m])), [part, progress.responses]);
  const refs = partQuestions(part);
  const [first, last] = partRange(part);
  const blanks = refs.filter(r => !(progress.responses[r.question.number] ?? '').trim()).length;
  const score = [...marks.values()].filter(m => m.isCorrect).length;
  const cues = partAudio?.cues ?? [];
  const lineCue = useCallback((id: string) => cues.find(c => c.id === id), [cues]);
  const currentCue: IeltsAudioCue | undefined = audio.state === 'idle' ? undefined : cues.find(c => audio.time >= c.start && audio.time < c.end);
  const finished = audio.state === 'ended';

  const playEvidence = (lineId: string, label: string) => {
    if (audio.excerpt === label && audio.state === 'playing') { audio.pause(); return; }
    const cue = lineCue(lineId);
    if (cue) void audio.playExcerpt(cue.start, cue.end, label);
  };

  const doSubmit = async () => {
    setConfirming(false);
    setSubmitting(true);
    audio.pause();
    try { await onSubmit(part); } finally { setSubmitting(false); }
  };

  const next = test.parts.find(p => p.number === part.number + 1);

  return (
    <div className="il-part">
      <p className="il-context" lang="en"><span>Part {part.number}</span>{part.context}</p>

      {audioAllowed && partAudio ? (
        <div className={`il-player ${exam && !freeAudio ? 'is-exam' : ''}`}>
          <div className="il-player-row">
            {audio.state === 'playing' || audio.state === 'loading' ? (
              <button type="button" className="il-play" aria-label="Duraklat" onClick={audio.pause}><Pause size={22} /></button>
            ) : (
              <button
                type="button"
                className="il-play"
                aria-label={audio.state === 'idle' ? 'Kaydı başlat' : 'Devam et'}
                disabled={exam && !freeAudio && finished}
                onClick={() => void (audio.state === 'idle' || (audio.state === 'ended' && freeAudio) ? audio.play() : audio.resume())}
              >
                <Play size={22} />
              </button>
            )}
            {freeAudio && (
              <>
                <button type="button" className="il-icon-btn" aria-label="5 saniye geri" title="5 saniye geri" onClick={() => audio.skip(-5)}><RotateCcw size={17} /><span>5</span></button>
                <input
                  className="il-seek"
                  type="range"
                  aria-label="Kayıtta ilerle"
                  min={0}
                  max={audio.duration || partAudio.duration}
                  step={0.1}
                  value={audio.time}
                  onChange={e => audio.seek(Number(e.target.value))}
                />
              </>
            )}
            {!freeAudio && (
              <div className="il-progress" aria-hidden="true"><span style={{ width: `${Math.min(100, (audio.time / (audio.duration || partAudio.duration)) * 100)}%` }} /></div>
            )}
            <span className="il-time">{formatTime(audio.time)} / {formatTime(audio.duration || partAudio.duration)}</span>
            {freeAudio && (
              <button type="button" className={`il-icon-btn ${audio.rate < 1 ? 'is-on' : ''}`} aria-pressed={audio.rate < 1} title="Yavaş dinle" onClick={() => audio.setRate(audio.rate < 1 ? 1 : 0.85)}>
                <Gauge size={17} /><span>{audio.rate < 1 ? '0.85×' : '1×'}</span>
              </button>
            )}
          </div>
          <div className="il-player-status" aria-live="polite">
            {currentCue?.kind === 'pause' && audio.state === 'playing' && (
              <span className="il-reading-time">
                <Clock size={14} /> Soruları okuma süresi: {formatTime(currentCue.end - audio.time)}
                {freeAudio && <button type="button" className="il-link" onClick={() => audio.seek(currentCue.end)}><SkipForward size={13} />Atla</button>}
              </span>
            )}
            {exam && !freeAudio && audio.state === 'idle' && <span>Sınav modu: kayıt bir kez çalar ve geri sarılamaz. Hazır olduğunuzda başlatın.</span>}
            {exam && !freeAudio && finished && <span>Kayıt bitti. Cevaplarınızı kontrol edip bölümü bitirin.</span>}
            {audio.state === 'loading' && <span>Ses yükleniyor…</span>}
            {audio.error && <span className="il-error">{audio.error}</span>}
          </div>
        </div>
      ) : !partAudio ? (
        <p className="il-alert" role="alert"><AlertCircle size={18} />Bu bölümün ses kaydı bulunamadı.</p>
      ) : (
        <p className="il-note"><Lock size={15} />Bu bölümü bitirdiniz. Sınav modunda cevaplar ve açıklamalar dört bölüm bitince açılır.</p>
      )}

      {showFeedback && (
        <div className="il-part-score">
          <strong>{score}/{last - first + 1}</strong> doğru
          <span>Yanlış cevaplarda “Cevabı dinle” ile kaydın ilgili yerini tekrar dinleyin.</span>
          <button type="button" className={`il-btn ${showTranscript ? 'is-on' : ''}`} aria-expanded={showTranscript} onClick={() => setShowTranscript(v => !v)}><FileText size={16} />Transkript</button>
        </div>
      )}
      {showFeedback && showTranscript && (
        <Transcript part={part} cues={cues} time={audio.time} playing={audio.state === 'playing'} onPlayLine={playEvidence} />
      )}

      <IeltsListeningSheet
        part={part}
        responses={progress.responses}
        onChange={onChange}
        locked={submitted}
        showFeedback={showFeedback}
        marks={marks}
        showTips={!exam}
        onPlayEvidence={showFeedback && partAudio ? playEvidence : undefined}
        playingExcerpt={audio.state === 'playing' ? audio.excerpt : null}
        figureBase={base}
      />

      <div className="il-submit-bar">
        {!submitted && !confirming && (
          <>
            <span>{refs.length - blanks}/{refs.length} soru cevaplandı</span>
            <button
              type="button"
              className="start-btn il-submit"
              disabled={submitting}
              onClick={() => (blanks > 0 || (exam && !finished && audio.state !== 'idle') ? setConfirming(true) : void doSubmit())}
            >
              {exam ? 'Bölümü bitir' : 'Cevapları kontrol et'} <ChevronRight size={18} />
            </button>
          </>
        )}
        {!submitted && confirming && (
          <div className="il-confirm" role="alertdialog" aria-label="Bölümü bitir">
            <span>
              {exam && !finished && audio.state !== 'idle' ? 'Kayıt henüz bitmedi. ' : ''}
              {blanks > 0 ? `${blanks} soru boş. ` : ''}Bitirdikten sonra bu bölümün cevaplarını değiştiremezsiniz.
            </span>
            <button type="button" className="il-btn primary" onClick={() => void doSubmit()}>Yine de bitir</button>
            <button type="button" className="il-btn" onClick={() => setConfirming(false)}>Vazgeç</button>
          </div>
        )}
        {submitted && (next ? (
          <button type="button" className="start-btn il-submit" onClick={() => onSelectPart(next.number)}>Part {next.number} <ChevronRight size={18} /></button>
        ) : complete ? (
          <button type="button" className="start-btn il-submit" onClick={onShowResults}><Award size={18} />Sonuçları gör</button>
        ) : null)}
      </div>
    </div>
  );
}

function Transcript({ part, cues, time, playing, onPlayLine }: { part: IeltsListeningPart; cues: IeltsAudioCue[]; time: number; playing: boolean; onPlayLine: (lineId: string, label: string) => void }) {
  // Which questions are answered in each line.
  const answeredIn = new Map<string, number[]>();
  for (const group of part.questionGroups) {
    if (group.type === 'mcq_multi') group.evidence.forEach(e => answeredIn.set(e.line, [...(answeredIn.get(e.line) ?? []), group.questions[0].number]));
    for (const q of group.questions) (q.evidence ?? []).forEach(e => answeredIn.set(e.line, [...(answeredIn.get(e.line) ?? []), q.number]));
  }
  const names = Object.fromEntries(part.speakers.map(s => [s.id, s.name]));
  return (
    <div className="il-transcript" lang="en">
      {part.script.map((seg, i) => {
        if (seg.kind === 'break') return <hr key={i} />;
        const cue = cues.find(c => c.id === seg.id);
        const active = playing && cue && time >= cue.start && time < cue.end;
        const qs = [...new Set(answeredIn.get(seg.id) ?? [])];
        return (
          <p key={seg.id} className={`${active ? 'is-active' : ''} ${qs.length ? 'has-answer' : ''}`}>
            {cue && <button type="button" className="il-line-play" aria-label="Bu satırı dinle" onClick={() => onPlayLine(seg.id, `line-${seg.id}`)}><Play size={12} /></button>}
            <strong>{names[seg.speaker] ?? seg.speaker}:</strong> {seg.text}
            {qs.map(n => <span key={n} className="il-line-q" lang="tr">S{n}</span>)}
          </p>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════ results ═══════════════════════════════ */

function Results({ test, progress, confirmReset, onAskReset, onCancelReset, onReset, onReview, onBack }: {
  test: IeltsListeningTest; progress: IeltsListeningProgress; confirmReset: boolean;
  onAskReset: () => void; onCancelReset: () => void; onReset: () => void; onReview: (part: number) => void; onBack: () => void;
}) {
  const marks = markTest(test, progress.responses);
  const byNumber = new Map(marks.map(m => [m.number, m]));
  const raw = marks.filter(m => m.isCorrect).length;
  const band = bandForRaw(raw);
  const target = rawForBand(TARGET_BAND);
  const refs = testQuestions(test);
  const types = new Map<string, { correct: number; total: number }>();
  refs.forEach(({ group, question }) => {
    const label = questionTypeLabel(group);
    const t = types.get(label) ?? { correct: 0, total: 0 };
    t.total++;
    if (byNumber.get(question.number)?.isCorrect) t.correct++;
    types.set(label, t);
  });
  const wrong = refs.filter(r => !byNumber.get(r.question.number)?.isCorrect);

  return (
    <div className="il-results">
      <button type="button" className="il-back" onClick={onBack}><ArrowLeft size={16} />Testler</button>
      <div className="il-score-hero">
        <div className="il-score-main">
          <span className="il-score-raw">{raw}<small>/40</small></span>
          <span className="il-score-band">Tahmini band <strong>{formatBand(band)}</strong></span>
        </div>
        <div className="il-target">
          <div className="il-target-bar" role="img" aria-label={`${raw} doğru; band ${TARGET_BAND} için ${target} doğru gerekir`}>
            <span className="il-target-fill" style={{ width: `${(raw / 40) * 100}%` }} />
            <span className="il-target-mark" style={{ left: `${(target / 40) * 100}%` }}><span>{TARGET_BAND}</span></span>
          </div>
          <p>{raw >= target
            ? `Band ${TARGET_BAND} için gereken ${target} doğruya ulaştınız.`
            : `Band ${TARGET_BAND} için ${target} doğru gerekiyor: ${target - raw} doğru daha.`}</p>
        </div>
        <p className="il-caveat">{MODE_LABEL[progress.mode]} · Bu testler gerçek sınavdan biraz kolay hazırlandı; gerçek sınavda band yaklaşık yarım puan düşük çıkabilir.</p>
      </div>

      <div className="il-result-grid">
        <section>
          <h4>Bölümler</h4>
          <ul className="il-part-scores">
            {test.parts.map(p => {
              const s = markPart(p, progress.responses).filter(m => m.isCorrect).length;
              const total = partQuestions(p).length;
              return (
                <li key={p.number}>
                  <button type="button" onClick={() => onReview(p.number)}>
                    <span>Part {p.number}</span>
                    <strong>{s}/{total}</strong>
                    <span className="il-mini-bar"><span style={{ width: `${(s / total) * 100}%` }} /></span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <section>
          <h4>Soru tipleri</h4>
          <ul className="il-type-scores">
            {[...types.entries()].map(([label, t]) => (
              <li key={label}>
                <span>{label}</span>
                <span className="il-mini-bar"><span style={{ width: `${(t.correct / t.total) * 100}%` }} /></span>
                <strong>{t.correct}/{t.total}</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {wrong.length > 0 && (
        <section className="il-wrong">
          <h4>Yanlış ya da boş cevaplar ({wrong.length})</h4>
          <ul>
            {wrong.map(({ part, group, question }) => (
              <li key={question.number}>
                <span className="il-qnum">{question.number}</span>
                <span className="il-wrong-text">
                  <span lang="en">{questionPrompt(group, question)}</span>
                  <small>Cevabınız: <span lang="en">{givenLabel(group, question, progress.responses[question.number])}</span> · Doğru: <span lang="en">{expectedLabel(group, question)}</span></small>
                </span>
                <button type="button" className="il-link" onClick={() => onReview(part.number)}><BookOpen size={14} />Part {part.number}’de incele</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="il-results-actions">
        {confirmReset ? (
          <div className="il-confirm" role="alertdialog" aria-label="Testi sıfırla">
            <span>Bütün cevaplarınız silinecek ve test baştan başlayacak. Emin misiniz?</span>
            <button type="button" className="il-btn danger" onClick={onReset}>Evet, sıfırla</button>
            <button type="button" className="il-btn" onClick={onCancelReset}>Vazgeç</button>
          </div>
        ) : (
          <>
            <button type="button" className="il-btn" onClick={onAskReset}><RefreshCw size={16} />Testi yeniden çöz</button>
            <button type="button" className="start-btn il-submit" onClick={() => onReview(1)}>Bölümleri incele <ChevronRight size={18} /></button>
          </>
        )}
      </div>
    </div>
  );
}
