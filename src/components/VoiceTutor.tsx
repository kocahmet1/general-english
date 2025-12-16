import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX,
  MessageCircle,
  Loader2,
  AlertCircle,
  Sparkles,
  X
} from 'lucide-react';
import { 
  RealtimeSession, 
  createVoiceTutorSession, 
  RealtimeMessage,
  RealtimeEvent 
} from '../services/realtimeService';
import { isMicrophonePermissionGranted } from '../services/microphoneService';

interface VoiceTutorProps {
  isOpen: boolean;
  onClose: () => void;
  questionText: string;
  explanation: string;
  studentAnswer: string;
  correctAnswer: string;
  autoStart?: boolean; // Automatically start conversation when modal opens
}

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';
type SpeakingState = 'idle' | 'ai_speaking' | 'user_speaking' | 'processing';

export const VoiceTutor: React.FC<VoiceTutorProps> = ({
  isOpen,
  onClose,
  questionText,
  explanation,
  studentAnswer,
  correctAnswer,
  autoStart = false // Manual start - user clicks button
}) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [speakingState, setSpeakingState] = useState<SpeakingState>('idle');
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [aiVolume, setAiVolume] = useState(true);
  
  const sessionRef = useRef<RealtimeSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAutoStartedRef = useRef(false);
  const isStartingRef = useRef(false);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionRef.current) {
        sessionRef.current.disconnect();
      }
    };
  }, []);

  // Handle events from the realtime session
  const handleRealtimeEvent = useCallback((event: RealtimeEvent) => {
    switch (event.type) {
      case 'connected':
        setConnectionState('connected');
        setError(null);
        break;

      case 'disconnected':
        setConnectionState('disconnected');
        setSpeakingState('idle');
        break;

      case 'speaking_started':
        setSpeakingState('ai_speaking');
        break;

      case 'speaking_stopped':
        setSpeakingState('idle');
        break;

      case 'user_speaking':
        setSpeakingState('user_speaking');
        break;

      case 'user_stopped_speaking':
        setSpeakingState('processing');
        break;

      case 'transcript':
        const transcriptData = event.data as { role: 'user' | 'assistant'; content: string };
        if (transcriptData) {
          setMessages(prev => [...prev, {
            role: transcriptData.role,
            content: transcriptData.content,
            timestamp: new Date()
          }]);
        }
        break;

      case 'error':
        console.error('Realtime error:', event.data);
        setError('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
        setConnectionState('error');
        break;
    }
  }, []);

  // Start the voice conversation
  const startConversation = useCallback(async () => {
    // Prevent multiple simultaneous starts
    if (isStartingRef.current) return;
    isStartingRef.current = true;
    
    setConnectionState('connecting');
    setError(null);
    setMessages([]);

    try {
      const session = createVoiceTutorSession(
        questionText,
        explanation,
        studentAnswer,
        correctAnswer
      );

      session.on('all', handleRealtimeEvent);
      sessionRef.current = session;

      await session.connect();
    } catch (err) {
      console.error('Failed to start conversation:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Ses bağlantısı kurulamadı. Mikrofon izinlerini kontrol edin.'
      );
      setConnectionState('error');
    } finally {
      isStartingRef.current = false;
    }
  }, [questionText, explanation, studentAnswer, correctAnswer, handleRealtimeEvent]);
  
  // Auto-start conversation when modal opens (only if permission is already granted)
  useEffect(() => {
    if (isOpen && autoStart && !hasAutoStartedRef.current && connectionState === 'disconnected' && !isStartingRef.current) {
      // Check if microphone permission is already granted
      if (isMicrophonePermissionGranted()) {
        hasAutoStartedRef.current = true;
        // Small delay to ensure modal is fully rendered
        const timer = setTimeout(() => {
          startConversation();
        }, 300);
        return () => clearTimeout(timer);
      }
      // If permission not granted, don't auto-start - show the button instead
    }
    
    // Reset auto-start flag when modal closes
    if (!isOpen) {
      hasAutoStartedRef.current = false;
    }
  }, [isOpen, autoStart, connectionState, startConversation]);

  // End the voice conversation
  const endConversation = () => {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
    }
    setConnectionState('disconnected');
    setSpeakingState('idle');
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, we would mute the audio track
  };

  // Toggle AI volume
  const toggleAiVolume = () => {
    setAiVolume(!aiVolume);
    // In a real implementation, we would mute the AI audio output
  };

  // Handle close
  const handleClose = () => {
    endConversation();
    onClose();
  };

  // Get status message based on state
  const getStatusMessage = () => {
    switch (connectionState) {
      case 'connecting':
        return 'Bağlanıyor...';
      case 'connected':
        switch (speakingState) {
          case 'ai_speaking':
            return 'Öğretmen konuşuyor...';
          case 'user_speaking':
            return 'Sizi dinliyorum...';
          case 'processing':
            return 'İşleniyor...';
          default:
            return 'Konuşabilirsiniz';
        }
      case 'error':
        return 'Bağlantı hatası';
      default:
        return 'Bağlantı kesik';
    }
  };

  // Get animation class based on state
  const getAnimationClass = () => {
    if (connectionState !== 'connected') return '';
    
    switch (speakingState) {
      case 'ai_speaking':
        return 'ai-speaking';
      case 'user_speaking':
        return 'user-speaking';
      case 'processing':
        return 'processing';
      default:
        return 'idle-connected';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="voice-tutor-overlay" onClick={handleClose}>
      <div className="voice-tutor-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="voice-tutor-header">
          <div className="voice-tutor-title">
            <Sparkles size={24} className="sparkle-icon" />
            <h2>Sesli Öğretmen</h2>
          </div>
          <button className="close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        {/* Main Content */}
        <div className="voice-tutor-content">
          {/* Visual Indicator */}
          <div className={`voice-indicator ${getAnimationClass()}`}>
            <div className="voice-ring ring-1"></div>
            <div className="voice-ring ring-2"></div>
            <div className="voice-ring ring-3"></div>
            <div className="voice-center">
              {connectionState === 'connecting' ? (
                <Loader2 size={40} className="spinner" />
              ) : connectionState === 'connected' ? (
                speakingState === 'ai_speaking' ? (
                  <Volume2 size={40} />
                ) : speakingState === 'user_speaking' ? (
                  <Mic size={40} />
                ) : (
                  <MessageCircle size={40} />
                )
              ) : (
                <MicOff size={40} />
              )}
            </div>
          </div>

          {/* Status */}
          <div className="voice-status">
            <span className={`status-dot ${connectionState}`}></span>
            <span className="status-text">{getStatusMessage()}</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="voice-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Transcript */}
          {messages.length > 0 && (
            <div className="voice-transcript">
              <h3>Konuşma</h3>
              <div className="transcript-messages">
                {messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`transcript-message ${msg.role}`}
                  >
                    <span className="message-role">
                      {msg.role === 'assistant' ? '🎓 Öğretmen' : '👤 Sen'}
                    </span>
                    <p className="message-content">{msg.content}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Show instructions when waiting for user to start */}
          {connectionState === 'disconnected' && !error && (
            <div className="voice-instructions">
              <h3>🎓 Sesli Öğretmen Hazır!</h3>
              <p className="voice-ready-text">
                Hatalı cevabınızı sesli olarak açıklayacağım ve sorularınızı yanıtlayacağım.
              </p>
              <ul>
                <li>📖 Hatanızı açıklayacağım</li>
                <li>❓ Takip soruları sorabilirsiniz</li>
                <li>🗣️ Mikrofona konuşarak soru sorun</li>
              </ul>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="voice-tutor-controls">
          {connectionState === 'connected' && (
            <>
              <button 
                className={`control-btn mute-btn ${isMuted ? 'muted' : ''}`}
                onClick={toggleMute}
                title={isMuted ? 'Mikrofonu Aç' : 'Mikrofonu Kapat'}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              <button 
                className={`control-btn volume-btn ${!aiVolume ? 'muted' : ''}`}
                onClick={toggleAiVolume}
                title={aiVolume ? 'Sesi Kapat' : 'Sesi Aç'}
              >
                {aiVolume ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </button>
            </>
          )}

          {connectionState === 'connecting' ? (
            <button className="control-btn call-btn connecting" disabled>
              <Loader2 size={24} className="spinner" />
              <span>Bağlanıyor...</span>
            </button>
          ) : connectionState === 'connected' ? (
            <button 
              className="control-btn call-btn end"
              onClick={endConversation}
            >
              <PhoneOff size={24} />
              <span>Konuşmayı Bitir</span>
            </button>
          ) : connectionState === 'error' ? (
            <button 
              className="control-btn call-btn start"
              onClick={startConversation}
            >
              <Phone size={24} />
              <span>Tekrar Dene</span>
            </button>
          ) : (
            // Show start button - user needs to click once to grant microphone permission
            <button 
              className="control-btn call-btn start"
              onClick={startConversation}
            >
              <Mic size={24} />
              <span>Mikrofonu Aç ve Başla</span>
            </button>
          )}
        </div>

        {/* Tip */}
        <div className="voice-tutor-tip">
          💡 İpucu: Öğretmene "Neden yanlış?" "Bunu daha basit açıklar mısın?" veya "Başka bir örnek verir misin?" gibi sorular sorabilirsiniz.
        </div>
      </div>
    </div>
  );
};

