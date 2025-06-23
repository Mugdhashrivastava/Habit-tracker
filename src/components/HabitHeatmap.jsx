import React, { useState } from 'react';
import { getDateRange } from '../utils/dateUtils.js';

const HabitHeatmap = ({ habit, onDateEdit }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [editValue, setEditValue] = useState(0);
  const dates = getDateRange(84); // Last 12 weeks
  const weeks = [];
  
  // Group dates into weeks
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  const getIntensity = (count) => {
    if (count === 0) return 'bg-green-50 border-green-100 hover:bg-green-100';
    if (count === 1) return 'bg-green-100 border-green-200 hover:bg-green-200';
    if (count === 2) return 'bg-green-200 border-green-300 hover:bg-green-300';
    if (count >= 3) return 'bg-green-300 border-green-400 hover:bg-green-400';
    return 'bg-green-50 border-green-100 hover:bg-green-100';
  };

  const getTooltipText = (date, count) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    
    if (count === 0) return `${formattedDate}: No completions`;
    if (count === 1) return `${formattedDate}: 1 completion`;
    return `${formattedDate}: ${count} completions`;
  };

  const handleDateClick = (date, count) => {
    setSelectedDate(date);
    setEditValue(count);
  };

  const handleSaveEdit = () => {
    if (selectedDate !== null) {
      onDateEdit(habit.id, selectedDate, editValue);
      setSelectedDate(null);
      setEditValue(0);
    }
  };

  const handleCancelEdit = () => {
    setSelectedDate(null);
    setEditValue(0);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Activity over the last 12 weeks</h4>
        <span className="text-xs text-gray-500">Click to edit</span>
      </div>
      
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((date, dayIndex) => {
              const count = habit.completions[date] || 0;
              const isSelected = selectedDate === date;
              return (
                <div
                  key={date}
                  className={`w-3 h-3 rounded-sm border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'ring-2 ring-green-400 ring-offset-1' 
                      : getIntensity(count)
                  } hover:scale-110`}
                  title={getTooltipText(date, count)}
                  onClick={() => handleDateClick(date, count)}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-green-50 border border-green-100"></div>
          <div className="w-3 h-3 rounded-sm bg-green-100 border border-green-200"></div>
          <div className="w-3 h-3 rounded-sm bg-green-200 border border-green-300"></div>
          <div className="w-3 h-3 rounded-sm bg-green-300 border border-green-400"></div>
        </div>
        <span>More</span>
      </div>

      {/* Edit Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Edit {new Date(selectedDate).toLocaleDateString()}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Completions
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={editValue}
                onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitHeatmap;