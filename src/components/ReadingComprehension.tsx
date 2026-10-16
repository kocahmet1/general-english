import { PageBack } from './LearningLayout';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef, Fragment } from 'react';
import {
  X,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  BarChart3,
  FileText,
  Target,
  Award,
  RefreshCw,
  List,
  Eye,
  CheckCircle,
  BookPlus,
  Lightbulb,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  ReadingPassage,
  ReadingQuestion,
  ReadingQuestionGroup,
  ReadingAnswer,
  ReadingProgress,
  ReadingStats,
  READING_QUESTION_TYPE_LABELS
} from '../types';
import { useActivitySession, percent } from '../hooks/useActivitySession';
import {
  countAnswerWords,
  evaluateReadingAnswer,
  formatReadingAnswer,
  getAnswerFormat,
  getGroupRange,
  getQuestionGroup,
  getQuestionOptions,
  isOverWordLimit
} from '../services/readingAnswers';
import '../reading-ielts.css';

interface ReadingComprehensionProps {
  isOpen: boolean;
  onClose: () => void;
  passages: ReadingPassage[];
  completedPassageIds: string[];
  stats: ReadingStats;
  onAnswerQuestion: (passageId: string, questionId: number, answer: string, isCorrect: boolean, questionType: string) => Promise<void>;
  onCompletePassage: (passageId: string, score: number, difficulty: string) => Promise<void>;
  getProgress: (passageId: string) => Promise<ReadingProgress | null>;
  onResetProgress: (passageId: string) => Promise<void>;
  onAddToVault?: (word: string, questionContext: string, sourceId: string, questionId: number) => void;
  vocabWordsInVault?: string[];
}

type ViewMode = 'list' | 'reading' | 'results' | 'stats';

