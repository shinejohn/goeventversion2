import React from 'react';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/$id';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const calendarId = params.id;
  
  try {
    // Load calendar details
    const { data: calendar, error: calendarError } = await client
      .from('calendars')
      .select(`
        *,
        owner:auth.users(id, email),
        events_count:calendar_events(count),
        subscribers_count:calendar_subscriptions(count)
      `)
      .eq('id', calendarId)
      .single();
    
    if (calendarError || !calendar) {
      console.warn('Calendar not found:', { calendarError, calendarId });
      return { calendar: null, events: [], isSubscribed: false };
    }
    
    // Load calendar events
    const { data: events, error: eventsError } = await client
      .from('calendar_events')
      .select(`
        *,
        event:events(*)
      `)
      .eq('calendar_id', calendarId)
      .order('created_at', { ascending: false });
    
    if (eventsError) {
      console.error('Error loading calendar events:', eventsError);
    }
    
    // Check if current user is subscribed (if authenticated)
    let isSubscribed = false;
    try {
      const { data: subscription } = await client
        .from('calendar_subscriptions')
        .select('id')
        .eq('calendar_id', calendarId)
        .single();
      
      isSubscribed = !!subscription;
    } catch (error) {
      // User not authenticated or not subscribed
      isSubscribed = false;
    }
    
    return {
      calendar,
      events: events || [],
      isSubscribed
    };
    
  } catch (error) {
    console.error('Calendar detail loader error:', error);
    return { calendar: null, events: [], isSubscribed: false };
  }
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const calendarId = params.id;
  const formData = await request.formData();
  const action = formData.get('action') as string;
  
  try {
    if (action === 'subscribe') {
      const { error } = await client
        .from('calendar_subscriptions')
        .insert({
          calendar_id: calendarId,
          user_id: (await client.auth.getUser()).data.user?.id
        });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, message: 'Successfully subscribed to calendar' };
    } else if (action === 'unsubscribe') {
      const { error } = await client
        .from('calendar_subscriptions')
        .delete()
        .eq('calendar_id', calendarId)
        .eq('user_id', (await client.auth.getUser()).data.user?.id);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, message: 'Successfully unsubscribed from calendar' };
    }
    
    return { success: false, error: 'Invalid action' };
  } catch (error) {
    return { success: false, error: 'Failed to perform action' };
  }
};

export default function CalendarDetailPage({ loaderData, actionData }: Route.ComponentProps) {
  if (!loaderData.calendar) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Calendar Not Found</h1>
            <p className="mt-2 text-gray-600">The calendar you're looking for doesn't exist or is private.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{loaderData.calendar.name}</h1>
              <p className="mt-2 text-gray-600">{loaderData.calendar.description}</p>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span>by {loaderData.calendar.owner?.email || 'Unknown'}</span>
                <span className="mx-2">•</span>
                <span>{loaderData.calendar.events_count || 0} events</span>
                <span className="mx-2">•</span>
                <span>{loaderData.calendar.subscribers_count || 0} subscribers</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {loaderData.isSubscribed ? (
                <form method="post">
                  <input type="hidden" name="action" value="unsubscribe" />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Unsubscribe
                  </button>
                </form>
              ) : (
                <form method="post">
                  <input type="hidden" name="action" value="subscribe" />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {actionData?.success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {actionData.message}
          </div>
        )}
        
        {actionData?.error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {actionData.error}
          </div>
        )}
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Calendar Events</h2>
            
            {loaderData.events.length > 0 ? (
              <div className="space-y-4">
                {loaderData.events.map((calendarEvent: any) => (
                  <div key={calendarEvent.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {calendarEvent.event?.title || 'Untitled Event'}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {calendarEvent.event?.description || 'No description available'}
                    </p>
                    {calendarEvent.event?.start_datetime && (
                      <p className="text-sm text-gray-500 mt-2">
                        📅 {new Date(calendarEvent.event.start_datetime).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500">No events in this calendar yet</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
