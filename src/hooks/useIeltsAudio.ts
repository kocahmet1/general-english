import { useCallback, useEffect, useRef, useState } from 'react';

export type IeltsAudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended';

/** One recording at a time: play/pause, seeking, playback speed and short excerpts. */
export function useIeltsAudio(src: string | null) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const excerptEnd = useRef<number | null>(null);
  const [state, setState] = useState<IeltsAudioState>('idle');
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const [rate, setRateState] = useState(1);
  const [excerpt, setExcerpt] = useState<string | null>(null);

  useEffect(() => {
    setState('idle');
    setTime(0);
    setDuration(0);
    setError('');
    setExcerpt(null);
    excerptEnd.current = null;
    if (!src) return;
    const audio = new Audio(src);
    audio.preload = 'metadata';
    audioRef.current = audio;
    audio.onloadedmetadata = () => { if (Number.isFinite(audio.duration)) setDuration(audio.duration); };
    audio.ontimeupdate = () => {
      setTime(audio.currentTime);
      if (excerptEnd.current !== null && audio.currentTime >= excerptEnd.current) {
        excerptEnd.current = null;
        setExcerpt(null);
        audio.pause();
      }
    };
    audio.onplaying = () => setState('playing');
    audio.onpause = () => { if (!audio.ended) setState('paused'); };
    audio.onwaiting = () => setState('loading');
    audio.onended = () => { setState('ended'); excerptEnd.current = null; setExcerpt(null); };
    audio.onerror = () => {
      setState('idle');
      setError('Ses kaydı yüklenemedi. Bağlantınızı kontrol edip tekrar deneyin.');
    };
    return () => {
      audio.onloadedmetadata = audio.ontimeupdate = audio.onplaying = audio.onpause = null;
      audio.onwaiting = audio.onended = audio.onerror = null;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
    };
  }, [src]);

  const start = useCallback(async (from?: number, until?: number, label?: string) => {
    const audio = audioRef.current;
    if (!audio) return false;
    setError('');
    excerptEnd.current = until ?? null;
    setExcerpt(until !== undefined ? label ?? 'excerpt' : null);
    try {
      if (audio.error) audio.load();
      if (from !== undefined) audio.currentTime = from;
      setState('loading');
      await audio.play();
      return audioRef.current === audio;
    } catch (e) {
      if (audioRef.current !== audio || (e instanceof DOMException && e.name === 'AbortError')) return false;
      setState('paused');
      setError('Ses başlatılamadı. Oynat düğmesine basarak tekrar deneyin.');
      return false;
    }
  }, []);

  const pause = useCallback(() => audioRef.current?.pause(), []);

  const seek = useCallback((to: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const target = Math.max(0, Math.min(to, Number.isFinite(audio.duration) ? audio.duration : to));
    audio.currentTime = target;
    excerptEnd.current = null;
    setExcerpt(null);
    setTime(target);
    setState(s => (s === 'idle' || s === 'ended' ? 'paused' : s));
  }, []);

  const setRate = useCallback((value: number) => {
    setRateState(value);
    if (audioRef.current) audioRef.current.playbackRate = value;
  }, []);

  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = rate; }, [src, rate]);

  return {
    state, time, duration, error, rate, excerpt,
    play: () => start(0),
    resume: () => start(),
    pause,
    seek,
    skip: (delta: number) => seek((audioRef.current?.currentTime ?? 0) + delta),
    setRate,
    /** Plays [from, until) and stops; `label` identifies which excerpt is playing. */
    playExcerpt: (from: number, until: number, label: string) => start(from, until, label),
  };
}
