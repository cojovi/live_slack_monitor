export interface SlackStatus {
  id: string;
  status: 'online' | 'away' | 'dnd' | 'offline';
  statusText: string;
  statusEmoji: string;
  timestamp: number;
  avatar: string;
  realName: string;
  displayName: string;
  statusExpiration: number | null;
}

export interface StatusHistoryItem {
  id: string;
  status: SlackStatus['status'];
  timestamp: number;
  duration: number;
}

export interface CalendarDay {
  date: string;
  intensity: number; // 0-1 scale for heat map
  totalMinutes: number;
  statuses: { [key: string]: number };
}

export interface PresenceSettings {
  themeIntensity: number;
  animationsEnabled: boolean;
  showTimeline: boolean;
  showCalendar: boolean;
}
