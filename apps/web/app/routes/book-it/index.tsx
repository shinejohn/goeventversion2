import React from 'react';
import { BookItPage } from '~/components/magic-patterns/pages/BookItPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/book-it/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    console.log('Loading data for BookIt page...');
    
    // Fetch featured venues, events, and performers for booking
    const [venuesResult, eventsResult, performersResult] = await Promise.all([
      client
        .from('venues')
        .select('*')
        .eq('status', 'active')
        .order('rating', { ascending: false, nullsFirst: false })
        .limit(6),
      client
        .from('events')
        .select(`
          *,
          venue:venues(name, address)
        `)
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(6),
      client
        .from('performers')
        .select('*')
        .order('rating', { ascending: false, nullsFirst: false })
        .limit(6)
    ]);
    
    // Handle events fallback if no published events
    let events = eventsResult.data;
    if (!events || events.length === 0) {
      console.log('No published events for BookIt, trying any events...');
      const anyEventsResult = await client
        .from('events')
        .select(`
          *,
          venue:venues(name, address)
        `)
        .order('created_at', { ascending: false })
        .limit(6);
      events = anyEventsResult.data;
    }
    
    console.log('BookIt data loaded:', {
      venuesCount: venuesResult.data?.length || 0,
      eventsCount: events?.length || 0,
      performersCount: performersResult.data?.length || 0
    });
    
    return {
      title: 'BookIt - GoEventCity',
      venues: venuesResult.data || [],
      events: events || [],
      performers: performersResult.data || []
    };
  } catch (error) {
    console.error('BookIt loader error:', error);
    return {
      title: 'BookIt - GoEventCity',
      venues: [],
      events: [],
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
export default function BookItRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  console.log('BookItRoute rendering with data:', {
    venuesCount: data.venues?.length || 0,
    eventsCount: data.events?.length || 0,
    performersCount: data.performers?.length || 0
  });
  
  return <BookItPage 
    venues={data.venues}
    events={data.events}
    performers={data.performers}
  />;
}
