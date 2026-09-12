import { useListeningAudio } from '../hooks/useListeningAudio';
import '../listening.css';
import { PageBack } from './LearningLayout';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  BarChart3,
  Clock,
  Target,
  RefreshCw,
  List,
  Volume2,
  CheckCircle,
  FileText,
  BookPlus,
  Award
} from 'lucide-react';
import {
  ListeningTest,
  ListeningAnswer,
  ListeningProgress,
  ListeningStats,
  ListeningPassageType,
  LISTENING_PASSAGE_LABELS,
  LISTENING_QUESTION_TYPE_LABELS,
  ListeningQuestionType
} from '../types';

interface ListeningPracticeProps {
  isOpen: boolean;
  onClose: () => void;
  tests: ListeningTest[];
  completedTestIds: string[];
  stats: ListeningStats;
  onAnswerQuestion: (testId: string, questionId: number, answer: string, isCorrect: boolean, questionType: ListeningQuestionType) => Promise<void>;
  onCompleteTest: (testId: string, score: number, section: ListeningPassageType, difficulty: string, questionTypeResults: Record<ListeningQuestionType, { correct: number; total: number }>, audioPlayCount: number) => Promise<void>;
  getProgress: (testId: string) => Promise<ListeningProgress | null>;
  onResetProgress: (testId: string) => Promise<void>;
  onAddToVault?: (word: string, questionContext: string, sourceId: string, questionId: number) => void;
  vocabWordsInVault?: string[];
}

type ViewMode = 'list' | 'test' | 'results' | 'stats';


