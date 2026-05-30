'use client';

import { useEffect, useRef } from 'react';
import { trackPageViewAction } from '@/app/actions/analytics-actions';

/**
 * Invisible component that fires a page-view increment exactly once per visit.
 * The useRef guard prevents double-firing in React Strict Mode (dev double-invoke).
 */
export function PageViewTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    // Fire-and-forget — no need to await or show a loading state
    trackPageViewAction().catch((err) => {
      console.warn('[PageViewTracker] Failed to track page view:', err);
    });
  }, []);

  return null;
}
