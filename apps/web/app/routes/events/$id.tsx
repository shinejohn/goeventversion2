import React from 'react';
import type { Route } from './+types/$id';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

// Magic Patterns imports
import { EventDetailPage } from '~/components/magic-patterns/pages/EventDetailPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { transformEventData, transformPerformerData, transformVenueData } from '~/lib/magic-patterns/data-transformers';
import { getLogger } from '@kit/shared/logger';

/**
 * Event Detail Route - Experience the magic!
 * Shows full event information, venue details, performers, and booking options
 * 
 * Get ready for an amazing experience! 🎉✨
 */

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    const { id } = params;
    console.log('[LOADER DEBUG] events/$id starting, eventId:', id);
    logger.info({ loader: 'events/$id', eventId: id }, '🎯 Loading event details');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user for personalization
    const { data: { user } } = await client.auth.getUser();
    
    // Parallel data fetching for performance 🚀
    const [eventQuery, performersQuery, similarEventsQuery, bookingsQuery] = await Promise.all([
      // Main event data with venue info - comprehensive query for UI
      client
        .from('events')
        .select('*, venues!venue_id(*)')
        .eq('id', id)
        .single(),
      
      // Get performers for this event
      client
        .from('event_performers')
        .select('*, performer:performers!performer_id(*)')
        .eq('event_id', id),
      
      // Get similar events (same category, nearby dates)
      client
        .from('events')
        .select('*, venues!venue_id(*)')
        .eq('status', 'published')
        .neq('id', id)
        .limit(4),
      
      // Check if user has already booked this event
      user ? client
        .from('bookings')
        .select('id, status')
        .eq('event_id', id)
        .eq('account_id', user.id)
        .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);
    
    const { data: event, error: eventError } = eventQuery;
    const { data: eventPerformers } = performersQuery;
    const { data: similarEvents } = similarEventsQuery;
    const { data: userBooking } = bookingsQuery;
    
    if (eventError || !event) {
      logger.warn({ error: eventError, eventId: id }, 'Event not found');
      // Return null event data instead of throwing error
      return {
        event: null,
        performers: [],
        similarEvents: [],
        userBooking: null,
        metrics: {
          daysUntilEvent: 0,
          duration: 0,
          isUpcoming: false,
          isPast: true,
          isHappening: false,
          availableSpots: 0,
        },
        user: user ? {
          id: user.id,
          email: user.email,
        } : null,
      };
    }
    
    // Transform the event data
    const transformedEvent = transformEventData(event);
    
    // Transform performers
    const performers = eventPerformers?.map(ep => 
      ep.performer ? transformPerformerData(ep.performer) : null
    ).filter(Boolean) || [];
    
    // Transform similar events
    const transformedSimilarEvents = (similarEvents || []).map(transformEventData);
    
    // Calculate event metrics
    const eventMetrics = {
      daysUntilEvent: Math.ceil((new Date(event.start_datetime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      duration: Math.ceil((new Date(event.end_datetime || event.start_datetime).getTime() - new Date(event.start_datetime).getTime()) / (1000 * 60 * 60)),
      isUpcoming: new Date(event.start_datetime) > new Date(),
      isPast: new Date(event.end_datetime || event.start_datetime) < new Date(),
      isHappening: new Date() >= new Date(event.start_datetime) && new Date() <= new Date(event.end_datetime || event.start_datetime),
      availableSpots: event.max_capacity ? event.max_capacity - (event.current_attendees || 0) : null,
    };
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'events/$id',
      duration,
      eventId: id,
      performerCount: performers.length,
      metrics: eventMetrics,
    }, '🎊 Event details loaded successfully');
    
    // Count attendees (bookings) for this event
    const { count: attendeeCount } = await client
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', id)
      .eq('status', 'confirmed');
    
    return {
      event: transformedEvent,
      // event: {
      //   ...transformedEvent,
      //   venue: event.venues ? transformVenueData(event.venues) : null,
      //   // Additional fields EventDetailPage expects
      //   ticket_price: event.ticket_price || event.price_min,
      //   ticket_url: event.ticket_url,
      //   highlights: event.highlights || [],
      //   amenities: event.amenities || [],
      //   age_restriction: event.age_restrictions || 'All Ages',
      //   series: event.series_id ? { id: event.series_id, name: 'Event Series' } : null,
      //   organizer: {
      //     id: event.account_id || 'org-1',
      //     name: 'Event Organizer',
      //     verified: false,
      //     description: '',
      //     events: 1,
      //     followers: 0
      //   },
      // },
      performers,
      similarEvents: transformedSimilarEvents,
      userBooking,
      metrics: eventMetrics,
      attendeeCount: attendeeCount || 0,
      user: user ? {
        id: user.id,
        email: user.email,
      } : null,
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'events/$id',
      eventId: params.id,
      url: request.url 
    }, 'Error loading event details');
    
    // Return empty data instead of throwing
    return {
      event: null,
      performers: [],
      similarEvents: [],
      userBooking: null,
      metrics: {
        daysUntilEvent: 0,
        duration: 0,
        isUpcoming: false,
        isPast: true,
        isHappening: false,
        availableSpots: 0,
      },
      user: null,
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: EventDetailPage,
  transformData: (loaderData) => {
    console.log('[EventDetailRoute] Loader data:', loaderData);
    console.log('[EventDetailRoute] Event data:', loaderData.event);
    return {
      event: loaderData.event,
      // relatedEvents: loaderData.similarEvents,
      // attendeeCount: loaderData.attendeeCount,
    };
  },
});

// SEO meta tags 🎯
export const meta = ({ data }: Route.MetaArgs) => {
  const event = data?.event;
  
  if (!event) {
    return [{ title: 'Event Not Found | When The Fun' }];
  }
  
  return [
    { title: `${event.title} | When The Fun` },
    { 
      name: 'description', 
      content: event.description || `Experience ${event.title} - an amazing event you won't want to miss!` 
    },
    { property: 'og:title', content: event.title },
    { property: 'og:description', content: event.description || 'Join us for this incredible event!' },
    { property: 'og:type', content: 'event' },
    { property: 'og:image', content: event.imageUrl || '/default-event.jpg' },
    { property: 'event:start_time', content: event.startDate },
    { property: 'event:end_time', content: event.endDate },
  ];
};

// Cache headers 🚀
export const headers = () => {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=3600', // 5 min client, 1 hour CDN
  };
};