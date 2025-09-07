import React from 'react';
import { TicketsPage } from '~/components/magic-patterns/pages/TicketsPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/tickets';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    console.log('Loading events for ticket sales...');
    
    // Fetch upcoming events with ticket availability
    const { data: events, error } = await client
      .from('events')
      .select(`
        *,
        venue:venues(name, address, city, state)
      `)
      .eq('status', 'published')
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(24);
    
    if (error) {
      console.error('Events fetch error for tickets:', error);
    }
    
    // If no published events, try any events for debugging
    let finalEvents = events;
    if (!events || events.length === 0) {
      console.log('No published events for tickets, trying any events...');
      const anyResult = await client
        .from('events')
        .select(`
          *,
          venue:venues(name, address, city, state)
        `)
        .order('created_at', { ascending: false })
        .limit(24);
      
      finalEvents = anyResult.data;
    }
    
    console.log('Ticket events data loaded:', { eventsCount: finalEvents?.length || 0 });
    
    return {
      title: 'Tickets - GoEventCity',
      events: finalEvents || []
    };
  } catch (error) {
    console.error('Tickets loader error:', error);
    return {
      title: 'Tickets - GoEventCity',
      events: []
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
export default function TicketsRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  console.log('TicketsRoute rendering with data:', {
    eventsCount: data.events?.length || 0
  });
  
  return <TicketsPage events={data.events} />;
}
