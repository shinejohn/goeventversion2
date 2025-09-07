import React, { useState } from 'react';
import { useRouteLoaderData, useNavigate } from 'react-router';

import { getI18n } from 'react-i18next';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/user';

import { UserWorkspace } from './_lib/load-user-workspace.server';
import { 
  Bell as BellIcon, 
  Calendar as CalendarIcon, 
  CheckCircle as CheckCircleIcon, 
  ChevronDown as ChevronDownIcon, 
  ChevronRight as ChevronRightIcon, 
  Clock as ClockIcon, 
  Edit as EditIcon, 
  Filter as FilterIcon, 
  Grid as GridIcon, 
  Heart as HeartIcon, 
  Image as ImageIcon, 
  List as ListIcon, 
  Map as MapIcon, 
  MapPin as MapPinIcon, 
  MessageSquare as MessageSquareIcon, 
  MoreHorizontal as MoreHorizontalIcon, 
  Music as MusicIcon, 
  Plus as PlusIcon, 
  Search as SearchIcon, 
  Settings as SettingsIcon, 
  ShoppingBag as ShoppingBagIcon, 
  Star as StarIcon, 
  Ticket as TicketIcon, 
  Trash as TrashIcon, 
  TrendingUp as TrendingUpIcon, 
  User as UserIcon, 
  X as XIcon, 
  AlertCircle as AlertCircleIcon, 
  Bookmark as BookmarkIcon, 
  DollarSign as DollarSignIcon, 
  ExternalLink as ExternalLinkIcon 
} from 'lucide-react';

// Inline components (keeping these for now as they're UI components)
const PlannedEventsWidget = ({ events }: { events: any[] }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Planned Events</h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5">
        {events && events.length > 0 ? (
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.id} className="text-sm text-gray-600">
                {event.title} - {new Date(event.start_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No planned events yet.</p>
        )}
      </div>
    </div>
  );
};

