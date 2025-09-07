import { Form, useLoaderData, useNavigate } from 'react-router';
import { TicketPurchasePage } from '~/components/magic-patterns/pages/tickets/TicketPurchasePage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Database } from '@kit/supabase/database';

export async function loader({ request, params }: { request: Request; params: any }) {
  const client = getSupabaseServerClient(request);
  const eventId = params.eventId;

  // Load event details
  const { data: event } = await client
    .from('events')
    .select(`
      *,
      venue:venues(id, name, address, city, state)
    `)
    .eq('id', eventId)
    .single();

  if (!event) {
    console.warn('Event not found for ticket purchase:', eventId);
    return { event: null };
  }

  return { event };
}

export async function action({ request }: { request: Request }) {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // Get current user
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    console.warn('Unauthorized ticket purchase attempt');
    return { error: 'You must be logged in to purchase tickets' };
  }

  // Get user's account
  const { data: account } = await client
    .from('accounts')
    .select('id')
    .eq('primary_owner_user_id', user.id)
    .single();

  const eventId = formData.get('eventId') as string;
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
      event_id: eventId,
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

export default function TicketPurchaseRoute() {
  const { event } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // Convert to format expected by component
  const eventData = {
    id: event.id,
    name: event.title,
    date: new Date(event.start_datetime),
    time: new Date(event.start_datetime).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }),
    endTime: new Date(event.end_datetime).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }),
    venue: {
      name: event.venue?.name || 'TBA',
      address: event.venue ? `${event.venue.address}, ${event.venue.city}, ${event.venue.state}` : 'TBA'
    },
    image: event.image_url,
    description: event.description
  };

  return <TicketPurchasePage />;
}