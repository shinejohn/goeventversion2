import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  CalendarIcon, 
  BuildingIcon, 
  MusicIcon, 
  BarChart3Icon, 
  SettingsIcon, 
  PlusIcon,
  EditIcon,
  EyeIcon,
  DollarSignIcon,
  UsersIcon,
  StarIcon,
  TrendingUpIcon,
  ClockIcon,
  MapPinIcon,
  FilterIcon,
  DownloadIcon,
  ShareIcon,
  TargetIcon,
  ActivityIcon
} from 'lucide-react';

interface Organizer {
  id: string;
  display_name: string;
  bio: string;
  location: string;
  website: string;
  profile_image_url: string;
}

interface Event {
  id: string;
  title: string;
  start_datetime: string;
  end_datetime: string;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
  };
  performer: {
    name: string;
    genre: string;
  };
  status: string;
  ticket_price: number;
  expected_attendance: number;
}

interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  capacity: number;
  rating: number;
  image_url: string;
}

interface Performer {
  id: string;
  name: string;
  genre: string;
  rating: number;
  profile_image_url: string;
  events: {
    count: number;
  };
}

interface Booking {
  id: string;
  event: {
    title: string;
    start_datetime: string;
    venue: {
      name: string;
    };
  };
  status: string;
  total_amount: number;
  created_at: string;
}

interface Analytics {
  total_events: number;
  total_venues: number;
  total_performers: number;
  total_revenue: number;
  total_attendees: number;
  average_rating: number;
}

interface OrganizerManagementDashboardProps {
  organizer: Organizer | null;
  events: Event[];
  venues: Venue[];
  performers: Performer[];
  bookings: Booking[];
  analytics: Analytics;
  user: {
    id: string;
    email: string;
  } | null;
  error?: string;
}

export const OrganizerManagementDashboard = ({ 
  organizer, 
  events, 
  venues, 
  performers, 
  bookings, 
  analytics, 
  user, 
  error 
}: OrganizerManagementDashboardProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'venues' | 'performers' | 'bookings' | 'analytics' | 'profile'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3Icon },
    { id: 'events', label: 'Events', icon: CalendarIcon },
    { id: 'venues', label: 'Venues', icon: BuildingIcon },
    { id: 'performers', label: 'Performers', icon: MusicIcon },
    { id: 'bookings', label: 'Bookings', icon: TargetIcon },
    { id: 'analytics', label: 'Analytics', icon: TrendingUpIcon },
    { id: 'profile', label: 'Profile', icon: SettingsIcon },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Organizer Profile Not Found</h1>
          <p className="text-gray-600 mb-6">You need to set up your organizer profile first.</p>
          <button
            onClick={() => navigate('/dashboard/organizer/setup')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Set Up Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={organizer.profile_image_url || '/placeholder-organizer.jpg'}
                  alt={organizer.display_name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{organizer.display_name}</h1>
                  <p className="text-gray-600">Event Organizer • {organizer.location}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {analytics.total_events} events
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <BuildingIcon className="h-4 w-4 mr-1" />
                      {analytics.total_venues} venues
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MusicIcon className="h-4 w-4 mr-1" />
                      {analytics.total_performers} performers
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/profile/${organizer.id}`)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Public Profile
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <EditIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6">
            <nav className="flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'overview' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Dashboard Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <CalendarIcon className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Total Events</p>
                      <p className="text-2xl font-bold text-blue-900">{analytics.total_events}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <BuildingIcon className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Venues</p>
                      <p className="text-2xl font-bold text-green-900">{analytics.total_venues}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <DollarSignIcon className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-yellow-600">Revenue</p>
                      <p className="text-2xl font-bold text-yellow-900">{formatCurrency(analytics.total_revenue)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <UsersIcon className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600">Attendees</p>
                      <p className="text-2xl font-bold text-purple-900">{analytics.total_attendees}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Events</h3>
                  <div className="space-y-3">
                    {events.slice(0, 5).map(event => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-600">{event.venue.name} • {formatDate(event.start_datetime)}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings</h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map(booking => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{booking.event.title}</p>
                          <p className="text-sm text-gray-600">{booking.event.venue.name} • {formatDate(booking.event.start_datetime)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatCurrency(booking.total_amount)}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">My Events</h2>
                <button
                  onClick={() => navigate('/events/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Event
                </button>
              </div>

              <div className="space-y-4">
                {events.map(event => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <BuildingIcon className="h-4 w-4 mr-2" />
                          {event.venue.name} - {event.venue.city}, {event.venue.state}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MusicIcon className="h-4 w-4 mr-2" />
                          {event.performer.name} • {event.performer.genre}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {formatDate(event.start_datetime)} at {formatTime(event.start_datetime)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <UsersIcon className="h-4 w-4 mr-2" />
                          Expected: {event.expected_attendance} attendees
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-medium text-gray-900">{formatCurrency(event.ticket_price)}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.status}
                        </span>
                        <button
                          onClick={() => navigate(`/events/${event.id}/edit`)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/events/${event.id}`)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'venues' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Managed Venues</h2>
                <button
                  onClick={() => navigate('/venues/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Venue
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {venues.map(venue => (
                  <div key={venue.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={venue.image_url || '/placeholder-venue.jpg'}
                      alt={venue.name}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{venue.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        {venue.address}, {venue.city}, {venue.state}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          {venue.capacity} capacity
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 mr-1" />
                          {venue.rating.toFixed(1)} rating
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/venues/${venue.id}`)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/venues/${venue.id}/edit`)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          <EditIcon className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performers' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Booked Performers</h2>
                <button
                  onClick={() => navigate('/performers/discover')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Find Performers
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {performers.map(performer => (
                  <div key={performer.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={performer.profile_image_url || '/placeholder-performer.jpg'}
                      alt={performer.name}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{performer.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{performer.genre}</p>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {performer.events.count} events
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 mr-1" />
                          {performer.rating.toFixed(1)} rating
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/performers/${performer.id}`)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/book/performer/${performer.id}`)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          <TargetIcon className="h-4 w-4 mr-2" />
                          Book Again
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Event Bookings</h2>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <FilterIcon className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {bookings.map(booking => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{booking.event.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <BuildingIcon className="h-4 w-4 mr-2" />
                          {booking.event.venue.name}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {formatDate(booking.event.start_datetime)} at {formatTime(booking.event.start_datetime)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-medium text-gray-900">{formatCurrency(booking.total_amount)}</p>
                          <p className="text-sm text-gray-600">{formatDate(booking.created_at)}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Organizer Analytics</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Event Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Events</span>
                      <span className="font-medium">{analytics.total_events}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Venues</span>
                      <span className="font-medium">{analytics.total_venues}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Performers</span>
                      <span className="font-medium">{analytics.total_performers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-medium">{formatCurrency(analytics.total_revenue)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Audience Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Attendees</span>
                      <span className="font-medium">{analytics.total_attendees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <span className="font-medium">{analytics.average_rating.toFixed(1)} ⭐</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Repeat Rate</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth Rate</span>
                      <span className="font-medium text-green-600">+15.3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={organizer.profile_image_url || '/placeholder-organizer.jpg'}
                      alt={organizer.display_name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Change Image
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                    <input
                      type="text"
                      defaultValue={organizer.display_name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      defaultValue={organizer.location}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    defaultValue={organizer.bio}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    defaultValue={organizer.website}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Cancel
                  </button>
                  <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerManagementDashboard;
