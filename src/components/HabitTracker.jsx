import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, BarChart3, Award, Settings, Home } from 'lucide-react';
import { saveHabits, loadHabits, generateId } from '../utils/storage.js';
import { getToday, isPreviousDay } from '../utils/dateUtils.js';
import { checkAchievements } from '../utils/achievements.js';
import HabitCard from './HabitCard.jsx';
import AddHabitForm from './AddHabitForm.jsx';
import Analytics from './Analytics.jsx';
import Achievements from './Achievements.jsx';
import DataManager from './DataManager.jsx';


const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [activeTab, setActiveTab] = useState('habits');

  useEffect(() => {
    const loadedHabits = loadHabits();
    setHabits(loadedHabits);
    
    const savedAchievements = localStorage.getItem('habit-tracker-achievements');
    const loadedAchievements = savedAchievements ? JSON.parse(savedAchievements) : [];
    setAchievements(checkAchievements(loadedHabits, loadedAchievements));
  }, []);

  useEffect(() => {
    saveHabits(habits);
    const updatedAchievements = checkAchievements(habits, achievements);
    setAchievements(updatedAchievements);
    localStorage.setItem('habit-tracker-achievements', JSON.stringify(updatedAchievements));
  }, [habits]);

  const calculateStreak = (completions, targetDate) => {
    let streak = 0;
    let currentDate = targetDate;
    
    while (completions[currentDate] && completions[currentDate] > 0) {
      streak++;
      const date = new Date(currentDate);
      date.setDate(date.getDate() - 1);
      currentDate = date.toISOString().split('T')[0];
    }
    
    return streak;
  };

  const updateStreaks = (habit) => {
    const today = getToday();
    const currentStreak = calculateStreak(habit.completions, today);
    
    // Calculate best streak by checking all possible starting points
    let bestStreak = 0;
    const sortedDates = Object.keys(habit.completions)
      .filter(date => habit.completions[date] > 0)
      .sort();
    
    for (const date of sortedDates) {
      const streak = calculateStreak(habit.completions, date);
      if (streak > bestStreak) {
        bestStreak = streak;
      }
    }
    
    return {
      ...habit,
      currentStreak,
      bestStreak: Math.max(bestStreak, currentStreak)
    };
  };

  const addHabit = (name, emoji, category = 'other', weeklyGoal = 7, monthlyGoal = 30) => {
    const newHabit = {
      id: generateId(),
      name,
      emoji,
      category,
      createdAt: getToday(),
      currentStreak: 0,
      bestStreak: 0,
      completions: {},
      weeklyGoal,
      monthlyGoal,
      color: 'bg-green-100'
    };
    
    setHabits(prev => [...prev, newHabit]);
  };

  const incrementHabit = (habitId) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const today = getToday();
        const newCompletions = {
          ...habit.completions,
          [today]: (habit.completions[today] || 0) + 1
        };
        
        const updatedHabit = updateStreaks({
          ...habit,
          completions: newCompletions
        });
        
        return updatedHabit;
      }
      return habit;
    }));
  };

  const decrementHabit = (habitId) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const today = getToday();
        const currentCount = habit.completions[today] || 0;
        
        if (currentCount > 0) {
          const newCompletions = {
            ...habit.completions,
            [today]: currentCount - 1
          };
          
          if (newCompletions[today] === 0) {
            delete newCompletions[today];
          }
          
          const updatedHabit = updateStreaks({
            ...habit,
            completions: newCompletions
          });
          
          return updatedHabit;
        }
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      setHabits(prev => prev.filter(habit => habit.id !== habitId));
    }
  };

  const editHabitDate = (habitId, date, count) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newCompletions = { ...habit.completions };
        
        if (count === 0) {
          delete newCompletions[date];
        } else {
          newCompletions[date] = count;
        }
        
        const updatedHabit = updateStreaks({
          ...habit,
          completions: newCompletions
        });
        
        return updatedHabit;
      }
      return habit;
    }));
  };

  const importData = (importedHabits) => {
    setHabits(importedHabits);
  };

  const clearAllData = () => {
    setHabits([]);
    setAchievements([]);
    localStorage.removeItem('habit-tracker-achievements');
  };

  const totalCompletionsToday = habits.reduce((total, habit) => {
    const today = getToday();
    return total + (habit.completions[today] || 0);
  }, 0);

  const activeStreaks = habits.filter(habit => habit.currentStreak > 0).length;
  const newAchievements = achievements.filter(a => a.unlocked).length;

  const tabs = [
    { id: 'habits', label: 'Habits', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'data', label: 'Data', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Habit Tracker Pro
          </h1>
          <p className="text-gray-600 text-lg">
            Build better habits, track progress, achieve goals
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 border border-green-200 shadow-sm">
            <div className="flex gap-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-green-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-green-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.id === 'achievements' && newAchievements > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {newAchievements}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'habits' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{totalCompletionsToday}</p>
                    <p className="text-sm text-gray-600">Completions Today</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{activeStreaks}</p>
                    <p className="text-sm text-gray-600">Active Streaks</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{newAchievements}</p>
                    <p className="text-sm text-gray-600">Achievements</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <AddHabitForm onAdd={addHabit} />
              
              {habits.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-2">No habits yet!</p>
                  <p className="text-gray-400">Add your first habit to get started on your journey.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {habits.map(habit => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      onIncrement={incrementHabit}
                      onDecrement={decrementHabit}
                      onDelete={deleteHabit}
                      onDateEdit={editHabitDate}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'analytics' && <Analytics habits={habits} />}
        {activeTab === 'achievements' && <Achievements achievements={achievements} />}
        {activeTab === 'data' && (
          <DataManager 
            habits={habits} 
            onImport={importData} 
            onClearData={clearAllData} 
          />
        )}
      </div>
    </div>
  );
};

export default HabitTracker;