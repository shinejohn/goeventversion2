import React from 'react';
import { HubGalleryPage } from '~/components/magic-patterns/pages/hub/[slug]/gallery';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/hub/$slug/gallery/+types';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const hubSlug = params.slug;
  
  try {
    // Get hub info
    const { data: hub, error: hubError } = await client
      .from('hubs')
      .select('*')
      .eq('slug', hubSlug)
      .single();
      
    if (hubError || !hub) {
      throw new Response('Hub not found', { status: 404 });
    }
    
    // Load gallery items
    const { data: galleryItems } = await client
      .from('hub_gallery')
      .select('*')
      .eq('hub_id', hub.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    return {
      hub,
      gallery: galleryItems || []
    };
    
  } catch (error) {
    console.error('Hub gallery loader error:', error);
    throw new Response('Hub not found', { status: 404 });
  }
};

export default function HubGalleryRoute({ loaderData }: Route.ComponentProps) {
  return <HubGalleryPage 
    hub={loaderData.hub}
    gallery={loaderData.gallery}
  />;
}