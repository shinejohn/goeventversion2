import React from 'react';
import type { Route } from './+types/$venueId';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { VenueProfilePage } from '../../components/magic-patterns/pages/VenueProfilePage';
import { createMagicPatternsRoute } from '../../lib/magic-patterns/route-wrapper';
import { transformVenueData, transformEventData } from '~/lib/magic-patterns/data-transformers';
import { getLogger } from '@kit/shared/logger';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  const { venueId } = params;
  
  try {
    logger.info({ loader: 'venues/$venueId', venueId }, '🏛️ Loading venue profile');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user for personalization
    const { data: { user } } = await client.auth.getUser();
    
    // Parallel data fetching for performance 🚀
    const [venueQuery, upcomingEventsQuery, pastEventsQuery, similarVenuesQuery] = await Promise.all([
      // Main venue data with comprehensive fields
      client
        .from('venues')
        .select(`
          *,
          venue_reviews (
            id,
            rating,
            title,
            content,
            created_at,
            reviewer_name,
            event_id,
            is_verified
          ),
          bookings_count:bookings(count)
        `)
        .eq('id', venueId)
        .single(),
      
      // Get upcoming events at this venue
      client
        .from('events')
        .select(`
          *,
          performers:event_performers(
            performer:performers!performer_id(
              id,
              stage_name,
              name,
              category,
              image_url
            )
          )
        `)
        .eq('venue_id', venueId)
        .gte('start_datetime', new Date().toISOString())
        .eq('status', 'published')
        .order('start_datetime', { ascending: true })
        .limit(10),
      
      // Get past events for venue portfolio
      client
        .from('events')
        .select(`
          id,
          title,
          start_datetime,
          category,
          image_url
        `)
        .eq('venue_id', venueId)
        .lt('start_datetime', new Date().toISOString())
        .order('start_datetime', { ascending: false })
        .limit(5),
      
      // Get similar venues (same type/capacity range)
      (async () => {
        // First get the current venue's type and capacity
        const { data: currentVenue } = await client
          .from('venues')
          .select('venue_type, max_capacity, city')
          .eq('id', venueId)
          .single();
        
        if (!currentVenue) return { data: [] };
        
        // Then find similar ones
        return await client
          .from('venues')
          .select('*')
          .neq('id', venueId)
          .eq('venue_type', currentVenue.venue_type)
          .gte('max_capacity', (currentVenue.max_capacity || 100) * 0.5)
          .lte('max_capacity', (currentVenue.max_capacity || 100) * 1.5)
          .order('rating', { ascending: false, nullsLast: true })
          .limit(4);
      })(),
    ]);
    
    const { data: venue, error: venueError } = venueQuery;
    const { data: upcomingEvents } = upcomingEventsQuery;
    const { data: pastEvents } = pastEventsQuery;
    const { data: similarVenues } = similarVenuesQuery;
    
    if (venueError || !venue) {
      logger.warn({ error: venueError, venueId }, 'Venue not found');
      // Return null venue data for UI to handle
      return {
        venue: null,
        upcomingEvents: [],
        pastEvents: [],
        reviews: [],
        similarVenues: [],
        metrics: {
          totalEvents: 0,
          upcomingEvents: 0,
          averageRating: 0,
          totalReviews: 0,
        },
      };
    }
    
    // Transform the venue data with all UI fields
    const transformedVenue = {
      ...transformVenueData(venue),
      // Additional profile fields
      full_description: venue.description || '',
      gallery_images: venue.gallery_images || [],
      floor_plans: [], // Field doesn't exist yet
      virtual_tour_url: null, // Field doesn't exist yet
      rules_and_restrictions: '', // Field doesn't exist yet
      
      // Availability info
      operating_hours: venue.operating_hours || {},
      blackout_dates: [], // Field doesn't exist yet
      minimum_notice_hours: 48, // Field doesn't exist yet
      
      // Amenities detail
      amenities_detail: {
        included: venue.amenities || [],
        available_for_rent: [], // Field doesn't exist yet
        nearby: [] // Field doesn't exist yet
      },
      
      // Parking and transit - using defaults since fields don't exist yet
      parking_info: {
        type: 'street',
        capacity: 0,
        cost: 'Free',
        distance: 'Adjacent'
      },
      transit_options: [],
      
      // Booking info
      booking_info: {
        base_hourly_rate: venue.pricePerHour || 100,
        minimum_hours: 2,
        deposit_required: 25,
        cancellation_policy: 'Standard',
        insurance_required: false,
        security_deposit: 0,
      },
      
      // Capacity details
      capacity_details: {
        standing: venue.max_capacity || 100,
        seated: Math.floor((venue.max_capacity || 100) * 0.7),
        cocktail: Math.floor((venue.max_capacity || 100) * 0.8),
      }
    };
    
    // Transform events
    const transformedUpcomingEvents = (upcomingEvents || []).map(transformEventData);
    const transformedPastEvents = (pastEvents || []).map(transformEventData);
    
    // Transform similar venues
    const transformedSimilarVenues = (similarVenues || []).map(transformVenueData);
    
    // Process reviews
    const reviews = venue.venue_reviews || [];
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : venue.rating || 0;
    
    // Calculate metrics
    const venueMetrics = {
      totalEvents: venue.total_events || 0,
      upcomingEvents: transformedUpcomingEvents.length,
      averageRating: averageRating,
      totalReviews: reviews.length,
      occupancyRate: 0, // Field doesn't exist yet
      repeatBookingRate: 0, // Field doesn't exist yet
    };
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'venues/$venueId',
      duration,
      venueId,
      upcomingEventsCount: transformedUpcomingEvents.length,
      metrics: venueMetrics,
    }, '🏛️ Venue profile loaded successfully');
    
    return {
      venue: transformedVenue,
      upcomingEvents: transformedUpcomingEvents,
      pastEvents: transformedPastEvents,
      reviews: reviews,
      similarVenues: transformedSimilarVenues,
      metrics: venueMetrics,
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'venues/$venueId',
      venueId,
      url: request.url 
    }, 'Error loading venue profile');
    
    // Return empty data instead of throwing
    return {
      venue: null,
      upcomingEvents: [],
      pastEvents: [],
      reviews: [],
      similarVenues: [],
      metrics: {
        totalEvents: 0,
        upcomingEvents: 0,
        averageRating: 0,
        totalReviews: 0,
      },
    };
  }
};

export const meta = ({ data }: Route.MetaArgs) => {
  const venue = data?.venue;
  
  if (!venue) {
    return [{ title: 'Venue Not Found | When The Fun' }];
  }
  
  return [
    { title: `${venue.name} - ${venue.venue_type} | When The Fun` },
    { 
      name: 'description', 
      content: venue.full_description || `Book ${venue.name} for your next event. ${venue.venue_type} venue with capacity for ${venue.capacity} guests.` 
    },
    { property: 'og:title', content: `${venue.name} | When The Fun` },
    { property: 'og:description', content: venue.full_description || `${venue.venue_type} venue in ${venue.city}` },
    { property: 'og:type', content: 'place' },
    { property: 'og:image', content: venue.image_url || '/default-venue.jpg' },
  ];
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: VenueProfilePage,
  transformData: (loaderData) => {
    console.log('[VenueDetailRoute] Loader data:', loaderData);
    console.log('[VenueDetailRoute] Venue data:', loaderData.venue);
    return {
      venue: loaderData.venue,
    };
  },
});

// Cache headers 🚀
export const headers = () => {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=3600', // 5 min client, 1 hour CDN
  };
};