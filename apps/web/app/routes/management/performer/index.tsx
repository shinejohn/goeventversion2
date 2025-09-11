import React from 'react';
import type { Route } from './+types/index';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';

// Magic Patterns imports
import { PerformerManagementDashboard } from '~/components/magic-patterns/pages/management/PerformerManagementDashboard';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * Performer Management Dashboard Route
 * Comprehensive management interface for performers
 * 
 * Let's manage that performer career! 🎤✨
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

    // Check if user has performer role
    const { data: performerRole } = await client
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role_type', 'performer')
      .eq('is_active', true)
      .single();

    if (!performerRole) {
      throw redirect('/dashboard/performer/setup');
    }

    // Get performer profile
    const { data: performer } = await client
      .from('performers')
      .select(`
        *,
        user:user_profiles!performers_user_id_fkey(*)
      `)
      .eq('user_id', user.id)
      .single();

    if (!performer) {
      throw redirect('/dashboard/performer/setup');
    }

    // Get performer's events
    const { data: events } = await client
      .from('events')
      .select(`
        *,
        venue:venues(name, address, city, state)
      `)
      .eq('performer_id', performer.id)
      .order('start_datetime', { ascending: false })
      .limit(10);

    // Get upcoming bookings
    const { data: bookings } = await client
      .from('bookings')
      .select(`
        *,
        event:events(title, start_datetime, venue:venues(name))
      `)
      .eq('performer_id', performer.id)
      .gte('event.start_datetime', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    // Get analytics data
    const { data: analytics } = await client
      .from('performer_analytics')
      .select('*')
      .eq('performer_id', performer.id)
      .single();

    // Get shop products
    const { data: products } = await client
      .from('performer_products')
      .select('*')
      .eq('performer_id', performer.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get social media links
    const { data: socialLinks } = await client
      .from('performer_social_links')
      .select('*')
      .eq('performer_id', performer.id);

    return {
      title: 'Performer Management - GoEventCity',
      performer: {
        ...performer,
        social_links: socialLinks || []
      },
      events: events || [],
      bookings: bookings || [],
      analytics: analytics || {
        total_events: 0,
        total_bookings: 0,
        total_revenue: 0,
        average_rating: 0,
        follower_count: 0,
        view_count: 0
      },
      products: products || [],
      user: {
        id: user.id,
        email: user.email
      }
    };

  } catch (error) {
    logger.error({ error }, 'Performer management loader error');
    
    if (error instanceof Response) {
      throw error;
    }
    
    return {
      title: 'Performer Management - GoEventCity',
      performer: null,
      events: [],
      bookings: [],
      analytics: {
        total_events: 0,
        total_bookings: 0,
        total_revenue: 0,
        average_rating: 0,
        follower_count: 0,
        view_count: 0
      },
      products: [],
      user: null,
      error: 'Failed to load performer data'
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: PerformerManagementDashboard,
  transformData: (loaderData) => ({
    performer: loaderData.performer,
    events: loaderData.events,
    bookings: loaderData.bookings,
    analytics: loaderData.analytics,
    products: loaderData.products,
    user: loaderData.user,
    error: loaderData.error
  }),
});

// SEO meta tags 🎯
export const meta = ({ data }: Route.MetaArgs) => [
  {
    title: data?.title || 'Performer Management - GoEventCity',
  },
  {
    name: 'description',
    content: 'Manage your performer profile, events, bookings, and shop on GoEventCity',
  },
];
