import React from 'react';
import type { Route } from './+types/join';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';
import { PerformerOnboardingPage } from '~/components/magic-patterns/pages/performers/PerformerOnboardingPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * Performer Join Route - Become a performer!
 * This route handles both authenticated and unauthenticated users
 * 
 * 🎤 Time to step into the spotlight! 🌟
 */

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  
  try {
    const client = getSupabaseServerClient(request);
    
    // Check if user is authenticated
    const { data: { user }, error: userError } = await client.auth.getUser();
    
    if (userError) {
      logger.warn({ error: userError }, 'User authentication check failed');
    }
    
    // Check if user already has a performer profile
    let existingPerformer = null;
    if (user) {
      const { data: performer } = await client
        .from('performers')
        .select('id, stage_name, category, is_verified')
        .eq('user_id', user.id)
        .single();
      
      existingPerformer = performer;
    }
    
    logger.info({ 
      loader: 'performers/join',
      hasUser: !!user,
      hasPerformer: !!existingPerformer 
    }, '🎭 Loading performer join page');
    
    return {
      isAuthenticated: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email
      } : null,
      existingPerformer,
      redirectTo: existingPerformer ? `/performers/${existingPerformer.id}` : null,
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'performers/join'
    }, 'Error loading performer join page');
    
    return {
      isAuthenticated: false,
      user: null,
      existingPerformer: null,
      redirectTo: null,
    };
  }
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    { title: 'Become a Performer - When The Fun' },
    { 
      name: 'description', 
      content: 'Join When The Fun as a performer and showcase your talent to venues and audiences. Create your profile, get bookings, and grow your fanbase.' 
    },
    { property: 'og:title', content: 'Become a Performer - When The Fun' },
    { property: 'og:description', content: 'Join as a performer and showcase your talent' },
    { property: 'og:type', content: 'website' },
  ];
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: PerformerOnboardingPage,
  transformData: (loaderData) => ({
    isAuthenticated: loaderData.isAuthenticated,
    user: loaderData.user,
    existingPerformer: loaderData.existingPerformer,
    redirectTo: loaderData.redirectTo,
  }),
});

// Cache headers
export const headers = () => {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=3600', // 5 min client, 1 hour CDN
  };
};
