import React from 'react';
import type { Route } from './+types/$venueId';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { notFound } from 'react-router';
import { VenueProfilePage } from '../../components/magic-patterns/pages/VenueProfilePage';
import { createMagicPatternsRoute } from '../../lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const { venueId } = params;
  
  logger.info({ venueId }, 'Loading venue profile');
  
  const client = getSupabaseServerClient(request);
  
  // Fetch venue details with related data
  const { data: venue, error: venueError } = await client
    .from('venues')
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
      events:events(
        id,
        title,
        start_datetime,
        image_url,
        category,
        price_min,
        price_max
      )
    `)
    .eq('id', venueId)
    .single();
  
  if (venueError || !venue) {
    logger.error({ error: venueError, venueId }, 'Venue not found');
    throw notFound();
  }
  
  // Calculate average rating
  const ratings = venue.reviews?.map((r: any) => r.rating).filter(Boolean) || [];
  const averageRating = ratings.length > 0 
    ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length 
    : 0;
  
  // Transform venue data for the component
  const venueData = {
    ...venue,
    average_rating: averageRating,
    total_reviews: venue.reviews?.length || 0,
    upcoming_events: venue.events?.filter((e: any) => 
      new Date(e.start_datetime) > new Date()
    ).slice(0, 6) || []
  };
  
  logger.info({ venueId, reviewCount: venueData.total_reviews }, 'Venue profile loaded');
  
  return {
    venue: venueData,
    title: `${venue.name} - Venue Details`,
    description: venue.description || `Book ${venue.name} for your next event`,
  };
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    { title: data?.title || 'Venue Details' },
    { name: 'description', content: data?.description || 'View venue details and book for your event' },
  ];
};

export default createMagicPatternsRoute(VenueProfilePage);