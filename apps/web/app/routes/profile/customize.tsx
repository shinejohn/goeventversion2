import React from 'react';
import type { Route } from './+types/customize';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';

// Magic Patterns imports
import { UserProfilePage } from '~/components/magic-patterns/pages/profile/UserProfilePage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * Profile Customize Route - Showcase your social influence!
 * Your public profile where the local community discovers you
 * 
 * Make your social mark shine! ✨🌟
 */

// Query parameter schema for profile customization
const ProfileCustomizeSchema = z.object({
  tab: z.enum(['overview', 'calendar', 'liked', 'comments', 'shared-calendars']).optional().default('overview'),
  preview: z.coerce.boolean().optional().default(false),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    // Parse query parameters for tab navigation
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const params = ProfileCustomizeSchema.parse(queryParams);
    
    logger.info({ 
      loader: 'profile-customize',
      params 
    }, '👤 Loading profile for customization preview');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user
    const { data: { user }, error: authError } = await client.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }
    
    // Parallel data fetching for profile showcase 🚀
    const [userProfileQuery, followersQuery, calendarEventsQuery, likedVenuesQuery, likedPerformersQuery, commentsQuery, sharedCalendarsQuery] = await Promise.all([
      // Get user profile data with social stats
      client
        .from('accounts')
        .select(`
          *,
          user_preferences (
            interests,
            visibility_level,
            show_liked_venues,
            show_liked_performers,
            allow_calendar_sharing
          ),
          social_links (
            platform,
            url
          )
        `)
        .eq('id', user.id)
        .single(),
        
      // Get followers/following counts
      client
        .from('friendships')
        .select('id', { count: 'exact' })
        .eq('following_id', user.id)
        .eq('status', 'accepted'),
        
      // Get recent calendar events
      client
        .from('bookings')
        .select(`
          *,
          events!event_id (
            id,
            title,
            start_date,
            category,
            image_url,
            venues!venue_id (
              name,
              city
            )
          )
        `)
        .eq('account_id', user.id)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(6),
        
      // Get liked venues
      client
        .from('liked_venues')
        .select(`
          id,
          venues!venue_id (
            id,
            name,
            address,
            city,
            category,
            image_url,
            rating
          )
        `)
        .eq('user_id', user.id)
        .limit(12),
        
      // Get liked performers
      client
        .from('liked_performers')
        .select(`
          id,
          performers!performer_id (
            id,
            name,
            bio,
            profile_image_url,
            categories,
            city,
            rating
          )
        `)
        .eq('user_id', user.id)
        .limit(12),
        
      // Get recent comments
      client
        .from('event_comments')
        .select(`
          id,
          content,
          rating,
          created_at,
          events!event_id (
            id,
            title,
            image_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(8),
        
      // Get shared calendars
      client
        .from('shared_calendars')
        .select(`
          id,
          name,
          description,
          visibility,
          created_at,
          subscriber_count
        `)
        .eq('created_by', user.id)
        .order('subscriber_count', { ascending: false })
        .limit(6)
    ]);
    
    const { data: profile, error: profileError } = userProfileQuery;
    const { count: followersCount } = followersQuery;
    const { data: calendarEvents } = calendarEventsQuery;
    const { data: likedVenues } = likedVenuesQuery;
    const { data: likedPerformers } = likedPerformersQuery;
    const { data: comments } = commentsQuery;
    const { data: sharedCalendars } = sharedCalendarsQuery;
    
    if (profileError) {
      logger.error({ error: profileError }, 'Failed to load user profile');
      throw profileError;
    }
    
    // Transform social links array to object
    const socialLinksObj = (profile.social_links || []).reduce((acc: any, link: any) => {
      acc[link.platform] = link.url;
      return acc;
    }, {});
    
    const profileData = {
      id: profile.id,
      name: profile.name,
      bio: profile.bio || '',
      location: profile.location || '',
      website: profile.website || '',
      pictureUrl: profile.picture_url,
      joinedDate: profile.created_at,
      interests: profile.user_preferences?.interests || [],
      visibilityLevel: profile.user_preferences?.visibility_level || 'public',
      socialLinks: socialLinksObj,
      stats: {
        followers: followersCount || 0,
        upcomingEvents: calendarEvents?.length || 0,
        likedVenues: likedVenues?.length || 0,
        likedPerformers: likedPerformers?.length || 0,
        totalComments: comments?.length || 0,
        sharedCalendars: sharedCalendars?.length || 0,
      },
      upcomingEvents: (calendarEvents || []).map(booking => ({
        id: booking.events?.id || booking.id,
        title: booking.events?.title || 'Event',
        date: booking.event_date,
        category: booking.events?.category || 'other',
        imageUrl: booking.events?.image_url,
        venue: booking.events?.venues?.name || 'TBA',
        city: booking.events?.venues?.city || '',
      })),
      likedVenues: (likedVenues || []).map(like => ({
        id: like.venues?.id || like.id,
        name: like.venues?.name || 'Venue',
        address: like.venues?.address || '',
        city: like.venues?.city || '',
        category: like.venues?.category || 'venue',
        imageUrl: like.venues?.image_url,
        rating: like.venues?.rating || 0,
      })),
      likedPerformers: (likedPerformers || []).map(like => ({
        id: like.performers?.id || like.id,
        name: like.performers?.name || 'Performer',
        bio: like.performers?.bio || '',
        imageUrl: like.performers?.profile_image_url,
        categories: like.performers?.categories || [],
        city: like.performers?.city || '',
        rating: like.performers?.rating || 0,
      })),
      recentComments: (comments || []).map(comment => ({
        id: comment.id,
        content: comment.content,
        rating: comment.rating,
        createdAt: comment.created_at,
        event: comment.events ? {
          id: comment.events.id,
          title: comment.events.title,
          imageUrl: comment.events.image_url,
        } : null,
      })),
      sharedCalendars: (sharedCalendars || []).map(calendar => ({
        id: calendar.id,
        name: calendar.name,
        description: calendar.description || '',
        visibility: calendar.visibility,
        subscribers: calendar.subscriber_count || 0,
        createdAt: calendar.created_at,
      })),
    };
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'profile-customize',
      duration,
      profileId: profile.id,
      tab: params.tab
    }, '👤 Profile loaded for customization');
    
    return {
      profile: profileData,
      activeTab: params.tab,
      isPreview: params.preview,
      user: {
        id: user.id,
        email: user.email,
      },
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'profile-customize',
      url: request.url 
    }, '😢 Error loading profile for customization');
    
    throw error;
  }
};

export const action = async ({ request }: Route.ActionArgs) => {
  const logger = await getLogger();
  
  try {
    const client = getSupabaseServerClient(request);
    const formData = await request.formData();
    
    // Get current user
    const { data: { user }, error: authError } = await client.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }
    
    const action = formData.get('action') as string;
    
    logger.info({ 
      action: 'profile-customize-action',
      actionType: action,
      userId: user.id
    }, '👤 Processing profile customization action');
    
    switch (action) {
      case 'toggle-visibility':
        const visibility = formData.get('visibility') as 'public' | 'friends' | 'private';
        await client
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            visibility_level: visibility,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
        
        return { success: true, message: 'Visibility updated successfully!' };
        
      case 'toggle-calendar-sharing':
        const allowSharing = formData.get('allow_sharing') === 'true';
        await client
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            allow_calendar_sharing: allowSharing,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
        
        return { success: true, message: 'Calendar sharing settings updated!' };
        
      case 'update-bio':
        const bio = formData.get('bio') as string;
        await client
          .from('accounts')
          .update({
            bio: bio.slice(0, 500), // Limit bio length
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
        
        return { success: true, message: 'Bio updated successfully!' };
        
      default:
        return { success: false, error: 'Unknown action' };
    }
    
  } catch (error) {
    logger.error({ error, action: 'profile-customize' }, '❌ Failed to process customization action');
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to process action'
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: UserProfilePage,
  transformData: (loaderData) => ({
    profile: loaderData.profile,
    activeTab: loaderData.activeTab,
    isPreview: loaderData.isPreview,
    user: loaderData.user,
  }),
});

// SEO meta tags 🎯
export const meta = ({ data }: Route.MetaArgs) => {
  const profile = data?.profile;
  const profileName = profile?.name || 'User';
  
  return [
    { title: `${profileName}'s Profile - Social Influencer | When The Fun` },
    { 
      name: 'description', 
      content: `Discover ${profileName}'s social presence, upcoming events, liked venues, and local recommendations.` 
    },
    { property: 'og:title', content: `${profileName}'s Profile - When The Fun` },
    { property: 'og:description', content: `${profileName}'s social profile and local influence` },
    { property: 'og:type', content: 'profile' },
    ...(profile?.pictureUrl ? [{ property: 'og:image', content: profile.pictureUrl }] : []),
  ];
};

// Cache headers for performance 🚀
export const headers = () => {
  return {
    'Cache-Control': 'private, max-age=300', // 5 minute cache for profile preview
  };
};