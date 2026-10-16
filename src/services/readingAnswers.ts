// Answer checking and display for reading questions, including the IELTS formats
// (TRUE/FALSE/NOT GIVEN, matching with a shared list, typed completion answers).
import type {
  Option,
  ReadingAnswerFormat,
  ReadingPassage,
  ReadingQuestion,
  ReadingQuestionGroup,
} from '../types';

/** TRUE / FALSE / NOT GIVEN with a short Turkish reminder of what each one means. */
export const TFNG_OPTIONS: Option[] = [
  { letter: 'TRUE', text: 'Metin aynı bilgiyi veriyor' },
  { letter: 'FALSE', text: 'Metin bunun tersini söylüyor' },
  { letter: 'NOT GIVEN', text: 'Metinde bu konuda bilgi yok' },
];

export type ReadingAnswerIssue = 'word_limit' | 'plural' | 'spelling';

export interface ReadingAnswerResult {
  isCorrect: boolean;
  /** Why a typed answer was marked wrong, when there is a specific reason worth telling the student. */
  issue?: ReadingAnswerIssue;
}

export function getAnswerFormat(question: ReadingQuestion): ReadingAnswerFormat {
  return question.answerFormat ?? 'choice';
}

export function getQuestionGroup(passage: ReadingPassage, question: ReadingQuestion): ReadingQuestionGroup | undefined {
  if (!question.groupId) return undefined;
  return passage.questionGroups?.find(group => group.id === question.groupId);
}

/** The options a student chooses from: the question's own, the group's shared list, or TRUE/FALSE/NOT GIVEN. */
export function getQuestionOptions(passage: ReadingPassage, question: ReadingQuestion): Option[] {
  if (question.options.length > 0) return question.options;
  if (getAnswerFormat(question) === 'tfng') return TFNG_OPTIONS;
  return getQuestionGroup(passage, question)?.options ?? [];
}

/** 1-based question numbers covered by a group, e.g. [6, 9] for "Questions 6–9". */
export function getGroupRange(passage: ReadingPassage, groupId: string): [number, number] | null {
  const numbers = passage.questions
    .map((question, index) => (question.groupId === groupId ? index + 1 : null))
    .filter((n): n is number => n !== null);
  return numbers.length ? [numbers[0], numbers[numbers.length - 1]] : null;
}

const ARTICLE = /^(the|a|an) /;
const NUMBER = /^\d[\d,.]*$/;

export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[‐-―]/g, '-')
    .replace(/\s*-\s*/g, '-')
    .replace(/^[\s"'.,;:!?()]+|[\s"'.,;:!?()]+$/g, '')
    .replace(/\s+/g, ' ');
}

/** Words and numbers in an answer, counted the way IELTS word limits are. */
export function countAnswerWords(value: string): { words: number; numbers: number } {
  const tokens = normalizeAnswer(value).split(' ').filter(Boolean);
  const numbers = tokens.filter(token => NUMBER.test(token)).length;
  return { words: tokens.length - numbers, numbers };
}

export function isOverWordLimit(value: string, group?: ReadingQuestionGroup): boolean {
  if (!group?.maxWords) return false;
  const { words, numbers } = countAnswerWords(value);
  if (group.allowNumber) return words > group.maxWords || numbers > 1;
  return words + numbers > group.maxWords;
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

export function evaluateReadingAnswer(
  passage: ReadingPassage,
  question: ReadingQuestion,
  value: string
): ReadingAnswerResult {
  const format = getAnswerFormat(question);
  if (format !== 'text') {
    return { isCorrect: value.trim().toUpperCase() === question.correctAnswer.trim().toUpperCase() };
  }

  // Exceeding the word limit is marked wrong in the exam even if the right words are included.
  if (isOverWordLimit(value, getQuestionGroup(passage, question))) {
    return { isCorrect: false, issue: 'word_limit' };
  }

  // Answer keys treat a leading article as optional ("(the) microbes").
  const given = normalizeAnswer(value).replace(ARTICLE, '');
  const accepted = [question.correctAnswer, ...(question.acceptedAnswers ?? [])]
    .map(answer => normalizeAnswer(answer).replace(ARTICLE, ''));
  if (accepted.includes(given)) return { isCorrect: true };

  // Singular/plural and spelling slips are wrong in IELTS too, but deserve a more useful message.
  const pluralSlip = accepted.some(answer =>
    [`${given}s`, `${given}es`].includes(answer) || [`${answer}s`, `${answer}es`].includes(given)
  );
  if (pluralSlip) return { isCorrect: false, issue: 'plural' };

  const nearMiss = accepted.some(answer => {
    if (answer.length < 4 || NUMBER.test(answer)) return false;
    return editDistance(given, answer) <= (answer.length >= 8 ? 2 : 1);
  });
  return nearMiss ? { isCorrect: false, issue: 'spelling' } : { isCorrect: false };
}

/** Human-readable answer: "ii) A reward for a better idea", "NOT GIVEN", or the typed words. */
export function formatReadingAnswer(passage: ReadingPassage, question: ReadingQuestion, value: string | undefined): string {
  if (!value) return '';
  const format = getAnswerFormat(question);
  if (format !== 'choice') return value;
  const option = getQuestionOptions(passage, question).find(o => o.letter === value);
  return option ? `${option.letter}) ${option.text}` : value;
}
