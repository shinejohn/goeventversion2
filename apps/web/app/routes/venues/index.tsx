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
      .select('*');
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (city) {
      query = query.ilike('address', `%${city}%`);
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
    
    // Transform venues data to match VenueData interface
    const transformedVenues = (venues || []).map(venue => ({
      id: venue.id,
      name: venue.name,
      description: venue.description,
      address: venue.address,
      capacity: venue.capacity,
      images: venue.images || [],
      amenities: venue.amenities || [],
      average_rating: venue.rating || null,
      total_reviews: venue.reviews || null,
      slug: venue.slug,
      community_id: venue.community_id,
      account_id: venue.account_id,
      venue_type: venue.venueType || 'Other',
      price_per_hour: venue.pricePerHour || null,
      distance: venue.distance || null,
      listed_date: venue.listedDate || venue.created_at,
      last_booked_days_ago: venue.lastBookedDaysAgo || null,
      unavailable_dates: venue.unavailableDates || [],
      image_url: venue.image_url || (venue.images && venue.images[0]) || null,
      city: venue.city || '',
      verified: venue.is_verified || false
    }));
    
    return { venues: transformedVenues };
    
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