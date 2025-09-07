import React from 'react';
import type { Route } from '~/types/app/routes/+types/social';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';

// Magic Patterns imports
import SocialFeedPage from '~/components/magic-patterns/pages/social/SocialFeedPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * Social Feed Route - The heart of the social influencer platform!
 * Where friends share their event experiences and discover new activities
 * 
 * Social connections make everything more fun! 🌟✨
 */

// Query parameter schema for social feed filtering
const SocialFeedQuerySchema = z.object({
  filter: z.enum(['all', 'friends', 'following', 'nearby']).optional().default('all'),
  category: z.enum(['music', 'food-drink', 'arts', 'entertainment', 'community', 'sports', 'business']).optional(),
  timeframe: z.enum(['today', 'week', 'month', 'all']).optional().default('week'),
  postType: z.enum(['all', 'events', 'reviews', 'photos', 'check-ins']).optional().default('all'),
  location: z.string().max(100).optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(20),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const params = SocialFeedQuerySchema.parse(queryParams);
    
    logger.info({ 
      loader: 'social-feed',
      params 
    }, '🌟 Loading social feed - where connections happen!');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user for personalized feed
    const { data: { user } } = await client.auth.getUser();
    
    // Calculate date filter based on timeframe
    const getDateFilter = () => {
      const now = new Date();
      switch (params.timeframe) {
        case 'today':
          return new Date(now.setHours(0, 0, 0, 0)).toISOString();
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return weekAgo.toISOString();
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          return monthAgo.toISOString();
        default:
          return null;
      }
    };
    
    const dateFilter = getDateFilter();
    
    // Parallel data fetching for optimal performance 🚀
    const [socialPostsQuery, friendsQuery, trendingEventsQuery, nearbyPostsQuery] = await Promise.all([
      // Main social posts query
      (async () => {
        let query = client
          .from('social_posts')
          .select(`
            *,
            author:accounts!user_id (
              id,
              name,
              picture_url
            ),
            event:events!event_id (
              id,
              title,
              start_date,
              category,
              venues!venue_id (
                name,
                city
              )
            ),
            likes:post_likes(count),
            comments:post_comments(
              id,
              content,
              created_at,
              author:accounts!user_id (
                name,
                picture_url
              )
            )
          `, { count: 'exact' });
        
        // Apply date filter
        if (dateFilter) {
          query = query.gte('created_at', dateFilter);
        }
        
        // Apply category filter
        if (params.category) {
          query = query.eq('category', params.category);
        }
        
        // Apply post type filter
        if (params.postType !== 'all') {
          query = query.eq('post_type', params.postType);
        }
        
        // Apply friendship filter if user is logged in
        if (params.filter === 'friends' && user) {
          // This would need a friendships table to work properly
          query = query.in('user_id', [user.id]); // Placeholder - show user's own posts
        } else if (params.filter === 'following' && user) {
          // This would need a following table to work properly
          query = query.in('user_id', [user.id]); // Placeholder - show user's own posts
        }
        
        // Apply pagination
        const offset = (params.page - 1) * params.limit;
        query = query
          .order('created_at', { ascending: false })
          .range(offset, offset + params.limit - 1);
        
        return await query;
      })(),
      
      // Get user's friends count
      user ? client
        .from('friendships')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('status', 'accepted')
        : Promise.resolve({ data: [], count: 0 }),
      
      // Get trending events for social discovery
      client
        .from('events')
        .select(`
          id,
          title,
          start_date,
          category,
          image_url,
          venues!venue_id (
            name,
            city
          )
        `)
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Get nearby posts if location is provided
      params.location ? client
        .from('social_posts')
        .select(`
          id,
          content,
          location,
          author:accounts!user_id (
            name,
            picture_url
          )
        `)
        .ilike('location', `%${params.location}%`)
        .order('created_at', { ascending: false })
        .limit(10)
        : Promise.resolve({ data: [] })
    ]);
    
    const { data: posts, error, count } = socialPostsQuery;
    const { data: friendsData, count: friendsCount } = friendsQuery;
    const { data: trendingEvents } = trendingEventsQuery;
    const { data: nearbyPosts } = nearbyPostsQuery;
    
    if (error) {
      logger.error({ 
        error, 
        loader: 'social-feed',
        params 
      }, 'Failed to load social feed');
      throw error;
    }
    
    // Transform posts for the social feed
    const transformedPosts = (posts || []).map(post => ({
      id: post.id,
      content: post.content,
      imageUrl: post.image_url,
      videoUrl: post.video_url,
      location: post.location,
      category: post.category || 'general',
      postType: post.post_type || 'general',
      createdAt: post.created_at,
      author: {
        id: post.author?.id || post.user_id,
        name: post.author?.name || 'Unknown User',
        avatar: post.author?.picture_url,
      },
      event: post.event ? {
        id: post.event.id,
        title: post.event.title,
        startDate: post.event.start_date,
        category: post.event.category,
        venue: post.event.venues?.name,
        city: post.event.venues?.city,
      } : null,
      likes: Array.isArray(post.likes) ? post.likes.length : 0,
      comments: (post.comments || []).map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        author: {
          name: comment.author?.name || 'Anonymous',
          avatar: comment.author?.picture_url,
        },
      })),
      isLiked: false, // Would need user-specific like data
    }));
    
    // Calculate social metrics
    const socialMetrics = {
      totalPosts: count || 0,
      friendsCount: friendsCount || 0,
      todaysPosts: posts?.filter(p => {
        const today = new Date().toDateString();
        return new Date(p.created_at).toDateString() === today;
      }).length || 0,
      categoriesActive: [...new Set(posts?.map(p => p.category))].length || 0,
      nearbyActivity: nearbyPosts?.length || 0,
    };
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'social-feed',
      duration,
      postsCount: transformedPosts.length,
      totalCount: count,
      metrics: socialMetrics
    }, '🌟 Social feed loaded - connections ready!');
    
    return {
      posts: transformedPosts,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / params.limit),
        hasMore: count ? ((params.page - 1) * params.limit + params.limit) < count : false,
      },
      filters: params,
      metrics: socialMetrics,
      trendingEvents: trendingEvents || [],
      nearbyPosts: nearbyPosts || [],
      user: user ? {
        id: user.id,
        email: user.email,
      } : null,
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'social-feed',
      url: request.url 
    }, '😢 Error loading social feed - no connections today');
    
    // Return empty state with error
    return {
      posts: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
      filters: SocialFeedQuerySchema.parse({}),
      metrics: {
        totalPosts: 0,
        friendsCount: 0,
        todaysPosts: 0,
        categoriesActive: 0,
        nearbyActivity: 0,
      },
      trendingEvents: [],
      nearbyPosts: [],
      user: null,
      error: error instanceof Error ? error.message : 'Failed to load social feed',
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: SocialFeedPage,
  transformData: (loaderData) => ({
    posts: loaderData.posts,
    pagination: loaderData.pagination,
    filters: loaderData.filters,
    metrics: loaderData.metrics,
    trendingEvents: loaderData.trendingEvents,
    nearbyPosts: loaderData.nearbyPosts,
    user: loaderData.user,
    error: loaderData.error,
  }),
});

// SEO meta tags 🎯
export const meta = () => {
  return [
    { title: 'Social Feed - Connect with Event Lovers | When The Fun' },
    { 
      name: 'description', 
      content: 'Discover what your friends are doing, share your event experiences, and connect with the local social scene.' 
    },
    { property: 'og:title', content: 'Social Feed - When The Fun' },
    { property: 'og:description', content: 'Your social network for local events and activities' },
    { property: 'og:type', content: 'website' },
  ];
};

// Cache headers for performance 🚀
export const headers = () => {
  return {
    'Cache-Control': 'private, max-age=60', // 1 minute cache for social content
  };
};