import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  PerformanceStats,
  MistakeRecord,
  WritingSubmission,
  ReadingProgress,
  ReadingStats,
  SpeakingSession,
  SpeakingStats,
  ListeningProgress,
  ListeningStats,
  VocabWord,
} from '../types';

interface AdminUserData {
  uid: string;
  email: string;
}

export async function getAllUsers(): Promise<AdminUserData[]> {
  const usersRef = collection(db, 'users');
  const snap = await getDocs(usersRef);
  return snap.docs.map(docSnapshot => ({
    uid: docSnapshot.id,
    email: docSnapshot.data().email || 'Unknown User',
  }));
}

async function fetchFromAllUsers<T>(
  users: AdminUserData[],
  subcollectionName: string,
  mapper: (docData: any, docId: string, email: string) => T,
): Promise<T[]> {
  const allRecords: T[] = [];

  await Promise.all(
    users.map(async user => {
      try {
        const subcollectionRef = collection(db, 'users', user.uid, subcollectionName);
        const subcollectionSnap = await getDocs(subcollectionRef);
        subcollectionSnap.forEach(docSnapshot => {
          allRecords.push(mapper(docSnapshot.data(), docSnapshot.id, user.email));
        });
      } catch (error) {
        console.error(`Failed to fetch ${subcollectionName} for ${user.email}`, error);
      }
    }),
  );

  return allRecords;
}

export async function getAdminMistakes(users: AdminUserData[]): Promise<(MistakeRecord & { userEmail: string })[]> {
  const mistakes = await fetchFromAllUsers(users, 'mistakes', (data, id, email) => ({
    id,
    userEmail: email,
    ...data,
    startedAt: data.startedAt?.toDate() || new Date(),
    completedAt: data.completedAt ? data.completedAt.toDate() : undefined,
  } as MistakeRecord & { userEmail: string }));

  return mistakes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export async function getAdminWritings(users: AdminUserData[]): Promise<(WritingSubmission & { userEmail: string })[]> {
  const writings = await fetchFromAllUsers(users, 'writingSubmissions', (data, id, email) => ({
    id,
    userEmail: email,
    ...data,
    submittedAt: data.submittedAt?.toDate() || new Date(),
  } as WritingSubmission & { userEmail: string }));

  return writings.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
}

export async function getAdminReadingProgress(users: AdminUserData[]): Promise<(ReadingProgress & { userEmail: string })[]> {
  return fetchFromAllUsers(users, 'readingProgress', (data, id, email) => ({
    passageId: id,
    userEmail: email,
    ...data,
    startedAt: data.startedAt?.toDate() || new Date(),
    completedAt: data.completedAt ? data.completedAt.toDate() : undefined,
  } as ReadingProgress & { userEmail: string }));
}

export async function getAdminSpeakingSessions(users: AdminUserData[]): Promise<(SpeakingSession & { userEmail: string })[]> {
  const sessions = await fetchFromAllUsers(users, 'speakingSessions', (data, id, email) => ({
    id,
    userEmail: email,
    ...data,
    startedAt: data.startedAt?.toDate() || new Date(),
    completedAt: data.completedAt ? data.completedAt.toDate() : undefined,
  } as SpeakingSession & { userEmail: string }));

  return sessions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
}

export async function getAdminListeningProgress(users: AdminUserData[]): Promise<(ListeningProgress & { userEmail: string })[]> {
  return fetchFromAllUsers(users, 'listeningProgress', (data, id, email) => ({
    testId: id,
    userEmail: email,
    ...data,
    startedAt: data.startedAt?.toDate() || new Date(),
    completedAt: data.completedAt ? data.completedAt.toDate() : undefined,
  } as ListeningProgress & { userEmail: string }));
}

export async function getAdminVocab(users: AdminUserData[]): Promise<(VocabWord & { userEmail: string })[]> {
  const vocab = await fetchFromAllUsers(users, 'vocabVault', (data, id, email) => ({
    id,
    userEmail: email,
    ...data,
    addedAt: data.addedAt?.toDate() || new Date(),
  } as VocabWord & { userEmail: string }));

  return vocab.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
}

export async function getAdminPerformanceStats(users: AdminUserData[]): Promise<{ email: string; stat: PerformanceStats }[]> {
  const stats = await fetchFromAllUsers(users, 'stats', (data, id, email) => {
    if (id === 'performance') {
      return { email, stat: data as PerformanceStats };
    }
    return null;
  });

  return stats.filter(Boolean) as { email: string; stat: PerformanceStats }[];
}

export async function getAdminReadingStats(users: AdminUserData[]): Promise<{ email: string; stat: ReadingStats }[]> {
  const stats = await fetchFromAllUsers(users, 'stats', (data, id, email) => {
    if (id === 'reading') {
      return { email, stat: data as ReadingStats };
    }
    return null;
  });

  return stats.filter(Boolean) as { email: string; stat: ReadingStats }[];
}

export async function getAdminSpeakingStats(users: AdminUserData[]): Promise<{ email: string; stat: SpeakingStats }[]> {
  const stats = await fetchFromAllUsers(users, 'stats', (data, id, email) => {
    if (id === 'speaking') {
      return { email, stat: data as SpeakingStats };
    }
    return null;
  });

  return stats.filter(Boolean) as { email: string; stat: SpeakingStats }[];
}

export async function getAdminListeningStats(users: AdminUserData[]): Promise<{ email: string; stat: ListeningStats }[]> {
  const stats = await fetchFromAllUsers(users, 'stats', (data, id, email) => {
    if (id === 'listening') {
      return { email, stat: data as ListeningStats };
    }
    return null;
  });

  return stats.filter(Boolean) as { email: string; stat: ListeningStats }[];
}
