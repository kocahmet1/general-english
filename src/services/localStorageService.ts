// Local Storage Service - Fallback when Firebase is not configured
import { Exam, Question, VocabWord } from '../types';
import { sampleExamQuestions, sampleExamName, sampleExamDescription } from '../data/sampleExam';

const EXAMS_KEY = 'english_master_exams';
const VOCAB_KEY = 'english_master_vocab';

// Check if Firebase is configured
export function isFirebaseConfigured(): boolean {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return apiKey && apiKey !== 'your-api-key' && apiKey !== 'your-api-key-here';
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


