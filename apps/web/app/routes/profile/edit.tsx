import React from 'react';
import type { Route } from './+types/edit';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';

// Magic Patterns imports
import { UserProfileSettingsPage } from '~/components/magic-patterns/pages/profile/UserProfileSettingsPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * Profile Edit Route - Customize your social influencer profile
 * Where you make your mark on the local social scene!
 * 
 * Your profile is your social superpower! ✨👤
 */

// Form data schema for profile updates
const ProfileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  interests: z.array(z.string()).optional(),
  visibility_level: z.enum(['public', 'friends', 'private']).optional(),
  show_liked_venues: z.coerce.boolean().optional(),
  show_liked_performers: z.coerce.boolean().optional(),
  allow_calendar_sharing: z.coerce.boolean().optional(),
  social_links: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    tiktok: z.string().optional(),
  }).optional(),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    logger.info({ loader: 'profile-edit' }, '👤 Loading profile settings for editing');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user
    const { data: { user }, error: authError } = await client.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User not authenticated');
    }
    
    // Parallel data fetching for profile settings 🚀
    const [userProfileQuery, likedVenuesQuery, likedPerformersQuery, sharedCalendarsQuery] = await Promise.all([
      // Get user profile data
      client
        .from('accounts')
        .select(`
          *,
          user_preferences (
            interests,
            visibility_level,
            show_liked_venues,
            show_liked_performers,
            allow_calendar_sharing,
            notification_preferences
          ),
          social_links (
            platform,
            url
          )
        `)
        .eq('id', user.id)
        .single(),
        
      // Get liked venues count
      client
        .from('liked_venues')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id),
        
      // Get liked performers count  
      client
        .from('liked_performers')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id),
        
      // Get shared calendars count
      client
        .from('shared_calendars')
        .select('id', { count: 'exact' })
        .eq('created_by', user.id)
    ]);
    
    const { data: profile, error: profileError } = userProfileQuery;
    const { count: likedVenuesCount } = likedVenuesQuery;
    const { count: likedPerformersCount } = likedPerformersQuery;  
    const { count: sharedCalendarsCount } = sharedCalendarsQuery;
    
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
      email: user.email,
      bio: profile.bio || '',
      location: profile.location || '',
      website: profile.website || '',
      pictureUrl: profile.picture_url,
      interests: profile.user_preferences?.interests || [],
      visibilityLevel: profile.user_preferences?.visibility_level || 'public',
      showLikedVenues: profile.user_preferences?.show_liked_venues ?? true,
      showLikedPerformers: profile.user_preferences?.show_liked_performers ?? true,
      allowCalendarSharing: profile.user_preferences?.allow_calendar_sharing ?? true,
      socialLinks: socialLinksObj,
      notificationPreferences: profile.user_preferences?.notification_preferences || {
        email_events: true,
        email_social: false,
        push_events: true,
        push_social: true,
      },
      stats: {
        likedVenues: likedVenuesCount || 0,
        likedPerformers: likedPerformersCount || 0,
        sharedCalendars: sharedCalendarsCount || 0,
      },
    };
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'profile-edit',
      duration,
      profileId: profile.id
    }, '👤 Profile settings loaded for editing');
    
    return {
      profile: profileData,
      user: {
        id: user.id,
        email: user.email,
      },
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'profile-edit',
      url: request.url 
    }, '😢 Error loading profile settings');
    
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
    
    // Parse and validate form data
    const data = Object.fromEntries(formData);
    
    // Handle interests as JSON array if provided
    if (data.interests && typeof data.interests === 'string') {
      try {
        data.interests = JSON.parse(data.interests as string);
      } catch {
        delete data.interests;
      }
    }
    
    // Handle social links as JSON object if provided
    if (data.social_links && typeof data.social_links === 'string') {
      try {
        data.social_links = JSON.parse(data.social_links as string);
      } catch {
        delete data.social_links;
      }
    }
    
    const validatedData = ProfileUpdateSchema.parse(data);
    
    logger.info({ 
      action: 'profile-update',
      userId: user.id,
      fields: Object.keys(validatedData)
    }, '👤 Updating user profile');
    
    // Update profile in parallel with preferences and social links
    const updates = [];
    
    // Update main account data
    if (validatedData.name || validatedData.bio || validatedData.location || validatedData.website !== undefined) {
      updates.push(
        client
          .from('accounts')
          .update({
            ...(validatedData.name && { name: validatedData.name }),
            ...(validatedData.bio && { bio: validatedData.bio }),
            ...(validatedData.location && { location: validatedData.location }),
            ...(validatedData.website !== undefined && { website: validatedData.website }),
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)
      );
    }
    
    // Update user preferences
    if (validatedData.interests || 
        validatedData.visibility_level || 
        validatedData.show_liked_venues !== undefined ||
        validatedData.show_liked_performers !== undefined ||
        validatedData.allow_calendar_sharing !== undefined) {
      
      updates.push(
        client
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            ...(validatedData.interests && { interests: validatedData.interests }),
            ...(validatedData.visibility_level && { visibility_level: validatedData.visibility_level }),
            ...(validatedData.show_liked_venues !== undefined && { show_liked_venues: validatedData.show_liked_venues }),
            ...(validatedData.show_liked_performers !== undefined && { show_liked_performers: validatedData.show_liked_performers }),
            ...(validatedData.allow_calendar_sharing !== undefined && { allow_calendar_sharing: validatedData.allow_calendar_sharing }),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
      );
    }
    
    // Update social links if provided
    if (validatedData.social_links) {
      // Delete existing social links first
      updates.push(
        client
          .from('social_links')
          .delete()
          .eq('user_id', user.id)
      );
      
      // Insert new social links
      const socialLinksArray = Object.entries(validatedData.social_links)
        .filter(([_, url]) => url && url.trim())
        .map(([platform, url]) => ({
          user_id: user.id,
          platform,
          url,
        }));
      
      if (socialLinksArray.length > 0) {
        updates.push(
          client
            .from('social_links')
            .insert(socialLinksArray)
        );
      }
    }
    
    // Execute all updates
    await Promise.all(updates);
    
    logger.info({ 
      action: 'profile-update',
      userId: user.id
    }, '✅ Profile updated successfully');
    
    return { 
      success: true,
      message: 'Profile updated successfully!'
    };
    
  } catch (error) {
    logger.error({ error, action: 'profile-update' }, '❌ Failed to update profile');
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update profile'
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: UserProfileSettingsPage,
  transformData: (loaderData) => ({
    profile: loaderData.profile,
    user: loaderData.user,
  }),
});

// SEO meta tags 🎯
export const meta = () => {
  return [
    { title: 'Edit Profile - Customize Your Social Presence | When The Fun' },
    { 
      name: 'description', 
      content: 'Customize your social influencer profile, privacy settings, and social links to build your local presence.' 
    },
    { property: 'og:title', content: 'Edit Profile - When The Fun' },
    { property: 'og:description', content: 'Customize your social presence' },
    { property: 'og:type', content: 'website' },
  ];
};

// Cache headers for performance 🚀
export const headers = () => {
  return {
    'Cache-Control': 'private, no-cache', // No caching for profile editing
  };
};