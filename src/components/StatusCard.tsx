import React from 'react';
import { SlackStatus } from '../types';

interface StatusCardProps {
  status: SlackStatus;
  animationsEnabled: boolean;
}

const getStatusLabel = (status: SlackStatus['status']) => {
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

const formatExpiration = (timestamp: number | null) => {
  if (!timestamp || timestamp <= Date.now()) {
    return null;
  }

  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });
};

export const StatusCard: React.FC<StatusCardProps> = ({ status, animationsEnabled }) => {
  const statusLabel = getStatusLabel(status.status);
  const expirationLabel = formatExpiration(status.statusExpiration);

  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      {/* Avatar with Status Halo */}
      <div className="relative">
        <div
          className={`absolute inset-0 rounded-full ${
            animationsEnabled ? 'animate-pulse' : ''
          } ${
            status.status === 'online'
              ? 'bg-emerald-400/20 shadow-lg shadow-emerald-400/30'
              : status.status === 'away'
              ? 'bg-amber-400/20 shadow-lg shadow-amber-400/30'
              : status.status === 'dnd'
              ? 'bg-red-400/20 shadow-lg shadow-red-400/30'
              : 'bg-slate-400/20 shadow-lg shadow-slate-400/30'
          } ${animationsEnabled ? 'animate-pulse' : ''}`}
          style={{
            transform: 'scale(1.2)',
            animationDuration: status.status === 'online' ? '2s' : '3s'
          }}
        />

        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/20 bg-slate-800">
          <img
            src={status.avatar}
            alt={status.realName}
            className="w-full h-full object-cover"
          />

          {/* Status Indicator */}
          <div
            className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-slate-900 ${
              status.status === 'online'
                ? 'bg-emerald-400'
                : status.status === 'away'
                ? 'bg-amber-400'
                : status.status === 'dnd'
                ? 'bg-red-400'
                : 'bg-slate-400'
            } ${animationsEnabled ? 'animate-pulse' : ''}`}
          />
        </div>
      </div>

      {/* Status Info */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-100">{status.displayName}</h1>
        <div className="flex items-center justify-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              status.status === 'online'
                ? 'bg-emerald-400'
                : status.status === 'away'
                ? 'bg-amber-400'
                : status.status === 'dnd'
                ? 'bg-red-400'
                : 'bg-slate-400'
            }`}
          />
          <span className="text-slate-300 font-medium">{statusLabel}</span>
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-2xl">{status.statusEmoji}</span>
          <span className="text-xl text-slate-200 font-medium">{status.statusText}</span>
        </div>
        {expirationLabel && (
          <p className="text-sm text-slate-300">
            Busy until {expirationLabel}
          </p>
        )}
        <p className="text-xs text-slate-500">
          Last updated: {new Date(status.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};
