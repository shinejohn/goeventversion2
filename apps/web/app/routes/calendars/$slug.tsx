import type { Route } from './+types/$slug';
// json helper removed - using plain objects for React Router 7
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function loader({ params }: Route.LoaderArgs) {
  const client = getSupabaseServerClient();
  
  try {
    // Use community_hubs as the base for calendar data
    const { data: communityHub, error: hubError } = await client
      .from('community_hubs')
      .select('*')
      .eq('slug', params.slug)
      .single();
    
    if (!hubError && communityHub) {
      // Fetch events related to this community hub
      const { data: events, error: eventsError } = await client
        .from('events')
        .select(`
          *,
          venue:venues(name, address),
          event_performers(
            performer:performers(name, bio)
          )
        `)
        .eq('community_hub_id', communityHub.id)
        .order('start_datetime', { ascending: true });
      
      // Get subscriber count from community_hubs members
      const { count: subscriberCount } = await client
        .from('community_hub_members')
        .select('*', { count: 'exact', head: true })
        .eq('community_hub_id', communityHub.id);
      
      return {
        calendar: {
          id: communityHub.id,
          name: communityHub.name,
          description: communityHub.description || 'A curated calendar of events',
          slug: communityHub.slug,
          event_count: events?.length || 0,
          subscriber_count: subscriberCount || 0,
          is_public: true,
          events: events || []
        }
      };
    }
    
    // If no community hub found, try to find events with similar name
    const { data: events, error: eventsError } = await client
      .from('events')
      .select(`
        *,
        venue:venues(name, address),
        event_performers(
          performer:performers(name, bio)
        )
      `)
      .ilike('title', `%${params.slug}%`)
      .order('start_datetime', { ascending: true });
    
    if (!eventsError && events && events.length > 0) {
      return {
        calendar: {
          id: params.slug,
          name: `Events: ${params.slug}`,
          description: `Events related to ${params.slug}`,
          slug: params.slug,
          event_count: events.length,
          subscriber_count: 0,
          is_public: true,
          events: events
        }
      };
    }
    
    // If no calendar found, return a default structure
    return { 
      calendar: {
        id: params.slug,
        name: `Calendar: ${params.slug}`,
        description: 'A curated calendar of events',
        slug: params.slug,
        event_count: 0,
        subscriber_count: 0,
        is_public: true,
        events: []
      }
    };
    
  } catch (error) {
    console.error('Error loading calendar:', error);
    // Return a default calendar structure for demo purposes
    return { 
      calendar: {
        id: params.slug,
        name: `Calendar: ${params.slug}`,
        description: 'A curated calendar of events',
        slug: params.slug,
        event_count: 0,
        subscriber_count: 0,
        is_public: true,
        events: []
      }
    };
  }
}

export const meta = ({ data }: Route.MetaArgs) => {
  const calendar = data?.calendar;
  return [
    {
      title: calendar ? `${calendar.name} - Calendar | GoEventCity` : 'Calendar | GoEventCity',
    },
    {
      name: 'description',
      content: calendar ? calendar.description || 'A curated calendar of events' : 'Discover amazing events and calendars',
    },
  ];
};

export default function CalendarPage({ loaderData }: Route.ComponentProps) {
  const { calendar } = loaderData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {calendar.name}
          </h1>
          {calendar.description && (
            <p className="text-xl text-gray-600">
              {calendar.description}
            </p>
          )}
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Calendar Events</h2>
              <p className="text-gray-600">
                {calendar.event_count} events • {calendar.subscriber_count} subscribers
              </p>
            </div>
            <div className="flex gap-2">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Subscribe
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">
                Share
              </button>
            </div>
          </div>
          
          {calendar.events && calendar.events.length > 0 ? (
            <div className="space-y-4">
              {calendar.events.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span>📅 {new Date(event.start_datetime).toLocaleDateString()}</span>
                        <span>📍 {event.location_name || 'Location TBD'}</span>
                        <span>💰 ${event.price_min || 'Free'}</span>
                      </div>
                    </div>
                    <button className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-sm hover:bg-indigo-200">
                      View Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No events in this calendar yet.</p>
              <p className="mt-2 text-sm">
                Check back later for upcoming events!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}