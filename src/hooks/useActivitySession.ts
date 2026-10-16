import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityTimer } from '../services/activityTimer';
import { newActivityId, saveActivity } from '../services/activityLogService';
import type { ActivityInput } from '../types/activity';

interface Session {
  id: string;
  timer: ActivityTimer;
}

export interface ActivitySnapshot {
  id: string;
  startedAt: Date;
  endedAt: Date;
  durationSeconds: number;
}

function createSession(): Session {
  return { id: newActivityId(), timer: new ActivityTimer() };
}

/**
 * Tracks one attempt per `key` (an exam id, passage id, quiz id…).
 * A new attempt starts whenever the key changes or `restart()` is called;
 * `null` means nothing is being attempted.
 *
 * `record()` writes the attempt with its active time so far. Calling it again
 * for the same attempt overwrites the record, so modules record after every
 * answer (status in_progress) and once more on completion.
 */
export function useActivitySession(key: string | null) {
  const sessionRef = useRef<Session | null>(null);

  useEffect(() => {
    if (!key) return;
    sessionRef.current = createSession();
    return () => {
      sessionRef.current?.timer.dispose();
      sessionRef.current = null;
    };
  }, [key]);

  const restart = useCallback(() => {
    if (!sessionRef.current) return;
    sessionRef.current.timer.dispose();
    sessionRef.current = createSession();
  }, []);

  /** Freezes the timing now, for work that is saved after an async step. */
  const snapshot = useCallback((): ActivitySnapshot | null => {
    const session = sessionRef.current;
    if (!session) return null;
    return {
      id: session.id,
      startedAt: session.timer.startedAt,
      endedAt: new Date(),
      durationSeconds: session.timer.seconds(),
    };
  }, []);

  const record = useCallback((input: ActivityInput, frozen?: ActivitySnapshot | null) => {
    const timing = frozen ?? snapshot();
    if (!timing) return;
    void saveActivity({ ...input, ...timing });
  }, [snapshot]);

  return useMemo(() => ({ record, restart, snapshot }), [record, restart, snapshot]);
}

export function percent(correct: number, total: number): number | undefined {
  return total > 0 ? Math.round((correct / total) * 100) : undefined;
}

/** "B) went" for a letter answer; handles comma-separated multi-answers ("A,C"). */
export function optionLabel(options: { letter: string; text: string }[], letters: string | undefined): string {
  if (!letters) return '';
  return letters
    .split(',')
    .map(letter => letter.trim())
    .filter(Boolean)
    .map(letter => {
      const option = options.find(o => o.letter === letter);
      return option ? `${letter}) ${option.text}` : letter;
    })
    .join(' · ');
}
