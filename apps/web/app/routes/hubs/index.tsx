import React from 'react';
// apps/web/app/routes/hubs/index.tsx
import type { Route } from './+types/index';
import HubsDiscoveryPage from '~/components/magic-patterns/pages/hubs/index';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: hubs, error } = await client
      .from('community_hubs')
      .select(`
        *,
        creator:auth.users(id, email)
      `)
      .eq('status', 'active')
      .order('is_featured', { ascending: false })
      .order('members_count', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform the data to match the component's expected format
    const transformedHubs = (hubs || []).map(hub => ({
      id: hub.id,
      slug: hub.slug,
      name: hub.name,
      tagline: hub.tagline,
      description: hub.description,
      banner_image: hub.banner_image,
      logo: hub.logo,
      creator_name: hub.creator_name,
      creator_avatar: hub.creator_avatar,
      creator_verified: hub.creator_verified,
      categories: hub.categories || [],
      tags: hub.tags || [],
      members_count: hub.members_count || 0,
      events_count: hub.events_count || 0,
      posts_count: hub.posts_count || 0,
      is_featured: hub.is_featured || false,
      is_verified: hub.is_verified || false,
      location: hub.location_city && hub.location_state 
        ? `${hub.location_city}, ${hub.location_state}` 
        : 'Clearwater, FL',
      created_at: hub.created_at,
      last_activity_at: hub.last_activity_at
    }));
    
    return { hubs: transformedHubs };
    
  } catch (error) {
    console.error('Error loading hubs:', error);
    return { hubs: [] };
  }
};

export default function HubsRoute({ loaderData }: Route.ComponentProps) {
  return <HubsDiscoveryPage hubs={loaderData.hubs} />;
}