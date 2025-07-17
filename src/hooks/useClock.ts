import { useState, useEffect, useRef } from 'react';

export const useClock = () => {
  const [time, setTime] = useState(new Date());
  const rafRef = useRef<number>();

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date());
      rafRef.current = requestAnimationFrame(updateClock);
    };

    rafRef.current = requestAnimationFrame(updateClock);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatUTC = (date: Date) => {
    return date.toISOString().substr(11, 8);
  };

  return {
    localTime: formatTime(time),
    utcTime: formatUTC(time),
    timestamp: time.getTime()
  };
};