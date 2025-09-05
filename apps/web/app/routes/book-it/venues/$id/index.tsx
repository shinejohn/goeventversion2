import React from 'react';
import { VenueDetailPage } from '~/components/magic-patterns/pages/book-it/venues/VenueDetailPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/book-it/venues/$id/+types';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const venueId = params.id;
  
  try {
    console.log('Loading venue detail for booking:', venueId);
    
    // Fetch venue details with related events
    const [venueResult, eventsResult] = await Promise.all([
      client
        .from('venues')
        .select('*')
        .eq('id', venueId)
        .single(),
      client
        .from('events')
        .select(`
          *,
          venue:venues(name)
        `)
        .eq('venue_id', venueId)
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(10)
    ]);
    
    if (venueResult.error) {
      throw new Error(`Venue not found: ${venueResult.error.message}`);
    }
    
    // If no published events, try any events for this venue
    let events = eventsResult.data;
    if (!events || events.length === 0) {
      console.log('No published events for this venue, trying any events...');
      const anyEventsResult = await client
        .from('events')
        .select(`
          *,
          venue:venues(name)
        `)
        .eq('venue_id', venueId)
        .order('created_at', { ascending: false })
        .limit(10);
      events = anyEventsResult.data;
    }
    
    console.log('Venue booking detail loaded:', {
      venue: venueResult.data.name,
      eventsCount: events?.length || 0
    });
    
    return {
      title: `Book ${venueResult.data.name} - GoEventCity`,
      venue: venueResult.data,
      upcomingEvents: events || []
    };
  } catch (error) {
    console.error('Venue detail booking loader error:', error);
    throw new Response('Venue not found', { status: 404 });
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
export default function VenueDetailRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  console.log('VenueDetailRoute rendering with data:', {
    venue: data.venue?.name,
    eventsCount: data.upcomingEvents?.length || 0
  });
  
  return <VenueDetailPage 
    venue={data.venue}
    upcomingEvents={data.upcomingEvents}
  />;
}
