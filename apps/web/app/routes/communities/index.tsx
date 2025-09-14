import React from 'react';
import type { Route } from './+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Link } from 'react-router';

// Magic Patterns imports
import { CommunitiesReportPage } from '~/components/magic-patterns/pages/CommunitiesReportPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { transformCommunityData } from '~/lib/magic-patterns/data-transformers';
import { getLogger } from '@kit/shared/logger';

/**
 * Communities Route - Discover and join community hubs!
 * View all community hubs, events, and join communities
 * 
 * Time to connect with your community! 🏘️✨
 */

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const logger = await getLogger();
  
  try {
    logger.info({ name: 'communities-loader' }, 'Loading communities data...');
    
    // Fetch community hubs
    const { data: communityHubs, error: communityError } = await client
      .from('community_hubs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (communityError) {
      logger.error({ name: 'communities-loader', error: communityError }, 'Error fetching community hubs');
      throw new Error('Failed to fetch community hubs');
    }
    
    // Transform community data
    const transformedCommunities = (communityHubs || []).map(transformCommunityData);
    
    // Get community statistics
    const totalCommunities = transformedCommunities.length;
    const activeCommunities = transformedCommunities.filter(c => c.isActive).length;
    
    logger.info({ 
      name: 'communities-loader',
      totalCommunities,
      activeCommunities
    }, 'Communities data loaded successfully');
    
    return {
      communities: transformedCommunities,
      pagination: {
        total: totalCommunities,
        page: 1,
        limit: 20,
        hasMore: false
      },
      filters: {
        categories: ['All', 'Music', 'Food', 'Tech', 'Sports', 'Art'],
        active: true
      },
      metrics: {
        totalCommunities,
        activeCommunities,
        totalMembers: transformedCommunities.reduce((sum, c) => sum + (c.memberCount || 0), 0),
        totalEvents: transformedCommunities.reduce((sum, c) => sum + (c.eventCount || 0), 0)
      },
      error: null
    };
    
  } catch (error) {
    logger.error({ name: 'communities-loader', error }, 'Error in communities loader');
    
    return {
      communities: [],
      pagination: { total: 0, page: 1, limit: 20, hasMore: false },
      filters: { categories: ['All'], active: true },
      metrics: { totalCommunities: 0, activeCommunities: 0, totalMembers: 0, totalEvents: 0 },
      error: error instanceof Error ? error.message : 'Failed to load communities'
    };
  }
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: 'Community Hubs - Discover & Join Communities | GoEventCity',
    },
    {
      name: 'description',
      content: 'Discover and join community hubs that share your interests. Connect with like-minded people and find amazing events in your area.',
    },
  ];
};

export default createMagicPatternsRoute({
  component: CommunitiesReportPage,
  transformData: (loaderData) => ({
    communities: loaderData.communities || [],
    pagination: loaderData.pagination,
    filters: loaderData.filters,
    metrics: loaderData.metrics,
    error: loaderData.error,
  }),
});
