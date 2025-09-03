import React, { useEffect, useState } from 'react';
import { useRouter } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { MediaGrid } from '../../../components/hub/gallery/MediaGrid';
import { MediaLightbox } from '../../../components/hub/gallery/MediaLightbox';
import { MediaUploader } from '../../../components/hub/gallery/MediaUploader';
import { AlbumsList } from '../../../components/hub/gallery/AlbumsList';
import { ArrowLeftIcon, PlusIcon, SearchIcon, FilterIcon, XIcon, GridIcon, ColumnsIcon, ImageIcon, VideoIcon, MusicIcon, CalendarIcon, StarIcon, ChevronDownIcon, TagIcon, UserIcon, FolderIcon } from 'lucide-react';
export default function HubGalleryPage() {
  const router = useRouter();
  const {
    slug
  } = router.params || {};
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hubData, setHubData] = useState<any>(null);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null);
  const [selectedMediaItem, setSelectedMediaItem] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [filters, setFilters] = useState({
    mediaType: 'all',
    dateRange: '',
    event: '',
    contributor: '',
    sortBy: 'recent' // 'recent', 'popular', 'oldest'
  });
  // Fetch hub data, media items and albums
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // Mock hub data
      const mockHubData = {
        id: slug,
        name: slug === 'jazz-lovers' ? 'Jazz Lovers Collective' : 'Urban Gardeners Network',
        image: slug === 'jazz-lovers' ? 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' : 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        memberCount: slug === 'jazz-lovers' ? 3427 : 2156,
        description: slug === 'jazz-lovers' ? 'A community dedicated to sharing jazz events, discussing legendary artists, and connecting musicians with venues.' : 'Connect with fellow urban gardeners to share tips, organize seed swaps, and collaborate on community garden projects.',
        events: slug === 'jazz-lovers' ? ['Summer Jazz Festival', 'Monthly Jam Session', 'Jazz History Night', 'Saxophone Workshop', 'Album Listening Party'] : ['Urban Garden Tour', 'Seed Swap', 'Composting Workshop', 'Plant Exchange', 'Community Harvest']
      };
      // Generate mock media items
      const mockMediaItems = generateMockMediaItems(mockHubData);
      // Generate mock albums
      const mockAlbums = generateMockAlbums(mockHubData, mockMediaItems);
      setHubData(mockHubData);
      setMediaItems(mockMediaItems);
      setFilteredMedia(mockMediaItems);
      setAlbums(mockAlbums);
      setIsLoading(false);
    }, 1000);
  }, [slug]);
  // Filter media items based on search, filters, and active album
  useEffect(() => {
    if (!mediaItems.length) return;
    let filtered = [...mediaItems];
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => item.title.toLowerCase().includes(query) || item.contributor.name.toLowerCase().includes(query) || item.tags.some((tag: string) => tag.toLowerCase().includes(query)));
    }
    // Apply media type filter
    if (filters.mediaType !== 'all') {
      filtered = filtered.filter(item => item.type === filters.mediaType);
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
      filtered = filtered.filter(item => new Date(item.uploadedAt) >= cutoffDate);
    }
    // Apply event filter
    if (filters.event) {
      filtered = filtered.filter(item => item.event === filters.event);
    }
    // Apply contributor filter
    if (filters.contributor) {
      filtered = filtered.filter(item => item.contributor.name === filters.contributor);
    }
    // Apply album filter
    if (activeAlbum) {
      const album = albums.find(a => a.id === activeAlbum);
      if (album) {
        filtered = filtered.filter(item => album.mediaIds.includes(item.id));
      }
    }
    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'oldest':
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        case 'recent':
        default:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
    });
    setFilteredMedia(filtered);
  }, [mediaItems, albums, activeAlbum, searchQuery, filters]);
  // Handle filter changes
  const handleFilterChange = (filterName: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      mediaType: 'all',
      dateRange: '',
      event: '',
      contributor: '',
      sortBy: 'recent'
    });
    setSearchQuery('');
    setActiveAlbum(null);
  };
  // Get unique contributors from media items
  const getUniqueContributors = () => {
    if (!mediaItems.length) return [];
    const contributorsMap = new Map();
    mediaItems.forEach(item => {
      if (!contributorsMap.has(item.contributor.id)) {
        contributorsMap.set(item.contributor.id, item.contributor);
      }
    });
    return Array.from(contributorsMap.values());
  };
  // Open lightbox for a media item
  const handleOpenLightbox = (mediaItem: any) => {
    setSelectedMediaItem(mediaItem);
  };
  // Close lightbox
  const handleCloseLightbox = () => {
    setSelectedMediaItem(null);
  };
  // Navigate to next/previous media in lightbox
  const handleNavigateLightbox = (direction: 'next' | 'prev') => {
    if (!selectedMediaItem || filteredMedia.length <= 1) return;
    const currentIndex = filteredMedia.findIndex(item => item.id === selectedMediaItem.id);
    if (currentIndex === -1) return;
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredMedia.length;
    } else {
      newIndex = (currentIndex - 1 + filteredMedia.length) % filteredMedia.length;
    }
    setSelectedMediaItem(filteredMedia[newIndex]);
  };
  // Handle media upload
  const handleMediaUpload = (files: File[]) => {
    // In a real app, this would upload files to a server
    console.log('Files to upload:', files);
    // Mock successful upload by adding new items to the media items list
    const newItems = files.map((file, index) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isAudio = file.type.startsWith('audio/');
      const type = isImage ? 'image' : isVideo ? 'video' : isAudio ? 'audio' : 'unknown';
      return {
        id: `new-${Date.now()}-${index}`,
        type,
        title: file.name.split('.')[0],
        url: isImage ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' : isVideo ? 'https://example.com/video.mp4' : 'https://example.com/audio.mp3',
        thumbnail: isImage ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        uploadedAt: new Date().toISOString(),
        contributor: {
          id: 'current-user',
          name: 'You',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        description: `Newly uploaded ${type}`,
        likes: 0,
        shares: 0,
        comments: 0,
        tags: [],
        event: '',
        duration: isVideo || isAudio ? '3:45' : undefined
      };
    });
    setMediaItems(prev => [...newItems, ...prev]);
    setShowUploader(false);
  };
  // Handle selecting an album
  const handleSelectAlbum = (albumId: string | null) => {
    setActiveAlbum(albumId);
  };
  // Handle liking a media item
  const handleLikeMedia = (mediaId: string) => {
    setMediaItems(prev => prev.map(item => item.id === mediaId ? {
      ...item,
      likes: item.likes + 1,
      isLiked: true
    } : item));
  };
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* Hub Header */}
      <div className="bg-gray-900 text-white relative" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${hubData.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-4">
            <button onClick={() => navigate(`/hubs/${slug}`)} className="flex items-center text-white/80 hover:text-white">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Hub
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{hubData.name} - Gallery</h1>
              <p className="mt-2 text-white/80 max-w-2xl">
                Explore photos, videos, and audio from{' '}
                {hubData.name.toLowerCase()} events and members.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button onClick={() => setShowUploader(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Media
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Media Type Pills */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button onClick={() => handleFilterChange('mediaType', 'all')} className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${filters.mediaType === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
            <FilterIcon className="h-4 w-4 mr-2" />
            All Media
          </button>
          <button onClick={() => handleFilterChange('mediaType', 'image')} className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${filters.mediaType === 'image' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
            <ImageIcon className="h-4 w-4 mr-2" />
            Photos
          </button>
          <button onClick={() => handleFilterChange('mediaType', 'video')} className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${filters.mediaType === 'video' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
            <VideoIcon className="h-4 w-4 mr-2" />
            Videos
          </button>
          <button onClick={() => handleFilterChange('mediaType', 'audio')} className={`px-4 py-2 rounded-full text-sm font-medium flex items-center ${filters.mediaType === 'audio' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
            <MusicIcon className="h-4 w-4 mr-2" />
            Audio
          </button>
        </div>
        {/* Albums Section */}
        <div className="mb-8">
          <AlbumsList albums={albums} activeAlbumId={activeAlbum} onSelectAlbum={handleSelectAlbum} />
        </div>
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Search media..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`} aria-label="Grid view">
                <GridIcon className="h-5 w-5" />
              </button>
              <button onClick={() => setViewMode('masonry')} className={`p-2 rounded-md ${viewMode === 'masonry' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`} aria-label="Masonry view">
                <ColumnsIcon className="h-5 w-5" />
              </button>
            </div>
            {/* Sort By Dropdown */}
            <div className="flex-shrink-0">
              <label className="text-sm text-gray-700 mr-2">Sort by:</label>
              <select className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500" value={filters.sortBy} onChange={e => handleFilterChange('sortBy', e.target.value)}>
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            {/* Filter Toggle Button */}
            <button onClick={() => setShowFilters(!showFilters)} className={`inline-flex items-center px-3 py-2 border rounded-md ${showFilters ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
              <FilterIcon className="h-4 w-4 mr-2" />
              <span>Filters</span>
              {(filters.dateRange || filters.event || filters.contributor || activeAlbum || searchQuery) && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Active
                </span>}
            </button>
          </div>
          {/* Advanced Filters */}
          {showFilters && <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
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
                {/* Event Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <TagIcon className="h-4 w-4 mr-1 text-gray-500" />
                      Event
                    </div>
                  </label>
                  <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" value={filters.event} onChange={e => handleFilterChange('event', e.target.value)}>
                    <option value="">All Events</option>
                    {hubData.events.map((event: string) => <option key={event} value={event}>
                        {event}
                      </option>)}
                  </select>
                </div>
                {/* Contributor Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1 text-gray-500" />
                      Contributor
                    </div>
                  </label>
                  <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" value={filters.contributor} onChange={e => handleFilterChange('contributor', e.target.value)}>
                    <option value="">All Contributors</option>
                    {getUniqueContributors().map((contributor: any) => <option key={contributor.id} value={contributor.name}>
                        {contributor.name}
                      </option>)}
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
        {/* Active Filters */}
        {(filters.dateRange || filters.event || filters.contributor || activeAlbum || searchQuery) && <div className="flex flex-wrap gap-2 mb-4">
            {activeAlbum && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Album: {albums.find(a => a.id === activeAlbum)?.name}
                <button onClick={() => setActiveAlbum(null)} className="ml-1 text-purple-500 hover:text-purple-700">
                  <XIcon className="h-3 w-3" />
                </button>
              </span>}
            {filters.mediaType !== 'all' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Type:{' '}
                {filters.mediaType.charAt(0).toUpperCase() + filters.mediaType.slice(1)}
                <button onClick={() => handleFilterChange('mediaType', 'all')} className="ml-1 text-blue-500 hover:text-blue-700">
                  <XIcon className="h-3 w-3" />
                </button>
              </span>}
            {filters.dateRange && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {filters.dateRange === 'today' ? 'Today' : filters.dateRange === 'week' ? 'This Week' : filters.dateRange === 'month' ? 'This Month' : 'This Year'}
                <button onClick={() => handleFilterChange('dateRange', '')} className="ml-1 text-yellow-500 hover:text-yellow-700">
                  <XIcon className="h-3 w-3" />
                </button>
              </span>}
            {filters.event && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Event: {filters.event}
                <button onClick={() => handleFilterChange('event', '')} className="ml-1 text-green-500 hover:text-green-700">
                  <XIcon className="h-3 w-3" />
                </button>
              </span>}
            {filters.contributor && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                By: {filters.contributor}
                <button onClick={() => handleFilterChange('contributor', '')} className="ml-1 text-indigo-500 hover:text-indigo-700">
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
        {/* Media Grid */}
        {filteredMedia.length === 0 ? <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No media found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              We couldn't find any media matching your criteria. Try adjusting
              your filters or search term.
            </p>
            <div className="mt-6">
              <button onClick={clearFilters} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Clear all filters
              </button>
            </div>
          </div> : <MediaGrid mediaItems={filteredMedia} viewMode={viewMode} onOpenLightbox={handleOpenLightbox} onLike={handleLikeMedia} />}
      </div>
      {/* Lightbox */}
      {selectedMediaItem && <MediaLightbox mediaItem={selectedMediaItem} onClose={handleCloseLightbox} onNavigate={handleNavigateLightbox} onLike={() => handleLikeMedia(selectedMediaItem.id)} />}
      {/* Upload Modal */}
      {showUploader && <MediaUploader onClose={() => setShowUploader(false)} onUpload={handleMediaUpload} albums={albums} />}
    </div>;
}
// Helper function to generate mock media items
function generateMockMediaItems(hubData: any) {
  const mediaItems = [];
  const mediaTypes = ['image', 'video', 'audio'];
  // Generate contributor names based on hub
  const contributors = hubData.id === 'jazz-lovers' ? [{
    id: 'user1',
    name: 'Miles Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  }, {
    id: 'user2',
    name: 'Ella Roberts',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  }, {
    id: 'user3',
    name: 'John Coltrane Jr.',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
  }, {
    id: 'user4',
    name: 'Nina Wilson',
    avatar: 'https://randomuser.me/api/portraits/women/29.jpg'
  }, {
    id: 'user5',
    name: 'Dizzy Parker',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
  }] : [{
    id: 'user1',
    name: 'Lily Gardner',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
  }, {
    id: 'user2',
    name: 'Herb Smith',
    avatar: 'https://randomuser.me/api/portraits/men/78.jpg'
  }, {
    id: 'user3',
    name: 'Flora Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/54.jpg'
  }, {
    id: 'user4',
    name: 'Clay Potter',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
  }, {
    id: 'user5',
    name: 'Rose Budd',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
  }];
  // Generate media titles based on hub
  const mediaTitles = hubData.id === 'jazz-lovers' ? ['Saxophone Solo at Blue Note', 'Jazz Band Performance', 'Backstage with the Musicians', 'Piano Improvisation', 'Trumpet Solo', 'Jazz Festival Highlights', 'Jam Session', 'Recording Studio Session', 'Interview with Jazz Legend', 'Crowd at Jazz Club', 'Vintage Jazz Poster', 'Rare Jazz Album Cover', 'Jazz History Lecture', 'Music Theory Workshop', 'Jazz Dance Performance'] : ['Community Garden Harvest', 'Urban Farm Aerial View', 'Seed Starting Workshop', 'Container Garden Setup', 'Vertical Garden Wall', 'Herb Garden Collection', 'Composting Demonstration', 'Rooftop Garden Tour', 'Seasonal Planting Guide', 'Garden Design Planning', 'Plant Propagation Tips', 'Sustainable Watering System', 'Pollinator Garden in Bloom', 'Indoor Plant Care', 'Urban Beekeeping Setup'];
  // Generate image URLs based on hub
  const imageUrls = hubData.id === 'jazz-lovers' ? ['https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1485579149621-3123dd979885?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'] : ['https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1534710961216-75c88202f43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1526579903323-bca0c70d9141?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'];
  // Generate video thumbnails
  const videoThumbnails = hubData.id === 'jazz-lovers' ? ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'] : ['https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'];
  // Generate audio thumbnails
  const audioThumbnails = hubData.id === 'jazz-lovers' ? ['https://images.unsplash.com/photo-1458560871784-56d23406c091?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'] : ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1528092744838-b91de0a10615?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'];
  // Generate tags based on hub
  const tags = hubData.id === 'jazz-lovers' ? ['Jazz', 'Music', 'Concert', 'Performance', 'Saxophone', 'Piano', 'Trumpet', 'Band', 'Festival', 'Club'] : ['Garden', 'Plants', 'Urban Farming', 'Sustainability', 'Composting', 'Herbs', 'Vegetables', 'Seeds', 'Workshop', 'Community'];
  // Generate 40 media items
  for (let i = 0; i < 40; i++) {
    const now = new Date();
    const uploadDate = new Date();
    uploadDate.setDate(now.getDate() - Math.floor(Math.random() * 60)); // Random date in the last 60 days
    // Determine media type with a distribution of 70% images, 20% videos, 10% audio
    let mediaType;
    const typeRoll = Math.random();
    if (typeRoll < 0.7) {
      mediaType = 'image';
    } else if (typeRoll < 0.9) {
      mediaType = 'video';
    } else {
      mediaType = 'audio';
    }
    const contributor = contributors[Math.floor(Math.random() * contributors.length)];
    // Select random tags
    const numTags = Math.floor(Math.random() * 3) + 1;
    const shuffledTags = [...tags].sort(() => 0.5 - Math.random());
    const selectedTags = shuffledTags.slice(0, numTags);
    // Random engagement metrics
    const likes = Math.floor(Math.random() * 100) + 1;
    const comments = Math.floor(Math.random() * 20);
    const shares = Math.floor(Math.random() * 15);
    // Select random event
    const event = Math.random() > 0.3 ? hubData.events[Math.floor(Math.random() * hubData.events.length)] : '';
    let url, thumbnail;
    if (mediaType === 'image') {
      url = imageUrls[i % imageUrls.length];
      thumbnail = url;
    } else if (mediaType === 'video') {
      url = 'https://example.com/video.mp4'; // Placeholder for actual video URL
      thumbnail = videoThumbnails[i % videoThumbnails.length];
    } else {
      // audio
      url = 'https://example.com/audio.mp3'; // Placeholder for actual audio URL
      thumbnail = audioThumbnails[i % audioThumbnails.length];
    }
    mediaItems.push({
      id: `media-${i + 1}`,
      type: mediaType,
      title: mediaTitles[i % mediaTitles.length],
      url: url,
      thumbnail: thumbnail,
      uploadedAt: uploadDate.toISOString(),
      contributor: contributor,
      description: `A ${mediaType} from the ${event || 'hub community'}.`,
      likes: likes,
      shares: shares,
      comments: comments,
      tags: selectedTags,
      event: event,
      duration: mediaType !== 'image' ? `${Math.floor(Math.random() * 5) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : undefined,
      isLiked: Math.random() > 0.8
    });
  }
  return mediaItems;
}
// Helper function to generate mock albums
function generateMockAlbums(hubData: any, mediaItems: any[]) {
  const albums = [];
  // Album titles based on hub
  const albumTitles = hubData.id === 'jazz-lovers' ? ['Summer Jazz Festival 2023', 'Monthly Jam Sessions', 'Jazz History Night', 'Featured Artists', 'Member Performances', 'Backstage Moments', 'Instrument Showcases'] : ['Urban Garden Tour 2023', 'Seasonal Harvests', 'Community Projects', 'Garden Design Inspiration', 'Workshop Documentation', 'Plant Collections', 'Garden Transformations'];
  // Album covers
  const albumCovers = hubData.id === 'jazz-lovers' ? ['https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1485579149621-3123dd979885?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'] : ['https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1534710961216-75c88202f43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1526579903323-bca0c70d9141?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'];
  // Create albums
  for (let i = 0; i < albumTitles.length; i++) {
    // Randomly assign media items to this album
    const shuffledMedia = [...mediaItems].sort(() => 0.5 - Math.random());
    const numItems = Math.floor(Math.random() * 15) + 5; // 5-20 items per album
    const albumMediaIds = shuffledMedia.slice(0, numItems).map(item => item.id);
    albums.push({
      id: `album-${i + 1}`,
      name: albumTitles[i],
      coverImage: albumCovers[i],
      mediaCount: albumMediaIds.length,
      mediaIds: albumMediaIds,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
      description: `A collection of ${albumMediaIds.length} media items from the ${hubData.name}.`
    });
  }
  return albums;
}