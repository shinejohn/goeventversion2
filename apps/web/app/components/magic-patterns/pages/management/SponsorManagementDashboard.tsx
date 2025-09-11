import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  TargetIcon, 
  CalendarIcon, 
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
  ActivityIcon,
  HandshakeIcon,
  MegaphoneIcon,
  PieChartIcon
} from 'lucide-react';

interface Sponsor {
  id: string;
  display_name: string;
  bio: string;
  company: string;
  website: string;
  profile_image_url: string;
  industry: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  budget: number;
  status: string;
  start_date: string;
  end_date: string;
  target_audience: string;
  events: {
    title: string;
    start_datetime: string;
    venue: {
      name: string;
    };
  }[];
  metrics: {
    reach: number;
    engagement: number;
    conversions: number;
  };
}

interface Partnership {
  id: string;
  partner: {
    display_name: string;
    profile_image_url: string;
  };
  type: string;
  status: string;
  investment: number;
  created_at: string;
  description: string;
}

interface SponsoredEvent {
  id: string;
  title: string;
  start_datetime: string;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
  };
  sponsorship_amount: number;
  status: string;
}

interface Analytics {
  total_campaigns: number;
  total_partnerships: number;
  total_investment: number;
  total_reach: number;
  total_engagement: number;
  roi: number;
}

interface SponsorManagementDashboardProps {
  sponsor: Sponsor | null;
  campaigns: Campaign[];
  partnerships: Partnership[];
  sponsoredEvents: SponsoredEvent[];
  analytics: Analytics;
  user: {
    id: string;
    email: string;
  } | null;
  error?: string;
}

export const SponsorManagementDashboard = ({ 
  sponsor, 
  campaigns, 
  partnerships, 
  sponsoredEvents, 
  analytics, 
  user, 
  error 
}: SponsorManagementDashboardProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'partnerships' | 'events' | 'analytics' | 'profile'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3Icon },
    { id: 'campaigns', label: 'Campaigns', icon: TargetIcon },
    { id: 'partnerships', label: 'Partnerships', icon: HandshakeIcon },
    { id: 'events', label: 'Sponsored Events', icon: CalendarIcon },
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

  if (!sponsor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TargetIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sponsor Profile Not Found</h1>
          <p className="text-gray-600 mb-6">You need to set up your sponsor profile first.</p>
          <button
            onClick={() => navigate('/dashboard/sponsor/setup')}
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
                  src={sponsor.profile_image_url || '/placeholder-sponsor.jpg'}
                  alt={sponsor.display_name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{sponsor.display_name}</h1>
                  <p className="text-gray-600">{sponsor.company} • {sponsor.industry}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <TargetIcon className="h-4 w-4 mr-1" />
                      {analytics.total_campaigns} campaigns
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <HandshakeIcon className="h-4 w-4 mr-1" />
                      {analytics.total_partnerships} partnerships
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSignIcon className="h-4 w-4 mr-1" />
                      {formatCurrency(analytics.total_investment)} invested
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/profile/${sponsor.id}`)}
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
                    <TargetIcon className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Campaigns</p>
                      <p className="text-2xl font-bold text-blue-900">{analytics.total_campaigns}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <HandshakeIcon className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Partnerships</p>
                      <p className="text-2xl font-bold text-green-900">{analytics.total_partnerships}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <DollarSignIcon className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-yellow-600">Total Investment</p>
                      <p className="text-2xl font-bold text-yellow-900">{formatCurrency(analytics.total_investment)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <TrendingUpIcon className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600">ROI</p>
                      <p className="text-2xl font-bold text-purple-900">{analytics.roi.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Campaigns</h3>
                  <div className="space-y-3">
                    {campaigns.slice(0, 5).map(campaign => (
                      <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{campaign.name}</p>
                          <p className="text-sm text-gray-600">{formatCurrency(campaign.budget)} • {formatDate(campaign.start_date)}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Partnerships</h3>
                  <div className="space-y-3">
                    {partnerships.slice(0, 5).map(partnership => (
                      <div key={partnership.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img
                            src={partnership.partner.profile_image_url || '/placeholder-partner.jpg'}
                            alt={partnership.partner.display_name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{partnership.partner.display_name}</p>
                            <p className="text-sm text-gray-600">{partnership.type}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          partnership.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {partnership.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">My Campaigns</h2>
                <button
                  onClick={() => navigate('/management/sponsor/campaigns/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Campaign
                </button>
              </div>

              <div className="space-y-4">
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                        <div className="flex items-center text-sm text-gray-600 mt-2">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <UsersIcon className="h-4 w-4 mr-2" />
                          Target: {campaign.target_audience}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <ActivityIcon className="h-4 w-4 mr-2" />
                          Reach: {formatNumber(campaign.metrics.reach)} • Engagement: {campaign.metrics.engagement}%
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-medium text-gray-900">{formatCurrency(campaign.budget)}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {campaign.status}
                        </span>
                        <button
                          onClick={() => navigate(`/management/sponsor/campaigns/${campaign.id}/edit`)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/management/sponsor/campaigns/${campaign.id}`)}
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

          {activeTab === 'partnerships' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">My Partnerships</h2>
                <button
                  onClick={() => navigate('/management/sponsor/partnerships/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Partnership
                </button>
              </div>

              <div className="space-y-4">
                {partnerships.map(partnership => (
                  <div key={partnership.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={partnership.partner.profile_image_url || '/placeholder-partner.jpg'}
                          alt={partnership.partner.display_name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{partnership.partner.display_name}</h3>
                          <p className="text-sm text-gray-600">{partnership.type} Partnership</p>
                          <p className="text-sm text-gray-600 mt-1">{partnership.description}</p>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <ClockIcon className="h-4 w-4 mr-2" />
                            Started: {formatDate(partnership.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-medium text-gray-900">{formatCurrency(partnership.investment)}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          partnership.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {partnership.status}
                        </span>
                        <button
                          onClick={() => navigate(`/management/sponsor/partnerships/${partnership.id}/edit`)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Sponsored Events</h2>
                <button
                  onClick={() => navigate('/events/sponsor')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Sponsor Event
                </button>
              </div>

              <div className="space-y-4">
                {sponsoredEvents.map(event => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          {event.venue.name} - {event.venue.city}, {event.venue.state}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {formatDate(event.start_datetime)} at {formatTime(event.start_datetime)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-medium text-gray-900">{formatCurrency(event.sponsorship_amount)}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.status}
                        </span>
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

          {activeTab === 'analytics' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Sponsor Analytics</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Investment Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Campaigns</span>
                      <span className="font-medium">{analytics.total_campaigns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Partnerships</span>
                      <span className="font-medium">{analytics.total_partnerships}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Investment</span>
                      <span className="font-medium">{formatCurrency(analytics.total_investment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ROI</span>
                      <span className="font-medium">{analytics.roi.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Reach & Engagement</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Reach</span>
                      <span className="font-medium">{formatNumber(analytics.total_reach)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Engagement</span>
                      <span className="font-medium">{formatNumber(analytics.total_engagement)}</span>
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
                      src={sponsor.profile_image_url || '/placeholder-sponsor.jpg'}
                      alt={sponsor.display_name}
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
                      defaultValue={sponsor.display_name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      defaultValue={sponsor.company}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    defaultValue={sponsor.bio}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      defaultValue={sponsor.industry}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      defaultValue={sponsor.website}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
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

export default SponsorManagementDashboard;
