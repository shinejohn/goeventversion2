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
    console.error('Gallery loader error:', error);
    return { hub: null };
  }
};

export default function HubGalleryRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hub Gallery</h1>
        {loaderData.hub ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loaderData.hub.banner_image && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img 
                  src={loaderData.hub.banner_image} 
                  alt={loaderData.hub.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">Banner Image</h3>
                </div>
              </div>
            )}
            {loaderData.hub.logo && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img 
                  src={loaderData.hub.logo} 
                  alt={`${loaderData.hub.name} logo`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">Logo</h3>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Hub not found</p>
        )}
      </div>
    </div>
  );
}