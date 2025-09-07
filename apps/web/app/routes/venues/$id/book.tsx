import type { Route } from './+types/venues/$id/book';
import { BookingRequestPage } from '~/components/magic-patterns/pages/book-it/venues/BookingRequestPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function loader({ params }: Route.LoaderArgs) {
  const client = getSupabaseServerClient();
  
  const { data: venue, error } = await client
    .from('venues')
    .select(`
      *,
      events(
        id,
        title,
        start_datetime,
        end_datetime,
        price_min,
        price_max,
        capacity,
        available_tickets
      )
    `)
    .eq('id', params.id)
    .single();

  if (error || !venue) {
    throw new Response('Venue not found', { status: 404 });
  }

  return { venue };
}

export default function VenueBookingPage({ loaderData }: Route.ComponentProps) {
  // For now, use the Magic Patterns BookingRequestPage component
  // Note: This component needs to be updated to use the venue data from loader
  return <BookingRequestPage />;
}