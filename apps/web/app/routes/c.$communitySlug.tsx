import React from 'react';
import type { Route } from './+types/c.$communitySlug';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

// Use the existing Magic Patterns hub community page
import HubCommunityPage from '~/components/magic-patterns/pages/hub/[slug]/community';

export async function loader({ params }: Route.LoaderArgs) {
  const client = getSupabaseServerClient();
  
  try {
    // Try to find the community by slug in community_hubs
    const { data: community, error } = await client
      .from('community_hubs')
      .select('*')
      .eq('slug', params.communitySlug)
      .single();

    if (error || !community) {
      // Return a default community structure for demo purposes
      return { 
        community: {
          id: params.communitySlug,
          name: `Community: ${params.communitySlug}`,
          description: 'A community for event enthusiasts',
          slug: params.communitySlug,
          member_count: 0,
          is_public: true
        },
        activities: []
      };
    }

    // Transform the community data to match what the UI expects
    const transformedCommunity = {
      ...community,
      // Add mock data for fields that don't exist in the database yet
      image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      image_url: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      cover_image_url: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      member_count: 3427,
      memberCount: 3427,
      thread_count: 156,
      threadCount: 156,
      categories: ['music', 'arts', 'culture'],
      thread_types: ['Discussion', 'Question', 'Announcement', 'Resource', 'Event'],
      threadTypes: ['Discussion', 'Question', 'Announcement', 'Resource', 'Event'],
      popular_tags: ['Miles Davis', 'Saxophone', 'Improvisation', 'Jazz History', 'Music Theory', 'Bebop', 'Venues', 'Albums'],
      popularTags: ['Miles Davis', 'Saxophone', 'Improvisation', 'Jazz History', 'Music Theory', 'Bebop', 'Venues', 'Albums'],
      is_public: true,
      isPublic: true,
      status: 'active',
      location: 'Clearwater, FL',
      website_url: 'https://jazzlovers.com',
      websiteUrl: 'https://jazzlovers.com',
      social_links: {
        twitter: 'https://twitter.com/jazzlovers',
        facebook: 'https://facebook.com/jazzlovers',
        instagram: 'https://instagram.com/jazzlovers'
      },
      socialLinks: {
        twitter: 'https://twitter.com/jazzlovers',
        facebook: 'https://facebook.com/jazzlovers',
        instagram: 'https://instagram.com/jazzlovers'
      }
    };

    // Generate mock activities/threads for the community
    const mockActivities = [
      {
        id: 'activity-1',
        title: 'Recommendations for beginner jazz albums?',
        type: 'Question',
        content: 'I\'m new to jazz and looking for some great albums to start with. What would you recommend for someone just getting into the genre?',
        author: 'Miles Johnson',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        replies: 12,
        likes: 8,
        views: 156,
        tags: ['Jazz', 'Music', 'Recommendations']
      },
      {
        id: 'activity-2',
        title: 'Anyone going to the Downtown Jazz Festival next month?',
        type: 'Discussion',
        content: 'The Downtown Jazz Festival is coming up next month and I\'m planning to attend. Would love to meet up with other community members!',
        author: 'Ella Roberts',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        replies: 8,
        likes: 15,
        views: 234,
        tags: ['Festival', 'Jazz', 'Meetup']
      },
      {
        id: 'activity-3',
        title: 'What scale should I learn first for jazz improv?',
        type: 'Question',
        content: 'I\'ve been practicing jazz improvisation and wondering which scales would be most beneficial to focus on first.',
        author: 'John Coltrane Jr.',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        replies: 6,
        likes: 12,
        views: 189,
        tags: ['Jazz', 'Improvisation', 'Scales', 'Music Theory']
      }
    ];

    return { 
      community: transformedCommunity,
      activities: mockActivities
    };
  } catch (error) {
    console.error('Error loading community:', error);
    // Return a default community structure for demo purposes
    return { 
      community: {
        id: params.communitySlug,
        name: `Community: ${params.communitySlug}`,
        description: 'A community for event enthusiasts',
        slug: params.communitySlug,
        member_count: 0,
        is_public: true
      },
      activities: []
    };
  }
}

export default function CommunityCalendarPage({ loaderData }: Route.ComponentProps) {
  return <HubCommunityPage community={loaderData.community} activities={loaderData.activities} />;
}