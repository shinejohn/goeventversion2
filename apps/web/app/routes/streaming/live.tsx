import React from 'react';
import { LiveStreamingEventsPage } from '~/components/magic-patterns/pages/LiveStreamingEventsPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/live';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    // Load live events
    const { data: liveEvents } = await client
      .from('events')
      .select(`
        *,
        venue:venues(name, address),
        stream:live_streams(*)
      `)
      .eq('is_live_streaming', true)
      .eq('status', 'published')
      .gte('end_date', new Date().toISOString())
      .order('start_date', { ascending: true });
    
    return {
      liveEvents: liveEvents || []
    };
  } catch (error) {
    console.error('Live streaming loader error:', error);
    return { liveEvents: [] };
  }
};

export default function LiveStreamingRoute({ loaderData }: Route.ComponentProps) {
  return <LiveStreamingEventsPage liveEvents={loaderData.liveEvents} />;
}