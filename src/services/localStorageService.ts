// Local Storage Service - Fallback when Firebase is not configured
import { 
  Exam, 
  Question, 
  VocabWord, 
  MistakeRecord, 
  GrammarCategory,
  CategoryStats,
  PerformanceStats,
  GRAMMAR_CATEGORY_LABELS,
  WritingSubmission,
  WritingPrompt,
  ReadingProgress,
  ReadingAnswer,
  ReadingStats,
  ReadingQuestionType,
  SpeakingSession,
  SpeakingStats,
  IELTSSpeakingSection,
  ListeningProgress,
  ListeningAnswer,
  ListeningStats,
  ListeningQuestionType,
  ListeningSession,
  IELTSListeningSection
} from '../types';
import { sampleExamQuestions, sampleExamName, sampleExamDescription } from '../data/sampleExam';

const EXAMS_KEY = 'english_master_exams';
const VOCAB_KEY = 'english_master_vocab';
const MISTAKES_KEY = 'english_master_mistakes';
const ANSWER_STATS_KEY = 'english_master_answer_stats';
const WRITING_SUBMISSIONS_KEY = 'english_master_writing_submissions';
const READING_PROGRESS_KEY = 'english_master_reading_progress';
const READING_STATS_KEY = 'english_master_reading_stats';
const SPEAKING_SESSIONS_KEY = 'english_master_speaking_sessions';
const SPEAKING_STATS_KEY = 'english_master_speaking_stats';

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
      // Initialize with sample exam
      initializeSampleExam();
      return getLocalExams();
    }
    
    const exams: Exam[] = JSON.parse(stored);
    return exams.map(exam => ({
      id: exam.id,
      name: exam.name,
      description: exam.description,
      questionCount: exam.questions.length
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
    
    if (exam) {
      return {
        ...exam,
        createdAt: new Date(exam.createdAt)
      };
    }
    return null;
  } catch (error) {
    console.error('Error reading local exam:', error);
    return null;
  }
}

export function createLocalExam(name: string, description: string, questions: Question[]): string | null {
  try {
    const stored = localStorage.getItem(EXAMS_KEY);
    const exams: Exam[] = stored ? JSON.parse(stored) : [];
    
    const newExam: Exam = {
      id: `exam_${Date.now()}`,
      name,
      description,
      questions,
      createdAt: new Date()
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
    const filtered = exams.filter(e => e.id !== examId);
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
    createdAt: new Date()
  };
  
  localStorage.setItem(EXAMS_KEY, JSON.stringify([sampleExam]));
}

// ===== VOCAB FUNCTIONS =====

export function getLocalVocabWords(): VocabWord[] {
  try {
    const stored = localStorage.getItem(VOCAB_KEY);
    if (!stored) return [];
    
    const words: VocabWord[] = JSON.parse(stored);
    return words.map(w => ({
      ...w,
      addedAt: new Date(w.addedAt)
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
  questionId: number
): string | null {
  try {
    const stored = localStorage.getItem(VOCAB_KEY);
    const words: VocabWord[] = stored ? JSON.parse(stored) : [];
    
    // Check if word already exists
    const existing = words.find(w => w.word.toLowerCase() === word.toLowerCase());
    if (existing) return existing.id;
    
    const newWord: VocabWord = {
      id: `vocab_${Date.now()}`,
      word: word.toLowerCase(),
      questionContext,
      examId,
      questionId,
      addedAt: new Date()
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
    const filtered = words.filter(w => w.id !== wordId);
    localStorage.setItem(VOCAB_KEY, JSON.stringify(filtered));
    
    return true;
  } catch (error) {
    console.error('Error removing local vocab word:', error);
    return false;
  }
}

// ===== MISTAKE TRACKING FUNCTIONS =====

interface AnswerStats {
  totalAnswered: number;
  totalCorrect: number;
  totalIncorrect: number;
}

// Get all mistake records
export function getMistakeRecords(): MistakeRecord[] {
  try {
    const stored = localStorage.getItem(MISTAKES_KEY);
    if (!stored) return [];
    
    const mistakes: MistakeRecord[] = JSON.parse(stored);
    return mistakes.map(m => ({
      ...m,
      timestamp: new Date(m.timestamp)
    }));
  } catch (error) {
    console.error('Error reading mistake records:', error);
    return [];
  }
}

// Add a new mistake record
export function addMistakeRecord(
  examId: string,
  questionId: number,
  questionText: string,
  selectedAnswer: string,
  correctAnswer: string,
  grammarCategory: GrammarCategory,
  difficulty?: string
): string | null {
  try {
    const stored = localStorage.getItem(MISTAKES_KEY);
    const mistakes: MistakeRecord[] = stored ? JSON.parse(stored) : [];
    
    const newMistake: MistakeRecord = {
      id: `mistake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      examId,
      questionId,
      questionText,
      selectedAnswer,
      correctAnswer,
      grammarCategory,
      difficulty,
      timestamp: new Date()
    };
    
    mistakes.unshift(newMistake);
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
    
    return newMistake.id;
  } catch (error) {
    console.error('Error adding mistake record:', error);
    return null;
  }
}

// Get answer statistics
export function getAnswerStats(): AnswerStats {
  try {
    const stored = localStorage.getItem(ANSWER_STATS_KEY);
    if (!stored) {
      return { totalAnswered: 0, totalCorrect: 0, totalIncorrect: 0 };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading answer stats:', error);
    return { totalAnswered: 0, totalCorrect: 0, totalIncorrect: 0 };
  }
}

// Update answer statistics
export function updateAnswerStats(isCorrect: boolean): void {
  try {
    const stats = getAnswerStats();
    stats.totalAnswered += 1;
    if (isCorrect) {
      stats.totalCorrect += 1;
    } else {
      stats.totalIncorrect += 1;
    }
    localStorage.setItem(ANSWER_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error updating answer stats:', error);
  }
}

// Get comprehensive performance statistics
export function getPerformanceStats(): PerformanceStats {
  try {
    const mistakes = getMistakeRecords();
    const answerStats = getAnswerStats();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Calculate category breakdown
    const categoryMap = new Map<GrammarCategory, CategoryStats>();
    
    // Initialize all categories
    const allCategories = Object.keys(GRAMMAR_CATEGORY_LABELS) as GrammarCategory[];
    allCategories.forEach(cat => {
      categoryMap.set(cat, {
        category: cat,
        totalMistakes: 0,
        recentMistakes: 0,
        lastMistake: undefined
      });
    });
    
    // Count mistakes per category
    mistakes.forEach(mistake => {
      const catStats = categoryMap.get(mistake.grammarCategory);
      if (catStats) {
        catStats.totalMistakes += 1;
        
        const mistakeDate = new Date(mistake.timestamp);
        if (mistakeDate >= sevenDaysAgo) {
          catStats.recentMistakes += 1;
        }
        
        if (!catStats.lastMistake || mistakeDate > catStats.lastMistake) {
          catStats.lastMistake = mistakeDate;
        }
      }
    });
    
    const categoryBreakdown = Array.from(categoryMap.values())
      .filter(c => c.totalMistakes > 0)
      .sort((a, b) => b.totalMistakes - a.totalMistakes);
    
    // Determine weakest areas (most mistakes)
    const weakestAreas = categoryBreakdown
      .slice(0, 5)
      .map(c => c.category);
    
    // Determine strongest areas (categories answered but with fewest mistakes)
    // For simplicity, we'll consider categories with mistakes but lowest count
    const strongestAreas = categoryBreakdown
      .slice(-5)
      .reverse()
      .map(c => c.category);
    
    return {
      totalAnswered: answerStats.totalAnswered,
      totalCorrect: answerStats.totalCorrect,
      totalIncorrect: answerStats.totalIncorrect,
      categoryBreakdown,
      weakestAreas,
      strongestAreas
    };
  } catch (error) {
    console.error('Error calculating performance stats:', error);
    return {
      totalAnswered: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      categoryBreakdown: [],
      weakestAreas: [],
      strongestAreas: []
    };
  }
}

// Clear all tracking data
export function clearTrackingData(): void {
  try {
    localStorage.removeItem(MISTAKES_KEY);
    localStorage.removeItem(ANSWER_STATS_KEY);
  } catch (error) {
    console.error('Error clearing tracking data:', error);
  }
}

// Get mistakes by category
export function getMistakesByCategory(category: GrammarCategory): MistakeRecord[] {
  const mistakes = getMistakeRecords();
  return mistakes.filter(m => m.grammarCategory === category);
}

// Get recent mistakes (last N days)
export function getRecentMistakes(days: number = 7): MistakeRecord[] {
  const mistakes = getMistakeRecords();
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return mistakes.filter(m => new Date(m.timestamp) >= cutoff);
}

// ===== WRITING PRACTICE FUNCTIONS =====

// Default writing prompts
export const DEFAULT_WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'prompt_1',
    type: 'topic',
    title: 'My Favorite Holiday',
    description: 'Write about your favorite holiday destination. Describe where it is, what you did there, and why it was special.',
    targetLevel: 'Intermediate',
    minWords: 100,
    maxWords: 200
  },
  {
    id: 'prompt_2',
    type: 'topic',
    title: 'Technology in Education',
    description: 'Discuss how technology has changed education. What are the benefits and drawbacks of using technology in classrooms?',
    targetLevel: 'Upper Intermediate',
    minWords: 150,
    maxWords: 250
  },
  {
    id: 'prompt_3',
    type: 'topic',
    title: 'A Person Who Inspires Me',
    description: 'Write about someone who has inspired you in your life. Explain who they are and how they have influenced you.',
    targetLevel: 'Intermediate',
    minWords: 100,
    maxWords: 200
  },
  {
    id: 'prompt_4',
    type: 'sentence_correction',
    title: 'Daily Routine',
    description: 'Write a paragraph describing your typical day from morning to evening. Use present simple tense correctly.',
    targetLevel: 'Elementary',
    minWords: 80,
    maxWords: 150
  },
  {
    id: 'prompt_5',
    type: 'paragraph',
    title: 'Environmental Problems',
    description: 'Write about an environmental problem that concerns you. Explain the causes, effects, and possible solutions.',
    targetLevel: 'Advanced',
    minWords: 200,
    maxWords: 300
  },
  {
    id: 'prompt_6',
    type: 'topic',
    title: 'Benefits of Learning English',
    description: 'Explain why learning English is important and how it can benefit your career and personal life.',
    targetLevel: 'Pre-Intermediate',
    minWords: 100,
    maxWords: 180
  },
  {
    id: 'prompt_7',
    type: 'free',
    title: 'Free Writing',
    description: 'Write about any topic you choose. Express your thoughts freely!',
    targetLevel: 'All Levels',
    minWords: 50
  }
];

// Get all writing submissions
export function getWritingSubmissions(): WritingSubmission[] {
  try {
    const stored = localStorage.getItem(WRITING_SUBMISSIONS_KEY);
    if (!stored) return [];
    
    const submissions: WritingSubmission[] = JSON.parse(stored);
    return submissions.map(s => ({
      ...s,
      submittedAt: new Date(s.submittedAt)
    }));
  } catch (error) {
    console.error('Error reading writing submissions:', error);
    return [];
  }
}

// Get a single writing submission by ID
export function getWritingSubmissionById(submissionId: string): WritingSubmission | null {
  try {
    const submissions = getWritingSubmissions();
    return submissions.find(s => s.id === submissionId) || null;
  } catch (error) {
    console.error('Error reading writing submission:', error);
    return null;
  }
}

// Save a new writing submission
export function saveWritingSubmission(submission: Omit<WritingSubmission, 'id' | 'submittedAt'>): string | null {
  try {
    const stored = localStorage.getItem(WRITING_SUBMISSIONS_KEY);
    const submissions: WritingSubmission[] = stored ? JSON.parse(stored) : [];
    
    const newSubmission: WritingSubmission = {
      ...submission,
      id: `writing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date()
    };
    
    submissions.unshift(newSubmission);
    localStorage.setItem(WRITING_SUBMISSIONS_KEY, JSON.stringify(submissions));
    
    return newSubmission.id;
  } catch (error) {
    console.error('Error saving writing submission:', error);
    return null;
  }
}

// Update a writing submission with feedback
export function updateWritingSubmission(submissionId: string, updates: Partial<WritingSubmission>): boolean {
  try {
    const stored = localStorage.getItem(WRITING_SUBMISSIONS_KEY);
    if (!stored) return false;
    
    const submissions: WritingSubmission[] = JSON.parse(stored);
    const index = submissions.findIndex(s => s.id === submissionId);
    
    if (index === -1) return false;
    
    submissions[index] = { ...submissions[index], ...updates };
    localStorage.setItem(WRITING_SUBMISSIONS_KEY, JSON.stringify(submissions));
    
    return true;
  } catch (error) {
    console.error('Error updating writing submission:', error);
    return false;
  }
}

// Delete a writing submission
export function deleteWritingSubmission(submissionId: string): boolean {
  try {
    const stored = localStorage.getItem(WRITING_SUBMISSIONS_KEY);
    if (!stored) return false;
    
    const submissions: WritingSubmission[] = JSON.parse(stored);
    const filtered = submissions.filter(s => s.id !== submissionId);
    localStorage.setItem(WRITING_SUBMISSIONS_KEY, JSON.stringify(filtered));
    
    return true;
  } catch (error) {
    console.error('Error deleting writing submission:', error);
    return false;
  }
}

// Clear all writing submissions
export function clearWritingSubmissions(): void {
  try {
    localStorage.removeItem(WRITING_SUBMISSIONS_KEY);
  } catch (error) {
    console.error('Error clearing writing submissions:', error);
  }
}

// Get writing prompts
export function getWritingPrompts(): WritingPrompt[] {
  return DEFAULT_WRITING_PROMPTS;
}

// ===== READING COMPREHENSION FUNCTIONS =====

// Serializable version of ReadingProgress for storage
interface StoredReadingProgress {
  passageId: string;
  answers: Record<number, ReadingAnswer>;
  startedAt: string;
  completedAt?: string;
  score?: number;
}

// Get all reading progress records
export function getAllReadingProgress(): ReadingProgress[] {
  try {
    const stored = localStorage.getItem(READING_PROGRESS_KEY);
    if (!stored) return [];
    
    const progressList: StoredReadingProgress[] = JSON.parse(stored);
    return progressList.map(p => ({
      ...p,
      answers: new Map(Object.entries(p.answers).map(([k, v]) => [parseInt(k), v])),
      startedAt: new Date(p.startedAt),
      completedAt: p.completedAt ? new Date(p.completedAt) : undefined
    }));
  } catch (error) {
    console.error('Error reading reading progress:', error);
    return [];
  }
}

// Get reading progress for a specific passage
export function getReadingProgress(passageId: string): ReadingProgress | null {
  try {
    const allProgress = getAllReadingProgress();
    return allProgress.find(p => p.passageId === passageId) || null;
  } catch (error) {
    console.error('Error reading reading progress:', error);
    return null;
  }
}

// Save or update reading progress
export function saveReadingProgress(progress: ReadingProgress): boolean {
  try {
    const stored = localStorage.getItem(READING_PROGRESS_KEY);
    const progressList: StoredReadingProgress[] = stored ? JSON.parse(stored) : [];
    
    // Convert Map to object for storage
    const answersObj: Record<number, ReadingAnswer> = {};
    if (progress.answers instanceof Map) {
      progress.answers.forEach((value, key) => {
        answersObj[key] = value;
      });
    } else {
      Object.assign(answersObj, progress.answers);
    }
    
    const storedProgress: StoredReadingProgress = {
      passageId: progress.passageId,
      answers: answersObj,
      startedAt: progress.startedAt.toISOString(),
      completedAt: progress.completedAt?.toISOString(),
      score: progress.score
    };
    
    const existingIndex = progressList.findIndex(p => p.passageId === progress.passageId);
    
    if (existingIndex >= 0) {
      progressList[existingIndex] = storedProgress;
    } else {
      progressList.unshift(storedProgress);
    }
    
    localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify(progressList));
    return true;
  } catch (error) {
    console.error('Error saving reading progress:', error);
    return false;
  }
}

// Delete reading progress for a passage
export function deleteReadingProgress(passageId: string): boolean {
  try {
    const stored = localStorage.getItem(READING_PROGRESS_KEY);
    if (!stored) return false;
    
    const progressList: StoredReadingProgress[] = JSON.parse(stored);
    const filtered = progressList.filter(p => p.passageId !== passageId);
    localStorage.setItem(READING_PROGRESS_KEY, JSON.stringify(filtered));
    
    return true;
  } catch (error) {
    console.error('Error deleting reading progress:', error);
    return false;
  }
}

// Clear all reading progress
export function clearReadingProgress(): void {
  try {
    localStorage.removeItem(READING_PROGRESS_KEY);
    localStorage.removeItem(READING_STATS_KEY);
  } catch (error) {
    console.error('Error clearing reading progress:', error);
  }
}

// Get reading statistics
export function getReadingStats(): ReadingStats {
  try {
    const stored = localStorage.getItem(READING_STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Return default stats
    return {
      totalPassagesCompleted: 0,
      totalQuestionsAnswered: 0,
      totalCorrect: 0,
      averageScore: 0,
      passagesByDifficulty: {},
      questionTypePerformance: {} as Record<ReadingQuestionType, { correct: number; total: number }>
    };
  } catch (error) {
    console.error('Error reading reading stats:', error);
    return {
      totalPassagesCompleted: 0,
      totalQuestionsAnswered: 0,
      totalCorrect: 0,
      averageScore: 0,
      passagesByDifficulty: {},
      questionTypePerformance: {} as Record<ReadingQuestionType, { correct: number; total: number }>
    };
  }
}

// Update reading statistics
export function updateReadingStats(
  passageCompleted: boolean,
  difficulty: string,
  questionsAnswered: number,
  correctAnswers: number,
  questionTypeResults: Record<ReadingQuestionType, { correct: number; total: number }>
): void {
  try {
    const stats = getReadingStats();
    
    if (passageCompleted) {
      stats.totalPassagesCompleted += 1;
      stats.passagesByDifficulty[difficulty] = (stats.passagesByDifficulty[difficulty] || 0) + 1;
    }
    
    stats.totalQuestionsAnswered += questionsAnswered;
    stats.totalCorrect += correctAnswers;
    
    // Update average score
    if (stats.totalQuestionsAnswered > 0) {
      stats.averageScore = Math.round((stats.totalCorrect / stats.totalQuestionsAnswered) * 100);
    }
    
    // Update question type performance
    for (const [type, results] of Object.entries(questionTypeResults)) {
      const qType = type as ReadingQuestionType;
      if (!stats.questionTypePerformance[qType]) {
        stats.questionTypePerformance[qType] = { correct: 0, total: 0 };
      }
      stats.questionTypePerformance[qType].correct += results.correct;
      stats.questionTypePerformance[qType].total += results.total;
    }
    
    localStorage.setItem(READING_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error updating reading stats:', error);
  }
}

// Get completed passage IDs
export function getCompletedPassageIds(): string[] {
  try {
    const allProgress = getAllReadingProgress();
    return allProgress
      .filter(p => p.completedAt !== undefined)
      .map(p => p.passageId);
  } catch (error) {
    console.error('Error getting completed passages:', error);
    return [];
  }
}

// ===== SPEAKING PRACTICE FUNCTIONS =====

// Serializable version of SpeakingSession for storage
interface StoredSpeakingSession {
  id: string;
  questionId: string;
  question: SpeakingSession['question'];
  audioUrl?: string;
  feedback?: SpeakingSession['feedback'];
  duration: number;
  startedAt: string;
  completedAt?: string;
}

// Get all speaking sessions
export function getSpeakingSessions(): SpeakingSession[] {
  try {
    const stored = localStorage.getItem(SPEAKING_SESSIONS_KEY);
    if (!stored) return [];
    
    const sessions: StoredSpeakingSession[] = JSON.parse(stored);
    return sessions.map(s => ({
      ...s,
      startedAt: new Date(s.startedAt),
      completedAt: s.completedAt ? new Date(s.completedAt) : undefined
    }));
  } catch (error) {
    console.error('Error reading speaking sessions:', error);
    return [];
  }
}

// Get a single speaking session by ID
export function getSpeakingSessionById(sessionId: string): SpeakingSession | null {
  try {
    const sessions = getSpeakingSessions();
    return sessions.find(s => s.id === sessionId) || null;
  } catch (error) {
    console.error('Error reading speaking session:', error);
    return null;
  }
}

// Save a new speaking session
export function saveSpeakingSession(session: Omit<SpeakingSession, 'id'>): string | null {
  try {
    const stored = localStorage.getItem(SPEAKING_SESSIONS_KEY);
    const sessions: StoredSpeakingSession[] = stored ? JSON.parse(stored) : [];
    
    const newSession: StoredSpeakingSession = {
      ...session,
      id: `speaking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startedAt: session.startedAt.toISOString(),
      completedAt: session.completedAt?.toISOString()
    };
    
    sessions.unshift(newSession);
    
    // Keep only the last 50 sessions to manage storage
    const trimmedSessions = sessions.slice(0, 50);
    localStorage.setItem(SPEAKING_SESSIONS_KEY, JSON.stringify(trimmedSessions));
    
    return newSession.id;
  } catch (error) {
    console.error('Error saving speaking session:', error);
    return null;
  }
}

// Update a speaking session with feedback
export function updateSpeakingSession(sessionId: string, updates: Partial<SpeakingSession>): boolean {
  try {
    const stored = localStorage.getItem(SPEAKING_SESSIONS_KEY);
    if (!stored) return false;
    
    const sessions: StoredSpeakingSession[] = JSON.parse(stored);
    const index = sessions.findIndex(s => s.id === sessionId);
    
    if (index === -1) return false;
    
    // Extract and convert Date fields, keep other fields
    const { startedAt, completedAt, ...restUpdates } = updates;
    const updateData: Partial<StoredSpeakingSession> = {
      ...restUpdates,
      ...(startedAt && { startedAt: startedAt.toISOString() }),
      ...(completedAt && { completedAt: completedAt.toISOString() })
    };
    
    sessions[index] = { ...sessions[index], ...updateData };
    localStorage.setItem(SPEAKING_SESSIONS_KEY, JSON.stringify(sessions));
    
    return true;
  } catch (error) {
    console.error('Error updating speaking session:', error);
    return false;
  }
}

// Delete a speaking session
export function deleteSpeakingSession(sessionId: string): boolean {
  try {
    const stored = localStorage.getItem(SPEAKING_SESSIONS_KEY);
    if (!stored) return false;
    
    const sessions: StoredSpeakingSession[] = JSON.parse(stored);
    const filtered = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(SPEAKING_SESSIONS_KEY, JSON.stringify(filtered));
    
    return true;
  } catch (error) {
    console.error('Error deleting speaking session:', error);
    return false;
  }
}

// Get speaking statistics
export function getSpeakingStats(): SpeakingStats {
  try {
    const stored = localStorage.getItem(SPEAKING_STATS_KEY);
    if (stored) {
      const stats = JSON.parse(stored);
      // Convert recentSessions dates
      stats.recentSessions = stats.recentSessions?.map((s: StoredSpeakingSession) => ({
        ...s,
        startedAt: new Date(s.startedAt),
        completedAt: s.completedAt ? new Date(s.completedAt) : undefined
      })) || [];
      return stats;
    }
    
    // Return default stats
    return {
      totalSessions: 0,
      averageBandScore: 0,
      averageFluencyScore: 0,
      averageVocabularyScore: 0,
      averageGrammarScore: 0,
      averagePronunciationScore: 0,
      sessionsBySection: {
        section1: 0,
        section2: 0,
        section3: 0
      },
      recentSessions: []
    };
  } catch (error) {
    console.error('Error reading speaking stats:', error);
    return {
      totalSessions: 0,
      averageBandScore: 0,
      averageFluencyScore: 0,
      averageVocabularyScore: 0,
      averageGrammarScore: 0,
      averagePronunciationScore: 0,
      sessionsBySection: {
        section1: 0,
        section2: 0,
        section3: 0
      },
      recentSessions: []
    };
  }
}

// Update speaking statistics
export function updateSpeakingStats(_session: SpeakingSession): void {
  try {
    const stats = getSpeakingStats();
    const sessions = getSpeakingSessions();
    
    // Calculate new stats from all completed sessions with feedback
    const completedSessions = sessions.filter(s => s.feedback && s.feedback.overallBandScore > 0);
    
    if (completedSessions.length > 0) {
      const totalBand = completedSessions.reduce((sum, s) => sum + (s.feedback?.overallBandScore || 0), 0);
      const totalFluency = completedSessions.reduce((sum, s) => sum + (s.feedback?.fluencyScore || 0), 0);
      const totalVocab = completedSessions.reduce((sum, s) => sum + (s.feedback?.vocabularyScore || 0), 0);
      const totalGrammar = completedSessions.reduce((sum, s) => sum + (s.feedback?.grammarScore || 0), 0);
      const totalPronunciation = completedSessions.reduce((sum, s) => sum + (s.feedback?.pronunciationScore || 0), 0);
      
      stats.totalSessions = completedSessions.length;
      stats.averageBandScore = Math.round((totalBand / completedSessions.length) * 10) / 10;
      stats.averageFluencyScore = Math.round((totalFluency / completedSessions.length) * 10) / 10;
      stats.averageVocabularyScore = Math.round((totalVocab / completedSessions.length) * 10) / 10;
      stats.averageGrammarScore = Math.round((totalGrammar / completedSessions.length) * 10) / 10;
      stats.averagePronunciationScore = Math.round((totalPronunciation / completedSessions.length) * 10) / 10;
      
      // Count sessions by section
      stats.sessionsBySection = {
        section1: completedSessions.filter(s => s.question.section === 'section1').length,
        section2: completedSessions.filter(s => s.question.section === 'section2').length,
        section3: completedSessions.filter(s => s.question.section === 'section3').length
      };
      
      // Get recent sessions (last 10)
      stats.recentSessions = completedSessions.slice(0, 10);
    }
    
    localStorage.setItem(SPEAKING_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error updating speaking stats:', error);
  }
}

// Clear all speaking data
export function clearSpeakingData(): void {
  try {
    localStorage.removeItem(SPEAKING_SESSIONS_KEY);
    localStorage.removeItem(SPEAKING_STATS_KEY);
  } catch (error) {
    console.error('Error clearing speaking data:', error);
  }
}

// Get sessions by section
export function getSpeakingSessionsBySection(section: IELTSSpeakingSection): SpeakingSession[] {
  const sessions = getSpeakingSessions();
  return sessions.filter(s => s.question.section === section);
}

// ===== LISTENING PRACTICE FUNCTIONS =====

const LISTENING_PROGRESS_KEY = 'english_master_listening_progress';
const LISTENING_STATS_KEY = 'english_master_listening_stats';
const LISTENING_SESSIONS_KEY = 'english_master_listening_sessions';

// Serializable version of ListeningProgress for storage
interface StoredListeningProgress {
  testId: string;
  answers: Record<number, ListeningAnswer>;
  startedAt: string;
  completedAt?: string;
  score?: number;
  audioPlayCount: number;
}

// Serializable version of ListeningSession for storage
interface StoredListeningSession {
  id: string;
  testId: string;
  test: ListeningSession['test'];
  answers: Record<number, ListeningAnswer>;
  score: number;
  duration: number;
  audioPlayCount: number;
  startedAt: string;
  completedAt?: string;
}

// Get all listening progress records
export function getAllListeningProgress(): ListeningProgress[] {
  try {
    const stored = localStorage.getItem(LISTENING_PROGRESS_KEY);
    if (!stored) return [];
    
    const progressList: StoredListeningProgress[] = JSON.parse(stored);
    return progressList.map(p => ({
      ...p,
      answers: new Map(Object.entries(p.answers).map(([k, v]) => [parseInt(k), v])),
      startedAt: new Date(p.startedAt),
      completedAt: p.completedAt ? new Date(p.completedAt) : undefined
    }));
  } catch (error) {
    console.error('Error reading listening progress:', error);
    return [];
  }
}

// Get listening progress for a specific test
export function getListeningProgress(testId: string): ListeningProgress | null {
  try {
    const allProgress = getAllListeningProgress();
    return allProgress.find(p => p.testId === testId) || null;
  } catch (error) {
    console.error('Error reading listening progress:', error);
    return null;
  }
}

// Save or update listening progress
export function saveListeningProgress(progress: ListeningProgress): boolean {
  try {
    const stored = localStorage.getItem(LISTENING_PROGRESS_KEY);
    const progressList: StoredListeningProgress[] = stored ? JSON.parse(stored) : [];
    
    // Convert Map to object for storage
    const answersObj: Record<number, ListeningAnswer> = {};
    if (progress.answers instanceof Map) {
      progress.answers.forEach((value, key) => {
        answersObj[key] = value;
      });
    } else {
      Object.assign(answersObj, progress.answers);
    }
    
    const storedProgress: StoredListeningProgress = {
      testId: progress.testId,
      answers: answersObj,
      startedAt: progress.startedAt.toISOString(),
      completedAt: progress.completedAt?.toISOString(),
      score: progress.score,
      audioPlayCount: progress.audioPlayCount
    };
    
    const existingIndex = progressList.findIndex(p => p.testId === progress.testId);
    
    if (existingIndex >= 0) {
      progressList[existingIndex] = storedProgress;
    } else {
      progressList.unshift(storedProgress);
    }
    
    localStorage.setItem(LISTENING_PROGRESS_KEY, JSON.stringify(progressList));
    return true;
  } catch (error) {
    console.error('Error saving listening progress:', error);
    return false;
  }
}

// Delete listening progress for a test
export function deleteListeningProgress(testId: string): boolean {
  try {
    const stored = localStorage.getItem(LISTENING_PROGRESS_KEY);
    if (!stored) return false;
    
    const progressList: StoredListeningProgress[] = JSON.parse(stored);
    const filtered = progressList.filter(p => p.testId !== testId);
    localStorage.setItem(LISTENING_PROGRESS_KEY, JSON.stringify(filtered));
    
    return true;
  } catch (error) {
    console.error('Error deleting listening progress:', error);
    return false;
  }
}

// Clear all listening progress
export function clearListeningProgress(): void {
  try {
    localStorage.removeItem(LISTENING_PROGRESS_KEY);
    localStorage.removeItem(LISTENING_STATS_KEY);
    localStorage.removeItem(LISTENING_SESSIONS_KEY);
  } catch (error) {
    console.error('Error clearing listening progress:', error);
  }
}

// Get listening statistics
export function getListeningStats(): ListeningStats {
  try {
    const stored = localStorage.getItem(LISTENING_STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Return default stats
    return {
      totalTestsCompleted: 0,
      totalQuestionsAnswered: 0,
      totalCorrect: 0,
      averageScore: 0,
      testsBySection: {
        section1: 0,
        section2: 0,
        section3: 0,
        section4: 0
      },
      testsByDifficulty: {},
      questionTypePerformance: {} as Record<ListeningQuestionType, { correct: number; total: number }>
    };
  } catch (error) {
    console.error('Error reading listening stats:', error);
    return {
      totalTestsCompleted: 0,
      totalQuestionsAnswered: 0,
      totalCorrect: 0,
      averageScore: 0,
      testsBySection: {
        section1: 0,
        section2: 0,
        section3: 0,
        section4: 0
      },
      testsByDifficulty: {},
      questionTypePerformance: {} as Record<ListeningQuestionType, { correct: number; total: number }>
    };
  }
}

// Update listening statistics
export function updateListeningStats(
  section: IELTSListeningSection,
  difficulty: string,
  questionsAnswered: number,
  correctAnswers: number,
  questionTypeResults: Record<ListeningQuestionType, { correct: number; total: number }>
): void {
  try {
    const stats = getListeningStats();
    
    stats.totalTestsCompleted += 1;
    stats.totalQuestionsAnswered += questionsAnswered;
    stats.totalCorrect += correctAnswers;
    
    // Update average score
    if (stats.totalQuestionsAnswered > 0) {
      stats.averageScore = Math.round((stats.totalCorrect / stats.totalQuestionsAnswered) * 100);
    }
    
    // Update section breakdown
    stats.testsBySection[section] = (stats.testsBySection[section] || 0) + 1;
    
    // Update difficulty breakdown
    stats.testsByDifficulty[difficulty] = (stats.testsByDifficulty[difficulty] || 0) + 1;
    
    // Update question type performance
    for (const [type, results] of Object.entries(questionTypeResults)) {
      const qType = type as ListeningQuestionType;
      if (!stats.questionTypePerformance[qType]) {
        stats.questionTypePerformance[qType] = { correct: 0, total: 0 };
      }
      stats.questionTypePerformance[qType].correct += results.correct;
      stats.questionTypePerformance[qType].total += results.total;
    }
    
    localStorage.setItem(LISTENING_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error updating listening stats:', error);
  }
}

// Get completed test IDs
export function getCompletedListeningTestIds(): string[] {
  try {
    const allProgress = getAllListeningProgress();
    return allProgress
      .filter(p => p.completedAt !== undefined)
      .map(p => p.testId);
  } catch (error) {
    console.error('Error getting completed listening tests:', error);
    return [];
  }
}

// Get all listening sessions
export function getListeningSessions(): ListeningSession[] {
  try {
    const stored = localStorage.getItem(LISTENING_SESSIONS_KEY);
    if (!stored) return [];
    
    const sessions: StoredListeningSession[] = JSON.parse(stored);
    return sessions.map(s => ({
      ...s,
      answers: new Map(Object.entries(s.answers).map(([k, v]) => [parseInt(k), v])),
      startedAt: new Date(s.startedAt),
      completedAt: s.completedAt ? new Date(s.completedAt) : undefined
    }));
  } catch (error) {
    console.error('Error reading listening sessions:', error);
    return [];
  }
}

// Save a listening session
export function saveListeningSession(session: Omit<ListeningSession, 'id'>): string | null {
  try {
    const stored = localStorage.getItem(LISTENING_SESSIONS_KEY);
    const sessions: StoredListeningSession[] = stored ? JSON.parse(stored) : [];
    
    // Convert Map to object for storage
    const answersObj: Record<number, ListeningAnswer> = {};
    if (session.answers instanceof Map) {
      session.answers.forEach((value, key) => {
        answersObj[key] = value;
      });
    }
    
    const newSession: StoredListeningSession = {
      ...session,
      id: `listening_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      answers: answersObj,
      startedAt: session.startedAt.toISOString(),
      completedAt: session.completedAt?.toISOString()
    };
    
    sessions.unshift(newSession);
    
    // Keep only the last 50 sessions to manage storage
    const trimmedSessions = sessions.slice(0, 50);
    localStorage.setItem(LISTENING_SESSIONS_KEY, JSON.stringify(trimmedSessions));
    
    return newSession.id;
  } catch (error) {
    console.error('Error saving listening session:', error);
    return null;
  }
}

// Delete a listening session
export function deleteListeningSession(sessionId: string): boolean {
  try {
    const stored = localStorage.getItem(LISTENING_SESSIONS_KEY);
    if (!stored) return false;
    
    const sessions: StoredListeningSession[] = JSON.parse(stored);
    const filtered = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(LISTENING_SESSIONS_KEY, JSON.stringify(filtered));
    
    return true;
  } catch (error) {
    console.error('Error deleting listening session:', error);
    return false;
  }
}


