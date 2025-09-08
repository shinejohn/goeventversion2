import React from 'react';
import { json } from 'react-router';
import { useLoaderData } from 'react-router';
import type { Route } from '~/types/app/routes/dashboard/performer/bookings';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';
import { PerformerList } from '~/components/magic-patterns/components/performers/PerformerList';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return json({ 
        bookings: [],
        upcomingShows: [],
        analytics: {
          totalBookings: 0,
          totalRevenue: 0,
          averageRating: 0,
          completedShows: 0
        }
      });
    }

    // Check if user is a performer
    const { data: performerRole } = await client
      .from('user_roles')
      .select('id')
      .eq('user_id', user.id)
      .eq('role_type', 'performer')
      .eq('is_active', true)
      .single();

    if (!performerRole) {
      return json({ 
        bookings: [],
        upcomingShows: [],
        analytics: {
          totalBookings: 0,
          totalRevenue: 0,
          averageRating: 0,
          completedShows: 0
        },
        needsRole: true
      });
    }

    // Get performer profile
    const { data: performer } = await client
      .from('performers')
      .select('id, name, stage_name')
      .eq('user_id', user.id)
      .single();

    if (!performer) {
      return json({ 
        bookings: [],
        upcomingShows: [],
        analytics: {
          totalBookings: 0,
          totalRevenue: 0,
          averageRating: 0,
          completedShows: 0
        },
        needsProfile: true
      });
    }

    // Fetch performer's bookings/events
    const { data: bookings } = await client
      .from('events')
      .select(`
        id,
        title,
        slug,
        description,
        start_datetime,
        end_datetime,
        status,
        performer_fee,
        image_url,
        venue:venues!events_venue_id_fkey(
          id,
          name,
          address,
          city,
          state
        ),
        organizer:auth.users!events_organizer_id_fkey(
          id,
          email,
          raw_user_meta_data
        ),
        tickets_sold,
        capacity
      `)
      .eq('performer_id', performer.id)
      .order('start_datetime', { ascending: false });

    if (!bookings) {
      return json({ 
        bookings: [],
        upcomingShows: [],
        analytics: {
          totalBookings: 0,
          totalRevenue: 0,
          averageRating: 0,
          completedShows: 0
        }
      });
    }

    // Get upcoming shows
    const now = new Date().toISOString();
    const upcomingShows = bookings.filter(b => b.start_datetime > now && b.status === 'published');

    // Get booking requests (draft status events)
    const bookingRequests = bookings.filter(b => b.status === 'draft');

    // Calculate analytics
    const completedShows = bookings.filter(b => b.end_datetime < now && b.status === 'published');
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.performer_fee || 0), 0);

    // Get performer ratings
    const { data: reviews } = await client
      .from('reviews')
      .select('rating')
      .eq('entity_type', 'performer')
      .eq('entity_id', performer.id);

    const averageRating = reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // Transform bookings for component
    const transformedBookings = bookings.map(b => ({
      id: b.id,
      eventTitle: b.title,
      eventSlug: b.slug,
      date: b.start_datetime,
      startTime: new Date(b.start_datetime).toLocaleTimeString(),
      endTime: new Date(b.end_datetime).toLocaleTimeString(),
      venue: b.venue ? `${b.venue.name}, ${b.venue.city}` : 'TBD',
      venueId: b.venue?.id,
      organizer: b.organizer?.raw_user_meta_data?.name || b.organizer?.email || 'Unknown',
      organizerId: b.organizer?.id,
      status: b.status,
      fee: b.performer_fee || 0,
      image: b.image_url,
      ticketsSold: b.tickets_sold,
      capacity: b.capacity
    }));

    return json({
      bookings: transformedBookings,
      upcomingShows: upcomingShows.map(s => ({
        id: s.id,
        title: s.title,
        date: s.start_datetime,
        venue: s.venue?.name || 'TBD',
        fee: s.performer_fee || 0
      })),
      bookingRequests: bookingRequests.map(r => ({
        id: r.id,
        eventTitle: r.title,
        date: r.start_datetime,
        venue: r.venue?.name || 'TBD',
        organizer: r.organizer?.raw_user_meta_data?.name || 'Unknown',
        fee: r.performer_fee || 0
      })),
      analytics: {
        totalBookings: bookings.length,
        totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10,
        completedShows: completedShows.length
      }
    });

  } catch (error) {
    logger.error({ error }, 'Error loading performer bookings');
    return json({ 
      bookings: [],
      upcomingShows: [],
      analytics: {
        totalBookings: 0,
        totalRevenue: 0,
        averageRating: 0,
        completedShows: 0
      }
    });
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
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get performer profile
    const { data: performer } = await client
      .from('performers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!performer) {
      return json({ success: false, error: 'Performer profile not found' }, { status: 404 });
    }

    if (action === 'accept-booking') {
      const eventId = formData.get('eventId') as string;
      
      // Update event status to published
      const { error } = await client
        .from('events')
        .update({ 
          status: 'published',
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .eq('performer_id', performer.id);

      if (error) {
        logger.error({ error }, 'Error accepting booking');
        return json({ success: false, error: error.message });
      }

      // TODO: Notify organizer

      return json({ success: true, message: 'Booking accepted' });
    }

    if (action === 'decline-booking') {
      const eventId = formData.get('eventId') as string;
      const reason = formData.get('reason') as string;
      
      // Update event to remove performer
      const { error } = await client
        .from('events')
        .update({ 
          performer_id: null,
          performer_fee: null,
          metadata: { declineReason: reason },
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .eq('performer_id', performer.id);

      if (error) {
        logger.error({ error }, 'Error declining booking');
        return json({ success: false, error: error.message });
      }

      // TODO: Notify organizer

      return json({ success: true, message: 'Booking declined' });
    }

    if (action === 'update-availability') {
      const date = formData.get('date') as string;
      const available = formData.get('available') === 'true';
      
      // Store availability in performer_availability table
      const { error } = await client
        .from('performer_availability')
        .upsert({
          performer_id: performer.id,
          date,
          is_available: available,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'performer_id,date'
        });

      if (error) {
        logger.error({ error }, 'Error updating availability');
        return json({ success: false, error: error.message });
      }

      return json({ success: true });
    }

    return json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing performer action');
    return json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

/**
 * Performer booking management
 */
export default function PerformerBookingsPage() {
  const data = useLoaderData<typeof loader>();
  return <PerformerList {...data} />;
}