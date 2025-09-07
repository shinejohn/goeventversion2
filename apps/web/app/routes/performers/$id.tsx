import React from 'react';
import type { Route } from './+types/$id';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { notFound } from 'react-router';

// Magic Patterns imports
import { PerformerProfilePage } from '~/components/magic-patterns/pages/performers/PerformerProfilePage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { transformPerformerData, transformEventData } from '~/lib/magic-patterns/data-transformers';
import { getLogger } from '@kit/shared/logger';

/**
 * Performer Profile Route - Meet the talent!
 * Shows performer information, media, upcoming performances, and booking options
 * 
 * Discover amazing talent! 🎤⭐
 */

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    const { id } = params;
    logger.info({ loader: 'performers/$id', performerId: id }, '🎤 Loading performer profile');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user for personalization
    const { data: { user } } = await client.auth.getUser();
    
    // Parallel data fetching for performance 🚀
    const [performerQuery, upcomingEventsQuery, pastEventsQuery, similarPerformersQuery] = await Promise.all([
      // Main performer data
      client
        .from('performers')
        .select('*')
        .eq('id', id)
        .single(),
      
      // Upcoming performances
      client
        .from('event_performers')
        .select(`
          event:events!event_id (
            *,
            venues!venue_id (
              id,
              name,
              city,
              profile_image_url
            )
          )
        `)
        .eq('performer_id', id)
        .gte('events.start_date', new Date().toISOString())
        .eq('events.status', 'published')
        .order('events.start_date', { ascending: true })
        .limit(6),
      
      // Past performances (for portfolio)
      client
        .from('event_performers')
        .select(`
          event:events!event_id (
            id,
            title,
            start_date,
            image_url,
            venues!venue_id (
              name,
              city
            )
          )
        `)
        .eq('performer_id', id)
        .lt('events.end_date', new Date().toISOString())
        .order('events.start_date', { ascending: false })
        .limit(10),
      
      // Similar performers (same category/genres)
      client
        .from('performers')
        .select('*')
        .eq('is_available', true)
        .neq('id', id)
        .limit(4),
    ]);
    
    const { data: performer, error: performerError } = performerQuery;
    const { data: upcomingPerformances } = upcomingEventsQuery;
    const { data: pastPerformances } = pastEventsQuery;
    const { data: similarPerformers } = similarPerformersQuery;
    
    if (performerError || !performer) {
      logger.error({ error: performerError, performerId: id }, 'Performer not found');
      throw notFound();
    }
    
    // Transform the performer data
    const transformedPerformer = transformPerformerData(performer);
    
    // Transform upcoming events
    const upcomingEvents = upcomingPerformances
      ?.map(p => p.event)
      .filter(Boolean)
      .map(event => ({
        ...transformEventData(event),
        venue: event.venues,
      })) || [];
    
    // Transform past performances
    const portfolio = pastPerformances
      ?.map(p => p.event)
      .filter(Boolean)
      .map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.start_date).toLocaleDateString(),
        venue: event.venues?.name || 'Unknown Venue',
        location: event.venues?.city || '',
        imageUrl: event.image_url,
      })) || [];
    
    // Filter similar performers by matching category or genres
    const filteredSimilarPerformers = (similarPerformers || [])
      .filter(p => {
        if (p.category === performer.category) return true;
        const performerGenres = performer.genres || [];
        const otherGenres = p.genres || [];
        return performerGenres.some(g => otherGenres.includes(g));
      })
      .slice(0, 3)
      .map(transformPerformerData);
    
    // Calculate performer metrics
    const performerMetrics = {
      totalPerformances: (upcomingEvents.length + portfolio.length),
      upcomingPerformances: upcomingEvents.length,
      completedPerformances: portfolio.length,
      averageRating: 4.5 + (Math.random() * 0.5), // Mock rating for now
      responseTime: '< 2 hours',
      bookingAcceptance: '95%',
      yearsActive: calculateYearsActive(performer.created_at),
    };
    
    // Format media content
    const mediaContent = {
      videos: performer.demo_videos || [],
      audio: performer.audio_samples || [],
      images: performer.gallery_images || [],
      socialLinks: formatSocialMedia(performer.social_media),
    };
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'performers/$id',
      duration,
      performerId: id,
      upcomingEvents: upcomingEvents.length,
      portfolio: portfolio.length,
      metrics: performerMetrics,
    }, '🌟 Performer profile loaded successfully');
    
    return {
      performer: transformedPerformer,
      upcomingEvents,
      portfolio,
      similarPerformers: filteredSimilarPerformers,
      metrics: performerMetrics,
      mediaContent,
      user: user ? {
        id: user.id,
        email: user.email,
      } : null,
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'performers/$id',
      performerId: params.id,
      url: request.url 
    }, 'Error loading performer profile');
    
    if (error instanceof Response) {
      throw error;
    }
    
    throw notFound();
  }
};

// Helper functions
function calculateYearsActive(createdAt: string): number {
  const years = (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24 * 365);
  return Math.max(1, Math.floor(years));
}

function formatSocialMedia(socialMedia: any): Array<{ platform: string; url: string; icon: string }> {
  if (!socialMedia) return [];
  
  const platformIcons: Record<string, string> = {
    instagram: '📷',
    facebook: '👤',
    twitter: '🐦',
    tiktok: '🎵',
    youtube: '📹',
    spotify: '🎧',
    soundcloud: '☁️',
  };
  
  return Object.entries(socialMedia)
    .filter(([, value]) => value)
    .map(([platform, username]) => ({
      platform,
      url: getSocialUrl(platform, username as string),
      icon: platformIcons[platform] || '🔗',
    }));
}

function getSocialUrl(platform: string, username: string): string {
  const baseUrls: Record<string, string> = {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    twitter: 'https://twitter.com/',
    tiktok: 'https://tiktok.com/@',
    youtube: 'https://youtube.com/',
    spotify: 'https://open.spotify.com/artist/',
    soundcloud: 'https://soundcloud.com/',
  };
  
  return (baseUrls[platform] || '') + username;
}

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: PerformerProfilePage,
  transformData: (loaderData) => ({
    performer: loaderData.performer,
    upcomingEvents: loaderData.upcomingEvents,
    portfolio: loaderData.portfolio,
    similarPerformers: loaderData.similarPerformers,
    metrics: loaderData.metrics,
    mediaContent: loaderData.mediaContent,
    user: loaderData.user,
  }),
});

// SEO meta tags 🎯
export const meta = ({ data }: Route.MetaArgs) => {
  const performer = data?.performer;
  
  if (!performer) {
    return [{ title: 'Performer Not Found | When The Fun' }];
  }
  
  return [
    { title: `${performer.name} | When The Fun Performers` },
    { 
      name: 'description', 
      content: performer.bio || `Book ${performer.name} - amazing ${performer.category} for your next event!` 
    },
    { property: 'og:title', content: performer.name },
    { property: 'og:description', content: performer.bio || 'Book this amazing performer for your event' },
    { property: 'og:type', content: 'profile' },
    { property: 'og:image', content: performer.profileImageUrl || '/default-performer.jpg' },
    { property: 'profile:username', content: performer.name },
  ];
};

// Cache headers 🚀
export const headers = () => {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=3600', // 5 min client, 1 hour CDN
  };
};