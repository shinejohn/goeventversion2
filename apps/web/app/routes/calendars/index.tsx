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
    
    // Get current user (optional for public calendar view)
    const { data: { user } } = await client.auth.getUser();
    
    // Calculate date range based on view
    const viewDate = params.date ? new Date(params.date) : new Date();
    const { startDate, endDate } = getDateRange(viewDate, params.view);
    
    // Try to fetch real events from database first
    const { data: dbEvents, error: dbError } = await client
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
      .order('start_date', { ascending: true });
    
    let calendarItems = [];
    
    if (!dbError && dbEvents && dbEvents.length > 0) {
      console.log('✅ Loaded', dbEvents.length, 'events from database');
      // Transform real events
      calendarItems = dbEvents.map(event => ({
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
      }));
    } else {
      console.log('📝 Using mock data - database events not available:', dbError?.message);
      
      // Fallback to mock data
      const mockEvents = [
        {
          id: '1',
          type: 'event' as const,
          title: 'Jazz Night at The Blue Note',
          description: 'An evening of smooth jazz with local musicians',
          startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours later
          location: {
            name: 'The Blue Note',
            address: '123 Music Street',
            city: 'New York'
          },
          category: 'music',
          imageUrl: 'https://picsum.photos/seed/jazz1/400/300',
          status: 'published',
          isUserEvent: false,
        },
        {
          id: '2',
          type: 'event' as const,
          title: 'Comedy Show at Laugh Factory',
          description: 'Stand-up comedy night with top local comedians',
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
          location: {
            name: 'Laugh Factory',
            address: '456 Comedy Lane',
            city: 'New York'
          },
          category: 'comedy',
          imageUrl: 'https://picsum.photos/seed/comedy1/400/300',
          status: 'published',
          isUserEvent: false,
        },
        {
          id: '3',
          type: 'event' as const,
          title: 'Art Gallery Opening',
          description: 'Contemporary art exhibition opening night',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours later
          location: {
            name: 'Modern Art Gallery',
            address: '789 Art Avenue',
            city: 'New York'
          },
          category: 'art',
          imageUrl: 'https://picsum.photos/seed/art1/400/300',
          status: 'published',
          isUserEvent: false,
        }
      ];
      
      calendarItems = mockEvents;
      console.log('✅ Loaded', mockEvents.length, 'mock events');
    }
    
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
      bookingCount: 0,
      performanceCount: 0,
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
      user: user ? {
        id: user.id,
        email: user.email,
      } : null,
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