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

export async function action({ request, params }: Route.ActionArgs) {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // Get current user
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    return { error: 'You must be logged in to purchase tickets' };
  }

  // Get user's account
  const { data: account } = await client
    .from('accounts')
    .select('id')
    .eq('primary_owner_user_id', user.id)
    .single();

  const ticketType = formData.get('ticketType') as string;
  const quantity = parseInt(formData.get('quantity') as string) || 1;
  const price = parseFloat(formData.get('price') as string);
  const attendees = JSON.parse(formData.get('attendees') as string || '[]');

  // Calculate fees and total
  const serviceFee = price * quantity * 0.1;
  const totalAmount = price * quantity + serviceFee;

  // Create ticket
  const { data: ticket, error } = await client
    .from('tickets')
    .insert({
      event_id: params.eventId,
      user_id: user.id,
      account_id: account?.id || user.id,
      ticket_type: ticketType,
      price,
      service_fee: serviceFee,
      total_amount: totalAmount,
      quantity,
      attendee_info: attendees,
      status: 'active'
    })
    .select()
    .single();

  if (error) {
    console.error('Ticket creation error:', error);
    return { error: 'Failed to create ticket' };
  }

  // TODO: Integrate with payment processor here
  // For now, mark as paid immediately
  await client
    .from('tickets')
    .update({ status: 'active' })
    .eq('id', ticket.id);

  return { success: true, ticketId: ticket.id };
}

export default function TicketPurchaseRoute({ loaderData }: Route.ComponentProps) {
  const { event } = loaderData;

  return <TicketPurchasePage event={event} />;
}