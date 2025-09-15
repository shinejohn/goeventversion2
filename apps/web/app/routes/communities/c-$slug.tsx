import React from 'react';
import { useLoaderData } from 'react-router';

export const loader = async ({ params }: { params: { slug: string } }) => {
  // For now, create a mock community since community_hubs table doesn't exist
  // In the future, this should query the actual community table
  const mockCommunity = {
    id: 'mock-community-id',
    name: params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: `Welcome to the ${params.slug.replace(/-/g, ' ')} community! Join us for amazing events and connect with like-minded people.`,
    slug: params.slug,
    location: 'Various Locations',
    memberCount: 0,
    eventCount: 0,
    upcomingEvents: 0,
    website: null,
    tags: ['community', 'events', 'local'],
    events: []
  };
  
  return {
    community: mockCommunity,
    events: [],
    error: null
  };
};

export default function CommunityDetailPage() {
  const { community, events, error } = useLoaderData<typeof loader>();

  if (error || !community) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Not Found</h1>
          <p className="text-gray-600 mb-8">The community you're looking for doesn't exist.</p>
          <a
            href="/"
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{community.name}</h1>
              <p className="mt-2 text-gray-600">{community.description}</p>
              <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                <span>{community.memberCount} members</span>
                <span>{community.eventCount} events</span>
                <span>{community.upcomingEvents} upcoming</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Join Community
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Community</h2>
              <p className="text-gray-600 mb-4">{community.description}</p>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {community.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Events Section */}
            <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.map((event: any) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No events scheduled yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Members</span>
                  <span className="font-medium">{community.memberCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Events</span>
                  <span className="font-medium">{community.eventCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Upcoming</span>
                  <span className="font-medium">{community.upcomingEvents}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Create Event
                </button>
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                  Invite Friends
                </button>
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50">
                  View All Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
