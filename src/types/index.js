// Type definitions as JSDoc comments for better IDE support

/**
 * @typedef {Object} Habit
 * @property {string} id
 * @property {string} name
 * @property {string} emoji
 * @property {HabitCategory} category
 * @property {string} createdAt
 * @property {number} currentStreak
 * @property {number} bestStreak
 * @property {Record<string, number>} completions - date -> count
 * @property {number} [weeklyGoal]
 * @property {number} [monthlyGoal]
 * @property {string} color
 */

/**
 * @typedef {Object} HabitCompletion
 * @property {string} habitId
 * @property {string} date
 * @property {number} count
 */

/**
 * @typedef {'health' | 'productivity' | 'learning' | 'fitness' | 'mindfulness' | 'social' | 'creative' | 'other'} HabitCategory
 */

/**
 * @typedef {Object} Achievement
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} icon
 * @property {boolean} unlocked
 * @property {string} [unlockedAt]
 */

/**
 * @typedef {Object} HabitTemplate
 * @property {string} name
 * @property {string} emoji
 * @property {HabitCategory} category
 * @property {number} weeklyGoal
 * @property {string} color
 */

/**
 * @typedef {Object} AnalyticsData
 * @property {number} totalCompletions
 * @property {number} averageDaily
 * @property {number} consistencyScore
 * @property {string} bestDay
 * @property {string} worstDay
 * @property {Array<{week: string, completions: number}>} weeklyTrend
 * @property {Array<{category: string, completions: number, percentage: number}>} categoryBreakdown
 */

export {};