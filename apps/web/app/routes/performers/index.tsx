import React from 'react';
import type { Route } from './+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';

// Magic Patterns imports
import { PerformersPage } from '~/components/magic-patterns/pages/PerformersPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { transformPerformersList } from '~/lib/magic-patterns/data-transformers';
import { getLogger } from '@kit/shared/logger';

/**
 * Performers Route - Core entity of the system
 * Performers bring talent and entertainment to events at venues
 * 
 * Let's give these artists the spotlight they deserve! 🌟
 */

// Query parameter schema for performer discovery
const PerformersQuerySchema = z.object({
  search: z.string().max(100).optional().default(''),
  category: z.enum([
    'musician', 'band', 'dj', 'comedian', 'speaker', 
    'dancer', 'magician', 'variety', 'other'
  ]).optional(),
  genres: z.string().optional(), // comma-separated list
  instruments: z.string().optional(), // comma-separated list
  city: z.string().max(50).optional().default(''),
  state: z.string().max(50).optional().default(''),
  minRate: z.coerce.number().min(0).optional(),
  maxRate: z.coerce.number().max(50000).optional(),
  availability: z.string().optional(), // ISO date string for availability check
  verified: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  sort: z.enum(['name', 'rating', 'rate', 'performances', 'newest']).optional().default('rating'),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const params = PerformersQuerySchema.parse(queryParams);
    
    logger.info({ 
      loader: 'performers',
      params 
    }, '🎸 Loading performers - the stars of the show!');
    
    const client = getSupabaseServerClient(request);
    
    // Parallel data fetching for optimal performance 🚀
    const [performersQuery, genresQuery, topPerformers] = await Promise.all([
      // Main performers query
      (async () => {
        let query = client
          .from('performers')
          .select('*', { count: 'exact' });
        
        // Apply filters
        if (params.search) {
          query = query.or(
            `name.ilike.%${params.search}%,bio.ilike.%${params.search}%`
          );
        }
        
        if (params.category) {
          query = query.eq('category', params.category);
        }
        
        if (params.genres) {
          const genresList = params.genres.split(',').map(g => g.trim());
          query = query.contains('genres', genresList);
        }
        
        if (params.instruments) {
          const instrumentsList = params.instruments.split(',').map(i => i.trim());
          query = query.contains('instruments', instrumentsList);
        }
        
        // Note: The performers table doesn't have city/state columns
        // This would need to be implemented differently based on actual schema
        // For now, skipping location-based filtering
        
        if (params.minRate !== undefined) {
          query = query.gte('base_rate', params.minRate);
        }
        
        if (params.maxRate !== undefined) {
          query = query.lte('base_rate', params.maxRate);
        }
        
        if (params.verified !== undefined) {
          query = query.eq('is_verified', params.verified);
        }
        
        // Apply sorting
        switch (params.sort) {
          case 'name':
            query = query.order('name', { ascending: true });
            break;
          case 'rating':
            query = query.order('rating', { ascending: false, nullsFirst: false });
            break;
          case 'rate':
            query = query.order('base_rate', { ascending: true, nullsFirst: false });
            break;
          case 'performances':
            // No total_performances column in simplified query, use created_at as fallback
            query = query.order('created_at', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
        }
        
        // Apply pagination
        const offset = (params.page - 1) * params.limit;
        query = query.range(offset, offset + params.limit - 1);
        
        return await query;
      })(),
      
      // Get popular genres for filters
      client
        .from('performers')
        .select('genres')
        .eq('is_available', true)
        .not('genres', 'is', null),
      
      // Get top-rated performers for featured section
      client
        .from('performers')
        .select('id, name, category, rating, profile_image_url')
        .order('rating', { ascending: false, nullsFirst: false })
        .limit(5)
    ]);
    
    const { data: performers, error, count } = performersQuery;
    const { data: genreData } = genresQuery;
    const { data: featuredPerformers } = topPerformers;
    
    if (error) {
      logger.error({ 
        error, 
        loader: 'performers',
        params 
      }, 'Failed to load performers');
      throw error;
    }
    
    // Transform data for Magic Patterns component - simplified to work with basic query
    const transformedPerformers = (performers || []).map(performer => ({
      ...performer,
      // Ensure PerformersPage gets the fields it expects
      stage_name: performer.name,
      category: performer.category || 'Performer',
      genres: performer.genres || [],
      image: performer.image || performer.image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }));
    
    // Calculate genre distribution from all performers
    const genreStats: Record<string, number> = {};
    genreData?.forEach(performer => {
      if (Array.isArray(performer.genres)) {
        performer.genres.forEach(genre => {
          if (genre) {
            genreStats[genre] = (genreStats[genre] || 0) + 1;
          }
        });
      }
    });
    
    // Get top genres sorted by count
    const popularGenres = Object.entries(genreStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([genre, count]) => ({ genre, count }));
    
    // Calculate performance metrics
    const performerMetrics = {
      totalPerformers: count || 0,
      verifiedPerformers: performers?.filter(p => p.is_verified).length || 0,
      averageRate: performers?.reduce((sum, p) => sum + (p.base_rate || 0), 0) / (performers?.length || 1),
      topCategories: performers?.reduce((acc, p) => {
        if (p.category) {
          acc[p.category] = (acc[p.category] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {},
      totalPerformances: performers?.reduce((sum, p) => sum + (p.total_performances || 0), 0) || 0,
      popularCities: [], // Location data not available in current schema
    };
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'performers',
      duration,
      count: transformedPerformers.length,
      totalCount: count,
      metrics: performerMetrics
    }, '🎭 Performers loaded - the show can go on!');
    
    return {
      performers: transformedPerformers,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / params.limit),
        hasMore: count ? (offset + params.limit) < count : false,
      },
      filters: params,
      metrics: performerMetrics,
      popularGenres,
      featuredPerformers: featuredPerformers || [],
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'performers',
      url: request.url 
    }, '😔 Error loading performers - no encore tonight');
    
    // Return empty state with error
    return {
      performers: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
      filters: PerformersQuerySchema.parse({}),
      metrics: {
        totalPerformers: 0,
        verifiedPerformers: 0,
        averageRate: 0,
        topCategories: {},
        totalPerformances: 0,
        popularCities: [],
      },
      popularGenres: [],
      featuredPerformers: [],
      error: error instanceof Error ? error.message : 'Failed to load performers',
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: PerformersPage,
  transformData: (loaderData) => ({
    performers: loaderData.performers,
    pagination: loaderData.pagination,
    filters: loaderData.filters,
    metrics: loaderData.metrics,
    popularGenres: loaderData.popularGenres,
    featuredPerformers: loaderData.featuredPerformers,
    error: loaderData.error,
  }),
});

// SEO meta tags 🎯
export const meta = () => {
  return [
    { title: 'Find Amazing Performers & Entertainment - When The Fun' },
    { 
      name: 'description', 
      content: 'Discover talented musicians, bands, DJs, comedians, speakers, and entertainers for your next event. Book verified performers with confidence.' 
    },
    { property: 'og:title', content: 'Find Amazing Performers - When The Fun' },
    { property: 'og:description', content: 'Book the perfect entertainment for your event' },
    { property: 'og:type', content: 'website' },
  ];
};

// Cache headers for performance 🚀
export const headers = () => {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=3600', // 5 min client, 1 hour CDN
  };
};