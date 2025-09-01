import React, { useEffect, useState, Component } from 'react';
import { useNavigationContext } from '../../context/NavigationContext';
import { UserIcon, MessageSquareIcon, HeartIcon, ShareIcon, ImageIcon, SmileIcon, MapPinIcon, CalendarIcon, MusicIcon, BuildingIcon, PlusIcon, XIcon, ChevronDownIcon, BellIcon, UsersIcon, SearchIcon, FilterIcon } from 'lucide-react';
// Mock data for posts
const mockPosts = [{
  id: 'post-1',
  author: {
    id: 'user-123',
    name: 'Alex Johnson',
    username: '@alexjohnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  content: 'Just got tickets to the Jazz Festival next weekend! Anyone else going? #JazzFestival #LiveMusic',
  images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  likes: 24,
  comments: 8,
  shares: 3,
  liked: false,
  location: 'Clearwater Jazz Festival',
  event: {
    id: 'event-456',
    name: 'Clearwater Jazz Holiday',
    date: 'Oct 15-18, 2024'
  }
}, {
  id: 'post-2',
  author: {
    id: 'venue-789',
    name: 'The Capitol Theatre',
    username: '@capitoltheatre',
    avatar: 'https://images.unsplash.com/photo-1559519529-0936e4058364?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isVenue: true
  },
  content: "We're excited to announce our summer concert series lineup! Check out these amazing performers coming to our stage. Tickets on sale this Friday at 10am. #SummerConcerts #LiveMusic",
  timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
  likes: 156,
  comments: 42,
  shares: 28,
  liked: true,
  event: {
    id: 'event-790',
    name: 'Summer Concert Series',
    date: 'Jun 1 - Aug 30, 2024'
  }
}, {
  id: 'post-3',
  author: {
    id: 'performer-456',
    name: 'The Sunset Quartet',
    username: '@sunsetquartet',
    avatar: 'https://images.unsplash.com/photo-1511915361894-0bca90585dde?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isPerformer: true
  },
  content: 'We had such an amazing time performing at Coachman Park last night! Thank you to everyone who came out to support live music. Here are some highlights from our set. #LiveJazz #Clearwater',
  images: ['https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1528111493383-e05a0f0d191d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
  timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  likes: 87,
  comments: 14,
  shares: 7,
  liked: false,
  location: 'Coachman Park'
}, {
  id: 'post-4',
  author: {
    id: 'user-567',
    name: 'Maria Rodriguez',
    username: '@mariarodriguez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  content: "I'm looking for recommendations for good open mic nights in downtown Clearwater. Any suggestions? #OpenMic #LocalMusic",
  timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  likes: 12,
  comments: 18,
  shares: 0,
  liked: false
}, {
  id: 'post-5',
  author: {
    id: 'user-123',
    name: 'Alex Johnson',
    username: '@alexjohnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  content: "Check out my review of last weekend's Food Festival at Pier 60. Absolutely amazing cuisine from local restaurants! #FoodFestival #LocalEats",
  images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
  timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  likes: 43,
  comments: 7,
  shares: 5,
  liked: true,
  location: 'Pier 60',
  event: {
    id: 'event-789',
    name: 'Clearwater Food Festival',
    date: 'Last Weekend'
  }
}];
// Mock data for trending topics
const trendingTopics = [{
  tag: '#JazzFestival',
  count: 1243
}, {
  tag: '#ClearwaterBeach',
  count: 876
}, {
  tag: '#LiveMusic',
  count: 654
}, {
  tag: '#WeekendEvents',
  count: 432
}, {
  tag: '#LocalArtists',
  count: 321
}];
// Mock data for suggested connections
const suggestedConnections = [{
  id: 'user-789',
  name: 'Emily Chen',
  username: '@emilychen',
  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  mutualConnections: 12,
  type: 'user'
}, {
  id: 'venue-456',
  name: 'Clearwater Beach Bar',
  username: '@beachbar',
  avatar: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  mutualConnections: 8,
  type: 'venue'
}, {
  id: 'performer-789',
  name: 'Coastal Vibes Band',
  username: '@coastalvibes',
  avatar: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  mutualConnections: 5,
  type: 'performer'
}];
// Mock data for upcoming events
const upcomingEvents = [{
  id: 'event-123',
  name: 'Downtown Art Walk',
  date: 'This Friday, 6-9pm',
  location: 'Cleveland Street District',
  image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  attendees: 87
}, {
  id: 'event-124',
  name: 'Sunset Cinema at the Beach',
  date: 'Saturday, 8pm',
  location: 'Pier 60',
  image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  attendees: 124
}];
// Mock data for user groups
const userGroups = [{
  id: 'group-1',
  name: 'Clearwater Music Lovers',
  members: 1243,
  avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  isJoined: true
}, {
  id: 'group-2',
  name: 'Local Foodies',
  members: 876,
  avatar: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  isJoined: false
}, {
  id: 'group-3',
  name: 'Beach Volleyball Club',
  members: 432,
  avatar: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  isJoined: false
}];
const FeedPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const [posts, setPosts] = useState(mockPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [activeTab, setActiveTab] = useState<'following' | 'discover'>('following');
  const [isLoading, setIsLoading] = useState(false);
  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    return date.toLocaleDateString();
  };
  // Handle post submission
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && newPostImages.length === 0) return;
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const newPost = {
        id: `post-${Date.now()}`,
        author: {
          id: 'user-123',
          name: 'Alex Johnson',
          username: '@alexjohnson',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        content: newPostContent,
        images: newPostImages,
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      setNewPostImages([]);
      setShowImageUpload(false);
      setIsLoading(false);
    }, 1000);
  };
  // Handle like action
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };
  // Handle image upload
  const handleImageUpload = () => {
    // In a real app, this would open a file picker
    // For this demo, we'll just add a placeholder image
    setNewPostImages([...newPostImages, 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80']);
  };
  // Handle image removal
  const handleRemoveImage = (index: number) => {
    setNewPostImages(newPostImages.filter((_, i) => i !== index));
    if (newPostImages.length <= 1) {
      setShowImageUpload(false);
    }
  };
  // Simulate loading more posts
  const loadMorePosts = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would fetch more posts from the API
      // For this demo, we'll just duplicate existing posts with new IDs
      const morePosts = posts.slice(0, 2).map(post => ({
        ...post,
        id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 30),
        shares: Math.floor(Math.random() * 10),
        liked: Math.random() > 0.5
      }));
      setPosts([...posts, ...morePosts]);
      setIsLoading(false);
    }, 1000);
  };
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="md:w-1/4 space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <div className="p-4 relative">
                <div className="absolute -top-12 left-4">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Alex Johnson" className="h-16 w-16 rounded-full border-4 border-white" />
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-bold">Alex Johnson</h3>
                  <p className="text-gray-500">@alexjohnson</p>
                  <div className="mt-4 flex justify-between text-sm">
                    <div>
                      <div className="font-semibold">342</div>
                      <div className="text-gray-500">Followers</div>
                    </div>
                    <div>
                      <div className="font-semibold">128</div>
                      <div className="text-gray-500">Following</div>
                    </div>
                    <div>
                      <div className="font-semibold">87</div>
                      <div className="text-gray-500">Events</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 p-4">
                <button onClick={() => navigateTo('/profile/alexjohnson')} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  View Profile
                </button>
              </div>
            </div>
            {/* Navigation Menu */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <h3 className="font-medium text-gray-900">Navigation</h3>
                <nav className="mt-2 space-y-1">
                  <button onClick={() => navigateTo('/social/feed')} className="w-full flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md">
                    <svg className="mr-3 h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    Feed
                  </button>
                  <button onClick={() => navigateTo('/social/groups')} className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                    <UsersIcon className="mr-3 h-5 w-5 text-gray-400" />
                    Groups
                  </button>
                  <button onClick={() => navigateTo('/social/messages')} className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                    <MessageSquareIcon className="mr-3 h-5 w-5 text-gray-400" />
                    Messages
                  </button>
                  <button onClick={() => navigateTo('/social/events')} className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                    <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
                    Events
                  </button>
                  <button onClick={() => navigateTo('/social/saved')} className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                    <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Saved
                  </button>
                </nav>
              </div>
            </div>
            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <h3 className="font-medium text-gray-900">Trending Topics</h3>
                <div className="mt-2 space-y-3">
                  {trendingTopics.map((topic, index) => <div key={index} className="flex justify-between items-center">
                      <button onClick={() => navigateTo(`/social/search?q=${encodeURIComponent(topic.tag)}`)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        {topic.tag}
                      </button>
                      <span className="text-xs text-gray-500">
                        {topic.count} posts
                      </span>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="md:w-1/2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button onClick={() => setActiveTab('following')} className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'following' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Following
                  </button>
                  <button onClick={() => setActiveTab('discover')} className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'discover' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Discover
                  </button>
                </nav>
              </div>
            </div>
            {/* Post Creation */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Alex Johnson" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <form onSubmit={handlePostSubmit}>
                      <div>
                        <textarea rows={3} name="comment" id="comment" className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md" placeholder="What's happening?" value={newPostContent} onChange={e => setNewPostContent(e.target.value)} />
                      </div>
                      {/* Image Preview */}
                      {newPostImages.length > 0 && <div className="mt-3 flex flex-wrap gap-2">
                          {newPostImages.map((image, index) => <div key={index} className="relative">
                              <img src={image} alt="Post attachment" className="h-20 w-20 object-cover rounded" />
                              <button type="button" onClick={() => handleRemoveImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                                <XIcon className="h-3 w-3" />
                              </button>
                            </div>)}
                        </div>}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button type="button" onClick={() => {
                          setShowImageUpload(!showImageUpload);
                          if (showImageUpload && newPostImages.length === 0) {
                            handleImageUpload();
                          }
                        }} className="flex items-center text-gray-500 hover:text-gray-700">
                            <ImageIcon className="h-5 w-5" />
                            <span className="ml-1 text-sm">Photo</span>
                          </button>
                          <button type="button" className="flex items-center text-gray-500 hover:text-gray-700">
                            <MapPinIcon className="h-5 w-5" />
                            <span className="ml-1 text-sm">Location</span>
                          </button>
                          <button type="button" className="flex items-center text-gray-500 hover:text-gray-700">
                            <CalendarIcon className="h-5 w-5" />
                            <span className="ml-1 text-sm">Event</span>
                          </button>
                        </div>
                        <button type="submit" disabled={!newPostContent.trim() && newPostImages.length === 0 || isLoading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                          {isLoading ? 'Posting...' : 'Post'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/* Posts */}
            <div className="space-y-6">
              {posts.map(post => <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {/* Post Header */}
                  <div className="p-4 sm:px-6">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <img className="h-10 w-10 rounded-full" src={post.author.avatar} alt={post.author.name} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          <button onClick={() => navigateTo(post.author.isVenue ? `/venues/${post.author.id}` : post.author.isPerformer ? `/performers/${post.author.id}` : `/profile/${post.author.username.replace('@', '')}`)} className="hover:underline">
                            {post.author.name}
                          </button>
                          {post.author.isVenue && <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                              Venue
                            </span>}
                          {post.author.isPerformer && <span className="ml-1 text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                              Performer
                            </span>}
                        </p>
                        <p className="text-sm text-gray-500">
                          {post.author.username} ·{' '}
                          {formatTimestamp(post.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Post Content */}
                  <div className="px-4 sm:px-6 pb-2">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {post.content}
                    </p>
                    {/* Location and Event Tags */}
                    {(post.location || post.event) && <div className="mt-2 flex flex-wrap gap-2">
                        {post.location && <button onClick={() => navigateTo(`/venues/search?q=${encodeURIComponent(post.location)}`)} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                            <MapPinIcon className="h-3 w-3 mr-1" />
                            {post.location}
                          </button>}
                        {post.event && <button onClick={() => navigateTo(`/events/${post.event.id}`)} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {post.event.name} • {post.event.date}
                          </button>}
                      </div>}
                  </div>
                  {/* Post Images */}
                  {post.images && post.images.length > 0 && <div className={`mt-2 ${post.images.length === 1 ? '' : 'grid grid-cols-2 gap-1'}`}>
                      {post.images.map((image, index) => <div key={index} className={post.images.length === 1 ? 'aspect-video' : 'aspect-square'}>
                          <img src={image} alt={`Post attachment ${index + 1}`} className="w-full h-full object-cover" />
                        </div>)}
                    </div>}
                  {/* Post Actions */}
                  <div className="px-4 sm:px-6 py-3 border-t border-gray-200 flex justify-between">
                    <button onClick={() => handleLike(post.id)} className={`flex items-center text-sm ${post.liked ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}>
                      <HeartIcon className={`h-5 w-5 ${post.liked ? 'fill-current' : ''}`} />
                      <span className="ml-1">{post.likes}</span>
                    </button>
                    <button onClick={() => navigateTo(`/social/post/${post.id}`)} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                      <MessageSquareIcon className="h-5 w-5" />
                      <span className="ml-1">{post.comments}</span>
                    </button>
                    <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                      <ShareIcon className="h-5 w-5" />
                      <span className="ml-1">{post.shares}</span>
                    </button>
                  </div>
                </div>)}
              {/* Load More Button */}
              <div className="text-center">
                <button onClick={loadMorePosts} disabled={isLoading} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  {isLoading ? <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </> : 'Load More'}
                </button>
              </div>
            </div>
          </div>
          {/* Right Sidebar */}
          <div className="md:w-1/4 space-y-6">
            {/* Search Box */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" placeholder="Search posts, people, events..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>
            {/* Suggested Connections */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">
                  Suggested Connections
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {suggestedConnections.map(connection => <div key={connection.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full" src={connection.avatar} alt={connection.name} />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {connection.name}
                            {connection.type !== 'user' && <span className={`ml-1 text-xs px-1.5 py-0.5 rounded ${connection.type === 'venue' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                                {connection.type === 'venue' ? 'Venue' : 'Performer'}
                              </span>}
                          </p>
                          <p className="text-xs text-gray-500">
                            {connection.username} •{' '}
                            {connection.mutualConnections} mutual
                          </p>
                        </div>
                      </div>
                      <button className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Follow
                      </button>
                    </div>
                  </div>)}
                <div className="p-4 text-center">
                  <button onClick={() => navigateTo('/social/discover')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    View More
                  </button>
                </div>
              </div>
            </div>
            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Upcoming Events</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {upcomingEvents.map(event => <div key={event.id} className="p-4">
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden">
                        <img src={event.image} alt={event.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          <button onClick={() => navigateTo(`/events/${event.id}`)} className="hover:underline">
                            {event.name}
                          </button>
                        </p>
                        <p className="text-xs text-gray-500">
                          <CalendarIcon className="inline-block h-3 w-3 mr-1" />
                          {event.date}
                        </p>
                        <p className="text-xs text-gray-500">
                          <MapPinIcon className="inline-block h-3 w-3 mr-1" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {event.attendees} people attending
                    </div>
                  </div>)}
                <div className="p-4 text-center">
                  <button onClick={() => navigateTo('/events')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    View All Events
                  </button>
                </div>
              </div>
            </div>
            {/* Your Groups */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Your Groups</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {userGroups.map(group => <div key={group.id} className="p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img className="h-10 w-10 rounded-full" src={group.avatar} alt={group.name} />
                      </div>
                      <div className="ml-3 min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          <button onClick={() => navigateTo(`/social/groups/${group.id}`)} className="hover:underline">
                            {group.name}
                          </button>
                        </p>
                        <p className="text-xs text-gray-500">
                          {group.members} members
                        </p>
                      </div>
                      {group.isJoined ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckIcon className="h-3 w-3 mr-1" />
                          Joined
                        </span> : <button className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Join
                        </button>}
                    </div>
                  </div>)}
                <div className="p-4 text-center">
                  <button onClick={() => navigateTo('/social/groups')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    View All Groups
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default FeedPage;