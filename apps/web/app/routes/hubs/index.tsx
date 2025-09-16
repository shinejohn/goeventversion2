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
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading hubs:', error);
      return { hubs: [] };
    }
    
    // Transform the data to match the component's expected format
    const transformedHubs = (hubs || []).map(hub => ({
      id: hub.id,
      slug: hub.slug,
      name: hub.name,
      tagline: hub.tagline || '',
      description: hub.description,
      banner_image: hub.banner_image || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80`,
      logo: hub.logo || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80`,
      creator_name: hub.creator_name || 'Community Creator',
      creator_avatar: hub.creator_avatar || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80`,
      creator_verified: hub.creator_verified || false,
      categories: hub.categories || ['Community'],
      tags: hub.tags || ['Community', 'Local'],
      members_count: hub.members_count || Math.floor(Math.random() * 5000) + 100,
      events_count: hub.events_count || Math.floor(Math.random() * 100) + 10,
      posts_count: hub.posts_count || Math.floor(Math.random() * 500) + 50,
      is_featured: hub.is_featured || false,
      is_verified: hub.is_verified || false,
      location: hub.location_city && hub.location_state 
        ? `${hub.location_city}, ${hub.location_state}` 
        : 'Clearwater, FL',
      created_at: hub.created_at,
      last_activity_at: hub.last_activity_at || hub.created_at
    }));
    
    console.log('Loaded hubs:', transformedHubs.length);
    return { hubs: transformedHubs };
    
  } catch (error) {
    console.error('Error loading hubs:', error);
    return { hubs: [] };
  }
};

export default function HubsRoute({ loaderData }: Route.ComponentProps) {
  return <HubsDiscoveryPage hubs={loaderData.hubs} />;
}