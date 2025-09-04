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
    console.log('Loading events list with params:', { search, category, location, dateFrom, dateTo, page });
    
    // First check if there are any events at all
    const { data: allEvents, error: countError } = await client
      .from('events')
      .select('id, title, status')
      .limit(5);
    
    console.log('All events in database:', allEvents);
    
    // Build dynamic query - be more permissive for now
    let query = client
      .from('events')
      .select(`
        *,
        venue:venues(name, address, city, state)
      `);
    
    // Try with published status first, then any status if no results
    const publishedQuery = query.eq('status', 'published').gte('start_date', new Date().toISOString());
    
    console.log('Trying published query first...');
    let { data: events, error, count } = await publishedQuery
      .order('start_date', { ascending: true })
      .range(offset, offset + limit - 1);
      
    console.log('Published events result:', { events, error, count });
    
    // If no published events, try ANY events for debugging
    if (!events || events.length === 0) {
      console.log('No published events found, trying ANY events...');
      const anyQuery = client
        .from('events')
        .select(`
          *,
          venue:venues(name, address, city, state)
        `);
      
      const anyResult = await anyQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
        
      console.log('Any events result:', anyResult);
      events = anyResult.data;
      error = anyResult.error;
      count = anyResult.count;
    }
    
    if (error) throw error;
    
    // Transform events to match component expectations
    const transformedEvents = (events || []).map(event => {
      const eventDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      
      // Format date for display
      const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
        const dateStr = date.toLocaleDateString('en-US', options);
        
        // Check if event spans multiple days
        if (endDate.toDateString() !== eventDate.toDateString()) {
          const endStr = endDate.toLocaleDateString('en-US', options);
          return `${dateStr}-${endStr.split(' ')[1]}`; // e.g., "Oct 15-18"
        }
        return dateStr;
      };
      
      // Format time
      const formatTime = (start: Date, end: Date) => {
        const timeOptions: Intl.DateTimeFormatOptions = {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        };
        const startTime = start.toLocaleTimeString('en-US', timeOptions);
        const endTime = end.toLocaleTimeString('en-US', timeOptions);
        return `${startTime} - ${endTime}`;
      };
      
      // Determine price display
      let price = 'Free';
      if (event.base_price) {
        if (event.base_price === 0) {
          price = 'Free';
        } else {
          price = `$${event.base_price}`;
        }
      }
      
      return {
        id: event.id,
        title: event.title,
        image: event.image_url || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        date: formatDate(eventDate),
        rawDate: eventDate,
        venue: event.venue?.name || event.location_name || 'TBD',
        category: event.category || 'Event',
        price: price,
        time: formatTime(eventDate, endDate),
        description: event.description || ''
      };
    });
    
    // Get filter options
    const [categoriesResult, locationsResult] = await Promise.all([
      client.from('events').select('category').not('category', 'is', null).eq('status', 'published'),
      client.from('venues').select('city, state').not('city', 'is', null).limit(100)
    ]);
    
    const categories = [...new Set(categoriesResult.data?.map(e => e.category) || [])];
    const locations = [...new Set(locationsResult.data?.map(v => `${v.city}, ${v.state}`) || [])];
    
    return {
      events: transformedEvents,
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
    />
  );
}