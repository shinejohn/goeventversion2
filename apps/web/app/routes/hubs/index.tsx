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
    
    if (error) throw error;
    
    // Transform the data to match the component's expected format
    const transformedHubs = (hubs || []).map(hub => ({
      id: hub.slug || hub.id,
      name: hub.name,
      description: hub.description,
      members: Math.floor(Math.random() * 5000) + 1000, // Mock member count for now
      image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80`,
      location: 'Clearwater, FL' // Mock location for now
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