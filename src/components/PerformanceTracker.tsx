import { useState, useMemo } from 'react';
import { 
  X, 
  TrendingDown, 
  TrendingUp, 
  BarChart3, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  BookOpen
} from 'lucide-react';
import { 
  PerformanceStats, 
  MistakeRecord, 
  GrammarCategory,
  GRAMMAR_CATEGORY_LABELS,
  CategoryStats
} from '../types';

interface PerformanceTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PerformanceStats;
  recentMistakes: MistakeRecord[];
  onClearData: () => void;
  getMistakesByCategory: (category: GrammarCategory) => MistakeRecord[];
}

export const PerformanceTracker = ({
  isOpen,
  onClose,
  stats,
  recentMistakes,
  onClearData,
  getMistakesByCategory
}: PerformanceTrackerProps) => {
  const [expandedCategory, setExpandedCategory] = useState<GrammarCategory | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'history'>('overview');

  // Calculate success rate
  const successRate = useMemo(() => {
    if (stats.totalAnswered === 0) return 0;
    return Math.round((stats.totalCorrect / stats.totalAnswered) * 100);
  }, [stats]);

  // Get category color based on mistake count
  const getCategoryColor = (mistakeCount: number, maxMistakes: number): string => {
    if (maxMistakes === 0) return 'var(--success)';
    const ratio = mistakeCount / maxMistakes;
    if (ratio > 0.7) return 'var(--danger)';
    if (ratio > 0.4) return 'var(--warning)';
    return 'var(--success)';
  };

  // Get max mistakes for color scaling
  const maxMistakes = useMemo(() => {
    return Math.max(...stats.categoryBreakdown.map(c => c.totalMistakes), 1);
  }, [stats.categoryBreakdown]);

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle category expansion
  const toggleCategory = (category: GrammarCategory) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  if (!isOpen) return null;

  return (
    <div className="performance-tracker-overlay" onClick={onClose}>
      <div className="performance-tracker-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="tracker-header">
          <div className="tracker-title">
            <BarChart3 size={24} />
            <h2>Performans Analizi</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="tracker-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Target size={18} />
            Genel Bakış
          </button>
          <button 
            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <BookOpen size={18} />
            Konu Analizi
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Clock size={18} />
            Hata Geçmişi
          </button>
        </div>

        {/* Content */}
        <div className="tracker-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card total">
                  <div className="stat-icon">
                    <BarChart3 size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.totalAnswered}</span>
                    <span className="stat-label">Toplam Cevap</span>
                  </div>
                </div>
                
                <div className="stat-card correct">
                  <div className="stat-icon">
                    <CheckCircle size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.totalCorrect}</span>
                    <span className="stat-label">Doğru</span>
                  </div>
                </div>
                
                <div className="stat-card incorrect">
                  <div className="stat-icon">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.totalIncorrect}</span>
                    <span className="stat-label">Yanlış</span>
                  </div>
                </div>
                
                <div className="stat-card success-rate">
                  <div className="stat-icon">
                    <Target size={24} />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">%{successRate}</span>
                    <span className="stat-label">Başarı Oranı</span>
                  </div>
                </div>
              </div>

              {/* Success Rate Bar */}
              <div className="success-bar-container">
                <div className="success-bar">
                  <div 
                    className="success-fill" 
                    style={{ width: `${successRate}%` }}
                  />
                </div>
                <div className="success-labels">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Weakest Areas */}
              {stats.weakestAreas.length > 0 && (
                <div className="weak-areas-section">
                  <h3>
                    <TrendingDown size={20} />
                    En Çok Hata Yapılan Konular
                  </h3>
                  <div className="weak-areas-list">
                    {stats.weakestAreas.slice(0, 5).map((category, index) => {
                      const catStats = stats.categoryBreakdown.find(c => c.category === category);
                      return (
                        <div key={category} className="weak-area-item">
                          <span className="rank">#{index + 1}</span>
                          <span className="category-name">{GRAMMAR_CATEGORY_LABELS[category]}</span>
                          <span className="mistake-count">
                            {catStats?.totalMistakes || 0} hata
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="recent-activity">
                <h3>
                  <Clock size={20} />
                  Son 7 Gün
                </h3>
                <p className="recent-summary">
                  Son 7 günde <strong>{recentMistakes.length}</strong> hata yaptınız.
                </p>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="categories-tab">
              {stats.categoryBreakdown.length === 0 ? (
                <div className="empty-state">
                  <BookOpen size={48} />
                  <p>Henüz hata kaydı bulunmuyor.</p>
                  <span>Sorulara yanlış cevap verdiğinizde burası dolacak.</span>
                </div>
              ) : (
                <div className="categories-list">
                  {stats.categoryBreakdown.map((catStats: CategoryStats) => {
                    const mistakes = getMistakesByCategory(catStats.category);
                    const isExpanded = expandedCategory === catStats.category;
                    
                    return (
                      <div key={catStats.category} className="category-card">
                        <div 
                          className="category-header"
                          onClick={() => toggleCategory(catStats.category)}
                        >
                          <div className="category-info">
                            <div 
                              className="category-indicator"
                              style={{ backgroundColor: getCategoryColor(catStats.totalMistakes, maxMistakes) }}
                            />
                            <span className="category-label">
                              {GRAMMAR_CATEGORY_LABELS[catStats.category]}
                            </span>
                          </div>
                          <div className="category-stats">
                            <span className="total-mistakes">{catStats.totalMistakes} hata</span>
                            {catStats.recentMistakes > 0 && (
                              <span className="recent-badge">+{catStats.recentMistakes} bu hafta</span>
                            )}
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="category-details">
                            <div className="mistake-bar">
                              <div 
                                className="mistake-fill"
                                style={{ 
                                  width: `${(catStats.totalMistakes / maxMistakes) * 100}%`,
                                  backgroundColor: getCategoryColor(catStats.totalMistakes, maxMistakes)
                                }}
                              />
                            </div>
                            
                            <div className="category-questions">
                              <h4>Bu kategorideki hatalar:</h4>
                              {mistakes.slice(0, 5).map((mistake, idx) => (
                                <div key={mistake.id} className="mistake-item">
                                  <span className="mistake-num">#{idx + 1}</span>
                                  <span className="mistake-text">
                                    {mistake.questionText.length > 80 
                                      ? mistake.questionText.substring(0, 80) + '...' 
                                      : mistake.questionText}
                                  </span>
                                  <span className="mistake-answer">
                                    {mistake.selectedAnswer} → {mistake.correctAnswer}
                                  </span>
                                </div>
                              ))}
                              {mistakes.length > 5 && (
                                <span className="more-mistakes">
                                  +{mistakes.length - 5} daha fazla hata
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="history-tab">
              {recentMistakes.length === 0 ? (
                <div className="empty-state">
                  <Clock size={48} />
                  <p>Son 7 günde hata kaydı yok.</p>
                  <span>Tebrikler! Ya hiç hata yapmadınız ya da henüz soru çözmediniz.</span>
                </div>
              ) : (
                <div className="history-list">
                  {recentMistakes.map((mistake) => (
                    <div key={mistake.id} className="history-item">
                      <div className="history-header">
                        <span className="history-category">
                          {GRAMMAR_CATEGORY_LABELS[mistake.grammarCategory]}
                        </span>
                        <span className="history-date">
                          {formatDate(mistake.timestamp)}
                        </span>
                      </div>
                      <p className="history-question">
                        {mistake.questionText.length > 100 
                          ? mistake.questionText.substring(0, 100) + '...' 
                          : mistake.questionText}
                      </p>
                      <div className="history-answer">
                        <span className="wrong">Cevabınız: {mistake.selectedAnswer}</span>
                        <span className="correct">Doğru: {mistake.correctAnswer}</span>
                      </div>
                      {mistake.difficulty && (
                        <span className="history-difficulty">{mistake.difficulty}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="tracker-footer">
          <button className="clear-data-btn" onClick={onClearData}>
            <Trash2 size={18} />
            Tüm Verileri Temizle
          </button>
        </div>
      </div>
    </div>
  );
};

