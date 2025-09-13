import React from 'react';
import { useLoaderData, Link } from 'react-router';
import type { Route } from './+types/$id';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

// Simple imports for now
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
    
    // Simple event data structure for now
    console.log('🔍 DEBUG: Event data:', {
      id: eventWithVenue.id,
      title: eventWithVenue.title,
      status: eventWithVenue.status,
      hasVenue: !!eventWithVenue.venues
    });
    
    const eventData = {
      id: eventWithVenue.id,
      title: eventWithVenue.title,
      description: eventWithVenue.description || '',
      startDate: eventWithVenue.start_datetime,
      endDate: eventWithVenue.end_datetime,
      category: eventWithVenue.category || 'other',
      status: eventWithVenue.status || 'draft',
      image: eventWithVenue.image_url,
      price: eventWithVenue.ticket_price || eventWithVenue.price_min || 0,
      capacity: eventWithVenue.max_capacity || 0,
      venue: eventWithVenue.venues ? {
        id: eventWithVenue.venues.id,
        name: eventWithVenue.venues.name,
        address: eventWithVenue.venues.address,
        city: eventWithVenue.venues.city
      } : null
    };
    
    // Simple performers data
    const performers = eventPerformers.map(performer => ({
      id: performer.id,
      stage_name: performer.stage_name,
      genre: performer.genre,
      bio: performer.bio
    }));
    
    // Simple similar events
    const similarEventsData = (similarEvents || []).map(event => ({
      id: event.id,
      title: event.title,
      startDate: event.start_datetime,
      image: event.image_url
    }));
    
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
      event: eventData,
      performers,
      similarEvents: similarEventsData,
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{data.event.title}</h1>
        <p className="text-gray-600 mb-6">{data.event.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            <div className="space-y-2">
              <p><strong>Date:</strong> {new Date(data.event.startDate).toLocaleDateString()}</p>
              <p><strong>Category:</strong> {data.event.category}</p>
              <p><strong>Price:</strong> ${data.event.price}</p>
              <p><strong>Capacity:</strong> {data.event.capacity}</p>
              {data.event.venue && (
                <div>
                  <p><strong>Venue:</strong> {data.event.venue.name}</p>
                  <p><strong>Address:</strong> {data.event.venue.address}</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Performers</h2>
            {data.performers.length > 0 ? (
              <div className="space-y-2">
                {data.performers.map(performer => (
                  <div key={performer.id} className="border p-3 rounded">
                    <p><strong>{performer.stage_name}</strong></p>
                    <p className="text-sm text-gray-600">{performer.genre}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No performers listed</p>
            )}
          </div>
        </div>
        
        {data.similarEvents.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Similar Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.similarEvents.map(event => (
                <div key={event.id} className="border p-4 rounded">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">{new Date(event.startDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
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