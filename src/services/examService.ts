import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Exam, Question } from '../types';

const EXAMS_COLLECTION = 'exams';

// Get all exams (metadata only for dropdown)
export async function getAllExams(): Promise<{ id: string; name: string; description?: string; questionCount: number }[]> {
  try {
    const examsRef = collection(db, EXAMS_COLLECTION);
    // Simple query without orderBy to avoid index requirements
    const snapshot = await getDocs(examsRef);
    
    const exams = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Untitled Exam',
        description: data.description,
        questionCount: data.questions?.length || 0,
        createdAt: data.createdAt?.toDate() || new Date()
      };
    });
    
    // Sort by createdAt descending in memory
    exams.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return exams.map(({ createdAt, ...rest }) => rest);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return [];
  }
}

// Get a single exam with all questions
export async function getExamById(examId: string): Promise<Exam | null> {
  try {
    const examRef = doc(db, EXAMS_COLLECTION, examId);
    const examDoc = await getDoc(examRef);
    
    if (!examDoc.exists()) {
      return null;
    }
    
    const data = examDoc.data();
    return {
      id: examDoc.id,
      name: data.name,
      description: data.description,
      questions: data.questions || [],
      createdAt: data.createdAt?.toDate() || new Date()
    };
  } catch (error) {
    console.error('Error fetching exam:', error);
    return null;
  }
}

// Create a new exam
export async function createExam(name: string, description: string, questions: Question[]): Promise<string | null> {
  try {
    const examsRef = collection(db, EXAMS_COLLECTION);
    const docRef = await addDoc(examsRef, {
      name,
      description,
      questions,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating exam:', error);
    return null;
  }
}

// Delete an exam
export async function deleteExam(examId: string): Promise<boolean> {
  try {
    const examRef = doc(db, EXAMS_COLLECTION, examId);
    await deleteDoc(examRef);
    return true;
  } catch (error) {
    console.error('Error deleting exam:', error);
    return false;
  }
}

// Parse exam text format into Question array
export function parseExamText(examText: string, answerKeyText: string): Question[] {
  const questions: Question[] = [];
  
  // Split exam text into question blocks
  const questionBlocks = examText.split(/(?=\d+\s+)/);
  
  // Parse answer key
  const answers: Record<number, string> = {};
  
  // Handle various answer key formats
  // Format 1: "1–10 (Starter)\nB 2. B 3. A..." or "1. A 2. B..."
  // Format 2: "1. B\n2. B\n3. A..."
  const answerLines = answerKeyText.split('\n');
  
  for (const line of answerLines) {
    // Skip headers like "1–10 (Starter)"
    if (line.match(/^\d+[–-]\d+/)) continue;
    
    // Match patterns like "1. A" or "B 2. B 3. A"
    const matches = line.matchAll(/(\d+)\.\s*([A-D])|^([A-D])\s+(\d+)\.|^([A-D])(?=\s+\d+\.|\s*$)/g);
    
    for (const match of matches) {
      if (match[1] && match[2]) {
        // Pattern: "1. A"
        answers[parseInt(match[1])] = match[2];
      } else if (match[3] && match[4]) {
        // Pattern: "A 2."
        answers[parseInt(match[4])] = match[3];
      }
    }
    
    // Also try simpler patterns
    const simpleMatches = line.matchAll(/(\d+)\.\s*([A-D])/g);
    for (const match of simpleMatches) {
      answers[parseInt(match[1])] = match[2];
    }
    
    // Handle format where first answer has no number: "B 2. B 3. A"
    const firstAnswerMatch = line.match(/^([A-D])\s+\d+\./);
    if (firstAnswerMatch) {
      // Find the question number this refers to
      const prevLine = answerLines[answerLines.indexOf(line) - 1];
      const rangeMatch = prevLine?.match(/^(\d+)[–-]/);
      if (rangeMatch) {
        answers[parseInt(rangeMatch[1])] = firstAnswerMatch[1];
      }
    }
  }
  
  // Alternative: parse all at once for simpler format
  const allAnswerMatches = answerKeyText.matchAll(/(\d+)\.\s*([A-D])/g);
  for (const match of allAnswerMatches) {
    answers[parseInt(match[1])] = match[2];
  }
  
  // Parse each question block
  for (const block of questionBlocks) {
    const trimmedBlock = block.trim();
    if (!trimmedBlock) continue;
    
    // Match question number and text
    const questionMatch = trimmedBlock.match(/^(\d+)\s+([\s\S]*?)(?=\n[A-D]\s|\n[A-D]$|$)/);
    if (!questionMatch) continue;
    
    const questionNumber = parseInt(questionMatch[1]);
    const questionText = questionMatch[2].trim();
    
    // Match options
    const optionMatches = trimmedBlock.matchAll(/([A-D])\s+(.+?)(?=\n[A-D]\s|\n[A-D]$|$)/g);
    const options: { letter: string; text: string }[] = [];
    
    for (const optMatch of optionMatches) {
      options.push({
        letter: optMatch[1],
        text: optMatch[2].trim()
      });
    }
    
    // Alternative option parsing for single-line options
    if (options.length === 0) {
      const lines = trimmedBlock.split('\n');
      for (const line of lines) {
        const optMatch = line.match(/^([A-D])\s+(.+)$/);
        if (optMatch) {
          options.push({
            letter: optMatch[1],
            text: optMatch[2].trim()
          });
        }
      }
    }
    
    if (options.length > 0 && answers[questionNumber]) {
      questions.push({
        id: questionNumber,
        questionText,
        options,
        correctAnswer: answers[questionNumber],
        difficulty: getDifficultyLevel(questionNumber)
      });
    }
  }
  
  return questions;
}

// Helper function to determine difficulty based on question number
function getDifficultyLevel(questionNumber: number): string {
  if (questionNumber <= 10) return 'Starter';
  if (questionNumber <= 20) return 'Elementary';
  if (questionNumber <= 40) return 'Pre-Intermediate';
  if (questionNumber <= 60) return 'Intermediate';
  if (questionNumber <= 80) return 'Upper Intermediate';
  if (questionNumber <= 100) return 'Advanced';
  return 'Proficiency';
}

