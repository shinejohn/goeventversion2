import React from 'react';
import { json, redirect } from 'react-router';
import { useLoaderData } from 'react-router';
import type { Route } from '~/types/app/routes/settings/account';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';
import { AccountSettings } from '~/components/magic-patterns/components/account/AccountSettings';
import { z } from 'zod';

// Account preferences schema
const AccountPreferencesSchema = z.object({
  displayName: z.string().min(1).max(100),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  location: z.string().max(200).optional(),
  bio: z.string().max(1000).optional(),
  profileImage: z.string().url().optional().or(z.literal('')),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    language: z.enum(['en', 'es', 'fr']).default('en'),
    emailNotifications: z.boolean().default(true),
    pushNotifications: z.boolean().default(true),
    marketingEmails: z.boolean().default(false),
    eventReminders: z.boolean().default(true),
    weeklyDigest: z.boolean().default(true)
  }).default({})
});

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return redirect('/auth/login');
    }

    // Get user profile data
    const { data: profile } = await client
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get user roles
    const { data: roles } = await client
      .from('user_roles')
      .select('role_type, is_active')
      .eq('user_id', user.id);

    // Get account statistics
    const userRoleTypes = roles?.filter(r => r.is_active).map(r => r.role_type) || [];
    
    // Count stats based on roles
    let stats = {
      eventsAttended: 0,
      eventsOrganized: 0,
      performancesGiven: 0,
      venuesManaged: 0
    };

    if (userRoleTypes.includes('fan')) {
      const { count } = await client
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed');
      stats.eventsAttended = count || 0;
    }

    if (userRoleTypes.includes('organizer')) {
      const { count } = await client
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('organizer_id', user.id);
      stats.eventsOrganized = count || 0;
    }

    if (userRoleTypes.includes('performer')) {
      const { data: performer } = await client
        .from('performers')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (performer) {
        const { count } = await client
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('performer_id', performer.id)
          .eq('status', 'published')
          .lt('end_datetime', new Date().toISOString());
        stats.performancesGiven = count || 0;
      }
    }

    if (userRoleTypes.includes('venue_manager')) {
      const { count } = await client
        .from('venues')
        .select('*', { count: 'exact', head: true })
        .eq('manager_id', user.id)
        .eq('status', 'active');
      stats.venuesManaged = count || 0;
    }

    // Get notification settings
    const { data: notificationSettings } = await client
      .from('user_notification_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const accountData = {
      id: user.id,
      displayName: profile?.display_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
      email: user.email || '',
      phoneNumber: profile?.phone_number || '',
      location: profile?.location || '',
      bio: profile?.bio || '',
      profileImage: profile?.profile_image_url || '',
      memberSince: user.created_at,
      activeRoles: userRoleTypes,
      preferences: {
        theme: profile?.theme || 'auto',
        language: profile?.language || 'en',
        emailNotifications: notificationSettings?.email_notifications ?? true,
        pushNotifications: notificationSettings?.push_notifications ?? true,
        marketingEmails: notificationSettings?.marketing_emails ?? false,
        eventReminders: notificationSettings?.event_reminders ?? true,
        weeklyDigest: notificationSettings?.weekly_digest ?? true
      },
      stats,
      lastLoginAt: user.last_sign_in_at
    };

    return json({ account: accountData });

  } catch (error) {
    logger.error({ error }, 'Error loading account settings');
    return json({ account: null });
  }
};

export const action = async ({ request }: Route.ActionArgs) => {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  const action = formData.get('_action');
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (action === 'update-profile') {
      const profileData = {
        displayName: formData.get('displayName'),
        phoneNumber: formData.get('phoneNumber'),
        location: formData.get('location'),
        bio: formData.get('bio'),
        profileImage: formData.get('profileImage')
      };

      const result = AccountPreferencesSchema.pick({ 
        displayName: true, 
        phoneNumber: true, 
        location: true, 
        bio: true, 
        profileImage: true 
      }).safeParse(profileData);

      if (!result.success) {
        return json({ 
          success: false, 
          error: 'Invalid profile data',
          errors: result.error.flatten()
        });
      }

      const { displayName, phoneNumber, location, bio, profileImage } = result.data;

      // Update user profile
      const { error } = await client
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          display_name: displayName,
          phone_number: phoneNumber,
          location: location,
          bio: bio,
          profile_image_url: profileImage,
          updated_at: new Date().toISOString()
        });

      if (error) {
        logger.error({ error }, 'Error updating profile');
        return json({ success: false, error: error.message });
      }

      return json({ success: true });
    }

    if (action === 'update-preferences') {
      const prefsData = {
        theme: formData.get('theme'),
        language: formData.get('language'),
        emailNotifications: formData.get('emailNotifications') === 'true',
        pushNotifications: formData.get('pushNotifications') === 'true',
        marketingEmails: formData.get('marketingEmails') === 'true',
        eventReminders: formData.get('eventReminders') === 'true',
        weeklyDigest: formData.get('weeklyDigest') === 'true'
      };

      const result = AccountPreferencesSchema.shape.preferences.safeParse(prefsData);

      if (!result.success) {
        return json({ 
          success: false, 
          error: 'Invalid preferences data',
          errors: result.error.flatten()
        });
      }

      const prefs = result.data;

      // Update user preferences
      const { error: profileError } = await client
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          theme: prefs.theme,
          language: prefs.language,
          updated_at: new Date().toISOString()
        });

      // Update notification settings
      const { error: notifyError } = await client
        .from('user_notification_settings')
        .upsert({
          user_id: user.id,
          email_notifications: prefs.emailNotifications,
          push_notifications: prefs.pushNotifications,
          marketing_emails: prefs.marketingEmails,
          event_reminders: prefs.eventReminders,
          weekly_digest: prefs.weeklyDigest,
          updated_at: new Date().toISOString()
        });

      if (profileError || notifyError) {
        logger.error({ profileError, notifyError }, 'Error updating preferences');
        return json({ success: false, error: 'Failed to update preferences' });
      }

      return json({ success: true });
    }

    if (action === 'change-password') {
      const currentPassword = formData.get('currentPassword') as string;
      const newPassword = formData.get('newPassword') as string;

      if (!newPassword || newPassword.length < 8) {
        return json({ 
          success: false, 
          error: 'Password must be at least 8 characters long' 
        });
      }

      const { error } = await client.auth.updateUser({
        password: newPassword
      });

      if (error) {
        logger.error({ error }, 'Error changing password');
        return json({ success: false, error: 'Failed to change password' });
      }

      return json({ success: true });
    }

    if (action === 'delete-account') {
      // This would need additional security checks and OTP verification
      const confirmText = formData.get('confirmText') as string;
      
      if (confirmText !== 'DELETE MY ACCOUNT') {
        return json({ 
          success: false, 
          error: 'Please type "DELETE MY ACCOUNT" to confirm' 
        });
      }

      // In a real implementation, this would:
      // 1. Require OTP verification
      // 2. Cancel all active subscriptions
      // 3. Clean up all user data
      // 4. Send confirmation email
      
      return json({ 
        success: false, 
        error: 'Account deletion requires additional verification steps' 
      });
    }

    return json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing account action');
    return json({ success: false, error: 'Server error' }, { status: 500 });
  }
};

/**
 * Account settings and preferences
 */
export default function AccountSettingsPage() {
  const data = useLoaderData<typeof loader>();
  return <AccountSettings {...data} />;
}