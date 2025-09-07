import React from 'react';
import type { Route } from './+types/$performerId';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { notFound } from 'react-router';
import { PerformerProfilePage } from '../../components/magic-patterns/pages/PerformerProfilePage';
import { createMagicPatternsRoute } from '../../lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const { performerId } = params;
  
  logger.info({ performerId }, 'Loading performer profile');
  
  const client = getSupabaseServerClient(request);
  
  // Fetch performer details with related data
  const { data: performer, error: performerError } = await client
    .from('performers')
    .select(`
      *,
      reviews:reviews(
        id,
        rating,
        title,
        content,
        created_at,
        reviewer:account_id(id, name, picture_url)
      ),
      events:performers_events(
        event:event_id(
          id,
          title,
          start_datetime,
          image_url,
          category,
          venue_id,
          venues(name, address)
        )
      )
    `)
    .eq('id', performerId)
    .single();
  
  if (performerError || !performer) {
    logger.error({ error: performerError, performerId }, 'Performer not found');
    throw notFound();
  }
  
  // Calculate average rating from reviews
  const ratings = performer.reviews?.map((r: any) => r.rating).filter(Boolean) || [];
  const averageRating = ratings.length > 0 
    ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length 
    : (performer.rating || 0);
  
  // Transform performer data
  const performerData = {
    ...performer,
    average_rating: averageRating,
    total_reviews: performer.reviews?.length || 0,
    upcoming_events: performer.events
      ?.map((e: any) => e.event)
      .filter((event: any) => event && new Date(event.start_datetime) > new Date())
      .slice(0, 6) || []
  };
  
  logger.info({ 
    performerId, 
    reviewCount: performerData.total_reviews,
    eventCount: performerData.upcoming_events.length 
  }, 'Performer profile loaded');
  
  return {
    performer: performerData,
    title: `${performer.name || performer.stage_name} - Performer Profile`,
    description: performer.bio || `Book ${performer.stage_name || performer.name} for your next event`,
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    { title: data?.title || 'Performer Profile' },
    { name: 'description', content: data?.description || 'View performer details and book for your event' },
  ];
};

export default createMagicPatternsRoute(PerformerProfilePage);