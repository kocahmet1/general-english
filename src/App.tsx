import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Moon, Sun, AlertCircle, Settings } from 'lucide-react';
import { ExamSelector } from './components/ExamSelector';
import { ExamView } from './components/ExamView';
import { ImportExamModal } from './components/ImportExamModal';
import { VocabVault } from './components/VocabVault';
import { AdminPage } from './components/AdminPage';
import { Exam, UserAnswer, VocabWord, Question } from './types';
import { getAllExams, getExamById, createExam, parseExamText, deleteExam } from './services/examService';
import { getAllVocabWords, addVocabWord, removeVocabWord } from './services/vocabService';
import { getExplanation } from './services/openaiService';
import {
  isFirebaseConfigured,
  getLocalExams,
  getLocalExamById,
  createLocalExam,
  deleteLocalExam,
  getLocalVocabWords,
  addLocalVocabWord,
  removeLocalVocabWord
} from './services/localStorageService';
import { sampleExamQuestions, sampleExamName, sampleExamDescription } from './data/sampleExam';
import './App.css';

function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  // Firebase check
  const [useFirebase] = useState(isFirebaseConfigured());
  const [openAIConfigured] = useState(() => {
    const key = import.meta.env.VITE_OPENAI_API_KEY;
    return key && key !== 'your-openai-api-key-here' && key.startsWith('sk-');
  });

  // Exam states
  const [exams, setExams] = useState<{ id: string; name: string; description?: string; questionCount: number }[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [userAnswers, setUserAnswers] = useState<Map<number, UserAnswer>>(new Map());
  const [isLoadingExams, setIsLoadingExams] = useState(true);
  const [isLoadingCurrentExam, setIsLoadingCurrentExam] = useState(false);

  // Modal states
  const [showImportModal, setShowImportModal] = useState(false);
  const [showVocabVault, setShowVocabVault] = useState(false);
  const [showAdminPage, setShowAdminPage] = useState(false);

  // Vocab vault state
  const [vocabWords, setVocabWords] = useState<VocabWord[]>([]);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Load exams on mount
  useEffect(() => {
    loadExams();
    loadVocabWords();
  }, []);

  // Load selected exam
  useEffect(() => {
    if (selectedExamId) {
      loadExam(selectedExamId);
    }
  }, [selectedExamId]);

  const loadExams = async () => {
    setIsLoadingExams(true);
    try {
      if (useFirebase) {
        // Add timeout for Firebase - fallback to local if it takes too long
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Firebase timeout')), 5000)
        );
        
        try {
          const examList = await Promise.race([getAllExams(), timeoutPromise]);
          setExams(examList);
        } catch (firebaseError) {
          console.warn('Firebase failed or timed out, using local storage:', firebaseError);
          const examList = getLocalExams();
          setExams(examList);
        }
      } else {
        const examList = getLocalExams();
        setExams(examList);
      }
    } catch (error) {
      console.error('Failed to load exams:', error);
      // Fallback to local storage
      const examList = getLocalExams();
      setExams(examList);
    } finally {
      setIsLoadingExams(false);
    }
  };

  const loadExam = async (examId: string) => {
    setIsLoadingCurrentExam(true);
    setUserAnswers(new Map());
    try {
      let exam: Exam | null = null;
      if (useFirebase) {
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Firebase timeout')), 5000)
        );
        try {
          exam = await Promise.race([getExamById(examId), timeoutPromise]);
        } catch {
          exam = getLocalExamById(examId);
        }
      } else {
        exam = getLocalExamById(examId);
      }
      setCurrentExam(exam);
    } catch (error) {
      console.error('Failed to load exam:', error);
      const exam = getLocalExamById(examId);
      setCurrentExam(exam);
    } finally {
      setIsLoadingCurrentExam(false);
    }
  };

  const loadVocabWords = async () => {
    try {
      if (useFirebase) {
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Firebase timeout')), 5000)
        );
        try {
          const words = await Promise.race([getAllVocabWords(), timeoutPromise]);
          setVocabWords(words);
        } catch {
          const words = getLocalVocabWords();
          setVocabWords(words);
        }
      } else {
        const words = getLocalVocabWords();
        setVocabWords(words);
      }
    } catch (error) {
      console.error('Failed to load vocab words:', error);
      const words = getLocalVocabWords();
      setVocabWords(words);
    }
  };

  const handleAnswer = useCallback(async (questionId: number, selectedAnswer: string) => {
    if (!currentExam) return;

    const question = currentExam.questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = selectedAnswer === question.correctAnswer;

    // Set initial answer state
    setUserAnswers(prev => {
      const newAnswers = new Map(prev);
      newAnswers.set(questionId, {
        questionId,
        selectedAnswer,
        isCorrect,
        isLoading: !isCorrect && openAIConfigured,
        explanation: !isCorrect && !openAIConfigured ? 
          'OpenAI API yapılandırılmamış. Açıklama almak için .env dosyasında VITE_OPENAI_API_KEY değerini ayarlayın.' : 
          undefined
      });
      return newAnswers;
    });

    // If incorrect and OpenAI is configured, get explanation
    if (!isCorrect && openAIConfigured) {
      try {
        const explanation = await getExplanation(question, selectedAnswer, question.correctAnswer);
        setUserAnswers(prev => {
          const newAnswers = new Map(prev);
          const currentAnswer = newAnswers.get(questionId);
          if (currentAnswer) {
            newAnswers.set(questionId, {
              ...currentAnswer,
              isLoading: false,
              explanation
            });
          }
          return newAnswers;
        });
      } catch (error) {
        console.error('Failed to get explanation:', error);
        setUserAnswers(prev => {
          const newAnswers = new Map(prev);
          const currentAnswer = newAnswers.get(questionId);
          if (currentAnswer) {
            newAnswers.set(questionId, {
              ...currentAnswer,
              isLoading: false,
              explanation: 'Açıklama yüklenirken bir hata oluştu. Lütfen tekrar deneyin.'
            });
          }
          return newAnswers;
        });
      }
    }
  }, [currentExam, openAIConfigured]);

  const handleImportExam = async (
    name: string,
    description: string,
    examText: string,
    answerKey: string
  ): Promise<boolean> => {
    try {
      const questions = parseExamText(examText, answerKey);
      
      if (questions.length === 0) {
        console.error('No questions parsed');
        return false;
      }

      let examId: string | null;
      
      if (useFirebase) {
        examId = await createExam(name, description, questions);
      } else {
        examId = createLocalExam(name, description, questions);
      }
      
      if (examId) {
        await loadExams();
        setSelectedExamId(examId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to import exam:', error);
      return false;
    }
  };

  const handleAddToVault = async (word: string, questionContext: string, questionId: number) => {
    if (!selectedExamId) return;

    try {
      let wordId: string | null;
      
      if (useFirebase) {
        wordId = await addVocabWord(word, questionContext, selectedExamId, questionId);
      } else {
        wordId = addLocalVocabWord(word, questionContext, selectedExamId, questionId);
      }
      
      if (wordId) {
        await loadVocabWords();
      }
    } catch (error) {
      console.error('Failed to add word to vault:', error);
    }
  };

  const handleRemoveFromVault = async (wordId: string) => {
    try {
      let success: boolean;
      
      if (useFirebase) {
        success = await removeVocabWord(wordId);
      } else {
        success = removeLocalVocabWord(wordId);
      }
      
      if (success) {
        setVocabWords(prev => prev.filter(w => w.id !== wordId));
      }
    } catch (error) {
      console.error('Failed to remove word from vault:', error);
    }
  };

  const handleResetExam = () => {
    setUserAnswers(new Map());
  };

  const handleLoadSampleExam = async () => {
    try {
      let examId: string | null;
      
      if (useFirebase) {
        examId = await createExam(sampleExamName, sampleExamDescription, sampleExamQuestions);
      } else {
        examId = createLocalExam(sampleExamName, sampleExamDescription, sampleExamQuestions);
      }
      
      if (examId) {
        await loadExams();
        setSelectedExamId(examId);
      }
    } catch (error) {
      console.error('Failed to load sample exam:', error);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    try {
      let success: boolean;
      
      if (useFirebase) {
        success = await deleteExam(examId);
      } else {
        success = deleteLocalExam(examId);
      }
      
      if (success) {
        // If deleted exam was selected, clear selection
        if (selectedExamId === examId) {
          setSelectedExamId(null);
          setCurrentExam(null);
          setUserAnswers(new Map());
        }
        await loadExams();
      }
    } catch (error) {
      console.error('Failed to delete exam:', error);
    }
  };

  const vocabWordsInVault = vocabWords.map(w => w.word.toLowerCase());

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo">
            <BookOpen size={32} />
            <span>English Master</span>
          </div>
          {!useFirebase && (
            <div className="local-mode-badge" title="Firebase yapılandırılmamış - Yerel depolama kullanılıyor">
              <AlertCircle size={16} />
              <span>Yerel Mod</span>
            </div>
          )}
        </div>
        
        <div className="header-right">
          <button 
            className="vocab-vault-btn"
            onClick={() => setShowVocabVault(true)}
          >
            <BookOpen size={20} />
            <span>Kelime Kasası</span>
            {vocabWords.length > 0 && (
              <span className="badge">{vocabWords.length}</span>
            )}
          </button>
          
          <button 
            className="admin-btn"
            onClick={() => setShowAdminPage(true)}
            title="Yönetim Paneli"
          >
            <Settings size={20} />
            <span>Yönetim</span>
          </button>
          
          <button 
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Açık tema' : 'Koyu tema'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {showAdminPage ? (
          <AdminPage
            exams={exams}
            onBack={() => setShowAdminPage(false)}
            onImportExam={() => setShowImportModal(true)}
            onDeleteExam={handleDeleteExam}
            onLoadSampleExam={handleLoadSampleExam}
            useFirebase={useFirebase}
          />
        ) : (
          <>
            {/* Sidebar with Exam Selector */}
            <aside className="sidebar">
              <ExamSelector
                exams={exams}
                selectedExamId={selectedExamId}
                onSelectExam={setSelectedExamId}
                onDeleteExam={handleDeleteExam}
                isLoading={isLoadingExams}
              />
              
              {/* Configuration Status */}
              <div className="config-status">
                <h3>Yapılandırma Durumu</h3>
                <div className={`status-item ${useFirebase ? 'configured' : 'not-configured'}`}>
                  <span className="status-dot"></span>
                  <span>Firebase: {useFirebase ? 'Aktif' : 'Yerel Depolama'}</span>
                </div>
                <div className={`status-item ${openAIConfigured ? 'configured' : 'not-configured'}`}>
                  <span className="status-dot"></span>
                  <span>OpenAI: {openAIConfigured ? 'Aktif' : 'Yapılandırılmamış'}</span>
                </div>
              </div>
              
              {/* Quick Stats */}
              {currentExam && userAnswers.size > 0 && (
                <div className="quick-stats">
                  <h3>Hızlı İstatistik</h3>
                  <div className="stat-row">
                    <span>Cevaplanan:</span>
                    <span>{userAnswers.size} / {currentExam.questions.length}</span>
                  </div>
                  <div className="stat-row correct">
                    <span>Doğru:</span>
                    <span>{Array.from(userAnswers.values()).filter(a => a.isCorrect).length}</span>
                  </div>
                  <div className="stat-row incorrect">
                    <span>Yanlış:</span>
                    <span>{Array.from(userAnswers.values()).filter(a => !a.isCorrect).length}</span>
                  </div>
                </div>
              )}
            </aside>

            {/* Exam Content */}
            <div className="content">
              {isLoadingCurrentExam ? (
                <div className="loading-state">
                  <div className="spinner-large"></div>
                  <p>Sınav yükleniyor...</p>
                </div>
              ) : currentExam ? (
                <ExamView
                  exam={currentExam}
                  userAnswers={userAnswers}
                  onAnswer={handleAnswer}
                  onAddToVault={handleAddToVault}
                  onResetExam={handleResetExam}
                  vocabWordsInVault={vocabWordsInVault}
                />
              ) : (
                <div className="empty-state">
                  <BookOpen size={64} />
                  <h2>Hoş Geldiniz!</h2>
                  <p>İngilizce seviyenizi test etmek için sol taraftan bir sınav seçin.</p>
                  {exams.length > 0 ? (
                    <button onClick={() => setSelectedExamId(exams[0].id)}>
                      İlk Sınavı Başlat
                    </button>
                  ) : (
                    <div className="empty-state-buttons">
                      <button onClick={handleLoadSampleExam} className="primary-btn">
                        120 Soruluk Örnek Sınavı Yükle
                      </button>
                      <p className="admin-hint">
                        Kendi sınavınızı eklemek için üst menüdeki <strong>Yönetim</strong> butonunu kullanın.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Import Modal */}
      <ImportExamModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportExam}
      />

      {/* Vocab Vault Panel */}
      <VocabVault
        isOpen={showVocabVault}
        onClose={() => setShowVocabVault(false)}
        vocabWords={vocabWords}
        onRemoveWord={handleRemoveFromVault}
      />
    </div>
  );
}

export default App;
