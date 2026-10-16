import { collection, doc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import type { ActivityRecord } from '../types/activity';

const MAX_TEXT = 600;
const MAX_QUESTIONS = 200;

export function newActivityId(): string {
  // doc() on a collection only generates a random id locally; nothing is written.
  return doc(collection(db, 'activityLog')).id;
}

function clip(value: string | undefined): string | undefined {
  if (value == null) return value;
  return value.length > MAX_TEXT ? `${value.slice(0, MAX_TEXT)}…` : value;
}

// Firestore rejects undefined anywhere in a document.
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.filter(item => item !== undefined).map(item => stripUndefined(item)) as T;
  }
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const out: Record<string, unknown> = {};
    Object.entries(value as Record<string, unknown>).forEach(([key, item]) => {
      if (item !== undefined) out[key] = stripUndefined(item);
    });
    return out as T;
  }
  return value;
}

/**
 * Creates or overwrites one attempt in users/{uid}/activityLog/{id}.
 * Never throws: a failed log write must not break the exercise itself.
 */
export async function saveActivity(record: Omit<ActivityRecord, 'legacy'>): Promise<void> {
  const uid = auth?.currentUser?.uid;
  if (!uid) return;

  const plain = stripUndefined({
    ...record,
    title: clip(record.title) || '',
    feedbackSummary: clip(record.feedbackSummary),
    details: record.details?.map(d => ({ label: d.label, value: clip(d.value) || '' })),
    questions: record.questions?.slice(0, MAX_QUESTIONS).map(q => ({
      ...q,
      prompt: clip(q.prompt) || '',
      given: clip(q.given) || '',
      expected: clip(q.expected),
      tag: clip(q.tag),
    })),
  });

  try {
    await setDoc(doc(db, 'users', uid, 'activityLog', record.id), {
      ...plain,
      startedAt: Timestamp.fromDate(record.startedAt),
      endedAt: Timestamp.fromDate(record.endedAt),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Activity log write failed:', error);
  }
}

/**
 * Keeps users/{uid} up to date so the admin panel can list students by email.
 * Nothing wrote this document before, so students appear in the list after
 * their next visit.
 */
export async function touchUserProfile(user: User): Promise<void> {
  try {
    const created = user.metadata?.creationTime ? new Date(user.metadata.creationTime) : null;
    await setDoc(doc(db, 'users', user.uid), stripUndefined({
      email: user.email || undefined,
      lastSeenAt: serverTimestamp(),
      createdAt: created && !Number.isNaN(created.getTime()) ? Timestamp.fromDate(created) : undefined,
    }), { merge: true });
  } catch (error) {
    console.warn('User profile update failed:', error);
  }
}
