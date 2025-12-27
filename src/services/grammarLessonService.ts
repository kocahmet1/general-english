import { GrammarTopic, LessonProgress, GrammarLessonStats, ExerciseAnswer } from '../types/grammarLesson';
import { grammarLessons } from '../data/grammarLessons';

// Local Storage Keys
const PROGRESS_KEY_PREFIX = 'grammar_lesson_progress_';
const STATS_KEY = 'grammar_lesson_stats';
const LAST_ACCESSED_KEY = 'grammar_lesson_last_accessed';

// Get lesson progress from localStorage
export const getLessonProgress = (topic: GrammarTopic): LessonProgress | null => {
    const key = `${PROGRESS_KEY_PREFIX}${topic}`;
    const stored = localStorage.getItem(key);

    if (!stored) return null;

    const data = JSON.parse(stored);
    // Convert exerciseResults object back to Map
    return {
        ...data,
        lastAttemptDate: new Date(data.lastAttemptDate),
        exerciseResults: new Map(Object.entries(data.exerciseResults).map(([k, v]) => [parseInt(k), v as boolean]))
    };
};

// Save lesson progress
export const saveLessonProgress = (progress: LessonProgress): void => {
    const key = `${PROGRESS_KEY_PREFIX}${progress.topic}`;
    // Convert Map to object for storage
    const dataToStore = {
        ...progress,
        exerciseResults: Object.fromEntries(progress.exerciseResults)
    };
    localStorage.setItem(key, JSON.stringify(dataToStore));

    // Update last accessed
    localStorage.setItem(LAST_ACCESSED_KEY, new Date().toISOString());
};

// Get all progress records
export const getAllLessonProgress = (): LessonProgress[] => {
    const progressList: LessonProgress[] = [];

    grammarLessons.forEach(lesson => {
        const progress = getLessonProgress(lesson.topic);
        if (progress) {
            progressList.push(progress);
        }
    });

    return progressList;
};

// Get grammar lesson statistics
export const getGrammarLessonStats = (): GrammarLessonStats => {
    const allProgress = getAllLessonProgress();
    const totalLessons = grammarLessons.length;
    const completedLessons = allProgress.filter(p => p.completed).length;

    const topicAccuracy = new Map<GrammarTopic, number>();
    let totalCorrect = 0;
    let totalAnswered = 0;

    allProgress.forEach(progress => {
        const accuracy = progress.totalQuestions > 0
            ? (progress.correctAnswers / progress.totalQuestions) * 100
            : 0;
        topicAccuracy.set(progress.topic, accuracy);
        totalCorrect += progress.correctAnswers;
        totalAnswered += progress.totalQuestions;
    });

    const overallAccuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;

    //  Identify weak and strong areas
    const sortedByAccuracy = Array.from(topicAccuracy.entries())
        .sort((a, b) => a[1] - b[1]);

    const weakAreas = sortedByAccuracy
        .filter(([_, acc]) => acc < 70)
        .slice(0, 3)
        .map(([topic]) => topic);

    const strongAreas = sortedByAccuracy
        .filter(([_, acc]) => acc >= 80)
        .reverse()
        .slice(0, 3)
        .map(([topic]) => topic);

    // Calculate streak
    const lastPractice = localStorage.getItem(LAST_ACCESSED_KEY);
    const currentStreak = calculateStreak();

    return {
        totalLessonsCompleted: completedLessons,
        totalLessons,
        overallAccuracy,
        topicAccuracy,
        weakAreas,
        strongAreas,
        totalExercisesCompleted: totalAnswered,
        currentStreak,
        lastPracticeDate: lastPractice ? new Date(lastPractice) : null
    };
};

// Calculate practice streak (simple version)
const calculateStreak = (): number => {
    // For now, just return 0. Can be enhanced to track daily practice
    return 0;
};

// Update lesson progress after answering exercises
export const updateLessonProgress = (
    topic: GrammarTopic,
    exerciseResults: Map<number, boolean>,
    completed: boolean
): void => {
    const correctAnswers = Array.from(exerciseResults.values()).filter(v => v).length;
    const totalQuestions = exerciseResults.size;
    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    const existingProgress = getLessonProgress(topic);
    const attempts = existingProgress ? existingProgress.attempts + 1 : 1;

    const progress: LessonProgress = {
        topic,
        completed,
        score,
        attempts,
        correctAnswers,
        totalQuestions,
        lastAttemptDate: new Date(),
        exerciseResults
    };

    saveLessonProgress(progress);
};

// Reset lesson progress
export const resetLessonProgress = (topic: GrammarTopic): void => {
    const key = `${PROGRESS_KEY_PREFIX}${topic}`;
    localStorage.removeItem(key);
};

// Reset all progress
export const resetAllLessonProgress = (): void => {
    grammarLessons.forEach(lesson => {
        resetLessonProgress(lesson.topic);
    });
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(LAST_ACCESSED_KEY);
};

// Get recommended next lesson based on progress
export const getRecommendedLesson = (): GrammarTopic | null => {
    const allProgress = getAllLessonProgress();
    const completedTopics = new Set(allProgress.map(p => p.topic));

    // Find first incomplete lesson
    for (const lesson of grammarLessons) {
        if (!completedTopics.has(lesson.topic)) {
            return lesson.topic;
        }
    }

    // If all completed, recommend weakest area
    const stats = getGrammarLessonStats();
    if (stats.weakAreas.length > 0) {
        return stats.weakAreas[0];
    }

    // Otherwise, return first lesson
    return grammarLessons[0]?.topic || null;
};
