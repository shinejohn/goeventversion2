import React from 'react';
import type { Route } from './+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';

// Magic Patterns imports
import { CalendarPage } from '~/components/magic-patterns/pages/CalendarPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { transformEventsList, transformBookingsList } from '~/lib/magic-patterns/data-transformers';
import { getLogger } from '@kit/shared/logger';

/**
 * Calendars Route - Your personal event timeline!
 * View all your events, bookings, and schedules in one place
 * 
 * Time to organize the fun! 📅✨
 */

// Query parameter schema for calendar view
const CalendarsQuerySchema = z.object({
  view: z.enum(['month', 'week', 'day', 'list']).optional().default('month'),
  date: z.string().optional(), // ISO date string for current view
  filter: z.enum(['all', 'events', 'bookings', 'performances']).optional().default('all'),
  category: z.string().optional(),
  venueId: z.string().uuid().optional(),
  performerId: z.string().uuid().optional(),
  search: z.string().max(100).optional().default(''),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const params = CalendarsQuerySchema.parse(queryParams);
    
    logger.info({ 
      loader: 'calendars',
      params 
    }, '📅 Loading calendar - organizing the fun!');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Calculate date range based on view
    const viewDate = params.date ? new Date(params.date) : new Date();
    const { startDate, endDate } = getDateRange(viewDate, params.view);
    
    // Parallel data fetching for all calendar items 🚀
    const [eventsQuery, bookingsQuery, performancesQuery] = await Promise.all([
      // Get public events user might be interested in
      (params.filter === 'all' || params.filter === 'events') ? 
        client
          .from('events')
          .select(`
            *,
            venues!venue_id (
              id,
              name,
              address,
              city
            )
          `)
          .eq('status', 'published')
          .gte('start_date', startDate.toISOString())
          .lte('start_date', endDate.toISOString())
          .order('start_date', { ascending: true })
        : Promise.resolve({ data: [] }),
      
      // Get user's bookings
      (params.filter === 'all' || params.filter === 'bookings') ?
        client
          .from('bookings')
          .select(`
            *,
            events!event_id (
              id,
              title,
              category,
              image_url
            ),
            venues!venue_id (
              id,
              name,
              address
            ),
            performers!performer_id (
              id,
              stage_name
            )
          `)
          .eq('account_id', user.id)
          .in('status', ['confirmed', 'pending'])
          .gte('event_date', startDate.toISOString())
          .lte('event_date', endDate.toISOString())
          .order('event_date', { ascending: true })
        : Promise.resolve({ data: [] }),
      
      // Get user's performances (if they're a performer)
      (params.filter === 'all' || params.filter === 'performances') ?
        client
          .from('bookings')
          .select(`
            *,
            events!event_id (
              id,
              title,
              category,
              image_url
            ),
            venues!venue_id (
              id,
              name,
              address
            )
          `)
          .eq('performer_id', user.id) // If user is a performer
          .in('status', ['confirmed', 'pending'])
          .gte('event_date', startDate.toISOString())
          .lte('event_date', endDate.toISOString())
          .order('event_date', { ascending: true })
        : Promise.resolve({ data: [] }),
    ]);
    
    const { data: events } = eventsQuery;
    const { data: bookings } = bookingsQuery;
    const { data: performances } = performancesQuery;
    
    // Transform all calendar items into a unified format
    const calendarItems = [
      // Transform events
      ...(events || []).map(event => ({
        id: event.id,
        type: 'event' as const,
        title: event.title,
        description: event.description,
        startDate: event.start_date,
        endDate: event.end_date,
        location: event.venues ? {
          name: event.venues.name,
          address: event.venues.address,
          city: event.venues.city,
        } : null,
        category: event.category,
        imageUrl: event.image_url,
        status: event.status,
        isUserEvent: false,
      })),
      
      // Transform bookings
      ...(bookings || []).map(booking => ({
        id: booking.id,
        type: 'booking' as const,
        title: booking.events?.title || 'Booking',
        description: `Booking #${booking.booking_number}`,
        startDate: `${booking.event_date}T${booking.start_time}`,
        endDate: `${booking.event_date}T${booking.end_time}`,
        location: booking.venues ? {
          name: booking.venues.name,
          address: booking.venues.address,
          city: '',
        } : null,
        category: booking.events?.category,
        imageUrl: booking.events?.image_url,
        status: booking.status,
        isUserEvent: true,
        bookingDetails: {
          guestCount: booking.guest_count,
          totalAmount: booking.total_amount,
          paymentStatus: booking.payment_status,
        },
      })),
      
      // Transform performances
      ...(performances || []).map(performance => ({
        id: performance.id,
        type: 'performance' as const,
        title: `Performance: ${performance.events?.title || 'Event'}`,
        description: `Performing at ${performance.venues?.name}`,
        startDate: `${performance.event_date}T${performance.start_time}`,
        endDate: `${performance.event_date}T${performance.end_time}`,
        location: performance.venues ? {
          name: performance.venues.name,
          address: performance.venues.address,
          city: '',
        } : null,
        category: performance.events?.category,
        imageUrl: performance.events?.image_url,
        status: performance.status,
        isUserEvent: true,
        performanceDetails: {
          venue: performance.venues?.name,
          totalAmount: performance.total_amount,
        },
      })),
    ];
    
    // Apply additional filters
    let filteredItems = calendarItems;
    
    if (params.category) {
      filteredItems = filteredItems.filter(item => item.category === params.category);
    }
    
    if (params.search) {
      filteredItems = filteredItems.filter(item => 
        item.title.toLowerCase().includes(params.search.toLowerCase()) ||
        item.description?.toLowerCase().includes(params.search.toLowerCase())
      );
    }
    
    // Sort by date
    filteredItems.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    // Calculate calendar metrics
    const calendarMetrics = {
      totalItems: filteredItems.length,
      eventCount: filteredItems.filter(i => i.type === 'event').length,
      bookingCount: filteredItems.filter(i => i.type === 'booking').length,
      performanceCount: filteredItems.filter(i => i.type === 'performance').length,
      todayCount: filteredItems.filter(i => {
        const itemDate = new Date(i.startDate).toDateString();
        return itemDate === new Date().toDateString();
      }).length,
      upcomingThisWeek: filteredItems.filter(i => {
        const itemDate = new Date(i.startDate);
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return itemDate <= weekFromNow && itemDate >= new Date();
      }).length,
    };
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'calendars',
      duration,
      itemCount: filteredItems.length,
      dateRange: { startDate, endDate },
      metrics: calendarMetrics
    }, '📆 Calendar loaded - time to party!');
    
    return {
      calendarItems: filteredItems,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        current: viewDate.toISOString(),
      },
      filters: params,
      metrics: calendarMetrics,
      user: {
        id: user.id,
        email: user.email,
      },
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'calendars',
      url: request.url 
    }, '😔 Error loading calendar - time got away from us');
    
    // Return empty state with error
    return {
      calendarItems: [],
      dateRange: {
        start: new Date().toISOString(),
        end: new Date().toISOString(),
        current: new Date().toISOString(),
      },
      filters: CalendarsQuerySchema.parse({}),
      metrics: {
        totalItems: 0,
        eventCount: 0,
        bookingCount: 0,
        performanceCount: 0,
        todayCount: 0,
        upcomingThisWeek: 0,
      },
      user: null,
      error: error instanceof Error ? error.message : 'Failed to load calendar',
    };
  }
};

