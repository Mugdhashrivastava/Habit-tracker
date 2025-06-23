import { getDateRange, getToday } from './dateUtils.js';

export const calculateAnalytics = (habits) => {
  const last30Days = getDateRange(30);
  const today = getToday();
  
  // Total completions
  const totalCompletions = habits.reduce((total, habit) => {
    return total + Object.values(habit.completions).reduce((sum, count) => sum + count, 0);
  }, 0);
  
  // Average daily completions (last 30 days)
  const last30DaysCompletions = last30Days.reduce((total, date) => {
    return total + habits.reduce((dayTotal, habit) => {
      return dayTotal + (habit.completions[date] || 0);
    }, 0);
  }, 0);
  
  const averageDaily = last30DaysCompletions / 30;
  
  // Consistency score (percentage of days with at least one completion)
  const daysWithCompletions = last30Days.filter(date => {
    return habits.some(habit => (habit.completions[date] || 0) > 0);
  }).length;
  
  const consistencyScore = (daysWithCompletions / 30) * 100;
  
  // Best and worst days of the week
  const dayOfWeekStats = {};
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  last30Days.forEach(date => {
    const dayOfWeek = new Date(date).getDay();
    const dayName = dayNames[dayOfWeek];
    const dayCompletions = habits.reduce((total, habit) => {
      return total + (habit.completions[date] || 0);
    }, 0);
    
    dayOfWeekStats[dayName] = (dayOfWeekStats[dayName] || 0) + dayCompletions;
  });
  
  const bestDay = Object.entries(dayOfWeekStats).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  const worstDay = Object.entries(dayOfWeekStats).reduce((a, b) => a[1] < b[1] ? a : b)[0];
  
  // Weekly trend (last 4 weeks)
  const weeklyTrend = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - (i * 7) - 6);
    const weekDates = Array.from({ length: 7 }, (_, j) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + j);
      return date.toISOString().split('T')[0];
    });
    
    const weekCompletions = weekDates.reduce((total, date) => {
      return total + habits.reduce((dayTotal, habit) => {
        return dayTotal + (habit.completions[date] || 0);
      }, 0);
    }, 0);
    
    weeklyTrend.push({
      week: `Week ${4 - i}`,
      completions: weekCompletions
    });
  }
  
  // Category breakdown
  const categoryStats = {};
  habits.forEach(habit => {
    const habitCompletions = Object.values(habit.completions).reduce((sum, count) => sum + count, 0);
    categoryStats[habit.category] = (categoryStats[habit.category] || 0) + habitCompletions;
  });
  
  const categoryBreakdown = Object.entries(categoryStats).map(([category, completions]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    completions,
    percentage: totalCompletions > 0 ? (completions / totalCompletions) * 100 : 0
  }));
  
  return {
    totalCompletions,
    averageDaily: Math.round(averageDaily * 10) / 10,
    consistencyScore: Math.round(consistencyScore),
    bestDay,
    worstDay,
    weeklyTrend,
    categoryBreakdown
  };
};

export const calculateHabitProgress = (habit) => {
  const today = getToday();
  const currentWeek = getDateRange(7);
  const currentMonth = getDateRange(30);
  
  const weeklyCompletions = currentWeek.reduce((total, date) => {
    return total + (habit.completions[date] || 0);
  }, 0);
  
  const monthlyCompletions = currentMonth.reduce((total, date) => {
    return total + (habit.completions[date] || 0);
  }, 0);
  
  const weeklyProgress = habit.weeklyGoal ? (weeklyCompletions / habit.weeklyGoal) * 100 : 0;
  const monthlyProgress = habit.monthlyGoal ? (monthlyCompletions / habit.monthlyGoal) * 100 : 0;
  
  return {
    weeklyCompletions,
    monthlyCompletions,
    weeklyProgress: Math.min(weeklyProgress, 100),
    monthlyProgress: Math.min(monthlyProgress, 100)
  };
};