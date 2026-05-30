'use server';

import { incrementPageViews, getPageViews } from '@/lib/data';

/**
 * Atomically increments the page view counter in Firebase.
 * Called from the PageViewTracker client component on each unique page load.
 */
export async function trackPageViewAction(): Promise<void> {
  await incrementPageViews();
}

export async function fetchPageViewsForAdmin(): Promise<number> {
  return getPageViews();
}
