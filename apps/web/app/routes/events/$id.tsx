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
    
    // Handle fallback IDs (event-1, event-2, etc.) by mapping to actual events
    let actualEventId = id;
    let eventIndex = null;
    
    if (id.startsWith('event-')) {
      eventIndex = parseInt(id.replace('event-', '')) - 1;
      console.log('[LOADER DEBUG] Fallback ID detected, eventIndex:', eventIndex);
    }
    
    // Parallel data fetching for performance 🚀
    const [eventQuery, performersQuery, similarEventsQuery, bookingsQuery] = await Promise.all([
      // Main event data with venue info - handle fallback IDs
      eventIndex !== null 
        ? client
            .from('events')
            .select('*, venues!venue_id(*)')
            .order('created_at', { ascending: false })
            .range(eventIndex, eventIndex)
            .single()
        : client
            .from('events')
            .select('*, venues!venue_id(*)')
            .eq('id', id)
            .single(),
      
      // Get performers for this event (will be updated after we get the event)
      Promise.resolve({ data: [] }),
      
      // Get similar events (same category, nearby dates)
      client
        .from('events')
        .select('*, venues!venue_id(*)')
        .neq('id', actualEventId)
        .limit(4),
      
      // Check if user has already booked this event
      user ? client
        .from('bookings')
        .select('id, status')
        .eq('event_id', actualEventId)
        .eq('account_id', user.id)
        .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);
    
    const { data: event, error: eventError } = eventQuery;
    const { data: similarEvents } = similarEventsQuery;
    const { data: userBooking } = bookingsQuery;
    
    if (eventError || !event) {
      logger.warn({ error: eventError, eventId: id }, 'Event not found, generating mock data');
      
      // Generate mock event data for fallback IDs
      const mockEvents = [
        {
          id: 'event-1',
          title: 'Jazz Night with The Midnight Quartet',
          description: 'Experience an unforgettable evening of smooth jazz with The Midnight Quartet. Featuring classic standards and original compositions, this intimate performance promises to transport you to another era.',
          start_datetime: '2025-02-15T20:00:00Z',
          end_datetime: '2025-02-15T23:00:00Z',
          location_name: 'The Grand Theater',
          city: 'Tampa',
          state: 'FL',
          category: 'music',
          ticket_price: 45,
          is_free: false,
          image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          max_capacity: 200,
          current_attendees: 45,
          venues: {
            id: 'venue-1',
            name: 'The Grand Theater',
            address: '123 Main Street, Tampa, FL 33601',
            capacity: 200
          }
        },
        {
          id: 'event-2',
          title: 'DJ Phoenix Electronic Night',
          description: 'Get ready for an electrifying night of electronic music with DJ Phoenix. Featuring the latest in EDM, house, and techno, this high-energy event will keep you dancing all night long.',
          start_datetime: '2025-02-18T22:00:00Z',
          end_datetime: '2025-02-19T02:00:00Z',
          location_name: 'Sunset Beach Pavilion',
          city: 'Tampa',
          state: 'FL',
          category: 'music',
          ticket_price: 25,
          is_free: false,
          image_url: 'https://images.unsplash.com/photo-1571266028243-e4732e8c4a4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          max_capacity: 150,
          current_attendees: 78,
          venues: {
            id: 'venue-2',
            name: 'Sunset Beach Pavilion',
            address: '456 Beach Road, Tampa, FL 33602',
            capacity: 150
          }
        },
        {
          id: 'event-3',
          title: 'Sarah Chen Violin Recital',
          description: 'Join us for an intimate classical music experience with renowned violinist Sarah Chen. Featuring works by Bach, Vivaldi, and contemporary composers, this recital showcases the beauty and power of the violin.',
          start_datetime: '2025-02-20T19:30:00Z',
          end_datetime: '2025-02-20T21:30:00Z',
          location_name: 'Venue 5',
          city: 'Tampa',
          state: 'FL',
          category: 'music',
          ticket_price: 35,
          is_free: false,
          image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          max_capacity: 100,
          current_attendees: 23,
          venues: {
            id: 'venue-3',
            name: 'Venue 5',
            address: '789 Arts District, Tampa, FL 33603',
            capacity: 100
          }
        }
      ];
      
      // Get the mock event based on the ID
      const mockEvent = mockEvents.find(e => e.id === id) || mockEvents[0];
      
      // Transform the mock event data
      const transformedEvent = transformEventData(mockEvent);
      
      return {
        event: transformedEvent,
        performers: [],
        similarEvents: mockEvents.slice(0, 3).map(transformEventData),
        userBooking: null,
        metrics: {
          daysUntilEvent: Math.ceil((new Date(mockEvent.start_datetime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
          duration: Math.ceil((new Date(mockEvent.end_datetime).getTime() - new Date(mockEvent.start_datetime).getTime()) / (1000 * 60 * 60)),
          isUpcoming: new Date(mockEvent.start_datetime) > new Date(),
          isPast: new Date(mockEvent.end_datetime) < new Date(),
          isHappening: new Date() >= new Date(mockEvent.start_datetime) && new Date() <= new Date(mockEvent.end_datetime),
          availableSpots: mockEvent.max_capacity - mockEvent.current_attendees,
        },
        user: user ? {
          id: user.id,
          email: user.email,
        } : null,
      };
    }
    
    // Update actualEventId with the real event ID
    actualEventId = event.id;
    
    // Now fetch performers for the actual event
    const { data: eventPerformers } = await client
      .from('event_performers')
      .select('*, performer:performers!performer_id(*)')
      .eq('event_id', actualEventId);
    
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
      .eq('event_id', actualEventId)
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