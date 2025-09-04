import { VenueMarketplacePage } from '~/components/magic-patterns/pages/book-it/VenueMarketplacePage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/book-it/venues/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    console.log('Loading venues for booking marketplace...');
    
    // Fetch available venues for booking
    const { data: venues, error } = await client
      .from('venues')
      .select(`
        *
      `)
      .eq('status', 'active')
      .order('rating', { ascending: false, nullsFirst: false })
      .limit(20);
    
    if (error) {
      console.error('Venues fetch error:', error);
    }
    
    console.log('Venue marketplace data loaded:', { venuesCount: venues?.length || 0 });
    
    return {
      title: 'VenueMarketplace - GoEventCity',
      venues: venues || []
    };
  } catch (error) {
    console.error('Venue marketplace loader error:', error);
    return {
      title: 'VenueMarketplace - GoEventCity',
      venues: []
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
      content: 'Discover amazing events and experiences in your city',
    },
  ];
};

// SSR-safe pattern using props.loaderData
export default function VenueMarketplaceRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  console.log('VenueMarketplaceRoute rendering with data:', {
    venuesCount: data.venues?.length || 0
  });
  
  return <VenueMarketplacePage venues={data.venues} />;
}
