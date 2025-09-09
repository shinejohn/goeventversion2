import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { MainHeader } from '../../../components/layout/MainHeader';
import { Footer } from '../../../components/layout/Footer';
import { ArrowLeftIcon, PlusIcon, SearchIcon, FilterIcon, MessageCircleIcon, UsersIcon, TagIcon, ChevronDownIcon, CheckIcon, XIcon, MessageSquareIcon, HelpCircleIcon, InfoIcon, AlertCircleIcon, BriefcaseIcon } from 'lucide-react';
interface HubCommunityPageProps {
  hub?: any;
  members?: any[];
  activities?: any[];
}

export default function HubCommunityPage({ hub, members = [], activities = [] }: HubCommunityPageProps) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [hubData, setHubData] = useState<any>(hub);
  const [threads, setThreads] = useState<any[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    threadType: '',
    tag: '',
    author: '',
    dateRange: '',
    sortBy: 'recent' // 'recent', 'popular', 'unanswered'
  });

  // Use props data if available, otherwise use mock data
  useEffect(() => {
    if (hub) {
      setHubData(hub);
      // Transform activities into thread format for display
      const activityThreads = activities.map((activity, index) => ({
        id: activity.id || `activity-${index}`,
        title: activity.title || 'Community Activity',
        type: activity.type || 'Discussion',
        content: activity.content || activity.description || '',
        author: activity.author || 'Community Member',
        timestamp: activity.created_at || new Date().toISOString(),
        replies: activity.replies || 0,
        likes: activity.likes || 0,
        views: activity.views || 0,
        tags: activity.tags || [],
        isUnanswered: activity.replies === 0
      }));
      setThreads(activityThreads);
      setFilteredThreads(activityThreads);
    } else {
      // Fallback to mock data for demo
      const mockHubData = {
        id: slug,
        name: slug === 'jazz-lovers' ? 'Jazz Lovers Collective' : 'Urban Gardeners Network',
        image: slug === 'jazz-lovers' ? 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' : 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        memberCount: slug === 'jazz-lovers' ? 3427 : 2156,
        categories: slug === 'jazz-lovers' ? ['music', 'arts', 'culture'] : ['lifestyle', 'hobbies'],
        description: slug === 'jazz-lovers' ? 'A community dedicated to sharing jazz events, discussing legendary artists, and connecting musicians with venues.' : 'Connect with fellow urban gardeners to share tips, organize seed swaps, and collaborate on community garden projects.',
        threadTypes: ['Discussion', 'Question', 'Announcement', 'Resource', 'Event'],
        popularTags: slug === 'jazz-lovers' ? ['Miles Davis', 'Saxophone', 'Improvisation', 'Jazz History', 'Music Theory', 'Bebop', 'Venues', 'Albums'] : ['Composting', 'Urban Farming', 'Seed Starting', 'Container Gardens', 'Herbs', 'Sustainable', 'Hydroponics']
      };
      const mockThreads = generateMockThreads(mockHubData);
      setHubData(mockHubData);
      setThreads(mockThreads);
      setFilteredThreads(mockThreads);
    }
  }, [slug, hub, activities]);
  // Filter threads based on search and filters
  useEffect(() => {
    if (!threads.length) return;
    let filtered = [...threads];
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(thread => thread.title.toLowerCase().includes(query) || thread.preview.toLowerCase().includes(query) || thread.author.name.toLowerCase().includes(query) || thread.tags.some((tag: string) => tag.toLowerCase().includes(query)));
    }
    // Apply thread type filter
    if (filters.threadType) {
      filtered = filtered.filter(thread => thread.type === filters.threadType);
    }
    // Apply tag filter
    if (filters.tag) {
      filtered = filtered.filter(thread => thread.tags.includes(filters.tag));
    }
    // Apply author filter
    if (filters.author) {
      filtered = filtered.filter(thread => thread.author.name === filters.author);
    }
    // Apply date range filter
    if (filters.dateRange) {
      const now = new Date();
      const cutoffDate = new Date();
      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      filtered = filtered.filter(thread => new Date(thread.createdAt) >= cutoffDate);
    }
    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'unanswered':
          return (a.replyCount === 0 ? 0 : 1) - (b.replyCount === 0 ? 0 : 1);
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    setFilteredThreads(filtered);
  }, [threads, searchQuery, filters]);
  // Get unique authors from threads
  const getUniqueAuthors = () => {
    if (!threads.length) return [];
    const authorsMap = new Map();
    threads.forEach(thread => {
      if (!authorsMap.has(thread.author.id)) {
        authorsMap.set(thread.author.id, thread.author);
      }
    });
    return Array.from(authorsMap.values());
  };
  // Handle filter changes
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      threadType: '',
      tag: '',
      author: '',
      dateRange: '',
      sortBy: 'recent'
    });
    setSearchQuery('');
  };
  // Start a new thread handler
  const handleStartThread = () => {
    try {
      navigate(`/hub/${slug}/new-thread`);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = `/hub/${slug}/new-thread`;
    }
  };
  // View thread handler
  const handleViewThread = (threadId: string) => {
    try {
      navigate(`/hub/${slug}/thread/${threadId}`);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = `/hub/${slug}/thread/${threadId}`;
    }
  };
  // Safe navigation handler
  const handleSafeNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path;
    }
  };
  // Handle null hub
  if (!hub && !isLoading) {
    return (
      <>
        <MainHeader />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Hub Not Found</h2>
            <p className="mt-2 text-gray-600">The hub you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/hubs')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Browse All Hubs
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  return <>
      <MainHeader />
      <div className="min-h-screen bg-gray-50">
        {/* Hub Header */}
        <div className="bg-gray-900 text-white relative" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${hubData?.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center mb-4">
              <button onClick={() => handleSafeNavigation(`/hubs/${slug}`)} className="flex items-center text-white/80 hover:text-white">
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Hub
              </button>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  {hubData.name} - Community
                </h1>
                <p className="mt-2 text-white/80 max-w-2xl">
                  Connect with {hubData.memberCount.toLocaleString()} members in
                  the {hubData.name.toLowerCase()} community.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button onClick={handleStartThread} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Start a Thread
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Thread Type Pills */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button onClick={() => handleFilterChange('threadType', '')} className={`px-4 py-2 rounded-full text-sm font-medium ${!filters.threadType ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
              All Threads
            </button>
            {hubData.threadTypes.map((type: string) => <button key={type} onClick={() => handleFilterChange('threadType', type)} className={`px-4 py-2 rounded-full text-sm font-medium ${filters.threadType === type ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
                {type}
              </button>)}
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" placeholder="Search discussions..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>

              {/* Sort By Dropdown */}
              <div className="flex-shrink-0">
                <label className="text-sm text-gray-700 mr-2">Sort by:</label>
                <select className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500" value={filters.sortBy} onChange={e => handleFilterChange('sortBy', e.target.value)}>
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="unanswered">Unanswered</option>
                </select>
              </div>

              {/* Filter Toggle Button */}
              <button onClick={() => setShowFilters(!showFilters)} className={`inline-flex items-center px-3 py-2 border rounded-md ${showFilters ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                <FilterIcon className="h-4 w-4 mr-2" />
                <span>Filters</span>
                {(filters.tag || filters.author || filters.dateRange || searchQuery) && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Active
                  </span>}
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tags Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center">
                        <TagIcon className="h-4 w-4 mr-1 text-gray-500" />
                        Tags
                      </div>
                    </label>
                    <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" value={filters.tag} onChange={e => handleFilterChange('tag', e.target.value)}>
                      <option value="">All Tags</option>
                      {hubData.popularTags.map((tag: string) => <option key={tag} value={tag}>
                          {tag}
                        </option>)}
                    </select>
                  </div>

                  {/* Author Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-1 text-gray-500" />
                        Author
                      </div>
                    </label>
                    <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" value={filters.author} onChange={e => handleFilterChange('author', e.target.value)}>
                      <option value="">All Authors</option>
                      {getUniqueAuthors().map((author: any) => <option key={author.id} value={author.name}>
                          {author.name}
                        </option>)}
                    </select>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <div className="flex items-center">
                        <FilterIcon className="h-4 w-4 mr-1 text-gray-500" />
                        Date Range
                      </div>
                    </label>
                    <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" value={filters.dateRange} onChange={e => handleFilterChange('dateRange', e.target.value)}>
                      <option value="">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="mt-4 flex justify-end">
                  <button type="button" onClick={clearFilters} className="mr-3 px-4 py-2 text-sm text-gray-700 hover:text-gray-500">
                    Clear All
                  </button>
                  <button type="button" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700" onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </button>
                </div>
              </div>}
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Threads List */}
            <div className="w-full lg:w-2/3">
              {/* Threads Count */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {filteredThreads.length} Thread
                  {filteredThreads.length !== 1 ? 's' : ''}
                </h2>
                {(filters.tag || filters.author || filters.dateRange || filters.threadType || searchQuery) && <div className="flex flex-wrap gap-2">
                    {filters.threadType && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {filters.threadType}
                        <button onClick={() => handleFilterChange('threadType', '')} className="ml-1 text-blue-500 hover:text-blue-700">
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>}
                    {filters.tag && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Tag: {filters.tag}
                        <button onClick={() => handleFilterChange('tag', '')} className="ml-1 text-green-500 hover:text-green-700">
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>}
                    {filters.author && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        By: {filters.author}
                        <button onClick={() => handleFilterChange('author', '')} className="ml-1 text-purple-500 hover:text-purple-700">
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>}
                    {filters.dateRange && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {filters.dateRange === 'today' ? 'Today' : filters.dateRange === 'week' ? 'This Week' : filters.dateRange === 'month' ? 'This Month' : 'This Year'}
                        <button onClick={() => handleFilterChange('dateRange', '')} className="ml-1 text-yellow-500 hover:text-yellow-700">
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>}
                    {searchQuery && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Search: "{searchQuery}"
                        <button onClick={() => setSearchQuery('')} className="ml-1 text-gray-500 hover:text-gray-700">
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>}
                  </div>}
              </div>

              {/* Threads List */}
              {filteredThreads.length === 0 ? <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <MessageCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No threads found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We couldn't find any threads matching your criteria. Try
                    adjusting your filters or search term.
                  </p>
                  <div className="mt-6">
                    <button onClick={clearFilters} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                      Clear all filters
                    </button>
                  </div>
                </div> : <div className="space-y-4">
                  {filteredThreads.map(thread => <ThreadCard key={thread.id} thread={thread} hubSlug={slug as string} onClick={() => handleViewThread(thread.id)} />)}
                </div>}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              {/* Community Stats */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Community Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Members</span>
                    <span className="font-medium">
                      {hubData.memberCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Threads</span>
                    <span className="font-medium">{threads.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Today</span>
                    <span className="font-medium">
                      {Math.floor(hubData.memberCount * 0.12)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">New This Week</span>
                    <span className="font-medium">
                      {Math.floor(threads.length * 0.28)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button onClick={handleStartThread} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors">
                    Start a New Thread
                  </button>
                </div>
              </div>

              {/* Community Guidelines */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-bold mb-3">Community Guidelines</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Be respectful and constructive in discussions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Stay on topic and use appropriate tags</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>No promotional content without permission</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>
                      Respect others' privacy and intellectual property
                    </span>
                  </li>
                </ul>
                <div className="mt-3 text-xs text-gray-500">
                  <button onClick={() => handleSafeNavigation('/community-guidelines')} className="text-indigo-600 hover:text-indigo-800">
                    View full community guidelines
                  </button>
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-3">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {hubData.popularTags.map((tag: string) => <button key={tag} onClick={() => handleFilterChange('tag', tag)} className={`px-3 py-1.5 rounded-full text-sm ${filters.tag === tag ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                      {tag}
                    </button>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>;
}
// Thread Card Component
const ThreadCard = ({
  thread,
  hubSlug,
  onClick
}: {
  thread: any;
  hubSlug: string;
  onClick: () => void;
}) => {
  // Function to get icon based on thread type
  const getThreadTypeIcon = (type: string) => {
    switch (type) {
      case 'Question':
        return <HelpCircleIcon className="h-5 w-5 text-orange-500" />;
      case 'Announcement':
        return <AlertCircleIcon className="h-5 w-5 text-red-500" />;
      case 'Resource':
        return <BriefcaseIcon className="h-5 w-5 text-green-500" />;
      case 'Event':
        return <CalendarIcon className="h-5 w-5 text-purple-500" />;
      case 'Discussion':
      default:
        return <MessageSquareIcon className="h-5 w-5 text-blue-500" />;
    }
  };
  // Function to generate thread type badge color
  const getThreadTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'Question':
        return 'bg-orange-100 text-orange-800';
      case 'Announcement':
        return 'bg-red-100 text-red-800';
      case 'Resource':
        return 'bg-green-100 text-green-800';
      case 'Event':
        return 'bg-purple-100 text-purple-800';
      case 'Discussion':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
    }
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={onClick}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="mr-3">{getThreadTypeIcon(thread.type)}</div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                {thread.title}
              </h3>
              <div className="flex items-center mt-1 space-x-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getThreadTypeBadgeColor(thread.type)}`}>
                  {thread.type}
                </span>
                {thread.isPinned && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pinned
                  </span>}
                {thread.isLocked && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    Locked
                  </span>}
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span>{formatRelativeTime(thread.createdAt)}</span>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {thread.preview}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {thread.tags.slice(0, 3).map((tag: string, index: number) => <span key={index} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
              {tag}
            </span>)}
          {thread.tags.length > 3 && <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
              +{thread.tags.length - 3} more
            </span>}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <img src={thread.author.avatar} alt={thread.author.name} className="h-6 w-6 rounded-full mr-2" />
            <span className="text-sm font-medium text-gray-700">
              {thread.author.name}
            </span>
            {thread.author.role && <span className="ml-2 text-xs text-gray-500">
                • {thread.author.role}
              </span>}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <MessageCircleIcon className="h-4 w-4 mr-1" />
              <span>{thread.replyCount}</span>
            </div>
            <div className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              <span>{thread.views}</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
// Helper function to generate mock threads
function generateMockThreads(hubData: any) {
  const threads = [];
  const threadTypes = hubData.threadTypes;
  const tags = hubData.popularTags;
  // Generate author names based on hub
  const authors = hubData.id === 'jazz-lovers' ? [{
    id: 'author1',
    name: 'Miles Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Jazz Historian'
  }, {
    id: 'author2',
    name: 'Ella Roberts',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    role: 'Music Journalist'
  }, {
    id: 'author3',
    name: 'John Coltrane Jr.',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    role: 'Saxophone Player'
  }, {
    id: 'author4',
    name: 'Nina Wilson',
    avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
    role: 'Vocal Coach'
  }, {
    id: 'author5',
    name: 'Dizzy Parker',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    role: 'Club Owner'
  }] : [{
    id: 'author1',
    name: 'Lily Gardner',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    role: 'Master Gardener'
  }, {
    id: 'author2',
    name: 'Herb Smith',
    avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
    role: 'Urban Farmer'
  }, {
    id: 'author3',
    name: 'Flora Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/54.jpg',
    role: 'Botanist'
  }, {
    id: 'author4',
    name: 'Clay Potter',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    role: 'Landscape Designer'
  }, {
    id: 'author5',
    name: 'Rose Budd',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    role: 'Community Garden Coordinator'
  }];
  // Thread titles based on hub
  const titles = hubData.id === 'jazz-lovers' ? ['Recommendations for beginner jazz albums?', 'Anyone going to the Downtown Jazz Festival next month?', 'What scale should I learn first for jazz improv?', 'ANNOUNCEMENT: New jazz club opening in the city center', 'How to develop better timing when playing jazz', 'Looking for jam session partners in the Boston area', 'Discussion: Is jazz still evolving as a genre?', 'Best budget saxophone for a beginner?', 'Resources for transcribing jazz solos', 'History of bebop: key figures and recordings', 'Tips for improving jazz piano voicings', 'How to approach playing over complex chord changes', 'Jazz theory books recommendation thread', 'Your favorite jazz venue in your city?', 'Getting gigs as a jazz musician in 2023', 'RESOURCE: Free jazz backing tracks collection', 'Discussion: Favorite jazz drummers of all time', 'How to build a jazz repertoire as a beginner', 'EVENT: Virtual jazz masterclass with renowned pianist', 'Jazz in film: best movie soundtracks'] : ['What vegetables grow best in containers?', 'Starting seeds indoors: tips and tricks', 'ANNOUNCEMENT: Community seed swap next Saturday', 'How to deal with powdery mildew on squash plants?', 'Urban composting methods for apartment dwellers', 'Looking for gardening buddies in the Seattle area', 'Discussion: Organic vs. conventional growing methods', 'Best soil mix for raised beds?', 'Resources for planning an urban food garden', 'Vertical gardening solutions for small spaces', 'Tips for growing herbs indoors year-round', 'How to attract beneficial insects to your garden', 'Gardening book recommendations thread', 'Your favorite unusual edible plants to grow?', 'Dealing with urban garden pests naturally', 'RESOURCE: Free garden planning templates', 'Discussion: Favorite tomato varieties for containers', 'How to extend your growing season in colder climates', 'EVENT: Virtual workshop on urban beekeeping basics', 'Water conservation techniques for urban gardens'];
  // Generate thread previews based on type
  const generateThreadPreview = (type: string, title: string, hubId: string) => {
    let preview = '';
    switch (type) {
      case 'Discussion':
        preview = `I've been thinking about this topic a lot lately and wanted to get the community's perspective. ${hubId === 'jazz-lovers' ? 'As someone who has been listening to jazz for years, I find that...' : "After several seasons of urban gardening, I've noticed that..."}`;
        break;
      case 'Question':
        preview = `I've been wondering about this for a while and could use some advice. ${hubId === 'jazz-lovers' ? 'When practicing improvisation, should I focus more on scales or chord progressions?' : "What's the best way to deal with powdery mildew on my squash plants?"}`;
        break;
      case 'Announcement':
        preview = `Important information for all community members! ${hubId === 'jazz-lovers' ? 'The annual jazz festival tickets are now available with early bird pricing until next week.' : 'Our community garden has received a grant for new raised beds and irrigation systems.'}`;
        break;
      case 'Resource':
        preview = `I wanted to share this valuable resource with everyone. ${hubId === 'jazz-lovers' ? "I've compiled a list of 50+ jazz standards with chord charts and backing tracks." : "I've created a comprehensive guide to companion planting for urban gardens."}`;
        break;
      case 'Event':
        preview = `Mark your calendars for this upcoming event! ${hubId === 'jazz-lovers' ? "We're hosting a virtual masterclass with renowned saxophonist James Carter next month." : "We're organizing a seed swap and garden planning workshop at the community center."}`;
        break;
      default:
        preview = `Let's discuss ${title.toLowerCase()} and share our experiences and insights.`;
    }
    return preview;
  };
  // Generate 20 threads
  for (let i = 0; i < 20; i++) {
    const now = new Date();
    const createdDate = new Date();
    createdDate.setDate(now.getDate() - Math.floor(Math.random() * 60)); // Random date in the last 60 days
    const threadType = threadTypes[Math.floor(Math.random() * threadTypes.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    // Select 2-4 random tags
    const numTags = Math.floor(Math.random() * 3) + 2;
    const shuffledTags = [...tags].sort(() => 0.5 - Math.random());
    const selectedTags = shuffledTags.slice(0, numTags);
    // Random engagement metrics
    const views = Math.floor(Math.random() * 1000) + 50;
    const replyCount = Math.floor(views * (Math.random() * 0.2 + 0.01));
    const isPinned = i === 0 || i === 5; // Pin a couple of threads
    const isLocked = i === 3; // Lock one thread
    threads.push({
      id: `thread-${i + 1}`,
      title: titles[i % titles.length],
      type: threadType,
      createdAt: createdDate.toISOString(),
      author: author,
      preview: generateThreadPreview(threadType, titles[i % titles.length], hubData.id),
      tags: selectedTags,
      views: views,
      replyCount: replyCount,
      isPinned: isPinned,
      isLocked: isLocked
    });
  }
  // Sort threads with pinned ones first, then by date
  return threads.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
// Missing component import
const CalendarIcon = ({
  className
}: {
  className?: string;
}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>;
const EyeIcon = ({
  className
}: {
  className?: string;
}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>;