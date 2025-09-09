import React from 'react';
import type { Route } from './+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';

// Magic Patterns imports - fix the import paths
import { VenuesPage } from '../../components/magic-patterns/pages/VenuesPage';
import { createMagicPatternsRoute } from '../../lib/magic-patterns/route-wrapper';
import { transformVenuesList } from '../../lib/magic-patterns/data-transformers';
import { getLogger } from '@kit/shared/logger';

/**
 * Venues Route - Core entity of the system
 * Venues are physical spaces where events happen and performers perform
 */

// Query parameter schema with venue-specific filters
const VenuesQuerySchema = z.object({
  search: z.string().max(100).optional().default(''),
  city: z.string().max(50).optional().default(''),
  type: z.enum(['music', 'theater', 'sports', 'conference', 'wedding', 'outdoor', 'other']).optional(),
  capacity: z.coerce.number().min(0).max(100000).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().max(10000).optional(),
  amenities: z.string().optional(), // comma-separated list
  availability: z.string().optional(), // date for availability check
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  sort: z.enum(['name', 'price', 'capacity', 'rating', 'distance']).optional().default('name'),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const params = VenuesQuerySchema.parse(queryParams);
    
    logger.info({ 
      loader: 'venues',
      params 
    }, 'Loading venues - core system entity');
    
    const client = getSupabaseServerClient(request);
    
    // Build query for venues - simplified to match homepage pattern
    let query = client
      .from('venues')
      .select('*', { count: 'exact' });
    
    // Apply search filters
    if (params.search) {
      query = query.or(
        `name.ilike.%${params.search}%,description.ilike.%${params.search}%`
      );
    }
    
    // Location filter
    if (params.city) {
      query = query.or(`city.ilike.%${params.city}%,state.ilike.%${params.city}%`);
    }
    
    // Venue type filter
    if (params.type) {
      query = query.eq('venue_type', params.type);
    }
    
    // Capacity filter
    if (params.capacity) {
      query = query.gte('capacity', params.capacity);
    }
    
    // Price range filters
    if (params.minPrice) {
      query = query.gte('price_per_hour', params.minPrice);
    }
    if (params.maxPrice) {
      query = query.lte('price_per_hour', params.maxPrice);
    }
    
    // Amenities filter - simplified for now
    // TODO: Implement amenities filter with JSONB query
    
    // Availability filter - simplified for now
    // TODO: Implement availability check with blackout_dates JSONB
    
    // Apply sorting
    switch (params.sort) {
      case 'price':
        query = query.order('price_per_hour', { ascending: true, nullsFirst: false });
        break;
      case 'capacity':
        query = query.order('capacity', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false, nullsFirst: false });
        break;
      case 'distance':
        // Would need user location for this
        query = query.order('name', { ascending: true });
        break;
      default:
        query = query.order('created_at', { ascending: false })
          .order('name', { ascending: true });
    }
    
    // Apply pagination
    const offset = (params.page - 1) * params.limit;
    query = query.range(offset, offset + params.limit - 1);
    
    // Execute query with count
    const { data: venues, error, count } = await query;
    
    if (error) {
      logger.error({ 
        error, 
        loader: 'venues',
        params 
      }, 'Failed to load venues');
      // Return empty data instead of throwing error
      return {
        venues: [],
        pagination: {
          page: params.page,
          limit: params.limit,
          total: 0,
          totalPages: 0,
          hasMore: false,
        },
        filters: params,
        metrics: {
          totalVenues: 0,
          averagePrice: 0,
          popularCities: [],
        },
        error: 'Failed to load venues',
      };
    }
    
    // Transform data for Magic Patterns component - simplified to work with basic query
    const transformedVenues = (venues || []).map(venue => ({
      ...venue,
      // Map simplified query results to what VenuesPage expects
      images: venue.gallery_images || [venue.image_url] || [],
      image_url: venue.image_url || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      city: venue.city || venue.location || '',
      venue_type: venue.venue_type || 'Venue',
      rating: venue.rating || 0,
      capacity: venue.capacity || 0,
      amenities: venue.amenities || [],
      unavailable_dates: [], // TODO: Add unavailable_dates field to venues table
      distance: null, // Placeholder for distance calculation
      last_booked_days_ago: null // Placeholder for booking history
    }));
    
    // Calculate additional metrics
    const venueMetrics = {
      totalVenues: count || 0,
      averagePrice: venues?.reduce((sum, v) => sum + (v.price_per_hour || 0), 0) / (venues?.length || 1),
      popularCities: [...new Set(venues?.map(v => v.city).filter(Boolean))].slice(0, 5),
    };
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'venues',
      duration,
      count: transformedVenues.length,
      totalCount: count,
      metrics: venueMetrics
    }, 'Venues loaded successfully');
    
    return {
      venues: transformedVenues,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / params.limit),
        hasMore: count ? offset + params.limit < count : false,
      },
      filters: params,
      metrics: venueMetrics,
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'venues',
      url: request.url 
    }, 'Error in venues loader');
    
    // Return empty state with error
    return {
      venues: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
      filters: VenuesQuerySchema.parse({}),
      metrics: {
        totalVenues: 0,
        averagePrice: 0,
        popularCities: [],
      },
      error: error instanceof Error ? error.message : 'Failed to load venues',
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: VenuesPage,
  transformData: (loaderData: any) => ({
    venues: loaderData.venues,
    pagination: loaderData.pagination,
    filters: loaderData.filters,
    metrics: loaderData.metrics,
    error: loaderData.error,
  }),
});

// SEO meta tags
export const meta = () => {
  return [
    { title: 'Find Venues for Your Events - When The Fun' },
    { name: 'description', content: 'Discover and book amazing venues for concerts, weddings, conferences, and more. Browse thousands of spaces perfect for your next event.' },
    { property: 'og:title', content: 'Find Venues for Your Events - When The Fun' },
    { property: 'og:description', content: 'Book the perfect venue for your next event' },
  ];
};

// Cache headers for better performance
export const headers = () => {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=3600',
  };
};