import React from 'react';
import type { Route } from '~/types/app/routes/my/calendar';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';

// Magic Patterns imports
import MyCalendar from '~/components/magic-patterns/pages/my/calendar';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * My Calendar Route - Personal event calendar and scheduling
 * Social calendar features for managing personal events and social activities
 * 
 * Let's organize that social life! 📅✨
 */

// Query parameter schema for calendar views and filters
const CalendarQuerySchema = z.object({
  view: z.enum(['month', 'week', 'day', 'list']).optional().default('month'),
  date: z.string().optional(), // ISO date string for calendar navigation
  category: z.enum(['music', 'food-drink', 'arts', 'entertainment', 'community', 'sports', 'business']).optional(),
  reminder: z.enum(['all', 'set', 'unset']).optional().default('all'),
  attending: z.enum(['all', 'going', 'maybe', 'not-going']).optional().default('all'),
  visibility: z.enum(['all', 'public', 'friends', 'private']).optional().default('all'),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const params = CalendarQuerySchema.parse(queryParams);
    
    logger.info({ 
      loader: 'my-calendar',
      params 
    }, '📅 Loading personal calendar - time to get social!');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user for personal calendar
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Determine date range based on view
    const baseDate = params.date ? new Date(params.date) : new Date();
    let startDate: Date;
    let endDate: Date;
    
    switch (params.view) {
      case 'month':
        startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
        endDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
        break;
      case 'week':
        const weekStart = new Date(baseDate);
        weekStart.setDate(baseDate.getDate() - baseDate.getDay());
        startDate = weekStart;
        endDate = new Date(weekStart);
        endDate.setDate(weekStart.getDate() + 6);
        break;
      case 'day':
        startDate = new Date(baseDate);
        endDate = new Date(baseDate);
        break;
      default:
        // List view - show next 3 months
        startDate = new Date();
        endDate = new Date();
        endDate.setMonth(startDate.getMonth() + 3);
        break;
    }
    
    // Parallel data fetching for optimal performance 🚀
    const [userEventsQuery, friendsEventsQuery, sharedCalendarsQuery, remindersQuery] = await Promise.all([
      // Personal events (bookings, created events, etc.)
      client
        .from('bookings')
        .select(`
          *,
          events!event_id (
            id,
            title,
            start_date,
            end_date,
            category,
            image_url,
            venues!venue_id (
              name,
              address,
              city
            )
          )
        `)
        .eq('account_id', user.id)
        .gte('event_date', startDate.toISOString())
        .lte('event_date', endDate.toISOString())
        .order('event_date', { ascending: true }),
        
      // Events from friends' calendars that user is invited to
      client
        .from('calendar_shares')
        .select(`
          *,
          events!event_id (
            id,
            title,
            start_date,
            end_date,
            category,
            image_url,
            created_by,
            accounts!created_by (
              name,
              picture_url
            )
          )
        `)
        .eq('shared_with_user_id', user.id)
        .eq('status', 'accepted')
        .gte('events.start_date', startDate.toISOString())
        .lte('events.start_date', endDate.toISOString()),
        
      // User's shared calendars
      client
        .from('shared_calendars')
        .select('*')
        .eq('created_by', user.id),
        
      // Event reminders
      client
        .from('event_reminders')
        .select('*')
        .eq('user_id', user.id)
        .gte('remind_at', startDate.toISOString())
        .lte('remind_at', endDate.toISOString())
    ]);
    
    const { data: userEvents, error: userEventsError } = userEventsQuery;
    const { data: friendsEvents, error: friendsEventsError } = friendsEventsQuery;
    const { data: sharedCalendars, error: sharedCalendarsError } = sharedCalendarsQuery;
    const { data: reminders, error: remindersError } = remindersQuery;
    
    if (userEventsError) {
      logger.error({ error: userEventsError }, 'Failed to load user events');
    }
    
    // Transform and combine all calendar data
    const allEvents = [
      ...(userEvents || []).map(booking => ({
        id: booking.id,
        title: booking.events?.title || 'Unnamed Event',
        date: new Date(booking.event_date),
        startTime: booking.events?.start_date ? new Date(booking.events.start_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '00:00',
        endTime: booking.events?.end_date ? new Date(booking.events.end_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '23:59',
        location: booking.events?.venues?.name || 'Unknown Venue',
        address: booking.events?.venues ? `${booking.events.venues.address}, ${booking.events.venues.city}` : '',
        category: booking.events?.category || 'other',
        type: 'personal',
        status: booking.status,
        reminder: reminders?.some(r => r.event_id === booking.event_id) || false,
        imageUrl: booking.events?.image_url,
        attending: 0, // Will be calculated from social data
      })),
      ...(friendsEvents || []).map(share => ({
        id: share.events?.id || share.id,
        title: share.events?.title || 'Friend\'s Event',
        date: new Date(share.events?.start_date || Date.now()),
        startTime: share.events?.start_date ? new Date(share.events.start_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '00:00',
        endTime: share.events?.end_date ? new Date(share.events.end_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '23:59',
        location: 'Shared Event',
        address: '',
        category: share.events?.category || 'social',
        type: 'shared',
        status: 'confirmed',
        reminder: false,
        imageUrl: share.events?.image_url,
        attending: 1, // Friend who shared it
        sharedBy: share.events?.accounts?.name || 'A friend',
      }))
    ];
    
    // Apply filters
    let filteredEvents = allEvents;
    
    if (params.category) {
      filteredEvents = filteredEvents.filter(event => event.category === params.category);
    }
    
    if (params.reminder !== 'all') {
      filteredEvents = filteredEvents.filter(event => 
        params.reminder === 'set' ? event.reminder : !event.reminder
      );
    }
    
    if (params.attending !== 'all') {
      filteredEvents = filteredEvents.filter(event => {
        // This would be more complex with real social data
        return true; // For now, show all
      });
    }
    
    // Calculate calendar metrics
    const calendarMetrics = {
      totalEvents: filteredEvents.length,
      upcomingEvents: filteredEvents.filter(e => e.date >= new Date()).length,
      todayEvents: filteredEvents.filter(e => {
        const today = new Date();
        return e.date.toDateString() === today.toDateString();
      }).length,
      remindersSet: filteredEvents.filter(e => e.reminder).length,
      friendsEvents: filteredEvents.filter(e => e.type === 'shared').length,
      categoriesCount: [...new Set(filteredEvents.map(e => e.category))].length,
    };
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'my-calendar',
      duration,
      eventCount: filteredEvents.length,
      metrics: calendarMetrics
    }, '📅 Personal calendar loaded - ready to socialize!');
    
    return {
      events: filteredEvents,
      view: params.view,
      currentDate: baseDate.toISOString(),
      filters: params,
      metrics: calendarMetrics,
      sharedCalendars: sharedCalendars || [],
      user: {
        id: user.id,
        email: user.email,
      },
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'my-calendar',
      url: request.url 
    }, '😢 Error loading calendar - no social plans today');
    
    // Return empty state with error
    return {
      events: [],
      view: 'month' as const,
      currentDate: new Date().toISOString(),
      filters: CalendarQuerySchema.parse({}),
      metrics: {
        totalEvents: 0,
        upcomingEvents: 0,
        todayEvents: 0,
        remindersSet: 0,
        friendsEvents: 0,
        categoriesCount: 0,
      },
      sharedCalendars: [],
      user: null,
      error: error instanceof Error ? error.message : 'Failed to load calendar',
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: MyCalendar,
  transformData: (loaderData) => ({
    events: loaderData.events,
    view: loaderData.view,
    currentDate: loaderData.currentDate,
    filters: loaderData.filters,
    metrics: loaderData.metrics,
    sharedCalendars: loaderData.sharedCalendars,
    user: loaderData.user,
    error: loaderData.error,
  }),
});

// SEO meta tags 🎯
export const meta = () => {
  return [
    { title: 'My Calendar - Manage Your Social Events | When The Fun' },
    { 
      name: 'description', 
      content: 'Organize your personal event calendar, manage reminders, and coordinate social activities with friends.' 
    },
    { property: 'og:title', content: 'My Calendar - When The Fun' },
    { property: 'og:description', content: 'Your personal social event calendar' },
    { property: 'og:type', content: 'website' },
  ];
};

// Cache headers for performance 🚀
export const headers = () => {
  return {
    'Cache-Control': 'private, max-age=0', // No caching for personal calendar data
  };
};