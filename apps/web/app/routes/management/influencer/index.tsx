import React from 'react';
import type { Route } from './+types/index';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';

// Magic Patterns imports
import { InfluencerManagementDashboard } from '~/components/magic-patterns/pages/management/InfluencerManagementDashboard';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * Influencer Management Dashboard Route
 * Comprehensive management interface for influencers
 * 
 * Let's manage that influence! 🌟✨
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

    // Check if user has influencer role
    const { data: influencerRole } = await client
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role_type', 'influencer')
      .eq('is_active', true)
      .single();

    if (!influencerRole) {
      throw redirect('/dashboard/influencer/setup');
    }

    // Get influencer profile
    const { data: influencer } = await client
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!influencer) {
      throw redirect('/dashboard/influencer/setup');
    }

    // Get influencer's communities
    const { data: communities } = await client
      .from('community_hubs')
      .select(`
        *,
        members:community_members(count)
      `)
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get influencer's calendars
    const { data: calendars } = await client
      .from('curated_calendars')
      .select(`
        *,
        events:calendar_events(count),
        subscribers:calendar_subscribers(count)
      `)
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get analytics data
    const { data: analytics } = await client
      .from('influencer_analytics')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get recent content/posts
    const { data: content } = await client
      .from('influencer_content')
      .select('*')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get social media links
    const { data: socialLinks } = await client
      .from('influencer_social_links')
      .select('*')
      .eq('user_id', user.id);

    return {
      title: 'Influencer Management - GoEventCity',
      influencer: {
        ...influencer,
        social_links: socialLinks || []
      },
      communities: communities || [],
      calendars: calendars || [],
      content: content || [],
      analytics: analytics || {
        total_communities: 0,
        total_calendars: 0,
        total_followers: 0,
        total_engagement: 0,
        total_content: 0,
        reach: 0
      },
      user: {
        id: user.id,
        email: user.email
      }
    };

  } catch (error) {
    logger.error({ error }, 'Influencer management loader error');
    
    if (error instanceof Response) {
      throw error;
    }
    
    return {
      title: 'Influencer Management - GoEventCity',
      influencer: null,
      communities: [],
      calendars: [],
      content: [],
      analytics: {
        total_communities: 0,
        total_calendars: 0,
        total_followers: 0,
        total_engagement: 0,
        total_content: 0,
        reach: 0
      },
      user: null,
      error: 'Failed to load influencer data'
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: InfluencerManagementDashboard,
  transformData: (loaderData) => ({
    influencer: loaderData.influencer,
    communities: loaderData.communities,
    calendars: loaderData.calendars,
    content: loaderData.content,
    analytics: loaderData.analytics,
    user: loaderData.user,
    error: loaderData.error
  }),
});

// SEO meta tags 🎯
export const meta = ({ data }: Route.MetaArgs) => [
  {
    title: data?.title || 'Influencer Management - GoEventCity',
  },
  {
    name: 'description',
    content: 'Manage your communities, calendars, and content as an influencer on GoEventCity',
  },
];
