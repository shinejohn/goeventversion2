import React from 'react';
import { useLoaderData, Link } from 'react-router';
import type { Route } from './+types/$id';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

// Magic Patterns imports
import { EventDetailPage } from '~/components/magic-patterns/pages/EventDetailPage';
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
    
  // First, get the main event data
  console.log('[EVENT LOADER DEBUG] Starting event query for ID:', id);
  
  const { data: event, error: eventError } = await client
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
  
  console.log('[EVENT LOADER DEBUG] Event query result:', { event, eventError });
  
  // If no event found, try to find any event to test the query
  if (!event) {
    console.log('[EVENT LOADER DEBUG] No event found, testing with any event...');
    const { data: anyEvent } = await client
      .from('events')
      .select('id, title')
      .limit(1);
    console.log('[EVENT LOADER DEBUG] Any event found:', anyEvent);
  }
    
    // Get similar events (simplified query)
    const { data: similarEvents } = await client
      .from('events')
      .select('id, title, start_datetime, end_datetime, image_url, category, location_name')
      .neq('id', id)
      .limit(4);
    
    // Check if user has already booked this event
    const { data: userBooking } = user ? await client
      .from('bookings')
      .select('id, status')
      .eq('event_id', id)
      .eq('account_id', user.id)
      .maybeSingle() : { data: null };
    
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
    
    // Get venue data for this event
    let venue = null;
    if (event.venue_id) {
      const { data: venueData } = await client
        .from('venues')
        .select('*')
        .eq('id', event.venue_id)
        .single();
      venue = venueData;
    }
    
    // Add venue data to event
    const eventWithVenue = {
      ...event,
      venue: venue
    };
    
    // Fetch performers for this event using real relationships
    const { data: eventPerformersData } = await client
      .from('event_performers')
      .select(`
        *,
        performer:performers(*)
      `)
      .eq('event_id', id);
    
    // Extract performers from the relationships
    let eventPerformers: any[] = [];
    if (eventPerformersData && eventPerformersData.length > 0) {
      eventPerformers = eventPerformersData
        .map(ep => ep.performer)
        .filter(performer => performer); // Remove any null performers
    }
    
    // Transform the event data
    console.log('🔍 DEBUG: Event data before transformation:', {
      id: eventWithVenue.id,
      title: eventWithVenue.title,
      status: eventWithVenue.status,
      hasVenue: !!eventWithVenue.venues
    });
    
    const transformedEvent = transformEventData(eventWithVenue);
    
    console.log('🔍 DEBUG: Event data after transformation:', {
      id: transformedEvent.id,
      name: transformedEvent.name,
      status: transformedEvent.status
    });
    
    // Transform performers
    const performers = eventPerformers.map(performer => 
      transformPerformerData(performer)
    );
    
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

// Restore the proper EventDetailPage component
export default function EventDetailRoute() {
  const data = useLoaderData<typeof loader>();
  
  if (!data.event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-8">The event you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/events" 
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse All Events
          </Link>
        </div>
      </div>
    );
  }

  return <EventDetailPage event={data.event} relatedEvents={data.similarEvents} attendeeCount={data.attendeeCount} />;
}

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