// Helper function to calculate date range based on view
function getDateRange(date: Date, view: string) {
  const startDate = new Date(date);
  const endDate = new Date(date);
  
  switch (view) {
    case 'day':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
      
    case 'week':
      const dayOfWeek = startDate.getDay();
      startDate.setDate(startDate.getDate() - dayOfWeek);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(endDate.getDate() + (6 - dayOfWeek));
      endDate.setHours(23, 59, 59, 999);
      break;
      
    case 'month':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(endDate.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
      
    case 'list':
      // Show next 30 days
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(endDate.getDate() + 30);
      endDate.setHours(23, 59, 59, 999);
      break;
  }
  
  return { startDate, endDate };
}

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: CalendarPage,
  transformData: (loaderData) => ({
    calendarItems: loaderData.calendarItems,
    dateRange: loaderData.dateRange,
    filters: loaderData.filters,
    metrics: loaderData.metrics,
    user: loaderData.user,
    error: loaderData.error,
  }),
});

// SEO meta tags 🎯
export const meta = () => {
  return [
    { title: 'My Calendar - Track Events & Bookings | When The Fun' },
    { 
      name: 'description', 
      content: 'View all your upcoming events, bookings, and performances in one calendar. Never miss an event with your personalized schedule.' 
    },
    { property: 'og:title', content: 'My Calendar - When The Fun' },
    { property: 'og:description', content: 'Your personalized event calendar' },
    { property: 'og:type', content: 'website' },
  ];
};

// Cache headers for performance 🚀
export const headers = () => {
  return {
    'Cache-Control': 'private, max-age=0', // No caching for personal calendar data
  };
};