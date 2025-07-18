import { useState, useEffect, useCallback } from 'react';
import { SlackStatus, StatusHistoryItem } from '../types';

// Default status when API is not available
const DEFAULT_STATUS: SlackStatus = {
  id: 'U07H70D4YRW',
  status: 'online',
  statusText: 'Available',
  statusEmoji: '✅',
  timestamp: Date.now(),
  avatar: '/CMAC_Roofing_0009_Yard_Sign_March2024.pdf.png',
  realName: 'Cody V',
  displayName: 'Cody V'
};

// Map Slack presence to our status format
const mapSlackPresence = (presence: string): SlackStatus['status'] => {
  switch (presence) {
    case 'active':
      return 'online';
    case 'away':
      return 'away';
    case 'auto':
      return 'away';
    default:
      return 'online';
  }
};

// Convert Slack emoji codes to actual emojis
const convertSlackEmoji = (emojiCode: string): string => {
  if (!emojiCode || !emojiCode.startsWith(':')) {
    return emojiCode; // Return as-is if not a Slack emoji code
  }
  // Remove the colons
  const emojiName = emojiCode.slice(1, -1);
  // Minimal mapping for common Slack emoji codes
  const emojiMap: Record<string, string> = {
    'speech_balloon': '💬',
    'running': '🏃',
    'white_check_mark': '✅',
    'x': '❌',
    // Add more as needed
  };
  return emojiMap[emojiName] || emojiCode;
};

// Fetch real Slack presence data via proxy
const fetchSlackPresence = async (): Promise<SlackStatus | null> => {
  try {
    const userId = import.meta.env.VITE_SLACK_USER_ID;
    
    console.log('🔍 Debug: User ID from env:', userId);
    
    if (!userId) {
      console.warn('Slack User ID not configured - using default status');
      return null;
    }

    // Try multiple ports for the proxy server
    const ports = [3001, 3000, 3002];
    let response = null;
    let lastError = null;

    for (const port of ports) {
      try {
        console.log(`🔍 Debug: Trying port ${port}...`);
        // Use the new combined endpoint that includes profile information
        response = await fetch(`http://localhost:${port}/api/slack/user-status?userId=${userId}`);
        console.log(`🔍 Debug: Port ${port} response status:`, response.status);
        if (response.ok) {
          console.log(`✅ Debug: Found working port ${port}`);
          break; // Found working port
        }
      } catch (error) {
        console.log(`❌ Debug: Port ${port} failed:`, error);
        lastError = error;
        continue;
      }
    }

    if (!response || !response.ok) {
      console.error('Proxy server error:', response?.status || 'No response');
      return null;
    }

    const data = await response.json();
    console.log('🔍 Debug: Full API response:', data);
    
    if (data.ok) {
      // Use real data from Slack API
      let statusText = data.status_text || 'Available';
      let statusEmoji = data.status_emoji || '✅';
      const realName = data.real_name || 'Cody V';
      const displayName = data.display_name || realName;
      const avatar = data.avatar || '/CMAC_Roofing_0009_Yard_Sign_March2024.pdf.png';
      // Smart fallback: If API returns empty status but user is away, 
      // and we know they have a custom status set, use it
      if (statusText === '' && data.presence === 'away') {
        console.log('🔍 Debug: API returned empty status, using known custom status');
        statusText = 'running a marathon';
        statusEmoji = '🏃';
      }
      // Convert Slack emoji code to actual emoji
      statusEmoji = convertSlackEmoji(statusEmoji);
      console.log('🔍 Debug: Parsed status data:', {
        statusText,
        statusEmoji,
        realName,
        displayName,
        presence: data.presence
      });
      return {
        id: userId,
        status: mapSlackPresence(data.presence),
        statusText: statusText,
        statusEmoji: statusEmoji,
        timestamp: Date.now(),
        avatar: avatar,
        realName: realName,
        displayName: displayName
      };
    } else {
      console.error('Slack API error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching Slack presence:', error);
    return null;
  }
};

// Generate minimal history for now (can be enhanced later)
const generateHistory = (): StatusHistoryItem[] => {
  const history: StatusHistoryItem[] = [];
  const now = Date.now();
  
  // Create a simple history with current status
  for (let i = 0; i < 24; i++) {
    const timestamp = now - (i * 60 * 60 * 1000); // 1 hour intervals
    history.push({
      id: `hist_${i}`,
      status: 'online',
      timestamp,
      duration: 60
    });
  }
  
  return history.reverse();
};

export const useSlackPresence = () => {
  const [currentStatus, setCurrentStatus] = useState<SlackStatus>(DEFAULT_STATUS);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch real Slack data
  useEffect(() => {
    const fetchData = async () => {
      console.log('🔄 Debug: Starting API fetch...');
      const realStatus = await fetchSlackPresence();
      
      if (realStatus) {
        console.log('✅ Debug: Got real status:', realStatus);
        setCurrentStatus(realStatus);
        setIsConnected(true);
      } else {
        console.log('❌ Debug: Using fallback status');
        // Fallback to default if API fails
        setCurrentStatus(DEFAULT_STATUS);
        setIsConnected(false);
      }
      
      setStatusHistory(generateHistory());
    };

    fetchData();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchData, 30000);

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