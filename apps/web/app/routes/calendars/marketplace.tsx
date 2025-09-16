import React from 'react';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/marketplace';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: calendars, error } = await client
      .from('calendars')
      .select(`
        *,
        owner:auth.users(id, email),
        events_count:calendar_events(count),
        subscribers_count:calendar_subscriptions(count)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading calendars:', error);
      return { calendars: [] };
    }
    
    return { calendars: calendars || [] };
  } catch (error) {
    console.error('Calendar marketplace loader error:', error);
    return { calendars: [] };
  }
};

export default function CalendarMarketplacePage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Calendar Marketplace</h1>
          <p className="mt-2 text-gray-600">Discover and subscribe to public calendars</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loaderData.calendars.map((calendar: any) => (
            <div key={calendar.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {calendar.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Public
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">
                  {calendar.description || 'No description available'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>📅 {calendar.events_count || 0} events</span>
                  <span>👥 {calendar.subscribers_count || 0} subscribers</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    by {calendar.owner?.email || 'Unknown'}
                  </span>
                  <a
                    href={`/calendars/${calendar.id}`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    View Calendar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {loaderData.calendars.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No public calendars available</div>
            <p className="text-gray-400 mt-2">Check back later for new calendars to subscribe to!</p>
          </div>
        )}
      </div>
    </div>
  );
}