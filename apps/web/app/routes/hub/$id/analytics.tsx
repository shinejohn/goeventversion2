import React from 'react';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '../+types/$id';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const hubId = params.id;
  
  try {
    const { data: hub, error } = await client
      .from('community_hubs')
      .select('*')
      .eq('id', hubId)
      .single();
    
    if (error) {
      console.error('Error loading hub:', error);
      return { hub: null };
    }
    
    return { hub };
  } catch (error) {
    console.error('Analytics loader error:', error);
    return { hub: null };
  }
};

export default function HubAnalyticsRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hub Analytics</h1>
        {loaderData.hub ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Members</h3>
              <p className="text-3xl font-bold text-indigo-600">{loaderData.hub.members_count || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Events</h3>
              <p className="text-3xl font-bold text-indigo-600">{loaderData.hub.events_count || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Posts</h3>
              <p className="text-3xl font-bold text-indigo-600">{loaderData.hub.posts_count || 0}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Hub not found</p>
        )}
      </div>
    </div>
  );
}