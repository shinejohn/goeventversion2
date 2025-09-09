import React from 'react';
import type { Route } from './+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';

// Magic Patterns imports
import { AnalyticsOverview } from '~/components/magic-patterns/components/dashboard/calendars/AnalyticsOverview';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';

/**
 * Business analytics and performance metrics - Dashboard page
 * This is a dashboard route that shows within the sidebar navigation
 */

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  
  try {
    logger.info({ page: 'dashboard-analytics' }, 'Loading analytics dashboard page');
    
    const client = getSupabaseServerClient(request);
    
    // TODO: Load analytics data, metrics, performance stats
    // Add authentication check if needed
    // Load user's analytics data from Supabase
    
    return {
      analyticsData: {
        // Placeholder data structure
        timestamp: new Date().toISOString(),
        metrics: {},
        charts: [],
        performance: {}
      }
    };
  } catch (error) {
    logger.error({ error, page: 'dashboard-analytics' }, 'Error loading analytics dashboard');
    return {
      analyticsData: {
        timestamp: new Date().toISOString(),
        metrics: {},
        charts: [],
        performance: {}
      },
      error: error instanceof Error ? error.message : 'Failed to load analytics'
    };
  }
};

// Use Magic Patterns route wrapper for consistent layout
export default createMagicPatternsRoute({
  component: AnalyticsOverview,
  transformData: (loaderData) => ({
    ...loaderData.analyticsData,
    error: loaderData.error,
  }),
});