import type { ListeningTest } from '../types';
import { listeningContent } from './listeningContent';
import { listeningAudioManifest } from './listeningAudioManifest';

export const listeningTests: ListeningTest[] = listeningContent.map(passage => {
  const audio = listeningAudioManifest[passage.id];
  return {
    ...passage,
    transcript: passage.turns.map(turn => `${turn.speaker}: ${turn.text}`).join('\n\n'),
    audioText: passage.turns.map(turn => turn.text).join('\n\n'),
    audioUrl: `${import.meta.env.BASE_URL}audio/toefl/${passage.id}.mp3`,
    duration: audio?.duration ?? Math.round(passage.turns.reduce((n, turn) => n + turn.text.split(/\s+/).length, 0) / 2.4),
    turns: passage.turns.map((turn, index) => ({ ...turn, ...audio?.turns[index] })),
    createdAt: new Date('2026-09-12T00:00:00Z')
  };
});
