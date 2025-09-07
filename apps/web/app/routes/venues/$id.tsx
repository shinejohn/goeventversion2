import React from 'react';
import type { Route } from './+types/$id';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
// import { notFound } from 'react-router'; // React Router 7 doesn't export notFound

// Magic Patterns imports
import { VenueDetailPage } from '~/components/magic-patterns/pages/venues/VenueDetailPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { transformVenueData, transformEventData } from '~/lib/magic-patterns/data-transformers';
import { getLogger } from '@kit/shared/logger';

/**
 * Venue Detail Route - Discover amazing spaces!
 * Shows venue information, amenities, upcoming events, and booking options
 * 
 * Find your perfect venue! 🏛️✨
 */

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    const { id } = params;
    logger.info({ loader: 'venues/$id', venueId: id }, '🏛️ Loading venue details');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user for personalization
    const { data: { user } } = await client.auth.getUser();
    
    // Parallel data fetching for performance 🚀
    const [venueQuery, eventsQuery, similarVenuesQuery, bookingsCountQuery] = await Promise.all([
      // Main venue data
      client
        .from('venues')
        .select('*')
        .eq('id', id)
        .single(),
      
      // Upcoming events at this venue
      client
        .from('events')
        .select(`
          *,
          performers:event_performers(
            performer:performers!performer_id(
              id,
              stage_name,
              profile_image_url
            )
          )
        `)
        .eq('venue_id', id)
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(6),
      
      // Similar venues (same type, nearby location)
      client
        .from('venues')
        .select('*')
        .eq('is_active', true)
        .neq('id', id)
        .limit(4),
      
      // Get total bookings count for this venue
      client
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('venue_id', id)
        .in('status', ['confirmed', 'completed']),
    ]);
    
    const { data: venue, error: venueError } = venueQuery;
    const { data: upcomingEvents } = eventsQuery;
    const { data: similarVenues } = similarVenuesQuery;
    const { count: totalBookings } = bookingsCountQuery;
    
    if (venueError || !venue) {
      logger.error({ error: venueError, venueId: id }, 'Venue not found');
      throw new Response('Venue not found', { status: 404 });
    }
    
    // Transform the venue data
    const transformedVenue = transformVenueData(venue);
    
    // Transform upcoming events
    const transformedEvents = (upcomingEvents || []).map(event => ({
      ...transformEventData(event),
      performers: event.performers?.map(p => p.performer).filter(Boolean) || [],
    }));
    
    // Transform similar venues
    const transformedSimilarVenues = (similarVenues || []).map(transformVenueData);
    
    // Calculate venue metrics
    const venueMetrics = {
      totalBookings: totalBookings || 0,
      occupancyRate: calculateOccupancyRate(venue, upcomingEvents?.length || 0),
      popularDays: getPopularDays(upcomingEvents || []),
      averageEventDuration: calculateAverageEventDuration(upcomingEvents || []),
      upcomingEventsCount: upcomingEvents?.length || 0,
      isAvailableNow: checkAvailability(venue),
    };
    
    // Format operating hours for display
    const operatingHours = formatOperatingHours(venue.operating_hours);
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'venues/$id',
      duration,
      venueId: id,
      upcomingEvents: transformedEvents.length,
      metrics: venueMetrics,
    }, '🎪 Venue details loaded successfully');
    
    return {
      venue: transformedVenue,
      upcomingEvents: transformedEvents,
      similarVenues: transformedSimilarVenues,
      metrics: venueMetrics,
      operatingHours,
      user: user ? {
        id: user.id,
        email: user.email,
      } : null,
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'venues/$id',
      venueId: params.id,
      url: request.url 
    }, 'Error loading venue details');
    
    if (error instanceof Response) {
      throw error;
    }
    
    throw new Response('Venue not found', { status: 404 });
  }
};

// Helper functions
function calculateOccupancyRate(venue: any, upcomingEventsCount: number): number {
  // Simple calculation based on upcoming events
  const daysInMonth = 30;
  const eventsPerDay = upcomingEventsCount / daysInMonth;
  return Math.min(eventsPerDay * 100, 100);
}

function getPopularDays(events: any[]): string[] {
  const dayCounts = events.reduce((acc, event) => {
    const day = new Date(event.start_date).toLocaleDateString('en-US', { weekday: 'long' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(dayCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([day]) => day);
}

function calculateAverageEventDuration(events: any[]): number {
  if (events.length === 0) return 0;
  
  const totalDuration = events.reduce((sum, event) => {
    const start = new Date(event.start_date).getTime();
    const end = new Date(event.end_date || event.start_date).getTime();
    return sum + (end - start);
  }, 0);
  
  return totalDuration / events.length / (1000 * 60 * 60); // Convert to hours
}

function checkAvailability(venue: any): boolean {
  if (!venue.is_active) return false;
  
  const now = new Date();
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const currentTime = now.toTimeString().slice(0, 5);
  
  const hours = venue.operating_hours?.[dayOfWeek];
  if (!hours || !hours.open || !hours.close) return true; // Assume available if no hours set
  
  return currentTime >= hours.open && currentTime <= hours.close;
}

function formatOperatingHours(hours: any): Array<{ day: string; hours: string }> {
  if (!hours) return [];
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  return days.map(day => {
    const dayHours = hours[day];
    if (!dayHours || !dayHours.open || !dayHours.close) {
      return { day: day.charAt(0).toUpperCase() + day.slice(1), hours: 'Closed' };
    }
    
    return {
      day: day.charAt(0).toUpperCase() + day.slice(1),
      hours: `${formatTime(dayHours.open)} - ${formatTime(dayHours.close)}`,
    };
  });
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: VenueDetailPage,
  transformData: (loaderData) => ({
    venue: loaderData.venue,
    upcomingEvents: loaderData.upcomingEvents,
    similarVenues: loaderData.similarVenues,
    metrics: loaderData.metrics,
    operatingHours: loaderData.operatingHours,
    user: loaderData.user,
  }),
});

// SEO meta tags 🎯
export const meta = ({ data }: Route.MetaArgs) => {
  const venue = data?.venue;
  
  if (!venue) {
    return [{ title: 'Venue Not Found | When The Fun' }];
  }
  
  return [
    { title: `${venue.name} | When The Fun Venues` },
    { 
      name: 'description', 
      content: venue.description || `Discover ${venue.name} - the perfect venue for your next event!` 
    },
    { property: 'og:title', content: venue.name },
    { property: 'og:description', content: venue.description || 'Amazing venue for unforgettable events' },
    { property: 'og:type', content: 'place' },
    { property: 'og:image', content: venue.profileImageUrl || '/default-venue.jpg' },
    { property: 'place:location:latitude', content: venue.latitude?.toString() },
    { property: 'place:location:longitude', content: venue.longitude?.toString() },
  ];
};

// Cache headers 🚀
export const headers = () => {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=3600', // 5 min client, 1 hour CDN
  };
};