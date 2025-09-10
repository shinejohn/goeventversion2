import React from 'react';
import { HomePage } from '~/components/magic-patterns/pages/HomePage';
import type { Route } from '~/types/app/routes/+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';

export const loader = async ({ request }: Route.LoaderArgs) => {
  // First log the environment variables being used
  console.log('=== SUPABASE CONFIG DEBUG ===');
  console.log('import.meta.env.VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('import.meta.env.VITE_SUPABASE_ANON_KEY exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
  
  const client = getSupabaseServerClient(request);
  
  // Log environment for debugging
  console.log('Homepage loader called at:', new Date().toISOString());
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  try {
    // Fetch featured events - be more permissive
    console.log('Fetching events from homepage...');
    
    // First try published events - simplified query
    let { data: events, error: eventsError } = await client
      .from('events')
      .select('*, venues!venue_id(*)')
      .eq('status', 'published')
      .gte('start_datetime', new Date().toISOString())
      .limit(8)
      .order('start_datetime');
    
    console.log('Published events result:', { events, eventsError });
    
    // If no results, try ANY events for debugging
    if (eventsError || !events || events.length === 0) {
      console.log('No published events, trying ANY events...');
      const anyResult = await client
        .from('events')
        .select('*, venues!venue_id(*)')
        .limit(8)
        .order('created_at', { ascending: false });
      
      console.log('Any events result:', anyResult);
      events = anyResult.data;
      eventsError = anyResult.error;
    }
    
    if (eventsError) {
      console.error('Events fetch error:', eventsError);
    }
    
    // Fetch featured venues - include all fields UI expects
    const { data: venues, error: venuesError } = await client
      .from('venues')
      .select('*')
      .limit(6)
      .order('rating', { ascending: false, nullsFirst: false });
    
    if (venuesError) {
      console.error('Venues fetch error:', venuesError);
    }
    
    // Fetch featured performers
    const { data: performers, error: performersError } = await client
      .from('performers')
      .select('*')
      .limit(6)
      .order('rating', { ascending: false, nullsFirst: false });
    
    if (performersError) {
      console.error('Performers fetch error:', performersError);
    }
    
    console.log('Homepage data loaded successfully:', {
      eventsCount: events?.length || 0,
      venuesCount: venues?.length || 0,
      performersCount: performers?.length || 0
    });
    
    return {
      title: 'GoEventCity - Discover Events, Venues & Performers',
      events: events || [],
      venues: venues || [],
      performers: performers || []
    };
  } catch (error) {
    console.error('Homepage loader error:', error);
    // Still return valid data structure even if queries fail
    return {
      title: 'GoEventCity - Discover Events, Venues & Performers',
      events: [],
      venues: [],
      performers: []
    };
  }
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title || 'GoEventCity',
    },
    {
      name: 'description',
      content: 'Discover amazing events, book venues, and connect with performers in your city',
    },
  ];
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: HomePage,
  transformData: (loaderData) => ({
    events: loaderData.events,
    venues: loaderData.venues,
    performers: loaderData.performers,
  }),
});