import React from 'react';
import { BookingRequestPage } from '~/components/magic-patterns/pages/book-it/venues/BookingRequestPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/book-it/venues/$id/book/+types';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const venueId = params.id;
  
  try {
    // Load venue details for booking
    const { data: venue, error } = await client
      .from('venues')
      .select('*')
      .eq('id', venueId)
      .single();
      
    if (error || !venue) {
      throw new Response('Venue not found', { status: 404 });
    }
    
    // Transform venue data to match component expectations
    const transformedVenue = {
      ...venue,
      id: venue.id,
      name: venue.name,
      images: venue.gallery_images || [venue.image_url],
      address: venue.address,
      capacity: venue.max_capacity || 0,
      pricePerHour: venue.hourly_rate || 0,
      venueType: venue.venue_type,
      amenities: venue.amenities || [],
      description: venue.description,
      // Add location object for compatibility
      location: {
        address: venue.address || '',
        neighborhood: venue.city || '',
        coordinates: {
          lat: venue.latitude || 27.9659,
          lng: venue.longitude || -82.8001
        }
      }
    };
    
    return {
      title: `Book ${venue.name} - GoEventCity`,
      venue: transformedVenue
    };
    
  } catch (error) {
    console.error('Error loading venue for booking:', error);
    throw new Response('Venue not found', { status: 404 });
  }
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title || 'Book Venue - GoEventCity',
    },
    {
      name: 'description',
      content: 'Book this amazing venue for your next event',
    },
  ];
};

export default function BookingRequestRoute({ loaderData }: Route.ComponentProps) {
  return <BookingRequestPage venue={loaderData.venue} />;
}