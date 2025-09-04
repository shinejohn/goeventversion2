// apps/web/app/routes/events/index.tsx
import type { Route } from '~/types/app/routes/events/index/+types';
import { EventsPage } from '~/components/magic-patterns/pages/EventsPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const url = new URL(request.url);
  
  // Extract search and filter parameters
  const search = url.searchParams.get('search') || '';
  const category = url.searchParams.get('category') || '';
  const location = url.searchParams.get('location') || '';
  const dateFrom = url.searchParams.get('dateFrom') || '';
  const dateTo = url.searchParams.get('dateTo') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 12;
  const offset = (page - 1) * limit;
  
  try {
    // Build dynamic query
    let query = client
      .from('events')
      .select(`
        *,
        venue:venues(name, address, city, state)
      `)
      .eq('status', 'published')
      .gte('start_date', new Date().toISOString());
    
    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (location) {
      query = query.or(`venue.city.ilike.%${location}%,venue.state.ilike.%${location}%`);
    }
    
    if (dateFrom) {
      query = query.gte('start_date', dateFrom);
    }
    
    if (dateTo) {
      query = query.lte('end_date', dateTo);
    }
    
    // Get events with pagination
    const { data: events, error, count } = await query
      .order('start_date', { ascending: true })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    // Get filter options
    const [categoriesResult, locationsResult] = await Promise.all([
      client.from('events').select('category').not('category', 'is', null),
      client.from('venues').select('city, state').not('city', 'is', null)
    ]);
    
    const categories = [...new Set(categoriesResult.data?.map(e => e.category) || [])];
    const locations = [...new Set(locationsResult.data?.map(v => `${v.city}, ${v.state}`) || [])];
    
    return {
      events: events || [],
      totalCount: count || 0,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
      filters: {
        categories,
        locations,
        applied: { search, category, location, dateFrom, dateTo }
      }
    };
    
  } catch (error) {
    console.error('Error loading events:', error);
    return {
      events: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      filters: { categories: [], locations: [], applied: {} }
    };
  }
};

export default function EventsRoute({ loaderData }: Route.ComponentProps) {
  const { events, totalCount, currentPage, totalPages, filters } = loaderData;
  
  return (
    <EventsPage
      events={events}
      totalCount={totalCount}
      currentPage={currentPage}
      totalPages={totalPages}
      filters={filters}
    />
  );
}