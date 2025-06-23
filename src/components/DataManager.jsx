import React from 'react';
import { Download, Upload, RotateCcw } from 'lucide-react';

const DataManager = ({ habits, onImport, onClearData }) => {
  const exportData = () => {
    const data = {
      habits,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.habits && Array.isArray(data.habits)) {
          onImport(data.habits);
          alert('Data imported successfully!');
        } else {
          alert('Invalid file format');
        }
      } catch (error) {
        alert('Error reading file');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      onClearData();
      alert('All data has been cleared');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Data Management</h2>
        <p className="text-gray-600">Export, import, or manage your habit data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Export Data */}
        <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Export Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Download your habit data as a JSON file for backup
            </p>
            <button
              onClick={exportData}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Export
            </button>
          </div>
        </div>

        {/* Import Data */}
        <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Import Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Restore your habit data from a backup file
            </p>
            <label className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors cursor-pointer block">
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Clear Data */}
        <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="text-center">
            <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-4">
              <RotateCcw className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Clear Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Remove all habits and start fresh
            </p>
            <button
              onClick={handleClearData}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Data Summary */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Data Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-800">{habits.length}</p>
            <p className="text-sm text-gray-600">Total Habits</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {habits.reduce((total, habit) => 
                total + Object.values(habit.completions).reduce((sum, count) => sum + count, 0), 0
              )}
            </p>
            <p className="text-sm text-gray-600">Total Completions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {Math.max(...habits.map(h => h.currentStreak), 0)}
            </p>
            <p className="text-sm text-gray-600">Longest Current Streak</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {Math.max(...habits.map(h => h.bestStreak), 0)}
            </p>
            <p className="text-sm text-gray-600">Best Streak Ever</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManager;