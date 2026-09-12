import { useCallback, useEffect, useRef, useState } from 'react';
import type { ListeningTest } from '../types';

export function useListeningAudio(test: ListeningTest | null) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const excerptEnd = useRef<number | null>(null);
  const [audioState, setAudioState] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'ended'>('idle');
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(test?.duration || 0);
  const [audioError, setAudioError] = useState('');

  useEffect(() => {
    setAudioState('idle');
    setAudioProgress(0);
    setAudioDuration(test?.duration || 0);
    setAudioError('');
    excerptEnd.current = null;
    if (!test?.audioUrl) return;
    const audio = new Audio(test.audioUrl);
    audio.preload = 'metadata';
    audioRef.current = audio;
    audio.onloadedmetadata = () => {
      if (Number.isFinite(audio.duration)) setAudioDuration(audio.duration);
    };
    audio.ontimeupdate = () => {
      setAudioProgress(audio.currentTime);
      if (excerptEnd.current !== null && audio.currentTime >= excerptEnd.current) {
        audio.pause();
        excerptEnd.current = null;
      }
    };
    audio.onplaying = () => setAudioState('playing');
    audio.onpause = () => { if (!audio.ended) setAudioState('paused'); };
    audio.onwaiting = () => setAudioState('loading');
    audio.onended = () => { setAudioState('ended'); excerptEnd.current = null; };
    audio.onerror = () => {
      setAudioState('idle');
      setAudioError('Ses kaydı yüklenemedi. Bağlantınızı kontrol edip tekrar deneyin.');
    };
    return () => {
      audio.onloadedmetadata = audio.ontimeupdate = audio.onplaying = audio.onpause = null;
      audio.onwaiting = audio.onended = audio.onerror = null;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
    };
  }, [test]);

  const start = useCallback(async (from?: number, until?: number) => {
    const audio = audioRef.current;
    if (!audio) return false;
    setAudioError('');
    excerptEnd.current = until ?? null;
    try {
      if (audio.error) audio.load();
      if (from !== undefined) audio.currentTime = from;
      setAudioState('loading');
      await audio.play();
      return audioRef.current === audio;
    } catch (error) {
      if (audioRef.current !== audio || (error instanceof DOMException && error.name === 'AbortError')) return false;
      setAudioState('paused');
      setAudioError('Ses başlatılamadı. Dinle düğmesine basarak tekrar deneyin.');
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
    excerptEnd.current = null;
    setAudioState('idle');
    setAudioProgress(0);
  }, []);

  return {
    audioState, audioProgress, audioDuration, audioError,
    play: () => start(0),
    resume: () => start(),
    pause: () => audioRef.current?.pause(),
    stop,
    seek: (time: number) => {
      if (audioRef.current) audioRef.current.currentTime = time;
      excerptEnd.current = null;
      setAudioProgress(time);
      setAudioState(state => state === 'idle' || state === 'ended' ? 'paused' : state);
    },
    replayTurn: (index: number) => {
      const turn = test?.turns[index];
      if (turn?.startTime !== undefined && turn.endTime !== undefined) return start(turn.startTime, turn.endTime);
      return Promise.resolve(false);
    }
  };
}
