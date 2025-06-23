import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Target, Calendar, Award, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { calculateAnalytics } from '../utils/analytics.js';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#EC4899', '#84CC16'];

const Analytics = ({ habits }) => {
  const analytics = calculateAnalytics(habits);

  if (habits.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 border border-green-200 shadow-sm text-center">
        <div className="text-gray-400 mb-4">
          <TrendingUp className="w-12 h-12 mx-auto mb-2" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Analytics Yet</h3>
        <p className="text-gray-500">Add some habits and start tracking to see your analytics!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{analytics.totalCompletions}</p>
              <p className="text-sm text-gray-600">Total Completions</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{analytics.averageDaily}</p>
              <p className="text-sm text-gray-600">Daily Average</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{analytics.consistencyScore}%</p>
              <p className="text-sm text-gray-600">Consistency</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-full">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{analytics.bestDay}</p>
              <p className="text-sm text-gray-600">Best Day</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Weekly Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="completions" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Category Breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category} ${percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="completions"
              >
                {analytics.categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Habit Performance */}
        <div className="bg-white rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Habit Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={habits.map(habit => ({
              name: habit.name,
              completions: Object.values(habit.completions).reduce((sum, count) => sum + count, 0),
              streak: habit.currentStreak
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="completions" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-700">Most Productive Day</p>
            <p className="text-green-600 font-semibold">{analytics.bestDay}</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="font-medium text-gray-700">Consistency Score</p>
            <p className="text-blue-600 font-semibold">{analytics.consistencyScore}% this month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;