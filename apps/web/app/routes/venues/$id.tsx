// apps/web/app/routes/venues/$id.tsx  
import { VenueDetailPage } from '~/components/magic-patterns/pages/venues/VenueDetailPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/venues/$id/+types';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const venueId = params.id;
  
  try {
    console.log('Loading venue with ID:', venueId);
    
    // First, let's check if there are any venues at all
    const { data: allVenues, error: countError } = await client
      .from('venues')
      .select('id, name')
      .limit(5);
      
    console.log('Available venues in database:', allVenues);
    
    const { data: venue, error } = await client
      .from('venues')
      .select('*')
      .eq('id', venueId)
      .single();
      
    console.log('Venue query result:', { venue, error });
      
    if (error || !venue) {
      console.error('Venue not found:', error);
      // If no venues exist, return a helpful message
      if (allVenues && allVenues.length === 0) {
        throw new Response('No venues in database. Please add venues first.', { status: 404 });
      }
      throw new Response(`Venue not found. Available venues: ${allVenues?.map(v => v.id).join(', ')}`, { status: 404 });
    }
    
    // Transform the database venue to match UI expectations
    const transformedVenue = {
      ...venue,
      // UI expects 'images' as an array
      images: venue.gallery_images && venue.gallery_images.length > 0 
        ? venue.gallery_images 
        : [venue.image_url || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
      // UI expects 'location' as an object
      location: {
        address: venue.address,
        coordinates: {
          lat: venue.latitude || 0,
          lng: venue.longitude || 0
        }
      },
      // UI expects camelCase
      venueType: venue.venue_type,
      capacity: venue.max_capacity,
      verified: venue.is_verified,
      // UI expects amenities as an array
      amenities: venue.amenities 
        ? Object.keys(venue.amenities).filter(key => venue.amenities[key])
        : ['Sound System', 'Lighting', 'Parking', 'Wi-Fi', 'Air Conditioning'],
      // UI expects these fields - set defaults for now
      rating: 4.5,
      reviewCount: 0,
      priceRange: 2
    };
    
    // Load upcoming events at this venue
    const { data: events } = await client
      .from('events')
      .select('id, title, start_date, end_date, image_url, category')
      .eq('venue_id', venueId)
      .eq('status', 'published')
      .gte('start_date', new Date().toISOString())
      .order('start_date')
      .limit(6);
    
    // Transform events to match UI expectations
    const transformedEvents = events?.map(event => ({
      id: event.id,
      name: event.title,
      date: new Date(event.start_date),
      time: `${new Date(event.start_date).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })} - ${new Date(event.end_date || event.start_date).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`,
      image: event.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      ticketPrice: '$25-45', // Default for now - we'll add pricing later
      ticketStatus: 'Available' // Default for now
    })) || [];
    
    return { 
      venue: transformedVenue,
      upcomingEvents: transformedEvents
    };
    
  } catch (error) {
    console.error('Error loading venue:', error);
    throw new Response('Venue not found', { status: 404 });
  }
};

export default function VenueDetailRoute({ loaderData }: Route.ComponentProps) {
  return <VenueDetailPage venue={loaderData.venue} upcomingEvents={loaderData.upcomingEvents} />;
}