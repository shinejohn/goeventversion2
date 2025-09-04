// apps/web/app/routes/venues/index.tsx
import { VenuesPage } from '~/components/magic-patterns/pages/VenuesPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/venues/index/+types';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const url = new URL(request.url);
  
  const search = url.searchParams.get('search') || '';
  const city = url.searchParams.get('city') || '';
  const venueType = url.searchParams.get('type') || '';
  const capacity = url.searchParams.get('capacity') || '';
  
  try {
    let query = client
      .from('venues')
      .select('*')
      .eq('is_active', true);
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (city) {
      query = query.eq('city', city);
    }
    
    if (venueType) {
      query = query.eq('venueType', venueType);
    }
    
    if (capacity) {
      query = query.gte('capacity', parseInt(capacity));
    }
    
    const { data: venues, error } = await query.order('name');
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    console.log('Loaded venues from Railway:', venues?.length || 0, 'venues');
    
    return { venues: venues || [] };
    
  } catch (error) {
    console.error('Error loading venues:', error);
    return { venues: [] };
  }
};

export default function VenuesRoute({ loaderData }: Route.ComponentProps) {
  try {
    return <VenuesPage venues={loaderData.venues} />;
  } catch (error) {
    console.error('Error rendering VenuesPage:', error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Venues Page</h1>
        <pre className="mt-4 p-4 bg-red-100 rounded">
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
      </div>
    );
  }
}