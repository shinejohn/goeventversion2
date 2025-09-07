import React from 'react';
import type { Route } from './+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';

// Magic Patterns imports
import { CommunityPage } from '~/components/magic-patterns/pages/CommunityPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * Community Route - Where event lovers connect and share!
 * Community hubs bring together people with shared interests
 * 
 * Building connections, one hub at a time! 🌟👥
 */

// Query parameter schema for community discovery
const CommunityQuerySchema = z.object({
  search: z.string().max(100).optional().default(''),
  visibility: z.enum(['public', 'private', 'invite_only']).optional(),
  category: z.string().optional(), // music, arts, sports, etc.
  city: z.string().max(50).optional().default(''),
  memberCount: z.enum(['small', 'medium', 'large']).optional(), // small: <50, medium: 50-500, large: 500+
  verified: z.coerce.boolean().optional(),
  joined: z.coerce.boolean().optional(), // Show only hubs user has joined
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  sort: z.enum(['popular', 'newest', 'active', 'name']).optional().default('popular'),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const params = CommunityQuerySchema.parse(queryParams);
    
    logger.info({ 
      loader: 'community',
      params 
    }, '👥 Loading community hubs - where connections happen!');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user for membership status
    const { data: { user } } = await client.auth.getUser();
    
    // Parallel data fetching for optimal performance 🚀
    const [hubsQuery, membershipQuery, featuredHubs] = await Promise.all([
      // Main community hubs query
      (async () => {
        let query = client
          .from('community_hubs')
          .select(`
            *,
            hub_memberships!inner (
              user_id,
              role
            )
          `, { count: 'exact' })
          .eq('is_active', true);
        
        // Apply filters
        if (params.search) {
          query = query.or(
            `name.ilike.%${params.search}%,description.ilike.%${params.search}%`
          );
        }
        
        if (params.visibility) {
          query = query.eq('visibility', params.visibility);
        }
        
        if (params.verified !== undefined) {
          query = query.eq('is_verified', params.verified);
        }
        
        // Member count filter
        if (params.memberCount) {
          switch (params.memberCount) {
            case 'small':
              query = query.lt('current_members', 50);
              break;
            case 'medium':
              query = query.gte('current_members', 50).lt('current_members', 500);
              break;
            case 'large':
              query = query.gte('current_members', 500);
              break;
          }
        }
        
        // Show only joined hubs if requested
        if (params.joined && user) {
          query = query.eq('hub_memberships.user_id', user.id);
        }
        
        // Apply sorting
        switch (params.sort) {
          case 'popular':
            query = query.order('current_members', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'active':
            // Would need activity metrics - using member count as proxy
            query = query.order('current_members', { ascending: false });
            break;
          case 'name':
            query = query.order('name', { ascending: true });
            break;
        }
        
        // Apply pagination
        const offset = (params.page - 1) * params.limit;
        query = query.range(offset, offset + params.limit - 1);
        
        return await query;
      })(),
      
      // Get user's hub memberships
      user ? client
        .from('hub_memberships')
        .select(`
          hub_id,
          role,
          joined_at
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        : Promise.resolve({ data: [] }),
      
      // Get featured/trending hubs
      client
        .from('community_hubs')
        .select('id, name, description, logo_url, current_members, visibility')
        .eq('is_active', true)
        .eq('is_verified', true)
        .order('current_members', { ascending: false })
        .limit(5)
    ]);
    
    const { data: hubs, error, count } = hubsQuery;
    const { data: userMemberships } = membershipQuery;
    const { data: trendingHubs } = featuredHubs;
    
    if (error) {
      logger.error({ 
        error, 
        loader: 'community',
        params 
      }, 'Failed to load community hubs');
      throw error;
    }
    
    // Transform hub data with membership status
    const userHubIds = new Set((userMemberships || []).map(m => m.hub_id));
    const transformedHubs = (hubs || []).map(hub => ({
      id: hub.id,
      name: hub.name,
      description: hub.description || '',
      slug: hub.slug,
      visibility: hub.visibility,
      memberCount: hub.current_members || 0,
      memberLimit: hub.member_limit,
      logoUrl: hub.logo_url,
      bannerUrl: hub.banner_url,
      isVerified: hub.is_verified || false,
      isMember: userHubIds.has(hub.id),
      features: hub.features_enabled || {},
      createdAt: hub.created_at,
    }));
    
    // Calculate community metrics
    const communityMetrics = {
      totalHubs: count || 0,
      publicHubs: hubs?.filter(h => h.visibility === 'public').length || 0,
      privateHubs: hubs?.filter(h => h.visibility === 'private').length || 0,
      totalMembers: hubs?.reduce((sum, h) => sum + (h.current_members || 0), 0) || 0,
      averageHubSize: hubs?.length ? Math.round(hubs.reduce((sum, h) => sum + (h.current_members || 0), 0) / hubs.length) : 0,
      userHubCount: userMemberships?.length || 0,
      visibilityBreakdown: hubs?.reduce((acc, h) => {
        acc[h.visibility] = (acc[h.visibility] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {},
    };
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'community',
      duration,
      count: transformedHubs.length,
      totalCount: count,
      metrics: communityMetrics
    }, '🌟 Community hubs loaded - connections made!');
    
    return {
      hubs: transformedHubs,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / params.limit),
        hasMore: count ? (offset + params.limit) < count : false,
      },
      filters: params,
      metrics: communityMetrics,
      trendingHubs: trendingHubs || [],
      userMemberships: userMemberships || [],
      user: user ? {
        id: user.id,
        email: user.email,
      } : null,
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'community',
      url: request.url 
    }, '😔 Error loading community - no connections today');
    
    // Return empty state with error
    return {
      hubs: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
      filters: CommunityQuerySchema.parse({}),
      metrics: {
        totalHubs: 0,
        publicHubs: 0,
        privateHubs: 0,
        totalMembers: 0,
        averageHubSize: 0,
        userHubCount: 0,
        visibilityBreakdown: {},
      },
      trendingHubs: [],
      userMemberships: [],
      user: null,
      error: error instanceof Error ? error.message : 'Failed to load community hubs',
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: CommunityPage,
  transformData: (loaderData) => ({
    hubs: loaderData.hubs,
    pagination: loaderData.pagination,
    filters: loaderData.filters,
    metrics: loaderData.metrics,
    trendingHubs: loaderData.trendingHubs,
    userMemberships: loaderData.userMemberships,
    user: loaderData.user,
    error: loaderData.error,
  }),
});

// SEO meta tags 🎯
export const meta = () => {
  return [
    { title: 'Community Hubs - Connect with Event Lovers | When The Fun' },
    { 
      name: 'description', 
      content: 'Join community hubs to connect with people who share your passion for events. Find local groups, interest-based communities, and exclusive event access.' 
    },
    { property: 'og:title', content: 'Community Hubs - When The Fun' },
    { property: 'og:description', content: 'Connect with event lovers in your community' },
    { property: 'og:type', content: 'website' },
  ];
};

// Cache headers for performance 🚀
export const headers = () => {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=3600', // 5 min client, 1 hour CDN
  };
};