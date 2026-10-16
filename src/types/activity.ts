// One record per attempt at any exercise, stored in users/{uid}/activityLog/{id}.
// The admin "Öğrenci Raporu" view reads these to build per-student reports.

export type ActivityType =
  | 'exam'
  | 'grammar'
  | 'reading'
  | 'listening'
  | 'writing'
  | 'speaking'
  | 'sentenceLab';

export const ACTIVITY_TYPE_ORDER: ActivityType[] = [
  'exam', 'grammar', 'reading', 'listening', 'writing', 'speaking', 'sentenceLab',
];

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  exam: 'Sınav',
  grammar: 'Gramer',
  reading: 'Okuma',
  listening: 'Dinleme',
  writing: 'Yazma',
  speaking: 'Konuşma',
  sentenceLab: 'Sentence Lab',
};

export type ActivityStatus = 'completed' | 'in_progress';

export interface ActivityQuestionResult {
  prompt: string;
  given: string;
  expected?: string;
  isCorrect: boolean;
  /** Question type or topic, e.g. "Çıkarım" or "Past Simple". */
  tag?: string;
  /** Partial-credit score out of 100 where the module grades that way (Sentence Lab). */
  score?: number;
}

export interface ActivityDetail {
  label: string;
  value: string;
}

export interface ActivityRecord {
  id: string;
  type: ActivityType;
  title: string;
  subtitle?: string;
  /** Exam, passage, test, prompt or question id the attempt belongs to. */
  itemId?: string;
  /** Linked document in an older collection (writing submission, speaking session). */
  sourceId?: string;
  status: ActivityStatus;
  startedAt: Date;
  endedAt: Date;
  /** Active time in seconds; undefined for older records that never tracked time. */
  durationSeconds?: number;
  totalQuestions?: number;
  answeredCount?: number;
  correctCount?: number;
  /** 0-100. Share of answered questions that were correct, or the AI score for writing. */
  scorePercent?: number;
  /** Human-readable score, e.g. "Band 6.5" or "72/100". */
  scoreLabel?: string;
  /** IELTS band (speaking). */
  bandScore?: number;
  details?: ActivityDetail[];
  questions?: ActivityQuestionResult[];
  feedbackSummary?: string;
  /** Built in the admin view from collections written before the activity log existed. */
  legacy?: boolean;
}

/** What a module passes when it records an attempt; timing fields come from the session. */
export type ActivityInput = Omit<ActivityRecord, 'id' | 'startedAt' | 'endedAt' | 'durationSeconds' | 'legacy'>;
