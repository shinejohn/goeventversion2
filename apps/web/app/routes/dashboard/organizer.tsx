import React from 'react';
import { useLoaderData } from 'react-router';
import type { Route } from '~/types/app/routes/dashboard/organizer';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { OrganizerDashboard } from '~/components/magic-patterns/components/bookings/OrganizerDashboard';
import { getLogger } from '@kit/shared/logger';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return { 
        events: [],
        venues: [],
        upcomingEvents: [],
        analytics: {
          totalEvents: 0,
          totalRevenue: 0,
          totalAttendees: 0,
          averageRating: 0
        }
      };
    }

    // Check if user has organizer role
    const { data: hasRole } = await client
      .from('user_roles')
      .select('id')
      .eq('user_id', user.id)
      .eq('role_type', 'organizer')
      .eq('is_active', true)
      .single();

    if (!hasRole) {
      // User doesn't have organizer role
      return { 
        events: [],
        venues: [],
        upcomingEvents: [],
        analytics: {
          totalEvents: 0,
          totalRevenue: 0,
          totalAttendees: 0,
          averageRating: 0
        },
        needsRole: true
      };
    }

    // Fetch events organized by the user
    const { data: events } = await client
      .from('events')
      .select(`
        id,
        title,
        slug,
        description,
        category,
        start_datetime,
        end_datetime,
        image_url,
        status,
        price_min,
        price_max,
        capacity,
        tickets_sold,
        view_count,
        created_at,
        venue:venues!events_venue_id_fkey(
          id,
          name,
          address,
          city,
          state
        ),
        performer:performers!events_performer_id_fkey(
          id,
          name,
          stage_name
        )
      `)
      .eq('organizer_id', user.id)
      .order('start_datetime', { ascending: false });

    if (!events || events.length === 0) {
      return { 
        events: [],
        venues: [],
        upcomingEvents: [],
        analytics: {
          totalEvents: 0,
          totalRevenue: 0,
          totalAttendees: 0,
          averageRating: 0
        }
      };
    }

    // Get upcoming events
    const now = new Date().toISOString();
    const upcomingEvents = events.filter(e => e.start_datetime > now);

    // Fetch available venues for booking
    const { data: venues } = await client
      .from('venues')
      .select(`
        id,
        name,
        slug,
        description,
        address,
        city,
        state,
        capacity,
        image_url,
        rating,
        category,
        amenities
      `)
      .eq('status', 'active')
      .limit(20);

    // Calculate analytics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get ticket sales for revenue calculation
    const eventIds = events.map(e => e.id);
    const { data: tickets } = await client
      .from('tickets')
      .select('total_price, quantity')
      .in('event_id', eventIds)
      .eq('status', 'completed')
      .gte('purchase_date', thirtyDaysAgo.toISOString());

    const totalRevenue = tickets?.reduce((sum, t) => sum + (t.total_price || 0), 0) || 0;
    const totalAttendees = tickets?.reduce((sum, t) => sum + (t.quantity || 0), 0) || 0;

    // Get average rating from reviews
    const { data: reviews } = await client
      .from('reviews')
      .select('rating')
      .eq('entity_type', 'event')
      .in('entity_id', eventIds);

    const averageRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return {
      events: events.map(e => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        description: e.description,
        date: e.start_datetime,
        startTime: new Date(e.start_datetime).toLocaleTimeString(),
        endTime: new Date(e.end_datetime).toLocaleTimeString(),
        venue: e.venue ? `${e.venue.name}, ${e.venue.city}` : 'TBD',
        venueId: e.venue?.id,
        performer: e.performer?.stage_name || e.performer?.name || 'Various',
        performerId: e.performer?.id,
        image: e.image_url,
        status: e.status,
        category: e.category,
        priceRange: e.price_min === e.price_max 
          ? `$${e.price_min}` 
          : `$${e.price_min} - $${e.price_max}`,
        capacity: e.capacity,
        ticketsSold: e.tickets_sold,
        viewCount: e.view_count
      })),
      venues: venues?.map(v => ({
        id: v.id,
        name: v.name,
        slug: v.slug,
        address: `${v.address}, ${v.city}, ${v.state}`,
        capacity: v.capacity,
        image: v.image_url,
        rating: v.rating,
        category: v.category,
        amenities: v.amenities || []
      })) || [],
      upcomingEvents: upcomingEvents.map(e => ({
        id: e.id,
        title: e.title,
        date: e.start_datetime,
        venue: e.venue?.name || 'TBD',
        ticketsSold: e.tickets_sold,
        capacity: e.capacity,
        revenue: 0 // TODO: Calculate actual revenue
      })),
      analytics: {
        totalEvents: events.length,
        totalRevenue,
        totalAttendees,
        averageRating: Math.round(averageRating * 10) / 10
      }
    };

  } catch (error) {
    logger.error({ error }, 'Error loading organizer dashboard');
    return { 
      events: [],
      venues: [],
      upcomingEvents: [],
      analytics: {
        totalEvents: 0,
        totalRevenue: 0,
        totalAttendees: 0,
        averageRating: 0
      }
    };
  }
};

export async function action({ request }: Route.ActionArgs) {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  const action = formData.get('_action');
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      throw new Response('Unauthorized', { status: 401 });
    }

    if (action === 'create-event') {
      const eventData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        start_datetime: formData.get('start_datetime') as string,
        end_datetime: formData.get('end_datetime') as string,
        venue_id: formData.get('venue_id') as string,
        performer_id: formData.get('performer_id') as string,
        price_min: parseFloat(formData.get('price_min') as string),
        price_max: parseFloat(formData.get('price_max') as string),
        capacity: parseInt(formData.get('capacity') as string),
        organizer_id: user.id,
        status: 'draft'
      };

      const { data, error } = await client
        .from('events')
        .insert(eventData)
        .select()
        .single();

      if (error) {
        logger.error({ error }, 'Error creating event');
        throw new Response(error.message, { status: 400 });
      }

      return { success: true, event: data };
    }

    if (action === 'update-event') {
      const eventId = formData.get('eventId') as string;
      const updates: any = {};

      // Only update provided fields
      if (formData.has('title')) updates.title = formData.get('title');
      if (formData.has('description')) updates.description = formData.get('description');
      if (formData.has('status')) updates.status = formData.get('status');
      
      const { error } = await client
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .eq('organizer_id', user.id);

      if (error) {
        logger.error({ error }, 'Error updating event');
        throw new Response(error.message, { status: 400 });
      }

      return { success: true };
    }

    if (action === 'cancel-event') {
      const eventId = formData.get('eventId') as string;
      
      const { error } = await client
        .from('events')
        .update({ status: 'cancelled' })
        .eq('id', eventId)
        .eq('organizer_id', user.id);

      if (error) {
        logger.error({ error }, 'Error cancelling event');
        throw new Response(error.message, { status: 400 });
      }

      // TODO: Notify attendees and process refunds

      return { success: true };
    }

    throw new Response('Invalid action', { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing organizer action');
    throw new Response('Server error', { status: 500 });
  }
}

/**
 * Event organizer management dashboard
 */
export default function OrganizerDashboardPage() {
  const data = useLoaderData<typeof loader>();
  return <OrganizerDashboard {...data} />;
}