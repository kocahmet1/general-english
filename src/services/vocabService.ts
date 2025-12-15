import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { VocabWord } from '../types';

const VOCAB_COLLECTION = 'vocabVault';

// Get all vocab words
export async function getAllVocabWords(): Promise<VocabWord[]> {
  try {
    const vocabRef = collection(db, VOCAB_COLLECTION);
    const q = query(vocabRef, orderBy('addedAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        word: data.word,
        questionContext: data.questionContext,
        addedAt: data.addedAt?.toDate() || new Date(),
        examId: data.examId,
        questionId: data.questionId
      };
    });
  } catch (error) {
    console.error('Error fetching vocab words:', error);
    return [];
  }
}

// Add a word to vocab vault
export async function addVocabWord(
  word: string, 
  questionContext: string,
  examId: string,
  questionId: number
): Promise<string | null> {
  try {
    // Check if word already exists
    const vocabRef = collection(db, VOCAB_COLLECTION);
    const existingQuery = query(vocabRef, where('word', '==', word.toLowerCase()));
    const existing = await getDocs(existingQuery);
    
    if (!existing.empty) {
      console.log('Word already exists in vault');
      return existing.docs[0].id;
    }
    
    const docRef = await addDoc(vocabRef, {
      word: word.toLowerCase(),
      questionContext,
      examId,
      questionId,
      addedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding vocab word:', error);
    return null;
  }
}

// Remove a word from vocab vault
export async function removeVocabWord(wordId: string): Promise<boolean> {
  try {
    const wordRef = doc(db, VOCAB_COLLECTION, wordId);
    await deleteDoc(wordRef);
    return true;
  } catch (error) {
    console.error('Error removing vocab word:', error);
    return false;
  }
}

// Check if a word is in the vault
export async function isWordInVault(word: string): Promise<boolean> {
  try {
    const vocabRef = collection(db, VOCAB_COLLECTION);
    const q = query(vocabRef, where('word', '==', word.toLowerCase()));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking vocab word:', error);
    return false;
  }
}


