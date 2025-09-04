// apps/web/app/routes/events/$id.tsx
import { EventDetailPage } from '~/components/magic-patterns/pages/EventDetailPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/events/$id/+types';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const eventId = params.id;
  
  try {
    console.log('Loading event with ID:', eventId);
    
    // First, let's check if there are any events at all
    const { data: allEvents, error: countError } = await client
      .from('events')
      .select('id, title')
      .limit(5);
      
    console.log('Available events in database:', allEvents);
    
    // Load event with venue data
    const { data: event, error } = await client
      .from('events')
      .select(`
        *,
        venue:venues(*)
      `)
      .eq('id', eventId)
      .single();
      
    console.log('Event query result:', { event, error });
      
    if (error || !event) {
      console.error('Event not found:', error);
      // If no events exist, return a helpful message
      if (allEvents && allEvents.length === 0) {
        throw new Response('No events in database. Please add events first.', { status: 404 });
      }
      throw new Response(`Event not found. Available events: ${allEvents?.map(e => e.id).join(', ')}`, { status: 404 });
    }
    
    // Load related events
    const { data: relatedEvents } = await client
      .from('events')
      .select(`
        id, title, start_date, image_url,
        venue:venues(name, address)
      `)
      .eq('category', event.category)
      .neq('id', eventId)
      .eq('status', 'published')
      .gte('start_date', new Date().toISOString())
      .limit(3);
    
    return {
      event,
      relatedEvents: relatedEvents || [],
      attendeeCount: 0 // We'll add this later when bookings table exists
    };
    
  } catch (error) {
    console.error('Error loading event:', error);
    throw new Response('Event not found', { status: 404 });
  }
};

export default function EventDetailRoute({ loaderData }: Route.ComponentProps) {
  const { event, relatedEvents, attendeeCount } = loaderData;
  
  return (
    <EventDetailPage
      event={event}
      relatedEvents={relatedEvents}
      attendeeCount={attendeeCount}
    />
  );
}