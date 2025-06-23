import { getToday } from './dateUtils.js';

export const checkAchievements = (habits, currentAchievements) => {
  const today = getToday();
  const achievements = [
    {
      id: 'first-habit',
      title: 'Getting Started',
      description: 'Create your first habit',
      icon: '🌱',
      unlocked: false
    },
    {
      id: 'week-streak',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      unlocked: false
    },
    {
      id: 'month-streak',
      title: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      icon: '👑',
      unlocked: false
    },
    {
      id: 'hundred-completions',
      title: 'Century Club',
      description: 'Complete 100 habit instances',
      icon: '💯',
      unlocked: false
    },
    {
      id: 'five-habits',
      title: 'Habit Collector',
      description: 'Track 5 different habits',
      icon: '📚',
      unlocked: false
    },
    {
      id: 'perfect-week',
      title: 'Perfect Week',
      description: 'Complete all habits for 7 consecutive days',
      icon: '⭐',
      unlocked: false
    },
    {
      id: 'early-bird',
      title: 'Early Bird',
      description: 'Complete habits 10 days in a row',
      icon: '🐦',
      unlocked: false
    },
    {
      id: 'consistency-king',
      title: 'Consistency King',
      description: 'Achieve 90% consistency for a month',
      icon: '👑',
      unlocked: false
    }
  ];

  // Merge with current achievements to preserve unlocked status
  const mergedAchievements = achievements.map(achievement => {
    const existing = currentAchievements.find(a => a.id === achievement.id);
    return existing || achievement;
  });

  // Check achievement conditions
  const totalCompletions = habits.reduce((total, habit) => {
    return total + Object.values(habit.completions).reduce((sum, count) => sum + count, 0);
  }, 0);

  const maxStreak = Math.max(...habits.map(h => h.currentStreak), 0);
  const bestStreak = Math.max(...habits.map(h => h.bestStreak), 0);

  // Update achievements
  mergedAchievements.forEach(achievement => {
    if (achievement.unlocked) return;

    let shouldUnlock = false;

    switch (achievement.id) {
      case 'first-habit':
        shouldUnlock = habits.length > 0;
        break;
      case 'week-streak':
        shouldUnlock = bestStreak >= 7;
        break;
      case 'month-streak':
        shouldUnlock = bestStreak >= 30;
        break;
      case 'hundred-completions':
        shouldUnlock = totalCompletions >= 100;
        break;
      case 'five-habits':
        shouldUnlock = habits.length >= 5;
        break;
      case 'perfect-week':
        shouldUnlock = checkPerfectWeek(habits);
        break;
      case 'early-bird':
        shouldUnlock = bestStreak >= 10;
        break;
      case 'consistency-king':
        shouldUnlock = checkConsistency(habits);
        break;
    }

    if (shouldUnlock) {
      achievement.unlocked = true;
      achievement.unlockedAt = today;
    }
  });

  return mergedAchievements;
};

const checkPerfectWeek = (habits) => {
  if (habits.length === 0) return false;

  // Check last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  return last7Days.every(date => {
    return habits.every(habit => (habit.completions[date] || 0) > 0);
  });
};

const checkConsistency = (habits) => {
  if (habits.length === 0) return false;
  
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const daysWithCompletions = last30Days.filter(date => {
    return habits.some(habit => (habit.completions[date] || 0) > 0);
  }).length;

  return (daysWithCompletions / 30) >= 0.9; // 90% consistency
};