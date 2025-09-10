import React from 'react';
import type { Route } from './+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';

// Magic Patterns imports
import { EventsPage } from '~/components/magic-patterns/pages/EventsPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { transformEventsList } from '~/lib/magic-patterns/data-transformers';
import { getLogger } from '@kit/shared/logger';

/**
 * Events Route - Core entity of the system
 * Events are what bring venues and performers together
 * 
 * Pizza party approved! 🍕
 */

// Query parameter schema for event discovery
const EventsQuerySchema = z.object({
  search: z.string().max(100).optional().default(''),
  city: z.string().max(50).optional().default(''),
  category: z.enum([
    'music', 'sports', 'business', 'entertainment', 'arts',
    'food_drink', 'community', 'education', 'health', 'technology', 'other'
  ]).optional(),
  startDate: z.string().optional(), // ISO date string
  endDate: z.string().optional(), // ISO date string
  venueId: z.string().uuid().optional(),
  performerId: z.string().uuid().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().max(10000).optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  sort: z.enum(['date', 'name', 'price', 'popularity']).optional().default('date'),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const params = EventsQuerySchema.parse(queryParams);
    
    logger.info({ 
      loader: 'events',
      params 
    }, '🎉 Loading events - where the fun happens!');
    
    const client = getSupabaseServerClient(request);
    
    // Calculate offset for pagination
    const offset = (params.page - 1) * params.limit;
    
    // Parallel data fetching for better performance 🚀
    const [eventsQuery, venuesQuery, categoryCounts] = await Promise.all([
      // Main events query with computed fields for UI
      (async () => {
        let query = client
          .from('events')
          .select('*, venues!venue_id(*)', { count: 'exact' });
          // Temporarily removed filters to debug
          // .eq('status', 'published')
          // .gte('start_datetime', new Date().toISOString());
        
        // Apply filters
        if (params.search) {
          query = query.or(
            `title.ilike.%${params.search}%,description.ilike.%${params.search}%`
          );
        }
        
        if (params.city) {
          query = query.or(`city.ilike.%${params.city}%,location_name.ilike.%${params.city}%`);
        }
        
        if (params.category) {
          query = query.eq('category', params.category);
        }
        
        if (params.venueId) {
          query = query.eq('venue_id', params.venueId);
        }
        
        if (params.startDate) {
          query = query.gte('start_datetime', params.startDate);
        }
        
        if (params.endDate) {
          query = query.lte('end_datetime', params.endDate);
        }
        
        if (params.minPrice !== undefined) {
          query = query.gte('price_min', params.minPrice);
        }
        
        if (params.maxPrice !== undefined) {
          query = query.lte('price_max', params.maxPrice);
        }
        
        // Apply sorting
        switch (params.sort) {
          case 'date':
            query = query.order('start_datetime', { ascending: true });
            break;
          case 'name':
            query = query.order('title', { ascending: true });
            break;
          case 'price':
            query = query.order('price_min', { ascending: true, nullsFirst: true });
            break;
          case 'popularity':
            query = query.order('created_at', { ascending: false });
            break;
        }
        
        // Apply pagination
        query = query.range(offset, offset + params.limit - 1);
        
        return await query;
      })(),
      
      // Get popular venues for quick filters
      client
        .from('venues')
        .select('id, name, city')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10),
      
      // Get category counts for filters
      client
        .from('events')
        .select('category')
        .eq('status', 'published')
        .gte('start_datetime', new Date().toISOString())
    ]);
    
    const { data: events, error, count } = eventsQuery;
    const { data: popularVenues } = venuesQuery;
    const { data: categoryData } = categoryCounts;
    
    if (error) {
      logger.error({ 
        error, 
        loader: 'events',
        params 
      }, 'Failed to load events');
      throw error;
    }
    
    logger.info({
      loader: 'events',
      eventsCount: events?.length || 0,
      totalCount: count || 0,
      firstEvent: events?.[0]
    }, 'Events query result')
    
    // Transform data for Magic Patterns component
    const transformedEvents = (events || []).map(event => ({
      ...event,
      // UI expects these specific fields
      date: event.start_datetime ? new Date(event.start_datetime).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }) : '',
      time: event.start_datetime ? new Date(event.start_datetime).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      }) : '',
      venue: event.venues?.name || event.location_name || 'TBA',
      price: event.is_free ? 'Free' : (event.ticket_price ? `$${event.ticket_price}` : (event.price_min ? `$${event.price_min}+` : 'Check')),
      rawDate: event.start_datetime ? new Date(event.start_datetime) : new Date(),
      image: event.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }));
    
    // Calculate category distribution
    const categoryStats = categoryData?.reduce((acc, event) => {
      if (event.category) {
        acc[event.category] = (acc[event.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>) || {};
    
    // Calculate additional metrics
    const eventMetrics = {
      totalEvents: count || 0,
      upcomingToday: events?.filter(e => {
        const eventDate = new Date(e.start_datetime);
        const today = new Date();
        return eventDate.toDateString() === today.toDateString();
      }).length || 0,
      thisWeek: events?.filter(e => {
        const eventDate = new Date(e.start_datetime);
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return eventDate <= weekFromNow;
      }).length || 0,
      averagePrice: events?.reduce((sum, e) => sum + (e.price_min || 0), 0) / (events?.length || 1),
      popularCities: [...new Set(events?.map(e => e.city).filter(Boolean))].slice(0, 5),
      categoryDistribution: categoryStats,
    };
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'events',
      duration,
      count: transformedEvents.length,
      totalCount: count,
      metrics: eventMetrics
    }, '🎊 Events loaded successfully - let the fun begin!');
    
    return {
      events: transformedEvents,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / params.limit),
        hasMore: count ? (offset + params.limit) < count : false,
      },
      filters: params,
      metrics: eventMetrics,
      popularVenues: popularVenues || [],
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'events',
      url: request.url 
    }, '😢 Error loading events - no party today');
    
    // Return empty state with error
    return {
      events: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
      filters: EventsQuerySchema.parse({}),
      metrics: {
        totalEvents: 0,
        upcomingToday: 0,
        thisWeek: 0,
        averagePrice: 0,
        popularCities: [],
        categoryDistribution: {},
      },
      popularVenues: [],
      error: error instanceof Error ? error.message : 'Failed to load events',
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: EventsPage,
  transformData: (loaderData) => ({
    events: loaderData.events,
    pagination: loaderData.pagination,
    filters: loaderData.filters,
    metrics: loaderData.metrics,
    popularVenues: loaderData.popularVenues,
    error: loaderData.error,
  }),
});

// SEO meta tags 🎯
export const meta = () => {
  return [
    { title: 'Discover Amazing Events Near You - When The Fun' },
    { 
      name: 'description', 
      content: 'Find concerts, festivals, workshops, and more happening in your city. Book tickets for the best events and create unforgettable memories.' 
    },
    { property: 'og:title', content: 'Discover Amazing Events - When The Fun' },
    { property: 'og:description', content: 'Your gateway to incredible experiences' },
    { property: 'og:type', content: 'website' },
  ];
};

// Cache headers for performance 🚀
export const headers = () => {
  return {
    'Cache-Control': 'public, max-age=60, s-maxage=300', // Shorter cache for events
  };
};