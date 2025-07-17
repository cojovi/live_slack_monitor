import React, { useState } from 'react';
import { StatusHistoryItem } from '../types';

interface TimelineProps {
  history: StatusHistoryItem[];
  animationsEnabled: boolean;
}

const getStatusColor = (status: StatusHistoryItem['status']) => {
  switch (status) {
    case 'online':
      return 'bg-emerald-400';
    case 'away':
      return 'bg-amber-400';
    case 'dnd':
      return 'bg-red-400';
    case 'offline':
      return 'bg-slate-400';
    default:
      return 'bg-slate-400';
  }
};

const getStatusLabel = (status: StatusHistoryItem['status']) => {
  switch (status) {
    case 'online':
      return 'Online';
    case 'away':
      return 'Away';
    case 'dnd':
      return 'Do Not Disturb';
    case 'offline':
      return 'Offline';
    default:
      return 'Unknown';
  }
};

export const Timeline: React.FC<TimelineProps> = ({ history, animationsEnabled }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="bg-black/20 backdrop-blur-md border-t border-white/10 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-300 font-semibold">24-Hour Timeline</h3>
        <div className="flex items-center space-x-4 text-xs text-slate-400">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span>Online</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span>Away</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span>DND</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
            <span>Offline</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex space-x-1 overflow-x-auto pb-2">
          {history.map((item, index) => (
            <div
              key={item.id}
              className="relative flex-shrink-0"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div
                className={`w-4 h-8 rounded-sm ${getStatusColor(item.status)} ${
                  animationsEnabled && hoveredItem === item.id
                    ? 'transform -translate-y-1 shadow-lg'
                    : ''
                } transition-all duration-200 cursor-pointer`}
                style={{
                  opacity: 0.7 + (item.duration / 60) * 0.3 // Opacity based on duration
                }}
              />
              
              {/* Tooltip */}
              {hoveredItem === item.id && (
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-slate-800 text-white text-xs rounded-lg p-2 shadow-lg border border-white/20 whitespace-nowrap">
                    <div className="font-medium">{getStatusLabel(item.status)}</div>
                    <div className="text-slate-300">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="text-slate-300">
                      {Math.round(item.duration)}min
                    </div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};