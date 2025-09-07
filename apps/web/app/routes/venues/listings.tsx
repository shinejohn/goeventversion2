import React from 'react';
import type { Route } from './+types/listings';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { FeaturedListingsPage } from '../../components/magic-patterns/pages/advertise/FeaturedListingsPage';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  const { data: featuredVenues, error } = await client
    .from('venues')
    .select('*')
    .eq('is_active', true)
    .eq('is_verified', true)
    .order('created_at', { ascending: false })
    .limit(20);
  
  if (error) {
    throw error;
  }
  
  return {
    featuredVenues: featuredVenues || [],
  };
};

export default function VenueListingsPage() {
  return <FeaturedListingsPage />;
}