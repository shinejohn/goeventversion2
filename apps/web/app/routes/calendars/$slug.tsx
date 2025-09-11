import type { Route } from './+types/$slug';
// json helper removed - using plain objects for React Router 7
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function loader({ params }: Route.LoaderArgs) {
  const client = getSupabaseServerClient();
  
  try {
    // Try to find the calendar by slug
    const { data: calendar, error } = await client
      .from('curated_calendars')
      .select('*')
      .eq('slug', params.slug)
      .single();

    if (error || !calendar) {
      // If not found in curated_calendars, try calendars table
      const { data: altCalendar, error: altError } = await client
        .from('calendars')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (altError || !altCalendar) {
        // Return a default calendar structure for demo purposes
        return { 
          calendar: {
            id: params.slug,
            name: `Calendar: ${params.slug}`,
            description: 'A curated calendar of events',
            slug: params.slug,
            event_count: 0,
            subscriber_count: 0,
            is_public: true
          }
        };
      }

      return { calendar: altCalendar };
    }

    return { calendar };
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
        is_public: true
      }
    };
  }
}

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
          <div className="text-center text-gray-500">
            <p>Calendar view coming soon...</p>
            <p className="mt-2 text-sm">
              This calendar has {calendar.event_count} events and {calendar.subscriber_count} subscribers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}