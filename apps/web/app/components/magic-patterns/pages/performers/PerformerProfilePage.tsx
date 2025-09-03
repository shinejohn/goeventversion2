import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { mockPerformers } from '../../mockdata/performers';
import { HeartIcon, ShareIcon, BellIcon, MoreHorizontalIcon, CalendarIcon, ClockIcon, MapPinIcon, MusicIcon, UsersIcon, StarIcon, CheckCircleIcon, MessageCircleIcon, PlayIcon, ShoppingBagIcon, MessageSquareIcon, InfoIcon, ChevronRightIcon, ExternalLinkIcon, ThumbsUpIcon, ThumbsDownIcon, FlagIcon, DownloadIcon, InstagramIcon, TwitterIcon, FacebookIcon, YoutubeIcon, LinkIcon, TicketIcon, ArrowRightIcon, CameraIcon, VideoIcon, MicIcon, FileTextIcon, DollarSignIcon, PlusIcon, MinusIcon, ShoppingCartIcon, HeartIcon as HeartOutlineIcon, AlertCircleIcon } from 'lucide-react';
type PerformerProfilePageProps = {
  performerId?: string;
};
// Enum for the different tabs
enum ProfileTab {
  Overview = 'overview',
  UpcomingShows = 'upcoming-shows',
  PastShows = 'past-shows',
  Media = 'media',
  Merchandise = 'merchandise',
  Reviews = 'reviews',
  FanZone = 'fan-zone',
  About = 'about',
}
export const PerformerProfilePage = ({
  performerId = 'performer-1'
}: PerformerProfilePageProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>(ProfileTab.Overview);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMediaExpanded, setIsMediaExpanded] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState<'photos' | 'videos' | 'audio'>('photos');
  const [selectedMediaItem, setSelectedMediaItem] = useState<any | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeReviewFilter, setActiveReviewFilter] = useState('recent');
  const [activeMerchCategory, setActiveMerchCategory] = useState('all');
  const [activeFanZoneTab, setActiveFanZoneTab] = useState('discussions');
  // Find the performer from mock data
  const performer = mockPerformers.find(p => p.id === performerId);
  // If performer not found, show error state
  if (!performer) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Performer Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The performer you're looking for doesn't exist or has been removed.
          </p>
          <button onClick={() => navigate('/performers')} className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Browse All Performers
          </button>
        </div>
      </div>;
  }
  // Generate random past shows for demo
  const generatePastShows = () => {
    const pastShows = [];
    const venues = ['Capitol Theatre', 'Jannus Live', 'State Theatre', 'Ruth Eckerd Hall', 'Crowbar', 'The Orpheum', 'The Ritz Ybor', 'Amalie Arena', "Skipper's Smokehouse"];
    const cities = ['Tampa, FL', 'St. Petersburg, FL', 'Clearwater, FL', 'Dunedin, FL', 'Orlando, FL'];
    // Generate shows for past 3 years
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 2; year--) {
      for (let i = 0; i < Math.floor(Math.random() * 10) + 5; i++) {
        const month = Math.floor(Math.random() * 12);
        const day = Math.floor(Math.random() * 28) + 1;
        const venue = venues[Math.floor(Math.random() * venues.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const attendance = Math.floor(Math.random() * 300) + 50;
        pastShows.push({
          id: `past-${year}-${month}-${day}-${i}`,
          date: new Date(year, month, day).toISOString(),
          venue,
          city,
          attendance,
          hasPhotos: Math.random() > 0.5,
          hasReviews: Math.random() > 0.6,
          reviewCount: Math.floor(Math.random() * 10),
          averageRating: (Math.random() * 1.5 + 3.5).toFixed(1)
        });
      }
    }
    // Sort by date, most recent first
    return pastShows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  // Generate random merchandise for demo
  const generateMerchandise = () => {
    const merchandise = [];
    const itemTypes = {
      apparel: ['T-Shirt', 'Hoodie', 'Hat', 'Beanie', 'Tank Top'],
      music: ['Vinyl Record', 'CD', 'Digital Album', 'EP', 'Single'],
      accessories: ['Poster', 'Sticker Pack', 'Pin Set', 'Keychain', 'Phone Case'],
      exclusive: ['Signed Photo', 'Handwritten Lyrics', 'VIP Package', 'Limited Print', 'Stage-Used Item']
    };
    // Generate items for each category
    Object.entries(itemTypes).forEach(([category, items]) => {
      items.forEach((item, index) => {
        const price = category === 'exclusive' ? Math.floor(Math.random() * 150) + 50 : category === 'apparel' ? Math.floor(Math.random() * 30) + 20 : category === 'music' ? Math.floor(Math.random() * 25) + 10 : Math.floor(Math.random() * 15) + 5;
        const stock = Math.random() > 0.8 ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 50) + 10;
        const reviewCount = Math.floor(Math.random() * 20);
        const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
        merchandise.push({
          id: `${category}-${index}`,
          name: `${performer.name} ${item}`,
          category,
          price,
          image: `https://source.unsplash.com/random/300x300/?${category},${item.replace(' ', '')}`,
          stock,
          isNew: Math.random() > 0.7,
          isFeatured: Math.random() > 0.8,
          reviewCount,
          rating,
          sizes: category === 'apparel' ? ['S', 'M', 'L', 'XL', 'XXL'] : null,
          availableSizes: category === 'apparel' ? ['S', 'M', 'L', 'XL', 'XXL'].filter(() => Math.random() > 0.3) : null
        });
      });
    });
    return merchandise;
  };
  // Generate random reviews for demo
  const generateReviews = () => {
    const reviews = [];
    const reviewers = [{
      name: 'John D.',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      showsAttended: 12,
      isVerified: true
    }, {
      name: 'Sarah M.',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      showsAttended: 5,
      isVerified: true
    }, {
      name: 'Michael R.',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      showsAttended: 3,
      isVerified: false
    }, {
      name: 'Jessica T.',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      showsAttended: 8,
      isVerified: true
    }, {
      name: 'David K.',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      showsAttended: 1,
      isVerified: true
    }, {
      name: 'Emma L.',
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
      showsAttended: 4,
      isVerified: false
    }, {
      name: 'Chris P.',
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
      showsAttended: 7,
      isVerified: true
    }, {
      name: 'Amanda B.',
      avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
      showsAttended: 2,
      isVerified: true
    }];
    const reviewTexts = ['Amazing performance! The energy was incredible and the sound quality was perfect.', 'Really enjoyed the show. Great selection of songs and awesome stage presence.', "Decent performance but the venue wasn't great. Would see them again at a different location.", "One of the best live acts I've seen. They sound even better live than on their recordings.", 'Good show but a bit short. Would have liked to hear more of their older material.', 'Incredible talent! The whole crowd was engaged from start to finish.', 'Fantastic performance with great interaction with the audience. Will definitely see them again!', 'Solid performance but nothing spectacular. The opening act was surprisingly good.', 'Mind-blowing show! They played all my favorites and the light show was spectacular.', 'Great value for the ticket price. They played for over two hours and the energy never dropped.'];
    // Generate 20-30 reviews
    const reviewCount = Math.floor(Math.random() * 10) + 20;
    for (let i = 0; i < reviewCount; i++) {
      const reviewer = reviewers[Math.floor(Math.random() * reviewers.length)];
      const reviewText = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
      const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars mostly
      const helpfulCount = Math.floor(Math.random() * 30);
      const hasPhotos = Math.random() > 0.7;
      const hasVideos = Math.random() > 0.9;
      const hasPerformerReply = Math.random() > 0.8;
      // Random date in last 6 months
      const reviewDate = new Date();
      reviewDate.setMonth(reviewDate.getMonth() - Math.floor(Math.random() * 6));
      // Random venue
      const venues = ['Capitol Theatre', 'Jannus Live', 'State Theatre', 'Ruth Eckerd Hall', 'Crowbar'];
      const venue = venues[Math.floor(Math.random() * venues.length)];
      reviews.push({
        id: `review-${i}`,
        reviewer,
        rating,
        reviewText,
        reviewDate: reviewDate.toISOString(),
        venue,
        helpfulCount,
        hasPhotos,
        hasVideos,
        hasPerformerReply,
        performerReply: hasPerformerReply ? 'Thank you so much for coming to the show and for the kind words! Hope to see you at another show soon!' : null
      });
    }
    return reviews;
  };
  // Generate random fan zone discussions for demo
  const generateFanZoneDiscussions = () => {
    const discussions = [];
    const topics = ['Tour Announcement Discussion', 'Song Request Thread: What do you want to hear?', 'Post your concert photos here!', 'Anyone going to the show in Tampa?', 'New album speculation', 'Best live performance?', 'Meet & Greet experiences', 'Cover song suggestions', 'Favorite lyrics discussion', 'Merchandise quality thread', 'New fan introduction thread', 'Looking for concert buddies in Florida'];
    const users = [{
      name: 'MusicFan123',
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg'
    }, {
      name: 'ConcertGoer',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
    }, {
      name: 'LiveMusicLover',
      avatar: 'https://randomuser.me/api/portraits/men/13.jpg'
    }, {
      name: 'FloridaFan',
      avatar: 'https://randomuser.me/api/portraits/women/14.jpg'
    }, {
      name: 'TourFollower',
      avatar: 'https://randomuser.me/api/portraits/men/15.jpg'
    }, {
      name: 'MelodyMaster',
      avatar: 'https://randomuser.me/api/portraits/women/16.jpg'
    }];
    topics.forEach((topic, index) => {
      const isPinned = index < 2;
      const isLocked = Math.random() > 0.9;
      const author = users[Math.floor(Math.random() * users.length)];
      const replyCount = Math.floor(Math.random() * 50) + 1;
      // Random date in last 30 days
      const lastActivity = new Date();
      lastActivity.setDate(lastActivity.getDate() - Math.floor(Math.random() * 30));
      // Random date for creation (before last activity)
      const createdDate = new Date(lastActivity);
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 60));
      discussions.push({
        id: `discussion-${index}`,
        title: topic,
        author,
        isPinned,
        isLocked,
        replyCount,
        lastActivity: lastActivity.toISOString(),
        createdDate: createdDate.toISOString(),
        category: index % 5 === 0 ? 'announcements' : index % 5 === 1 ? 'general' : index % 5 === 2 ? 'meetups' : index % 5 === 3 ? 'requests' : 'fan-content'
      });
    });
    // Sort by pinned first, then by last activity
    return discussions.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    });
  };
  // Generate random media for demo
  const generateMedia = () => {
    const photos = [];
    const videos = [];
    const audio = [];
    // Generate 20-30 photos
    for (let i = 0; i < Math.floor(Math.random() * 10) + 20; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));
      photos.push({
        id: `photo-${i}`,
        url: `https://source.unsplash.com/random/800x600/?concert,music,${i}`,
        thumbnail: `https://source.unsplash.com/random/300x200/?concert,music,${i}`,
        title: `Live at ${Math.random() > 0.5 ? 'Capitol Theatre' : 'Jannus Live'}`,
        date: date.toISOString(),
        likes: Math.floor(Math.random() * 100),
        isAlbumCover: i === 0,
        isFanSubmitted: Math.random() > 0.7
      });
    }
    // Generate 5-10 videos
    for (let i = 0; i < Math.floor(Math.random() * 5) + 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));
      videos.push({
        id: `video-${i}`,
        thumbnail: `https://source.unsplash.com/random/300x200/?concert,stage,${i}`,
        title: i === 0 ? 'Official Music Video - New Single' : i === 1 ? 'Behind the Scenes - Summer Tour' : `Live Performance at ${Math.random() > 0.5 ? 'Capitol Theatre' : 'Jannus Live'}`,
        date: date.toISOString(),
        duration: `${Math.floor(Math.random() * 5) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        views: Math.floor(Math.random() * 10000),
        type: i === 0 ? 'music-video' : i === 1 ? 'behind-scenes' : Math.random() > 0.3 ? 'live' : 'interview'
      });
    }
    // Generate 8-15 audio tracks
    for (let i = 0; i < Math.floor(Math.random() * 7) + 8; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));
      audio.push({
        id: `audio-${i}`,
        title: `Track ${i + 1} - ${Math.random() > 0.5 ? 'Live Version' : 'Studio Recording'}`,
        album: Math.random() > 0.7 ? 'Latest Album' : 'Greatest Hits',
        date: date.toISOString(),
        duration: `${Math.floor(Math.random() * 3) + 2}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        plays: Math.floor(Math.random() * 5000),
        isExclusive: Math.random() > 0.8
      });
    }
    return {
      photos,
      videos,
      audio
    };
  };
  // Generate data for the page
  const pastShows = generatePastShows();
  const merchandise = generateMerchandise();
  const reviews = generateReviews();
  const discussions = generateFanZoneDiscussions();
  const media = generateMedia();
  // Calculate overall rating from reviews
  const calculateOverallRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };
  const overallRating = calculateOverallRating();
  // Calculate rating breakdown
  const ratingBreakdown = {
    5: Math.floor(reviews.filter(r => r.rating === 5).length / reviews.length * 100),
    4: Math.floor(reviews.filter(r => r.rating === 4).length / reviews.length * 100),
    3: Math.floor(reviews.filter(r => r.rating === 3).length / reviews.length * 100),
    2: Math.floor(reviews.filter(r => r.rating === 2).length / reviews.length * 100),
    1: Math.floor(reviews.filter(r => r.rating === 1).length / reviews.length * 100)
  };
  // Format date in a readable way
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };
  // Format date with year
  const formatDateWithYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  // Handle tab change
  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab);
    // Reset sub-tabs when changing main tabs
    if (tab === ProfileTab.Media) {
      setSelectedMediaType('photos');
    }
    if (tab === ProfileTab.FanZone) {
      setActiveFanZoneTab('discussions');
    }
    if (tab === ProfileTab.Merchandise) {
      setActiveMerchCategory('all');
    }
  };
  // Toggle follow status
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  // Handle media item click
  const handleMediaItemClick = (item: any, type: 'photos' | 'videos' | 'audio') => {
    setSelectedMediaItem(item);
    if (type === 'photos') {
      setIsLightboxOpen(true);
    }
  };
  // Close lightbox
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedMediaItem(null);
  };
  // Get performer years active string
  const getYearsActiveString = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - performer.yearsActive;
    return `Performing since ${startYear}`;
  };
  // Get performer experience level
  const getExperienceLevel = () => {
    if (performer.yearsActive < 3) return 'Emerging Artist';
    if (performer.yearsActive < 7) return 'Established Act';
    if (performer.yearsActive < 12) return 'Veteran Performer';
    return 'Industry Legend';
  };
  // Get follower growth indicator
  const getFollowerGrowth = () => {
    // Simulate growth based on trending score
    const growth = performer.trendingScore > 80 ? 'fast' : performer.trendingScore > 70 ? 'steady' : 'slow';
    return {
      growth,
      percentage: growth === 'fast' ? '+12%' : growth === 'steady' ? '+5%' : '+2%',
      class: growth === 'fast' ? 'text-green-500' : growth === 'steady' ? 'text-blue-500' : 'text-gray-500'
    };
  };
  // Calculate merchandise stats
  const merchStats = {
    total: merchandise.length,
    apparel: merchandise.filter(item => item.category === 'apparel').length,
    music: merchandise.filter(item => item.category === 'music').length,
    accessories: merchandise.filter(item => item.category === 'accessories').length,
    exclusive: merchandise.filter(item => item.category === 'exclusive').length,
    new: merchandise.filter(item => item.isNew).length
  };
  return <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-64 md:h-80 lg:h-96 w-full overflow-hidden">
          <img src={performer.profileImage} alt={`${performer.name} cover`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6">
            {/* Profile Photo */}
            <div className="relative -mt-16 md:-mt-20 lg:-mt-24 z-10">
              <div className="h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 rounded-full border-4 border-white overflow-hidden bg-white">
                <img src={performer.profileImage} alt={performer.name} className="w-full h-full object-cover" />
              </div>
            </div>
            {/* Profile Text Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  {performer.name}
                </h1>
                {performer.isVerified && <div className="tooltip" data-tip="Verified Performer">
                    <CheckCircleIcon className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
                  </div>}
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-2 text-sm md:text-base">
                <div className="flex gap-1 flex-wrap">
                  {performer.genres.slice(0, 2).map((genre, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {genre}
                    </span>)}
                </div>
                <span className="text-gray-200">•</span>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{performer.homeCity}</span>
                </div>
                <span className="text-gray-200">•</span>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{getYearsActiveString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1">{performer.rating}</span>
                  <span className="ml-1 text-gray-300">
                    ({performer.reviewCount})
                  </span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  <span>
                    {performer.followerCount.toLocaleString()} followers
                  </span>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2 mt-2 md:mt-0">
              <button onClick={toggleFollow} className={`px-4 py-2 rounded-md font-medium ${isFollowing ? 'bg-white text-indigo-600 hover:bg-gray-100' : 'bg-indigo-600 text-white hover:bg-indigo-700'} flex items-center`}>
                {isFollowing ? <>
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Following
                  </> : <>
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Follow
                  </>}
              </button>
              <div className="flex items-center">
                <button className="p-2 rounded-full bg-white/20 hover:bg-white/30">
                  <ShareIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions Bar (Desktop) */}
      <div className="hidden md:flex bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-14">
            {/* Left Side - Quick Stats */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <UsersIcon className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm">
                  {performer.followerCount.toLocaleString()} followers
                </span>
                <span className={`ml-1 text-xs ${getFollowerGrowth().class}`}>
                  {getFollowerGrowth().percentage}
                </span>
              </div>
              <div className="flex items-center">
                <MusicIcon className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm">{performer.showsPlayed}+ shows</span>
              </div>
              <div className="flex items-center">
                <StarIcon className="h-4 w-4 text-gray-500 mr-1" />
                <span className="text-sm">{performer.rating} rating</span>
              </div>
            </div>
            {/* Right Side - Quick Actions */}
            <div className="flex items-center space-x-3">
              {isFollowing && <button className="flex items-center text-sm text-gray-700 hover:text-indigo-600">
                  <MessageCircleIcon className="h-4 w-4 mr-1" />
                  Message
                </button>}
              <button className="flex items-center text-sm text-gray-700 hover:text-indigo-600">
                <BellIcon className="h-4 w-4 mr-1" />
                Notify Me
              </button>
              <button className="flex items-center text-sm text-gray-700 hover:text-indigo-600">
                <MoreHorizontalIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Quick Actions */}
      <div className="flex md:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="w-full">
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center">
              <button onClick={toggleFollow} className={`px-3 py-1.5 rounded-md text-sm font-medium ${isFollowing ? 'bg-gray-100 text-indigo-600' : 'bg-indigo-600 text-white'} flex items-center`}>
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-1.5 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-gray-100">
                <MessageCircleIcon className="h-5 w-5" />
              </button>
              <button className="p-1.5 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-gray-100">
                <ShareIcon className="h-5 w-5" />
              </button>
              <button className="p-1.5 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-gray-100">
                <MoreHorizontalIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto hide-scrollbar">
            <button onClick={() => handleTabChange(ProfileTab.Overview)} className={`whitespace-nowrap px-4 py-4 text-sm font-medium border-b-2 ${activeTab === ProfileTab.Overview ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Overview
            </button>
            <button onClick={() => handleTabChange(ProfileTab.UpcomingShows)} className={`whitespace-nowrap px-4 py-4 text-sm font-medium border-b-2 ${activeTab === ProfileTab.UpcomingShows ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Upcoming Shows
              <span className="ml-1 bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">
                {performer.upcomingShows.length}
              </span>
            </button>
            <button onClick={() => handleTabChange(ProfileTab.PastShows)} className={`whitespace-nowrap px-4 py-4 text-sm font-medium border-b-2 ${activeTab === ProfileTab.PastShows ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Past Shows
            </button>
            <button onClick={() => handleTabChange(ProfileTab.Media)} className={`whitespace-nowrap px-4 py-4 text-sm font-medium border-b-2 ${activeTab === ProfileTab.Media ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Media
            </button>
            <button onClick={() => handleTabChange(ProfileTab.Merchandise)} className={`whitespace-nowrap px-4 py-4 text-sm font-medium border-b-2 ${activeTab === ProfileTab.Merchandise ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Merchandise
              {merchStats.new > 0 && <span className="ml-1 bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full text-xs">
                  New
                </span>}
            </button>
            <button onClick={() => handleTabChange(ProfileTab.Reviews)} className={`whitespace-nowrap px-4 py-4 text-sm font-medium border-b-2 ${activeTab === ProfileTab.Reviews ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Reviews
              <span className="ml-1 text-yellow-500">{overallRating}★</span>
            </button>
            <button onClick={() => handleTabChange(ProfileTab.FanZone)} className={`whitespace-nowrap px-4 py-4 text-sm font-medium border-b-2 ${activeTab === ProfileTab.FanZone ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Fan Zone
            </button>
            <button onClick={() => handleTabChange(ProfileTab.About)} className={`whitespace-nowrap px-4 py-4 text-sm font-medium border-b-2 ${activeTab === ProfileTab.About ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              About
            </button>
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Overview Tab */}
            {activeTab === ProfileTab.Overview && <div className="space-y-8">
                {/* Quick Stats Bar */}
                <div className="bg-white rounded-lg shadow-sm p-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="flex flex-col items-center justify-center p-2 border-r border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Followers</div>
                    <div className="flex items-center">
                      <span className="text-xl font-bold">
                        {performer.followerCount.toLocaleString()}
                      </span>
                      <span className={`ml-1 text-xs ${getFollowerGrowth().class}`}>
                        {getFollowerGrowth().percentage}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 border-r border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">
                      Shows Played
                    </div>
                    <div className="text-xl font-bold">
                      {performer.showsPlayed}+
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 border-r border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">Experience</div>
                    <div className="text-xl font-bold">
                      {performer.yearsActive} yrs
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 border-r border-gray-100">
                    <div className="text-sm text-gray-500 mb-1">
                      Response Rate
                    </div>
                    <div className="text-xl font-bold">95%</div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2">
                    <div className="text-sm text-gray-500 mb-1">Next Show</div>
                    <div className="text-lg font-bold">
                      {performer.upcomingShows.length > 0 ? formatDate(performer.upcomingShows[0].date) : 'TBA'}
                    </div>
                  </div>
                </div>
                {/* Bio Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-bold mb-4">
                    About {performer.name}
                  </h2>
                  <div className={isBioExpanded ? '' : 'line-clamp-3'}>
                    <p className="text-gray-700">{performer.bio}</p>
                    {/* Extended bio content - only visible when expanded */}
                    {isBioExpanded && <div className="mt-4 space-y-4">
                        <p className="text-gray-700">
                          With {performer.yearsActive} years of experience in
                          the music industry, {performer.name} has established a
                          reputation for delivering unforgettable performances
                          that blend technical mastery with emotional depth.
                          Their journey began in{' '}
                          {new Date().getFullYear() - performer.yearsActive} and
                          has since evolved into a distinctive sound that
                          resonates with audiences across generations.
                        </p>
                        <p className="text-gray-700">
                          {performer.name} has performed at numerous venues
                          throughout Florida and beyond, from intimate local
                          spots to major festivals. Their commitment to musical
                          excellence and audience connection has earned them a
                          dedicated following of{' '}
                          {performer.followerCount.toLocaleString()} fans who
                          appreciate their authentic approach and engaging stage
                          presence.
                        </p>
                        <p className="text-gray-700">
                          Whether performing original compositions or
                          reimagining familiar favorites, {performer.name}{' '}
                          brings a unique perspective and passionate energy to
                          every show. Their versatile repertoire spans multiple
                          influences while maintaining a cohesive artistic
                          vision that continues to evolve with each performance.
                        </p>
                      </div>}
                  </div>
                  <button onClick={() => setIsBioExpanded(!isBioExpanded)} className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    {isBioExpanded ? 'Show Less' : 'Read More'}
                  </button>
                  {/* Highlights */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-md p-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Highlights
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            <StarIcon className="h-5 w-5" />
                          </div>
                          <p className="ml-2 text-sm text-gray-700">
                            {getExperienceLevel()} with {performer.yearsActive}{' '}
                            years of experience
                          </p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            <StarIcon className="h-5 w-5" />
                          </div>
                          <p className="ml-2 text-sm text-gray-700">
                            Performed at{' '}
                            {Math.floor(performer.showsPlayed * 0.8)}+ venues
                            across Florida
                          </p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            <StarIcon className="h-5 w-5" />
                          </div>
                          <p className="ml-2 text-sm text-gray-700">
                            Featured at Clearwater Music Festival 2023
                          </p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            <StarIcon className="h-5 w-5" />
                          </div>
                          <p className="ml-2 text-sm text-gray-700">
                            {performer.rating} star average from{' '}
                            {performer.reviewCount} reviews
                          </p>
                        </li>
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-md p-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Specialties
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {performer.genres.map((genre, index) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {genre}
                          </span>)}
                        {performer.hasOriginalMusic && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Original Music
                          </span>}
                        {performer.takesRequests && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Takes Requests
                          </span>}
                        {performer.availableForPrivateEvents && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Private Events
                          </span>}
                        {performer.offersMeetAndGreet && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Meet & Greet
                          </span>}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Latest Updates */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-bold mb-4">Latest Updates</h2>
                  {/* Pinned Announcement */}
                  <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img src={performer.profileImage} alt={performer.name} className="h-full w-full object-cover" />
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {performer.name}
                            </p>
                            {performer.isVerified && <CheckCircleIcon className="h-4 w-4 text-blue-500 ml-1" />}
                            <span className="ml-2 text-xs text-gray-500">
                              2 days ago
                            </span>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            Pinned
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-700">
                            Excited to announce our upcoming summer tour! Check
                            out all the dates and venues below. Can't wait to
                            see you all there! 🎵🎸
                          </p>
                          <div className="mt-2 flex">
                            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                              See Tour Dates
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Recent Updates */}
                  <div className="space-y-6">
                    {/* New Show Announcement */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img src={performer.profileImage} alt={performer.name} className="h-full w-full object-cover" />
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {performer.name}
                          </p>
                          {performer.isVerified && <CheckCircleIcon className="h-4 w-4 text-blue-500 ml-1" />}
                          <span className="ml-2 text-xs text-gray-500">
                            5 days ago
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-700">
                            Just added a new show at Capitol Theatre on July
                            15th! Tickets on sale now. This is going to be a
                            special one!
                          </p>
                          <div className="mt-2 bg-gray-50 border border-gray-200 rounded-md p-3">
                            <div className="flex items-center">
                              <CalendarIcon className="h-5 w-5 text-gray-400" />
                              <div className="ml-2">
                                <p className="text-sm font-medium text-gray-900">
                                  New Show Added
                                </p>
                                <p className="text-xs text-gray-500">
                                  July 15, 2024 • Capitol Theatre
                                </p>
                              </div>
                              <button className="ml-auto text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded">
                                Get Tickets
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* New Media Post */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img src={performer.profileImage} alt={performer.name} className="h-full w-full object-cover" />
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {performer.name}
                          </p>
                          {performer.isVerified && <CheckCircleIcon className="h-4 w-4 text-blue-500 ml-1" />}
                          <span className="ml-2 text-xs text-gray-500">
                            1 week ago
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-700">
                            Check out these photos from our last show at Jannus
                            Live! What an amazing crowd!
                          </p>
                          <div className="mt-2 grid grid-cols-3 gap-2">
                            <div className="h-24 rounded-md overflow-hidden">
                              <img src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="Concert photo 1" className="h-full w-full object-cover" />
                            </div>
                            <div className="h-24 rounded-md overflow-hidden">
                              <img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="Concert photo 2" className="h-full w-full object-cover" />
                            </div>
                            <div className="h-24 rounded-md overflow-hidden">
                              <img src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="Concert photo 3" className="h-full w-full object-cover" />
                            </div>
                          </div>
                          <div className="mt-2 flex">
                            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                              View All Photos
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* New Merch Announcement */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img src={performer.profileImage} alt={performer.name} className="h-full w-full object-cover" />
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {performer.name}
                          </p>
                          {performer.isVerified && <CheckCircleIcon className="h-4 w-4 text-blue-500 ml-1" />}
                          <span className="ml-2 text-xs text-gray-500">
                            2 weeks ago
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-700">
                            New merch just dropped! Limited edition summer tour
                            shirts now available in our store.
                          </p>
                          <div className="mt-2 bg-gray-50 border border-gray-200 rounded-md p-3">
                            <div className="flex items-center">
                              <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
                              <div className="ml-2">
                                <p className="text-sm font-medium text-gray-900">
                                  New Merchandise
                                </p>
                                <p className="text-xs text-gray-500">
                                  Summer Tour T-Shirt • $25.00
                                </p>
                              </div>
                              <button className="ml-auto text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded">
                                Shop Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      View All Updates
                    </button>
                  </div>
                </div>
                {/* Upcoming Shows Preview */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Upcoming Shows</h2>
                    <button onClick={() => handleTabChange(ProfileTab.UpcomingShows)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                      View All
                      <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {performer.upcomingShows.slice(0, 3).map((show, index) => <div key={index} className="flex items-center border border-gray-200 rounded-md p-3 hover:border-indigo-300 transition-colors">
                        <div className="flex-shrink-0 w-16 text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {new Date(show.date).getDate()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(show.date).toLocaleDateString('en-US', {
                        month: 'short'
                      })}
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="font-medium text-gray-900">
                            {show.venue}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatTime(show.date)} • Clearwater, FL
                          </div>
                        </div>
                        <div className="ml-4">
                          {show.ticketsAvailable ? <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded">
                              Get Tickets
                            </button> : <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                              Free Event
                            </span>}
                        </div>
                      </div>)}
                  </div>
                </div>
                {/* Featured Media */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Featured Media</h2>
                    <button onClick={() => handleTabChange(ProfileTab.Media)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                      View All
                      <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {/* Featured Video */}
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                      <img src={media.videos[0]?.thumbnail || performer.profileImage} alt="Featured video thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="h-16 w-16 rounded-full bg-indigo-600/90 hover:bg-indigo-700 flex items-center justify-center">
                          <PlayIcon className="h-8 w-8 text-white" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white font-medium">
                          {media.videos[0]?.title || 'Latest Performance Highlights'}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {media.videos[0]?.views.toLocaleString() || '5.2K'}{' '}
                          views
                        </p>
                      </div>
                    </div>
                    {/* Photo Gallery */}
                    <div>
                      <h3 className="text-md font-medium mb-3">
                        Recent Photos
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {media.photos.slice(0, 6).map((photo, index) => <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer" onClick={() => handleMediaItemClick(photo, 'photos')}>
                            <img src={photo.thumbnail} alt={photo.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                          </div>)}
                      </div>
                    </div>
                    {/* Audio Player */}
                    <div>
                      <h3 className="text-md font-medium mb-3">
                        Featured Tracks
                      </h3>
                      <div className="space-y-2">
                        {media.audio.slice(0, 3).map((track, index) => <div key={index} className="flex items-center border border-gray-200 rounded-md p-2 hover:bg-gray-50">
                            <button className="h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center flex-shrink-0">
                              <PlayIcon className="h-4 w-4 text-white" />
                            </button>
                            <div className="ml-3 flex-1">
                              <div className="font-medium text-gray-900 text-sm">
                                {track.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {track.album} • {track.duration}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {track.plays.toLocaleString()} plays
                            </div>
                          </div>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
            {/* Upcoming Shows Tab */}
            {activeTab === ProfileTab.UpcomingShows && <div className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <label htmlFor="date-range" className="block text-sm font-medium text-gray-700 mb-1">
                        Date Range
                      </label>
                      <select id="date-range" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="all">
                        <option value="this-week">This Week</option>
                        <option value="this-month">This Month</option>
                        <option value="next-3-months">Next 3 Months</option>
                        <option value="all">All Upcoming</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <select id="location" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="all">
                        <option value="all">All Locations</option>
                        <option value="clearwater">Clearwater, FL</option>
                        <option value="tampa">Tampa, FL</option>
                        <option value="st-petersburg">
                          St. Petersburg, FL
                        </option>
                        <option value="orlando">Orlando, FL</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="venue-type" className="block text-sm font-medium text-gray-700 mb-1">
                        Venue Type
                      </label>
                      <select id="venue-type" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="all">
                        <option value="all">All Venues</option>
                        <option value="bars">Bars & Clubs</option>
                        <option value="theaters">Theaters</option>
                        <option value="arenas">Arenas & Stadiums</option>
                        <option value="festivals">Festivals</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="ticket-status" className="block text-sm font-medium text-gray-700 mb-1">
                        Ticket Status
                      </label>
                      <select id="ticket-status" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="all">
                        <option value="all">All Shows</option>
                        <option value="available">Tickets Available</option>
                        <option value="sold-out">Sold Out</option>
                        <option value="free">Free Events</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Show Listings */}
                <div className="space-y-6">
                  {performer.upcomingShows.map((show, index) => <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="md:flex">
                        {/* Date Column */}
                        <div className="bg-indigo-50 p-4 md:w-36 flex flex-col items-center justify-center">
                          <div className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">
                            {new Date(show.date).toLocaleDateString('en-US', {
                        weekday: 'short'
                      })}
                          </div>
                          <div className="text-3xl font-bold text-gray-900 my-1">
                            {new Date(show.date).getDate()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(show.date).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                          </div>
                        </div>
                        {/* Details Column */}
                        <div className="p-4 md:p-6 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {show.venue}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <span>Clearwater, FL</span>
                                <span className="mx-2">•</span>
                                <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <span>{formatTime(show.date)}</span>
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                              {show.ticketsAvailable ? <div className="flex flex-col items-end">
                                  <div className="text-sm text-gray-600 mb-1">
                                    Tickets from
                                  </div>
                                  <div className="text-lg font-bold text-gray-900 mb-2">
                                    $25.00
                                  </div>
                                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded">
                                    Get Tickets
                                  </button>
                                </div> : <div className="flex flex-col items-end">
                                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded mb-2">
                                    Free Event
                                  </span>
                                  <button className="px-4 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-sm font-medium rounded">
                                    RSVP
                                  </button>
                                </div>}
                            </div>
                          </div>
                          <div className="mt-4 border-t border-gray-100 pt-4">
                            <div className="flex flex-wrap items-center gap-4">
                              <div>
                                <div className="text-xs text-gray-500 mb-1">
                                  Age Restrictions
                                </div>
                                <div className="text-sm font-medium">
                                  {index % 3 === 0 ? 'All Ages' : '21+'}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 mb-1">
                                  Event Type
                                </div>
                                <div className="text-sm font-medium">
                                  {index % 2 === 0 ? 'Headline Show' : 'Festival Performance'}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="text-xs text-gray-500 mb-1">
                                  Also Featuring
                                </div>
                                <div className="text-sm font-medium">
                                  {index === 0 ? 'The Local Openers, New Band' : index === 1 ? 'Solo Acoustic Act' : 'Various Artists'}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <button className="flex items-center text-sm text-gray-600 hover:text-indigo-600">
                              <BellIcon className="h-4 w-4 mr-1" />
                              Set Reminder
                            </button>
                            <button className="flex items-center text-sm text-gray-600 hover:text-indigo-600">
                              <ShareIcon className="h-4 w-4 mr-1" />
                              Share Event
                            </button>
                            <button className="flex items-center text-sm text-gray-600 hover:text-indigo-600">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              View Map
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
                {/* Tour Visualization */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Tour Schedule</h2>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded">
                        Map View
                      </button>
                      <button className="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded flex items-center">
                        <DownloadIcon className="h-4 w-4 mr-1" />
                        Export Calendar
                      </button>
                    </div>
                  </div>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">
                      Tour map visualization would appear here
                    </p>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <button className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                      <BellIcon className="h-4 w-4 mr-1" />
                      Follow Tour for Updates
                    </button>
                  </div>
                </div>
              </div>}
            {/* Past Shows Tab */}
            {activeTab === ProfileTab.PastShows && <div className="space-y-6">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <label htmlFor="year-selector" className="block text-sm font-medium text-gray-700 mb-1">
                        Year
                      </label>
                      <select id="year-selector" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="all">
                        <option value="all">All Years</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label htmlFor="search-past-shows" className="block text-sm font-medium text-gray-700 mb-1">
                        Search Past Shows
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <SearchIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <input type="text" id="search-past-shows" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Search by venue or city..." />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="sort-past-shows" className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                      </label>
                      <select id="sort-past-shows" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="newest">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="most-attended">Most Attended</option>
                        <option value="top-rated">Top Rated</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Past Shows Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pastShows.slice(0, 12).map((show, index) => <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="text-sm text-gray-500">
                              {formatDateWithYear(show.date)}
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {show.venue}
                            </h3>
                            <div className="text-sm text-gray-600">
                              {show.city}
                            </div>
                          </div>
                          <div className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-700">
                            {show.attendance}+ attended
                          </div>
                        </div>
                        <div className="flex items-center mt-4 space-x-4">
                          {show.hasPhotos && <button className="flex items-center text-xs text-indigo-600 hover:text-indigo-800">
                              <CameraIcon className="h-3 w-3 mr-1" />
                              Photos
                            </button>}
                          {show.hasReviews && <button className="flex items-center text-xs text-indigo-600 hover:text-indigo-800">
                              <StarIcon className="h-3 w-3 mr-1" />
                              {show.reviewCount} Reviews ({show.averageRating}★)
                            </button>}
                          <button className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 ml-auto">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>)}
                </div>
                {/* Load More Button */}
                <div className="text-center">
                  <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Load More Shows
                  </button>
                </div>
                {/* Statistics */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-bold mb-4">
                    Performance Statistics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-medium mb-2">
                        Shows by Year
                      </h3>
                      <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end justify-between">
                        {[2021, 2022, 2023, 2024].map(year => {
                      // Calculate percentage height based on number of shows
                      const yearShows = pastShows.filter(show => new Date(show.date).getFullYear() === year).length;
                      const percentage = Math.max(10, yearShows / 20 * 100);
                      return <div key={year} className="flex flex-col items-center">
                              <div className="w-12 bg-indigo-500 rounded-t-sm" style={{
                          height: `${percentage}%`
                        }}></div>
                              <div className="mt-2 text-sm font-medium">
                                {year}
                              </div>
                              <div className="text-xs text-gray-500">
                                {yearShows} shows
                              </div>
                            </div>;
                    })}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md font-medium mb-2">
                        Performance Metrics
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Cities Played
                            </span>
                            <span className="text-sm font-medium text-indigo-600">
                              12
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{
                          width: '60%'
                        }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Venues Played
                            </span>
                            <span className="text-sm font-medium text-indigo-600">
                              24
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{
                          width: '80%'
                        }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Total Attendance
                            </span>
                            <span className="text-sm font-medium text-indigo-600">
                              12,450+
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{
                          width: '75%'
                        }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Average Rating
                            </span>
                            <span className="text-sm font-medium text-indigo-600">
                              4.8/5.0
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{
                          width: '95%'
                        }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
            {/* Media Tab */}
            {activeTab === ProfileTab.Media && <div className="space-y-6">
                {/* Media Categories Tabs */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                      <button onClick={() => setSelectedMediaType('photos')} className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${selectedMediaType === 'photos' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Photos ({media.photos.length})
                      </button>
                      <button onClick={() => setSelectedMediaType('videos')} className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${selectedMediaType === 'videos' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Videos ({media.videos.length})
                      </button>
                      <button onClick={() => setSelectedMediaType('audio')} className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${selectedMediaType === 'audio' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Audio ({media.audio.length})
                      </button>
                      <button className="py-4 px-6 text-center border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 text-sm font-medium">
                        Press Kit
                        <span className="ml-1 bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full text-xs">
                          Premium
                        </span>
                      </button>
                    </nav>
                  </div>
                  {/* Photos Content */}
                  {selectedMediaType === 'photos' && <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-4">
                          <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="all">
                            <option value="all">All Photos</option>
                            <option value="official">Official Photos</option>
                            <option value="fan">Fan Submitted</option>
                            <option value="recent">Most Recent</option>
                          </select>
                          <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="grid">
                            <option value="grid">Grid View</option>
                            <option value="albums">Album View</option>
                            <option value="timeline">Timeline</option>
                          </select>
                        </div>
                        <button className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                          <DownloadIcon className="h-4 w-4 mr-1" />
                          Download All
                        </button>
                      </div>
                      {/* Photo Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {media.photos.map((photo, index) => <div key={index} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer" onClick={() => handleMediaItemClick(photo, 'photos')}>
                            <img src={photo.thumbnail} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-3">
                                <div className="text-white text-sm font-medium">
                                  {photo.title}
                                </div>
                                <div className="text-white/80 text-xs">
                                  {formatDateWithYear(photo.date)}
                                </div>
                              </div>
                            </div>
                            {photo.isAlbumCover && <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded">
                                Album Cover
                              </div>}
                            {photo.isFanSubmitted && <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded">
                                Fan Photo
                              </div>}
                          </div>)}
                      </div>
                      {/* Load More Button */}
                      <div className="mt-6 text-center">
                        <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          Load More Photos
                        </button>
                      </div>
                    </div>}
                  {/* Videos Content */}
                  {selectedMediaType === 'videos' && <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-4">
                          <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="all">
                            <option value="all">All Videos</option>
                            <option value="music-videos">Music Videos</option>
                            <option value="live">Live Performances</option>
                            <option value="behind-scenes">
                              Behind the Scenes
                            </option>
                            <option value="interviews">Interviews</option>
                          </select>
                          <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="newest">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="most-viewed">Most Viewed</option>
                          </select>
                        </div>
                      </div>
                      {/* Video Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {media.videos.map((video, index) => <div key={index} className="bg-gray-100 rounded-lg overflow-hidden">
                            <div className="relative aspect-video cursor-pointer">
                              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <button className="h-12 w-12 rounded-full bg-indigo-600/90 hover:bg-indigo-700 flex items-center justify-center">
                                  <PlayIcon className="h-6 w-6 text-white" />
                                </button>
                              </div>
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                                {video.duration}
                              </div>
                              {video.type === 'music-video' && <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                                  Music Video
                                </div>}
                              {video.type === 'behind-scenes' && <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded">
                                  Behind the Scenes
                                </div>}
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium text-gray-900">
                                {video.title}
                              </h3>
                              <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
                                <span>{formatDateWithYear(video.date)}</span>
                                <span>
                                  {video.views.toLocaleString()} views
                                </span>
                              </div>
                            </div>
                          </div>)}
                      </div>
                      {/* Load More Button */}
                      <div className="mt-6 text-center">
                        <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          Load More Videos
                        </button>
                      </div>
                    </div>}
                  {/* Audio Content */}
                  {selectedMediaType === 'audio' && <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-4">
                          <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="all">
                            <option value="all">All Tracks</option>
                            <option value="original">Original Tracks</option>
                            <option value="live">Live Recordings</option>
                            <option value="unreleased">Unreleased</option>
                          </select>
                          <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="newest">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="most-played">Most Played</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="flex items-center text-sm text-gray-600 hover:text-indigo-600 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                            </svg>
                            Play All
                          </button>
                          <button className="flex items-center text-sm text-gray-600 hover:text-indigo-600 font-medium">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                            </svg>
                            Save Playlist
                          </button>
                        </div>
                      </div>
                      {/* Audio Player */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                          <button className="h-12 w-12 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center flex-shrink-0">
                            <PlayIcon className="h-6 w-6 text-white" />
                          </button>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {media.audio[0]?.title || 'Featured Track'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {media.audio[0]?.album || 'Latest Album'}
                                </p>
                              </div>
                              <div className="text-sm text-gray-500">
                                {media.audio[0]?.duration || '3:45'} /{' '}
                                {media.audio[0]?.duration || '3:45'}
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div className="bg-indigo-600 h-1.5 rounded-full" style={{
                            width: '30%'
                          }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Track List */}
                      <div className="space-y-2">
                        {media.audio.map((track, index) => <div key={index} className="flex items-center border border-gray-200 rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                            <div className="flex-shrink-0 w-8 text-center text-gray-500">
                              {index + 1}
                            </div>
                            <button className="h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center flex-shrink-0 ml-2">
                              <PlayIcon className="h-4 w-4 text-white" />
                            </button>
                            <div className="ml-3 flex-1">
                              <div className="font-medium text-gray-900 text-sm">
                                {track.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {track.album} • {formatDateWithYear(track.date)}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mr-4">
                              {track.duration}
                            </div>
                            <div className="text-xs text-gray-500">
                              {track.plays.toLocaleString()} plays
                            </div>
                            {track.isExclusive && <div className="ml-2 bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">
                                Exclusive
                              </div>}
                          </div>)}
                      </div>
                      {/* Streaming Services */}
                      <div className="mt-8 border-t border-gray-200 pt-6">
                        <h3 className="text-md font-medium mb-4">
                          Also Available On
                        </h3>
                        <div className="flex flex-wrap gap-4">
                          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Spotify
                          </button>
                          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                            </svg>
                            Apple Music
                          </button>
                          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            SoundCloud
                          </button>
                          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            YouTube Music
                          </button>
                        </div>
                      </div>
                    </div>}
                </div>
              </div>}
            {/* Merchandise Tab */}
            {activeTab === ProfileTab.Merchandise && <div className="space-y-6">
                {/* Store Header */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-40 bg-indigo-600 relative">
                    <img src={performer.profileImage} alt="Merchandise banner" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h2 className="text-3xl font-bold text-white">
                        Official Merchandise
                      </h2>
                    </div>
                  </div>
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setActiveMerchCategory('all')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeMerchCategory === 'all' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                          All Items ({merchStats.total})
                        </button>
                        <button onClick={() => setActiveMerchCategory('apparel')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeMerchCategory === 'apparel' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                          Apparel ({merchStats.apparel})
                        </button>
                        <button onClick={() => setActiveMerchCategory('music')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeMerchCategory === 'music' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                          Music ({merchStats.music})
                        </button>
                        <button onClick={() => setActiveMerchCategory('accessories')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeMerchCategory === 'accessories' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                          Accessories ({merchStats.accessories})
                        </button>
                        <button onClick={() => setActiveMerchCategory('exclusive')} className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeMerchCategory === 'exclusive' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                          Exclusive ({merchStats.exclusive})
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <select className="block pl-3 pr-10 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md" defaultValue="newest">
                          <option value="newest">Newest</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="best-selling">Best Selling</option>
                        </select>
                        <button className="text-sm text-indigo-600 hover:text-indigo-800">
                          Size Guide
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {merchandise.filter(item => activeMerchCategory === 'all' || item.category === activeMerchCategory).map((item, index) => <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden group">
                        <div className="relative aspect-square bg-gray-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          {item.isNew && <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              New
                            </div>}
                          {item.isFeatured && <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              Featured
                            </div>}
                          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button className="px-4 py-2 bg-white text-indigo-600 rounded-md font-medium text-sm shadow-sm hover:bg-gray-50">
                              Quick Shop
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-lg font-bold text-gray-900">
                              ${item.price.toFixed(2)}
                            </div>
                            {item.reviewCount > 0 && <div className="flex items-center">
                                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm text-gray-700">
                                  {item.rating}
                                </span>
                                <span className="ml-1 text-xs text-gray-500">
                                  ({item.reviewCount})
                                </span>
                              </div>}
                          </div>
                          {item.sizes && <div className="mb-3">
                              <div className="text-sm text-gray-500 mb-1">
                                Available Sizes:
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {item.sizes.map((size, sizeIndex) => <span key={sizeIndex} className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${item.availableSizes?.includes(size) ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer' : 'bg-gray-100 text-gray-400 line-through cursor-not-allowed'}`}>
                                    {size}
                                  </span>)}
                              </div>
                            </div>}
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              {item.stock <= 5 ? <span className="text-red-600">
                                  Only {item.stock} left
                                </span> : <span>In Stock</span>}
                            </div>
                            <button className="flex items-center text-indigo-600 hover:text-indigo-800">
                              <ShoppingCartIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>)}
                </div>
                {/* Bundle Deals */}
                <div className="bg-indigo-50 rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-bold mb-4">Bundle Deals</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900">
                          Fan Starter Pack
                        </h3>
                        <p className="text-sm text-gray-600">
                          T-shirt, sticker pack, and digital album
                        </p>
                      </div>
                      <div className="p-4 flex items-center">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="text-lg font-bold text-gray-900">
                              $35.00
                            </span>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              $45.00
                            </span>
                            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                              Save $10
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Free shipping on this bundle
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900">VIP Bundle</h3>
                        <p className="text-sm text-gray-600">
                          Signed vinyl, exclusive t-shirt, and backstage pass
                        </p>
                      </div>
                      <div className="p-4 flex items-center">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="text-lg font-bold text-gray-900">
                              $99.00
                            </span>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              $140.00
                            </span>
                            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                              Save $41
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            Limited quantities available
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Shipping Info */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-bold mb-4">
                    Shipping & Policies
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Shipping
                      </h3>
                      <p className="text-sm text-gray-600">
                        Orders typically ship within 1-3 business days. Standard
                        shipping (5-7 days) and expedited options available.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Returns
                      </h3>
                      <p className="text-sm text-gray-600">
                        Unworn/unused items may be returned within 30 days.
                        Custom and sale items are final sale.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Payment Methods
                      </h3>
                      <p className="text-sm text-gray-600">
                        We accept credit cards, PayPal, Apple Pay, and Google
                        Pay. All transactions are secure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>}
            {/* Reviews Tab */}
            {activeTab === ProfileTab.Reviews && <div className="space-y-6">
                {/* Review Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        {overallRating}
                      </div>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} className={`h-5 w-5 ${star <= Math.round(parseFloat(overallRating)) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Based on {reviews.length} reviews
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Rating Breakdown
                      </h3>
                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map(rating => <div key={rating} className="flex items-center">
                            <div className="w-16 text-sm text-gray-600">
                              {rating} stars
                            </div>
                            <div className="flex-1 mx-4">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-yellow-400 h-2 rounded-full" style={{
                            width: `${ratingBreakdown[rating as keyof typeof ratingBreakdown]}%`
                          }}></div>
                              </div>
                            </div>
                            <div className="w-12 text-sm text-gray-600 text-right">
                              {ratingBreakdown[rating as keyof typeof ratingBreakdown]}
                              %
                            </div>
                          </div>)}
                      </div>
                      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">
                            Performance
                          </div>
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-gray-900 mr-2">
                              4.9
                            </span>
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">
                            Stage Presence
                          </div>
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-gray-900 mr-2">
                              4.7
                            </span>
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">
                            Fan Interaction
                          </div>
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-gray-900 mr-2">
                              4.8
                            </span>
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">
                            Value
                          </div>
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-gray-900 mr-2">
                              4.6
                            </span>
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Review Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <label htmlFor="review-sort" className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                      </label>
                      <select id="review-sort" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" value={activeReviewFilter} onChange={e => setActiveReviewFilter(e.target.value)}>
                        <option value="recent">Most Recent</option>
                        <option value="helpful">Most Helpful</option>
                        <option value="highest">Highest Rated</option>
                        <option value="lowest">Lowest Rated</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="review-rating" className="block text-sm font-medium text-gray-700 mb-1">
                        Filter by Rating
                      </label>
                      <select id="review-rating" className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="all">
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Show Only
                      </label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" defaultChecked />
                          <span className="ml-2 text-sm text-gray-700">
                            Verified Attendees
                          </span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                          <span className="ml-2 text-sm text-gray-700">
                            With Photos
                          </span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                          <span className="ml-2 text-sm text-gray-700">
                            With Videos
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.map((review, index) => <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img src={review.reviewer.avatar} alt={review.reviewer.name} className="h-full w-full object-cover" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium text-gray-900">
                                  {review.reviewer.name}
                                </h3>
                                {review.reviewer.isVerified && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Verified Attendee
                                  </span>}
                              </div>
                              <div className="text-sm text-gray-500">
                                {review.reviewer.showsAttended}{' '}
                                {review.reviewer.showsAttended === 1 ? 'show' : 'shows'}{' '}
                                attended
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDateWithYear(review.reviewDate)}
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center mb-2">
                              {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                              <span className="ml-2 text-sm text-gray-700">
                                for show at {review.venue}
                              </span>
                            </div>
                            <p className="text-gray-700">{review.reviewText}</p>
                            {/* Photo/Video Attachments */}
                            {(review.hasPhotos || review.hasVideos) && <div className="mt-3 flex gap-2">
                                {review.hasPhotos && <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                                    <img src={`https://source.unsplash.com/random/200x200/?concert,${index}`} alt="Review photo" className="h-full w-full object-cover" />
                                  </div>}
                                {review.hasVideos && <div className="h-20 w-20 rounded-md overflow-hidden bg-gray-100 relative">
                                    <img src={`https://source.unsplash.com/random/200x200/?concert,${index + 100}`} alt="Review video thumbnail" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="h-8 w-8 rounded-full bg-black/50 flex items-center justify-center">
                                        <PlayIcon className="h-4 w-4 text-white" />
                                      </div>
                                    </div>
                                  </div>}
                              </div>}
                            {/* Helpful Buttons */}
                            <div className="mt-4 flex items-center">
                              <span className="text-sm text-gray-500 mr-4">
                                Was this helpful?
                              </span>
                              <button className="flex items-center text-sm text-gray-700 hover:text-indigo-600 mr-4">
                                <ThumbsUpIcon className="h-4 w-4 mr-1" />
                                Yes ({review.helpfulCount})
                              </button>
                              <button className="flex items-center text-sm text-gray-700 hover:text-indigo-600">
                                <ThumbsDownIcon className="h-4 w-4 mr-1" />
                                No
                              </button>
                              <button className="flex items-center text-sm text-gray-700 hover:text-indigo-600 ml-auto">
                                <FlagIcon className="h-4 w-4 mr-1" />
                                Report
                              </button>
                            </div>
                            {/* Performer Reply */}
                            {review.hasPerformerReply && <div className="mt-4 bg-gray-50 rounded-md p-4">
                                <div className="flex items-center">
                                  <div className="h-6 w-6 rounded-full overflow-hidden">
                                    <img src={performer.profileImage} alt={performer.name} className="h-full w-full object-cover" />
                                  </div>
                                  <div className="ml-2 flex items-center">
                                    <span className="font-medium text-gray-900">
                                      {performer.name}
                                    </span>
                                    {performer.isVerified && <CheckCircleIcon className="h-4 w-4 text-blue-500 ml-1" />}
                                    <span className="ml-2 text-xs text-gray-500">
                                      Performer
                                    </span>
                                  </div>
                                </div>
                                <p className="mt-2 text-sm text-gray-700">
                                  {review.performerReply}
                                </p>
                              </div>}
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
                {/* Load More Button */}
                <div className="text-center">
                  <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Load More Reviews
                  </button>
                </div>
                {/* Write a Review CTA */}
                <div className="bg-indigo-50 rounded-lg shadow-sm p-6 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Have you seen {performer.name} perform?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Share your experience and help others discover great
                    performances!
                  </p>
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md">
                    Write a Review
                  </button>
                </div>
              </div>}
            {/* Fan Zone Tab */}
            {activeTab === ProfileTab.FanZone && <div className="space-y-6">
                {/* Fan Zone Tabs */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                      <button onClick={() => setActiveFanZoneTab('discussions')} className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${activeFanZoneTab === 'discussions' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Discussions
                      </button>
                      <button onClick={() => setActiveFanZoneTab('fan-content')} className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${activeFanZoneTab === 'fan-content' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Fan Content
                      </button>
                      <button onClick={() => setActiveFanZoneTab('exclusive')} className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${activeFanZoneTab === 'exclusive' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Exclusive Access
                        {!isFollowing && <span className="ml-1 bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">
                            Follow to Access
                          </span>}
                      </button>
                      <button onClick={() => setActiveFanZoneTab('interactive')} className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${activeFanZoneTab === 'interactive' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        Interactive
                      </button>
                    </nav>
                  </div>
                  {/* Discussions Content */}
                  {activeFanZoneTab === 'discussions' && <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">
                            Fan Discussions
                          </h2>
                          <p className="text-sm text-gray-600">
                            Join conversations with other fans
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md">
                          New Discussion
                        </button>
                      </div>
                      {/* Discussion Categories */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <button className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium">
                          All Topics
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium">
                          Announcements
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium">
                          General
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium">
                          Show Meetups
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium">
                          Song Requests
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium">
                          Fan Content
                        </button>
                      </div>
                      {/* Discussion List */}
                      <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
                        {discussions.map((discussion, index) => <div key={index} className="p-4 hover:bg-gray-50">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full overflow-hidden">
                                  <img src={discussion.author.avatar} alt={discussion.author.name} className="h-full w-full object-cover" />
                                </div>
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex items-center">
                                  <h3 className="font-medium text-gray-900 hover:text-indigo-600">
                                    {discussion.title}
                                  </h3>
                                  {discussion.isPinned && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                      Pinned
                                    </span>}
                                  {discussion.isLocked && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      Locked
                                    </span>}
                                </div>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                  <span>
                                    Started by {discussion.author.name}
                                  </span>
                                  <span className="mx-1">•</span>
                                  <span>
                                    {formatDateWithYear(discussion.createdDate)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4 flex-shrink-0 text-right">
                                <div className="text-sm font-medium text-gray-900">
                                  {discussion.replyCount} replies
                                </div>
                                <div className="text-xs text-gray-500">
                                  Last activity{' '}
                                  {new Date(discussion.lastActivity).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>)}
                      </div>
                      {/* Load More Button */}
                      <div className="mt-6 text-center">
                        <button className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          Load More Discussions
                        </button>
                      </div>
                    </div>}
                  {/* Fan Content Tab */}
                  {activeFanZoneTab === 'fan-content' && <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">
                            Fan Content
                          </h2>
                          <p className="text-sm text-gray-600">
                            Artwork, covers, and photos from fans
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md">
                          Submit Content
                        </button>
                      </div>
                      {/* Fan Content Categories */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <button className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium">
                          All Content
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium">
                          Fan Art
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium">
                          Cover Videos
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium">
                          Show Photos
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium">
                          Stories
                        </button>
                      </div>
                      {/* Fan Art Gallery */}
                      <div className="mb-8">
                        <h3 className="text-md font-medium mb-4">
                          Featured Fan Art
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[1, 2, 3, 4].map(item => <div key={item} className="bg-gray-100 rounded-lg overflow-hidden">
                              <div className="aspect-square">
                                <img src={`https://source.unsplash.com/random/300x300/?art,music,${item}`} alt={`Fan art ${item}`} className="w-full h-full object-cover" />
                              </div>
                              <div className="p-2">
                                <div className="flex items-center">
                                  <div className="h-5 w-5 rounded-full overflow-hidden mr-1">
                                    <img src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item + 10}.jpg`} alt="Fan" className="h-full w-full object-cover" />
                                  </div>
                                  <span className="text-xs text-gray-700">
                                    @fanartist{item}
                                  </span>
                                </div>
                              </div>
                            </div>)}
                        </div>
                      </div>
                      {/* Cover Videos */}
                      <div className="mb-8">
                        <h3 className="text-md font-medium mb-4">
                          Recent Cover Videos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[1, 2, 3].map(item => <div key={item} className="bg-gray-100 rounded-lg overflow-hidden">
                              <div className="aspect-video relative">
                                <img src={`https://source.unsplash.com/random/400x225/?music,performance,${item}`} alt={`Cover video ${item}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <button className="h-12 w-12 rounded-full bg-indigo-600/90 hover:bg-indigo-700 flex items-center justify-center">
                                    <PlayIcon className="h-6 w-6 text-white" />
                                  </button>
                                </div>
                              </div>
                              <div className="p-3">
                                <h4 className="font-medium text-gray-900 text-sm">
                                  "{performer.name} Cover" by @musicfan{item}
                                </h4>
                                <div className="flex items-center justify-between mt-1">
                                  <div className="text-xs text-gray-500">
                                    3 days ago
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    1.2K views
                                  </div>
                                </div>
                              </div>
                            </div>)}
                        </div>
                      </div>
                      {/* Show Photos */}
                      <div>
                        <h3 className="text-md font-medium mb-4">
                          Fan-Submitted Show Photos
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(item => <div key={item} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                              <img src={`https://source.unsplash.com/random/300x300/?concert,crowd,${item}`} alt={`Show photo ${item}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                            </div>)}
                        </div>
                        <div className="mt-4 text-center">
                          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                            View All Fan Photos
                          </button>
                        </div>
                      </div>
                    </div>}
                  {/* Exclusive Access Tab */}
                  {activeFanZoneTab === 'exclusive' && <div className="p-6">
                      {isFollowing ? <>
                          <div className="flex justify-between items-center mb-6">
                            <div>
                              <h2 className="text-lg font-bold text-gray-900">
                                Exclusive Fan Content
                              </h2>
                              <p className="text-sm text-gray-600">
                                Special content for followers only
                              </p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Follower Access
                            </span>
                          </div>
                          <div className="space-y-8">
                            {/* Early Announcements */}
                            <div className="bg-indigo-50 rounded-lg p-4">
                              <h3 className="font-medium text-gray-900 mb-2">
                                Early Announcement
                              </h3>
                              <p className="text-gray-700 mb-3">
                                We're excited to share that we'll be announcing
                                a special acoustic show next week! Followers
                                will get early access to tickets 24 hours before
                                they go on sale to the general public.
                              </p>
                              <div className="flex items-center text-sm text-gray-500">
                                <span>Posted 2 days ago</span>
                                <span className="mx-2">•</span>
                                <span>Followers only</span>
                              </div>
                            </div>
                            {/* Exclusive Track */}
                            <div>
                              <h3 className="font-medium text-gray-900 mb-3">
                                Exclusive Unreleased Track
                              </h3>
                              <div className="bg-white border border-gray-200 rounded-md p-3 flex items-center">
                                <button className="h-10 w-10 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center flex-shrink-0">
                                  <PlayIcon className="h-5 w-5 text-white" />
                                </button>
                                <div className="ml-3 flex-1">
                                  <div className="font-medium text-gray-900">
                                    "Summer Nights" (Acoustic Demo)
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Unreleased track • 3:42 • Followers only
                                  </div>
                                </div>
                                <button className="text-indigo-600 hover:text-indigo-800">
                                  <DownloadIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                            {/* Fan Club Perks */}
                            <div>
                              <h3 className="font-medium text-gray-900 mb-3">
                                Fan Club Perks
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="border border-gray-200 rounded-md p-4">
                                  <h4 className="font-medium text-gray-900 mb-1">
                                    Exclusive Merchandise
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-3">
                                    Special items only available to followers
                                  </p>
                                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                    View Exclusive Shop
                                  </button>
                                </div>
                                <div className="border border-gray-200 rounded-md p-4">
                                  <h4 className="font-medium text-gray-900 mb-1">
                                    Meet & Greet Priority
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-3">
                                    First access to meet & greet opportunities
                                  </p>
                                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                    View Upcoming Events
                                  </button>
                                </div>
                                <div className="border border-gray-200 rounded-md p-4">
                                  <h4 className="font-medium text-gray-900 mb-1">
                                    Birthday Shoutouts
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-3">
                                    Get a special message on your birthday
                                  </p>
                                  <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                    Add Your Birthday
                                  </button>
                                </div>
                              </div>
                            </div>
                            {/* Virtual Meetups */}
                            <div>
                              <h3 className="font-medium text-gray-900 mb-3">
                                Upcoming Virtual Meetups
                              </h3>
                              <div className="border border-gray-200 rounded-md p-4">
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 w-16 text-center">
                                    <div className="text-2xl font-bold text-gray-900">
                                      15
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      July
                                    </div>
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <h4 className="font-medium text-gray-900">
                                      Fan Q&A Session
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      Join us for a live Q&A session where we'll
                                      answer questions from followers and play a
                                      few acoustic songs.
                                    </p>
                                    <div className="mt-2 flex items-center text-xs text-gray-500">
                                      <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                                      <span>7:00 PM EDT • 45 minutes</span>
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded">
                                      RSVP
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </> : <div className="text-center py-12">
                          <div className="h-20 w-20 mx-auto mb-4 text-indigo-300">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Exclusive Content for Followers
                          </h3>
                          <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Follow {performer.name} to unlock exclusive content,
                            early announcements, and special perks!
                          </p>
                          <button onClick={toggleFollow} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md">
                            Follow to Unlock
                          </button>
                        </div>}
                    </div>}
                  {/* Interactive Tab */}
                  {activeFanZoneTab === 'interactive' && <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-lg font-bold text-gray-900">
                            Interactive Features
                          </h2>
                          <p className="text-sm text-gray-600">
                            Polls, contests, and more
                          </p>
                        </div>
                      </div>
                      <div className="space-y-8">
                        {/* Active Poll */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <h3 className="font-medium text-gray-900 mb-2">
                            Current Poll
                          </h3>
                          <p className="text-gray-700 mb-4">
                            Which song would you most like to hear at our next
                            show?
                          </p>
                          <div className="space-y-3 mb-4">
                            {['Summer Nights', 'Midnight Drive', 'Ocean Waves', 'City Lights', 'Mountain Air'].map((option, index) => <div key={index} className="relative">
                                <div className="block w-full bg-gray-100 rounded-md p-3 cursor-pointer hover:bg-gray-200">
                                  <div className="flex justify-between">
                                    <span>{option}</span>
                                    <span className="text-gray-600">
                                      {15 + index * 3}%
                                    </span>
                                  </div>
                                </div>
                                <div className="absolute top-0 left-0 bottom-0 bg-indigo-100 rounded-md" style={{
                          width: `${15 + index * 3}%`,
                          zIndex: -1
                        }}></div>
                              </div>)}
                          </div>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>243 votes • 2 days remaining</span>
                            <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                              Vote Now
                            </button>
                          </div>
                        </div>
                        {/* Contest */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white p-6">
                          <h3 className="font-bold text-xl mb-2">
                            Win VIP Tickets + Backstage Pass!
                          </h3>
                          <p className="mb-4 text-white/90">
                            Enter our contest for a chance to win 2 VIP tickets
                            and backstage passes to our upcoming show at Capitol
                            Theatre.
                          </p>
                          <div className="bg-white/20 backdrop-blur-sm rounded-md p-4 mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">
                                Contest ends in:
                              </span>
                              <span className="font-bold">3 days, 7 hours</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Total entries: 342</span>
                              <span>Your entries: 0</span>
                            </div>
                          </div>
                          <button className="w-full py-2 bg-white text-indigo-700 font-medium rounded-md hover:bg-white/90">
                            Enter Contest
                          </button>
                        </div>
                        {/* Q&A */}
                        <div className="border border-gray-200 rounded-lg p-6">
                          <h3 className="font-medium text-gray-900 mb-2">
                            Ask {performer.name}
                          </h3>
                          <p className="text-gray-700 mb-4">
                            Submit your questions for our next Q&A session. Top
                            questions will be answered in our upcoming
                            livestream.
                          </p>
                          <div className="mb-4">
                            <textarea placeholder="Type your question here..." className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" rows={3}></textarea>
                          </div>
                          <div className="flex justify-end">
                            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md">
                              Submit Question
                            </button>
                          </div>
                        </div>
                        {/* Fan Leaderboard */}
                        <div>
                          <h3 className="font-medium text-gray-900 mb-4">
                            Top Fans This Month
                          </h3>
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rank
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fan
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Points
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Badges
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {[{
                            name: 'SuperFan2000',
                            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                            points: 2450,
                            badges: 8
                          }, {
                            name: 'MusicLover',
                            avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
                            points: 1875,
                            badges: 6
                          }, {
                            name: 'ConcertGoer',
                            avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
                            points: 1640,
                            badges: 5
                          }, {
                            name: 'RockStar',
                            avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
                            points: 1320,
                            badges: 4
                          }, {
                            name: 'MelodyMaster',
                            avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
                            points: 980,
                            badges: 3
                          }].map((fan, index) => <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900">
                                        #{index + 1}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full">
                                          <img src={fan.avatar} alt={fan.name} className="h-8 w-8 rounded-full" />
                                        </div>
                                        <div className="ml-3">
                                          <div className="text-sm font-medium text-gray-900">
                                            {fan.name}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">
                                        {fan.points.toLocaleString()} pts
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">
                                        {fan.badges} badges
                                      </div>
                                    </td>
                                  </tr>)}
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-4 text-center">
                            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                              View Full Leaderboard
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>}
                </div>
              </div>}
            {/* About Tab */}
            {activeTab === ProfileTab.About && <div className="space-y-6">
                {/* Full Biography */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-bold mb-4">Biography</h2>
                  <div className="space-y-4 text-gray-700">
                    <p>{performer.bio}</p>
                    <p>
                      With {performer.yearsActive} years of experience in the
                      music industry, {performer.name} has established a
                      reputation for delivering unforgettable performances that
                      blend technical mastery with emotional depth. Their
                      journey began in{' '}
                      {new Date().getFullYear() - performer.yearsActive} and has
                      since evolved into a distinctive sound that resonates with
                      audiences across generations.
                    </p>
                    <p>
                      {performer.name} has performed at numerous venues
                      throughout Florida and beyond, from intimate local spots
                      to major festivals. Their commitment to musical excellence
                      and audience connection has earned them a dedicated
                      following of {performer.followerCount.toLocaleString()}{' '}
                      fans who appreciate their authentic approach and engaging
                      stage presence.
                    </p>
                    <p>
                      Whether performing original compositions or reimagining
                      familiar favorites, {performer.name} brings a unique
                      perspective and passionate energy to every show. Their
                      versatile repertoire spans multiple influences while
                      maintaining a cohesive artistic vision that continues to
                      evolve with each performance.
                    </p>
                    <p>
                      {performer.name}'s performances are characterized by{' '}
                      {performer.hasOriginalMusic ? 'a mix of original compositions and carefully selected covers' : 'expertly crafted renditions of beloved classics'}
                      , delivered with a signature style that has become
                      instantly recognizable to fans. Their dynamic stage
                      presence and ability to connect with audiences of all
                      sizes has made them a favorite in the {performer.homeCity}{' '}
                      music scene and beyond.
                    </p>
                    <p>
                      Over the years, {performer.name} has collaborated with
                      numerous talented musicians and opened for several
                      national touring acts. Their dedication to their craft is
                      evident in every performance, as they continue to refine
                      their sound and expand their musical horizons.
                    </p>
                  </div>
                  {/* Timeline */}
                  <div className="mt-8">
                    <h3 className="text-md font-medium mb-4">
                      Career Milestones
                    </h3>
                    <div className="relative border-l-2 border-gray-200 pl-8 ml-4 space-y-8">
                      <div className="relative">
                        <div className="absolute -left-10 mt-1.5 h-4 w-4 rounded-full border-2 border-indigo-600 bg-white"></div>
                        <div className="text-sm text-gray-500 mb-1">
                          {new Date().getFullYear() - performer.yearsActive}
                        </div>
                        <h4 className="text-md font-medium text-gray-900">
                          First Performance
                        </h4>
                        <p className="text-gray-700">
                          Began performing at local open mic nights in{' '}
                          {performer.homeCity}
                        </p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-10 mt-1.5 h-4 w-4 rounded-full border-2 border-indigo-600 bg-white"></div>
                        <div className="text-sm text-gray-500 mb-1">
                          {new Date().getFullYear() - performer.yearsActive + 2}
                        </div>
                        <h4 className="text-md font-medium text-gray-900">
                          First Headline Show
                        </h4>
                        <p className="text-gray-700">
                          Sold out first headline performance at a local venue
                        </p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-10 mt-1.5 h-4 w-4 rounded-full border-2 border-indigo-600 bg-white"></div>
                        <div className="text-sm text-gray-500 mb-1">
                          {new Date().getFullYear() - 3}
                        </div>
                        <h4 className="text-md font-medium text-gray-900">
                          Festival Debut
                        </h4>
                        <p className="text-gray-700">
                          Performed at Clearwater Music Festival for the first
                          time
                        </p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-10 mt-1.5 h-4 w-4 rounded-full border-2 border-indigo-600 bg-white"></div>
                        <div className="text-sm text-gray-500 mb-1">
                          {new Date().getFullYear() - 1}
                        </div>
                        <h4 className="text-md font-medium text-gray-900">
                          Regional Tour
                        </h4>
                        <p className="text-gray-700">
                          Completed first regional tour across Florida
                        </p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-10 mt-1.5 h-4 w-4 rounded-full border-2 border-indigo-600 bg-white"></div>
                        <div className="text-sm text-gray-500 mb-1">
                          {new Date().getFullYear()}
                        </div>
                        <h4 className="text-md font-medium text-gray-900">
                          Present Day
                        </h4>
                        <p className="text-gray-700">
                          Continuing to perform and grow with{' '}
                          {performer.followerCount.toLocaleString()} followers
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Influences */}
                  <div className="mt-8">
                    <h3 className="text-md font-medium mb-4">
                      Musical Influences
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {['The Beatles', 'Fleetwood Mac', 'Tom Petty', 'Radiohead', 'Arcade Fire', 'Stevie Wonder', 'David Bowie', 'Joni Mitchell'].map((influence, index) => <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          {influence}
                        </span>)}
                    </div>
                  </div>
                  {/* Press Quotes */}
                  <div className="mt-8">
                    <h3 className="text-md font-medium mb-4">Press & Media</h3>
                    <div className="space-y-4">
                      <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-700">
                        "{performer.name} delivers a captivating performance
                        that stays with you long after the final note."
                        <footer className="mt-1 text-sm text-gray-500">
                          — Tampa Bay Times
                        </footer>
                      </blockquote>
                      <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-700">
                        "One of the most promising acts to emerge from the
                        Florida music scene in recent years."
                        <footer className="mt-1 text-sm text-gray-500">
                          — Clearwater Music Blog
                        </footer>
                      </blockquote>
                      <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-700">
                        "An energetic live show that demonstrates both technical
                        skill and genuine passion for the craft."
                        <footer className="mt-1 text-sm text-gray-500">
                          — Florida Entertainment Weekly
                        </footer>
                      </blockquote>
                    </div>
                  </div>
                </div>
                {/* Technical Details */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-bold mb-4">
                    Technical Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Instruments & Equipment */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">
                        Instruments & Equipment
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">
                            Fender Stratocaster Electric Guitar
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">
                            Martin D-28 Acoustic Guitar
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">Nord Stage 3 Keyboard</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">DW Drum Kit (5-piece)</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">
                            Shure SM58 Vocal Microphones
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">
                            Fender Twin Reverb Amplifier
                          </span>
                        </li>
                      </ul>
                      <div className="mt-4">
                        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                          <DownloadIcon className="h-4 w-4 mr-1" />
                          Download Full Gear List
                        </button>
                      </div>
                    </div>
                    {/* Technical Requirements */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">
                        Technical Requirements
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">
                            Stage Size: Minimum 12' x 8'
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">
                            Sound System: Full PA with monitors
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">
                            Lighting: Basic stage lighting
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">
                            Power: 4 dedicated 20A circuits
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">Setup Time: 60 minutes</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">
                            Teardown Time: 45 minutes
                          </span>
                        </li>
                      </ul>
                      <div className="mt-4 flex space-x-4">
                        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                          <DownloadIcon className="h-4 w-4 mr-1" />
                          Technical Rider
                        </button>
                        <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                          <DownloadIcon className="h-4 w-4 mr-1" />
                          Stage Plot
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Booking Information */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-bold mb-4">
                    Booking Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">
                        Availability
                      </h3>
                      <div className="bg-gray-50 rounded-md p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            Current Status:
                          </span>
                          {performer.availableForBooking ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Available for Booking
                            </span> : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Limited Availability
                            </span>}
                        </div>
                        <div className="text-sm text-gray-700">
                          {performer.availableForBooking ? <p>
                              Currently accepting bookings for events and
                              venues. Please inquire for specific dates.
                            </p> : <p>
                              Limited availability due to current touring
                              schedule. Some dates may still be available.
                            </p>}
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Performance Types
                      </h4>
                      <ul className="space-y-2 text-gray-700 mb-4">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">
                            Full Band Performance (2-3 hours)
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">Acoustic Set (1-2 hours)</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">
                            Private Events & Corporate Functions
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-indigo-500">
                            •
                          </div>
                          <span className="ml-2">Festival Appearances</span>
                        </li>
                      </ul>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Rate Range
                      </h4>
                      <div className="text-gray-700 mb-4">
                        <p>
                          Rates vary based on event type, duration, and
                          location. Please inquire for a custom quote.
                        </p>
                        <p className="mt-1">
                          Starting at $500 for local performances.
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">
                        Booking Inquiry
                      </h3>
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Your Name
                          </label>
                          <input type="text" id="name" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Full Name" />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input type="email" id="email" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="your@email.com" />
                        </div>
                        <div>
                          <label htmlFor="event-type" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Type
                          </label>
                          <select id="event-type" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="">Select Event Type</option>
                            <option value="venue">Venue Performance</option>
                            <option value="private">Private Event</option>
                            <option value="corporate">
                              Corporate Function
                            </option>
                            <option value="festival">Festival</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-1">
                            Preferred Date(s)
                          </label>
                          <input type="text" id="event-date" className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="MM/DD/YYYY (multiple dates ok)" />
                        </div>
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Details
                          </label>
                          <textarea id="message" rows={4} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Please provide details about your event, venue, expected attendance, etc."></textarea>
                        </div>
                        <div>
                          <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Submit Inquiry
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/* Press & Media */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-bold mb-4">
                    Press & Media Resources
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-gray-200 rounded-md p-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Press Kit
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Comprehensive press kit with bio, high-res photos,
                        technical requirements, and more.
                      </p>
                      <button className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                        <DownloadIcon className="h-4 w-4 mr-1" />
                        Download Press Kit (ZIP)
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-md p-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        High-Res Photos
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Professional photos for media use. Please credit
                        photographer when using.
                      </p>
                      <button className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                        <DownloadIcon className="h-4 w-4 mr-1" />
                        Download Photo Pack
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-md p-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        One-Sheet
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Single-page overview with key information for promoters
                        and venue managers.
                      </p>
                      <button className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                        <DownloadIcon className="h-4 w-4 mr-1" />
                        Download One-Sheet (PDF)
                      </button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Media Contact
                    </h3>
                    <div className="bg-gray-50 rounded-md p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img src="https://randomuser.me/api/portraits/women/42.jpg" alt="Media contact" className="h-full w-full object-cover" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium text-gray-900">
                            Sarah Thompson
                          </h4>
                          <p className="text-gray-600">
                            Press & Media Relations
                          </p>
                          <div className="mt-1 text-sm">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-indigo-600">
                                media@example.com
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="text-gray-700">
                                (727) 555-0123
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
          </div>
          {/* Sidebar (Desktop) */}
          <div className="hidden lg:block lg:w-1/4 space-y-6">
            {/* Support the Artist */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Support {performer.name}
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  <DollarSignIcon className="h-4 w-4 mr-2" />
                  Tip Jar
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Buy Me a Coffee
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="#FF424D">
                    <path d="M14.4375 19.25C14.4375 16.6875 12.3125 14.75 9.75 14.75C7.1875 14.75 5.0625 16.6875 5.0625 19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.75 12C11.4069 12 12.75 10.6569 12.75 9C12.75 7.34315 11.4069 6 9.75 6C8.09315 6 6.75 7.34315 6.75 9C6.75 10.6569 8.09315 12 9.75 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22.5 19.25C22.5 16.6875 20.375 14.75 17.8125 14.75C15.25 14.75 13.125 16.6875 13.125 19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17.8125 12C19.4694 12 20.8125 10.6569 20.8125 9C20.8125 7.34315 19.4694 6 17.8125 6C16.1556 6 14.8125 7.34315 14.8125 9C14.8125 10.6569 16.1556 12 17.8125 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14.4375 19.25C14.4375 16.6875 12.3125 14.75 9.75 14.75C7.1875 14.75 5.0625 16.6875 5.0625 19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.75 12C11.4069 12 12.75 10.6569 12.75 9C12.75 7.34315 11.4069 6 9.75 6C8.09315 6 6.75 7.34315 6.75 9C6.75 10.6569 8.09315 12 9.75 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Patreon
                </button>
              </div>
            </div>
            {/* Connect */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-3">Connect</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center text-gray-700 hover:text-indigo-600">
                  <InstagramIcon className="h-5 w-5 mr-2" />
                  <span>Instagram</span>
                </a>
                <a href="#" className="flex items-center text-gray-700 hover:text-indigo-600">
                  <TwitterIcon className="h-5 w-5 mr-2" />
                  <span>Twitter</span>
                </a>
                <a href="#" className="flex items-center text-gray-700 hover:text-indigo-600">
                  <FacebookIcon className="h-5 w-5 mr-2" />
                  <span>Facebook</span>
                </a>
                <a href="#" className="flex items-center text-gray-700 hover:text-indigo-600">
                  <YoutubeIcon className="h-5 w-5 mr-2" />
                  <span>YouTube</span>
                </a>
                <a href="#" className="flex items-center text-gray-700 hover:text-indigo-600">
                  <LinkIcon className="h-5 w-5 mr-2" />
                  <span>Official Website</span>
                </a>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Join the mailing list
                </h4>
                <div className="flex">
                  <input type="email" placeholder="Your email" className="block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  <button className="bg-indigo-600 text-white px-4 rounded-r-md hover:bg-indigo-700">
                    Join
                  </button>
                </div>
              </div>
            </div>
            {/* Similar Artists */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Similar Artists
              </h3>
              <div className="space-y-3">
                {mockPerformers.slice(1, 6).map((artist, index) => <div key={index} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-md" onClick={() => navigate(`/performers/${artist.id}`)}>
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <img src={artist.profileImage} alt={artist.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {artist.name}
                        {artist.isVerified && <CheckCircleIcon className="h-3 w-3 text-blue-500 ml-1" />}
                      </div>
                      <div className="text-xs text-gray-500">
                        {artist.genres[0]}
                      </div>
                    </div>
                  </div>)}
              </div>
              <div className="mt-3 text-center">
                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  Discover More
                </button>
              </div>
            </div>
            {/* Upcoming in Your Area */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-3">
                Upcoming in Clearwater
              </h3>
              <div className="space-y-3">
                {mockPerformers.slice(0, 5).flatMap(p => p.upcomingShows.slice(0, 1)).slice(0, 5).map((show, index) => <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-10 text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {new Date(show.date).getDate()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(show.date).toLocaleDateString('en-US', {
                      month: 'short'
                    })}
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {show.venue}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTime(show.date)} • {mockPerformers[index].name}
                        </div>
                      </div>
                    </div>)}
              </div>
              <div className="mt-4 text-center">
                <button onClick={() => navigate('/calendar')} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  View Full Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Photo Lightbox */}
      {isLightboxOpen && selectedMediaItem && <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full">
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img src={selectedMediaItem.url} alt={selectedMediaItem.title} className="max-w-full max-h-[90vh] object-contain" />
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <h3 className="text-lg font-medium">{selectedMediaItem.title}</h3>
              <p className="text-sm text-gray-300">
                {formatDateWithYear(selectedMediaItem.date)}
              </p>
            </div>
          </div>
        </div>}
    </div>;
};