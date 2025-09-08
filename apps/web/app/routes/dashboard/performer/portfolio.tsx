import React from 'react';
import { json } from 'react-router';
import { useLoaderData } from 'react-router';
import type { Route } from '~/types/app/routes/dashboard/performer/portfolio';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';
import { PerformerGrid } from '~/components/magic-patterns/components/performers/PerformerGrid';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return json({ 
        profile: null,
        portfolio: [],
        stats: {
          totalViews: 0,
          totalFollowers: 0,
          totalEvents: 0,
          averageRating: 0
        }
      });
    }

    // Get performer profile
    const { data: performer } = await client
      .from('performers')
      .select(`
        id,
        name,
        stage_name,
        bio,
        genres,
        location,
        price_range_min,
        price_range_max,
        images,
        profile_image_url,
        cover_image_url,
        social_links,
        services,
        technical_requirements,
        view_count,
        follower_count,
        rating,
        review_count,
        created_at
      `)
      .eq('user_id', user.id)
      .single();

    if (!performer) {
      return json({ 
        profile: null,
        portfolio: [],
        stats: {
          totalViews: 0,
          totalFollowers: 0,
          totalEvents: 0,
          averageRating: 0
        },
        needsProfile: true
      });
    }

    // Get portfolio items (photos, videos, audio samples)
    const { data: portfolioItems } = await client
      .from('performer_portfolio')
      .select('*')
      .eq('performer_id', performer.id)
      .order('position', { ascending: true });

    // Get past events for showcase
    const { data: pastEvents } = await client
      .from('events')
      .select(`
        id,
        title,
        start_datetime,
        image_url,
        venue:venues!events_venue_id_fkey(
          name,
          city
        )
      `)
      .eq('performer_id', performer.id)
      .eq('status', 'published')
      .lt('end_datetime', new Date().toISOString())
      .order('start_datetime', { ascending: false })
      .limit(12);

    // Get total event count
    const { count: totalEvents } = await client
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('performer_id', performer.id)
      .eq('status', 'published');

    // Transform data
    const profile = {
      id: performer.id,
      name: performer.name,
      stageName: performer.stage_name,
      bio: performer.bio,
      genres: performer.genres || [],
      location: performer.location,
      priceRange: {
        min: performer.price_range_min,
        max: performer.price_range_max
      },
      profileImage: performer.profile_image_url,
      coverImage: performer.cover_image_url,
      images: performer.images || [],
      socialLinks: performer.social_links || {},
      services: performer.services || [],
      technicalRequirements: performer.technical_requirements || [],
      memberSince: performer.created_at
    };

    const portfolio = [
      // Add portfolio items
      ...(portfolioItems || []).map(item => ({
        id: item.id,
        type: item.media_type as 'photo' | 'video' | 'audio',
        title: item.title,
        description: item.description,
        url: item.media_url,
        thumbnailUrl: item.thumbnail_url || item.media_url,
        duration: item.duration,
        position: item.position
      })),
      // Add past events as portfolio items
      ...(pastEvents || []).map((event, index) => ({
        id: `event-${event.id}`,
        type: 'event' as const,
        title: event.title,
        description: `${event.venue?.name || 'Venue'} - ${new Date(event.start_datetime).toLocaleDateString()}`,
        url: `/events/${event.id}`,
        thumbnailUrl: event.image_url || '',
        position: (portfolioItems?.length || 0) + index
      }))
    ];

    const stats = {
      totalViews: performer.view_count || 0,
      totalFollowers: performer.follower_count || 0,
      totalEvents: totalEvents || 0,
      averageRating: performer.rating || 0
    };

    return json({
      profile,
      portfolio,
      stats
    });

  } catch (error) {
    logger.error({ error }, 'Error loading performer portfolio');
    return json({ 
      profile: null,
      portfolio: [],
      stats: {
        totalViews: 0,
        totalFollowers: 0,
        totalEvents: 0,
        averageRating: 0
      }
    });
  }
};

export async function action({ request }: Route.ActionArgs) {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  const action = formData.get('_action');
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get performer profile
    const { data: performer } = await client
      .from('performers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!performer) {
      return json({ success: false, error: 'Performer profile not found' }, { status: 404 });
    }

    if (action === 'update-profile') {
      const updates: any = {};
      
      // Only update provided fields
      if (formData.has('stageName')) updates.stage_name = formData.get('stageName');
      if (formData.has('bio')) updates.bio = formData.get('bio');
      if (formData.has('genres')) updates.genres = JSON.parse(formData.get('genres') as string);
      if (formData.has('location')) updates.location = formData.get('location');
      if (formData.has('priceMin')) updates.price_range_min = parseFloat(formData.get('priceMin') as string);
      if (formData.has('priceMax')) updates.price_range_max = parseFloat(formData.get('priceMax') as string);
      if (formData.has('services')) updates.services = JSON.parse(formData.get('services') as string);
      if (formData.has('socialLinks')) updates.social_links = JSON.parse(formData.get('socialLinks') as string);
      
      updates.updated_at = new Date().toISOString();

      const { error } = await client
        .from('performers')
        .update(updates)
        .eq('id', performer.id);

      if (error) {
        logger.error({ error }, 'Error updating performer profile');
        return json({ success: false, error: error.message });
      }

      return json({ success: true });
    }

    if (action === 'add-portfolio-item') {
      const itemData = {
        performer_id: performer.id,
        media_type: formData.get('mediaType') as string,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        media_url: formData.get('mediaUrl') as string,
        thumbnail_url: formData.get('thumbnailUrl') as string,
        duration: formData.has('duration') ? parseInt(formData.get('duration') as string) : null,
        position: parseInt(formData.get('position') as string) || 0,
        created_at: new Date().toISOString()
      };

      const { data, error } = await client
        .from('performer_portfolio')
        .insert(itemData)
        .select()
        .single();

      if (error) {
        logger.error({ error }, 'Error adding portfolio item');
        return json({ success: false, error: error.message });
      }

      return json({ success: true, item: data });
    }

    if (action === 'remove-portfolio-item') {
      const itemId = formData.get('itemId') as string;
      
      const { error } = await client
        .from('performer_portfolio')
        .delete()
        .eq('id', itemId)
        .eq('performer_id', performer.id);

      if (error) {
        logger.error({ error }, 'Error removing portfolio item');
        return json({ success: false, error: error.message });
      }

      return json({ success: true });
    }

    if (action === 'reorder-portfolio') {
      const items = JSON.parse(formData.get('items') as string);
      
      // Update positions for all items
      const updates = items.map((item: any) => ({
        id: item.id,
        performer_id: performer.id,
        position: item.position
      }));

      const { error } = await client
        .from('performer_portfolio')
        .upsert(updates);

      if (error) {
        logger.error({ error }, 'Error reordering portfolio');
        return json({ success: false, error: error.message });
      }

      return json({ success: true });
    }

    return json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing portfolio action');
    return json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

/**
 * Performer portfolio and media gallery
 */
export default function PerformerPortfolioPage() {
  const data = useLoaderData<typeof loader>();
  return <PerformerGrid {...data} />;
}