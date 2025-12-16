/**
 * OpenAI Realtime API Service
 * Provides bi-directional voice conversation capabilities for the Voice Tutor feature.
 * 
 * This service uses the OpenAI Realtime API via WebRTC for low-latency voice interactions.
 */

import { getExistingMicrophoneStream, isMicrophonePermissionGranted } from './microphoneService';

export interface RealtimeSessionConfig {
  instructions: string;
  voice: 'alloy' | 'echo' | 'shimmer' | 'ash' | 'ballad' | 'coral' | 'sage' | 'verse';
  inputAudioTranscription?: boolean;
  turnDetection?: {
    type: 'server_vad';
    threshold?: number;
    prefix_padding_ms?: number;
    silence_duration_ms?: number;
  };
}

export interface RealtimeMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type RealtimeEventType = 
  | 'connected'
  | 'disconnected'
  | 'speaking_started'
  | 'speaking_stopped'
  | 'user_speaking'
  | 'user_stopped_speaking'
  | 'transcript'
  | 'audio_started'
  | 'audio_stopped'
  | 'error';

export interface RealtimeEvent {
  type: RealtimeEventType;
  data?: unknown;
}

type EventCallback = (event: RealtimeEvent) => void;

/**
 * RealtimeSession class manages a single voice conversation session
 * using the OpenAI Realtime API via WebRTC.
 */
export class RealtimeSession {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private localStream: MediaStream | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private eventListeners: Map<RealtimeEventType | 'all', EventCallback[]> = new Map();
  private isConnected = false;
  private config: RealtimeSessionConfig;
  private conversationHistory: RealtimeMessage[] = [];

  constructor(config: RealtimeSessionConfig) {
    this.config = config;
  }