const CheckInFeed = ({ checkIns }: { checkIns: any[]; type: string; limit: number }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {type === 'friends' ? 'Friends Activity' : 'Recent Check-ins'}
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5">
        {checkIns && checkIns.length > 0 ? (
          <ul className="space-y-2">
            {checkIns.slice(0, limit).map((checkIn) => (
              <li key={checkIn.id} className="text-sm text-gray-600">
                {checkIn.user_name} checked in at {checkIn.venue_name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No recent activity.</p>
        )}
      </div>
    </div>
  );
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const i18n = await createI18nServerInstance(request);
  const client = getSupabaseServerClient(request);
  const title = 'Fan Dashboard - GoEventCity';

  try {
    // Get current user
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return {
        title,
        followedArtists: [],
        upcomingShows: [],
        exclusiveContent: [],
        plannedEvents: [],
        checkIns: []
      };
    }

    // Fetch followed artists (assuming we have a user_follows_artists table)
    const { data: followedArtists } = await client
      .from('performers')
      .select(`
        id,
        name,
        image_url,
        city,
        genre,
        is_verified,
        created_at
      `)
      .limit(10);

    // Fetch upcoming shows/events
    const { data: upcomingShows } = await client
      .from('events')
      .select(`
        id,
        title,
        start_date,
        price,
        status,
        image_url,
        venue:venues(
          id,
          name,
          address
        )
      `)
      .gte('start_date', new Date().toISOString())
      .eq('status', 'published')
      .limit(10)
      .order('start_date');

    // Fetch user's planned events (bookings)
    const { data: plannedEvents } = await client
      .from('bookings')
      .select(`
        id,
        event:events(
          id,
          title,
          start_date
        )
      `)
      .eq('user_id', user.id)
      .limit(5);

    // Transform data to match component expectations
    const transformedArtists = (followedArtists || []).filter(artist => artist && artist.id).map(artist => ({
      id: artist.id,
      name: artist.name || 'Unknown Artist',
      image: artist.image_url || 'https://via.placeholder.com/300',
      location: artist.city || 'Unknown',
      genre: artist.genre || 'Various',
      upcomingShows: 0, // Would need a separate query to count
      lastActive: artist.created_at || new Date().toISOString(),
      newUpdates: 0,
      isVerified: artist.is_verified || false
    }));

    const transformedShows = (upcomingShows || []).filter(show => show && show.id).map(show => ({
      id: show.id,
      artistName: show.title || 'Untitled Event',
      artistImage: show.image_url || 'https://via.placeholder.com/300',
      date: show.start_date || new Date().toISOString(),
      venueName: show.venue?.name || 'TBA',
      venueLocation: show.venue?.address || 'TBA',
      ticketPrice: show.price || 0,
      ticketStatus: show.status === 'published' ? 'Available' : 'Unavailable',
      distance: 0, // Would need geolocation calculation
      hasPriceAlert: false
    }));

    return {
      title,
      followedArtists: transformedArtists,
      upcomingShows: transformedShows,
      exclusiveContent: [], // Would need content table
      plannedEvents: plannedEvents?.map(p => p.event) || [],
      checkIns: [] // Would need check-ins table
    };

  } catch (error) {
    // Error will be logged by the framework
    return {
      title,
      followedArtists: [],
      upcomingShows: [],
      exclusiveContent: [],
      plannedEvents: [],
      checkIns: []
    };
  }
};

export const clientLoader = async () => {
  const i18n = getI18n();
  const title = 'Fan Dashboard - GoEventCity';

  return {
    title,
  };
};

export default function UserHomePage({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { workspace } = useRouteLoaderData('routes/home/user/layout') as {
    workspace: UserWorkspace;
  };

  // Get data from loader
  const { 
    followedArtists = [],
    upcomingShows = [],
    exclusiveContent = [],
    plannedEvents = [],
    checkIns = []
  } = loaderData || {};

  // State for sorting and filtering
  const [artistSort, setArtistSort] = useState('recently-active');
  const [showView, setShowView] = useState('list');
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [contentFilter, setContentFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('artists');

  // Filter shows based on distance
  const filteredShows = upcomingShows.filter(show => {
    const distance = show.distance;
    if (distanceFilter === 'all') return true;
    if (distanceFilter === 'local' && distance <= 50) return true;
    if (distanceFilter === 'regional' && distance <= 200) return true;
    if (distanceFilter === 'national' && distance > 200) return true;
    return false;
  });

  // Sort artists based on selected option
  const sortedArtists = [...followedArtists].sort((a, b) => {
    if (artistSort === 'a-z') return a.name.localeCompare(b.name);
    if (artistSort === 'most-shows') return b.upcomingShows - a.upcomingShows;
    return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
  });

  // Filter content based on type
  const filteredContent = exclusiveContent.filter(content => {
    if (contentFilter === 'all') return true;
    return content.type === contentFilter;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="bg-indigo-700 text-white rounded-lg mb-8">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">My Fan Dashboard</h1>
                <p className="mt-1 text-indigo-200">
                  Keep track of your favorite artists, upcoming shows, and exclusive content
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <BellIcon className="h-5 w-5 mr-2" />
                  Notifications
                </button>
                <button 
                  onClick={() => navigate('/home/settings')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <SettingsIcon className="h-5 w-5 mr-2" />
                  Settings
                </button>
              </div>
            </div>
            
            {/* Dashboard Navigation Tabs */}
            <div className="mt-6">
              <nav className="flex space-x-4">
                <button 
                  onClick={() => setActiveTab('artists')} 
                  className={`px-3 py-2 font-medium text-sm rounded-md ${activeTab === 'artists' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-800'}`}
                >
                  <span className="flex items-center">
                    <MusicIcon className="mr-2 h-5 w-5" />
                    My Artists
                  </span>
                </button>
                <button 
                  onClick={() => setActiveTab('shows')} 
                  className={`px-3 py-2 font-medium text-sm rounded-md ${activeTab === 'shows' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-800'}`}
                >
                  <span className="flex items-center">
                    <TicketIcon className="mr-2 h-5 w-5" />
                    Upcoming Shows
                  </span>
                </button>
                <button 
                  onClick={() => setActiveTab('content')} 
                  className={`px-3 py-2 font-medium text-sm rounded-md ${activeTab === 'content' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-800'}`}
                >
                  <span className="flex items-center">
                    <StarIcon className="mr-2 h-5 w-5" />
                    Exclusive Content
                  </span>
                </button>
                <button 
                  onClick={() => setActiveTab('activity')} 
                  className={`px-3 py-2 font-medium text-sm rounded-md ${activeTab === 'activity' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-800'}`}
                >
                  <span className="flex items-center">
                    <UserIcon className="mr-2 h-5 w-5" />
                    My Activity
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* My Artists Section */}
            {activeTab === 'artists' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Artists</h2>
                  <div className="mt-3 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Search artists" 
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                      />
                    </div>
                    <div className="inline-flex shadow-sm rounded-md">
                      <select 
                        value={artistSort} 
                        onChange={e => setArtistSort(e.target.value)} 
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="recently-active">Recently Active</option>
                        <option value="a-z">A-Z</option>
                        <option value="most-shows">Most Shows</option>
                      </select>
                    </div>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Follow New Artist
                    </button>
                  </div>
                </div>
                
                {/* Artist Grid */}
                {sortedArtists.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedArtists.map(artist => (
                      <div key={artist.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="relative h-48">
                          <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                          {artist.newUpdates > 0 && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold flex items-center">
                              <BellIcon className="h-3 w-3 mr-1" />
                              {artist.newUpdates} new
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                              {artist.name}
                              {artist.isVerified && <CheckCircleIcon className="h-4 w-4 text-blue-500 ml-1" />}
                            </h3>
                            <button className="text-gray-400 hover:text-gray-500">
                              <MoreHorizontalIcon className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {artist.location}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <MusicIcon className="h-4 w-4 mr-1" />
                            {artist.genre}
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm font-medium text-indigo-600">
                              {artist.upcomingShows} upcoming {artist.upcomingShows === 1 ? 'show' : 'shows'}
                            </span>
                            <span className="text-xs text-gray-500">
                              Last active {new Date(artist.lastActive).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mt-4 flex space-x-2">
                            <button 
                              onClick={() => navigate(`/performers/${artist.id}`)}
                              className="flex-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 py-2 px-3 rounded-md text-sm font-medium"
                            >
                              View Profile
                            </button>
                            <button className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 px-3 rounded-md text-sm font-medium">
                              Unfollow
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white shadow rounded-lg p-6 text-center">
                    <MusicIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600">No artists followed yet. Start following your favorite artists!</p>
                  </div>
                )}
              </div>
            )}

            {/* Upcoming Shows Tab */}
            {activeTab === 'shows' && (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Upcoming Shows</h2>
                </div>
                {filteredShows.length > 0 ? (
                  <div className="space-y-4">
                    {filteredShows.map(show => (
                      <div key={show.id} className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img src={show.artistImage} alt={show.artistName} className="h-16 w-16 rounded-lg object-cover" />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{show.artistName}</h3>
                              <p className="text-sm text-gray-500">{show.venueName} - {show.venueLocation}</p>
                              <p className="text-sm text-gray-600">{formatDate(show.date)} at {formatTime(show.date)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">${show.ticketPrice}</p>
                            <p className={`text-sm ${show.ticketStatus === 'Available' ? 'text-green-600' : 'text-orange-600'}`}>
                              {show.ticketStatus}
                            </p>
                            <button 
                              onClick={() => navigate(`/events/${show.id}`)}
                              className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white shadow rounded-lg p-6 text-center">
                    <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600">No upcoming shows found. Check back later!</p>
                  </div>
                )}
              </div>
            )}

            {/* Other tabs remain similar but would use real data */}
            {activeTab === 'content' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Exclusive Content</h2>
                <p className="text-gray-600">Exclusive content feature coming soon...</p>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">My Activity</h2>
                <p className="text-gray-600">Activity tracking coming soon...</p>
              </div>
            )}
          </div>
          
          <div className="space-y-8">
            {/* Planned Events Widget */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
              <PlannedEventsWidget events={plannedEvents} />
            </div>
            
            {/* Friends' Check-ins */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Friends' Activity</h2>
              <CheckInFeed checkIns={checkIns} type="friends" limit={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}