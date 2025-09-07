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
        owner:auth.users(name, avatar_url),
        _count:hub_members(count)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { hubs: hubs || [] };
    
  } catch (error) {
    console.error('Error loading hubs:', error);
    return { hubs: [] };
  }
};

export default function HubsRoute({ loaderData }: Route.ComponentProps) {
  return <HubsDiscoveryPage hubs={loaderData.hubs} />;
}