import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  UsersIcon, 
  CalendarIcon, 
  BarChart3Icon, 
  SettingsIcon, 
  PlusIcon,
  EditIcon,
  EyeIcon,
  ShareIcon,
  TrendingUpIcon,
  ClockIcon,
  MapPinIcon,
  ImageIcon,
  LinkIcon,
  MessageSquareIcon,
  HeartIcon,
  BookmarkIcon,
  FilterIcon,
  DownloadIcon,
  GlobeIcon,
  StarIcon,
  ActivityIcon,
  TargetIcon
} from 'lucide-react';

interface Influencer {
  id: string;
  display_name: string;
  bio: string;
  location: string;
  website: string;
  social_links: Array<{
    platform: string;
    url: string;
  }>;
  profile_image_url: string;
  cover_image_url: string;
}

interface Community {
  id: string;
  name: string;
  description: string;
  slug: string;
  member_count: number;
  thread_count: number;
  is_public: boolean;
  created_at: string;
  image_url: string;
  categories: string[];
}

interface Calendar {
  id: string;
  name: string;
  description: string;
  slug: string;
  event_count: number;
  subscriber_count: number;
  is_public: boolean;
  created_at: string;
  cover_image_url: string;
  categories: string[];
}

interface Content {
  id: string;
  title: string;
  content: string;
  type: 'post' | 'event' | 'review' | 'recommendation';
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  created_at: string;
  image_url: string;
}

interface Analytics {
  total_communities: number;
  total_calendars: number;
  total_followers: number;
  total_engagement: number;
  total_content: number;
  reach: number;
}

interface InfluencerManagementDashboardProps {
  influencer: Influencer | null;
  communities: Community[];
  calendars: Calendar[];
  content: Content[];
  analytics: Analytics;
  user: {
    id: string;
    email: string;
  } | null;
  error?: string;
}

export const InfluencerManagementDashboard = ({ 
  influencer, 
  communities, 
  calendars, 
  content, 
  analytics, 
  user, 
  error 
}: InfluencerManagementDashboardProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'communities' | 'calendars' | 'content' | 'analytics' | 'profile'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3Icon },
    { id: 'communities', label: 'Communities', icon: UsersIcon },
    { id: 'calendars', label: 'Calendars', icon: CalendarIcon },
    { id: 'content', label: 'Content', icon: MessageSquareIcon },
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
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

  if (!influencer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Influencer Profile Not Found</h1>
          <p className="text-gray-600 mb-6">You need to set up your influencer profile first.</p>
          <button
            onClick={() => navigate('/dashboard/influencer/setup')}
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
                  src={influencer.profile_image_url || '/placeholder-influencer.jpg'}
                  alt={influencer.display_name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{influencer.display_name}</h1>
                  <p className="text-gray-600">{influencer.location} • Influencer</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      {formatNumber(analytics.total_followers)} followers
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ActivityIcon className="h-4 w-4 mr-1" />
                      {formatNumber(analytics.total_engagement)} engagement
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <TargetIcon className="h-4 w-4 mr-1" />
                      {formatNumber(analytics.reach)} reach
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/profile/${influencer.id}`)}
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
                    <UsersIcon className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Communities</p>
                      <p className="text-2xl font-bold text-blue-900">{analytics.total_communities}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <CalendarIcon className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Calendars</p>
                      <p className="text-2xl font-bold text-green-900">{analytics.total_calendars}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <HeartIcon className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-yellow-600">Followers</p>
                      <p className="text-2xl font-bold text-yellow-900">{formatNumber(analytics.total_followers)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <ActivityIcon className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600">Engagement</p>
                      <p className="text-2xl font-bold text-purple-900">{formatNumber(analytics.total_engagement)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Communities</h3>
                  <div className="space-y-3">
                    {communities.slice(0, 5).map(community => (
                      <div key={community.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={community.image_url || '/placeholder-community.jpg'}
                            alt={community.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{community.name}</p>
                            <p className="text-sm text-gray-600">{community.member_count} members</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          community.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {community.is_public ? 'Public' : 'Private'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Calendars</h3>
                  <div className="space-y-3">
                    {calendars.slice(0, 5).map(calendar => (
                      <div key={calendar.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={calendar.cover_image_url || '/placeholder-calendar.jpg'}
                            alt={calendar.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{calendar.name}</p>
                            <p className="text-sm text-gray-600">{calendar.subscriber_count} subscribers</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          calendar.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {calendar.is_public ? 'Public' : 'Private'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'communities' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">My Communities</h2>
                <button
                  onClick={() => navigate('/hubs/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Community
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities.map(community => (
                  <div key={community.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={community.image_url || '/placeholder-community.jpg'}
                      alt={community.name}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{community.name}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{community.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          {community.member_count} members
                        </div>
                        <div className="flex items-center">
                          <MessageSquareIcon className="h-4 w-4 mr-1" />
                          {community.thread_count} threads
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/c/${community.slug}`)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/management/influencer/communities/${community.id}/edit`)}
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

          {activeTab === 'calendars' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">My Calendars</h2>
                <button
                  onClick={() => navigate('/calendars/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Calendar
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {calendars.map(calendar => (
                  <div key={calendar.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={calendar.cover_image_url || '/placeholder-calendar.jpg'}
                      alt={calendar.name}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{calendar.name}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{calendar.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {calendar.event_count} events
                        </div>
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          {calendar.subscriber_count} subscribers
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/calendars/${calendar.slug}`)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/management/influencer/calendars/${calendar.id}/edit`)}
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

          {activeTab === 'content' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">My Content</h2>
                <button
                  onClick={() => navigate('/management/influencer/content/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Content
                </button>
              </div>

              <div className="space-y-4">
                {content.map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.image_url || '/placeholder-content.jpg'}
                        alt={item.title}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.type === 'post' ? 'bg-blue-100 text-blue-800' :
                            item.type === 'event' ? 'bg-green-100 text-green-800' :
                            item.type === 'review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.content}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center">
                            <HeartIcon className="h-4 w-4 mr-1" />
                            {formatNumber(item.engagement.likes)}
                          </div>
                          <div className="flex items-center">
                            <MessageSquareIcon className="h-4 w-4 mr-1" />
                            {formatNumber(item.engagement.comments)}
                          </div>
                          <div className="flex items-center">
                            <ShareIcon className="h-4 w-4 mr-1" />
                            {formatNumber(item.engagement.shares)}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {formatDate(item.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/management/influencer/content/${item.id}/edit`)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/management/influencer/content/${item.id}`)}
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

          {activeTab === 'analytics' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Influencer Analytics</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Content Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Communities</span>
                      <span className="font-medium">{analytics.total_communities}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Calendars</span>
                      <span className="font-medium">{analytics.total_calendars}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Content</span>
                      <span className="font-medium">{analytics.total_content}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Followers</span>
                      <span className="font-medium">{formatNumber(analytics.total_followers)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Engagement</span>
                      <span className="font-medium">{formatNumber(analytics.total_engagement)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reach</span>
                      <span className="font-medium">{formatNumber(analytics.reach)}</span>
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
                      src={influencer.profile_image_url || '/placeholder-influencer.jpg'}
                      alt={influencer.display_name}
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
                      src={influencer.cover_image_url || '/placeholder-cover.jpg'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                    <input
                      type="text"
                      defaultValue={influencer.display_name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      defaultValue={influencer.location}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    defaultValue={influencer.bio}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    defaultValue={influencer.website}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
                  <div className="space-y-2">
                    {influencer.social_links.map((link, index) => (
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

export default InfluencerManagementDashboard;
