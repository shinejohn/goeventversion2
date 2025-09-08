import React from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { Route } from '~/types/app/routes/dashboard/fan';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { FanDashboardPage } from '~/components/magic-patterns/pages/my/FanDashboardPage';
import { getLogger } from '@kit/shared/logger';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return json({ 
        upcomingEvents: [],
        followedArtists: [],
        likedVenues: [],
        recentBookings: [],
        recommendations: []
      });
    }

    // Fetch upcoming events from user's bookings
    const { data: bookings } = await client
      .from('bookings')
      .select(`
        id,
        booking_date,
        status,
        event:events!bookings_event_id_fkey(
          id,
          title,
          slug,
          start_datetime,
          image_url,
          venue:venues!events_venue_id_fkey(
            id,
            name,
            city,
            state
          )
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'confirmed')
      .gte('booking_date', new Date().toISOString())
      .order('booking_date', { ascending: true })
      .limit(10);

    // Fetch liked performers
    const { data: likedPerformers } = await client
      .from('liked_performers')
      .select(`
        performer:performers!liked_performers_performer_id_fkey(
          id,
          name,
          stage_name,
          bio,
          genre,
          image_url,
          rating
        )
      `)
      .eq('user_id', user.id)
      .limit(12);

    // Fetch liked venues
    const { data: likedVenues } = await client
      .from('liked_venues')
      .select(`
        venue:venues!liked_venues_venue_id_fkey(
          id,
          name,
          city,
          state,
          image_url,
          category,
          rating
        )
      `)
      .eq('user_id', user.id)
      .limit(12);

    // Fetch social feed posts from friends
    const { data: friendships } = await client
      .from('friendships')
      .select('friend_id, user_id')
      .eq('status', 'accepted')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

    const friendIds = friendships?.map(f => 
      f.user_id === user.id ? f.friend_id : f.user_id
    ) || [];

    const { data: socialPosts } = await client
      .from('social_posts')
      .select(`
        id,
        content,
        image_url,
        created_at,
        likes_count,
        comments_count,
        user:auth.users!social_posts_user_id_fkey(
          id,
          email,
          raw_user_meta_data
        ),
        event:events!social_posts_event_id_fkey(
          id,
          title,
          slug
        ),
        venue:venues!social_posts_venue_id_fkey(
          id,
          name,
          slug
        )
      `)
      .in('user_id', [...friendIds, user.id])
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(20);

    // Get recommendations based on user's preferences
    const { data: recommendations } = await client
      .from('events')
      .select(`
        id,
        title,
        slug,
        start_datetime,
        image_url,
        price_min,
        category,
        venue:venues!events_venue_id_fkey(
          id,
          name,
          city,
          state
        )
      `)
      .gte('start_datetime', new Date().toISOString())
      .eq('status', 'active')
      .order('start_datetime', { ascending: true })
      .limit(6);

    return json({ 
      upcomingEvents: bookings?.map(b => ({
        id: b.event.id,
        title: b.event.title,
        date: b.event.start_datetime,
        venue: b.event.venue.name,
        location: `${b.event.venue.city}, ${b.event.venue.state}`,
        image: b.event.image_url
      })) || [],
      followedArtists: likedPerformers?.map(l => ({
        id: l.performer.id,
        name: l.performer.stage_name || l.performer.name,
        genre: l.performer.genre,
        image: l.performer.image_url,
        rating: l.performer.rating
      })) || [],
      likedVenues: likedVenues?.map(l => ({
        id: l.venue.id,
        name: l.venue.name,
        location: `${l.venue.city}, ${l.venue.state}`,
        category: l.venue.category,
        image: l.venue.image_url,
        rating: l.venue.rating
      })) || [],
      recentBookings: bookings || [],
      recommendations: recommendations?.map(e => ({
        id: e.id,
        title: e.title,
        date: e.start_datetime,
        venue: e.venue.name,
        location: `${e.venue.city}, ${e.venue.state}`,
        price: e.price_min,
        category: e.category,
        image: e.image_url
      })) || [],
      socialFeed: socialPosts?.map(post => ({
        id: post.id,
        content: post.content,
        image: post.image_url,
        created_at: post.created_at,
        likes: post.likes_count,
        comments: post.comments_count,
        user: {
          name: post.user?.raw_user_meta_data?.name || post.user?.email?.split('@')[0] || 'Unknown',
          avatar: post.user?.raw_user_meta_data?.avatar_url || null
        },
        event: post.event,
        venue: post.venue
      })) || []
    });

  } catch (error) {
    logger.error({ error }, 'Error loading fan dashboard');
    return json({ 
      upcomingEvents: [],
      followedArtists: [],
      likedVenues: [],
      recentBookings: [],
      recommendations: [],
      socialFeed: []
    });
  }
};

export default function FanDashboardRoute() {
  const data = useLoaderData<typeof loader>();
  return <FanDashboardPage {...data} />;
}