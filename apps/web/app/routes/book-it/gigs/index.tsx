import React from 'react';
import { GigMarketplacePage } from '~/components/magic-patterns/pages/book-it/GigMarketplacePage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/gigs';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    console.log('Loading performers for gig marketplace...');
    
    // Fetch available performers for gigs
    const { data: performers, error } = await client
      .from('performers')
      .select('*')
      .order('rating', { ascending: false, nullsFirst: false })
      .limit(24);
    
    if (error) {
      console.error('Performers fetch error for gigs:', error);
    }
    
    console.log('Gig marketplace data loaded:', { performersCount: performers?.length || 0 });
    
    return {
      title: 'GigMarketplace - GoEventCity',
      performers: performers || []
    };
  } catch (error) {
    console.error('Gig marketplace loader error:', error);
    return {
      title: 'GigMarketplace - GoEventCity',
      performers: []
    };
  }
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title || 'GoEventCity',
    },
    {
      name: 'description',
      content: 'Discover amazing events and experiences in your city',
    },
  ];
};

// SSR-safe pattern using props.loaderData
export default function GigMarketplaceRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  console.log('GigMarketplaceRoute rendering with data:', {
    performersCount: data.performers?.length || 0
  });
  
  return <GigMarketplacePage performers={data.performers} />;
}
