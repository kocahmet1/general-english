// Marking for IELTS-format listening tests: typed answers (word limit, accepted
// alternatives, spelling/plural feedback), letter answers, "Choose TWO" pairs,
// and the raw score → band conversion used for Listening.
import type {
  IeltsAnswerKey,
  IeltsListeningPart,
  IeltsListeningQuestion,
  IeltsListeningTest,
  IeltsQuestionGroup,
  IeltsWordLimit,
} from '../types/ieltsListening';
import { normalizeAnswer } from './readingAnswers';

export type IeltsAnswerIssue = 'empty' | 'word_limit' | 'plural' | 'spelling';

export interface IeltsMark {
  number: number;
  isCorrect: boolean;
  given: string;
  issue?: IeltsAnswerIssue;
}

export interface IeltsQuestionRef {
  part: IeltsListeningPart;
  group: IeltsQuestionGroup;
  question: IeltsListeningQuestion;
}

/** Every question of a test in exam order (1–40). */
export function testQuestions(test: IeltsListeningTest): IeltsQuestionRef[] {
  return test.parts.flatMap(part => partQuestions(part));
}

export function partQuestions(part: IeltsListeningPart): IeltsQuestionRef[] {
  return part.questionGroups.flatMap(group => group.questions.map(question => ({ part, group, question })));
}

export function groupRange(group: IeltsQuestionGroup): [number, number] {
  const numbers = group.questions.map(q => q.number);
  return [Math.min(...numbers), Math.max(...numbers)];
}

export function partRange(part: IeltsListeningPart): [number, number] {
  const numbers = partQuestions(part).map(r => r.question.number);
  return [Math.min(...numbers), Math.max(...numbers)];
}

/* ───────────── typed answers ───────────── */

const NUMBER = /^\d[\d,.]*$/;

/** Case, spacing, punctuation, currency symbols and "9:30" vs "9.30" do not matter. */
export function canonicalAnswer(value: string): string {
  return normalizeAnswer(value.replace(/[£$€]/g, ''))
    .replace(/(\d):(\d)/g, '$1.$2')
    .replace(/^(the|a|an) /, '');
}

export function countWords(value: string): { words: number; numbers: number } {
  const tokens = normalizeAnswer(value.replace(/[£$€]/g, '')).split(' ').filter(Boolean);
  const numbers = tokens.filter(token => NUMBER.test(token)).length;
  return { words: tokens.length - numbers, numbers };
}

export function isOverWordLimit(value: string, limit?: IeltsWordLimit): boolean {
  if (!limit) return false;
  const { words, numbers } = countWords(value.replace(/^(the|a|an) /i, ''));
  if (limit.allowNumber) return words > limit.maxWords || numbers > 1;
  return words + numbers > limit.maxWords;
}

function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
}

export function markTextAnswer(answer: Extract<IeltsAnswerKey, { kind: 'text' }>, value: string, limit?: IeltsWordLimit): Omit<IeltsMark, 'number' | 'given'> {
  if (!value.trim()) return { isCorrect: false, issue: 'empty' };
  // Going over the word limit is wrong in the exam even when the right words are included.
  if (isOverWordLimit(value, limit)) return { isCorrect: false, issue: 'word_limit' };
  const given = canonicalAnswer(value);
  const accepted = answer.accepted.map(canonicalAnswer);
  if (accepted.includes(given)) return { isCorrect: true };
  const plural = accepted.some(a => [`${given}s`, `${given}es`].includes(a) || [`${a}s`, `${a}es`].includes(given));
  if (plural) return { isCorrect: false, issue: 'plural' };
  // Numbers, dates and times ('16th', '9.30') are either right or wrong; only words get the spelling hint.
  const nearMiss = !/\d/.test(given) && accepted.some(a => a.length >= 4 && !/\d/.test(a) && editDistance(given, a) <= (a.length >= 8 ? 2 : 1));
  return nearMiss ? { isCorrect: false, issue: 'spelling' } : { isCorrect: false };
}

/* ───────────── marking ───────────── */

export function markGroup(group: IeltsQuestionGroup, responses: Record<number, string>): IeltsMark[] {
  if (group.type === 'mcq_multi') {
    // Each correct letter earns one mark, in either answer box, but the same letter only counts once.
    const keys = group.answerKeys.map(k => k.toUpperCase());
    const used = new Set<string>();
    return group.questions.map(q => {
      const given = (responses[q.number] ?? '').trim().toUpperCase();
      const isCorrect = Boolean(given) && keys.includes(given) && !used.has(given);
      if (given) used.add(given);
      return { number: q.number, isCorrect, given, ...(given ? {} : { issue: 'empty' as const }) };
    });
  }
  return group.questions.map(q => {
    const given = responses[q.number] ?? '';
    const answer = q.answer;
    if (!answer) return { number: q.number, isCorrect: false, given };
    if (answer.kind === 'choice') {
      const isCorrect = given.trim().toUpperCase() === answer.key.toUpperCase();
      return { number: q.number, isCorrect, given, ...(given.trim() ? {} : { issue: 'empty' as const }) };
    }
    const limit = group.type === 'gap_fill' ? group.wordLimit : undefined;
    return { number: q.number, given, ...markTextAnswer(answer, given, limit) };
  });
}