export const ReadingComprehension = ({
  isOpen,
  onClose,
  passages,
  completedPassageIds,
  stats,
  onAnswerQuestion,
  onCompletePassage,
  getProgress,
  onResetProgress,
  onAddToVault,
  vocabWordsInVault = []
}: ReadingComprehensionProps) => {
  const [params, setParams] = useSearchParams();
  const selectedPassage = passages.find(passage => passage.id === params.get('passage')) || null;
  const setSelectedPassage = (passage: ReadingPassage | null) => setParams(passage ? { passage: passage.id } : {});
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [currentAnswers, setCurrentAnswers] = useState<Map<number, ReadingAnswer>>(new Map());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showPassageInQuestions, setShowPassageInQuestions] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterFormat, setFilterFormat] = useState<'all' | 'ielts' | 'classic'>('all');
  const [showVocabOptions, setShowVocabOptions] = useState<number | null>(null);
  // Typed answers for completion questions, kept until the student checks them.
  const [textDrafts, setTextDrafts] = useState<Record<number, string>>({});
  const passageTextRef = useRef<HTMLDivElement>(null);
  // Full-screen reading: passage and questions fill the screen, each scrolling on its own.
  const [isFocusMode, setIsFocusMode] = useState(false);
  const readingViewRef = useRef<HTMLDivElement>(null);

  // Activity log: one attempt per opened passage, rewritten after every answer.
  const readingSession = useActivitySession(selectedPassage?.id ?? null);
  const recordReadingAttempt = (passage: ReadingPassage, answers: Map<number, ReadingAnswer>) => {
    const total = passage.questions.length;
    const correct = Array.from(answers.values()).filter(a => a.isCorrect).length;
    readingSession.record({
      type: 'reading',
      title: passage.title,
      subtitle: passage.difficulty,
      itemId: passage.id,
      status: answers.size >= total ? 'completed' : 'in_progress',
      totalQuestions: total,
      answeredCount: answers.size,
      correctCount: correct,
      scorePercent: percent(correct, answers.size),
      details: [
        { label: 'Seviye', value: passage.difficulty },
        { label: 'Konu', value: passage.topic },
        { label: 'Metin uzunluğu', value: `${passage.wordCount} kelime` },
      ],
      questions: passage.questions
        .filter(q => answers.has(q.id))
        .map(q => {
          const answer = answers.get(q.id)!;
          return {
            prompt: q.questionText,
            given: formatReadingAnswer(passage, q, answer.selectedAnswer),
            expected: formatReadingAnswer(passage, q, q.correctAnswer),
            isCorrect: answer.isCorrect,
            tag: READING_QUESTION_TYPE_LABELS[q.questionType],
          };
        }),
    });
  };

  const enterFocusMode = () => {
    setIsFocusMode(true);
    // Real browser full screen where allowed (not on iPhone Safari); the CSS layout covers the screen either way.
    const element = readingViewRef.current;
    if (element?.requestFullscreen && !document.fullscreenElement) {
      element.requestFullscreen().catch(() => {});
    }
  };

  const exitFocusMode = () => {
    setIsFocusMode(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  };

  useEffect(() => {
    if (!isFocusMode) return;
    // Esc leaves browser full screen; follow it, and handle Esc ourselves when only the CSS layout is used.
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setIsFocusMode(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.fullscreenElement) setIsFocusMode(false);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isFocusMode]);

  // Results, the passage list and stats are normal pages again.
  useEffect(() => {
    if (viewMode !== 'reading' && isFocusMode) exitFocusMode();
  }, [viewMode]);

  useEffect(() => {
    setViewMode(selectedPassage ? 'reading' : 'list');
    setCurrentQuestionIndex(0);
    setCurrentAnswers(new Map());
    setTextDrafts({});
  }, [selectedPassage?.id]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setViewMode('list');
      setSelectedPassage(null);
      setCurrentAnswers(new Map());
      setCurrentQuestionIndex(0);
    }
  }, [isOpen]);

  // Load existing progress when selecting a passage
  useEffect(() => {
    let isMounted = true;
    if (selectedPassage) {
      const load = async () => {
        try {
          const progress = await getProgress(selectedPassage.id);
          if (!isMounted) return;
          if (progress && progress.answers) {
            if (progress.answers instanceof Map) {
              setCurrentAnswers(new Map(progress.answers));
            } else {
              const answersMap = new Map<number, ReadingAnswer>();
              Object.entries(progress.answers).forEach(([key, value]) => {
                answersMap.set(parseInt(key), value as ReadingAnswer);
              });
              setCurrentAnswers(answersMap);
            }
          } else {
            setCurrentAnswers(new Map());
          }
        } catch (error) {
          console.error("Failed to fetch progress", error);
          if (isMounted) setCurrentAnswers(new Map());
        }
      };
      load();
    }
    return () => { isMounted = false; };
  }, [selectedPassage, getProgress]);

  // Filter passages by format and difficulty
  const hasIeltsPassages = passages.some(p => p.format === 'ielts');
  const filteredPassages = useMemo(() => {
    return passages.filter(p =>
      (filterDifficulty === 'all' || p.difficulty === filterDifficulty) &&
      (filterFormat === 'all' || (p.format ?? 'classic') === filterFormat)
    );
  }, [passages, filterDifficulty, filterFormat]);

  // Get unique difficulties for filter
  const difficulties = useMemo(() => {
    const unique = [...new Set(passages.map(p => p.difficulty))];
    return unique.sort((a, b) => {
      const order = ['Pre-Intermediate', 'Intermediate', 'Upper Intermediate', 'Advanced'];
      return order.indexOf(a) - order.indexOf(b);
    });
  }, [passages]);

  // Calculate current passage progress
  const currentProgress = useMemo(() => {
    if (!selectedPassage) return { answered: 0, correct: 0, total: 0 };
    const total = selectedPassage.questions.length;
    const answered = currentAnswers.size;
    const correct = Array.from(currentAnswers.values()).filter(a => a.isCorrect).length;
    return { answered, correct, total };
  }, [selectedPassage, currentAnswers]);

  // Handle starting a passage
  const handleStartPassage = (passage: ReadingPassage) => {
    setSelectedPassage(passage);
    setCurrentQuestionIndex(0);
    setViewMode('reading');
  };

  // Handle answering a question
  const handleAnswer = async (questionId: number, rawAnswer: string) => {
    if (!selectedPassage) return;
    if (currentAnswers.has(questionId)) return; // Already answered

    const question = selectedPassage.questions.find(q => q.id === questionId);
    if (!question) return;

    const selectedAnswer = rawAnswer.trim().replace(/\s+/g, ' ');
    if (!selectedAnswer) return;
    const { isCorrect } = evaluateReadingAnswer(selectedPassage, question, selectedAnswer);
    const answer: ReadingAnswer = {
      questionId,
      selectedAnswer,
      isCorrect,
      explanation: question.explanation
    };

    const newAnswers = new Map(currentAnswers);
    newAnswers.set(questionId, answer);
    setCurrentAnswers(newAnswers);
    recordReadingAttempt(selectedPassage, newAnswers);

    // Track the answer
    await onAnswerQuestion(
      selectedPassage.id,
      questionId,
      selectedAnswer,
      isCorrect,
      question.questionType
    );

    // Check if all questions are answered
    if (newAnswers.size === selectedPassage.questions.length) {
      const correct = Array.from(newAnswers.values()).filter(a => a.isCorrect).length;
      const score = Math.round((correct / selectedPassage.questions.length) * 100);
      await onCompletePassage(selectedPassage.id, score, selectedPassage.difficulty);
    }
  };

  // Handle navigation
  const handleNextQuestion = () => {
    if (selectedPassage && currentQuestionIndex < selectedPassage.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle view results
  const handleViewResults = () => {
    setViewMode('results');
  };

  // Handle back to list
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedPassage(null);
    setCurrentAnswers(new Map());
    setCurrentQuestionIndex(0);
  };

  // Handle reset passage
  const handleReset = async () => {
    if (selectedPassage) {
      await onResetProgress(selectedPassage.id);
      readingSession.restart();
      setCurrentAnswers(new Map());
      setTextDrafts({});
      setCurrentQuestionIndex(0);
      setViewMode('reading');
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Pre-Intermediate': return 'var(--accent-green)';
      case 'Intermediate': return 'var(--accent-primary)';
      case 'Upper Intermediate': return 'var(--accent-orange)';
      case 'Advanced': return 'var(--accent-red)';
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

  // Extract vocabulary words from question text and options
  const extractVocabWords = (passage: ReadingPassage, question: ReadingQuestion): string[] => {
    const words: string[] = [];
    // Options often contain key vocabulary; IELTS statements and gap sentences carry it in the question itself.
    const sources = getAnswerFormat(question) === 'choice'
      ? getQuestionOptions(passage, question).map(opt => opt.text)
      : [question.questionText, question.correctAnswer];
    sources.forEach(text => {
      // Extract individual words that might be vocabulary items
      const optionWords = text.split(/[\s,;.!?()]+/)
        .filter(w => w.length > 4 && /^[a-zA-Z]+$/.test(w))
        .map(w => w.toLowerCase());
      words.push(...optionWords);
    });
    // Get unique words
    return [...new Set(words)].slice(0, 6);
  };

  // Handle adding word to vault
  const handleAddToVault = (word: string, context: string, questionId: number) => {
    if (selectedPassage && onAddToVault) {
      onAddToVault(word, context, `reading-${selectedPassage.id}`, questionId);
    }
  };

  const currentQuestion = selectedPassage?.questions[currentQuestionIndex];
  const currentAnswer = currentQuestion ? currentAnswers.get(currentQuestion.id) : undefined;
  // Once a question is answered, show the student where the answer is in the passage.
  const highlightedEvidence = currentAnswer ? currentQuestion?.evidence : undefined;

  useEffect(() => {
    const container = passageTextRef.current;
    const mark = container?.querySelector<HTMLElement>('.evidence-highlight');
    if (!container || !mark) return;
    const offset = mark.getBoundingClientRect().top - container.getBoundingClientRect().top;
    if (offset < 40 || offset > container.clientHeight - 60) {
      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      container.scrollTo({ top: container.scrollTop + offset - 80, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }, [highlightedEvidence, showPassageInQuestions]);

  const renderParagraph = (text: string) => {
    const at = highlightedEvidence ? text.indexOf(highlightedEvidence) : -1;
    if (!highlightedEvidence || at === -1) return text;
    return (
      <>
        {text.slice(0, at)}
        <mark className="evidence-highlight">{highlightedEvidence}</mark>
        {text.slice(at + highlightedEvidence.length)}
      </>
    );
  };

  const renderSummary = (passage: ReadingPassage, group: ReadingQuestionGroup, question: ReadingQuestion) => {
    const parts = (group.summary ?? '').split(/\[\[(\d+)\]\]/);
    return (
      <div className="ielts-summary" lang="en">
        {group.summaryTitle && <h4>{group.summaryTitle}</h4>}
        <p>
          {parts.map((part, i) => {
            if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
            const gapId = Number(part);
            const index = passage.questions.findIndex(q => q.id === gapId);
            const answer = currentAnswers.get(gapId);
            const classes = ['summary-gap'];
            if (gapId === question.id) classes.push('current');
            if (answer) classes.push(answer.isCorrect ? 'correct' : 'incorrect');
            return (
              <button
                key={i}
                type="button"
                className={classes.join(' ')}
                onClick={() => index >= 0 && setCurrentQuestionIndex(index)}
                aria-label={`Soru ${index + 1}${answer ? `: ${answer.selectedAnswer}` : ''}`}
                aria-current={gapId === question.id ? 'true' : undefined}
              >
                <span className="summary-gap-number">{index + 1}</span>
                {answer && <span className="summary-gap-text">{answer.selectedAnswer}</span>}
              </button>
            );
          })}
        </p>
      </div>
    );
  };

  const renderGroupCard = (passage: ReadingPassage, question: ReadingQuestion, group: ReadingQuestionGroup) => {
    const range = getGroupRange(passage, group.id);
    const exampleOption = group.example && group.options?.find(o => o.letter === group.example!.answer);
    return (
      <div className="ielts-group">
        {range && (
          <p className="ielts-group-range">
            {range[0] === range[1] ? `Soru ${range[0]}` : `Sorular ${range[0]}–${range[1]}`}
          </p>
        )}
        <p className="ielts-group-instructions" lang="en">{group.instructions}</p>
        {group.example && (
          <p className="ielts-group-example">
            <strong>Örnek:</strong> {group.example.prompt} → {exampleOption ? `${exampleOption.letter}) ${exampleOption.text}` : group.example.answer}
          </p>
        )}
        {group.summary && renderSummary(passage, group, question)}
        {group.tip && (
          <div className="ielts-tip">
            <Lightbulb size={16} aria-hidden="true" />
            <p>{group.tip}</p>
          </div>
        )}
      </div>
    );
  };

  const optionClassName = (base: string, question: ReadingQuestion, answer: ReadingAnswer | undefined, letter: string) => {
    const isSelected = answer?.selectedAnswer === letter;
    const isCorrect = letter === question.correctAnswer;
    let className = base;
    if (answer) {
      if (isCorrect) className += ' correct';
      else if (isSelected) className += ' incorrect';
    }
    if (isSelected) className += ' selected';
    return className;
  };

  const renderTextAnswer = (question: ReadingQuestion, group: ReadingQuestionGroup | undefined, answer: ReadingAnswer | undefined) => {
    const value = answer ? answer.selectedAnswer : (textDrafts[question.id] ?? '');
    const { words, numbers } = countAnswerWords(value);
    const overLimit = isOverWordLimit(value, group);
    const inputId = `reading-answer-${question.id}`;
    return (
      <form
        className="text-answer"
        onSubmit={e => {
          e.preventDefault();
          void handleAnswer(question.id, value);
        }}
      >
        <label className="reading-sr-only" htmlFor={inputId}>Soru {currentQuestionIndex + 1} cevabı</label>
        <div className="text-answer-row">
          <input
            id={inputId}
            className={`text-answer-input${answer ? (answer.isCorrect ? ' correct' : ' incorrect') : ''}`}
            value={value}
            onChange={e => setTextDrafts(previous => ({ ...previous, [question.id]: e.target.value }))}
            disabled={answer !== undefined}
            placeholder="Cevabınızı yazın"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
          {!answer && (
            <button type="submit" className="text-answer-submit" disabled={!value.trim()}>
              Kontrol Et
            </button>
          )}
        </div>
        {group?.maxWords && !answer && (
          <p className={`text-answer-limit${overLimit ? ' over' : ''}`} aria-live="polite">
            Sınır: en fazla {group.maxWords} kelime{group.allowNumber ? ' ve/veya bir sayı' : ''}
            {value.trim() && ` · Yazdığınız: ${words} kelime${numbers ? ` + ${numbers} sayı` : ''}`}
            {overLimit && ' — sınırı aştınız, bu haliyle yanlış sayılır'}
          </p>
        )}
      </form>
    );
  };

  const renderAnswerArea = (passage: ReadingPassage, question: ReadingQuestion) => {
    const answer = currentAnswers.get(question.id);
    const format = getAnswerFormat(question);
    const group = getQuestionGroup(passage, question);
    if (format === 'text') return renderTextAnswer(question, group, answer);

    const options = getQuestionOptions(passage, question);

    if (format === 'tfng') {
      return (
        <div className="tfng-options">
          {options.map(option => (
            <button
              key={option.letter}
              type="button"
              className={optionClassName('reading-option tfng-option', question, answer, option.letter)}
              onClick={() => handleAnswer(question.id, option.letter)}
              disabled={answer !== undefined}
            >
              <span className="tfng-label">{option.letter}</span>
              <span className="tfng-hint">{option.text}</span>
            </button>
          ))}
        </div>
      );
    }

    if (group?.compactOptions) {
      return (
        <div className="letter-options" role="group" aria-label="Paragraf seçin">
          {options.map(option => (
            <button
              key={option.letter}
              type="button"
              className={optionClassName('reading-option letter-option', question, answer, option.letter)}
              onClick={() => handleAnswer(question.id, option.letter)}
              disabled={answer !== undefined}
              aria-label={option.text}
            >
              {option.letter}
            </button>
          ))}
        </div>
      );
    }

    // Matching headings: show which headings are already taken, as students cross them out on paper.
    const takenBy = new Map<string, string>();
    if (question.questionType === 'matching_headings' && group) {
      if (group.example) takenBy.set(group.example.answer, 'Örnekte kullanıldı');
      passage.questions.forEach(other => {
        const otherAnswer = currentAnswers.get(other.id);
        if (other.groupId === group.id && other.id !== question.id && otherAnswer) {
          takenBy.set(otherAnswer.selectedAnswer, `${other.questionText} için seçildi`);
        }
      });
    }

    return (
      <div className={`options-list${group?.options ? ' shared-options' : ''}`}>
        {group?.optionsTitle && <p className="shared-options-title" lang="en">{group.optionsTitle}</p>}
        {options.map(option => {
          const isSelected = answer?.selectedAnswer === option.letter;
          const isCorrect = option.letter === question.correctAnswer;
          const taken = takenBy.get(option.letter);
          return (
            <button
              key={option.letter}
              type="button"
              className={optionClassName('reading-option', question, answer, option.letter) + (taken && !answer ? ' taken' : '')}
              onClick={() => handleAnswer(question.id, option.letter)}
              disabled={answer !== undefined}
            >
              <span className="option-letter">{option.letter}</span>
              <span className="option-text" lang="en">
                {option.text}
                {taken && !answer && <span className="option-taken">{taken}</span>}
              </span>
              {answer && isCorrect && <Check size={18} className="option-icon" />}
              {answer && isSelected && !isCorrect && <X size={18} className="option-icon" />}
            </button>
          );
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  const currentGroup = selectedPassage && currentQuestion ? getQuestionGroup(selectedPassage, currentQuestion) : undefined;
  const currentIssue = selectedPassage && currentQuestion && currentAnswer && !currentAnswer.isCorrect
    ? evaluateReadingAnswer(selectedPassage, currentQuestion, currentAnswer.selectedAnswer).issue
    : undefined;

  return (
    <div className="activity-page">
      <div className="reading-panel activity-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="reading-header">
          <div className="reading-title">
            <BookOpen size={24} />
            <h2>Okuma Anlama</h2>
          </div>
          <div className="reading-header-actions">
            <button
              className={`mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={handleBackToList}
            >
              <List size={18} />
              <span>Pasajlar</span>
            </button>
            <button
              className={`mode-btn ${viewMode === 'stats' ? 'active' : ''}`}
              onClick={() => setViewMode('stats')}
            >
              <BarChart3 size={18} />
              <span>İstatistikler</span>
            </button>
          </div>
          <PageBack onClick={onClose} />
        </div>

        {/* Content */}
        <div className="reading-content">
          {/* List View */}
          {viewMode === 'list' && (
            <div className="passage-list-view">
              {/* Difficulty Filter */}
              <div className="filter-bar">
                <span className="filter-label">Seviye:</span>
                <div className="filter-buttons">
                  <button
                    className={`filter-btn ${filterDifficulty === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterDifficulty('all')}
                  >
                    Tümü
                  </button>
                  {difficulties.map(diff => (
                    <button
                      key={diff}
                      className={`filter-btn ${filterDifficulty === diff ? 'active' : ''}`}
                      onClick={() => setFilterDifficulty(diff)}
                      style={{ '--filter-color': getDifficultyColor(diff) } as React.CSSProperties}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
                {hasIeltsPassages && (
                  <>
                    <span className="filter-label">Tür:</span>
                    <div className="filter-buttons">
                      {([['all', 'Tümü'], ['ielts', 'IELTS'], ['classic', 'Çoktan Seçmeli']] as const).map(([value, label]) => (
                        <button
                          key={value}
                          className={`filter-btn ${filterFormat === value ? 'active' : ''}`}
                          onClick={() => setFilterFormat(value)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Passage Cards */}
              <div className="passage-grid">
                {filteredPassages.map(passage => {
                  const isCompleted = completedPassageIds.includes(passage.id);
                  // Since progress is async, we can't show it down here simultaneously without state.
                  // For the passage list view, we already know if it's completed via completedPassageIds.
                  // Since we don't have synchronous getProgress, we will omit the inline score card on the list view 
                  // to save on infinite API calls, and instead rely on the completion badge.

                  return (
                    <div
                      key={passage.id}
                      className={`passage-card ${isCompleted ? 'completed' : ''}`}
                    >
                      <div className="passage-card-header">
                        <span className="passage-card-tags">
                          <span
                            className="difficulty-tag"
                            style={{ backgroundColor: getDifficultyColor(passage.difficulty) }}
                          >
                            {passage.difficulty}
                          </span>
                          {passage.format === 'ielts' && <span className="format-tag">IELTS</span>}
                        </span>
                        {isCompleted && (
                          <span className="completed-badge">
                            <CheckCircle size={16} />
                            Tamamlandı
                          </span>
                        )}
                      </div>
                      <h3 className="passage-card-title">{passage.title}</h3>
                      <p className="passage-card-topic">{passage.topic}</p>
                      <div className="passage-card-meta">
                        <span>
                          <FileText size={14} />
                          {passage.wordCount} kelime
                        </span>
                        <span>
                          <Clock size={14} />
                          ~{passage.estimatedTime} dk
                        </span>
                        <span>
                          <Target size={14} />
                          {passage.questions.length} soru
                        </span>
                      </div>
                      <button
                        className="start-btn"
                        onClick={() => handleStartPassage(passage)}
                      >
                        <BookOpen size={18} />
                        <span>{isCompleted ? 'Tekrar Çöz' : 'Başla'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reading View */}
          {viewMode === 'reading' && selectedPassage && currentQuestion && (
            <div className={`reading-view${isFocusMode ? ' focus-mode' : ''}`} ref={readingViewRef}>
              {/* Progress Bar */}
              <div className="reading-progress-bar">
                <div className="progress-info">
                  <span>{currentProgress.answered} / {currentProgress.total} soru cevaplandı</span>
                  <span className="progress-actions">
                    <span className="correct-count">
                      <Check size={14} />
                      {currentProgress.correct} doğru
                    </span>
                    <button
                      type="button"
                      className="focus-toggle-btn"
                      onClick={isFocusMode ? exitFocusMode : enterFocusMode}
                      aria-pressed={isFocusMode}
                      title={isFocusMode ? 'Tam ekrandan çık (Esc)' : 'Metni ve soruları tam ekranda aç'}
                    >
                      {isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                      <span>{isFocusMode ? 'Tam ekrandan çık' : 'Tam ekran'}</span>
                    </button>
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${(currentProgress.answered / currentProgress.total) * 100}%` }}
                  />
                </div>
              </div>

              <div className={`reading-layout${!showPassageInQuestions ? ' passage-hidden' : ''}`}>
                {/* Passage Section */}
                {showPassageInQuestions && (
                  <div className="passage-section">
                    <div className="passage-header">
                      <h3>{selectedPassage.title}</h3>
                      <button
                        className="toggle-passage-btn"
                        onClick={() => setShowPassageInQuestions(false)}
                      >
                        <X size={16} />
                        Gizle
                      </button>
                    </div>
                    <div
                      className={`passage-text${selectedPassage.labelParagraphs ? ' labelled' : ''}`}
                      ref={passageTextRef}
                    >
                      {selectedPassage.passage.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>
                          {selectedPassage.labelParagraphs && (
                            <span className="paragraph-label">{String.fromCharCode(65 + idx)}</span>
                          )}
                          {renderParagraph(paragraph)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Question Section */}
                <div className={`question-section ${!showPassageInQuestions ? 'full-width' : ''}`}>
                  {!showPassageInQuestions && (
                    <button
                      className="show-passage-btn"
                      onClick={() => setShowPassageInQuestions(true)}
                    >
                      <Eye size={16} />
                      Metni Göster
                    </button>
                  )}

                  <div className="question-nav">
                    <span className="question-counter">
                      Soru {currentQuestionIndex + 1} / {selectedPassage.questions.length}
                    </span>
                    <span
                      className="question-type-badge"
                      title={READING_QUESTION_TYPE_LABELS[currentQuestion.questionType]}
                    >
                      {READING_QUESTION_TYPE_LABELS[currentQuestion.questionType]}
                    </span>
                  </div>

                  <div className={`question-content${currentGroup ? ' ielts-question' : ''}`}>
                    {currentGroup && renderGroupCard(selectedPassage, currentQuestion, currentGroup)}

                    <p className={`question-text${currentGroup ? ' ielts-question-text' : ''}`} lang="en">
                      {currentGroup && <span className="ielts-question-number">{currentQuestionIndex + 1}</span>}
                      <span>
                        {currentQuestion.questionText.split(/_{3,}/).map((part, idx) => (
                          <Fragment key={idx}>
                            {idx > 0 && <span className="gap-blank" aria-label="boşluk" />}
                            {part}
                          </Fragment>
                        ))}
                      </span>
                    </p>

                    {renderAnswerArea(selectedPassage, currentQuestion)}

                    {/* Explanation */}
                    {currentAnswer && (currentQuestion.explanation || getAnswerFormat(currentQuestion) === 'text') && (
                      <div className={`question-explanation ${currentAnswer.isCorrect ? 'correct' : 'incorrect'}`}>
                        <div className="explanation-header">
                          {currentAnswer.isCorrect ? (
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
                        {getAnswerFormat(currentQuestion) === 'text' && !currentAnswer.isCorrect && (
                          <p className="explanation-answer">
                            Doğru cevap: <strong>{currentQuestion.correctAnswer}</strong>
                            {currentQuestion.acceptedAnswers?.length
                              ? ` (kabul edilen: ${currentQuestion.acceptedAnswers.join(', ')})`
                              : ''}
                          </p>
                        )}
                        {currentIssue === 'word_limit' && (
                          <p className="explanation-issue">
                            Kelime sınırını aştınız. IELTS'te sınırı aşan cevap, doğru kelimeleri içerse bile yanlış sayılır.
                          </p>
                        )}
                        {currentIssue === 'plural' && (
                          <p className="explanation-issue">
                            Kelime doğru ama tekil/çoğul biçimi yanlış. IELTS'te bu da yanlış sayılır: boşluğa uyan biçimi metinden aynen alın.
                          </p>
                        )}
                        {currentIssue === 'spelling' && (
                          <p className="explanation-issue">
                            Çok yaklaştınız ama yazım hatası var. IELTS'te yanlış yazılmış kelime yanlış sayılır.
                          </p>
                        )}
                        {currentQuestion.explanation && <p>{currentQuestion.explanation}</p>}
                        {currentQuestion.evidence && showPassageInQuestions && (
                          <p className="explanation-evidence-note">Cevabın geçtiği yer metinde işaretlendi.</p>
                        )}
                      </div>
                    )}

                    {/* Vocab Vault Option - show for incorrect answers */}
                    {currentAnswers.has(currentQuestion.id) &&
                      !currentAnswers.get(currentQuestion.id)?.isCorrect &&
                      onAddToVault && (
                        <div className="vocab-section reading-vocab">
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
                              {extractVocabWords(selectedPassage, currentQuestion).map(word => {
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
                      disabled={currentQuestionIndex === 0}
                    >
                      <ChevronLeft size={20} />
                      <span>Önceki</span>
                    </button>

                    <div className="question-dots">
                      {selectedPassage.questions.map((q, idx) => {
                        const answer = currentAnswers.get(q.id);
                        let dotClass = 'dot';
                        if (idx === currentQuestionIndex) dotClass += ' current';
                        if (answer?.isCorrect) dotClass += ' correct';
                        else if (answer) dotClass += ' incorrect';

                        return (
                          <button
                            key={q.id}
                            className={dotClass}
                            onClick={() => setCurrentQuestionIndex(idx)}
                            title={`Soru ${idx + 1}`}
                          />
                        );
                      })}
                    </div>

                    {currentQuestionIndex < selectedPassage.questions.length - 1 ? (
                      <button
                        className="nav-btn"
                        onClick={handleNextQuestion}
                      >
                        <span>Sonraki</span>
                        <ChevronRight size={20} />
                      </button>
                    ) : (
                      <button
                        className="nav-btn results"
                        onClick={handleViewResults}
                        disabled={currentProgress.answered < currentProgress.total}
                      >
                        <span>Sonuçlar</span>
                        <Award size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results View */}
          {viewMode === 'results' && selectedPassage && (
            <div className="results-view">
              <div className="results-header">
                <h3>{selectedPassage.title}</h3>
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
                    <span className="score-label">Başarı</span>
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
                </div>
              </div>

              {/* Question Review */}
              <div className="question-review">
                <h4>Soru Detayları</h4>
                {selectedPassage.questions.map((question, idx) => {
                  const answer = currentAnswers.get(question.id);
                  return (
                    <div
                      key={question.id}
                      className={`review-item ${answer?.isCorrect ? 'correct' : 'incorrect'}`}
                    >
                      <div className="review-header">
                        <span className="review-number">#{idx + 1}</span>
                        <span className="review-type">
                          {READING_QUESTION_TYPE_LABELS[question.questionType]}
                        </span>
                        {answer?.isCorrect ? (
                          <Check size={18} className="review-icon correct" />
                        ) : (
                          <X size={18} className="review-icon incorrect" />
                        )}
                      </div>
                      <p className="review-question">{question.questionText}</p>
                      {!answer?.isCorrect && (
                        <div className="review-answer">
                          <span className="wrong-answer">
                            Cevabınız: {formatReadingAnswer(selectedPassage, question, answer?.selectedAnswer) || '—'}
                          </span>
                          <span className="correct-answer">
                            Doğru: {formatReadingAnswer(selectedPassage, question, question.correctAnswer)}
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
                  <span>Pasaj Listesi</span>
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
                    <span className="stat-value">{stats.totalPassagesCompleted}</span>
                    <span className="stat-label">Tamamlanan Pasaj</span>
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
                              {READING_QUESTION_TYPE_LABELS[type as keyof typeof READING_QUESTION_TYPE_LABELS]}
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

              {stats.totalPassagesCompleted === 0 && (
                <div className="empty-stats">
                  <BookOpen size={48} />
                  <p>Henüz pasaj tamamlamadınız.</p>
                  <button onClick={() => setViewMode('list')}>
                    Pasajlara Göz At
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
