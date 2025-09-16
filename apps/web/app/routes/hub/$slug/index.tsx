import React from 'react';
import HubCommunityPage from '~/components/magic-patterns/pages/hub/[slug]/community';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '../+types/$slug';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const hubSlug = params.slug;
  
  try {
    // Load hub/community data
    const { data: hub, error } = await client
      .from('community_hubs')
      .select(`
        *,
        creator:auth.users(id, email)
      `)
      .eq('slug', hubSlug)
      .eq('status', 'active')
      .single();
      
    if (error || !hub) {
      console.warn('Hub not found:', { error, hubSlug });
      // Return empty hub data instead of throwing error
      return {
        hub: null,
        members: [],
        activities: []
      };
    }
    
    // Load hub members/followers
    const { data: members } = await client
      .from('hub_members')
      .select(`
        id,
        user:auth.users(id, email),
        role,
        status,
        joined_at,
        last_active_at
      `)
      .eq('hub_id', hub.id)
      .eq('status', 'active')
      .order('joined_at', { ascending: false })
      .limit(20);
    
    // Load recent activities
    const { data: activities } = await client
      .from('hub_activities')
      .select(`
        *,
        user:auth.users(id, email)
      `)
      .eq('hub_id', hub.id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(10);
    
    return {
      hub: {
        ...hub,
        memberCount: hub.members_count || 0,
        eventCount: hub.events_count || 0,
        postCount: hub.posts_count || 0
      },
      members: members || [],
      activities: activities || []
    };
    
  } catch (error) {
    console.error('Hub loader error:', error);
    // Return empty data instead of throwing
    return {
      hub: null,
      members: [],
      activities: []
    };
  }
};

export default function HubRoute({ loaderData }: Route.ComponentProps) {
  return <HubCommunityPage 
    hub={loaderData.hub}
    members={loaderData.members}
    activities={loaderData.activities}
  />;
}