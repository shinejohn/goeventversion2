import React from 'react';
import HubCommunityPage from '~/components/magic-patterns/pages/hub/[slug]/community';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/$slug';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const hubSlug = params.slug;
  
  try {
    // Load hub/community data
    const { data: hub, error } = await client
      .from('hubs')
      .select(`
        *,
        hub_members(count),
        events(count)
      `)
      .eq('slug', hubSlug)
      .single();
      
    if (error || !hub) {
      throw new Response('Hub not found', { status: 404 });
    }
    
    // Load hub members/followers
    const { data: members } = await client
      .from('hub_members')
      .select(`
        id,
        user:auth.users(id, email),
        role,
        joined_at
      `)
      .eq('hub_id', hub.id)
      .limit(20);
    
    // Load recent activities
    const { data: activities } = await client
      .from('hub_activities')
      .select('*')
      .eq('hub_id', hub.id)
      .order('created_at', { ascending: false })
      .limit(10);
    
    return {
      hub: {
        ...hub,
        memberCount: hub.hub_members?.[0]?.count || 0,
        eventCount: hub.events?.[0]?.count || 0
      },
      members: members || [],
      activities: activities || []
    };
    
  } catch (error) {
    console.error('Hub loader error:', error);
    throw new Response('Hub not found', { status: 404 });
  }
};

export default function HubRoute({ loaderData }: Route.ComponentProps) {
  return <HubCommunityPage 
    hub={loaderData.hub}
    members={loaderData.members}
    activities={loaderData.activities}
  />;
}