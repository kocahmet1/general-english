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
  grammarCategory?: GrammarCategory; // Track the grammar subject of the mistake
}

// Grammar categories for tracking student performance
export type GrammarCategory =
  | 'past_perfect'
  | 'present_perfect'
  | 'past_simple'
  | 'present_simple'
  | 'future_tenses'
  | 'continuous_tenses'
  | 'prepositions'
  | 'articles'
  | 'vocabulary'
  | 'phrasal_verbs'
  | 'conditionals'
  | 'modal_verbs'
  | 'gerunds_infinitives'
  | 'passive_voice'
  | 'relative_clauses'
  | 'reported_speech'
  | 'conjunctions'
  | 'idioms_expressions'
  | 'collocations'
  | 'comparatives_superlatives'
  | 'subject_verb_agreement'
  | 'pronouns'
  | 'word_order'
  | 'quantifiers'
  | 'other';

// Human-readable labels for grammar categories
export const GRAMMAR_CATEGORY_LABELS: Record<GrammarCategory, string> = {
  past_perfect: 'Past Perfect',
  present_perfect: 'Present Perfect',
  past_simple: 'Past Simple',
  present_simple: 'Present Simple',
  future_tenses: 'Future Tenses',
  continuous_tenses: 'Continuous Tenses',
  prepositions: 'Prepositions',
  articles: 'Articles (a, an, the)',
  vocabulary: 'Vocabulary / Word Choice',
  phrasal_verbs: 'Phrasal Verbs',
  conditionals: 'Conditionals (If clauses)',
  modal_verbs: 'Modal Verbs',
  gerunds_infinitives: 'Gerunds & Infinitives',
  passive_voice: 'Passive Voice',
  relative_clauses: 'Relative Clauses',
  reported_speech: 'Reported Speech',
  conjunctions: 'Conjunctions',
  idioms_expressions: 'Idioms & Expressions',
  collocations: 'Collocations',
  comparatives_superlatives: 'Comparatives & Superlatives',
  subject_verb_agreement: 'Subject-Verb Agreement',
  pronouns: 'Pronouns',
  word_order: 'Word Order',
  quantifiers: 'Quantifiers',
  other: 'Other'
};

// Record of a single mistake for tracking
export interface MistakeRecord {
  id: string;
  examId: string;
  questionId: number;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  grammarCategory: GrammarCategory;
  difficulty?: string;
  timestamp: Date;
}

// Aggregated performance statistics by category
export interface CategoryStats {
  category: GrammarCategory;
  totalMistakes: number;
  recentMistakes: number; // Last 7 days
  lastMistake?: Date;
}

// Overall performance summary
export interface PerformanceStats {
  totalAnswered: number;
  totalCorrect: number;
  totalIncorrect: number;
  categoryBreakdown: CategoryStats[];
  weakestAreas: GrammarCategory[]; // Top 5 problem areas
  strongestAreas: GrammarCategory[]; // Top 5 strongest areas
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