export const ListeningPractice = ({
  isOpen,
  onClose,
  tests,
  completedTestIds,
  stats,
  onAnswerQuestion,
  onCompleteTest,
  getProgress,
  onResetProgress,
  onAddToVault,
  vocabWordsInVault = []
}: ListeningPracticeProps) => {
  const [params, setParams] = useSearchParams();
  const selectedTest = tests.find(test => test.id === params.get('test')) || null;
  const setSelectedTest = (test: ListeningTest | null) => setParams(test ? { test: test.id } : {});
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentAnswers, setCurrentAnswers] = useState<Map<number, ListeningAnswer>>(new Map());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [filterSection, setFilterSection] = useState<ListeningPassageType | 'all'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  // Audio state
  const { audioState, audioProgress, audioDuration, audioError, play, pause: pauseAudio, resume: resumeAudio, stop: stopAudio, seek, replayTurn } = useListeningAudio(selectedTest);
  const [audioPlayCount, setAudioPlayCount] = useState(0);
  const isSpeaking = audioState === 'playing';
  const [showQuestions, setShowQuestions] = useState(false);
  const [notes, setNotes] = useState('');
  const [draftChoices, setDraftChoices] = useState<Map<number, string[]>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const savingRef = useRef(false);
  const activeTestRef = useRef(selectedTest?.id);
  activeTestRef.current = selectedTest?.id;
  const [progressLoading, setProgressLoading] = useState(Boolean(selectedTest));
  const [progressError, setProgressError] = useState('');
  const [loadVersion, setLoadVersion] = useState(0);
  const busy = isSaving || progressLoading || Boolean(progressError);
  const [showTranscript, setShowTranscript] = useState(false);


  // Vocab vault state
  const [showVocabOptions, setShowVocabOptions] = useState<number | null>(null);

  useEffect(() => {
    setViewMode(selectedTest ? 'test' : 'list');
    setShowQuestions(false);
    setNotes('');
    setSaveError('');
    setShowVocabOptions(null);
    setAudioPlayCount(0);
    setCurrentQuestionIndex(0);
    setCurrentAnswers(new Map());
    setShowTranscript(false);
    setDraftChoices(new Map());
    stopAudio();
  }, [selectedTest?.id]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setViewMode('list');
      setSelectedTest(null);
      setCurrentAnswers(new Map());
      setCurrentQuestionIndex(0);
      setAudioPlayCount(0);
      setShowTranscript(false);
      setDraftChoices(new Map());
      stopAudio();
    }
  }, [isOpen]);

  // Load existing progress when selecting a test
  useEffect(() => {
    let isMounted = true;
    setProgressLoading(Boolean(selectedTest));
    setProgressError('');
    if (selectedTest) {
      const load = async () => {
        try {
          const progress = await getProgress(selectedTest.id);
          if (!isMounted) return;
          if (progress && progress.answers) {
            setShowQuestions(true);
            if (progress.answers instanceof Map) {
              setCurrentAnswers(new Map(progress.answers));
            } else {
              const answersMap = new Map<number, ListeningAnswer>();
              Object.entries(progress.answers).forEach(([key, value]) => {
                answersMap.set(parseInt(key), value as ListeningAnswer);
              });
              setCurrentAnswers(answersMap);
            }
            setAudioPlayCount(progress.audioPlayCount || 0);
          } else {
            setCurrentAnswers(new Map());
            setAudioPlayCount(0);
          }
          setDraftChoices(new Map());
        } catch (error) {
          console.error("Failed to fetch listening progress", error);
          if (isMounted) {
            setProgressError('Kayıtlı ilerlemeniz yüklenemedi. Cevaplamadan önce tekrar deneyin.');
          }
        } finally {
          if (isMounted) setProgressLoading(false);
        }
      };
      load();
    }
    return () => { isMounted = false; };
  }, [selectedTest, getProgress, loadVersion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Filter tests
  const filteredTests = useMemo(() => {
    return tests.filter(t => {
      if (filterSection !== 'all' && t.section !== filterSection) return false;
      if (filterDifficulty !== 'all' && t.difficulty !== filterDifficulty) return false;
      return true;
    });
  }, [tests, filterSection, filterDifficulty]);

  // Calculate current test progress
  const currentProgress = useMemo(() => {
    if (!selectedTest) return { answered: 0, correct: 0, total: 0 };
    const total = selectedTest.questions.length;
    const answered = currentAnswers.size;
    const correct = Array.from(currentAnswers.values()).filter(a => a.isCorrect).length;
    return { answered, correct, total };
  }, [selectedTest, currentAnswers]);

  const playAudio = async () => {
    if (await play()) setAudioPlayCount(count => count + 1);
  };
  const restartAudio = () => { void playAudio(); };

  // Handle starting a test
  const handleStartTest = (test: ListeningTest) => {
    setSelectedTest(test);
    setCurrentQuestionIndex(0);
    setViewMode('test');
    setShowTranscript(false);
  };

  // Persist one answer at a time so rapid navigation cannot overwrite saved answers.
  const handleAnswer = async (questionId: number, selectedAnswer: string) => {
    if (!selectedTest || busy || savingRef.current || currentAnswers.has(questionId)) return;
    const question = selectedTest.questions.find(q => q.id === questionId);
    if (!question) return;
    savingRef.current = true;
    setIsSaving(true);
    setSaveError('');
    const normalized = selectedAnswer.split(',').sort().join(',');
    const isCorrect = normalized === question.correctAnswer.split(',').sort().join(',');
    const newAnswers = new Map(currentAnswers);
    newAnswers.set(questionId, { questionId, selectedAnswer: normalized, isCorrect, explanation: question.explanation });
    try {
      await onAnswerQuestion(selectedTest.id, questionId, normalized, isCorrect, question.questionType);
      if (newAnswers.size === selectedTest.questions.length) {
        const correct = Array.from(newAnswers.values()).filter(a => a.isCorrect).length;
        const questionTypeResults = {} as Record<ListeningQuestionType, { correct: number; total: number }>;
        selectedTest.questions.forEach(q => {
          questionTypeResults[q.questionType] ??= { correct: 0, total: 0 };
          questionTypeResults[q.questionType].total += 1;
          if (newAnswers.get(q.id)?.isCorrect) questionTypeResults[q.questionType].correct += 1;
        });
        await onCompleteTest(selectedTest.id, Math.round(correct / selectedTest.questions.length * 100), selectedTest.section, selectedTest.difficulty, questionTypeResults, audioPlayCount);
      }
      if (activeTestRef.current === selectedTest.id) setCurrentAnswers(newAnswers);
    } catch {
      if (activeTestRef.current === selectedTest.id) setSaveError('Cevabınız kaydedilemedi. Lütfen aynı cevabı tekrar gönderin.');
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  };

  // Handle navigation
  const handleNextQuestion = () => {
    if (selectedTest && currentQuestionIndex < selectedTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle view results
  const handleViewResults = async () => {
    if (!selectedTest || busy) return;
    setIsSaving(true);
    try {
      const questionTypeResults = {} as Record<ListeningQuestionType, { correct: number; total: number }>;
      selectedTest.questions.forEach(q => {
        questionTypeResults[q.questionType] ??= { correct: 0, total: 0 };
        questionTypeResults[q.questionType].total++;
        if (currentAnswers.get(q.id)?.isCorrect) questionTypeResults[q.questionType].correct++;
      });
      await onCompleteTest(selectedTest.id, Math.round(currentProgress.correct / currentProgress.total * 100), selectedTest.section, selectedTest.difficulty, questionTypeResults, audioPlayCount);
      if (activeTestRef.current === selectedTest.id) { setViewMode('results'); stopAudio(); setSaveError(''); }
    } catch {
      if (activeTestRef.current === selectedTest.id) setSaveError('Sonuçlar kaydedilemedi. Sonuçlar düğmesiyle tekrar deneyin.');
    } finally { setIsSaving(false); }
  };

  // Handle back to list
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedTest(null);
    setCurrentAnswers(new Map());
    setCurrentQuestionIndex(0);
    stopAudio();
    setShowTranscript(false);
    setDraftChoices(new Map());
  };

  // Handle reset test
  const handleReset = async () => {
    if (selectedTest) {
      try {
        await onResetProgress(selectedTest.id);
      } catch {
        setSaveError('Test sıfırlanamadı. Lütfen tekrar deneyin.');
        return;
      }
      setViewMode('test');
      setShowQuestions(false);
      setShowTranscript(false);
      setNotes('');
      setSaveError('');
      setCurrentAnswers(new Map());
      setCurrentQuestionIndex(0);
      setAudioPlayCount(0);
      stopAudio();
      setDraftChoices(new Map());
    }
  };

  // Get section color
  const getSectionColor = (section: ListeningPassageType) => {
    switch (section) {
      case 'conversation': return 'var(--accent-green)';
      case 'lecture': return 'var(--accent-primary)';
      default: return 'var(--text-secondary)';
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'var(--accent-green)';
      case 'medium': return 'var(--accent-yellow)';
      case 'hard': return 'var(--accent-red)';
      default: return 'var(--text-secondary)';
    }
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--accent-green)';
    if (score >= 60) return 'var(--accent-yellow)';
    if (score >= 40) return 'var(--accent-orange)';
    return 'var(--accent-red)';
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Extract vocabulary words from question text and options
  const extractVocabWords = (question: ListeningTest['questions'][0]): string[] => {
    const words: string[] = [];

    // Extract from question text
    const questionWords = question.questionText.split(/[\s,;.!?()]+/)
      .filter(w => w.length > 4 && /^[a-zA-Z]+$/.test(w))
      .map(w => w.toLowerCase());
    words.push(...questionWords);

    // Extract words from options if they exist
    if (question.options) {
      question.options.forEach(opt => {
        const optionWords = opt.text.split(/[\s,;.!?()]+/)
          .filter(w => w.length > 4 && /^[a-zA-Z]+$/.test(w))
          .map(w => w.toLowerCase());
        words.push(...optionWords);
      });
    }

    // Get unique words
    return [...new Set(words)].slice(0, 8);
  };

  // Handle adding word to vault
  const handleAddToVault = (word: string, context: string, questionId: number) => {
    if (selectedTest && onAddToVault) {
      onAddToVault(word, context, `listening-${selectedTest.id}`, questionId);
    }
  };

  if (!isOpen) return null;

  const currentQuestion = selectedTest?.questions[currentQuestionIndex];

  return (
    <div className="activity-page">
      <div className="listening-panel activity-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="listening-header">
          <div className="listening-title">
            <Headphones size={24} />
            <h2>TOEFL Dinleme</h2>
          </div>
          <div className="listening-header-actions">
            <button
              className={`mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={handleBackToList}
            >
              <List size={18} />
              <span>Testler</span>
            </button>
            <button
              className={`mode-btn ${viewMode === 'stats' ? 'active' : ''}`}
              onClick={() => { stopAudio(); setViewMode('stats'); }}
            >
              <BarChart3 size={18} />
              <span>İstatistikler</span>
            </button>
          </div>
          <PageBack onClick={onClose} />
        </div>

        {/* Content */}
        <div className="listening-content">
          {/* List View */}
          {viewMode === 'list' && (
            <div className="test-list-view">
              <div className="toefl-intro">
                <div><span className="toefl-eyebrow">LISTEN · TAKE NOTES · UNDERSTAND</span>
                <h3>Kampüsten sınıfa, İngilizceyi dinleyerek keşfet.</h3>
                <p>2 conversation · 4 lecture · 34 soru. Önce dinleyin ve not alın, ardından soruları cevaplayın.</p></div>
                <span className="toefl-practice-label">TOEFL tarzı pratik</span>
              </div>
              {/* Passage filter */}
              <div className="filter-bar">
                <div className="filter-group">
                  <span className="filter-label">Tür:</span>
                  <div className="filter-buttons">
                    <button
                      className={`filter-btn ${filterSection === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterSection('all')}
                    >
                      Tümü
                    </button>
                    {(['conversation', 'lecture'] as ListeningPassageType[]).map(sec => (
                      <button
                        key={sec}
                        className={`filter-btn ${filterSection === sec ? 'active' : ''}`}
                        onClick={() => setFilterSection(sec)}
                        style={{ '--filter-color': getSectionColor(sec) } as React.CSSProperties}
                      >
                        {LISTENING_PASSAGE_LABELS[sec]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="filter-group">
                  <span className="filter-label">Zorluk:</span>
                  <div className="filter-buttons">
                    <button
                      className={`filter-btn ${filterDifficulty === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterDifficulty('all')}
                    >
                      Tümü
                    </button>
                    {['easy', 'medium', 'hard'].map(diff => (
                      <button
                        key={diff}
                        className={`filter-btn ${filterDifficulty === diff ? 'active' : ''}`}
                        onClick={() => setFilterDifficulty(diff)}
                        style={{ '--filter-color': getDifficultyColor(diff) } as React.CSSProperties}
                      >
                        {diff === 'easy' ? 'Kolay' : diff === 'medium' ? 'Orta' : 'Zor'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Test Cards */}
              <div className="test-grid">
                {filteredTests.map(test => {
                  const isCompleted = completedTestIds.includes(test.id);

                  return (
                    <div
                      key={test.id}
                      className={`test-card ${isCompleted ? 'completed' : ''}`}
                    >
                      <div className="test-card-header">
                        <span
                          className="section-tag"
                          style={{ backgroundColor: getSectionColor(test.section) }}
                        >
                          {LISTENING_PASSAGE_LABELS[test.section]}
                        </span>
                        <span
                          className="difficulty-tag"
                          style={{ backgroundColor: getDifficultyColor(test.difficulty) }}
                        >
                          {test.difficulty === 'easy' ? 'Kolay' : test.difficulty === 'medium' ? 'Orta' : 'Zor'}
                        </span>
                        {isCompleted && (
                          <span className="completed-badge">
                            <CheckCircle size={16} />
                          </span>
                        )}
                      </div>
                      <h3 className="test-card-title">{test.title}</h3>
                      <p className="test-card-topic">{test.topic}</p>
                      <p className="toefl-card-context">{test.context}</p>
                      <div className="test-card-meta">
                        <span>
                          <Clock size={14} />
                          {formatTime(test.duration)}
                        </span>
                        <span>
                          <Target size={14} />
                          {test.questions.length} soru
                        </span>
                        {test.section === 'conversation' && <span><Volume2 size={14} />2 farklı ses</span>}
                      </div>
                      <button
                        className="start-btn"
                        onClick={() => handleStartTest(test)}
                      >
                        <Headphones size={18} />
                        <span>{isCompleted ? 'Sonuçlar / Devam' : 'Başla'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {filteredTests.length === 0 && (
                <div className="empty-state-listening">
                  <Headphones size={48} />
                  <p>Bu filtrelere uygun test bulunamadı.</p>
                </div>
              )}
            </div>
          )}

          {/* Test View */}
          {viewMode === 'test' && selectedTest && currentQuestion && (
            <div className="test-view">
              {/* Test Header */}
              <div className="test-header-info">
                <div className="test-info">
                  <h3>{selectedTest.title}</h3>
                  <div className="test-badges">
                    <span style={{ backgroundColor: getSectionColor(selectedTest.section) }}>
                      {LISTENING_PASSAGE_LABELS[selectedTest.section]}
                    </span>
                    <span style={{ backgroundColor: getDifficultyColor(selectedTest.difficulty) }}>
                      {selectedTest.difficulty === 'easy' ? 'Kolay' : selectedTest.difficulty === 'medium' ? 'Orta' : 'Zor'}
                    </span>
                  </div>
                </div>
                <div className="audio-play-count">
                  <Volume2 size={16} />
                  <span>Dinleme: {audioPlayCount}</span>
                </div>
              </div>

              <p className="toefl-context">{selectedTest.context}</p>
              <p className="toefl-audio-label">Yapay zekâ ile seslendirilmiş özgün pratik kaydı</p>
              <div className="toefl-speakers">
                {Array.from(new Set(selectedTest.turns.map(turn => turn.speaker))).map(speaker => {
                  const active = isSpeaking && selectedTest.turns.some(turn => turn.speaker === speaker && audioProgress >= (turn.startTime ?? 0) && audioProgress < (turn.endTime ?? 0));
                  return <span key={speaker} className={`toefl-speaker ${active ? 'active' : ''}`}><Volume2 size={15} />{speaker}</span>;
                })}
              </div>
              {/* Audio Player */}
              <div className="audio-player">
                <div className="audio-controls">
                  {audioState === 'idle' || audioState === 'ended' ? (
                    <button className="audio-btn play" aria-label="Dinle" title="Dinle" onClick={playAudio}>
                      <Play size={24} />
                    </button>
                  ) : audioState === 'playing' || audioState === 'loading' ? (
                    <button className="audio-btn pause" aria-label="Duraklat" title="Duraklat" onClick={pauseAudio}>
                      <Pause size={24} />
                    </button>
                  ) : (
                    <button className="audio-btn play" aria-label="Devam et" title="Devam et" onClick={resumeAudio}>
                      <Play size={24} />
                    </button>
                  )}
                  <button className="audio-btn restart" aria-label="Baştan dinle" title="Baştan dinle" onClick={restartAudio}>
                    <RotateCcw size={20} />
                  </button>
                </div>

                <div className="audio-progress-container">
                  <input className="toefl-audio-seek" type="range" aria-label="Kayıtta ilerle" min={0} max={audioDuration || selectedTest.duration} step={0.1} value={audioProgress} onChange={e => seek(Number(e.target.value))} />
                  <div className="audio-time">
                    <span>{formatTime(audioProgress)}</span>
                    <span>/</span>
                    <span>{formatTime(audioDuration || selectedTest.duration)}</span>
                  </div>
                </div>

                <button
                  className={`transcript-toggle ${showTranscript ? 'active' : ''}`}
                  onClick={() => setShowTranscript(!showTranscript)}
                >
                  <FileText size={18} />
                  <span>Transkript</span>
                </button>
              </div>

              {audioError && <p role="alert" className="toefl-error">{audioError}</p>}
              {audioState === 'loading' && <p role="status" className="toefl-audio-label">Ses yükleniyor...</p>}
              {/* Speaking indicator */}
              {isSpeaking && (
                <div className="speaking-indicator">
                  <div className="sound-wave">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span>Dinliyorsunuz...</span>
                </div>
              )}

              {/* Transcript (collapsible) */}
              {showTranscript && (
                <div className="transcript-panel">
                  <div className="transcript-content">
                    {selectedTest.turns.map((turn, idx) => (
                      <p key={idx}><strong>{turn.speaker}: </strong>{turn.text}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="toefl-notes">
                <label htmlFor="listening-notes">Dinleme notları</label>
                <textarea id="listening-notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Main idea, examples, speaker attitude..." rows={4} />
              </div>
              {!showQuestions && <div className="toefl-listen-first">
                <h4>Önce dinleyin, sonra soruları cevaplayın.</h4>
                <p>Ana fikre, örneklere ve konuşmacıların amacına odaklanın. Notlarınızı soruları cevaplarken kullanabilirsiniz.</p>
                <button className="start-btn" onClick={() => { pauseAudio(); setShowQuestions(true); }}>Sorulara Geç <ChevronRight size={18} /></button>
              </div>}
              {saveError && <p role="alert" className="toefl-error">{saveError}</p>}
              {progressLoading && <p role="status">İlerlemeniz yükleniyor...</p>}
              {progressError && <div className="toefl-error" role="alert">{progressError} <button className="toefl-excerpt" onClick={() => setLoadVersion(v => v + 1)}>Tekrar Dene</button></div>}
              {showQuestions && <>
              {/* Progress Bar */}
              <div className="listening-progress-bar">
                <div className="progress-info">
                  <span>{currentProgress.answered} / {currentProgress.total} soru cevaplandı</span>
                  <span className="correct-count">
                    <Check size={14} />
                    {currentProgress.correct} doğru
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${(currentProgress.answered / currentProgress.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="question-section-listening">
                <div className="question-nav-listening">
                  <span className="question-counter">
                    Soru {currentQuestionIndex + 1} / {selectedTest.questions.length}
                  </span>
                  <span className="question-type-badge">
                    {LISTENING_QUESTION_TYPE_LABELS[currentQuestion.questionType]}
                  </span>
                </div>

                <div className="question-content-listening">
                  {currentQuestion.replayTurnIndex !== undefined && <button className="toefl-excerpt" onClick={() => void replayTurn(currentQuestion.replayTurnIndex!)}><Volume2 size={17} />İlgili Bölümü Dinle</button>}
                  <p className="question-text">{currentQuestion.questionText}</p>

                  {/* Multiple Choice Options */}
                  {currentQuestion.options && (
                    <div className="options-list">
                      {currentQuestion.options.map(option => {
                        const answer = currentAnswers.get(currentQuestion.id);
                        const isSelected = answer ? answer.selectedAnswer.split(',').includes(option.letter) : (draftChoices.get(currentQuestion.id) || []).includes(option.letter);
                        const isCorrect = currentQuestion.correctAnswer.split(',').includes(option.letter);
                        const showResult = answer !== undefined;

                        let optionClass = 'listening-option';
                        if (showResult) {
                          if (isCorrect) optionClass += ' correct';
                          else if (isSelected) optionClass += ' incorrect';
                        }
                        if (isSelected) optionClass += ' selected';

                        return (
                          <button
                            key={option.letter}
                            className={optionClass}
                            onClick={() => {
                              if ((currentQuestion.answerCount || 1) === 1) { void handleAnswer(currentQuestion.id, option.letter); return; }
                              const choices = draftChoices.get(currentQuestion.id) || [];
                              const next = choices.includes(option.letter) ? choices.filter(letter => letter !== option.letter) : [...choices, option.letter];
                              if (next.length <= (currentQuestion.answerCount || 1)) setDraftChoices(new Map(draftChoices).set(currentQuestion.id, next));
                            }}
                            aria-pressed={isSelected}
                            disabled={answer !== undefined || busy}
                          >
                            <span className="option-letter">{option.letter}</span>
                            <span className="option-text">{option.text}</span>
                            {showResult && isCorrect && <Check size={18} className="option-icon" />}
                            {showResult && isSelected && !isCorrect && <X size={18} className="option-icon" />}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {(currentQuestion.answerCount || 1) > 1 && !currentAnswers.has(currentQuestion.id) && <div className="toefl-multi-submit">
                    <span>{(draftChoices.get(currentQuestion.id) || []).length} / {currentQuestion.answerCount} seçenek seçildi</span>
                    <button className="submit-btn" disabled={busy || (draftChoices.get(currentQuestion.id) || []).length !== currentQuestion.answerCount} onClick={() => void handleAnswer(currentQuestion.id, (draftChoices.get(currentQuestion.id) || []).join(','))}>Cevabı Gönder</button>
                  </div>}
                  {isSaving && <p role="status">Cevabınız kaydediliyor...</p>}
                  {/* Explanation */}
                  {currentAnswers.has(currentQuestion.id) && currentQuestion.explanation && (
                    <div className={`question-explanation ${currentAnswers.get(currentQuestion.id)?.isCorrect ? 'correct' : 'incorrect'}`}>
                      <div className="explanation-header">
                        {currentAnswers.get(currentQuestion.id)?.isCorrect ? (
                          <>
                            <Check size={18} />
                            <span>Doğru!</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={18} />
                            <span>Yanlış</span>
                          </>
                        )}
                      </div>
                      <p>{currentQuestion.explanation}</p>
                    </div>
                  )}

                  {/* Vocab Vault Option - show for incorrect answers */}
                  {currentAnswers.has(currentQuestion.id) &&
                    !currentAnswers.get(currentQuestion.id)?.isCorrect &&
                    onAddToVault && (
                      <div className="vocab-section listening-vocab">
                        <button
                          className="vocab-toggle"
                          onClick={() => setShowVocabOptions(
                            showVocabOptions === currentQuestion.id ? null : currentQuestion.id
                          )}
                        >
                          <BookPlus size={18} />
                          <span>Kelime Kasasına Ekle</span>
                          {showVocabOptions === currentQuestion.id ? (
                            <ChevronLeft size={16} style={{ transform: 'rotate(-90deg)' }} />
                          ) : (
                            <ChevronLeft size={16} style={{ transform: 'rotate(-90deg)', opacity: 0.5 }} />
                          )}
                        </button>

                        {showVocabOptions === currentQuestion.id && (
                          <div className="vocab-options">
                            {extractVocabWords(currentQuestion).map(word => {
                              const isInVault = vocabWordsInVault.includes(word.toLowerCase());
                              return (
                                <button
                                  key={word}
                                  className={`vocab-word-btn ${isInVault ? 'in-vault' : ''}`}
                                  onClick={() => !isInVault && handleAddToVault(
                                    word,
                                    currentQuestion.questionText,
                                    currentQuestion.id
                                  )}
                                  disabled={isInVault}
                                >
                                  <span>{word}</span>
                                  {isInVault ? (
                                    <Check size={14} />
                                  ) : (
                                    <BookPlus size={14} />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                </div>

                {/* Question Navigation */}
                <div className="question-navigation">
                  <button
                    className="nav-btn"
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0 || isSaving}
                  >
                    <ChevronLeft size={20} />
                    <span>Önceki</span>
                  </button>

                  <div className="question-dots">
                    {selectedTest.questions.map((q, idx) => {
                      const answer = currentAnswers.get(q.id);
                      let dotClass = 'dot';
                      if (idx === currentQuestionIndex) dotClass += ' current';
                      if (answer?.isCorrect) dotClass += ' correct';
                      else if (answer) dotClass += ' incorrect';

                      return (
                        <button
                          key={q.id}
                          className={dotClass}
                          disabled={isSaving}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          title={`Soru ${idx + 1}`}
                        />
                      );
                    })}
                  </div>

                  {currentQuestionIndex < selectedTest.questions.length - 1 ? (
                    <button
                      className="nav-btn"
                      onClick={handleNextQuestion}
                      disabled={isSaving}
                    >
                      <span>Sonraki</span>
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button
                      className="nav-btn results"
                      onClick={handleViewResults}
                      disabled={busy || currentProgress.answered < currentProgress.total}
                    >
                      <span>Sonuçlar</span>
                      <Award size={20} />
                    </button>
                  )}
                </div>
              </div>
              </>}
            </div>
          )}

          {/* Results View */}
          {viewMode === 'results' && selectedTest && (
            <div className="results-view">
              <div className="results-header">
                <h3>{selectedTest.title}</h3>
                <p className="results-subtitle">Sonuçlarınız</p>
              </div>

              {/* Score Display */}
              <div className="score-display">
                <div
                  className="score-circle"
                  style={{
                    background: `conic-gradient(${getScoreColor(Math.round((currentProgress.correct / currentProgress.total) * 100))} ${(currentProgress.correct / currentProgress.total) * 360}deg, var(--bg-tertiary) 0deg)`
                  }}
                >
                  <div className="score-inner">
                    <span className="score-value" style={{ color: getScoreColor(Math.round((currentProgress.correct / currentProgress.total) * 100)) }}>
                      {Math.round((currentProgress.correct / currentProgress.total) * 100)}%
                    </span>
                    <span className="score-label">Pratik Başarısı</span>
                  </div>
                </div>
                <div className="score-details">
                  <div className="detail-item correct">
                    <Check size={20} />
                    <span>{currentProgress.correct} Doğru</span>
                  </div>
                  <div className="detail-item incorrect">
                    <X size={20} />
                    <span>{currentProgress.total - currentProgress.correct} Yanlış</span>
                  </div>
                  <div className="detail-item total">
                    <Target size={20} />
                    <span>{currentProgress.total} Toplam</span>
                  </div>
                  <div className="detail-item plays">
                    <Volume2 size={20} />
                    <span>{audioPlayCount} Dinleme</span>
                  </div>
                </div>
              </div>

              <p className="toefl-audio-label">Bu yüzde, bu pratikteki doğruluk oranınızdır; resmi TOEFL puanı değildir.</p>
              {saveError && <p role="alert" className="toefl-error">{saveError}</p>}
              {/* Question Review */}
              <div className="question-review">
                <h4>Soru Detayları</h4>
                {selectedTest.questions.map((question, idx) => {
                  const answer = currentAnswers.get(question.id);
                  return (
                    <div
                      key={question.id}
                      className={`review-item ${answer?.isCorrect ? 'correct' : 'incorrect'}`}
                    >
                      <div className="review-header">
                        <span className="review-number">#{idx + 1}</span>
                        <span className="review-type">
                          {LISTENING_QUESTION_TYPE_LABELS[question.questionType]}
                        </span>
                        {answer?.isCorrect ? (
                          <Check size={18} className="review-icon correct" />
                        ) : (
                          <X size={18} className="review-icon incorrect" />
                        )}
                      </div>
                      <p className="review-question">{question.questionText}</p>
                      <p className="toefl-review-explanation">{question.explanation}</p>
                      {!answer?.isCorrect && (
                        <div className="review-answer">
                          <span className="wrong-answer">
                            Cevabınız: {question.options.filter(option => answer?.selectedAnswer.split(',').includes(option.letter)).map(option => `${option.letter}. ${option.text}`).join('; ')}
                          </span>
                          <span className="correct-answer">
                            Doğru: {question.options.filter(option => question.correctAnswer.split(',').includes(option.letter)).map(option => `${option.letter}. ${option.text}`).join('; ')}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="results-actions">
                <button className="action-btn secondary" onClick={handleReset}>
                  <RefreshCw size={18} />
                  <span>Tekrar Dene</span>
                </button>
                <button className="action-btn primary" onClick={handleBackToList}>
                  <List size={18} />
                  <span>Test Listesi</span>
                </button>
              </div>
            </div>
          )}

          {/* Stats View */}
          {viewMode === 'stats' && (
            <div className="stats-view">
              <div className="stats-grid">
                <div className="stat-card">
                  <Award size={32} />
                  <div className="stat-info">
                    <span className="stat-value">{stats.totalTestsCompleted}</span>
                    <span className="stat-label">Tamamlanan Test</span>
                  </div>
                </div>
                <div className="stat-card">
                  <Target size={32} />
                  <div className="stat-info">
                    <span className="stat-value">{stats.totalQuestionsAnswered}</span>
                    <span className="stat-label">Cevaplanan Soru</span>
                  </div>
                </div>
                <div className="stat-card">
                  <Check size={32} />
                  <div className="stat-info">
                    <span className="stat-value">{stats.totalCorrect}</span>
                    <span className="stat-label">Doğru Cevap</span>
                  </div>
                </div>
                <div className="stat-card">
                  <BarChart3 size={32} />
                  <div className="stat-info">
                    <span className="stat-value" style={{ color: getScoreColor(stats.averageScore) }}>
                      %{stats.averageScore}
                    </span>
                    <span className="stat-label">Ortalama Başarı</span>
                  </div>
                </div>
              </div>

              {/* Section Performance */}
              {Object.values(stats.testsBySection).some(v => v > 0) && (
                <div className="section-performance">
                  <h4>Kayıt Türüne Göre Pratik</h4>
                  <div className="section-bars">
                    {(['conversation', 'lecture'] as ListeningPassageType[]).map(section => {
                      const count = stats.testsBySection[section] || 0;
                      const total = Object.values(stats.testsBySection).reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                      return (
                        <div key={section} className="section-bar-item">
                          <div className="section-bar-info">
                            <span style={{ color: getSectionColor(section) }}>
                              {LISTENING_PASSAGE_LABELS[section]}
                            </span>
                            <span>{count} test</span>
                          </div>
                          <div className="section-bar">
                            <div
                              className="section-bar-fill"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: getSectionColor(section)
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question Type Performance */}
              {Object.keys(stats.questionTypePerformance).length > 0 && (
                <div className="type-performance">
                  <h4>Soru Tipi Performansı</h4>
                  <div className="type-list">
                    {Object.entries(stats.questionTypePerformance).map(([type, perf]) => {
                      const percentage = perf.total > 0 ? Math.round((perf.correct / perf.total) * 100) : 0;
                      return (
                        <div key={type} className="type-item">
                          <div className="type-info">
                            <span className="type-name">
                              {LISTENING_QUESTION_TYPE_LABELS[type as ListeningQuestionType]}
                            </span>
                            <span className="type-count">{perf.correct}/{perf.total}</span>
                          </div>
                          <div className="type-bar">
                            <div
                              className="type-fill"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: getScoreColor(percentage)
                              }}
                            />
                          </div>
                          <span className="type-percentage" style={{ color: getScoreColor(percentage) }}>
                            %{percentage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {stats.totalTestsCompleted === 0 && (
                <div className="empty-stats">
                  <Headphones size={48} />
                  <p>Henüz test tamamlamadınız.</p>
                  <button onClick={() => setViewMode('list')}>
                    Testlere Göz At
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



