import { HomePage } from '~/components/magic-patterns/pages/HomePage';
import type { Route } from '~/types/app/routes/+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    // Fetch featured events
    const { data: events } = await client
      .from('events')
      .select(`
        *,
        venue:venues(name, address)
      `)
      .eq('status', 'published')
      .gte('start_datetime', new Date().toISOString())
      .limit(8)
      .order('start_datetime');
    
    // Fetch featured venues
    const { data: venues } = await client
      .from('venues')
      .select('*')
      .eq('is_active', true)
      .eq('verified', true)
      .limit(6)
      .order('rating', { ascending: false });
    
    // Fetch featured performers
    const { data: performers } = await client
      .from('performers')
      .select('*')
      .eq('available_for_booking', true)
      .eq('is_verified', true)
      .limit(6)
      .order('rating', { ascending: false });
    
    return {
      title: 'GoEventCity - Discover Events, Venues & Performers',
      events: events || [],
      venues: venues || [],
      performers: performers || []
    };
  } catch (error) {
    console.error('Error loading home page data:', error);
    console.log('Force rebuild at:', new Date().toISOString());
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
  return <HomePage 
    events={loaderData.events} 
    venues={loaderData.venues}
    performers={loaderData.performers}
  />;
}