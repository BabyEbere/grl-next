'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function TrafficTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Get or Create Persistent Visitor ID (1 year)
    let visitorId = localStorage.getItem('grl_visitor_id');
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('grl_visitor_id', visitorId);
    }

    // 2. Get or Create Session ID (Closed when browser tab closes)
    let sessionId = sessionStorage.getItem('grl_session_id');
    if (!sessionId) {
      sessionId = 's_' + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('grl_session_id', sessionId);
    }

    const logVisit = async (isHeartbeat = false) => {
      try {
        await fetch('/api/analytics', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'track_visit',
            page: pathname,
            visitor_id: visitorId,
            session_id: sessionId,
            heartbeat: isHeartbeat
          }),
        });
      } catch (e) {
        // Silently fail traffic logs to not break UX
      }
    };

    // Log initial page view
    logVisit();

    // Heartbeat every 5 seconds to track duration
    const interval = setInterval(() => {
      logVisit(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null; // Invisible component
}
