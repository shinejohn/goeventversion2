import React from 'react';
import type { Route } from './+types/$performerId';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { PerformerProfilePage } from '../../components/magic-patterns/pages/PerformerProfilePage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { transformPerformerData, transformEventData } from '~/lib/magic-patterns/data-transformers';
import { getLogger } from '@kit/shared/logger';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  const { performerId } = params;
  
  try {
    logger.info({ loader: 'performers/$performerId', performerId }, '🎭 Loading performer profile');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user for personalization
    const { data: { user } } = await client.auth.getUser();
    
    // Parallel data fetching for performance 🚀
    const [performerQuery, upcomingEventsQuery, pastEventsQuery, similarPerformersQuery] = await Promise.all([
      // Main performer data with comprehensive fields
      client
        .from('performers')
        .select('*')
        .eq('id', performerId)
        .single(),
      
      // Get upcoming events for this performer
      client
        .from('event_performers')
        .select('*, events!event_id(*, venues!venue_id(*))')
        .eq('performer_id', performerId),
      
      // Get past events for portfolio
      client
        .from('event_performers')
        .select('*, events!event_id(*, venues!venue_id(*))')
        .eq('performer_id', performerId)
        .limit(5),
      
      // Get similar performers (same category)
      (async () => {
        // First get the current performer's category and genres
        const { data: currentPerformer } = await client
          .from('performers')
          .select('category, genres')
          .eq('id', performerId)
          .single();
        
        if (!currentPerformer) return { data: [] };
        
        // Then find similar ones
        return await client
          .from('performers')
          .select('*')
          .neq('id', performerId)
          .eq('category', currentPerformer.category)
          .order('rating', { ascending: false })
          .limit(4);
      })(),
    ]);
    
    const { data: performer, error: performerError } = performerQuery;
    const { data: upcomingEvents } = upcomingEventsQuery;
    const { data: pastEvents } = pastEventsQuery;
    const { data: similarPerformers } = similarPerformersQuery;
    
    if (performerError || !performer) {
      logger.warn({ error: performerError, performerId }, 'Performer not found');
      // Return null performer data for UI to handle
      return {
        performer: null,
        upcomingEvents: [],
        pastEvents: [],
        reviews: [],
        similarPerformers: [],
        metrics: {
          totalPerformances: 0,
          upcomingEvents: 0,
          averageRating: 0,
          totalReviews: 0,
        },
      };
    }
    
    // Transform the performer data with all UI fields
    const transformedPerformer = transformPerformerData(performer);
    // const transformedPerformer = {
    //   ...transformPerformerData(performer),
    //   // Additional profile fields
    //   biography: performer.bio || '',
    //   social_media: performer.social_links || {},
    //   media_gallery: [], // Field doesn't exist yet
    //   technical_requirements: '', // Field doesn't exist yet
    //   availability: {}, // Field doesn't exist yet
    //   booking_info: {
    //     base_rate: performer.base_price || 0,
    //     min_booking_hours: 1, // Field doesn't exist yet
    //     max_travel_distance: 100, // Field doesn't exist yet
    //     setup_time_required: 30, // Field doesn't exist yet
    //     equipment_provided: false, // Field doesn't exist yet
    //     insurance_coverage: false, // Field doesn't exist yet
    //   },
    //   stats: {
    //     total_performances: performer.shows_played || 0,
    //     years_experience: performer.years_active || 0,
    //     repeat_booking_rate: 0, // Field doesn't exist yet
    //   }
    // };
    
    // Transform events with null checks - fixed to access events directly
    const transformedUpcomingEvents = (upcomingEvents || [])
      .map(ep => ep.events ? transformEventData(ep.events) : null)
      .filter(Boolean)
      .filter((event: any) => new Date(event.startDate) > new Date());
    
    const transformedPastEvents = (pastEvents || [])
      .map(ep => ep.events ? transformEventData(ep.events) : null)
      .filter(Boolean)
      .filter((event: any) => new Date(event.startDate) <= new Date())
      .sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    
    // Transform similar performers
    const transformedSimilarPerformers = (similarPerformers || []).map(transformPerformerData);
    
    // Process reviews - reviews field is JSON in performers table
    const reviews = performer.reviews || [];
    const averageRating = performer.rating || 0;
    
    // Calculate metrics
    const performerMetrics = {
      totalPerformances: performer.shows_played || 0,
      upcomingEvents: transformedUpcomingEvents.length,
      averageRating: averageRating,
      totalReviews: Array.isArray(reviews) ? reviews.length : 0,
      monthlyBookings: 0, // Field doesn't exist yet
      responseTime: performer.responseTime || '24 hours',
    };
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'performers/$performerId',
      duration,
      performerId,
      upcomingEventsCount: transformedUpcomingEvents.length,
      metrics: performerMetrics,
    }, '🌟 Performer profile loaded successfully');
    
    return {
      performer: transformedPerformer,
      upcomingEvents: transformedUpcomingEvents,
      pastEvents: transformedPastEvents,
      reviews: reviews,
      similarPerformers: transformedSimilarPerformers,
      metrics: performerMetrics,
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'performers/$performerId',
      performerId,
      url: request.url 
    }, 'Error loading performer profile');
    
    // Return empty data instead of throwing
    return {
      performer: null,
      upcomingEvents: [],
      pastEvents: [],
      reviews: [],
      similarPerformers: [],
      metrics: {
        totalPerformances: 0,
        upcomingEvents: 0,
        averageRating: 0,
        totalReviews: 0,
      },
    };
  }
};

export const meta = ({ data }: Route.MetaArgs) => {
  const performer = data?.performer;
  
  if (!performer) {
    return [{ title: 'Performer Not Found | When The Fun' }];
  }
  
  const performerName = performer.stage_name || performer.name;
  
  return [
    { title: `${performerName} - ${performer.category} | When The Fun` },
    { 
      name: 'description', 
      content: performer.biography || `Book ${performerName} for your next event. Professional ${performer.category} available for events, parties, and special occasions.` 
    },
    { property: 'og:title', content: `${performerName} | When The Fun` },
    { property: 'og:description', content: performer.biography || `Professional ${performer.category}` },
    { property: 'og:type', content: 'profile' },
    { property: 'og:image', content: performer.image || '/default-performer.jpg' },
  ];
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: PerformerProfilePage,
  transformData: (loaderData) => ({
    performer: loaderData.performer,
  }),
});

// Cache headers 🚀
export const headers = () => {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=3600', // 5 min client, 1 hour CDN
  };
};