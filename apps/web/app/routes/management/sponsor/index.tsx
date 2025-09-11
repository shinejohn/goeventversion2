import React from 'react';
import type { Route } from './+types/index';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';

// Magic Patterns imports
import { SponsorManagementDashboard } from '~/components/magic-patterns/pages/management/SponsorManagementDashboard';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * Sponsor Management Dashboard Route
 * Comprehensive management interface for sponsors
 * 
 * Let's sponsor those amazing events! 💰✨
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

    // Check if user has sponsor role
    const { data: sponsorRole } = await client
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role_type', 'sponsor')
      .eq('is_active', true)
      .single();

    if (!sponsorRole) {
      throw redirect('/dashboard/sponsor/setup');
    }

    // Get sponsor profile
    const { data: sponsor } = await client
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!sponsor) {
      throw redirect('/dashboard/sponsor/setup');
    }

    // Get sponsor's campaigns
    const { data: campaigns } = await client
      .from('sponsor_campaigns')
      .select(`
        *,
        events:events(title, start_datetime, venue:venues(name))
      `)
      .eq('sponsor_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get sponsor's partnerships
    const { data: partnerships } = await client
      .from('sponsor_partnerships')
      .select(`
        *,
        partner:user_profiles(display_name, profile_image_url)
      `)
      .eq('sponsor_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get analytics data
    const { data: analytics } = await client
      .from('sponsor_analytics')
      .select('*')
      .eq('sponsor_id', user.id)
      .single();

    // Get sponsored events
    const { data: sponsoredEvents } = await client
      .from('events')
      .select(`
        *,
        venue:venues(name, address, city, state)
      `)
      .eq('sponsor_id', user.id)
      .order('start_datetime', { ascending: false })
      .limit(10);

    return {
      title: 'Sponsor Management - GoEventCity',
      sponsor: {
        ...sponsor
      },
      campaigns: campaigns || [],
      partnerships: partnerships || [],
      sponsoredEvents: sponsoredEvents || [],
      analytics: analytics || {
        total_campaigns: 0,
        total_partnerships: 0,
        total_investment: 0,
        total_reach: 0,
        total_engagement: 0,
        roi: 0
      },
      user: {
        id: user.id,
        email: user.email
      }
    };

  } catch (error) {
    logger.error({ error }, 'Sponsor management loader error');
    
    if (error instanceof Response) {
      throw error;
    }
    
    return {
      title: 'Sponsor Management - GoEventCity',
      sponsor: null,
      campaigns: [],
      partnerships: [],
      sponsoredEvents: [],
      analytics: {
        total_campaigns: 0,
        total_partnerships: 0,
        total_investment: 0,
        total_reach: 0,
        total_engagement: 0,
        roi: 0
      },
      user: null,
      error: 'Failed to load sponsor data'
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: SponsorManagementDashboard,
  transformData: (loaderData) => ({
    sponsor: loaderData.sponsor,
    campaigns: loaderData.campaigns,
    partnerships: loaderData.partnerships,
    sponsoredEvents: loaderData.sponsoredEvents,
    analytics: loaderData.analytics,
    user: loaderData.user,
    error: loaderData.error
  }),
});

// SEO meta tags 🎯
export const meta = ({ data }: Route.MetaArgs) => [
  {
    title: data?.title || 'Sponsor Management - GoEventCity',
  },
  {
    name: 'description',
    content: 'Manage your sponsorship campaigns, partnerships, and analytics on GoEventCity',
  },
];
