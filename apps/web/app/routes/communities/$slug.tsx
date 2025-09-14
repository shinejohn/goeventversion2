import React from 'react';
import type { Route } from './+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Link } from 'react-router';
import { getLogger } from '@kit/shared/logger';

/**
 * Community Detail Route - View community hub details!
 * Show community information, events, and members
 * 
 * Time to explore the community! 🏘️✨
 */

export const loader = async ({ params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient();
  const logger = await getLogger();
  
  try {
    logger.info({ name: 'community-detail-loader', slug: params.slug }, 'Loading community detail...');
    
    // Fetch community hub by slug
    const { data: communityHub, error: communityError } = await client
      .from('community_hubs')
      .select('*')
      .eq('slug', params.slug)
      .single();
    
    if (communityError || !communityHub) {
      logger.warn({ name: 'community-detail-loader', slug: params.slug }, 'Community not found');
      throw new Error('Community not found');
    }
    
    // Fetch events for this community
    const { data: events, error: eventsError } = await client
      .from('events')
      .select(`
        *,
        venues(*)
      `)
      .eq('community_id', communityHub.id)
      .order('start_datetime', { ascending: true });
    
    if (eventsError) {
      logger.error({ name: 'community-detail-loader', error: eventsError }, 'Error fetching community events');
    }
    
    // Get community statistics
    const eventCount = events?.length || 0;
    const upcomingEvents = events?.filter(e => new Date(e.start_datetime) > new Date()).length || 0;
    
    logger.info({ 
      name: 'community-detail-loader',
      communityId: communityHub.id,
      eventCount,
      upcomingEvents
    }, 'Community detail loaded successfully');
    
    return {
      community: {
        ...communityHub,
        eventCount,
        upcomingEvents,
        events: events || []
      },
      error: null
    };
    
  } catch (error) {
    logger.error({ name: 'community-detail-loader', error }, 'Error in community detail loader');
    
    return {
      community: null,
      error: error instanceof Error ? error.message : 'Failed to load community'
    };
  }
};

export const meta = ({ data }: Route.MetaArgs) => {
  const community = data?.community;
  return [
    {
      title: community ? `${community.name} - Community | GoEventCity` : 'Community | GoEventCity',
    },
    {
      name: 'description',
      content: community ? community.description || 'Join this amazing community' : 'Discover amazing communities',
    },
  ];
};

export default function CommunityDetailPage({ loaderData }: Route.ComponentProps) {
  const { community, error } = loaderData;
  
  if (error || !community) {
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Community Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {community.name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {community.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>📍 {community.location}</span>
                <span>📅 {community.eventCount} events</span>
                <span>👥 {community.memberCount || 0} members</span>
                {community.website && (
                  <a 
                    href={community.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    🌐 Website
                  </a>
                )}
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 mr-4">
                Join Community
              </button>
              <button className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400">
                Share
              </button>
            </div>
          </div>
          
          {community.tags && community.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {community.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Events Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Upcoming Events ({community.upcomingEvents})
            </h2>
            <Link
              to={`/communities/${community.slug}/events`}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All Events
            </Link>
          </div>
          
          {community.events && community.events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {community.events.slice(0, 6).map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                  <div className="text-xs text-gray-500">
                    <p>📅 {new Date(event.start_datetime).toLocaleDateString()}</p>
                    <p>📍 {event.venue?.name || event.location_name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No events scheduled yet.</p>
              <Link
                to="/events/create"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Create the first event
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
