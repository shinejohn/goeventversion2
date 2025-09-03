import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { CalendarIcon, TicketIcon, StarIcon, MapPinIcon, MusicIcon, UsersIcon, TrendingUpIcon, BellIcon, HeartIcon, ClockIcon, ChevronRightIcon, BookmarkIcon, PlusIcon, FilterIcon, CheckIcon } from 'lucide-react';
// Mock data for upcoming events
const upcomingEvents = [{
  id: 'event-1',
  title: 'Clearwater Jazz Holiday',
  date: new Date(2024, 8, 15),
  image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  venue: 'Coachman Park',
  ticketStatus: 'confirmed',
  reminder: true
}, {
  id: 'event-2',
  title: 'Summer Sunset Concert Series',
  date: new Date(2024, 7, 20),
  image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  venue: 'Pier 60',
  ticketStatus: 'pending',
  reminder: false
}, {
  id: 'event-3',
  title: 'Comedy Night at Capitol Theatre',
  date: new Date(2024, 7, 25),
  image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  venue: 'Capitol Theatre',
  ticketStatus: 'confirmed',
  reminder: true
}];
// Mock data for followed artists/venues
const followedEntities = [{
  id: 'artist-1',
  name: 'The Local Band',
  type: 'artist',
  image: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  upcomingEvents: 3
}, {
  id: 'venue-1',
  name: 'Capitol Theatre',
  type: 'venue',
  image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  upcomingEvents: 12
}, {
  id: 'artist-2',
  name: 'Jazz Quartet',
  type: 'artist',
  image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  upcomingEvents: 1
}, {
  id: 'venue-2',
  name: 'Coachman Park',
  type: 'venue',
  image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  upcomingEvents: 5
}];
// Mock data for recommended events
const recommendedEvents = [{
  id: 'rec-1',
  title: 'Food Festival Weekend',
  date: new Date(2024, 8, 22),
  image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  venue: 'Downtown Clearwater',
  category: 'Food & Drink',
  matchScore: 95
}, {
  id: 'rec-2',
  title: 'Art Exhibition Opening',
  date: new Date(2024, 8, 28),
  image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  venue: 'Clearwater Arts Center',
  category: 'Arts',
  matchScore: 87
}, {
  id: 'rec-3',
  title: 'Indie Music Night',
  date: new Date(2024, 9, 5),
  image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
  venue: 'The Sound Bar',
  category: 'Music',
  matchScore: 82
}];
// Mock data for recent activity
const recentActivity = [{
  id: 'activity-1',
  type: 'ticket-purchase',
  event: 'Clearwater Jazz Holiday',
  date: new Date(2024, 7, 30),
  details: 'Purchased 2 tickets'
}, {
  id: 'activity-2',
  type: 'follow',
  entity: 'Capitol Theatre',
  date: new Date(2024, 7, 28),
  details: 'Started following'
}, {
  id: 'activity-3',
  type: 'review',
  event: 'Summer Beach Concert',
  date: new Date(2024, 7, 25),
  details: 'Left a 5-star review'
}, {
  id: 'activity-4',
  type: 'bookmark',
  event: 'Comedy Night',
  date: new Date(2024, 7, 22),
  details: 'Saved to wishlist'
}];
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  // Format date for display
  const formatEventDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">
            Track your events, tickets, and favorite venues
          </p>
        </div>
        {/* Dashboard Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('overview')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Overview
            </button>
            <button onClick={() => setActiveTab('tickets')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tickets' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              My Tickets
            </button>
            <button onClick={() => setActiveTab('following')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'following' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Following
            </button>
            <button onClick={() => setActiveTab('recommendations')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'recommendations' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              For You
            </button>
            <button onClick={() => setActiveTab('activity')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'activity' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Activity
            </button>
          </nav>
        </div>
        {/* Dashboard Content */}
        {activeTab === 'overview' && <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <TicketIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">
                      Upcoming Events
                    </p>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {upcomingEvents.length}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <HeartIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">
                      Following
                    </p>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {followedEntities.length}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <StarIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Reviews</p>
                    <h3 className="text-xl font-semibold text-gray-900">7</h3>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <CalendarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">
                      This Month
                    </p>
                    <h3 className="text-xl font-semibold text-gray-900">
                      12 Events
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            {/* Upcoming Events */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Upcoming Events
                </h2>
                <button onClick={() => navigate('/my/calendar')} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                  View Calendar
                  <ChevronRightIcon className="ml-1 h-4 w-4" />
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {upcomingEvents.length === 0 ? <div className="py-12 text-center">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No upcoming events
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Find events to add to your calendar.
                    </p>
                    <div className="mt-6">
                      <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => navigate('/events')}>
                        Browse Events
                      </button>
                    </div>
                  </div> : upcomingEvents.map(event => <div key={event.id} className="px-6 py-4 flex items-center hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/event?id=${event.id}`)}>
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {event.title}
                        </h3>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatEventDate(event.date)}
                          <span className="mx-2">•</span>
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {event.venue}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                        <div className={`px-2 py-1 rounded text-xs ${event.ticketStatus === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {event.ticketStatus === 'confirmed' ? 'Ticket Confirmed' : 'Ticket Pending'}
                        </div>
                        {event.reminder && <div className="text-indigo-600 flex items-center text-xs">
                            <BellIcon className="h-4 w-4 mr-1" />
                            Reminder Set
                          </div>}
                      </div>
                    </div>)}
              </div>
              {upcomingEvents.length > 0 && <div className="px-6 py-3 bg-gray-50 text-center">
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium" onClick={() => navigate('/profile/tickets')}>
                    View All Events
                  </button>
                </div>}
            </div>
            {/* Following Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Following
                  </h2>
                  <button onClick={() => setActiveTab('following')} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                    See All
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {followedEntities.slice(0, 3).map(entity => <div key={entity.id} className="px-6 py-4 flex items-center hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/${entity.type}s/${entity.id}`)}>
                      <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                        <img src={entity.image} alt={entity.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {entity.name}
                        </h3>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          {entity.type === 'artist' ? <MusicIcon className="h-4 w-4 mr-1" /> : <MapPinIcon className="h-4 w-4 mr-1" />}
                          {entity.type === 'artist' ? 'Artist' : 'Venue'}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="text-indigo-600 flex items-center text-xs">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {entity.upcomingEvents} upcoming
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
              {/* Recommendations */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recommended For You
                  </h2>
                  <button onClick={() => setActiveTab('recommendations')} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                    See All
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {recommendedEvents.slice(0, 3).map(event => <div key={event.id} className="px-6 py-4 flex items-center hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/event?id=${event.id}`)}>
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {event.title}
                        </h3>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {formatEventDate(event.date)}
                          <span className="mx-2">•</span>
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {event.venue}
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                        <div className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs flex items-center">
                          <TrendingUpIcon className="h-3 w-3 mr-1" />
                          {event.matchScore}% match
                        </div>
                        <span className="mt-1 text-xs text-gray-500">
                          {event.category}
                        </span>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
          </div>}
        {/* Tickets Tab */}
        {activeTab === 'tickets' && <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                My Tickets
              </h2>
              <button onClick={() => navigate('/profile/tickets')} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                View All Tickets
                <ChevronRightIcon className="ml-1 h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-4 flex space-x-4 border-b border-gray-200 overflow-x-auto">
              <button className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                All Tickets
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full text-sm">
                Upcoming
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full text-sm">
                Past
              </button>
              <button className="px-3 py-1 bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full text-sm">
                Transferred
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {upcomingEvents.map(event => <div key={event.id} className="px-6 py-4 flex items-center hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/tickets/${event.id}`)}>
                  <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-base font-medium text-gray-900">
                      {event.title}
                    </h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {formatEventDate(event.date)}
                      <span className="mx-2">•</span>
                      <ClockIcon className="h-4 w-4 mr-1" />
                      7:00 PM
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {event.venue}
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                    <div className={`px-2 py-1 rounded text-xs ${event.ticketStatus === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {event.ticketStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <button className="p-1 text-gray-500 hover:text-gray-700" title="Download Ticket">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700" title="Share Ticket">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      <button className="p-1 text-gray-500 hover:text-gray-700" title="Add to Calendar">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>)}
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Showing {upcomingEvents.length} of {upcomingEvents.length}{' '}
                tickets
              </span>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700" onClick={() => navigate('/events')}>
                Find More Events
              </button>
            </div>
          </div>}
        {/* Following Tab */}
        {activeTab === 'following' && <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Artists & Venues You Follow
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Stay updated on your favorite artists and venues
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="p-1 rounded-full hover:bg-gray-100" title="Filter">
                  <FilterIcon className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-1 rounded-full hover:bg-gray-100" title="Add New">
                  <PlusIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followedEntities.map(entity => <div key={entity.id} className="bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={() => navigate(`/${entity.type}s/${entity.id}`)}>
                  <div className="h-32 w-full overflow-hidden">
                    <img src={entity.image} alt={entity.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {entity.name}
                        </h3>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          {entity.type === 'artist' ? <MusicIcon className="h-4 w-4 mr-1" /> : <MapPinIcon className="h-4 w-4 mr-1" />}
                          {entity.type === 'artist' ? 'Artist' : 'Venue'}
                        </div>
                      </div>
                      <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                        {entity.upcomingEvents} upcoming
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center" onClick={e => {
                  e.stopPropagation();
                  navigate(`/${entity.type}s/${entity.id}/events`);
                }}>
                        View Events
                        <ChevronRightIcon className="ml-1 h-3 w-3" />
                      </button>
                      <button className="text-xs text-gray-500 hover:text-gray-700 flex items-center" onClick={e => {
                  e.stopPropagation();
                  // Handle unfollow
                  alert(`Unfollowed ${entity.name}`);
                }}>
                        Unfollow
                      </button>
                    </div>
                  </div>
                </div>)}
              {/* Add New Card */}
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100" onClick={() => navigate('/discover')}>
                <PlusIcon className="h-10 w-10 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Follow More
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Discover artists and venues you might like
                </p>
              </div>
            </div>
          </div>}
        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Recommended For You
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Based on your interests and past activities
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="p-1 rounded-full hover:bg-gray-100" title="Filter">
                  <FilterIcon className="h-5 w-5 text-gray-600" />
                </button>
                <button className="px-3 py-1 text-sm bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
                  Refresh
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedEvents.map(event => <div key={event.id} className="bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={() => navigate(`/event?id=${event.id}`)}>
                  <div className="relative h-40 w-full overflow-hidden">
                    <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs flex items-center">
                      <TrendingUpIcon className="h-3 w-3 mr-1" />
                      {event.matchScore}% match
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {formatEventDate(event.date)}
                    </div>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {event.venue}
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                        {event.category}
                      </span>
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-500 hover:text-gray-700" onClick={e => {
                    e.stopPropagation();
                    // Handle bookmark
                    alert(`Bookmarked ${event.title}`);
                  }} title="Save">
                          <BookmarkIcon className="h-5 w-5" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-gray-700" onClick={e => {
                    e.stopPropagation();
                    // Handle hide recommendation
                    alert(`Removed ${event.title} from recommendations`);
                  }} title="Not Interested">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>)}
              {/* Load More */}
              <div className="lg:col-span-3 flex justify-center py-4">
                <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Load More Recommendations
                </button>
              </div>
            </div>
          </div>}
        {/* Activity Tab */}
        {activeTab === 'activity' && <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.map(activity => <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${activity.type === 'ticket-purchase' ? 'bg-green-100 text-green-600' : activity.type === 'follow' ? 'bg-indigo-100 text-indigo-600' : activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' : 'bg-purple-100 text-purple-600'}`}>
                      {activity.type === 'ticket-purchase' && <TicketIcon className="h-5 w-5" />}
                      {activity.type === 'follow' && <HeartIcon className="h-5 w-5" />}
                      {activity.type === 'review' && <StarIcon className="h-5 w-5" />}
                      {activity.type === 'bookmark' && <BookmarkIcon className="h-5 w-5" />}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-medium text-gray-900">
                          {activity.type === 'ticket-purchase' && 'Purchased Tickets'}
                          {activity.type === 'follow' && 'Started Following'}
                          {activity.type === 'review' && 'Left a Review'}
                          {activity.type === 'bookmark' && 'Saved Event'}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {activity.date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {activity.type === 'ticket-purchase' && `${activity.details} for ${activity.event}`}
                        {activity.type === 'follow' && `${activity.details} ${activity.entity}`}
                        {activity.type === 'review' && `${activity.details} for ${activity.event}`}
                        {activity.type === 'bookmark' && `${activity.details}: ${activity.event}`}
                      </p>
                    </div>
                  </div>
                </div>)}
            </div>
            <div className="px-6 py-4 bg-gray-50 text-center">
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                View Full Activity History
              </button>
            </div>
          </div>}
      </div>
    </div>;
};
export default Dashboard;