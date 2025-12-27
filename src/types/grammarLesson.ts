// Grammar Lesson Types

export enum GrammarTopic {
  PresentTenses = 'present-tenses',
  PastTenses = 'past-tenses',
  FutureForms = 'future-forms',
  ModalVerbs = 'modal-verbs',
  Conditionals = 'conditionals',
  Prepositions = 'prepositions',
  Articles = 'articles',
  Comparatives = 'comparatives',
  PassiveVoice = 'passive-voice',
  ReportedSpeech = 'reported-speech',
  QuestionFormation = 'question-formation',
  PhrasalVerbs = 'phrasal-verbs'
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type ExerciseType =
  | 'fill-in-blank'
  | 'multiple-choice'
  | 'error-correction'
  | 'sentence-reorder';

export interface LessonSection {
  type: 'theory' | 'examples' | 'tips';
  title: string;
  content?: string;
  examples?: {
    sentence: string;
    highlight?: string;
    explanation: string;
  }[];
  tips?: string[];
}

export interface GrammarExercise {
  id: number;
  quizId: number; // Added to support multiple quizzes (1-4)
  type: ExerciseType;
  question: string;
  options?: string[]; // For multiple choice and fill-in-blank with dropdown
  correctAnswer: string | string[]; // Array for sentence reorder
  explanation: string;
  difficulty: Difficulty;
  hint?: string;
}

export interface GrammarLesson {
  topic: GrammarTopic;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: number; // in minutes
  icon: string; // emoji icon
  color: string; // theme color for the topic card
  sections: LessonSection[];
  exercises: GrammarExercise[];
}

export interface LessonProgress {
  topic: GrammarTopic;
  completed: boolean;
  score: number; // percentage
  attempts: number;
  correctAnswers: number;
  totalQuestions: number;
  lastAttemptDate: Date;
  exerciseResults: Map<number, boolean>; // exerciseId -> isCorrect
}

export interface GrammarLessonStats {
  totalLessonsCompleted: number;
  totalLessons: number;
  overallAccuracy: number;
  topicAccuracy: Map<GrammarTopic, number>;
  weakAreas: GrammarTopic[];
  strongAreas: GrammarTopic[];
  totalExercisesCompleted: number;
  currentStreak: number;
  lastPracticeDate: Date | null;
}

export interface ExerciseAnswer {
  exerciseId: number;
  userAnswer: string | string[];
  isCorrect: boolean;
  timestamp: Date;
}
