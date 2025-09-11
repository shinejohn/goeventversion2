import React from 'react';
import type { Route } from './+types/my-tickets';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

// Magic Patterns imports
import { TicketsPage } from '~/components/magic-patterns/pages/profile/TicketsPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * My Tickets Route - User's purchased tickets and ticket management
 * Personal ticket management for events and shows
 * 
 * Let's manage those tickets! 🎫✨
 */

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const logger = await getLogger();
  
  try {
    // Get current user
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      throw new Response('Unauthorized', { status: 401 });
    }
    
    // Fetch user's tickets
    const { data: tickets, error } = await client
      .from('user_tickets')
      .select(`
        *,
        event:events(
          id,
          title,
          start_datetime,
          end_datetime,
          venue_id,
          venue:venues(name, address, city, state)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      logger.error({ error }, 'Error fetching user tickets');
    }
    
    // Transform tickets data for UI
    const transformedTickets = tickets?.map(ticket => ({
      id: ticket.id,
      eventName: ticket.event?.title || 'Unknown Event',
      eventDate: ticket.event?.start_datetime || ticket.event?.start_date,
      venue: ticket.event?.venue?.name || 'Unknown Venue',
      venueLocation: ticket.event?.venue ? 
        `${ticket.event.venue.city}, ${ticket.event.venue.state}` : 
        'Unknown Location',
      ticketType: ticket.ticket_type || 'General Admission',
      quantity: ticket.quantity || 1,
      price: ticket.price || 0,
      status: ticket.status || 'confirmed',
      qrCode: ticket.qr_code || null,
      purchaseDate: ticket.created_at,
      eventId: ticket.event_id
    })) || [];
    
    return {
      title: 'My Tickets - GoEventCity',
      tickets: transformedTickets,
      user: {
        id: user.id,
        email: user.email
      }
    };
  } catch (error) {
    logger.error({ error }, 'My tickets loader error');
    return {
      title: 'My Tickets - GoEventCity',
      tickets: [],
      user: null,
      error: 'Failed to load tickets'
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: TicketsPage,
  transformData: (loaderData) => ({
    tickets: loaderData.tickets,
    user: loaderData.user,
    error: loaderData.error
  }),
});

// SEO meta tags 🎯
export const meta = ({ data }: Route.MetaArgs) => [
  {
    title: data?.title || 'My Tickets - GoEventCity',
  },
  {
    name: 'description',
    content: 'Manage your event tickets and bookings on GoEventCity',
  },
];
