import React from 'react';
import type { Route } from './+types/$slug';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Link } from 'react-router';
import { getLogger } from '@kit/shared/logger';
import HubCommunityPage from '~/components/magic-patterns/pages/hub/[slug]/community';

/**
 * Community Detail Route - View community hub details!
 * Show community information, events, and members
 * 
 * Time to explore the community! 🏘️✨
 */

export const loader = async ({ params }: Route.LoaderArgs) => {
  try {
    const client = getSupabaseServerClient();
    
    // Try to fetch real community data from database first
    const { data: dbCommunity, error: dbError } = await client
      .from('communities')
      .select('*')
      .eq('slug', params.slug)
      .single();
    
    if (!dbError && dbCommunity) {
      console.log('✅ Loaded community from database:', dbCommunity.name);
      return {
        hub: dbCommunity,
        members: [],
        activities: [],
        error: null
      };
    }
    
    console.log('📝 Using mock data - database community not available:', dbError?.message);
    
    // Fallback to mock data with Magic Patterns structure
    const mockHub = {
      id: 'mock-hub-id',
      name: params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `Welcome to the ${params.slug.replace(/-/g, ' ')} community! Join us for amazing events and connect with like-minded people.`,
      slug: params.slug,
      location: 'Various Locations',
      member_count: 3427,
      event_count: 20,
      image_url: 'https://picsum.photos/seed/jazz-community/1200/400',
      cover_image_url: 'https://picsum.photos/seed/jazz-logo/100/100',
      category: 'music',
      is_public: true,
      is_verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Mock activities/threads for the community
    const mockActivities = [
      {
        id: '1',
        title: 'Looking for jam session partners in the Boston area',
        type: 'Discussion',
        content: 'Anyone interested in getting together for some jazz jams? I play saxophone and looking for other musicians.',
        author: 'Dizzy Parker',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        replies: 17,
        likes: 23,
        views: 144,
        tags: ['jazz', 'jam session', 'boston', 'saxophone']
      },
      {
        id: '2',
        title: 'Getting gigs as a jazz musician in 2023',
        type: 'Resource',
        content: 'Tips and strategies for finding performance opportunities in the current music scene.',
        author: 'John Coltrane Jr.',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        replies: 8,
        likes: 15,
        views: 89,
        tags: ['gigs', 'career', 'music business', 'networking']
      },
      {
        id: '3',
        title: 'Anyone going to the Downtown Jazz Festival next month?',
        type: 'Event',
        content: 'The festival is coming up and I\'m looking for people to go with. Should be an amazing lineup!',
        author: 'Miles Davis Fan',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        replies: 12,
        likes: 19,
        views: 67,
        tags: ['festival', 'downtown', 'jazz festival', 'events']
      }
    ];
    
    return {
      hub: mockHub,
      members: [],
      activities: mockActivities,
      error: null
    };
    
  } catch (error) {
    return {
      hub: null,
      members: [],
      activities: [],
      error: error instanceof Error ? error.message : 'Failed to load community'
    };
  }
};

export const meta = ({ data }: Route.MetaArgs) => {
  const hub = data?.hub;
  return [
    {
      title: hub ? `${hub.name} - Community | GoEventCity` : 'Community | GoEventCity',
    },
    {
      name: 'description',
      content: hub ? hub.description || 'Join this amazing community' : 'Discover amazing communities',
    },
  ];
};

export default function CommunityDetailPage({ loaderData }: Route.ComponentProps) {
  const { hub, members, activities, error } = loaderData;
  
  if (error || !hub) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Not Found</h1>
          <p className="text-gray-600 mb-8">The community you're looking for doesn't exist or has been moved.</p>
          <Link
            to="/communities"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Browse Communities
          </Link>
        </div>
      </div>
    );
  }
  
  // Use the Magic Patterns HubCommunityPage component
  return <HubCommunityPage hub={hub} members={members} activities={activities} />;
}
# Force complete rebuild Wed Sep 17 06:57:37 EDT 2025
