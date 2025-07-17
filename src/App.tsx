import React, { useState } from 'react';
import { PanelRightOpen } from 'lucide-react';
import { Header } from './components/Header';
import { StatusCard } from './components/StatusCard';
import { Timeline } from './components/Timeline';
import { SidePanel } from './components/SidePanel';
import { useSlackPresence } from './hooks/useSlackPresence';
import { PresenceSettings } from './types';

const defaultSettings: PresenceSettings = {
  themeIntensity: 0.8,
  animationsEnabled: true,
  showTimeline: true,
  showCalendar: true
};

function App() {
  const { currentStatus, statusHistory, isConnected } = useSlackPresence();
  const [settings, setSettings] = useState<PresenceSettings>(defaultSettings);
  const [showSidePanel, setShowSidePanel] = useState(false);

  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animationsEnabled = settings.animationsEnabled && !prefersReducedMotion;

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Header */}
      <Header
        isConnected={isConnected}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Status Card */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 rounded-3xl blur-xl" />
            <div className="relative bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl">
              <StatusCard
                status={currentStatus}
                animationsEnabled={animationsEnabled}
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        {settings.showTimeline && (
          <Timeline
            history={statusHistory}
            animationsEnabled={animationsEnabled}
          />
        )}
      </div>

      {/* Side Panel Toggle */}
      {settings.showCalendar && (
        <button
          onClick={() => setShowSidePanel(!showSidePanel)}
          className="fixed right-4 bottom-4 p-3 bg-slate-800/90 backdrop-blur-md rounded-full border border-white/10 hover:bg-slate-700/90 transition-colors z-50"
        >
          <PanelRightOpen className="w-5 h-5 text-slate-300" />
        </button>
      )}

      {/* Side Panel */}
      {settings.showCalendar && (
        <SidePanel
          isOpen={showSidePanel}
          onClose={() => setShowSidePanel(false)}
          calendarData={[]}
        />
      )}

      {/* Background Effects */}
      {animationsEnabled && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      )}
    </div>
  );
}

export default App;