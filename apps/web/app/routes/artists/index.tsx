import React from 'react';
import { ArtistProfilesPage } from '~/components/magic-patterns/pages/ArtistProfilesPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/artists/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: artists } = await client
      .from('artists')
      .select(`
        *,
        genres,
        upcoming_events:events(count)
      `)
      .eq('is_active', true)
      .order('follower_count', { ascending: false });
    
    return {
      artists: artists || []
    };
  } catch (error) {
    console.error('Artists loader error:', error);
    return { artists: [] };
  }
};

export default function ArtistsRoute({ loaderData }: Route.ComponentProps) {
  return <ArtistProfilesPage artists={loaderData.artists} />;
}