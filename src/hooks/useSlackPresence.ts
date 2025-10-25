import { useState, useEffect } from 'react';
import { SlackStatus, StatusHistoryItem } from '../types';

interface SlackProfileResponse {
  ok: boolean;
  profile?: {
    status_text?: string;
    status_emoji?: string;
    status_expiration?: number;
    real_name?: string;
    display_name?: string;
    image_192?: string;
    image_512?: string;
  } & Record<string, unknown>;
  error?: string;
}

interface SlackUserInfoResponse {
  ok: boolean;
  user?: {
    id: string;
    profile?: {
      real_name?: string;
      display_name?: string;
      image_192?: string;
      image_512?: string;
    } & Record<string, unknown>;
  };
  error?: string;
}

interface SlackPresenceResponse {
  ok: boolean;
  presence?: 'active' | 'away';
  connection_count?: number;
  manual_away?: boolean;
  auto_away?: boolean;
  error?: string;
}

interface SlackDndResponse {
  ok: boolean;
  dnd_enabled?: boolean;
  next_dnd_end_ts?: number;
  error?: string;
}

const FALLBACK_AVATAR = '/CMAC_Roofing_0009_Yard_Sign_March2024.pdf.png';
const POLL_INTERVAL = 30_000; // 30 seconds

const INITIAL_STATUS: SlackStatus = {
  id: 'unknown',
  status: 'offline',
  statusText: 'Loading Slack status…',
  statusEmoji: '⌛',
  timestamp: Date.now(),
  avatar: FALLBACK_AVATAR,
  realName: 'Slack User',
  displayName: 'Slack User',
  statusExpiration: null
};

const buildAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/x-www-form-urlencoded'
});

const fetchWithRetry = async <T>(url: string, init: RequestInit): Promise<T | null> => {
  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      console.error(`Slack API request failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    console.error('Slack API request error:', error);
    return null;
  }
};

export const useSlackPresence = () => {
  const [currentStatus, setCurrentStatus] = useState<SlackStatus>(INITIAL_STATUS);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const slackToken =
      import.meta.env.VITE_SLACK_BOT_TOKEN ||
      import.meta.env.VITE_SLACK_USER_TOKEN ||
      import.meta.env.VITE_SLACK_TOKEN;
    const slackUserId = import.meta.env.VITE_SLACK_USER_ID;

    if (!slackToken) {
      console.warn(
        'Slack token is not configured. Please set one of VITE_SLACK_BOT_TOKEN, VITE_SLACK_USER_TOKEN, or VITE_SLACK_TOKEN.'
      );
      setIsConnected(false);
      return;
    }

    let isMounted = true;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const fetchStatus = async () => {
      const headers = buildAuthHeaders(slackToken);
      const searchParams = new URLSearchParams();
      if (slackUserId) {
        searchParams.set('user', slackUserId);
      }

      const [profileData, userInfoData, presenceData, dndData] = await Promise.all([
        fetchWithRetry<SlackProfileResponse>(
          `https://slack.com/api/users.profile.get${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${slackToken}` }
          }
        ),
        slackUserId
          ? fetchWithRetry<SlackUserInfoResponse>('https://slack.com/api/users.info', {
              method: 'POST',
              headers,
              body: searchParams.toString()
            })
          : Promise.resolve(null),
        fetchWithRetry<SlackPresenceResponse>('https://slack.com/api/users.getPresence', {
          method: 'POST',
          headers,
          body: searchParams.toString()
        }),
        fetchWithRetry<SlackDndResponse>('https://slack.com/api/dnd.info', {
          method: 'POST',
          headers,
          body: searchParams.toString()
        })
      ]);

      if (!isMounted) {
        return;
      }

      if (!profileData?.ok) {
        console.error('Unable to load Slack profile information.', profileData?.error);
        setIsConnected(false);
        return;
      }

      if (slackUserId && !userInfoData?.ok) {
        console.error('Unable to load Slack user information.', userInfoData?.error);
        setIsConnected(false);
        return;
      }

      const profile = profileData.profile ?? {};
      const user = userInfoData?.ok ? userInfoData.user : undefined;
      const presence = presenceData?.ok ? presenceData : undefined;
      const dnd = dndData?.ok ? dndData : undefined;

      let derivedStatus: SlackStatus['status'] = 'offline';
      if (presence?.presence === 'active') {
        derivedStatus = 'online';
      } else if (presence?.presence === 'away' || presence?.manual_away || presence?.auto_away) {
        derivedStatus = 'away';
      }

      if (dnd?.dnd_enabled) {
        derivedStatus = 'dnd';
      }

      const statusText = profile.status_text?.trim() ||
        (derivedStatus === 'online'
          ? 'Available'
          : derivedStatus === 'dnd'
            ? 'Do Not Disturb'
            : 'Away');
      const statusEmoji = profile.status_emoji ||
        (derivedStatus === 'online'
          ? '💬'
          : derivedStatus === 'dnd'
            ? '⛔'
            : '🌙');

      const statusExpiration = profile.status_expiration && profile.status_expiration > 0
        ? profile.status_expiration * 1000
        : null;

      const avatar = profile.image_512 || profile.image_192 || user?.profile?.image_512 || user?.profile?.image_192 || FALLBACK_AVATAR;
      const realName = profile.real_name || user?.profile?.real_name || 'Slack User';
      const displayName = profile.display_name || user?.profile?.display_name || realName;

      const nextStatus: SlackStatus = {
        id: user?.id || slackUserId || 'unknown',
        status: derivedStatus,
        statusText,
        statusEmoji,
        timestamp: Date.now(),
        avatar,
        realName,
        displayName,
        statusExpiration
      };

      setIsConnected(true);
      setCurrentStatus(prev => {
        const previous = prev ?? INITIAL_STATUS;
        const hasMeaningfulChange =
          previous.status !== nextStatus.status ||
          previous.statusText !== nextStatus.statusText ||
          previous.statusEmoji !== nextStatus.statusEmoji;

        if (hasMeaningfulChange && previous.id !== INITIAL_STATUS.id) {
          setStatusHistory(history => {
            const durationMinutes = Math.max((nextStatus.timestamp - previous.timestamp) / 60000, 0);
            const updatedHistory: StatusHistoryItem[] = [
              ...history,
              {
                id: `hist_${previous.timestamp}`,
                status: previous.status,
                timestamp: previous.timestamp,
                duration: durationMinutes
              }
            ];
            return updatedHistory.slice(-48);
          });
        }
        return nextStatus;
      });
    };

    fetchStatus();
    pollTimer = setInterval(fetchStatus, POLL_INTERVAL);

    return () => {
      isMounted = false;
      if (pollTimer) {
        clearInterval(pollTimer);
      }
    };
  }, []);

  return {
    currentStatus,
    statusHistory,
    isConnected,
    updateStatus: (newStatus: Partial<SlackStatus>) => {
      setCurrentStatus(prev => {
        return {
          ...prev,
          ...newStatus,
          timestamp: Date.now()
        };
      });
    }
  };
};
