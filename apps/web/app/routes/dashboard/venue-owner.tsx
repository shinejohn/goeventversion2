import React from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { Route } from '~/types/app/routes/dashboard/venue-owner';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { VenueOwnerDashboard } from '~/components/magic-patterns/components/bookings/VenueOwnerDashboard';
import { getLogger } from '@kit/shared/logger';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return json({ 
        venues: [],
        bookingRequests: [],
        upcomingEvents: [],
        analytics: {
          totalRevenue: 0,
          totalBookings: 0,
          averageRating: 0,
          occupancyRate: 0
        },
        recentActivity: []
      });
    }

    // Check if user has venue_manager role
    const { data: hasRole } = await client
      .from('user_roles')
      .select('id')
      .eq('user_id', user.id)
      .eq('role_type', 'venue_manager')
      .eq('is_active', true)
      .single();

    if (!hasRole) {
      // User doesn't have venue_manager role
      return json({ 
        venues: [],
        bookingRequests: [],
        upcomingEvents: [],
        analytics: {
          totalRevenue: 0,
          totalBookings: 0,
          averageRating: 0,
          occupancyRate: 0
        },
        recentActivity: [],
        needsRole: true
      });
    }

    // Fetch venues owned by the user
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
        zip_code,
        country,
        capacity,
        image_url,
        rating,
        category,
        amenities,
        created_at
      `)
      .eq('owner_id', user.id)
      .eq('status', 'active');

    if (!venues || venues.length === 0) {
      return json({ 
        venues: [],
        bookingRequests: [],
        upcomingEvents: [],
        analytics: {
          totalRevenue: 0,
          totalBookings: 0,
          averageRating: 0,
          occupancyRate: 0
        },
        recentActivity: []
      });
    }

    const venueIds = venues.map(v => v.id);

    // Fetch pending booking requests
    const { data: bookingRequests } = await client
      .from('venue_bookings')
      .select(`
        id,
        event_date,
        start_time,
        end_time,
        status,
        total_amount,
        created_at,
        venue:venues!venue_bookings_venue_id_fkey(
          id,
          name,
          image_url
        ),
        organizer:auth.users!venue_bookings_organizer_id_fkey(
          id,
          email,
          raw_user_meta_data
        ),
        event_type,
        expected_attendees,
        notes
      `)
      .in('venue_id', venueIds)
      .eq('status', 'pending')
      .order('event_date', { ascending: true })
      .limit(10);

    // Fetch upcoming confirmed events
    const { data: upcomingEvents } = await client
      .from('events')
      .select(`
        id,
        title,
        slug,
        start_datetime,
        end_datetime,
        image_url,
        category,
        price_min,
        price_max,
        venue:venues!events_venue_id_fkey(
          id,
          name
        ),
        performer:performers!events_performer_id_fkey(
          id,
          name,
          stage_name
        )
      `)
      .in('venue_id', venueIds)
      .gte('start_datetime', new Date().toISOString())
      .eq('status', 'active')
      .order('start_datetime', { ascending: true })
      .limit(10);

    // Calculate analytics for all venues
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Total bookings and revenue
    const { data: bookingStats } = await client
      .from('venue_bookings')
      .select('id, total_amount')
      .in('venue_id', venueIds)
      .eq('status', 'completed')
      .gte('created_at', thirtyDaysAgo.toISOString());

    const totalRevenue = bookingStats?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;
    const totalBookings = bookingStats?.length || 0;

    // Average rating across all venues
    const averageRating = venues.reduce((sum, v) => sum + (v.rating || 0), 0) / venues.length || 0;

    // Calculate occupancy rate (simplified)
    const { data: totalAvailableSlots } = await client
      .from('venue_availability')
      .select('id')
      .in('venue_id', venueIds)
      .gte('date', thirtyDaysAgo.toISOString())
      .count();

    const occupancyRate = totalBookings > 0 && totalAvailableSlots?.length > 0 
      ? (totalBookings / totalAvailableSlots.length) * 100 
      : 0;

    // Recent activity (bookings, reviews, etc.)
    const { data: recentBookings } = await client
      .from('venue_bookings')
      .select(`
        id,
        created_at,
        event_date,
        total_amount,
        status,
        venue:venues!venue_bookings_venue_id_fkey(
          name
        ),
        organizer:auth.users!venue_bookings_organizer_id_fkey(
          email,
          raw_user_meta_data
        )
      `)
      .in('venue_id', venueIds)
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: recentReviews } = await client
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        reviewer:auth.users!reviews_reviewer_id_fkey(
          email,
          raw_user_meta_data
        ),
        venue:venues!reviews_entity_id_fkey(
          name
        )
      `)
      .eq('entity_type', 'venue')
      .in('entity_id', venueIds)
      .order('created_at', { ascending: false })
      .limit(5);

    // Combine and sort recent activity
    const recentActivity = [
      ...(recentBookings?.map(b => ({
        id: b.id,
        type: 'booking' as const,
        description: `New ${b.status} booking for ${b.venue?.name}`,
        user: b.organizer?.raw_user_meta_data?.name || b.organizer?.email?.split('@')[0] || 'Unknown',
        amount: b.total_amount,
        date: b.created_at
      })) || []),
      ...(recentReviews?.map(r => ({
        id: r.id,
        type: 'review' as const,
        description: `${r.rating} star review for ${r.venue?.name}`,
        user: r.reviewer?.raw_user_meta_data?.name || r.reviewer?.email?.split('@')[0] || 'Unknown',
        comment: r.comment,
        date: r.created_at
      })) || [])
    ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

    return json({
      venues: venues.map(v => ({
        id: v.id,
        name: v.name,
        slug: v.slug,
        address: `${v.address}, ${v.city}, ${v.state} ${v.zip_code}`,
        capacity: v.capacity,
        image: v.image_url,
        rating: v.rating,
        category: v.category,
        amenities: v.amenities || []
      })),
      bookingRequests: bookingRequests?.map(br => ({
        id: br.id,
        venueName: br.venue?.name || 'Unknown',
        venueImage: br.venue?.image_url,
        organizerName: br.organizer?.raw_user_meta_data?.name || br.organizer?.email?.split('@')[0] || 'Unknown',
        organizerEmail: br.organizer?.email,
        eventDate: br.event_date,
        startTime: br.start_time,
        endTime: br.end_time,
        eventType: br.event_type,
        expectedAttendees: br.expected_attendees,
        amount: br.total_amount,
        notes: br.notes,
        requestedOn: br.created_at
      })) || [],
      upcomingEvents: upcomingEvents?.map(e => ({
        id: e.id,
        title: e.title,
        slug: e.slug,
        date: e.start_datetime,
        venueName: e.venue?.name || 'Unknown',
        performerName: e.performer?.stage_name || e.performer?.name || 'Various',
        image: e.image_url,
        category: e.category,
        priceRange: e.price_min === e.price_max 
          ? `$${e.price_min}` 
          : `$${e.price_min} - $${e.price_max}`
      })) || [],
      analytics: {
        totalRevenue,
        totalBookings,
        averageRating: Math.round(averageRating * 10) / 10,
        occupancyRate: Math.round(occupancyRate)
      },
      recentActivity
    });

  } catch (error) {
    logger.error({ error }, 'Error loading venue owner dashboard');
    return json({ 
      venues: [],
      bookingRequests: [],
      upcomingEvents: [],
      analytics: {
        totalRevenue: 0,
        totalBookings: 0,
        averageRating: 0,
        occupancyRate: 0
      },
      recentActivity: []
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

    if (action === 'accept-booking') {
      const bookingId = formData.get('bookingId') as string;
      
      const { error } = await client
        .from('venue_bookings')
        .update({ 
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) {
        logger.error({ error }, 'Error accepting booking');
        return json({ success: false, error: error.message });
      }

      // TODO: Send notification to organizer

      return json({ success: true });
    }

    if (action === 'decline-booking') {
      const bookingId = formData.get('bookingId') as string;
      const reason = formData.get('reason') as string;
      
      const { error } = await client
        .from('venue_bookings')
        .update({ 
          status: 'declined',
          decline_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) {
        logger.error({ error }, 'Error declining booking');
        return json({ success: false, error: error.message });
      }

      // TODO: Send notification to organizer

      return json({ success: true });
    }

    if (action === 'update-availability') {
      const venueId = formData.get('venueId') as string;
      const date = formData.get('date') as string;
      const isAvailable = formData.get('isAvailable') === 'true';
      
      if (isAvailable) {
        const { error } = await client
          .from('venue_availability')
          .insert({
            venue_id: venueId,
            date,
            is_available: true
          })
          .onConflict('venue_id,date')
          .merge();

        if (error) {
          logger.error({ error }, 'Error updating availability');
          return json({ success: false, error: error.message });
        }
      } else {
        const { error } = await client
          .from('venue_availability')
          .delete()
          .eq('venue_id', venueId)
          .eq('date', date);

        if (error) {
          logger.error({ error }, 'Error updating availability');
          return json({ success: false, error: error.message });
        }
      }

      return json({ success: true });
    }

    return json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing venue owner action');
    return json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

/**
 * Venue owner management dashboard
 */
export default function VenueOwnerDashboardPage() {
  const data = useLoaderData<typeof loader>();
  return <VenueOwnerDashboard {...data} />;
}