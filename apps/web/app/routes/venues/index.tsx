// apps/web/app/routes/venues/index.tsx
import { VenuesPage } from '~/components/magic-patterns/pages/VenuesPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

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
      .select(`
        *,
        _count:events!venue_id(count),
        upcoming_events:events!venue_id(
          id, title, start_date
        )
      `)
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
  return <VenuesPage venues={loaderData.venues} />;
}