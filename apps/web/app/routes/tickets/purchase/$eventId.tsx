import type { Route } from './+types/purchase/$eventId';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { TicketPurchasePage } from '~/components/magic-patterns/pages/tickets/TicketPurchasePage';

export async function loader({ params }: Route.LoaderArgs) {
  const client = getSupabaseServerClient();
  
  const { data: event, error } = await client
    .from('events')
    .select(`
      *,
      venue:venues(name, city, state),
      performers:event_performers(
        role,
        performer:performers(name, genre, image_url)
      )
    `)
    .eq('id', params.eventId)
    .single();

  if (error || !event) {
    console.warn('Event not found for ticket purchase:', { error, eventId: params.eventId });
    return { event: null };
  }

  return { event };
}

export default function TicketPurchaseRoute({ loaderData }: Route.ComponentProps) {
  const { event } = loaderData;

  return <TicketPurchasePage event={event} />;
}