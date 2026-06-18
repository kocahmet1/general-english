// Local Storage Service - Fallback when Firebase is not configured
import {
  Exam,
  Question,
  VocabWord,
  WritingPrompt,
} from '../types';
import { sampleExamQuestions, sampleExamName, sampleExamDescription } from '../data/sampleExam';

const EXAMS_KEY = 'english_master_exams';
const VOCAB_KEY = 'english_master_vocab';

// Check if Firebase is configured
export function isFirebaseConfigured(): boolean {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return Boolean(apiKey && apiKey !== 'your-api-key' && apiKey !== 'your-api-key-here');
}

// ===== EXAM FUNCTIONS =====

export function getLocalExams(): { id: string; name: string; description?: string; questionCount: number }[] {
  try {
    const stored = localStorage.getItem(EXAMS_KEY);
    if (!stored) {
      initializeSampleExam();
      return getLocalExams();
    }

    const exams: Exam[] = JSON.parse(stored);
    return exams.map(exam => ({
      id: exam.id,
      name: exam.name,
      description: exam.description,
      questionCount: exam.questions.length,
    }));
  } catch (error) {
    console.error('Error reading local exams:', error);
    return [];
  }
}

export function getLocalExamById(examId: string): Exam | null {
  try {
    const stored = localStorage.getItem(EXAMS_KEY);
    if (!stored) return null;

    const exams: Exam[] = JSON.parse(stored);
    const exam = exams.find(e => e.id === examId);

    if (!exam) return null;

    const seenIds = new Set<number>();
    let hasDuplicates = false;

    for (const question of exam.questions) {
      if (seenIds.has(question.id)) {
        hasDuplicates = true;
        break;
      }
      seenIds.add(question.id);
    }

    const questions = hasDuplicates
      ? exam.questions.map((question, index) => ({ ...question, id: index + 1 }))
      : exam.questions;

    if (hasDuplicates) {
      const updatedExams = exams.map(existingExam =>
        existingExam.id === examId ? { ...existingExam, questions } : existingExam,
      );
      localStorage.setItem(EXAMS_KEY, JSON.stringify(updatedExams));
    }

    return {
      ...exam,
      questions,
      createdAt: new Date(exam.createdAt),
    };
  } catch (error) {
    console.error('Error reading local exam:', error);
    return null;
  }
}

export function createLocalExam(name: string, description: string, questions: Question[]): string | null {
  try {
    const stored = localStorage.getItem(EXAMS_KEY);
    const exams: Exam[] = stored ? JSON.parse(stored) : [];

    const questionsWithUniqueIds = questions.map((question, index) => ({
      ...question,
      id: index + 1,
    }));

    const newExam: Exam = {
      id: `exam_${Date.now()}`,
      name,
      description,
      questions: questionsWithUniqueIds,
      createdAt: new Date(),
    };

    exams.unshift(newExam);
    localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));

    return newExam.id;
  } catch (error) {
    console.error('Error creating local exam:', error);
    return null;
  }
}

export function deleteLocalExam(examId: string): boolean {
  try {
    const stored = localStorage.getItem(EXAMS_KEY);
    if (!stored) return false;

    const exams: Exam[] = JSON.parse(stored);
    const filtered = exams.filter(exam => exam.id !== examId);
    localStorage.setItem(EXAMS_KEY, JSON.stringify(filtered));

    return true;
  } catch (error) {
    console.error('Error deleting local exam:', error);
    return false;
  }
}

function initializeSampleExam(): void {
  const sampleExam: Exam = {
    id: 'sample_exam_1',
    name: sampleExamName,
    description: sampleExamDescription,
    questions: sampleExamQuestions,
    createdAt: new Date(),
  };

  localStorage.setItem(EXAMS_KEY, JSON.stringify([sampleExam]));
}

// ===== VOCAB FUNCTIONS =====

export function getLocalVocabWords(): VocabWord[] {
  try {
    const stored = localStorage.getItem(VOCAB_KEY);
    if (!stored) return [];

    const words: VocabWord[] = JSON.parse(stored);
    return words.map(word => ({
      ...word,
      addedAt: new Date(word.addedAt),
    }));
  } catch (error) {
    console.error('Error reading local vocab:', error);
    return [];
  }
}

export function addLocalVocabWord(
  word: string,
  questionContext: string,
  examId: string,
  questionId: number,
): string | null {
  try {
    const stored = localStorage.getItem(VOCAB_KEY);
    const words: VocabWord[] = stored ? JSON.parse(stored) : [];

    const existing = words.find(existingWord => existingWord.word.toLowerCase() === word.toLowerCase());
    if (existing) return existing.id;

    const newWord: VocabWord = {
      id: `vocab_${Date.now()}`,
      word: word.toLowerCase(),
      questionContext,
      examId,
      questionId,
      addedAt: new Date(),
    };

    words.unshift(newWord);
    localStorage.setItem(VOCAB_KEY, JSON.stringify(words));

    return newWord.id;
  } catch (error) {
    console.error('Error adding local vocab word:', error);
    return null;
  }
}

export function removeLocalVocabWord(wordId: string): boolean {
  try {
    const stored = localStorage.getItem(VOCAB_KEY);
    if (!stored) return false;

    const words: VocabWord[] = JSON.parse(stored);
    const filtered = words.filter(word => word.id !== wordId);
    localStorage.setItem(VOCAB_KEY, JSON.stringify(filtered));

    return true;
  } catch (error) {
    console.error('Error removing local vocab word:', error);
    return false;
  }
}

// ===== WRITING PRACTICE FUNCTIONS =====

const DEFAULT_WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'prompt_1',
    type: 'topic',
    title: 'My Favorite Holiday',
    description: 'Write about your favorite holiday destination. Describe where it is, what you did there, and why it was special.',
    targetLevel: 'Intermediate',
    minWords: 100,
    maxWords: 200,
  },
  {
    id: 'prompt_2',
    type: 'topic',
    title: 'Technology in Education',
    description: 'Discuss how technology has changed education. What are the benefits and drawbacks of using technology in classrooms?',
    targetLevel: 'Upper Intermediate',
    minWords: 150,
    maxWords: 250,
  },
  {
    id: 'prompt_3',
    type: 'topic',
    title: 'A Person Who Inspires Me',
    description: 'Write about someone who has inspired you in your life. Explain who they are and how they have influenced you.',
    targetLevel: 'Intermediate',
    minWords: 100,
    maxWords: 200,
  },
  {
    id: 'prompt_4',
    type: 'sentence_correction',
    title: 'Daily Routine',
    description: 'Write a paragraph describing your typical day from morning to evening. Use present simple tense correctly.',
    targetLevel: 'Elementary',
    minWords: 80,
    maxWords: 150,
  },
  {
    id: 'prompt_5',
    type: 'paragraph',
    title: 'Environmental Problems',
    description: 'Write about an environmental problem that concerns you. Explain the causes, effects, and possible solutions.',
    targetLevel: 'Advanced',
    minWords: 200,
    maxWords: 300,
  },
  {
    id: 'prompt_6',
    type: 'topic',
    title: 'Benefits of Learning English',
    description: 'Explain why learning English is important and how it can benefit your career and personal life.',
    targetLevel: 'Pre-Intermediate',
    minWords: 100,
    maxWords: 180,
  },
  {
    id: 'prompt_7',
    type: 'free',
    title: 'Free Writing',
    description: 'Write about any topic you choose. Express your thoughts freely!',
    targetLevel: 'All Levels',
    minWords: 50,
  },
];

export function getWritingPrompts(): WritingPrompt[] {
  return DEFAULT_WRITING_PROMPTS;
}
