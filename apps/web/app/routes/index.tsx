import { HomePage } from '~/components/magic-patterns/pages/HomePage';
import type { Route } from '~/types/app/routes/+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // Log environment for debugging
  console.log('Homepage loader called at:', new Date().toISOString());
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  try {
    // Fetch featured events
    const { data: events, error: eventsError } = await client
      .from('events')
      .select(`
        *,
        venue:venues(name, address)
      `)
      .eq('status', 'published')
      .gte('start_datetime', new Date().toISOString())
      .limit(8)
      .order('start_datetime');
    
    if (eventsError) {
      console.error('Events fetch error:', eventsError);
    }
    
    // Fetch featured venues
    const { data: venues, error: venuesError } = await client
      .from('venues')
      .select('*')
      .eq('is_active', true)
      .eq('verified', true)
      .limit(6)
      .order('rating', { ascending: false });
    
    if (venuesError) {
      console.error('Venues fetch error:', venuesError);
    }
    
    // Fetch featured performers
    const { data: performers, error: performersError } = await client
      .from('performers')
      .select('*')
      .eq('is_verified', true)
      .limit(6)
      .order('rating', { ascending: false });
    
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

export default function HomeRoute({ loaderData }: Route.ComponentProps) {
  console.log('HomeRoute component rendering with data:', {
    eventsCount: loaderData?.events?.length || 0,
    venuesCount: loaderData?.venues?.length || 0,
    performersCount: loaderData?.performers?.length || 0
  });
  
  return <HomePage 
    events={loaderData.events} 
    venues={loaderData.venues}
    performers={loaderData.performers}
  />;
}