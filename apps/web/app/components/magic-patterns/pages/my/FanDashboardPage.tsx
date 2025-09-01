import React, { useState } from 'react';
import { useNavigationContext } from '../../context/NavigationContext';
import { Bell as BellIcon, Calendar as CalendarIcon, CheckCircle as CheckCircleIcon, ChevronDown as ChevronDownIcon, ChevronRight as ChevronRightIcon, Clock as ClockIcon, Edit as EditIcon, Filter as FilterIcon, Grid as GridIcon, Heart as HeartIcon, Image as ImageIcon, List as ListIcon, Map as MapIcon, MapPin as MapPinIcon, MessageSquare as MessageSquareIcon, MoreHorizontal as MoreHorizontalIcon, Music as MusicIcon, Plus as PlusIcon, Search as SearchIcon, Settings as SettingsIcon, ShoppingBag as ShoppingBagIcon, Star as StarIcon, Ticket as TicketIcon, Trash as TrashIcon, TrendingUp as TrendingUpIcon, User as UserIcon, X as XIcon, AlertCircle as AlertCircleIcon, Bookmark as BookmarkIcon, DollarSign as DollarSignIcon, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { followedArtists, upcomingShows, exclusiveContent, userActivity } from '../../mockdata/fanDashboard';
import { PlannedEventsWidget } from '../../components/check-in/PlannedEventsWidget';
import { CheckInFeed } from '../../components/check-in/CheckInFeed';
export const FanDashboardPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
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
  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };
  // Format time for display
  const formatTime = dateString => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  // Group shows by month and day for calendar view
  const groupShowsByDate = () => {
    const grouped = {};
    filteredShows.forEach(show => {
      const date = new Date(show.date);
      const monthYear = date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
      const day = date.getDate();
      if (!grouped[monthYear]) {
        grouped[monthYear] = {};
      }
      if (!grouped[monthYear][day]) {
        grouped[monthYear][day] = [];
      }
      grouped[monthYear][day].push(show);
    });
    return grouped;
  };
  const calendarShows = groupShowsByDate();
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="bg-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold">My Fan Dashboard</h1>
                <p className="mt-1 text-indigo-200">
                  Keep track of your favorite artists, upcoming shows, and
                  exclusive content
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <BellIcon className="h-5 w-5 mr-2" />
                  Notifications
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <SettingsIcon className="h-5 w-5 mr-2" />
                  Settings
                </button>
              </div>
            </div>
            {/* Dashboard Navigation Tabs */}
            <div className="mt-6">
              <nav className="flex space-x-4">
                <button onClick={() => setActiveTab('artists')} className={`px-3 py-2 font-medium text-sm rounded-md ${activeTab === 'artists' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-800'}`}>
                  <span className="flex items-center">
                    <MusicIcon className="mr-2 h-5 w-5" />
                    My Artists
                  </span>
                </button>
                <button onClick={() => setActiveTab('shows')} className={`px-3 py-2 font-medium text-sm rounded-md ${activeTab === 'shows' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-800'}`}>
                  <span className="flex items-center">
                    <TicketIcon className="mr-2 h-5 w-5" />
                    Upcoming Shows
                  </span>
                </button>
                <button onClick={() => setActiveTab('content')} className={`px-3 py-2 font-medium text-sm rounded-md ${activeTab === 'content' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-800'}`}>
                  <span className="flex items-center">
                    <StarIcon className="mr-2 h-5 w-5" />
                    Exclusive Content
                  </span>
                </button>
                <button onClick={() => setActiveTab('activity')} className={`px-3 py-2 font-medium text-sm rounded-md ${activeTab === 'activity' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-800'}`}>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            {/* My Artists Section */}
            {activeTab === 'artists' && <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    My Artists
                  </h2>
                  <div className="mt-3 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" placeholder="Search artists" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div className="inline-flex shadow-sm rounded-md">
                      <div className="relative inline-block text-left">
                        <select value={artistSort} onChange={e => setArtistSort(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                          <option value="recently-active">
                            Recently Active
                          </option>
                          <option value="a-z">A-Z</option>
                          <option value="most-shows">Most Shows</option>
                        </select>
                      </div>
                    </div>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Follow New Artist
                    </button>
                  </div>
                </div>
                {/* Artist Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedArtists.map(artist => <div key={artist.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300">
                      <div className="relative h-48">
                        <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                        {artist.newUpdates > 0 && <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold flex items-center">
                            <BellIcon className="h-3 w-3 mr-1" />
                            {artist.newUpdates} new
                          </div>}
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
                            {artist.upcomingShows} upcoming{' '}
                            {artist.upcomingShows === 1 ? 'show' : 'shows'}
                          </span>
                          <span className="text-xs text-gray-500">
                            Last active{' '}
                            {new Date(artist.lastActive).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <button onClick={() => navigateTo(`/performers/${artist.id}`)} className="flex-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 py-2 px-3 rounded-md text-sm font-medium">
                            View Profile
                          </button>
                          <button className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-2 px-3 rounded-md text-sm font-medium">
                            Unfollow
                          </button>
                        </div>
                      </div>
                    </div>)}
                </div>
                {/* Discover More Section */}
                <div className="mt-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-8 md:flex md:items-center md:justify-between">
                    <div className="md:w-0 md:flex-1">
                      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        <span className="block">Discover more artists</span>
                      </h2>
                      <p className="mt-3 max-w-3xl text-lg leading-6 text-indigo-200">
                        Find new artists based on your music taste and get
                        personalized recommendations.
                      </p>
                    </div>
                    <div className="mt-8 md:mt-0 md:ml-8">
                      <div className="rounded-md shadow">
                        <button onClick={() => navigateTo('/performers')} className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50">
                          <SearchIcon className="h-5 w-5 mr-2" />
                          Browse Artists
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Recent Check-ins */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Your Recent Check-ins
                  </h2>
                  <CheckInFeed type="user" limit={5} />
                </div>
              </div>}
            {/* Upcoming Shows Section */}
            {activeTab === 'shows' && <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Upcoming Shows
                  </h2>
                  <div className="mt-3 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="inline-flex shadow-sm rounded-md">
                      <button onClick={() => setShowView('list')} className={`inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${showView === 'list' ? 'text-indigo-700 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                        <ListIcon className="h-5 w-5 mr-2" />
                        List
                      </button>
                      <button onClick={() => setShowView('calendar')} className={`inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${showView === 'calendar' ? 'text-indigo-700 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        Calendar
                      </button>
                    </div>
                    <div className="inline-flex shadow-sm rounded-md">
                      <select value={distanceFilter} onChange={e => setDistanceFilter(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="all">All Locations</option>
                        <option value="local">Local (≤ 50 miles)</option>
                        <option value="regional">Regional (≤ 200 miles)</option>
                        <option value="national">
                          National (&gt; 200 miles)
                        </option>
                      </select>
                    </div>
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <FilterIcon className="h-5 w-5 mr-2" />
                      More Filters
                    </button>
                  </div>
                </div>
                {/* Shows List View */}
                {showView === 'list' && <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    {filteredShows.length > 0 ? <ul className="divide-y divide-gray-200">
                        {filteredShows.map(show => <li key={show.id}>
                            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                                    <img src={show.artistImage} alt={show.artistName} className="h-full w-full object-cover" />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-indigo-600">
                                      {formatDate(show.date)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {formatTime(show.date)}
                                    </div>
                                  </div>
                                </div>
                                <div className="ml-2 flex-shrink-0 flex">
                                  {show.hasPriceAlert && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                      Price Alert
                                    </span>}
                                  <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${show.ticketStatus === 'Limited' || show.ticketStatus === 'Selling Fast' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                                    {show.ticketStatus}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                  <div className="flex items-center text-sm text-gray-500">
                                    <MusicIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                    <p>
                                      <span className="font-medium text-gray-900">
                                        {show.artistName}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                    <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                    <p>
                                      {show.venueName}, {show.venueLocation}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                  <DollarSignIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                  <p>${show.ticketPrice}</p>
                                  <button className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                                    Get Tickets
                                  </button>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <MapIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                <p>{show.distance.toFixed(1)} miles away</p>
                              </div>
                            </div>
                          </li>)}
                      </ul> : <div className="px-4 py-12 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                          <TicketIcon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                          No shows found
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Try adjusting your filters or follow more artists to
                          see their upcoming shows.
                        </p>
                        <div className="mt-6">
                          <button onClick={() => setDistanceFilter('all')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Show All Locations
                          </button>
                        </div>
                      </div>}
                  </div>}
                {/* Shows Calendar View */}
                {showView === 'calendar' && <div className="bg-white shadow rounded-lg overflow-hidden">
                    {Object.keys(calendarShows).length > 0 ? <div className="divide-y divide-gray-200">
                        {Object.entries(calendarShows).map(([monthYear, days]) => <div key={monthYear} className="p-4">
                              <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {monthYear}
                              </h3>
                              <div className="space-y-6">
                                {Object.entries(days).map(([day, shows]) => <div key={`${monthYear}-${day}`} className="flex">
                                    <div className="flex-shrink-0 w-16 text-center">
                                      <div className="text-3xl font-bold text-gray-900">
                                        {day}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {new Date(shows[0].date).toLocaleDateString('en-US', {
                            weekday: 'short'
                          })}
                                      </div>
                                    </div>
                                    <div className="ml-6 flex-1 space-y-3">
                                      {shows.map(show => <div key={show.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all duration-200">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                              <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                                                <img src={show.artistImage} alt={show.artistName} className="h-full w-full object-cover" />
                                              </div>
                                              <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                  {show.artistName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                  {formatTime(show.date)}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="ml-2 flex-shrink-0 flex">
                                              {show.hasPriceAlert && <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                  Price Alert
                                                </span>}
                                            </div>
                                          </div>
                                          <div className="mt-2 flex justify-between items-center">
                                            <div className="flex items-center text-sm text-gray-500">
                                              <MapPinIcon className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" />
                                              <p>
                                                {show.venueName},{' '}
                                                {show.venueLocation}
                                              </p>
                                            </div>
                                            <div className="flex items-center">
                                              <span className="text-sm font-medium text-gray-900 mr-3">
                                                ${show.ticketPrice}
                                              </span>
                                              <button className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                                                Get Tickets
                                              </button>
                                            </div>
                                          </div>
                                        </div>)}
                                    </div>
                                  </div>)}
                              </div>
                            </div>)}
                      </div> : <div className="px-4 py-12 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                          <CalendarIcon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                          No shows found
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Try adjusting your filters or follow more artists to
                          see their upcoming shows.
                        </p>
                        <div className="mt-6">
                          <button onClick={() => setDistanceFilter('all')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Show All Locations
                          </button>
                        </div>
                      </div>}
                  </div>}
                {/* Ticket Alerts Banner */}
                <div className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-6 md:flex md:items-center md:justify-between">
                    <div className="md:w-0 md:flex-1 flex items-center">
                      <AlertCircleIcon className="h-8 w-8 text-white" />
                      <div className="ml-4">
                        <h2 className="text-xl font-bold tracking-tight text-white">
                          <span className="block">Set up ticket alerts</span>
                        </h2>
                        <p className="mt-1 text-sm text-yellow-100">
                          Get notified when tickets become available or prices
                          drop for your favorite artists.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-8">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                        Manage Alerts
                      </button>
                    </div>
                  </div>
                </div>
              </div>}
            {/* Exclusive Content Section */}
            {activeTab === 'content' && <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Exclusive Content
                  </h2>
                  <div className="mt-3 md:mt-0 flex space-x-3">
                    <div className="inline-flex shadow-sm rounded-md">
                      <select value={contentFilter} onChange={e => setContentFilter(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="all">All Content</option>
                        <option value="release">New Releases</option>
                        <option value="post">Fan-Only Posts</option>
                        <option value="presale">Early Access</option>
                        <option value="virtual">Virtual Events</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Content Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContent.map(content => <div key={content.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-300">
                      <div className="relative h-48">
                        <img src={content.image} alt={content.title} className="w-full h-full object-cover" />
                        {content.isNew && <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                            NEW
                          </div>}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                          <div className="text-xs font-medium text-white uppercase">
                            {content.type === 'release' && 'New Release'}
                            {content.type === 'post' && 'Fan-Only Post'}
                            {content.type === 'presale' && 'Early Access'}
                            {content.type === 'virtual' && 'Virtual Event'}
                          </div>
                          <h3 className="text-lg font-semibold text-white">
                            {content.title}
                          </h3>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <MusicIcon className="h-4 w-4 mr-1" />
                          {content.artistName}
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatDate(content.date)}
                        </div>
                        <p className="mt-3 text-sm text-gray-600">
                          {content.description}
                        </p>
                        <div className="mt-4 flex space-x-2">
                          <button className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 py-2 px-3 rounded-md text-sm font-medium">
                            {content.type === 'release' && 'Listen Now'}
                            {content.type === 'post' && 'Read More'}
                            {content.type === 'presale' && 'Get Access'}
                            {content.type === 'virtual' && 'Join Event'}
                          </button>
                          <button className="p-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md">
                            <BookmarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>)}
                </div>
                {filteredContent.length === 0 && <div className="bg-white shadow rounded-lg p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                      <StarIcon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      No content found
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Try adjusting your filters or follow more artists to see
                      their exclusive content.
                    </p>
                    <div className="mt-6">
                      <button onClick={() => setContentFilter('all')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Show All Content
                      </button>
                    </div>
                  </div>}
                {/* Fan Club Banner */}
                <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg overflow-hidden">
                  <div className="px-6 py-6 md:flex md:items-center md:justify-between">
                    <div className="md:w-0 md:flex-1">
                      <h2 className="text-xl font-bold tracking-tight text-white">
                        <span className="block">Join Artist Fan Clubs</span>
                      </h2>
                      <p className="mt-1 text-sm text-indigo-200">
                        Get even more exclusive content, behind-the-scenes
                        access, and special perks by joining official fan clubs.
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-8">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Explore Fan Clubs
                      </button>
                    </div>
                  </div>
                </div>
              </div>}
            {/* My Activity Section */}
            {activeTab === 'activity' && <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  My Activity
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Reviews Written */}
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Reviews Written
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {userActivity.reviews.length}
                      </span>
                    </div>
                    <div className="border-t border-gray-200">
                      <ul className="divide-y divide-gray-200">
                        {userActivity.reviews.map(review => <li key={review.id} className="px-4 py-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-indigo-600">
                                  {review.artistName}
                                </div>
                                <div className="mx-2 text-gray-300">•</div>
                                <div className="text-sm text-gray-500">
                                  {review.eventName}
                                </div>
                              </div>
                              <div className="flex items-center">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                                </div>
                                <div className="ml-2 text-sm text-gray-500">
                                  {formatDate(review.date)}
                                </div>
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                              {review.content}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500">
                                <HeartIcon className="h-4 w-4 mr-1 text-pink-500" />
                                {review.likes} likes
                              </div>
                              <div className="flex space-x-2">
                                <button className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs text-gray-700 bg-white hover:bg-gray-50">
                                  <EditIcon className="h-3 w-3 mr-1" />
                                  Edit
                                </button>
                                <button className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs text-gray-700 bg-white hover:bg-gray-50">
                                  <TrashIcon className="h-3 w-3 mr-1" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </li>)}
                      </ul>
                      {userActivity.reviews.length === 0 && <div className="px-4 py-5 text-center text-gray-500">
                          You haven't written any reviews yet.
                        </div>}
                      <div className="px-4 py-3 bg-gray-50 text-right">
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          View All Reviews
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Photos Uploaded */}
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Photos Uploaded
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {userActivity.photos.length}
                      </span>
                    </div>
                    <div className="border-t border-gray-200">
                      <div className="p-4 grid grid-cols-2 gap-4">
                        {userActivity.photos.map(photo => <div key={photo.id} className="relative group">
                            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
                              <img src={photo.image} alt={`Photo from ${photo.eventName}`} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 flex items-end p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="w-full">
                                <div className="text-white text-xs font-medium">
                                  {photo.artistName}
                                </div>
                                <div className="text-white text-xs opacity-80">
                                  {photo.eventName}
                                </div>
                                <div className="mt-1 flex items-center justify-between">
                                  <div className="flex items-center text-xs text-white opacity-80">
                                    <HeartIcon className="h-3 w-3 mr-1" />
                                    {photo.likes}
                                  </div>
                                  <div className="flex space-x-1">
                                    <button className="p-1 bg-white/20 rounded-full hover:bg-white/30">
                                      <EditIcon className="h-3 w-3 text-white" />
                                    </button>
                                    <button className="p-1 bg-white/20 rounded-full hover:bg-white/30">
                                      <TrashIcon className="h-3 w-3 text-white" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>)}
                      </div>
                      {userActivity.photos.length === 0 && <div className="px-4 py-5 text-center text-gray-500">
                          You haven't uploaded any photos yet.
                        </div>}
                      <div className="px-4 py-3 bg-gray-50 text-right">
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          View All Photos
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Discussions */}
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Discussions
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {userActivity.discussions.length}
                      </span>
                    </div>
                    <div className="border-t border-gray-200">
                      <ul className="divide-y divide-gray-200">
                        {userActivity.discussions.map(discussion => <li key={discussion.id} className="px-4 py-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-gray-900">
                                {discussion.title}
                              </div>
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </div>
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <MusicIcon className="h-4 w-4 mr-1" />
                              {discussion.artistName}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500">
                                <MessageSquareIcon className="h-4 w-4 mr-1" />
                                {discussion.replies} replies
                              </div>
                              <div className="text-xs text-gray-500">
                                Last activity:{' '}
                                {new Date(discussion.lastActivity).toLocaleDateString()}
                              </div>
                            </div>
                          </li>)}
                      </ul>
                      {userActivity.discussions.length === 0 && <div className="px-4 py-5 text-center text-gray-500">
                          You haven't participated in any discussions yet.
                        </div>}
                      <div className="px-4 py-3 bg-gray-50 text-right">
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          View All Discussions
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Saved Items */}
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Saved Items
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {userActivity.savedItems.length}
                      </span>
                    </div>
                    <div className="border-t border-gray-200">
                      <ul className="divide-y divide-gray-200">
                        {userActivity.savedItems.map(item => <li key={item.id} className="px-4 py-4 hover:bg-gray-50">
                            <div className="flex">
                              <div className="flex-shrink-0 h-16 w-16 rounded overflow-hidden">
                                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.title}
                                  </div>
                                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {item.type === 'merch' ? 'Merchandise' : 'Ticket'}
                                  </div>
                                </div>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                  <MusicIcon className="h-4 w-4 mr-1" />
                                  {item.artistName}
                                </div>
                                {item.type === 'ticket' && <div className="mt-1 flex items-center text-sm text-gray-500">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    {formatDate(item.date)} • {item.eventName}
                                  </div>}
                                <div className="mt-2 flex items-center justify-between">
                                  <div className="text-sm font-medium text-gray-900">
                                    ${item.price}
                                  </div>
                                  <div className="flex space-x-2">
                                    {item.type === 'merch' ? <button className={`inline-flex items-center px-3 py-1 border border-transparent rounded-md text-xs font-medium ${item.inStock ? 'text-white bg-indigo-600 hover:bg-indigo-700' : 'text-gray-700 bg-gray-200 cursor-not-allowed'}`}>
                                        <ShoppingBagIcon className="h-3 w-3 mr-1" />
                                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                                      </button> : <button className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                                        <TicketIcon className="h-3 w-3 mr-1" />
                                        Buy Tickets
                                      </button>}
                                    <button className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs text-gray-700 bg-white hover:bg-gray-50">
                                      <TrashIcon className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>)}
                      </ul>
                      {userActivity.savedItems.length === 0 && <div className="px-4 py-5 text-center text-gray-500">
                          You haven't saved any items yet.
                        </div>}
                      <div className="px-4 py-3 bg-gray-50 text-right">
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          View All Saved Items
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Activity Stats */}
                <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Your Activity Stats
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Summary of your engagement with artists and events.
                    </p>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-4">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Artists Followed
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                          {followedArtists.length}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Shows Attended
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                          12
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Reviews Written
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                          {userActivity.reviews.length}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Photos Shared
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                          {userActivity.photos.length}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>}
          </div>
          <div className="space-y-8">
            {/* Planned Events Widget */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upcoming Events
              </h2>
              <PlannedEventsWidget />
            </div>
            {/* Friends' Check-ins */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Friends' Activity
              </h2>
              <CheckInFeed type="friends" limit={3} />
            </div>
          </div>
        </div>
      </div>
    </div>;
};