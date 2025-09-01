import React, { useState, Children } from 'react';
import { HeartIcon, CalendarIcon, MapPinIcon, ClockIcon, StarIcon, PlusIcon, ChevronDownIcon, MoreHorizontalIcon, BellIcon, CheckCircleIcon, TicketIcon, UsersIcon, ChevronRightIcon, ListIcon, BarChartIcon, GiftIcon, MessageSquareIcon, CameraIcon, BuildingIcon, FileTextIcon, ShareIcon, SearchIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
import { mockVenues } from '../../mockdata/venues';
// Mock data for the user's venues
const mockFavoriteVenues = mockVenues.slice(0, 6).map(venue => ({
  ...venue,
  isFavorite: true,
  lastVisited: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
  upcomingEventsCount: Math.floor(Math.random() * 5) + 1,
  notificationsCount: Math.floor(Math.random() * 3),
  loyaltyPoints: Math.floor(Math.random() * 500),
  visitCount: Math.floor(Math.random() * 20) + 1
}));
// Mock visit history
const mockVisitHistory = [{
  id: 'visit-1',
  venueId: mockVenues[0].id,
  venueName: mockVenues[0].name,
  eventName: 'Summer Jazz Night',
  date: new Date(2024, 5, 2),
  hasPhotos: true,
  photoCount: 8,
  hasReview: true,
  reviewRating: 5,
  ticketPrice: '$45'
}, {
  id: 'visit-2',
  venueId: mockVenues[2].id,
  venueName: mockVenues[2].name,
  eventName: 'Corporate Innovation Summit',
  date: new Date(2024, 4, 15),
  hasPhotos: true,
  photoCount: 3,
  hasReview: true,
  reviewRating: 4,
  ticketPrice: '$250'
}, {
  id: 'visit-3',
  venueId: mockVenues[1].id,
  venueName: mockVenues[1].name,
  eventName: 'Beach Wedding Reception',
  date: new Date(2024, 3, 28),
  hasPhotos: false,
  photoCount: 0,
  hasReview: true,
  reviewRating: 5,
  ticketPrice: 'Free'
}, {
  id: 'visit-4',
  venueId: mockVenues[4].id,
  venueName: mockVenues[4].name,
  eventName: 'Seafood Tasting Night',
  date: new Date(2024, 3, 10),
  hasPhotos: true,
  photoCount: 12,
  hasReview: false,
  reviewRating: 0,
  ticketPrice: '$65'
}, {
  id: 'visit-5',
  venueId: mockVenues[3].id,
  venueName: mockVenues[3].name,
  eventName: 'Art Exhibition Opening',
  date: new Date(2024, 2, 22),
  hasPhotos: true,
  photoCount: 5,
  hasReview: true,
  reviewRating: 4,
  ticketPrice: '$15'
}];
// Mock upcoming events at favorite venues
const mockUpcomingEvents = [{
  id: 'event-1',
  venueId: mockVenues[0].id,
  venueName: mockVenues[0].name,
  eventName: 'Summer Gala Fundraiser',
  date: new Date(2024, 5, 18),
  time: '19:00-23:00',
  image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  organizer: "City Children's Foundation",
  ticketPrice: '$75-150',
  ticketStatus: 'Available',
  friendsAttending: 3
}, {
  id: 'event-2',
  venueId: mockVenues[2].id,
  venueName: mockVenues[2].name,
  eventName: 'Jazz Night with The Modern Quartet',
  date: new Date(2024, 5, 24),
  time: '20:00-22:30',
  image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  organizer: 'Downtown Jazz Series',
  ticketPrice: '$35-45',
  ticketStatus: 'Selling Fast',
  friendsAttending: 0
}, {
  id: 'event-3',
  venueId: mockVenues[1].id,
  venueName: mockVenues[1].name,
  eventName: 'Sunset Wedding Showcase',
  date: new Date(2024, 5, 28),
  time: '17:00-20:00',
  image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  organizer: 'Waterfront Pavilion',
  ticketPrice: 'Free',
  ticketStatus: 'Registration Required',
  friendsAttending: 2
}, {
  id: 'event-4',
  venueId: mockVenues[4].id,
  venueName: mockVenues[4].name,
  eventName: "Chef's Table Experience",
  date: new Date(2024, 6, 5),
  time: '18:30-21:30',
  image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  organizer: 'Seaside Restaurant & Bar',
  ticketPrice: '$120',
  ticketStatus: 'Limited Seats',
  friendsAttending: 1
}];
// Mock venue rewards and offers
const mockRewards = [{
  id: 'reward-1',
  venueId: mockVenues[0].id,
  venueName: mockVenues[0].name,
  programName: 'Grand Ballroom VIP',
  status: 'Gold Member',
  points: 450,
  nextMilestone: 500,
  perks: ['Priority Booking', 'Complimentary Valet', '10% Off Venue Rental'],
  offer: 'Free champagne toast for your next event when you reach 500 points',
  expiryDate: new Date(2024, 11, 31)
}, {
  id: 'reward-2',
  venueId: mockVenues[2].id,
  venueName: mockVenues[2].name,
  programName: 'Historic Theatre Friends',
  status: 'Silver Member',
  points: 200,
  nextMilestone: 300,
  perks: ['Discounted Tickets', 'Members-Only Events'],
  offer: 'Buy one, get one free on select performances this month',
  expiryDate: new Date(2024, 6, 30)
}, {
  id: 'reward-3',
  venueId: mockVenues[4].id,
  venueName: mockVenues[4].name,
  programName: 'Seaside Dining Club',
  status: 'Bronze Member',
  points: 120,
  nextMilestone: 200,
  perks: ['Happy Hour Specials', 'Birthday Dessert'],
  offer: 'Complimentary appetizer with your next dinner reservation',
  expiryDate: new Date(2024, 7, 15)
}];
// Mock venue lists
const mockVenueLists = [{
  id: 'list-1',
  name: 'Wedding Venues to Consider',
  description: 'Potential venues for our 2025 wedding',
  venueCount: 8,
  isPublic: false,
  collaborators: 2,
  lastUpdated: new Date(2024, 4, 12)
}, {
  id: 'list-2',
  name: 'Best Live Music Venues',
  description: 'Great spots for live music in Clearwater',
  venueCount: 5,
  isPublic: true,
  collaborators: 0,
  lastUpdated: new Date(2024, 5, 3)
}, {
  id: 'list-3',
  name: 'Corporate Event Spaces',
  description: 'Venues for company meetings and conferences',
  venueCount: 6,
  isPublic: false,
  collaborators: 3,
  lastUpdated: new Date(2024, 3, 28)
}];
// Mock user stats
const mockUserStats = {
  totalVenuesVisited: 14,
  totalEventsAttended: 27,
  favoriteVenueType: 'Concert Halls',
  mostVisitedVenue: 'The Historic Theatre',
  mostVisitedVenueCount: 8,
  reviewsWritten: 12,
  photosUploaded: 45,
  listsCreated: 3
};
export default function MyVenuesPage() {
  const {
    navigateTo
  } = useNavigationContext();
  const [sortOption, setSortOption] = useState('recent');
  const [timeFilter, setTimeFilter] = useState('upcoming');
  const [activeSection, setActiveSection] = useState('favorites');
  // Sort venues based on selected option
  const sortedVenues = [...mockFavoriteVenues].sort((a, b) => {
    if (sortOption === 'recent') {
      return b.lastVisited.getTime() - a.lastVisited.getTime();
    } else if (sortOption === 'az') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'visits') {
      return b.visitCount - a.visitCount;
    }
    return 0;
  });
  // Filter upcoming events based on selected time filter
  const filteredEvents = [...mockUpcomingEvents].filter(event => {
    const today = new Date();
    if (timeFilter === 'upcoming') {
      return true;
    } else if (timeFilter === 'thisWeek') {
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      return event.date >= today && event.date <= nextWeek;
    } else if (timeFilter === 'thisMonth') {
      const nextMonth = new Date();
      nextMonth.setMonth(today.getMonth() + 1);
      return event.date >= today && event.date <= nextMonth;
    }
    return true;
  });
  // Handle venue click
  const handleVenueClick = (venueId: string) => {
    navigateTo(`/venues/${venueId}/${venueId.replace('venue-', '')}`);
  };
  // Handle event click
  const handleEventClick = (eventId: string, venueId: string) => {
    navigateTo(`/venues/${venueId}/events/${eventId}`);
  };
  // Handle list click
  const handleListClick = (listId: string) => {
    navigateTo(`/my/venues/lists/${listId}`);
  };
  // Handle creating a new list
  const handleCreateList = () => {
    navigateTo('/my/venues/lists/create');
  };
  // Handle writing a review
  const handleWriteReview = (venueId: string) => {
    navigateTo(`/venues/${venueId}/review`);
  };
  // Handle uploading photos
  const handleUploadPhotos = (venueId: string) => {
    navigateTo(`/venues/${venueId}/photos/upload`);
  };
  // Navigation tabs
  const tabs = [{
    id: 'favorites',
    label: 'Favorite Venues',
    icon: <HeartIcon className="h-4 w-4" />
  }, {
    id: 'history',
    label: 'Visit History',
    icon: <ClockIcon className="h-4 w-4" />
  }, {
    id: 'upcoming',
    label: 'Upcoming Events',
    icon: <CalendarIcon className="h-4 w-4" />
  }, {
    id: 'rewards',
    label: 'Rewards & Offers',
    icon: <GiftIcon className="h-4 w-4" />
  }, {
    id: 'lists',
    label: 'My Lists',
    icon: <ListIcon className="h-4 w-4" />
  }, {
    id: 'social',
    label: 'Reviews & Photos',
    icon: <MessageSquareIcon className="h-4 w-4" />
  }];
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Venues</h1>
          <p className="mt-2 text-lg text-gray-600">
            Track your favorite venues, past visits, and upcoming events
          </p>
        </div>
        {/* Stats Overview */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChartIcon className="h-5 w-5 text-indigo-600 mr-2" />
              Your Venue Stats
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">
                  {mockUserStats.totalVenuesVisited}
                </div>
                <div className="text-sm text-gray-600">Venues Visited</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">
                  {mockUserStats.totalEventsAttended}
                </div>
                <div className="text-sm text-gray-600">Events Attended</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">
                  {mockUserStats.reviewsWritten}
                </div>
                <div className="text-sm text-gray-600">Reviews Written</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">
                  {mockUserStats.photosUploaded}
                </div>
                <div className="text-sm text-gray-600">Photos Uploaded</div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="font-medium text-gray-700">
                  Most Visited Venue
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-gray-900">
                    {mockUserStats.mostVisitedVenue}
                  </div>
                  <div className="text-indigo-600 font-medium">
                    {mockUserStats.mostVisitedVenueCount} visits
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="font-medium text-gray-700">
                  Favorite Venue Type
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-gray-900">
                    {mockUserStats.favoriteVenueType}
                  </div>
                  <div className="text-indigo-600 font-medium">
                    {Math.round(mockUserStats.totalVenuesVisited * 0.6)} venues
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-8">
            {tabs.map(tab => <button key={tab.id} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${activeSection === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveSection(tab.id)}>
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>)}
          </div>
        </div>
        {/* Favorite Venues Section */}
        {activeSection === 'favorites' && <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Favorite Venues
              </h2>
              <div className="flex items-center">
                <div className="mr-4">
                  <label htmlFor="sort-venues" className="sr-only">
                    Sort venues
                  </label>
                  <select id="sort-venues" value={sortOption} onChange={e => setSortOption(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="recent">Recently Visited</option>
                    <option value="az">Alphabetical (A-Z)</option>
                    <option value="visits">Most Visited</option>
                  </select>
                </div>
                <button onClick={() => navigateTo('/venues')} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Venues
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedVenues.map(venue => <div key={venue.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-40 overflow-hidden">
                    <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
                    <button className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm text-pink-500" aria-label="Remove from favorites">
                      <HeartIcon className="h-5 w-5 fill-current" />
                    </button>
                    {venue.notificationsCount > 0 && <div className="absolute top-3 left-3 px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full flex items-center">
                        <BellIcon className="h-3 w-3 mr-1" />
                        {venue.notificationsCount}{' '}
                        {venue.notificationsCount === 1 ? 'update' : 'updates'}
                      </div>}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 hover:text-indigo-600 cursor-pointer" onClick={() => handleVenueClick(venue.id)}>
                          {venue.name}
                        </h3>
                        <div className="text-sm text-gray-500 mt-1">
                          {venue.venueType}
                        </div>
                      </div>
                      <div className="relative">
                        <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
                          <MoreHorizontalIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{venue.location.address.split(',')[0]}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Last Visited</div>
                        <div className="font-medium text-gray-900">
                          {venue.lastVisited.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Upcoming Events</div>
                        <div className="font-medium text-gray-900">
                          {venue.upcomingEventsCount > 0 ? <span className="text-indigo-600">
                              {venue.upcomingEventsCount} events
                            </span> : 'None'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-amber-400" />
                        <span className="ml-1 text-gray-900 font-medium">
                          {venue.rating}
                        </span>
                        <span className="ml-1 text-gray-500 text-sm">
                          ({venue.reviewCount})
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {venue.visitCount}{' '}
                        {venue.visitCount === 1 ? 'visit' : 'visits'}
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
            {sortedVenues.length === 0 && <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <BuildingIcon className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No favorite venues yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start exploring venues and save your favorites
                </p>
                <div className="mt-6">
                  <button onClick={() => navigateTo('/venues')} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Browse Venues
                  </button>
                </div>
              </div>}
          </div>}
        {/* Visit History Section */}
        {activeSection === 'history' && <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Visit History
              </h2>
              <div className="flex items-center">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <FileTextIcon className="h-4 w-4 mr-1" />
                  Export History
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="space-y-8">
                  {mockVisitHistory.map((visit, index) => <div key={visit.id} className="relative">
                      {index < mockVisitHistory.length - 1 && <div className="absolute top-8 left-4 w-0.5 h-full -ml-px bg-gray-200"></div>}
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <TicketIcon className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                            <div>
                              <p className="font-medium text-gray-900">
                                {visit.eventName}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                <button className="font-medium text-indigo-600 hover:text-indigo-800" onClick={() => handleVenueClick(visit.venueId)}>
                                  {visit.venueName}
                                </button>
                              </p>
                            </div>
                            <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                              {visit.date.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-3">
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Ticket: {visit.ticketPrice}
                            </div>
                            {visit.hasReview && <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <StarIcon className="h-3 w-3 mr-1" />
                                Reviewed: {visit.reviewRating}/5
                              </div>}
                            {visit.hasPhotos && <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <CameraIcon className="h-3 w-3 mr-1" />
                                {visit.photoCount} Photos
                              </div>}
                          </div>
                          <div className="mt-3 flex space-x-3">
                            {!visit.hasReview && <button onClick={() => handleWriteReview(visit.venueId)} className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                <StarIcon className="h-3 w-3 mr-1" />
                                Write Review
                              </button>}
                            <button onClick={() => handleUploadPhotos(visit.venueId)} className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs rounded-md text-gray-700 bg-white hover:bg-gray-50">
                              <CameraIcon className="h-3 w-3 mr-1" />
                              {visit.hasPhotos ? 'Add More Photos' : 'Upload Photos'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
                {mockVisitHistory.length === 0 && <div className="text-center py-8">
                    <ClockIcon className="h-12 w-12 text-gray-400 mx-auto" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No visit history yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Your venue visits will appear here once you attend events
                    </p>
                  </div>}
              </div>
            </div>
          </div>}
        {/* Upcoming Events Section */}
        {activeSection === 'upcoming' && <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Upcoming at My Venues
              </h2>
              <div className="flex items-center">
                <div className="mr-4">
                  <label htmlFor="time-filter" className="sr-only">
                    Filter events
                  </label>
                  <select id="time-filter" value={timeFilter} onChange={e => setTimeFilter(e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    <option value="upcoming">All Upcoming</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                  </select>
                </div>
                <button onClick={() => navigateTo('/calendar')} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  View Calendar
                </button>
              </div>
            </div>
            <div className="space-y-6">
              {filteredEvents.map(event => <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-56 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                      <img src={event.image} alt={event.eventName} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div>
                          <div className="flex items-center text-sm text-gray-600">
                            <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                            <span>
                              {event.date.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                            </span>
                            <span className="mx-2 text-gray-400">•</span>
                            <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{event.time}</span>
                          </div>
                          <h3 className="mt-2 font-bold text-xl text-gray-900 hover:text-indigo-600 cursor-pointer" onClick={() => handleEventClick(event.id, event.venueId)}>
                            {event.eventName}
                          </h3>
                          <div className="mt-1">
                            <span className="text-gray-600">at </span>
                            <button className="font-medium text-indigo-600 hover:text-indigo-800" onClick={() => handleVenueClick(event.venueId)}>
                              {event.venueName}
                            </button>
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            Organized by {event.organizer}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 md:ml-6 md:text-right">
                          <div className="text-gray-900 font-medium">
                            {event.ticketPrice}
                          </div>
                          <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.ticketStatus === 'Available' ? 'bg-green-100 text-green-800' : event.ticketStatus === 'Selling Fast' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                            {event.ticketStatus}
                          </div>
                          {event.friendsAttending > 0 && <div className="mt-2 text-sm text-gray-600 flex items-center justify-end">
                              <UsersIcon className="h-4 w-4 mr-1" />
                              {event.friendsAttending}{' '}
                              {event.friendsAttending === 1 ? 'friend' : 'friends'}{' '}
                              attending
                            </div>}
                        </div>
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button onClick={() => handleEventClick(event.id, event.venueId)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                          <TicketIcon className="h-4 w-4 mr-1" />
                          Get Tickets
                        </button>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Add to Calendar
                        </button>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          <ShareIcon className="h-4 w-4 mr-1" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>)}
              {filteredEvents.length === 0 && <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No upcoming events
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are no upcoming events at your favorite venues for the
                    selected time period
                  </p>
                  <div className="mt-6">
                    <button onClick={() => navigateTo('/events')} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                      Browse All Events
                    </button>
                  </div>
                </div>}
            </div>
          </div>}
        {/* Rewards & Offers Section */}
        {activeSection === 'rewards' && <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Venue Rewards & Offers
              </h2>
            </div>
            <div className="space-y-6">
              {mockRewards.map(reward => <div key={reward.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-bold text-lg text-gray-900 hover:text-indigo-600 cursor-pointer" onClick={() => handleVenueClick(reward.venueId)}>
                            {reward.venueName}
                          </h3>
                          <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reward.status === 'Gold Member' ? 'bg-amber-100 text-amber-800' : reward.status === 'Silver Member' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {reward.status}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          {reward.programName}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6 md:text-right">
                        <div className="text-lg font-medium text-indigo-600">
                          {reward.points} points
                        </div>
                        <div className="text-sm text-gray-600">
                          {reward.nextMilestone - reward.points} points until
                          next level
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div style={{
                      width: `${reward.points / reward.nextMilestone * 100}%`
                    }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 bg-indigo-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <GiftIcon className="h-5 w-5 text-indigo-600 mt-0.5 mr-2" />
                        <div>
                          <h4 className="font-medium text-indigo-900">
                            Special Offer
                          </h4>
                          <p className="mt-1 text-sm text-indigo-700">
                            {reward.offer}
                          </p>
                          <p className="mt-1 text-xs text-indigo-600">
                            Expires:{' '}
                            {reward.expiryDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900">
                        Membership Perks
                      </h4>
                      <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {reward.perks.map((perk, index) => <li key={index} className="flex items-center text-sm">
                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                            {perk}
                          </li>)}
                      </ul>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button onClick={() => handleVenueClick(reward.venueId)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        View Venue
                      </button>
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        Redeem Points
                      </button>
                    </div>
                  </div>
                </div>)}
              {mockRewards.length === 0 && <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <GiftIcon className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No rewards yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Visit venues more often to earn rewards and special offers
                  </p>
                  <div className="mt-6">
                    <button onClick={() => navigateTo('/venues')} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                      Browse Venues
                    </button>
                  </div>
                </div>}
            </div>
          </div>}
        {/* Venue Lists Section */}
        {activeSection === 'lists' && <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                My Venue Lists
              </h2>
              <button onClick={handleCreateList} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <PlusIcon className="h-4 w-4 mr-1" />
                Create New List
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockVenueLists.map(list => <div key={list.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 hover:text-indigo-600 cursor-pointer" onClick={() => handleListClick(list.id)}>
                          {list.name}
                        </h3>
                        <div className="mt-1 text-sm text-gray-600">
                          {list.description}
                        </div>
                      </div>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${list.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {list.isPublic ? 'Public' : 'Private'}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="text-gray-600">
                        {list.venueCount}{' '}
                        {list.venueCount === 1 ? 'venue' : 'venues'}
                      </div>
                      <div className="text-gray-600">
                        Updated{' '}
                        {list.lastUpdated.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                      </div>
                    </div>
                    {list.collaborators > 0 && <div className="mt-3 flex items-center text-sm text-gray-600">
                        <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {list.collaborators}{' '}
                        {list.collaborators === 1 ? 'collaborator' : 'collaborators'}
                      </div>}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button onClick={() => handleListClick(list.id)} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <ListIcon className="h-4 w-4 mr-1" />
                        View List
                      </button>
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <ShareIcon className="h-4 w-4 mr-1" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>)}
              {/* Create New List Card */}
              <div className="bg-gray-50 rounded-lg border border-dashed border-gray-300 overflow-hidden hover:bg-gray-100 transition-colors cursor-pointer" onClick={handleCreateList}>
                <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
                    <PlusIcon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-gray-900">Create New List</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Organize venues into custom lists for easy reference
                  </p>
                </div>
              </div>
            </div>
          </div>}
        {/* Reviews & Photos Section */}
        {activeSection === 'social' && <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                My Reviews & Photos
              </h2>
              <div className="flex items-center">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3">
                  <CameraIcon className="h-4 w-4 mr-1" />
                  My Photos ({mockUserStats.photosUploaded})
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <MessageSquareIcon className="h-4 w-4 mr-1" />
                  My Reviews ({mockUserStats.reviewsWritten})
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="mb-6 flex justify-between items-center border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-gray-900">Recent Reviews</h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">
                    View All Reviews
                  </button>
                </div>
                <div className="space-y-6">
                  {mockVisitHistory.filter(visit => visit.hasReview).slice(0, 3).map(visit => <div key={visit.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer" onClick={() => handleVenueClick(visit.venueId)}>
                                {visit.venueName}
                              </h4>
                              <div className="ml-3 flex">
                                {Array.from({
                          length: 5
                        }).map((_, i) => <StarIcon key={i} className={`h-4 w-4 ${i < visit.reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                              </div>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                              Reviewed after attending {visit.eventName}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {visit.date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                          </div>
                        </div>
                        <div className="mt-3 text-gray-700">
                          "Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Nulla facilisi. Praesent vehicula odio eget
                          libero tincidunt, vel sagittis nisi pharetra."
                        </div>
                        <div className="mt-3 flex items-center text-sm">
                          <button className="text-gray-500 hover:text-gray-700">
                            Edit Review
                          </button>
                          <span className="mx-2 text-gray-300">|</span>
                          <button className="text-gray-500 hover:text-gray-700">
                            Delete
                          </button>
                          <div className="ml-auto text-gray-500">
                            <span className="text-green-600 font-medium">
                              12
                            </span>{' '}
                            people found this helpful
                          </div>
                        </div>
                      </div>)}
                  {mockVisitHistory.filter(visit => visit.hasReview).length === 0 && <div className="text-center py-8">
                      <MessageSquareIcon className="h-12 w-12 text-gray-400 mx-auto" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">
                        No reviews yet
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Share your experiences by writing reviews for venues
                        you've visited
                      </p>
                    </div>}
                </div>
              </div>
            </div>
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="mb-6 flex justify-between items-center border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-gray-900">Recent Photos</h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-800">
                    View All Photos
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {mockVisitHistory.filter(visit => visit.hasPhotos).slice(0, 8).flatMap(visit => Array.from({
                length: Math.min(visit.photoCount, 2)
              }).map((_, index) => ({
                id: `${visit.id}-photo-${index}`,
                venueId: visit.venueId,
                venueName: visit.venueName,
                eventName: visit.eventName,
                date: visit.date,
                url: mockVenues.find(v => v.id === visit.venueId)?.images[index % mockVenues[0].images.length] || ''
              }))).slice(0, 8).map(photo => <div key={photo.id} className="relative group">
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                          <img src={photo.url} alt={`Photo from ${photo.eventName}`} className="object-cover w-full h-full group-hover:opacity-90 transition-opacity" />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                          <button className="p-1.5 bg-white rounded-full shadow-sm">
                            <SearchIcon className="h-4 w-4 text-gray-700" />
                          </button>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 truncate">
                          {photo.venueName}
                        </div>
                      </div>)}
                  {mockVisitHistory.filter(visit => visit.hasPhotos).length === 0 && <div className="col-span-full text-center py-8">
                      <CameraIcon className="h-12 w-12 text-gray-400 mx-auto" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">
                        No photos yet
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Upload photos from your visits to share with the
                        community
                      </p>
                    </div>}
                </div>
              </div>
            </div>
          </div>}
      </div>
    </div>;
}