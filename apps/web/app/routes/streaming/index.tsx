import React from 'react';
import { VideoStreamingPage } from '~/components/magic-patterns/pages/VideoStreamingPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/streaming/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    // Load active streams
    const { data: streams } = await client
      .from('live_streams')
      .select(`
        *,
        event:events(title, description),
        host:accounts(name, picture_url)
      `)
      .eq('is_active', true)
      .order('viewer_count', { ascending: false });
    
    return {
      streams: streams || []
    };
  } catch (error) {
    console.error('Streaming loader error:', error);
    return { streams: [] };
  }
};

export default function StreamingRoute({ loaderData }: Route.ComponentProps) {
  return <VideoStreamingPage streams={loaderData.streams} />;
}