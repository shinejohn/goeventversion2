import React, { useEffect, useState } from 'react';
import { useNavigationContext } from '../../context/NavigationContext';
import { PlusIcon, DownloadIcon, SettingsIcon, CheckSquareIcon, BarChart2Icon, CalendarIcon, UsersIcon, BellIcon, ClockIcon, FilterIcon, SearchIcon, ChevronDownIcon, GridIcon, ListIcon } from 'lucide-react';
import { CalendarGrid } from '../../components/dashboard/calendars/CalendarGrid';
import { AnalyticsOverview } from '../../components/dashboard/calendars/AnalyticsOverview';
import { PendingActions } from '../../components/dashboard/calendars/PendingActions';
import { QuickActionsBar } from '../../components/dashboard/calendars/QuickActionsBar';
export const CalendarDashboardPage = function CalendarDashboardPage() {
  const {
    navigateTo
  } = useNavigationContext();
  const [isLoading, setIsLoading] = useState(true);
  const [calendars, setCalendars] = useState([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'paused' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'followers' | 'events' | 'engagement'>('newest');
  // Mock data for the dashboard
  useEffect(() => {
    setTimeout(() => {
      setCalendars([{
        id: 'downtown-jazz-nights',
        title: 'Downtown Jazz Nights',
        description: 'A curated collection of the finest jazz performances happening in downtown Clearwater.',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        status: 'active',
        stats: {
          followers: 2547,
          growthRate: 12,
          events: 87,
          pendingEvents: 5,
          engagement: 76,
          revenue: 1245.8
        },
        lastUpdated: '2 days ago',
        isPaid: true,
        price: 4.99
      }, {
        id: 'food-truck-fridays',
        title: 'Food Truck Fridays',
        description: 'Weekly roundup of the best food trucks in the area with locations and menus.',
        image: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        status: 'active',
        stats: {
          followers: 1876,
          growthRate: 8,
          events: 52,
          pendingEvents: 2,
          engagement: 82,
          revenue: 0
        },
        lastUpdated: '1 week ago',
        isPaid: false
      }, {
        id: 'beach-yoga-sessions',
        title: 'Beach Yoga Sessions',
        description: 'Morning and sunset yoga sessions on the beach with certified instructors.',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        status: 'paused',
        stats: {
          followers: 945,
          growthRate: -2,
          events: 36,
          pendingEvents: 0,
          engagement: 45,
          revenue: 325.5
        },
        lastUpdated: '1 month ago',
        isPaid: true,
        price: 2.99
      }, {
        id: 'local-art-exhibitions',
        title: 'Local Art Exhibitions',
        description: 'Showcasing local artists and their exhibitions in galleries and public spaces.',
        image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        status: 'draft',
        stats: {
          followers: 0,
          growthRate: 0,
          events: 12,
          pendingEvents: 8,
          engagement: 0,
          revenue: 0
        },
        lastUpdated: '3 days ago',
        isPaid: false
      }, {
        id: 'craft-beer-tastings',
        title: 'Craft Beer Tastings',
        description: 'Weekly tastings at local breweries with expert commentary and food pairings.',
        image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        status: 'active',
        stats: {
          followers: 1235,
          growthRate: 15,
          events: 64,
          pendingEvents: 3,
          engagement: 68,
          revenue: 875.25
        },
        lastUpdated: '5 days ago',
        isPaid: true,
        price: 3.99
      }, {
        id: 'farmers-markets',
        title: 'Farmers Markets',
        description: 'Comprehensive guide to all farmers markets in the county with vendor information.',
        image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        status: 'active',
        stats: {
          followers: 3254,
          growthRate: 5,
          events: 124,
          pendingEvents: 7,
          engagement: 92,
          revenue: 0
        },
        lastUpdated: '2 days ago',
        isPaid: false
      }]);
      setIsLoading(false);
    }, 1000);
  }, []);
  // Analytics data
  const analyticsData = {
    followerGrowth: [1200, 1350, 1500, 1800, 2100, 2400, 2850, 3200, 3650, 4200, 4800, 5400],
    eventsCurated: [45, 52, 58, 64, 72, 85, 96, 105, 118, 125, 142, 156],
    engagement: [65, 68, 64, 72, 75, 70, 82, 78, 84, 82, 88, 90],
    revenue: [250, 320, 280, 350, 420, 380, 450, 520, 580, 650, 720, 840],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };
  // Pending actions data
  const pendingActionsData = {
    events: [{
      id: 'event-1',
      title: 'Jazz at Sunset',
      calendar: 'Downtown Jazz Nights',
      submittedBy: 'Michael Scott',
      date: '2023-08-15'
    }, {
      id: 'event-2',
      title: 'Food Truck Rally',
      calendar: 'Food Truck Fridays',
      submittedBy: 'System',
      date: '2023-08-18'
    }, {
      id: 'event-3',
      title: 'Craft Beer Festival',
      calendar: 'Craft Beer Tastings',
      submittedBy: 'David Chen',
      date: '2023-08-20'
    }, {
      id: 'event-4',
      title: 'Summer Jazz Series',
      calendar: 'Downtown Jazz Nights',
      submittedBy: 'AI Assistant',
      date: '2023-08-22'
    }, {
      id: 'event-5',
      title: 'Farmers Market Special',
      calendar: 'Farmers Markets',
      submittedBy: 'Lisa Johnson',
      date: '2023-08-19'
    }],
    memberRequests: [{
      id: 'member-1',
      name: 'Jessica Chen',
      calendar: 'Downtown Jazz Nights',
      requestType: 'Join',
      date: '2023-08-14'
    }, {
      id: 'member-2',
      name: 'Thomas Wright',
      calendar: 'Craft Beer Tastings',
      requestType: 'Contributor',
      date: '2023-08-13'
    }, {
      id: 'member-3',
      name: 'Sarah Martinez',
      calendar: 'Food Truck Fridays',
      requestType: 'Join',
      date: '2023-08-12'
    }],
    comments: [{
      id: 'comment-1',
      content: 'This event was amazing!',
      calendar: 'Downtown Jazz Nights',
      author: 'Alex Thompson',
      date: '2023-08-14'
    }, {
      id: 'comment-2',
      content: 'When will tickets be available?',
      calendar: 'Craft Beer Tastings',
      author: 'Jamie Wilson',
      date: '2023-08-13'
    }, {
      id: 'comment-3',
      content: 'The location has changed.',
      calendar: 'Farmers Markets',
      author: 'Robert Davis',
      date: '2023-08-12'
    }, {
      id: 'comment-4',
      content: 'Is this family friendly?',
      calendar: 'Food Truck Fridays',
      author: 'Maria Rodriguez',
      date: '2023-08-11'
    }],
    aiSuggestions: [{
      id: 'ai-1',
      title: 'Weekly Jazz Jam Session',
      calendar: 'Downtown Jazz Nights',
      confidence: 'High',
      date: '2023-08-14'
    }, {
      id: 'ai-2',
      title: 'Vegan Food Truck Special',
      calendar: 'Food Truck Fridays',
      confidence: 'Medium',
      date: '2023-08-13'
    }, {
      id: 'ai-3',
      title: 'Local Brewery Tour',
      calendar: 'Craft Beer Tastings',
      confidence: 'High',
      date: '2023-08-12'
    }, {
      id: 'ai-4',
      title: 'Organic Produce Festival',
      calendar: 'Farmers Markets',
      confidence: 'Medium',
      date: '2023-08-11'
    }, {
      id: 'ai-5',
      title: 'Sunset Beach Yoga',
      calendar: 'Beach Yoga Sessions',
      confidence: 'Low',
      date: '2023-08-10'
    }]
  };
  // Filter calendars based on active tab and search query
  const filteredCalendars = calendars.filter(calendar => {
    const matchesTab = activeTab === 'all' || calendar.status === activeTab;
    const matchesSearch = calendar.title.toLowerCase().includes(searchQuery.toLowerCase()) || calendar.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });
  // Sort calendars based on sortBy option
  const sortedCalendars = [...filteredCalendars].sort((a, b) => {
    switch (sortBy) {
      case 'followers':
        return b.stats.followers - a.stats.followers;
      case 'events':
        return b.stats.events - a.stats.events;
      case 'engagement':
        return b.stats.engagement - a.stats.engagement;
      case 'newest':
      default:
        // Simple sort by last updated (mock data)
        return a.lastUpdated.localeCompare(b.lastUpdated);
    }
  });
  // Total stats across all calendars
  const totalStats = calendars.reduce((acc, calendar) => {
    return {
      followers: acc.followers + calendar.stats.followers,
      events: acc.events + calendar.stats.events,
      pendingEvents: acc.pendingEvents + calendar.stats.pendingEvents,
      revenue: acc.revenue + calendar.stats.revenue
    };
  }, {
    followers: 0,
    events: 0,
    pendingEvents: 0,
    revenue: 0
  });
  const handleCalendarAction = (action: string, id: string) => {
    switch (action) {
      case 'edit':
        navigateTo(`/calendar/${id}/edit`);
        break;
      case 'view':
        navigateTo(`/calendar/${id}`);
        break;
      case 'delete':
        // Handle delete action
        alert(`Delete calendar ${id}`);
        break;
      case 'status':
        // Toggle status between active/paused
        const calendar = calendars.find(c => c.id === id);
        if (calendar) {
          const newStatus = calendar.status === 'active' ? 'paused' : 'active';
          const updatedCalendars = calendars.map(cal => cal.id === id ? {
            ...cal,
            status: newStatus
          } : cal);
          setCalendars(updatedCalendars);
        }
        break;
      default:
        break;
    }
  };
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Calendar Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your calendars, track performance, and handle pending
              actions
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <QuickActionsBar onCreateNew={() => navigateTo('/calendars/create')} onBulkEdit={() => {
            alert('Bulk edit feature');
          }} onExportData={() => {
            alert('Export data feature');
          }} onSettings={() => navigateTo('/profile/settings')} />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">
                  Total Calendars
                </h2>
                <p className="text-2xl font-semibold text-gray-900">
                  {calendars.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">
                  Total Followers
                </h2>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalStats.followers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center">
                <BarChart2Icon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">
                  Events Curated
                </h2>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalStats.events.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5 cursor-pointer" onClick={() => {
          const pendingCount = pendingActionsData.events.length + pendingActionsData.memberRequests.length + pendingActionsData.comments.length;
          if (pendingCount > 0) {
            // Scroll to pending actions section
            document.getElementById('pending-actions')?.scrollIntoView({
              behavior: 'smooth'
            });
          }
        }}>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-md bg-yellow-100 flex items-center justify-center">
                <BellIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-500">
                  Pending Actions
                </h2>
                <p className="text-2xl font-semibold text-gray-900">
                  {pendingActionsData.events.length + pendingActionsData.memberRequests.length + pendingActionsData.comments.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar List Section - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm mb-8">
              <div className="border-b border-gray-200">
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Your Calendars
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage and monitor all your calendars
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                    <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                      <GridIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                      <ListIcon className="h-5 w-5" />
                    </button>
                    <div className="relative">
                      <button onClick={() => setShowFilters(!showFilters)} className={`p-1.5 rounded-md ${showFilters ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                        <FilterIcon className="h-5 w-5" />
                      </button>
                      {showFilters && <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="p-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Sort By
                            </label>
                            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm">
                              <option value="newest">Newest</option>
                              <option value="followers">Most Followers</option>
                              <option value="events">Most Events</option>
                              <option value="engagement">
                                Highest Engagement
                              </option>
                            </select>
                          </div>
                        </div>}
                    </div>
                  </div>
                </div>
                {/* Tabs and Search */}
                <div className="px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 pb-4">
                  <div className="flex space-x-4 overflow-x-auto">
                    <button onClick={() => setActiveTab('all')} className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}>
                      All Calendars
                    </button>
                    <button onClick={() => setActiveTab('active')} className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'active' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-gray-700'}`}>
                      Active
                    </button>
                    <button onClick={() => setActiveTab('paused')} className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'paused' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-500 hover:text-gray-700'}`}>
                      Paused
                    </button>
                    <button onClick={() => setActiveTab('draft')} className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'draft' ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:text-gray-700'}`}>
                      Drafts
                    </button>
                  </div>
                  <div className="relative sm:ml-auto">
                    <input type="text" placeholder="Search calendars..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full sm:w-64 pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Calendar Grid/List */}
              <div className="p-4 sm:p-6">
                <CalendarGrid calendars={sortedCalendars} viewMode={viewMode} onEdit={id => handleCalendarAction('edit', id)} onView={id => handleCalendarAction('view', id)} onToggleStatus={(id, status) => handleCalendarAction('status', id)} />
                {sortedCalendars.length === 0 && <div className="text-center py-12">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No calendars found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating a new calendar'}
                    </p>
                    {!searchQuery && <div className="mt-6">
                        <button onClick={() => navigateTo('/calendars/create')} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                          Create Calendar
                        </button>
                      </div>}
                  </div>}
              </div>
            </div>
            {/* Analytics Overview */}
            <AnalyticsOverview data={analyticsData} />
          </div>
          {/* Pending Actions - Takes up 1 column on large screens */}
          <div className="lg:col-span-1" id="pending-actions">
            <PendingActions data={pendingActionsData} />
          </div>
        </div>
      </div>
    </div>;
};