export function markPart(part: IeltsListeningPart, responses: Record<number, string>): IeltsMark[] {
  return part.questionGroups.flatMap(group => markGroup(group, responses));
}

export function markTest(test: IeltsListeningTest, responses: Record<number, string>): IeltsMark[] {
  return test.parts.flatMap(part => markPart(part, responses));
}

/* ───────────── band conversion ───────────── */

/** IELTS Listening raw score → band (same table for Academic and General Training). */
export const LISTENING_BANDS: Array<[minRaw: number, band: number]> = [
  [39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5],
];

/** 0 when the raw score is below the lowest row of the table. */
export function bandForRaw(raw: number): number {
  return LISTENING_BANDS.find(([min]) => raw >= min)?.[1] ?? 0;
}

/** Fewest correct answers needed for a band, e.g. 26 for 6.5. */
export function rawForBand(band: number): number {
  return LISTENING_BANDS.find(([, b]) => b === band)?.[0] ?? 40;
}

export const formatBand = (band: number) => (band ? band.toFixed(1) : '<2.5');

/* ───────────── labels ───────────── */

export function questionTypeLabel(group: IeltsQuestionGroup): string {
  switch (group.type) {
    case 'gap_fill':
      if (group.boxOptions) return 'Akış şeması (kutudan)';
      return { form: 'Form tamamlama', notes: 'Not tamamlama', table: 'Tablo tamamlama', flowchart: 'Akış şeması', sentences: 'Cümle tamamlama' }[group.layout];
    case 'mcq_single':
      return 'Çoktan seçmeli';
    case 'mcq_multi':
      return 'İki seçenek (Choose TWO)';
    case 'matching':
      return group.variant === 'map' ? 'Harita / plan' : 'Eşleştirme';
  }
}

const GAP = /\{\{(\d+)\}\}/g;

/** The question as a single line for reports: "Date: Saturday ___ May", "What is the farm's main aim?" */
export function questionPrompt(group: IeltsQuestionGroup, question: IeltsListeningQuestion): string {
  if (group.type === 'mcq_multi') return group.prompt;
  if (question.prompt) return group.type === 'matching' && group.title ? `${group.title}: ${question.prompt}` : question.prompt;
  if (group.type !== 'gap_fill') return `Soru ${question.number}`;
  const token = `{{${question.number}}}`;
  const blank = (s: string) => s.replace(token, '___').replace(GAP, '…');
  const block = group.blocks?.find(b => 'value' in b ? b.value.includes(token) : 'text' in b && b.text.includes(token));
  if (block) return block.kind === 'field' ? `${block.label} ${blank(block.value)}` : blank(block.text);
  const table = group.table;
  if (table) {
    for (const row of table.rows) {
      const i = row.findIndex(cell => cell.includes(token));
      if (i >= 0) return `${row[0]} – ${table.columns[i]}: ${blank(row[i])}`;
    }
  }
  return `Soru ${question.number}`;
}

/** Letter → its text where the letter alone means little ("B) in 2005"); map letters stay bare. */
export function choiceLabel(group: IeltsQuestionGroup, question: IeltsListeningQuestion, letter: string): string {
  if (!letter) return '';
  const options =
    group.type === 'mcq_single' ? question.options :
    group.type === 'mcq_multi' ? group.options :
    group.type === 'matching' ? (group.variant === 'map' ? undefined : group.options) :
    group.boxOptions;
  const option = options?.find(o => o.key === letter.toUpperCase());
  return option ? `${option.key}) ${option.text}` : letter.toUpperCase();
}

export function expectedLabel(group: IeltsQuestionGroup, question: IeltsListeningQuestion): string {
  if (group.type === 'mcq_multi') return group.answerKeys.map(k => choiceLabel(group, question, k)).join(' · ');
  const answer = question.answer;
  if (!answer) return '';
  if (answer.kind === 'text') return answer.accepted[0];
  return choiceLabel(group, question, answer.key);
}

export function givenLabel(group: IeltsQuestionGroup, question: IeltsListeningQuestion, value: string | undefined): string {
  if (!value?.trim()) return '—';
  if (group.type === 'gap_fill' && !group.boxOptions) return value.trim();
  return choiceLabel(group, question, value.trim());
}
