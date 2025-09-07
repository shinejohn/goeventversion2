import React from 'react';
import type { Route } from './+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';

// Magic Patterns imports
import { BookingsPage } from '~/components/magic-patterns/pages/BookingsPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { transformBookingsList } from '~/lib/magic-patterns/data-transformers';
import { getLogger } from '@kit/shared/logger';

/**
 * Bookings Route - Where events, venues, and performers come together!
 * This is the marketplace where customers book their experiences
 * 
 * Let's make some magic happen! ✨🎫
 */

// Query parameter schema for booking discovery and management
const BookingsQuerySchema = z.object({
  view: z.enum(['upcoming', 'past', 'all']).optional().default('upcoming'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed', 'refunded']).optional(),
  paymentStatus: z.enum(['unpaid', 'deposit_paid', 'paid_in_full', 'refunded', 'partial_refund']).optional(),
  eventId: z.string().uuid().optional(),
  venueId: z.string().uuid().optional(),
  performerId: z.string().uuid().optional(),
  startDate: z.string().optional(), // ISO date string
  endDate: z.string().optional(), // ISO date string
  search: z.string().max(100).optional().default(''),
  minAmount: z.coerce.number().min(0).optional(),
  maxAmount: z.coerce.number().max(100000).optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  sort: z.enum(['date', 'amount', 'status', 'created']).optional().default('date'),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const params = BookingsQuerySchema.parse(queryParams);
    
    logger.info({ 
      loader: 'bookings',
      params 
    }, '🎫 Loading bookings - where the magic gets real!');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user for filtering personal bookings
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Parallel data fetching for optimal performance 🚀
    const [bookingsQuery, statsQuery, recentVenues] = await Promise.all([
      // Main bookings query
      (async () => {
        let query = client
          .from('bookings')
          .select(`
            *,
            events!event_id (
              id,
              title,
              start_date,
              end_date,
              image_url,
              category
            ),
            venues!venue_id (
              id,
              name,
              address,
              city
            ),
            performers!performer_id (
              id,
              stage_name,
              profile_image_url
            )
          `, { count: 'exact' })
          .eq('account_id', user.id); // Show only user's bookings
        
        // Apply view filter
        const now = new Date().toISOString();
        switch (params.view) {
          case 'upcoming':
            query = query.gte('event_date', now);
            break;
          case 'past':
            query = query.lt('event_date', now);
            break;
          // 'all' shows everything
        }
        
        // Apply filters
        if (params.status) {
          query = query.eq('status', params.status);
        }
        
        if (params.paymentStatus) {
          query = query.eq('payment_status', params.paymentStatus);
        }
        
        if (params.eventId) {
          query = query.eq('event_id', params.eventId);
        }
        
        if (params.venueId) {
          query = query.eq('venue_id', params.venueId);
        }
        
        if (params.performerId) {
          query = query.eq('performer_id', params.performerId);
        }
        
        if (params.startDate) {
          query = query.gte('event_date', params.startDate);
        }
        
        if (params.endDate) {
          query = query.lte('event_date', params.endDate);
        }
        
        if (params.search) {
          query = query.or(
            `booking_number.ilike.%${params.search}%,client_name.ilike.%${params.search}%,client_email.ilike.%${params.search}%`
          );
        }
        
        if (params.minAmount !== undefined) {
          query = query.gte('total_amount', params.minAmount);
        }
        
        if (params.maxAmount !== undefined) {
          query = query.lte('total_amount', params.maxAmount);
        }
        
        // Apply sorting
        switch (params.sort) {
          case 'date':
            query = query.order('event_date', { ascending: true });
            break;
          case 'amount':
            query = query.order('total_amount', { ascending: false });
            break;
          case 'status':
            query = query.order('status', { ascending: true });
            break;
          case 'created':
            query = query.order('created_at', { ascending: false });
            break;
        }
        
        // Apply pagination
        const offset = (params.page - 1) * params.limit;
        query = query.range(offset, offset + params.limit - 1);
        
        return await query;
      })(),
      
      // Get booking statistics
      (async () => {
        const statsQuery = await client
          .from('bookings')
          .select('status, payment_status, total_amount')
          .eq('account_id', user.id);
          
        return statsQuery.data || [];
      })(),
      
      // Get recently booked venues for quick re-booking
      client
        .from('bookings')
        .select(`
          venue_id,
          venues!venue_id (
            id,
            name,
            city,
            image_url
          )
        `)
        .eq('account_id', user.id)
        .not('venue_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(5)
    ]);
    
    const { data: bookings, error, count } = bookingsQuery;
    const stats = statsQuery;
    const { data: recentVenueData } = recentVenues;
    
    if (error) {
      logger.error({ 
        error, 
        loader: 'bookings',
        params 
      }, 'Failed to load bookings');
      throw error;
    }
    
    // Transform data for Magic Patterns component
    const transformedBookings = transformBookingsList(bookings || []);
    
    // Calculate booking metrics
    const bookingMetrics = {
      totalBookings: count || 0,
      upcomingBookings: stats.filter(b => {
        // This is simplified - would need event dates to be accurate
        return b.status === 'confirmed' || b.status === 'pending';
      }).length,
      totalSpent: stats.reduce((sum, b) => {
        if (b.payment_status === 'paid_in_full' || b.payment_status === 'deposit_paid') {
          return sum + (Number(b.total_amount) || 0);
        }
        return sum;
      }, 0),
      statusBreakdown: stats.reduce((acc, b) => {
        if (b.status) {
          acc[b.status] = (acc[b.status] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
      paymentBreakdown: stats.reduce((acc, b) => {
        if (b.payment_status) {
          acc[b.payment_status] = (acc[b.payment_status] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
      averageBookingValue: count ? stats.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0) / count : 0,
    };
    
    // Get unique recent venues
    const uniqueRecentVenues = Array.from(
      new Map(
        (recentVenueData || [])
          .filter(item => item.venues)
          .map(item => [item.venue_id, item.venues])
      ).values()
    ).slice(0, 5);
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'bookings',
      duration,
      count: transformedBookings.length,
      totalCount: count,
      metrics: bookingMetrics
    }, '🎊 Bookings loaded - tickets to fun secured!');
    
    return {
      bookings: transformedBookings,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / params.limit),
        hasMore: count ? (offset + params.limit) < count : false,
      },
      filters: params,
      metrics: bookingMetrics,
      recentVenues: uniqueRecentVenues,
      user: {
        id: user.id,
        email: user.email,
      },
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'bookings',
      url: request.url 
    }, '😢 Error loading bookings - no tickets today');
    
    // Return empty state with error
    return {
      bookings: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
      filters: BookingsQuerySchema.parse({}),
      metrics: {
        totalBookings: 0,
        upcomingBookings: 0,
        totalSpent: 0,
        statusBreakdown: {},
        paymentBreakdown: {},
        averageBookingValue: 0,
      },
      recentVenues: [],
      user: null,
      error: error instanceof Error ? error.message : 'Failed to load bookings',
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: BookingsPage,
  transformData: (loaderData) => ({
    bookings: loaderData.bookings,
    pagination: loaderData.pagination,
    filters: loaderData.filters,
    metrics: loaderData.metrics,
    recentVenues: loaderData.recentVenues,
    user: loaderData.user,
    error: loaderData.error,
  }),
});

// SEO meta tags 🎯
export const meta = () => {
  return [
    { title: 'My Bookings - Manage Your Event Tickets | When The Fun' },
    { 
      name: 'description', 
      content: 'View and manage all your event bookings, tickets, and reservations. Track upcoming events, past experiences, and payment status.' 
    },
    { property: 'og:title', content: 'My Bookings - When The Fun' },
    { property: 'og:description', content: 'Your gateway to amazing experiences' },
    { property: 'og:type', content: 'website' },
  ];
};

// Cache headers for performance 🚀
export const headers = () => {
  return {
    'Cache-Control': 'private, max-age=0', // No caching for personal booking data
  };
};