  /**
   * Register an event listener
   */
  on(event: RealtimeEventType | 'all', callback: EventCallback): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.push(callback);
    this.eventListeners.set(event, listeners);
  }

  /**
   * Remove an event listener
   */
  off(event: RealtimeEventType | 'all', callback: EventCallback): void {
    const listeners = this.eventListeners.get(event) || [];
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * Emit an event to all listeners
   */
  private emit(type: RealtimeEventType, data?: unknown): void {
    const event: RealtimeEvent = { type, data };
    
    // Notify specific listeners
    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach(cb => cb(event));
    
    // Notify 'all' listeners
    const allListeners = this.eventListeners.get('all') || [];
    allListeners.forEach(cb => cb(event));
  }

  /**
   * Connect to the OpenAI Realtime API
   */
  async connect(): Promise<void> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      // Try to use existing microphone stream if already granted
      const existingStream = getExistingMicrophoneStream();
      if (existingStream && isMicrophonePermissionGranted()) {
        // Clone the existing stream to avoid conflicts
        this.localStream = existingStream.clone();
      } else {
        // Request microphone access
        this.localStream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      }

      // Create peer connection
      this.peerConnection = new RTCPeerConnection();

      // Create audio element for playback
      this.audioElement = document.createElement('audio');
      this.audioElement.autoplay = true;

      // Handle incoming audio track
      this.peerConnection.ontrack = (event) => {
        if (this.audioElement && event.streams[0]) {
          this.audioElement.srcObject = event.streams[0];
          this.emit('audio_started');
        }
      };

      // Add local audio track
      this.localStream.getTracks().forEach(track => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });

      // Create data channel for events
      this.dataChannel = this.peerConnection.createDataChannel('oai-events');
      this.setupDataChannelHandlers();

      // Create and set local description
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // Get ephemeral token from OpenAI
      const sessionResponse = await fetch('https://api.openai.com/v1/realtime/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview-2024-12-17',
          voice: this.config.voice,
          instructions: this.config.instructions,
          input_audio_transcription: this.config.inputAudioTranscription ? {
            model: 'whisper-1'
          } : undefined,
          turn_detection: this.config.turnDetection || {
            type: 'server_vad',
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 500
          }
        })
      });

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json().catch(() => ({}));
        throw new Error(`Failed to create session: ${sessionResponse.status} - ${JSON.stringify(errorData)}`);
      }

      const sessionData = await sessionResponse.json();
      const ephemeralKey = sessionData.client_secret?.value;
      
      if (!ephemeralKey) {
        throw new Error('Failed to get ephemeral key from session response');
      }

      // Connect to OpenAI Realtime API
      const sdpResponse = await fetch(`https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp'
        },
        body: offer.sdp
      });

      if (!sdpResponse.ok) {
        throw new Error(`Failed to connect: ${sdpResponse.status}`);
      }

      const answerSdp = await sdpResponse.text();
      await this.peerConnection.setRemoteDescription({
        type: 'answer',
        sdp: answerSdp
      });

      this.isConnected = true;
      this.emit('connected');

    } catch (error) {
      console.error('Failed to connect to Realtime API:', error);
      this.disconnect();
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Setup data channel event handlers
   */
  private setupDataChannelHandlers(): void {
    if (!this.dataChannel) return;

    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
    };

    this.dataChannel.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleServerEvent(data);
      } catch (error) {
        console.error('Failed to parse server event:', error);
      }
    };

    this.dataChannel.onclose = () => {
      console.log('Data channel closed');
    };

    this.dataChannel.onerror = (error) => {
      console.error('Data channel error:', error);
      this.emit('error', error);
    };
  }

  /**
   * Handle server events from the Realtime API
   */
  private handleServerEvent(event: Record<string, unknown>): void {
    const eventType = event.type as string;

    switch (eventType) {
      case 'response.audio_transcript.delta':
      case 'response.text.delta':
        // Partial transcript from AI
        break;

      case 'response.audio_transcript.done':
      case 'response.text.done':
        // Complete transcript from AI
        const transcript = event.transcript as string || event.text as string;
        if (transcript) {
          this.conversationHistory.push({
            role: 'assistant',
            content: transcript,
            timestamp: new Date()
          });
          this.emit('transcript', { role: 'assistant', content: transcript });
        }
        break;

      case 'conversation.item.input_audio_transcription.completed':
        // User's speech transcribed
        const userTranscript = event.transcript as string;
        if (userTranscript) {
          this.conversationHistory.push({
            role: 'user',
            content: userTranscript,
            timestamp: new Date()
          });
          this.emit('transcript', { role: 'user', content: userTranscript });
        }
        break;

      case 'input_audio_buffer.speech_started':
        this.emit('user_speaking');
        break;

      case 'input_audio_buffer.speech_stopped':
        this.emit('user_stopped_speaking');
        break;

      case 'response.audio.started':
        this.emit('speaking_started');
        break;

      case 'response.audio.done':
      case 'response.done':
        this.emit('speaking_stopped');
        break;

      case 'error':
        console.error('Server error:', event);
        this.emit('error', event);
        break;

      default:
        // Other events
        break;
    }
  }

  /**
   * Send a text message to the AI (will be spoken back)
   */
  sendMessage(text: string): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.error('Data channel not ready');
      return;
    }

    // Create a conversation item
    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: text
          }
        ]
      }
    };

    this.dataChannel.send(JSON.stringify(event));

    // Trigger a response
    const responseEvent = {
      type: 'response.create'
    };
    this.dataChannel.send(JSON.stringify(responseEvent));
  }

  /**
   * Interrupt the current AI response
   */
  interrupt(): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      return;
    }

    const event = {
      type: 'response.cancel'
    };
    this.dataChannel.send(JSON.stringify(event));
  }

  /**
   * Get the conversation history
   */
  getHistory(): RealtimeMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Clear the conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Check if the session is connected
   */
  get connected(): boolean {
    return this.isConnected;
  }

  /**
   * Disconnect from the Realtime API
   */
  disconnect(): void {
    this.isConnected = false;

    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.audioElement) {
      this.audioElement.srcObject = null;
      this.audioElement = null;
    }

    this.emit('disconnected');
  }
}

/**
 * Create a voice tutor session with pre-configured instructions for English learning
 */
export function createVoiceTutorSession(
  questionContext: string,
  explanation: string,
  studentAnswer: string,
  correctAnswer: string
): RealtimeSession {
  const instructions = `Sen deneyimli ve sabırlı bir İngilizce öğretmenisin. Türkçe konuşuyorsun ama İngilizce kelimeleri ve örnek cümleleri İngilizce söylüyorsun.

Öğrenciye bir soru hakkında yardım ediyorsun. İşte bağlam:

**Soru:** ${questionContext}
**Öğrencinin Cevabı:** ${studentAnswer}
**Doğru Cevap:** ${correctAnswer}

**Hazırlanan Açıklama:**
${explanation}

GÖREVLER:
1. Önce yukarıdaki açıklamayı sıcak ve destekleyici bir şekilde öğrenciye anlat.
2. Öğrenci takip soruları sorabilir - bunlara sabırla ve detaylı cevap ver.
3. Örnek cümleleri net ve yavaş telaffuz et.
4. Gramer kurallarını basit ve anlaşılır şekilde açıkla.
5. Öğrenciyi motive et ve cesaretlendir.

KONUŞMA TARZI:
- Sıcak ve arkadaşça ol
- Çok uzun monologlardan kaçın, interaktif ol
- İngilizce kelimeleri düzgün telaffuz et
- Öğrenci anlamadığında farklı şekillerde açıkla

ÖNEMLİ: Türkçe konuş, sadece İngilizce kelimeler, terimler ve örnek cümleler İngilizce olsun. İngilizce örnek cümlelerin Türkçe çevirisini de söyle.`;

  return new RealtimeSession({
    instructions,
    voice: 'shimmer', // Warm, friendly voice
    inputAudioTranscription: true,
    turnDetection: {
      type: 'server_vad',
      threshold: 0.5,
      prefix_padding_ms: 300,
      silence_duration_ms: 700
    }
  });
}

