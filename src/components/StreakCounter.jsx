import React from 'react';
import { Flame, Trophy } from 'lucide-react';

const StreakCounter = ({ currentStreak, bestStreak }) => {
  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-full hover:bg-orange-100 transition-colors">
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-semibold text-orange-700">
          {currentStreak} day{currentStreak !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-full hover:bg-yellow-100 transition-colors">
        <Trophy className="w-4 h-4 text-yellow-600" />
        <span className="text-sm font-semibold text-yellow-700">
          Best: {bestStreak}
        </span>
      </div>
    </div>
  );
};

export default StreakCounter;