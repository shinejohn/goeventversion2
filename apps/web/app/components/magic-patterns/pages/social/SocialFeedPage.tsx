import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ThumbsUpIcon, MessageCircleIcon, ShareIcon, UserPlusIcon, CalendarIcon, MapPinIcon, MusicIcon, BellIcon, UsersIcon, HeartIcon, GlobeIcon, LockIcon, UserIcon, PlusIcon, MoreHorizontalIcon, XIcon, ChevronDownIcon, ImageIcon, SmileIcon, TagIcon, LinkIcon } from 'lucide-react';
// Mock data for social feed
const mockPosts = [{
  id: 'post-1',
  author: {
    id: 'user-123',
    name: 'Alex Johnson',
    username: 'alexjohnson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    verified: true
  },
  content: "Just got tickets to the Clearwater Jazz Holiday next month! Can't wait to see the lineup this year. Who else is going? #ClearwaterJazz #LiveMusic",
  images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
  linkedEvent: {
    id: 'event-1',
    name: 'Clearwater Jazz Holiday',
    date: 'Oct 15-18, 2024',
    venue: 'Coachman Park'
  },
  createdAt: '2024-07-15T14:23:00Z',
  likes: 42,
  comments: 8,
  shares: 3,
  liked: true,
  privacy: 'public'
}, {
  id: 'post-2',
  author: {
    id: 'venue-1',
    name: 'Capitol Theatre',
    username: 'capitoltheatreclearwater',
    avatar: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    verified: true,
    type: 'venue'
  },
  content: "We're thrilled to announce our fall lineup! From comedy shows to classic rock tributes, we've got something for everyone. Early bird tickets available now!",
  images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
  createdAt: '2024-07-14T10:15:00Z',
  likes: 86,
  comments: 12,
  shares: 15,
  liked: false,
  privacy: 'public'
}, {
  id: 'post-3',
  author: {
    id: 'performer-1',
    name: 'The Sunset Kings',
    username: 'sunsetkingsband',
    avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    verified: true,
    type: 'performer'
  },
  content: "New single dropping this Friday! We recorded this one at Clearwater Sound Studio and can't wait for you all to hear it. Here's a little behind-the-scenes from our recording session.",
  images: ['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
  createdAt: '2024-07-13T18:45:00Z',
  likes: 124,
  comments: 31,
  shares: 22,
  liked: true,
  privacy: 'public'
}, {
  id: 'post-4',
  author: {
    id: 'user-456',
    name: 'Sarah Williams',
    username: 'sarahw',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    verified: false
  },
  content: "Had the best time at the Summer Sunset Concert Series last night! The weather was perfect, the music was amazing, and the crowd was so energetic. Definitely recommend catching one of these shows if you haven't already!",
  images: ['https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
  linkedEvent: {
    id: 'event-2',
    name: 'Summer Sunset Concert Series',
    date: 'July 12, 2024',
    venue: 'Pier 60'
  },
  createdAt: '2024-07-13T09:30:00Z',
  likes: 67,
  comments: 14,
  shares: 5,
  liked: false,
  privacy: 'public'
}, {
  id: 'post-5',
  author: {
    id: 'group-1',
    name: 'Clearwater Music Lovers',
    username: 'cwmusiclovers',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    type: 'group'
  },
  content: "Our monthly meetup is happening this Saturday at Coachman Park! We'll be discussing upcoming summer festivals and planning some group outings. All music enthusiasts welcome! Bring a friend!",
  createdAt: '2024-07-12T15:20:00Z',
  likes: 35,
  comments: 19,
  shares: 8,
  liked: true,
  privacy: 'public'
}];
// Mock data for trending events
const trendingEvents = [{
  id: 'trend-1',
  name: 'Clearwater Beach Music Festival',
  date: 'August 5-7, 2024',
  image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  attendees: 1245
}, {
  id: 'trend-2',
  name: 'Downtown Art Walk',
  date: 'July 28, 2024',
  image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  attendees: 876
}, {
  id: 'trend-3',
  name: 'Comedy Night at Capitol Theatre',
  date: 'August 12, 2024',
  image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  attendees: 543
}];
// Mock data for friend suggestions
const friendSuggestions = [{
  id: 'user-789',
  name: 'Mike Chen',
  username: 'mikechen',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  mutualFriends: 8
}, {
  id: 'user-101',
  name: 'Emma Rodriguez',
  username: 'emmar',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  mutualFriends: 5
}, {
  id: 'user-102',
  name: 'David Park',
  username: 'davidp',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  mutualFriends: 12
}];
// Mock data for groups
const suggestedGroups = [{
  id: 'group-2',
  name: 'Clearwater Beach Events',
  avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  members: 1423
}, {
  id: 'group-3',
  name: 'Florida Musicians Network',
  avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  members: 3256
}, {
  id: 'group-4',
  name: 'Tampa Bay Foodies',
  avatar: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  members: 5671
}];
const SocialFeedPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(mockPosts);
  const [postContent, setPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [privacyOption, setPrivacyOption] = useState('public');
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('forYou');
  // Handle post like
  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLikedState = !post.liked;
        return {
          ...post,
          liked: newLikedState,
          likes: newLikedState ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };
  // Handle new post submission
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        id: 'user-123',
        name: 'Alex Johnson',
        username: 'alexjohnson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        verified: true
      },
      content: postContent,
      images: selectedImages,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      privacy: privacyOption
    };
    setPosts([newPost, ...posts]);
    setPostContent('');
    setSelectedImages([]);
  };
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };
  // Add a mock image when user clicks add image
  const handleAddImage = () => {
    // In a real app, this would open a file picker
    const mockImages = ['https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 'https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    setSelectedImages([...selectedImages, randomImage]);
  };
  // Remove image from selected images
  const handleRemoveImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };
  return <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-6">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" className="h-12 w-12 rounded-full" />
                  <div>
                    <h3 className="font-medium">Alex Johnson</h3>
                    <p className="text-sm text-gray-500">@alexjohnson</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  <button onClick={() => navigate('/profile/alexjohnson')} className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left">
                    <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
                    My Profile
                  </button>
                  <button onClick={() => navigate('/social/friends')} className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left">
                    <UserPlusIcon className="mr-3 h-5 w-5 text-gray-400" />
                    Friends
                  </button>
                  <button onClick={() => navigate('/social/groups')} className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left">
                    <UsersIcon className="mr-3 h-5 w-5 text-gray-400" />
                    Groups
                  </button>
                  <button onClick={() => navigate('/calendar')} className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left">
                    <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
                    Events
                  </button>
                  <button onClick={() => navigate('/venues')} className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left">
                    <MapPinIcon className="mr-3 h-5 w-5 text-gray-400" />
                    Venues
                  </button>
                  <button onClick={() => navigate('/performers')} className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left">
                    <MusicIcon className="mr-3 h-5 w-5 text-gray-400" />
                    Performers
                  </button>
                  <button onClick={() => navigate('/social/saved')} className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left">
                    <HeartIcon className="mr-3 h-5 w-5 text-gray-400" />
                    Saved
                  </button>
                </nav>
              </div>
            </div>
            {/* Group suggestions */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b">
                <h2 className="font-medium">Groups You Might Like</h2>
              </div>
              <div className="p-4">
                {suggestedGroups.map(group => <div key={group.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <img src={group.avatar} alt={group.name} className="h-10 w-10 rounded-lg object-cover mr-3" />
                      <div>
                        <h3 className="font-medium text-sm">{group.name}</h3>
                        <p className="text-xs text-gray-500">
                          {group.members.toLocaleString()} members
                        </p>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      Join
                    </button>
                  </div>)}
                <button onClick={() => navigate('/social/groups')} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  See More Groups
                </button>
              </div>
            </div>
          </div>
          {/* Main feed */}
          <div className="md:w-2/4">
            {/* Create post card */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4">
                <div className="flex space-x-4">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <form onSubmit={handlePostSubmit}>
                      <textarea placeholder="What's happening?" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows={3} value={postContent} onChange={e => setPostContent(e.target.value)}></textarea>
                      {/* Selected images preview */}
                      {selectedImages.length > 0 && <div className="mt-2 flex flex-wrap gap-2">
                          {selectedImages.map((img, index) => <div key={index} className="relative w-20 h-20">
                              <img src={img} alt="Selected" className="w-full h-full object-cover rounded" />
                              <button type="button" className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5" onClick={() => handleRemoveImage(index)}>
                                <XIcon className="h-4 w-4" />
                              </button>
                            </div>)}
                        </div>}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex space-x-2">
                          <button type="button" onClick={handleAddImage} className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                            <ImageIcon className="h-5 w-5" />
                          </button>
                          <button type="button" className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                            <SmileIcon className="h-5 w-5" />
                          </button>
                          <button type="button" className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                            <TagIcon className="h-5 w-5" />
                          </button>
                          <button type="button" className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                            <LinkIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <div className="relative">
                            <button type="button" className="flex items-center text-sm text-gray-700 mr-2 px-3 py-1 border border-gray-300 rounded-full" onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}>
                              {privacyOption === 'public' ? <GlobeIcon className="h-4 w-4 mr-1" /> : privacyOption === 'friends' ? <UsersIcon className="h-4 w-4 mr-1" /> : <LockIcon className="h-4 w-4 mr-1" />}
                              {privacyOption === 'public' ? 'Public' : privacyOption === 'friends' ? 'Friends' : 'Only me'}
                              <ChevronDownIcon className="h-4 w-4 ml-1" />
                            </button>
                            {showPrivacyDropdown && <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                                <div className="py-1">
                                  <button type="button" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => {
                                setPrivacyOption('public');
                                setShowPrivacyDropdown(false);
                              }}>
                                    <GlobeIcon className="h-4 w-4 mr-2" />
                                    Public
                                  </button>
                                  <button type="button" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => {
                                setPrivacyOption('friends');
                                setShowPrivacyDropdown(false);
                              }}>
                                    <UsersIcon className="h-4 w-4 mr-2" />
                                    Friends
                                  </button>
                                  <button type="button" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" onClick={() => {
                                setPrivacyOption('private');
                                setShowPrivacyDropdown(false);
                              }}>
                                    <LockIcon className="h-4 w-4 mr-2" />
                                    Only me
                                  </button>
                                </div>
                              </div>}
                          </div>
                          <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" disabled={!postContent.trim()}>
                            Post
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/* Feed tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button className={`px-4 py-4 text-sm font-medium border-b-2 ${activeTab === 'forYou' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('forYou')}>
                    For You
                  </button>
                  <button className={`px-4 py-4 text-sm font-medium border-b-2 ${activeTab === 'following' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('following')}>
                    Following
                  </button>
                  <button className={`px-4 py-4 text-sm font-medium border-b-2 ${activeTab === 'events' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('events')}>
                    Events
                  </button>
                  <button className={`px-4 py-4 text-sm font-medium border-b-2 ${activeTab === 'venues' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('venues')}>
                    Venues
                  </button>
                </nav>
              </div>
            </div>
            {/* Posts feed */}
            <div className="space-y-6">
              {posts.map(post => <div key={post.id} className="bg-white rounded-lg shadow">
                  <div className="p-4">
                    {/* Post header */}
                    <div className="flex justify-between">
                      <div className="flex space-x-3">
                        <img src={post.author.avatar} alt={post.author.name} className="h-10 w-10 rounded-full" />
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{post.author.name}</h3>
                            {post.author.verified && <span className="ml-1 text-blue-500">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                              </span>}
                            {post.author.type && <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs">
                                {post.author.type === 'venue' ? 'Venue' : post.author.type === 'performer' ? 'Performer' : post.author.type === 'group' ? 'Group' : ''}
                              </span>}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>@{post.author.username}</span>
                            <span className="mx-1">•</span>
                            <span>{formatDate(post.createdAt)}</span>
                            {post.privacy !== 'public' && <>
                                <span className="mx-1">•</span>
                                {post.privacy === 'friends' ? <UsersIcon className="h-3 w-3" /> : <LockIcon className="h-3 w-3" />}
                              </>}
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontalIcon className="h-5 w-5" />
                      </button>
                    </div>
                    {/* Post content */}
                    <div className="mt-3">
                      <p className="text-gray-800 whitespace-pre-line">
                        {post.content}
                      </p>
                      {/* Linked event */}
                      {post.linkedEvent && <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {post.linkedEvent.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {post.linkedEvent.date} •{' '}
                                {post.linkedEvent.venue}
                              </p>
                            </div>
                          </div>
                        </div>}
                      {/* Post images */}
                      {post.images && post.images.length > 0 && <div className={`mt-3 grid ${post.images.length > 1 ? 'grid-cols-2 gap-2' : 'grid-cols-1'}`}>
                          {post.images.map((image, index) => <img key={index} src={image} alt="Post content" className="rounded-lg w-full h-64 object-cover" />)}
                        </div>}
                    </div>
                    {/* Post actions */}
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <button className={`flex items-center space-x-2 ${post.liked ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => handleLike(post.id)}>
                        <ThumbsUpIcon className="h-5 w-5" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700" onClick={() => navigate(`/social/post/${post.id}`)}>
                        <MessageCircleIcon className="h-5 w-5" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                        <ShareIcon className="h-5 w-5" />
                        <span>{post.shares}</span>
                      </button>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
          {/* Right sidebar */}
          <div className="md:w-1/4">
            {/* Trending events */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b">
                <h2 className="font-medium">Trending Events</h2>
              </div>
              <div className="p-4">
                {trendingEvents.map(event => <div key={event.id} className="py-3 first:pt-0 last:pb-0 border-b last:border-0 border-gray-100" onClick={() => navigate(`/events/${event.id}`)}>
                    <div className="flex">
                      <img src={event.image} alt={event.name} className="h-12 w-12 rounded object-cover mr-3" />
                      <div>
                        <h3 className="font-medium text-sm">{event.name}</h3>
                        <p className="text-xs text-gray-500">{event.date}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {event.attendees.toLocaleString()} people interested
                        </p>
                      </div>
                    </div>
                  </div>)}
                <button onClick={() => navigate('/events')} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  See More Events
                </button>
              </div>
            </div>
            {/* Friend suggestions */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b">
                <h2 className="font-medium">People You May Know</h2>
              </div>
              <div className="p-4">
                {friendSuggestions.map(friend => <div key={friend.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center">
                      <img src={friend.avatar} alt={friend.name} className="h-10 w-10 rounded-full mr-3" />
                      <div>
                        <h3 className="font-medium text-sm">{friend.name}</h3>
                        <p className="text-xs text-gray-500">
                          {friend.mutualFriends} mutual friends
                        </p>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800">
                      <UserPlusIcon className="h-5 w-5" />
                    </button>
                  </div>)}
                <button onClick={() => navigate('/social/friends/suggestions')} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  See More
                </button>
              </div>
            </div>
            {/* Footer links */}
            <div className="text-xs text-gray-500">
              <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2">
                <a href="#" className="hover:underline">
                  About
                </a>
                <a href="#" className="hover:underline">
                  Privacy
                </a>
                <a href="#" className="hover:underline">
                  Terms
                </a>
                <a href="#" className="hover:underline">
                  Advertising
                </a>
                <a href="#" className="hover:underline">
                  Help
                </a>
              </div>
              <p>© 2024 When's The Fun</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default SocialFeedPage;