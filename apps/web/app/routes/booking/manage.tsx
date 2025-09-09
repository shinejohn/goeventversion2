import React from 'react';
import type { Route } from './+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';

// Magic Patterns imports
import { SectionManager } from '~/components/magic-patterns/components/hub-builder/SectionManager';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';

/**
 * Manage all bookings and reservations - Dashboard page
 * This is a dashboard route that shows within the sidebar navigation
 */

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  
  try {
    logger.info({ page: 'booking-manage' }, 'Loading booking management dashboard page');
    
    const client = getSupabaseServerClient(request);
    
    // TODO: Load booking data, reservations, venue bookings
    // Add authentication check if needed
    // Load user's booking management data from Supabase
    
    return {
      bookingData: {
        // Placeholder data structure
        timestamp: new Date().toISOString(),
        bookings: [],
        reservations: [],
        venues: []
      }
    };
  } catch (error) {
    logger.error({ error, page: 'booking-manage' }, 'Error loading booking management');
    return {
      bookingData: {
        timestamp: new Date().toISOString(),
        bookings: [],
        reservations: [],
        venues: []
      },
      error: error instanceof Error ? error.message : 'Failed to load booking management'
    };
  }
};

// Use Magic Patterns route wrapper for consistent layout
export default createMagicPatternsRoute({
  component: SectionManager,
  transformData: (loaderData) => ({
    ...loaderData.bookingData,
    error: loaderData.error,
  }),
});