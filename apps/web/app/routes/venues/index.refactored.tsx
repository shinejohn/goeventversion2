import React from 'react';
import type { Route } from './+types/index';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';

// Magic Patterns imports
import { VenuesPage } from '~/components/magic-patterns/pages/VenuesPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { transformVenuesList, type VenueData } from '~/lib/magic-patterns/data-transformers';
import { getLogger } from '@kit/shared/logger';

/**
 * Venues Route - Refactored for proper Magic Patterns integration
 * Maintains UI look and feel while adding proper error handling and type safety
 */

// Query parameter schema
const VenuesQuerySchema = z.object({
  search: z.string().max(100).optional().default(''),
  city: z.string().max(50).optional().default(''),
  type: z.enum(['music', 'theater', 'sports', 'conference', 'other']).optional().default(''),
  capacity: z.coerce.number().min(0).max(100000).optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
});

// Loader with proper error handling and logging
export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const validatedParams = VenuesQuerySchema.parse(queryParams);
    
    logger.info({ 
      loader: 'venues',
      params: validatedParams 
    }, 'Loading venues page');
    
    // Get Supabase client
    const client = getSupabaseServerClient(request);
    
    // Build query with proper typing
    let query = client
      .from('venues')
      .select('*')
      .eq('status', 'active'); // Only show active venues
    
    // Apply filters
    if (validatedParams.search) {
      query = query.or(
        `name.ilike.%${validatedParams.search}%,description.ilike.%${validatedParams.search}%`
      );
    }
    
    if (validatedParams.city) {
      query = query.ilike('city', `%${validatedParams.city}%`);
    }
    
    if (validatedParams.type) {
      query = query.eq('venue_type', validatedParams.type);
    }
    
    if (validatedParams.capacity) {
      query = query.gte('max_capacity', validatedParams.capacity);
    }
    
    // Apply pagination
    const offset = (validatedParams.page - 1) * validatedParams.limit;
    query = query
      .range(offset, offset + validatedParams.limit - 1)
      .order('featured', { ascending: false }) // Featured venues first
      .order('name', { ascending: true });
    
    // Execute query
    const { data: venues, error, count } = await query;
    
    if (error) {
      logger.error({ 
        error, 
        loader: 'venues',
        params: validatedParams 
      }, 'Failed to load venues');
      throw error;
    }
    
    // Transform data for Magic Patterns component
    const transformedVenues = transformVenuesList(venues || []);
    
    // Log performance metrics
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'venues',
      duration,
      count: transformedVenues.length,
      totalCount: count 
    }, 'Venues loaded successfully');
    
    return {
      venues: transformedVenues,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        total: count || 0,
        hasMore: count ? offset + validatedParams.limit < count : false,
      },
      filters: validatedParams,
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'venues',
      url: request.url 
    }, 'Error in venues loader');
    
    // Return empty state rather than throwing
    return {
      venues: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        hasMore: false,
      },
      filters: VenuesQuerySchema.parse({}),
      error: error instanceof Error ? error.message : 'Failed to load venues',
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: VenuesPage,
  transformData: (loaderData) => ({
    venues: loaderData.venues,
    // Add additional props that VenuesPage might need
    pagination: loaderData.pagination,
    filters: loaderData.filters,
    error: loaderData.error,
  }),
});

// Export meta for SEO
export const meta = () => {
  return [
    { title: 'Browse Venues - When The Fun' },
    { name: 'description', content: 'Discover and book amazing venues for your events' },
  ];
};

// Export headers for caching
export const headers = () => {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=3600',
  };
};