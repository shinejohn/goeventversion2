import React from 'react';
import type { Route } from './+types/saved-items';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

// Magic Patterns imports
import { SavedItemsPage } from '~/components/magic-patterns/pages/profile/SavedItemsPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * Saved Items Route - User's saved events, venues, and performers
 * Personal favorites and bookmarks management
 * 
 * Let's organize those favorites! ❤️✨
 */

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const logger = await getLogger();
  
  try {
    // Get current user
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      throw new Response('Unauthorized', { status: 401 });
    }
    
    // Fetch user's saved items
    const { data: savedItems, error } = await client
      .from('user_saved_items')
      .select(`
        *,
        event:events(
          id,
          title,
          start_datetime,
          end_datetime,
          venue_id,
          venue:venues(name, address, city, state)
        ),
        venue:venues(
          id,
          name,
          address,
          city,
          state
        ),
        performer:performers(
          id,
          name,
          genre,
          profile_image_url
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      logger.error({ error }, 'Error fetching saved items');
    }
    
    // Transform saved items data for UI
    const transformedItems = savedItems?.map(item => ({
      id: item.id,
      type: item.item_type, // 'event', 'venue', 'performer'
      itemId: item.item_id,
      savedAt: item.created_at,
      event: item.event ? {
        id: item.event.id,
        title: item.event.title,
        startDate: item.event.start_datetime || item.event.start_date,
        endDate: item.event.end_datetime || item.event.end_date,
        venue: item.event.venue?.name || 'Unknown Venue',
        location: item.event.venue ? 
          `${item.event.venue.city}, ${item.event.venue.state}` : 
          'Unknown Location'
      } : null,
      venue: item.venue ? {
        id: item.venue.id,
        name: item.venue.name,
        address: item.venue.address,
        location: `${item.venue.city}, ${item.venue.state}`
      } : null,
      performer: item.performer ? {
        id: item.performer.id,
        name: item.performer.name,
        genre: item.performer.genre,
        image: item.performer.profile_image_url
      } : null
    })) || [];
    
    // Group items by type
    const events = transformedItems.filter(item => item.type === 'event');
    const venues = transformedItems.filter(item => item.type === 'venue');
    const performers = transformedItems.filter(item => item.type === 'performer');
    
    return {
      title: 'Saved Items - GoEventCity',
      savedItems: {
        events,
        venues,
        performers
      },
      user: {
        id: user.id,
        email: user.email
      }
    };
  } catch (error) {
    logger.error({ error }, 'Saved items loader error');
    return {
      title: 'Saved Items - GoEventCity',
      savedItems: {
        events: [],
        venues: [],
        performers: []
      },
      user: null,
      error: 'Failed to load saved items'
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: SavedItemsPage,
  transformData: (loaderData) => ({
    savedItems: loaderData.savedItems,
    user: loaderData.user,
    error: loaderData.error
  }),
});

// SEO meta tags 🎯
export const meta = ({ data }: Route.MetaArgs) => [
  {
    title: data?.title || 'Saved Items - GoEventCity',
  },
  {
    name: 'description',
    content: 'Manage your saved events, venues, and performers on GoEventCity',
  },
];
