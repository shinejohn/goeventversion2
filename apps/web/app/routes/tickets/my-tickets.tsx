import React from 'react';
import { TicketsPage } from '~/components/magic-patterns/pages/profile/TicketsPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/my-tickets';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    // Get current user
    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      return { tickets: [], user: null };
    }

    // Fetch user's tickets
    const { data: tickets, error } = await client
      .from('tickets')
      .select(`
        *,
        event:events(
          id,
          title,
          description,
          start_datetime,
          end_datetime,
          image_url,
          venue:venues(name, address, city, state)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user tickets:', error);
      return { tickets: [], user };
    }

    // Transform tickets for UI
    const transformedTickets = tickets?.map(ticket => ({
      id: ticket.id,
      eventName: ticket.event?.title || 'Event Not Found',
      eventDate: ticket.event?.start_datetime ? new Date(ticket.event.start_datetime) : null,
      venue: ticket.event?.venue?.name || 'TBA',
      venueAddress: ticket.event?.venue ? 
        `${ticket.event.venue.address}, ${ticket.event.venue.city}, ${ticket.event.venue.state}` : 
        'TBA',
      ticketType: ticket.ticket_type,
      price: ticket.price,
      quantity: ticket.quantity,
      totalAmount: ticket.total_amount,
      status: ticket.status,
      qrCode: `TICKET-${ticket.id}`,
      image: ticket.event?.image_url,
      description: ticket.event?.description
    })) || [];

    return {
      title: 'My Tickets - GoEventCity',
      tickets: transformedTickets,
      user
    };
  } catch (error) {
    console.error('My tickets loader error:', error);
    return {
      title: 'My Tickets - GoEventCity',
      tickets: [],
      user: null
    };
  }
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title || 'My Tickets - GoEventCity',
    },
    {
      name: 'description',
      content: 'View and manage your event tickets',
    },
  ];
};

export default function MyTicketsRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return <TicketsPage tickets={data.tickets} user={data.user} />;
}
