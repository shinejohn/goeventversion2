import React from 'react';
import type { Route } from './+types/index';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';

// Magic Patterns imports
import { OrganizerManagementDashboard } from '~/components/magic-patterns/pages/management/OrganizerManagementDashboard';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * Organizer Management Dashboard Route
 * Comprehensive management interface for event organizers
 * 
 * Let's organize those amazing events! 🎪✨
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

    // Check if user has organizer role
    const { data: organizerRole } = await client
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role_type', 'organizer')
      .eq('is_active', true)
      .single();

    if (!organizerRole) {
      throw redirect('/dashboard/organizer/setup');
    }

    // Get organizer profile
    const { data: organizer } = await client
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!organizer) {
      throw redirect('/dashboard/organizer/setup');
    }

    // Get organizer's events
    const { data: events } = await client
      .from('events')
      .select(`
        *,
        venue:venues(name, address, city, state),
        performer:performers(name, genre)
      `)
      .eq('organizer_id', user.id)
      .order('start_datetime', { ascending: false })
      .limit(10);

    // Get organizer's venues (managed)
    const { data: venues } = await client
      .from('venues')
      .select('*')
      .eq('organizer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get organizer's performers (booked)
    const { data: performers } = await client
      .from('performers')
      .select(`
        *,
        events:events(count)
      `)
      .eq('organizer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get analytics data
    const { data: analytics } = await client
      .from('organizer_analytics')
      .select('*')
      .eq('organizer_id', user.id)
      .single();

    // Get recent bookings
    const { data: bookings } = await client
      .from('bookings')
      .select(`
        *,
        event:events(title, start_datetime, venue:venues(name))
      `)
      .eq('organizer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    return {
      title: 'Organizer Management - GoEventCity',
      organizer: {
        ...organizer
      },
      events: events || [],
      venues: venues || [],
      performers: performers || [],
      bookings: bookings || [],
      analytics: analytics || {
        total_events: 0,
        total_venues: 0,
        total_performers: 0,
        total_revenue: 0,
        total_attendees: 0,
        average_rating: 0
      },
      user: {
        id: user.id,
        email: user.email
      }
    };

  } catch (error) {
    logger.error({ error }, 'Organizer management loader error');
    
    if (error instanceof Response) {
      throw error;
    }
    
    return {
      title: 'Organizer Management - GoEventCity',
      organizer: null,
      events: [],
      venues: [],
      performers: [],
      bookings: [],
      analytics: {
        total_events: 0,
        total_venues: 0,
        total_performers: 0,
        total_revenue: 0,
        total_attendees: 0,
        average_rating: 0
      },
      user: null,
      error: 'Failed to load organizer data'
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: OrganizerManagementDashboard,
  transformData: (loaderData) => ({
    organizer: loaderData.organizer,
    events: loaderData.events,
    venues: loaderData.venues,
    performers: loaderData.performers,
    bookings: loaderData.bookings,
    analytics: loaderData.analytics,
    user: loaderData.user,
    error: loaderData.error
  }),
});

// SEO meta tags 🎯
export const meta = ({ data }: Route.MetaArgs) => [
  {
    title: data?.title || 'Organizer Management - GoEventCity',
  },
  {
    name: 'description',
    content: 'Manage your events, venues, and performers as an organizer on GoEventCity',
  },
];
