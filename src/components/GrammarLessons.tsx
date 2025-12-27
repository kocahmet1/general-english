import { useState, useEffect } from 'react';
import { X, BookOpen, TrendingUp, Award, Target, BarChart3, RefreshCw } from 'lucide-react';
import { grammarLessons } from '../data/grammarLessons';
import { GrammarTopic } from '../types/grammarLesson';
import { GrammarLessonView } from './GrammarLessonView';
import {
    getGrammarLessonStats,
    getAllLessonProgress,
    getRecommendedLesson,
    resetAllLessonProgress
} from '../services/grammarLessonService';

interface GrammarLessonsProps {
    onClose: () => void;
}

export function GrammarLessons({ onClose }: GrammarLessonsProps) {
    const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
    const [stats, setStats] = useState(getGrammarLessonStats());
    const [progressData, setProgressData] = useState(getAllLessonProgress());

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setStats(getGrammarLessonStats());
        setProgressData(getAllLessonProgress());
    };

    const handleLessonComplete = () => {
        loadData();
        setSelectedTopic(null);
    };

    const handleLessonClose = () => {
        loadData();
        setSelectedTopic(null);
    };

    const handleResetAll = () => {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            resetAllLessonProgress();
            loadData();
        }
    };

    const getTopicProgress = (topic: GrammarTopic) => {
        return progressData.find(p => p.topic === topic);
    };

    const recommendedTopic = getRecommendedLesson();

    if (selectedTopic) {
        return (
            <GrammarLessonView
                topic={selectedTopic}
                onClose={handleLessonClose}
                onComplete={handleLessonComplete}
            />
        );
    }

    const completionPercentage = stats.totalLessons > 0
        ? Math.round((stats.totalLessonsCompleted / stats.totalLessons) * 100)
        : 0;

    return (
        <div className="modal-overlay">
            <div className="modal-content grammar-lessons-modal">
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-title">
                        <BookOpen size={28} />
                        <div>
                            <h2>Grammar Lessons</h2>
                            <p className="subtitle">Master IELTS Grammar Step by Step</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose} title="Close">
                        <X size={24} />
                    </button>
                </div>

                {/* Stats Dashboard */}
                <div className="grammar-stats-dashboard">
                    <div className="stat-card stat-primary">
                        <div className="stat-icon">
                            <Target size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{completionPercentage}%</div>
                            <div className="stat-label">Completed</div>
                            <div className="stat-detail">{stats.totalLessonsCompleted} of {stats.totalLessons} lessons</div>
                        </div>
                    </div>

                    <div className="stat-card stat-success">
                        <div className="stat-icon">
                            <TrendingUp size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{Math.round(stats.overallAccuracy)}%</div>
                            <div className="stat-label">Accuracy</div>
                            <div className="stat-detail">{stats.totalExercisesCompleted} exercises completed</div>
                        </div>
                    </div>

                    <div className="stat-card stat-info">
                        <div className="stat-icon">
                            <Award size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.strongAreas.length}</div>
                            <div className="stat-label">Strong Areas</div>
                            <div className="stat-detail">
                                {stats.strongAreas.length > 0 ? 'Keep it up!' : 'Start practicing!'}
                            </div>
                        </div>
                    </div>

                    <div className="stat-card stat-warning">
                        <div className="stat-icon">
                            <BarChart3 size={24} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.weakAreas.length}</div>
                            <div className="stat-label">Weak Areas</div>
                            <div className="stat-detail">
                                {stats.weakAreas.length > 0 ? 'Focus needed' : 'All good!'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grammar-actions">
                    {recommendedTopic && (
                        <button
                            className="btn-recommended"
                            onClick={() => setSelectedTopic(recommendedTopic)}
                        >
                            <Target size={18} />
                            <span>Continue Learning</span>
                        </button>
                    )}
                    <button
                        className="btn-reset"
                        onClick={handleResetAll}
                        title="Reset all progress"
                    >
                        <RefreshCw size={18} />
                        <span>Reset Progress</span>
                    </button>
                </div>

                {/* Lessons Grid */}
                <div className="grammar-lessons-grid">
                    {grammarLessons.map((lesson) => {
                        const progress = getTopicProgress(lesson.topic);
                        const isCompleted = progress?.completed || false;
                        const isRecommended = recommendedTopic === lesson.topic;
                        const accuracy = progress ? Math.round(progress.score) : null;

                        return (
                            <div
                                key={lesson.topic}
                                className={`grammar-lesson-card ${isCompleted ? 'completed' : ''} ${isRecommended ? 'recommended' : ''}`}
                                onClick={() => setSelectedTopic(lesson.topic)}
                                style={{ '--lesson-color': lesson.color } as React.CSSProperties}
                            >
                                {isRecommended && (
                                    <div className="recommended-badge">
                                        <Target size={14} />
                                        <span>Recommended</span>
                                    </div>
                                )}

                                <div className="lesson-icon">{lesson.icon}</div>

                                <div className="lesson-content">
                                    <h3 className="lesson-title">{lesson.title}</h3>
                                    <p className="lesson-description">{lesson.description}</p>

                                    <div className="lesson-meta">
                                        <span className="lesson-difficulty">
                                            {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                                        </span>
                                        <span className="lesson-time">{lesson.estimatedTime} min</span>
                                        <span className="lesson-exercises">{lesson.exercises.length} exercises</span>
                                    </div>

                                    {progress && (
                                        <div className="lesson-progress">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${progress.score}%` }}
                                                />
                                            </div>
                                            <div className="progress-stats">
                                                <span className="progress-score">{accuracy}% accuracy</span>
                                                <span className="progress-attempts">{progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}</span>
                                            </div>
                                        </div>
                                    )}

                                    {isCompleted && (
                                        <div className="completion-badge">
                                            <Award size={16} />
                                            <span>Completed</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {grammarLessons.length === 0 && (
                    <div className="empty-state">
                        <BookOpen size={64} />
                        <h3>No Lessons Available</h3>
                        <p>Grammar lessons are being prepared.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
