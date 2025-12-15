// Local Storage Service - Fallback when Firebase is not configured
import { 
  Exam, 
  Question, 
  VocabWord, 
  MistakeRecord, 
  GrammarCategory,
  CategoryStats,
  PerformanceStats,
  GRAMMAR_CATEGORY_LABELS
} from '../types';
import { sampleExamQuestions, sampleExamName, sampleExamDescription } from '../data/sampleExam';

const EXAMS_KEY = 'english_master_exams';
const VOCAB_KEY = 'english_master_vocab';
const MISTAKES_KEY = 'english_master_mistakes';
const ANSWER_STATS_KEY = 'english_master_answer_stats';

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


