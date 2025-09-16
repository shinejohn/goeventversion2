import React from 'react';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '../+types/$id';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const hubId = params.id;
  
  try {
    const { data: venues, error } = await client
      .from('venues')
      .select('*')
      .eq('hub_id', hubId);
    
    if (error) {
      console.error('Error loading venues:', error);
      return { venues: [] };
    }
    
    return { venues: venues || [] };
  } catch (error) {
    console.error('Venues loader error:', error);
    return { venues: [] };
  }
};

export default function HubVenuesRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hub Venues</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loaderData.venues.map((venue: any) => (
            <div key={venue.id} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{venue.name}</h3>
              <p className="text-gray-600 mb-4">{venue.description}</p>
              <p className="text-sm text-gray-500">{venue.address}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}