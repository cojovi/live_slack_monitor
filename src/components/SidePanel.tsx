import React from 'react';
import { Calendar, BarChart3, X } from 'lucide-react';
import { CalendarDay } from '../types';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  calendarData: CalendarDay[];
}

const generateCalendarData = (): CalendarDay[] => {
  const days: CalendarDay[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const intensity = Math.random();
    const totalMinutes = Math.floor(intensity * 480); // 0-8 hours
    
    days.push({
      date: date.toISOString().split('T')[0],
      intensity,
      totalMinutes,
      statuses: {
        online: Math.floor(intensity * 300),
        away: Math.floor(intensity * 120),
        dnd: Math.floor(intensity * 60),
        offline: Math.floor((1 - intensity) * 480)
      }
    });
  }
  
  return days;
};

export const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose }) => {
  const calendarData = generateCalendarData();

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-md border-l border-white/10 transform transition-transform duration-300 z-40">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-slate-200 font-semibold">Analytics</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Calendar Heat Map */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Calendar className="w-4 h-4 text-slate-400" />
            <h3 className="text-slate-300 font-medium">Presence Heat Map</h3>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarData.map((day, index) => (
              <div
                key={day.date}
                className={`w-6 h-6 rounded-sm ${
                  day.intensity > 0.7
                    ? 'bg-emerald-400'
                    : day.intensity > 0.4
                    ? 'bg-emerald-400/60'
                    : day.intensity > 0.2
                    ? 'bg-emerald-400/30'
                    : 'bg-slate-700'
                } hover:scale-110 transition-transform cursor-pointer`}
                title={`${day.date}: ${day.totalMinutes}min active`}
              />
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-slate-700 rounded-sm"></div>
              <div className="w-2 h-2 bg-emerald-400/30 rounded-sm"></div>
              <div className="w-2 h-2 bg-emerald-400/60 rounded-sm"></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Productivity Stats */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <h3 className="text-slate-300 font-medium">Today's Summary</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Online Time</span>
              <span className="text-emerald-400 font-medium">6h 32m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Away Time</span>
              <span className="text-amber-400 font-medium">1h 18m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Focus Time</span>
              <span className="text-red-400 font-medium">2h 45m</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Status Changes</span>
              <span className="text-slate-300 font-medium">12</span>
            </div>
          </div>
        </div>

        {/* Weekly Trends */}
        <div>
          <h3 className="text-slate-300 font-medium mb-3">Weekly Trends</h3>
          <div className="space-y-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 w-8">{day}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div
                    className="h-2 bg-emerald-400 rounded-full"
                    style={{ width: `${Math.random() * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">{Math.floor(Math.random() * 8)}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};