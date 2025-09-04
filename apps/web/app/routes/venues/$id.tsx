// apps/web/app/routes/venues/$id.tsx  
import { VenueDetailPage } from '~/components/magic-patterns/pages/venues/VenueDetailPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/venues/$id/+types';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const venueId = params.id;
  
  try {
    const { data: venue, error } = await client
      .from('venues')
      .select('*')
      .eq('id', venueId)
      .single();
      
    if (error || !venue) {
      throw new Response('Venue not found', { status: 404 });
    }
    
    // Load upcoming events at this venue
    const { data: events } = await client
      .from('events')
      .select('id, title, start_datetime, image, image_url, category')
      .eq('venue_id', venueId)
      .eq('status', 'published')
      .gte('start_datetime', new Date().toISOString())
      .order('start_datetime')
      .limit(6);
    
    return { 
      venue,
      upcomingEvents: events || []
    };
    
  } catch (error) {
    console.error('Error loading venue:', error);
    throw new Response('Venue not found', { status: 404 });
  }
};

export default function VenueDetailRoute({ loaderData }: Route.ComponentProps) {
  return <VenueDetailPage venue={loaderData.venue} />;
}