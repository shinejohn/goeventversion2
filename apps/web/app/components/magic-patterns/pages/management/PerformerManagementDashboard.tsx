import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  MusicIcon, 
  CalendarIcon, 
  ShoppingBagIcon, 
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
  ImageIcon,
  LinkIcon,
  ShareIcon,
  DownloadIcon,
  FilterIcon,
  SearchIcon
} from 'lucide-react';

interface Performer {
  id: string;
  name: string;
  genre: string;
  bio: string;
  profile_image_url: string;
  cover_image_url: string;
  location: string;
  social_links: Array<{
    platform: string;
    url: string;
  }>;
  is_verified: boolean;
  follower_count: number;
  rating: number;
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
  status: string;
  ticket_price: number;
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
  total_bookings: number;
  total_revenue: number;
  average_rating: number;
  follower_count: number;
  view_count: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  status: string;
  stock_quantity: number;
}

interface PerformerManagementDashboardProps {
  performer: Performer | null;
  events: Event[];
  bookings: Booking[];
  analytics: Analytics;
  products: Product[];
  user: {
    id: string;
    email: string;
  } | null;
  error?: string;
}

export const PerformerManagementDashboard = ({ 
  performer, 
  events, 
  bookings, 
  analytics, 
  products, 
  user, 
  error 
}: PerformerManagementDashboardProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'bookings' | 'shop' | 'analytics' | 'profile'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3Icon },
    { id: 'events', label: 'Events', icon: CalendarIcon },
    { id: 'bookings', label: 'Bookings', icon: MusicIcon },
    { id: 'shop', label: 'Shop', icon: ShoppingBagIcon },
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

  if (!performer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MusicIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Performer Profile Not Found</h1>
          <p className="text-gray-600 mb-6">You need to set up your performer profile first.</p>
          <button
            onClick={() => navigate('/dashboard/performer/setup')}
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
                  src={performer.profile_image_url || '/placeholder-performer.jpg'}
                  alt={performer.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{performer.name}</h1>
                  <p className="text-gray-600">{performer.genre} • {performer.location}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      {analytics.follower_count} followers
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <StarIcon className="h-4 w-4 mr-1" />
                      {analytics.average_rating.toFixed(1)} rating
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {analytics.view_count} views
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/performers/${performer.id}`)}
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
                    <MusicIcon className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Bookings</p>
                      <p className="text-2xl font-bold text-green-900">{analytics.total_bookings}</p>
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
                    <StarIcon className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600">Rating</p>
                      <p className="text-2xl font-bold text-purple-900">{analytics.average_rating.toFixed(1)}</p>
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
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {formatDate(event.start_datetime)} at {formatTime(event.start_datetime)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {event.venue.name} - {event.venue.city}, {event.venue.state}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
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

          {activeTab === 'bookings' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">My Bookings</h2>
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
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {formatDate(booking.event.start_datetime)} at {formatTime(booking.event.start_datetime)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {booking.event.venue.name}
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

          {activeTab === 'shop' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">My Shop</h2>
                <button
                  onClick={() => navigate('/management/performer/shop/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Product
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={product.image_url || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status}
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
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Analytics</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Events</span>
                      <span className="font-medium">{analytics.total_events}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Bookings</span>
                      <span className="font-medium">{analytics.total_bookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Revenue</span>
                      <span className="font-medium">{formatCurrency(analytics.total_revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <span className="font-medium">{analytics.average_rating.toFixed(1)} ⭐</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Social Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Followers</span>
                      <span className="font-medium">{analytics.follower_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profile Views</span>
                      <span className="font-medium">{analytics.view_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Engagement Rate</span>
                      <span className="font-medium">12.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Growth Rate</span>
                      <span className="font-medium text-green-600">+8.2%</span>
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
                      src={performer.profile_image_url || '/placeholder-performer.jpg'}
                      alt={performer.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Change Image
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={performer.cover_image_url || '/placeholder-cover.jpg'}
                      alt="Cover"
                      className="h-20 w-32 rounded object-cover"
                    />
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Change Cover
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      defaultValue={performer.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                    <input
                      type="text"
                      defaultValue={performer.genre}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    defaultValue={performer.bio}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    defaultValue={performer.location}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
                  <div className="space-y-2">
                    {performer.social_links.map((link, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Platform (e.g., Instagram)"
                          defaultValue={link.platform}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                          type="url"
                          placeholder="URL"
                          defaultValue={link.url}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button className="px-3 py-2 text-red-600 hover:text-red-800">
                          Remove
                        </button>
                      </div>
                    ))}
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Add Social Link
                    </button>
                  </div>
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

export default PerformerManagementDashboard;
