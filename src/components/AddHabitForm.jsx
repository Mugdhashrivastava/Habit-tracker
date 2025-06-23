import React, { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { habitTemplates, categoryColors } from '../utils/templates.js';

const EMOJI_OPTIONS = ['💪', '📚', '🏃', '💧', '🧘', '🎯', '✍️', '🎵', '🌱', '💤', '🍎', '🧼', '💊', '🤸', '📞', '🎨'];

const CATEGORIES = [
  'health', 'fitness', 'learning', 'mindfulness', 
  'creative', 'social', 'productivity', 'other'
];

const AddHabitForm = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💪');
  const [selectedCategory, setSelectedCategory] = useState('health');
  const [weeklyGoal, setWeeklyGoal] = useState(7);
  const [monthlyGoal, setMonthlyGoal] = useState(30);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), selectedEmoji, selectedCategory, weeklyGoal, monthlyGoal);
      setName('');
      setSelectedEmoji('💪');
      setSelectedCategory('health');
      setWeeklyGoal(7);
      setMonthlyGoal(30);
      setIsOpen(false);
      setShowTemplates(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setName(template.name);
    setSelectedEmoji(template.emoji);
    setSelectedCategory(template.category);
    setWeeklyGoal(template.weeklyGoal);
    setMonthlyGoal(template.weeklyGoal * 4);
    setShowTemplates(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 border-2 border-dashed border-green-200 rounded-xl text-green-600 hover:border-green-300 hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium group"
      >
        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
        Add New Habit
      </button>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Add New Habit</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Use template"
          >
            <Sparkles className="w-5 h-5 text-purple-500" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {showTemplates && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="text-sm font-medium text-purple-800 mb-3">Quick Start Templates</h4>
          <div className="grid grid-cols-2 gap-2">
            {habitTemplates.slice(0, 6).map((template, index) => (
              <button
                key={index}
                onClick={() => handleTemplateSelect(template)}
                className="flex items-center gap-2 p-2 text-left hover:bg-purple-100 rounded-lg transition-colors text-sm"
              >
                <span className="text-lg">{template.emoji}</span>
                <span className="text-gray-700">{template.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose an emoji
          </label>
          <div className="grid grid-cols-8 gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                className={`p-2 text-2xl rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                  selectedEmoji === emoji
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Habit name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Drink 8 glasses of water"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weekly Goal
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={weeklyGoal}
              onChange={(e) => setWeeklyGoal(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Goal
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={monthlyGoal}
              onChange={(e) => setMonthlyGoal(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
        
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
          >
            Add Habit
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHabitForm;