import React from 'react';
import type { Route } from './+types/index';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';

// Magic Patterns imports
import { VenueManagementDashboard } from '~/components/magic-patterns/pages/management/VenueManagementDashboard';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * Venue Management Dashboard Route
 * Comprehensive management interface for venues
 * 
 * Let's manage that venue business! 🏢✨
 */

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  
  try {
    // Get current user
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      throw redirect('/auth/login');
    }

    // Check if user has venue_manager role
    const { data: venueRole } = await client
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role_type', 'venue_manager')
      .eq('is_active', true)
      .single();

    if (!venueRole) {
      throw redirect('/dashboard/venue/setup');
    }

    // Get venue profile
    const { data: venue } = await client
      .from('venues')
      .select(`
        *,
        user:user_profiles!venues_manager_id_fkey(*)
      `)
      .eq('manager_id', user.id)
      .single();

    if (!venue) {
      throw redirect('/dashboard/venue/setup');
    }

    // Get venue's events
    const { data: events } = await client
      .from('events')
      .select(`
        *,
        performer:performers(name, genre)
      `)
      .eq('venue_id', venue.id)
      .order('start_datetime', { ascending: false })
      .limit(10);

    // Get venue bookings
    const { data: bookings } = await client
      .from('bookings')
      .select(`
        *,
        event:events(title, start_datetime, performer:performers(name))
      `)
      .eq('venue_id', venue.id)
      .gte('event.start_datetime', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    // Get analytics data
    const { data: analytics } = await client
      .from('venue_analytics')
      .select('*')
      .eq('venue_id', venue.id)
      .single();

    // Get venue amenities and features
    const { data: amenities } = await client
      .from('venue_amenities')
      .select('*')
      .eq('venue_id', venue.id);

    // Get venue images
    const { data: images } = await client
      .from('venue_images')
      .select('*')
      .eq('venue_id', venue.id)
      .order('created_at', { ascending: false });

    return {
      title: 'Venue Management - GoEventCity',
      venue: {
        ...venue,
        amenities: amenities || [],
        images: images || []
      },
      events: events || [],
      bookings: bookings || [],
      analytics: analytics || {
        total_events: 0,
        total_bookings: 0,
        total_revenue: 0,
        average_rating: 0,
        occupancy_rate: 0,
        view_count: 0
      },
      user: {
        id: user.id,
        email: user.email
      }
    };

  } catch (error) {
    logger.error({ error }, 'Venue management loader error');
    
    if (error instanceof Response) {
      throw error;
    }
    
    return {
      title: 'Venue Management - GoEventCity',
      venue: null,
      events: [],
      bookings: [],
      analytics: {
        total_events: 0,
        total_bookings: 0,
        total_revenue: 0,
        average_rating: 0,
        occupancy_rate: 0,
        view_count: 0
      },
      user: null,
      error: 'Failed to load venue data'
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: VenueManagementDashboard,
  transformData: (loaderData) => ({
    venue: loaderData.venue,
    events: loaderData.events,
    bookings: loaderData.bookings,
    analytics: loaderData.analytics,
    user: loaderData.user,
    error: loaderData.error
  }),
});

// SEO meta tags 🎯
export const meta = ({ data }: Route.MetaArgs) => [
  {
    title: data?.title || 'Venue Management - GoEventCity',
  },
  {
    name: 'description',
    content: 'Manage your venue profile, events, bookings, and analytics on GoEventCity',
  },
];
