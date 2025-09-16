import React from 'react';
import HubAnalyticsPage from '~/components/magic-patterns/pages/hub/[slug]/analytics';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/hub/$slug/analytics/+types';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const hubSlug = params.slug;
  
  try {
    // Get hub info
    const { data: hub, error: hubError } = await client
      .from('hubs')
      .select('*')
      .eq('slug', hubSlug)
      .single();
      
    if (hubError || !hub) {
      console.warn('Hub not found:', { error: hubError, hubSlug });
      return { hub: null, analytics: null };
    }
    
    // Check user has permission to view analytics
    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      console.warn('Unauthorized access to analytics');
      return { hub, analytics: null };
    }
    
    // Get analytics data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Event stats
    const { data: eventStats } = await client
      .from('events')
      .select('id, start_date, status')
      .eq('hub_id', hub.id)
      .gte('start_date', thirtyDaysAgo.toISOString());
    
    // Member stats
    const { data: memberStats } = await client
      .from('hub_members')
      .select('id, joined_at')
      .eq('hub_id', hub.id)
      .gte('joined_at', thirtyDaysAgo.toISOString());
    
    return {
      hub,
      analytics: {
        totalEvents: eventStats?.length || 0,
        newMembers: memberStats?.length || 0,
        totalMembers: 0, // Would need a count query
        engagement: {
          views: 0,
          interactions: 0
        }
      }
    };
    
  } catch (error) {
    console.error('Hub analytics loader error:', error);
    return { hub: null, analytics: null };
  }
};

export default function HubAnalyticsRoute({ loaderData }: Route.ComponentProps) {
  return <HubAnalyticsPage 
    hub={loaderData.hub}
    analytics={loaderData.analytics}
  />;
}