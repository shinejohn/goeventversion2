import React from 'react';
import HubVenuesPage from '~/components/magic-patterns/pages/hub/[slug]/venues';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/hub/$slug/venues/+types';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const hubSlug = params.slug;
  
  try {
    // Get hub info
    const { data: hub, error: hubError } = await client
      .from('hubs')
      .select('id, name, slug')
      .eq('slug', hubSlug)
      .single();
      
    if (hubError || !hub) {
      throw new Response('Hub not found', { status: 404 });
    }
    
    // Load venues for this hub
    const { data: venues } = await client
      .from('venues')
      .select('*')
      .eq('hub_id', hub.id)
      .eq('is_active', true)
      .order('name');
    
    return {
      hub,
      venues: venues || []
    };
    
  } catch (error) {
    console.error('Hub venues loader error:', error);
    throw new Response('Hub not found', { status: 404 });
  }
};

export default function HubVenuesRoute({ loaderData }: Route.ComponentProps) {
  return <HubVenuesPage 
    hub={loaderData.hub}
    venues={loaderData.venues}
  />;
}