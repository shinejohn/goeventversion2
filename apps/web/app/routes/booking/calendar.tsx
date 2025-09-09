import React from 'react';
import type { Route } from './+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';

// Magic Patterns imports
import { CreateSharedCalendar } from '~/components/magic-patterns/components/profile/CreateSharedCalendar';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';

/**
 * Interactive booking calendar with availability - Dashboard page
 * This is a dashboard route that shows within the sidebar navigation
 */

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  
  try {
    logger.info({ page: 'booking-calendar' }, 'Loading booking calendar dashboard page');
    
    const client = getSupabaseServerClient(request);
    
    // TODO: Load calendar data, bookings, availability
    // Add authentication check if needed
    // Load user's calendar data from Supabase
    
    return {
      calendarData: {
        // Placeholder data structure
        timestamp: new Date().toISOString(),
        events: [],
        availability: []
      }
    };
  } catch (error) {
    logger.error({ error, page: 'booking-calendar' }, 'Error loading booking calendar');
    return {
      calendarData: {
        timestamp: new Date().toISOString(),
        events: [],
        availability: []
      },
      error: error instanceof Error ? error.message : 'Failed to load calendar'
    };
  }
};

// Use Magic Patterns route wrapper for consistent layout
export default createMagicPatternsRoute({
  component: CreateSharedCalendar,
  transformData: (loaderData) => ({
    ...loaderData.calendarData,
    error: loaderData.error,
  }),
});