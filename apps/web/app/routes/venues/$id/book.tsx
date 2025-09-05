import type { Route } from '~/types/app/routes/venues/+types/$id/book';
// json helper removed - using plain objects for React Router 7
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function loader({ params }: Route.LoaderArgs) {
  const client = getSupabaseServerClient();
  
  const { data: venue, error } = await client
    .from('venues')
    .select(`
      *,
      events(
        id,
        title,
        start_datetime,
        end_datetime,
        price_min,
        price_max,
        capacity,
        available_tickets
      )
    `)
    .eq('id', params.id)
    .single();

  if (error || !venue) {
    throw new Response('Venue not found', { status: 404 });
  }

  return { venue };
}

export default function VenueBookingPage({ loaderData }: Route.ComponentProps) {
  const { venue } = loaderData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Book Venue: {venue.name}
          </h1>
          <p className="text-xl text-gray-600">
            {venue.city}, {venue.state}
          </p>
          <p className="text-lg text-gray-500">
            Capacity: {venue.capacity} people
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Venue Details</h2>
            {venue.description && (
              <p className="text-gray-600 mb-4">{venue.description}</p>
            )}
            
            <div className="space-y-2">
              <p><span className="font-medium">Address:</span> {venue.address}</p>
              <p><span className="font-medium">Type:</span> {venue.venue_type}</p>
              {venue.phone && (
                <p><span className="font-medium">Phone:</span> {venue.phone}</p>
              )}
              {venue.website && (
                <p>
                  <span className="font-medium">Website:</span>{' '}
                  <a 
                    href={venue.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {venue.website}
                  </a>
                </p>
              )}
            </div>

            {venue.amenities && venue.amenities.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.amenities.map((amenity: string, index: number) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Booking Form</h2>
            <div className="text-center text-gray-500">
              <p>Venue booking form coming soon...</p>
              <p className="mt-2 text-sm">
                Contact the venue directly for booking inquiries.
              </p>
            </div>
          </div>
        </div>

        {venue.events && venue.events.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {venue.events.map((event: any) => (
                <div key={event.id} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-lg">{event.title}</h3>
                  <p className="text-gray-600">
                    {new Date(event.start_datetime).toLocaleDateString()} at{' '}
                    {new Date(event.start_datetime).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Price: ${event.price_min} - ${event.price_max}
                    {event.available_tickets && (
                      <span className="ml-2">
                        | {event.available_tickets} tickets available
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}