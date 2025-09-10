import React from 'react';
import { Link, useNavigate } from 'react-router';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/test-navigation';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  // Get first few events, venues, performers
  const [events, venues, performers] = await Promise.all([
    client.from('events').select('id, title').limit(3),
    client.from('venues').select('id, name').limit(3),
    client.from('performers').select('id, stage_name').limit(3),
  ]);
  
  return {
    events: events.data || [],
    venues: venues.data || [],
    performers: performers.data || [],
  };
};

export default function TestNavigation({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { events, venues, performers } = loaderData;
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Navigation Test Page</h1>
      
      <div className="space-y-8">
        {/* Test Events */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Events (First 3)</h2>
          <div className="space-y-2">
            {events.map((event) => (
              <div key={event.id} className="p-4 border rounded">
                <p>ID: {event.id}</p>
                <p>Title: {event.title}</p>
                <div className="mt-2 space-x-4">
                  <Link to={`/events/${event.id}`} className="text-blue-600 underline">
                    Link to /events/{event.id}
                  </Link>
                  <button 
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Navigate to /events/{event.id}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Test Venues */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Venues (First 3)</h2>
          <div className="space-y-2">
            {venues.map((venue) => (
              <div key={venue.id} className="p-4 border rounded">
                <p>ID: {venue.id}</p>
                <p>Name: {venue.name}</p>
                <div className="mt-2 space-x-4">
                  <Link to={`/venues/${venue.id}`} className="text-blue-600 underline">
                    Link to /venues/{venue.id}
                  </Link>
                  <button 
                    onClick={() => navigate(`/venues/${venue.id}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Navigate to /venues/{venue.id}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Test Performers */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Performers (First 3)</h2>
          <div className="space-y-2">
            {performers.map((performer) => (
              <div key={performer.id} className="p-4 border rounded">
                <p>ID: {performer.id}</p>
                <p>Name: {performer.stage_name}</p>
                <div className="mt-2 space-x-4">
                  <Link to={`/performers/${performer.id}`} className="text-blue-600 underline">
                    Link to /performers/{performer.id}
                  </Link>
                  <button 
                    onClick={() => navigate(`/performers/${performer.id}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Navigate to /performers/{performer.id}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}