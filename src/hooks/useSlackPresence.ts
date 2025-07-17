import { useState, useEffect, useCallback } from 'react';
import { SlackStatus, StatusHistoryItem } from '../types';

// Mock data for demonstration
const MOCK_STATUS: SlackStatus = {
  id: 'U12345',
  status: 'online',
  statusText: 'In a meeting',
  statusEmoji: '📞',
  timestamp: Date.now(),
  avatar: '/CMAC_Roofing_0009_Yard_Sign_March2024.pdf.png',
  realName: 'Alex Johnson',
  displayName: 'Alex'
};

const generateMockHistory = (): StatusHistoryItem[] => {
  const history: StatusHistoryItem[] = [];
  const now = Date.now();
  const statuses: SlackStatus['status'][] = ['online', 'away', 'dnd', 'offline'];
  
  for (let i = 0; i < 48; i++) {
    const timestamp = now - (i * 30 * 60 * 1000); // 30 min intervals
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const duration = 25 + Math.random() * 35; // 25-60 minutes
    
    history.push({
      id: `hist_${i}`,
      status,
      timestamp,
      duration
    });
  }
  
  return history.reverse();
};

export const useSlackPresence = () => {
  const [currentStatus, setCurrentStatus] = useState<SlackStatus>(MOCK_STATUS);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate real-time connection
  useEffect(() => {
    setIsConnected(true);
    setStatusHistory(generateMockHistory());

    // Simulate status changes every 2-5 minutes
    const interval = setInterval(() => {
      const statuses = ['online', 'away', 'dnd'] as const;
      const statusTexts = [
        'Available',
        'In a meeting',
        'Grabbing lunch',
        'Focus time',
        'Away from desk'
      ];
      const emojis = ['✅', '📞', '🍔', '🎯', '🚶'];
      
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomIndex = Math.floor(Math.random() * statusTexts.length);
      
      setCurrentStatus(prev => ({
        ...prev,
        status: newStatus,
        statusText: statusTexts[randomIndex],
        statusEmoji: emojis[randomIndex],
        timestamp: Date.now()
      }));
    }, Math.random() * 180000 + 120000); // 2-5 minutes

    return () => clearInterval(interval);
  }, []);

  const updateStatus = useCallback((newStatus: Partial<SlackStatus>) => {
    setCurrentStatus(prev => ({ ...prev, ...newStatus, timestamp: Date.now() }));
  }, []);

  return {
    currentStatus,
    statusHistory,
    isConnected,
    updateStatus
  };
};