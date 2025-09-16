import React from 'react';
import { HubEventsPage } from '~/components/magic-patterns/pages/hub/[slug]/events';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/hub/$slug/events/+types';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const hubSlug = params.slug;
  
  try {
    // Get hub info
    const { data: hub, error: hubError } = await client
      .from('hubs')
      .select('id, name, slug, description')
      .eq('slug', hubSlug)
      .single();
      
    if (hubError || !hub) {
      console.warn('Hub not found:', { error: hubError, hubSlug });
      return { hub: null, events: [] };
    }
    
    // Load events for this hub
    const { data: events } = await client
      .from('events')
      .select(`
        *,
        venue:venues(name, address, city)
      `)
      .eq('hub_id', hub.id)
      .eq('status', 'published')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true });
    
    return {
      hub,
      events: events || []
    };
    
  } catch (error) {
    console.error('Hub events loader error:', error);
    return { hub: null, events: [] };
  }
};

export default function HubEventsRoute({ loaderData }: Route.ComponentProps) {
  return <HubEventsPage 
    hub={loaderData.hub}
    events={loaderData.events}
  />;
}