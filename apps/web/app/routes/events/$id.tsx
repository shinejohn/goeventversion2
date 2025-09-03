// apps/web/app/routes/events/$id.tsx
import { EventDetailPage } from '~/components/magic-patterns/pages/EventDetailPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const eventId = params.id;
  
  try {
    // Load event with all related data
    const { data: event, error } = await client
      .from('events')
      .select(`
        *,
        venue:venues(*),
        organizer:auth.users(name, avatar_url),
        performers:event_performers(
          performer:performers(*)
        ),
        tickets:ticket_types(*),
        reviews:event_reviews(
          rating,
          comment,
          user:auth.users(name, avatar_url)
        )
      `)
      .eq('id', eventId)
      .single();
      
    if (error || !event) {
      throw new Response('Event not found', { status: 404 });
    }
    
    // Load related events
    const { data: relatedEvents } = await client
      .from('events')
      .select(`
        id, title, start_date, image_url,
        venue:venues(name, city, state)
      `)
      .eq('category', event.category)
      .neq('id', eventId)
      .eq('status', 'published')
      .limit(3);
    
    // Load attendance/booking stats
    const { count: attendeeCount } = await client
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('status', 'confirmed');
    
    return {
      event,
      relatedEvents: relatedEvents || [],
      attendeeCount: attendeeCount || 0
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