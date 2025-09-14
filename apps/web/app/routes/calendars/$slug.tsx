import type { Route } from './+types/$slug';
// json helper removed - using plain objects for React Router 7
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function loader({ params }: Route.LoaderArgs) {
  const client = getSupabaseServerClient();
  
  try {
    // Try to fetch from curated_calendars table first
    const { data: curatedCalendar, error: curatedError } = await client
      .from('curated_calendars')
      .select('*')
      .eq('slug', params.slug)
      .single();
    
    if (!curatedError && curatedCalendar) {
      // Fetch events for this calendar
      const { data: calendarEvents, error: eventsError } = await client
        .from('calendar_events')
        .select(`
          *,
          event:events(*)
        `)
        .eq('calendar_id', curatedCalendar.id);
      
      // Fetch subscriber count
      const { count: subscriberCount } = await client
        .from('calendar_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('calendar_id', curatedCalendar.id);
      
      return {
        calendar: {
          ...curatedCalendar,
          subscriber_count: subscriberCount || 0,
          events: calendarEvents?.map(ce => ce.event).filter(e => e) || []
        }
      };
    }
    
    // Try calendars table as fallback
    const { data: personalCalendar, error: personalError } = await client
      .from('calendars')
      .select('*')
      .eq('slug', params.slug)
      .single();
    
    if (!personalError && personalCalendar) {
      return {
        calendar: {
          ...personalCalendar,
          events: []
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