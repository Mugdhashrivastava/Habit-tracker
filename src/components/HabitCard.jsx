import React from 'react';
import { Minus, Plus, Trash2, Target, TrendingUp } from 'lucide-react';
import { getToday } from '../utils/dateUtils.js';
import { calculateHabitProgress } from '../utils/analytics.js';
import { categoryColors } from '../utils/templates.js';
import StreakCounter from './StreakCounter.jsx';
import HabitHeatmap from './HabitHeatmap.jsx';

const HabitCard = ({ 
  habit, 
  onIncrement, 
  onDecrement, 
  onDelete,
  onDateEdit 
}) => {
  const today = getToday();
  const todayCount = habit.completions[today] || 0;
  const progress = calculateHabitProgress(habit);

  return (
    <div className="bg-white rounded-xl p-6 border border-green-100 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{habit.emoji}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[habit.category]}`}>
                {habit.category}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Today: {todayCount} time{todayCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={() => onDelete(habit.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bars */}
      {(habit.weeklyGoal || habit.monthlyGoal) && (
        <div className="mb-4 space-y-2">
          {habit.weeklyGoal && (
            <div className="flex items-center gap-3">
              <Target className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Weekly: {progress.weeklyCompletions}/{habit.weeklyGoal}</span>
                  <span>{Math.round(progress.weeklyProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress.weeklyProgress, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          {habit.monthlyGoal && (
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Monthly: {progress.monthlyCompletions}/{habit.monthlyGoal}</span>
                  <span>{Math.round(progress.monthlyProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress.monthlyProgress, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <StreakCounter 
          currentStreak={habit.currentStreak} 
          bestStreak={habit.bestStreak} 
        />
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDecrement(habit.id)}
            disabled={todayCount === 0}
            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="min-w-[3rem] text-center font-semibold text-lg text-gray-800">
            {todayCount}
          </span>
          
          <button
            onClick={() => onIncrement(habit.id)}
            className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-all duration-200 hover:scale-110"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <HabitHeatmap habit={habit} onDateEdit={onDateEdit} />
    </div>
  );
};

export default HabitCard;