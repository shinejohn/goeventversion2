import type { Route } from './+types/purchase/$eventId';
// json helper removed - using plain objects for React Router 7
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function loader({ params }: Route.LoaderArgs) {
  const client = getSupabaseServerClient();
  
  const { data: event, error } = await client
    .from('events')
    .select(`
      *,
      venue:venues(name, city, state),
      performers:event_performers(
        role,
        performer:performers(name, genre, image_url)
      )
    `)
    .eq('id', params.eventId)
    .single();

  if (error || !event) {
    console.warn('Event not found for ticket purchase:', { error, eventId: params.eventId });
    return { event: null };
  }

  return { event };
}

export default function TicketPurchasePage({ loaderData }: Route.ComponentProps) {
  const { event } = loaderData;

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Event Not Found</h2>
          <p className="mt-2 text-gray-600">The event you're trying to purchase tickets for doesn't exist.</p>
          <button
            onClick={() => window.location.href = '/events'}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Browse All Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Purchase Tickets: {event.title}
          </h1>
          <p className="text-xl text-gray-600">
            {event.venue?.name && `${event.venue.name}, ${event.venue.city}, ${event.venue.state}`}
          </p>
          <p className="text-lg text-gray-500">
            {new Date(event.start_datetime).toLocaleDateString()} at {new Date(event.start_datetime).toLocaleTimeString()}
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center text-gray-500">
            <p>Ticket purchase form coming soon...</p>
            <p className="mt-2 text-sm">
              Price range: ${event.price_min} - ${event.price_max}
            </p>
            {event.capacity && (
              <p className="text-sm">
                Capacity: {event.capacity} people
              </p>
            )}
          </div>

          {event.performers && event.performers.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Performers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.performers.map((ep: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    {ep.performer.image_url && (
                      <img 
                        src={ep.performer.image_url} 
                        alt={ep.performer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{ep.performer.name}</p>
                      <p className="text-sm text-gray-500">{ep.performer.genre}</p>
                      {ep.role !== 'performer' && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {ep.role}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}