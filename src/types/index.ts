// Types for the English Learning App

export interface Question {
  id: number;
  questionText: string;
  options: Option[];
  correctAnswer: string; // The letter (A, B, C, D)
  category?: string; // e.g., "vocabulary", "grammar", "idiom"
  difficulty?: string; // e.g., "Starter", "Elementary", "Intermediate", etc.
}

export interface Option {
  letter: string;
  text: string;
}

export interface Exam {
  id: string;
  name: string;
  description?: string;
  questions: Question[];
  createdAt: Date;
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  explanation?: string;
  isLoading?: boolean;
}

export interface VocabWord {
  id: string;
  word: string;
  questionContext: string;
  addedAt: Date;
  examId: string;
  questionId: number;
}

export interface ExamResult {
  examId: string;
  answers: UserAnswer[];
  score: number;
  totalQuestions: number;
  completedAt: Date;
}

// For parsing imported exams
export interface ParsedQuestion {
  number: number;
  text: string;
  options: { letter: string; text: string }[];
}

export interface ParsedExam {
  questions: ParsedQuestion[];
  answers: Record<number, string>;
}


