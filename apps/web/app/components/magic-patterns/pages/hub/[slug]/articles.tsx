import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { ArticleHero } from '../../../components/hub/articles/ArticleHero';
import { ArticleCard } from '../../../components/hub/articles/ArticleCard';
import { PopularArticles } from '../../../components/hub/articles/PopularArticles';
import { ArrowLeftIcon, PlusIcon, SearchIcon, FilterIcon, BookOpenIcon, ClockIcon, TagIcon, UsersIcon, ChevronDownIcon, CheckIcon, XIcon } from 'lucide-react';
export const HubArticlesPage = () => {
  const {
    slug
  } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hubData, setHubData] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    contentType: '',
    tag: '',
    author: '',
    dateRange: '',
    sortBy: 'recent' // 'recent', 'popular', 'trending'
  });
  // Fetch hub data and articles
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      // Mock hub data
      const mockHubData = {
        id: slug,
        name: slug === 'jazz-lovers' ? 'Jazz Lovers Collective' : 'Urban Gardeners Network',
        image: slug === 'jazz-lovers' ? 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' : 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        memberCount: slug === 'jazz-lovers' ? 3427 : 2156,
        categories: slug === 'jazz-lovers' ? ['music', 'arts', 'culture'] : ['lifestyle', 'hobbies'],
        subcategories: slug === 'jazz-lovers' ? ['Jazz Fusion', 'Bebop', 'Smooth Jazz', 'Big Band', 'Contemporary', 'Vocal Jazz', 'Latin Jazz'] : ['Indoor Plants', 'Vegetables', 'Herbs', 'Community Gardens', 'Container Gardening', 'Urban Farming'],
        description: slug === 'jazz-lovers' ? 'A community dedicated to sharing jazz events, discussing legendary artists, and connecting musicians with venues.' : 'Connect with fellow urban gardeners to share tips, organize seed swaps, and collaborate on community garden projects.',
        contentTypes: ['News', 'Guides', 'Interviews', 'Reviews', 'Opinion', 'History'],
        popularTags: slug === 'jazz-lovers' ? ['Miles Davis', 'Saxophone', 'Improvisation', 'Jazz History', 'Music Theory', 'Bebop', 'Venues', 'Albums'] : ['Composting', 'Urban Farming', 'Seed Starting', 'Container Gardens', 'Herbs', 'Sustainable', 'Hydroponics']
      };
      // Generate mock articles
      const mockArticles = generateMockArticles(mockHubData);
      // Set featured article (most recent with isFeatured flag)
      const featured = mockArticles.find(article => article.isFeatured) || mockArticles[0];
      setHubData(mockHubData);
      setArticles(mockArticles);
      setFilteredArticles(mockArticles.filter(article => article.id !== featured.id));
      setFeaturedArticle(featured);
      setIsLoading(false);
    }, 1000);
  }, [slug]);
  // Filter articles based on search and filters
  useEffect(() => {
    if (!articles.length) return;
    let filtered = [...articles];
    // Remove featured article from regular listing
    if (featuredArticle) {
      filtered = filtered.filter(article => article.id !== featuredArticle.id);
    }
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => article.title.toLowerCase().includes(query) || article.excerpt.toLowerCase().includes(query) || article.author.name.toLowerCase().includes(query) || article.tags.some((tag: string) => tag.toLowerCase().includes(query)));
    }
    // Apply content type filter
    if (filters.contentType) {
      filtered = filtered.filter(article => article.contentType === filters.contentType);
    }
    // Apply tag filter
    if (filters.tag) {
      filtered = filtered.filter(article => article.tags.includes(filters.tag));
    }
    // Apply author filter
    if (filters.author) {
      filtered = filtered.filter(article => article.author.name === filters.author);
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
      filtered = filtered.filter(article => new Date(article.publishedAt) >= cutoffDate);
    }
    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'trending':
          return b.trendingScore - a.trendingScore;
        case 'recent':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });
    setFilteredArticles(filtered);
  }, [articles, featuredArticle, searchQuery, filters]);
  // Get unique authors from articles
  const getUniqueAuthors = () => {
    if (!articles.length) return [];
    const authorsMap = new Map();
    articles.forEach(article => {
      if (!authorsMap.has(article.author.id)) {
        authorsMap.set(article.author.id, article.author);
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
      contentType: '',
      tag: '',
      author: '',
      dateRange: '',
      sortBy: 'recent'
    });
    setSearchQuery('');
  };
  // Write for Hub handler
  const handleWriteForHub = () => {
    navigate(`/hub/${slug}/submit-article`);
  };
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  return <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hub Header */}
        <div className="bg-gray-900 text-white relative" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${hubData?.image})`,
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
                <h1 className="text-3xl font-bold">
                  {hubData.name} - Articles
                </h1>
                <p className="mt-2 text-white/80 max-w-2xl">
                  Explore articles, guides, interviews and more from the{' '}
                  {hubData.name.toLowerCase()} community.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button onClick={handleWriteForHub} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Write for the Hub
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Featured Article */}
          {featuredArticle && <div className="mb-8">
              <ArticleHero article={featuredArticle} hubSlug={slug as string} />
            </div>}

          {/* Content Type Pills */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button onClick={() => handleFilterChange('contentType', '')} className={`px-4 py-2 rounded-full text-sm font-medium ${!filters.contentType ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
              All
            </button>
            {hubData.contentTypes.map((type: string) => <button key={type} onClick={() => handleFilterChange('contentType', type)} className={`px-4 py-2 rounded-full text-sm font-medium ${filters.contentType === type ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>
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
                <input type="text" placeholder="Search articles..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>

              {/* Sort By Dropdown */}
              <div className="flex-shrink-0">
                <label className="text-sm text-gray-700 mr-2">Sort by:</label>
                <select className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500" value={filters.sortBy} onChange={e => handleFilterChange('sortBy', e.target.value)}>
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
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
                        <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
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

          {/* Main Content Area with Sidebar */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Articles List */}
            <div className="w-full lg:w-2/3">
              {/* Articles Count */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {filteredArticles.length} Article
                  {filteredArticles.length !== 1 ? 's' : ''}
                </h2>
                {(filters.tag || filters.author || filters.dateRange || filters.contentType || searchQuery) && <div className="flex flex-wrap gap-2">
                    {filters.contentType && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {filters.contentType}
                        <button onClick={() => handleFilterChange('contentType', '')} className="ml-1 text-blue-500 hover:text-blue-700">
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

              {/* Articles Grid */}
              {filteredArticles.length === 0 ? <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No articles found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We couldn't find any articles matching your criteria. Try
                    adjusting your filters or search term.
                  </p>
                  <div className="mt-6">
                    <button onClick={clearFilters} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                      Clear all filters
                    </button>
                  </div>
                </div> : <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  {filteredArticles.map(article => <ArticleCard key={article.id} article={article} hubSlug={slug as string} />)}
                </div>}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              {/* Popular Articles */}
              <PopularArticles articles={articles.filter(a => a.views > 500).sort((a, b) => b.views - a.views).slice(0, 5)} hubSlug={slug as string} />

              {/* Write for the Hub CTA */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-sm p-6 mt-6 text-white">
                <h3 className="text-xl font-bold mb-2">Write for the Hub</h3>
                <p className="text-white/90 text-sm mb-4">
                  Share your knowledge and experiences with the {hubData.name}{' '}
                  community. We welcome articles, guides, reviews and more.
                </p>
                <ul className="space-y-2 mb-4 text-sm">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-indigo-200 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Build your reputation in the community</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-indigo-200 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Share your expertise and insights</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-indigo-200 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Connect with like-minded enthusiasts</span>
                  </li>
                </ul>
                <button onClick={handleWriteForHub} className="w-full px-4 py-2 bg-white text-indigo-700 rounded-md font-medium hover:bg-indigo-50 transition-colors">
                  Submit Your Article
                </button>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
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
};
// Helper function to generate mock articles
function generateMockArticles(hubData: any) {
  const articles = [];
  const contentTypes = hubData.contentTypes;
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
  // Article titles based on hub
  const titles = hubData.id === 'jazz-lovers' ? ['The Evolution of Bebop: From Charlie Parker to Modern Innovators', 'Top 10 Jazz Clubs You Need to Visit in 2023', 'Interview with Rising Star Saxophone Player Marcus Johnson', "How to Appreciate Jazz: A Beginner's Guide", 'The Lost Recordings of Thelonious Monk: Recently Discovered Tapes', 'Jazz Theory Basics: Understanding Chord Progressions', 'The Influence of Latin Rhythms on Modern Jazz', 'Review: New Orleans Jazz Festival 2023', 'Women in Jazz: Breaking Barriers and Setting New Standards', 'The Art of Improvisation: Techniques from the Masters', "Jazz Album Reviews: This Month's Top Releases", 'The History of the Blue Note Record Label', 'Digital Age Jazz: How Technology is Changing the Genre', 'Jazz Education: Best Schools and Online Resources', 'The Cultural Impact of Jazz in America and Beyond', 'Vocal Jazz: From Ella Fitzgerald to Contemporary Vocalists', 'Jazz Instruments: A Comprehensive Guide', 'The Business of Jazz: How Musicians Make a Living Today', 'Jazz Fusion: When Genres Collide', 'Preserving Jazz Heritage: Important Archives and Museums'] : ['Container Gardening 101: Getting Started with Limited Space', 'Sustainable Urban Farming Practices for City Dwellers', 'Interview with Award-Winning Urban Garden Designer Sarah Chen', 'Seasonal Planting Guide: What to Grow in Your Region', 'Composting Basics: Turn Kitchen Waste into Garden Gold', 'Vertical Gardening Solutions for Small Urban Spaces', 'Herb Growing Guide: From Windowsill to Garden Bed', 'Community Gardens: How to Start or Join One in Your Neighborhood', 'Pest Management the Natural Way: No Chemicals Needed', 'Indoor Plant Care: Keeping Your Green Friends Happy', 'Urban Beekeeping: A Sweet Addition to City Gardens', 'Rainwater Harvesting Systems for the Urban Gardener', 'Soil Health: The Foundation of a Successful Garden', 'Growing Food in the City: From Tomatoes to Tubers', 'Garden Design Principles for Urban Spaces', 'Seed Saving and Swapping: Building Community Resilience', 'Hydroponics vs Soil: Pros and Cons for Urban Growers', 'Winter Gardening: Extending Your Growing Season', 'Gardening for Pollinators: Creating Urban Habitat', 'Edible Landscaping: Beautiful and Delicious Gardens'];
  // Generate article images
  const images = hubData.id === 'jazz-lovers' ? ['https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1485579149621-3123dd979885?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'] : ['https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1534710961216-75c88202f43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'];
  // Generate 20 articles
  for (let i = 0; i < 20; i++) {
    const now = new Date();
    const publishDate = new Date();
    publishDate.setDate(now.getDate() - Math.floor(Math.random() * 60)); // Random date in the last 60 days
    const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    // Select 2-4 random tags
    const numTags = Math.floor(Math.random() * 3) + 2;
    const shuffledTags = [...tags].sort(() => 0.5 - Math.random());
    const selectedTags = shuffledTags.slice(0, numTags);
    // Generate random read time between 3-15 minutes
    const readTimeMinutes = Math.floor(Math.random() * 13) + 3;
    // Random engagement metrics
    const views = Math.floor(Math.random() * 2000) + 100;
    const likes = Math.floor(views * (Math.random() * 0.3 + 0.05));
    const comments = Math.floor(likes * (Math.random() * 0.5 + 0.1));
    const shares = Math.floor(likes * (Math.random() * 0.3 + 0.05));
    // Calculate trending score (recency + engagement)
    const daysSincePublished = Math.ceil((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24));
    const recencyScore = Math.max(0, 30 - daysSincePublished) / 30; // 0-1 score, higher for more recent
    const engagementScore = views / 2000 * 0.4 + likes / 500 * 0.3 + comments / 100 * 0.2 + shares / 100 * 0.1;
    const trendingScore = (recencyScore * 0.6 + engagementScore * 0.4) * 100;
    articles.push({
      id: `article-${i + 1}`,
      title: titles[i % titles.length],
      contentType: contentType,
      image: images[i % images.length],
      publishedAt: publishDate.toISOString(),
      author: author,
      readTimeMinutes: readTimeMinutes,
      excerpt: `This ${contentType.toLowerCase()} explores ${hubData.id === 'jazz-lovers' ? 'jazz concepts' : 'gardening techniques'} and provides valuable insights for both beginners and experienced ${hubData.id === 'jazz-lovers' ? 'musicians' : 'gardeners'}.`,
      tags: selectedTags,
      views: views,
      likes: likes,
      comments: comments,
      shares: shares,
      trendingScore: trendingScore,
      isFeatured: i === 0 // Make the first article featured
    });
  }
  return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}