import React, { useState } from 'react';
import { Settings, Wifi, WifiOff } from 'lucide-react';
import { useClock } from '../hooks/useClock';
import { PresenceSettings } from '../types';

interface HeaderProps {
  isConnected: boolean;
  settings: PresenceSettings;
  onSettingsChange: (settings: PresenceSettings) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  settings,
  onSettingsChange
}) => {
  const { localTime, utcTime } = useClock();
  const [showSettings, setShowSettings] = useState(false);

  const handleSettingChange = (key: keyof PresenceSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <header className="h-12 bg-black/20 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 relative">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <span className="text-emerald-400 font-semibold text-lg tracking-wide">
          CMAC Presence
        </span>
      </div>

      {/* Clock */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4 font-mono text-sm">
          <div className="text-slate-300">
            <span className="text-slate-500">UTC</span>
            <span className="ml-2 text-emerald-400">{utcTime}</span>
          </div>
          <div className="text-slate-300">
            <span className="text-slate-500">LOCAL</span>
            <span className="ml-2 text-emerald-400">{localTime}</span>
          </div>
        </div>
        
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-emerald-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span className={`text-xs ${isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* Settings */}
      <div className="relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Settings className="w-4 h-4 text-slate-400" />
        </button>

        {showSettings && (
          <div className="absolute right-0 top-12 w-80 bg-slate-900/95 backdrop-blur-md rounded-lg border border-white/10 p-4 shadow-xl z-50">
            <h3 className="text-slate-200 font-semibold mb-4">Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Theme Intensity
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.themeIntensity}
                  onChange={(e) => handleSettingChange('themeIntensity', parseFloat(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Animations</span>
                <button
                  onClick={() => handleSettingChange('animationsEnabled', !settings.animationsEnabled)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    settings.animationsEnabled ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.animationsEnabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Timeline</span>
                <button
                  onClick={() => handleSettingChange('showTimeline', !settings.showTimeline)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    settings.showTimeline ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.showTimeline ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Calendar</span>
                <button
                  onClick={() => handleSettingChange('showCalendar', !settings.showCalendar)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    settings.showCalendar ? 'bg-emerald-500' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.showCalendar ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};