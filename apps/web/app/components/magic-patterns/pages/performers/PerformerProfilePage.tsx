import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { HeartIcon, ShareIcon, BellIcon, MoreHorizontalIcon, CalendarIcon, ClockIcon, MapPinIcon, MusicIcon, UsersIcon, StarIcon, CheckCircleIcon, MessageCircleIcon, PlayIcon, ShoppingBagIcon, MessageSquareIcon, InfoIcon, ChevronRightIcon, ExternalLinkIcon, ThumbsUpIcon, ThumbsDownIcon, FlagIcon, DownloadIcon, InstagramIcon, TwitterIcon, FacebookIcon, YoutubeIcon, LinkIcon, TicketIcon, ArrowRightIcon, CameraIcon, VideoIcon, MicIcon, FileTextIcon, DollarSignIcon, PlusIcon, MinusIcon, ShoppingCartIcon, HeartIcon as HeartOutlineIcon, AlertCircleIcon } from 'lucide-react';

interface PerformerProfilePageProps {
  performer: any;
  upcomingEvents?: any[];
}

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
  performer,
  upcomingEvents = []
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
  
  // If performer not found, show error state
  if (!performer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Performer Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The performer you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => navigate('/performers')} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse All Performers
          </button>
        </div>
      </div>
    );
  }

  // Use real data from database - no mock data generation
  const pastShows: any[] = []; // Will come from database in future
  const merchandise: any[] = []; // Will come from database in future
  const reviews: any[] = []; // Will come from database in future
  const fanDiscussions: any[] = []; // Will come from database in future

  // Helper function to get social media link
  const getSocialMediaLink = (type: string) => {
    const socialLinks = performer.social_media_links || {};
    return socialLinks[type] || null;
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // In a real app, this would make an API call
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: performer.name || performer.stage_name,
        text: `Check out ${performer.name || performer.stage_name} on When's The Fun`,
        url: window.location.href
      });
    }
  };

  const openLightbox = (item: any) => {
    setSelectedMediaItem(item);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setSelectedMediaItem(null);
    setIsLightboxOpen(false);
  };

  const tabs = [
    { id: ProfileTab.Overview, label: 'Overview', icon: InfoIcon },
    { id: ProfileTab.UpcomingShows, label: 'Upcoming Shows', icon: CalendarIcon },
    { id: ProfileTab.PastShows, label: 'Past Shows', icon: ClockIcon },
    { id: ProfileTab.Media, label: 'Media', icon: CameraIcon },
    { id: ProfileTab.Merchandise, label: 'Merchandise', icon: ShoppingBagIcon },
    { id: ProfileTab.Reviews, label: 'Reviews', icon: StarIcon },
    { id: ProfileTab.FanZone, label: 'Fan Zone', icon: HeartIcon },
    { id: ProfileTab.About, label: 'About', icon: InfoIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-64 md:h-80 lg:h-96 overflow-hidden">
          <img
            src={performer.header_image || performer.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'}
            alt={performer.name || performer.stage_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative pb-8">
              <div className="flex flex-col md:flex-row md:items-end md:space-x-6">
                <div className="flex-shrink-0 -mt-12 md:-mt-20">
                  <img
                    src={performer.image || 'https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'}
                    alt={performer.name || performer.stage_name}
                    className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                </div>
                <div className="mt-4 md:mt-0 flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {performer.name || performer.stage_name}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-white/90">
                    <span className="flex items-center">
                      <MusicIcon className="h-5 w-5 mr-1" />
                      {performer.category || 'Performer'}
                    </span>
                    <span className="flex items-center">
                      <MapPinIcon className="h-5 w-5 mr-1" />
                      {performer.location || 'Tampa Bay Area'}
                    </span>
                    <span className="flex items-center">
                      <UsersIcon className="h-5 w-5 mr-1" />
                      {performer.follower_count || 0} followers
                    </span>
                    {performer.is_verified && (
                      <span className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-blue-400" />
                        <span className="ml-1">Verified</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-8 right-0 hidden md:flex items-center gap-3">
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-2.5 rounded-full font-medium transition-colors ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button
                  onClick={() => navigate(`/messages?to=${performer.id}`)}
                  className="px-6 py-2.5 bg-white text-gray-700 rounded-full font-medium hover:bg-gray-100 transition-colors"
                >
                  <MessageCircleIcon className="h-5 w-5 inline-block mr-2" />
                  Message
                </button>
                <button
                  onClick={handleShare}
                  className="p-2.5 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ShareIcon className="h-5 w-5" />
                </button>
                <button className="p-2.5 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                  <MoreHorizontalIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Action Buttons */}
      <div className="md:hidden bg-white border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleFollowToggle}
            className={`flex-1 px-4 py-2 rounded-full font-medium text-sm transition-colors ${
              isFollowing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
          <button
            onClick={() => navigate(`/messages?to=${performer.id}`)}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            Message
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            <ShareIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === ProfileTab.Overview && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Bio */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">About</h2>
                <div className={`prose max-w-none ${!isBioExpanded ? 'line-clamp-3' : ''}`}>
                  <p className="text-gray-600">
                    {performer.bio || `${performer.name || performer.stage_name} is a talented ${performer.category || 'performer'} based in the Tampa Bay area. Follow to stay updated on upcoming performances and new releases.`}
                  </p>
                </div>
                {performer.bio && performer.bio.length > 200 && (
                  <button
                    onClick={() => setIsBioExpanded(!isBioExpanded)}
                    className="text-indigo-600 hover:text-indigo-800 mt-2 text-sm font-medium"
                  >
                    {isBioExpanded ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>

              {/* Upcoming Shows */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Upcoming Shows</h2>
                  <button
                    onClick={() => setActiveTab(ProfileTab.UpcomingShows)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.slice(0, 3).map((event: any) => (
                      <div
                        key={event.id}
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex-shrink-0 text-center">
                          <div className="text-xs font-medium text-gray-500 uppercase">
                            {new Date(event.start_datetime).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                          <div className="text-2xl font-bold">
                            {new Date(event.start_datetime).getDate()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-gray-600">
                            {event.venue?.name || 'Venue TBD'}
                          </p>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No upcoming shows scheduled</p>
                  </div>
                )}
              </div>

              {/* Recent Media */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Recent Media</h2>
                  <button
                    onClick={() => setActiveTab(ProfileTab.Media)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="text-center py-8">
                  <CameraIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No media uploaded yet</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">{new Date(performer.created_at).getFullYear()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Shows</span>
                    <span className="font-medium">{performer.total_shows || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-medium flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      {performer.average_rating || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Response Rate</span>
                    <span className="font-medium">{performer.response_rate || 0}%</span>
                  </div>
                </div>
              </div>

              {/* Genres */}
              {performer.genres && performer.genres.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold mb-4">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {performer.genres.map((genre: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">Connect</h3>
                <div className="space-y-3">
                  {getSocialMediaLink('website') && (
                    <a
                      href={getSocialMediaLink('website')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-indigo-600"
                    >
                      <LinkIcon className="h-5 w-5" />
                      <span>Website</span>
                      <ExternalLinkIcon className="h-4 w-4 ml-auto" />
                    </a>
                  )}
                  {getSocialMediaLink('instagram') && (
                    <a
                      href={`https://instagram.com/${getSocialMediaLink('instagram')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-indigo-600"
                    >
                      <InstagramIcon className="h-5 w-5" />
                      <span>Instagram</span>
                      <ExternalLinkIcon className="h-4 w-4 ml-auto" />
                    </a>
                  )}
                  {getSocialMediaLink('twitter') && (
                    <a
                      href={`https://twitter.com/${getSocialMediaLink('twitter')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-indigo-600"
                    >
                      <TwitterIcon className="h-5 w-5" />
                      <span>Twitter</span>
                      <ExternalLinkIcon className="h-4 w-4 ml-auto" />
                    </a>
                  )}
                  {getSocialMediaLink('facebook') && (
                    <a
                      href={`https://facebook.com/${getSocialMediaLink('facebook')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-indigo-600"
                    >
                      <FacebookIcon className="h-5 w-5" />
                      <span>Facebook</span>
                      <ExternalLinkIcon className="h-4 w-4 ml-auto" />
                    </a>
                  )}
                  {getSocialMediaLink('youtube') && (
                    <a
                      href={`https://youtube.com/${getSocialMediaLink('youtube')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-indigo-600"
                    >
                      <YoutubeIcon className="h-5 w-5" />
                      <span>YouTube</span>
                      <ExternalLinkIcon className="h-4 w-4 ml-auto" />
                    </a>
                  )}
                </div>
              </div>

              {/* Book Now */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow p-6 text-white">
                <h3 className="font-semibold mb-2">Want to book this performer?</h3>
                <p className="text-sm mb-4 text-white/90">
                  Get in touch to discuss availability and pricing for your event.
                </p>
                <button
                  onClick={() => navigate(`/book/performer/${performer.id}`)}
                  className="w-full bg-white text-indigo-600 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Shows Tab */}
        {activeTab === ProfileTab.UpcomingShows && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Upcoming Shows</h2>
              </div>
              <div className="p-6">
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event: any) => (
                      <div
                        key={event.id}
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex-shrink-0 text-center">
                          <div className="text-xs font-medium text-gray-500 uppercase">
                            {new Date(event.start_datetime).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                          <div className="text-2xl font-bold">
                            {new Date(event.start_datetime).getDate()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(event.start_datetime).toLocaleDateString('en-US', { weekday: 'short' })}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{event.title}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              {event.venue?.name || 'Venue TBD'}
                            </span>
                            <span className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {new Date(event.start_datetime).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tickets/${event.id}`);
                          }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          Get Tickets
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Upcoming Shows
                    </h3>
                    <p className="text-gray-500 mb-6">
                      This performer doesn't have any scheduled shows at the moment.
                    </p>
                    <button
                      onClick={() => setIsFollowing(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <BellIcon className="h-5 w-5 mr-2" />
                      Follow for Updates
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Past Shows Tab */}
        {activeTab === ProfileTab.PastShows && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Past Shows</h2>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Past Shows Recorded
                  </h3>
                  <p className="text-gray-500">
                    Past performance history will appear here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === ProfileTab.Media && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold mb-4">Media</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedMediaType('photos')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedMediaType === 'photos'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <CameraIcon className="h-4 w-4 inline-block mr-2" />
                    Photos
                  </button>
                  <button
                    onClick={() => setSelectedMediaType('videos')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedMediaType === 'videos'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <VideoIcon className="h-4 w-4 inline-block mr-2" />
                    Videos
                  </button>
                  <button
                    onClick={() => setSelectedMediaType('audio')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedMediaType === 'audio'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <MicIcon className="h-4 w-4 inline-block mr-2" />
                    Audio
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-16">
                  <CameraIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Media Available
                  </h3>
                  <p className="text-gray-500">
                    Photos, videos, and audio tracks will appear here when uploaded.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Merchandise Tab */}
        {activeTab === ProfileTab.Merchandise && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Merchandise</h2>
              </div>
              <div className="p-6">
                <div className="text-center py-16">
                  <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Merchandise Available
                  </h3>
                  <p className="text-gray-500">
                    This performer hasn't added any merchandise yet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === ProfileTab.Reviews && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Reviews</h2>
              </div>
              <div className="p-6">
                <div className="text-center py-16">
                  <StarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-gray-500">
                    Reviews from past performances will appear here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fan Zone Tab */}
        {activeTab === ProfileTab.FanZone && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Fan Zone</h2>
              </div>
              <div className="p-6">
                <div className="text-center py-16">
                  <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Join the Fan Community
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Follow this performer to join discussions and connect with other fans.
                  </p>
                  {!isFollowing && (
                    <button
                      onClick={() => setIsFollowing(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Follow to Join
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === ProfileTab.About && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">About {performer.name || performer.stage_name}</h2>
                
                <div className="space-y-6">
                  {/* Bio Section */}
                  <div>
                    <h3 className="font-semibold mb-2">Biography</h3>
                    <p className="text-gray-600">
                      {performer.bio || `${performer.name || performer.stage_name} is a talented ${performer.category || 'performer'} bringing exceptional entertainment to venues across the Tampa Bay area.`}
                    </p>
                  </div>

                  {/* Performance Style */}
                  {performer.performance_style && (
                    <div>
                      <h3 className="font-semibold mb-2">Performance Style</h3>
                      <p className="text-gray-600">{performer.performance_style}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {performer.years_experience && (
                    <div>
                      <h3 className="font-semibold mb-2">Experience</h3>
                      <p className="text-gray-600">
                        {performer.years_experience} years in the industry
                      </p>
                    </div>
                  )}

                  {/* Available For */}
                  {performer.available_for && performer.available_for.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Available For</h3>
                      <div className="flex flex-wrap gap-2">
                        {performer.available_for.map((item: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technical Requirements */}
                  {performer.technical_requirements && (
                    <div>
                      <h3 className="font-semibold mb-2">Technical Requirements</h3>
                      <p className="text-gray-600">{performer.technical_requirements}</p>
                    </div>
                  )}

                  {/* Contact for Booking */}
                  <div className="pt-6 border-t">
                    <h3 className="font-semibold mb-4">Interested in Booking?</h3>
                    <p className="text-gray-600 mb-4">
                      Get in touch to check availability and discuss your event needs.
                    </p>
                    <button
                      onClick={() => navigate(`/book/performer/${performer.id}`)}
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Request Booking Information
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Lightbox */}
      {isLightboxOpen && selectedMediaItem && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <XIcon className="h-8 w-8" />
          </button>
          <div className="max-w-4xl w-full">
            {selectedMediaItem.type === 'photo' && (
              <img
                src={selectedMediaItem.url}
                alt={selectedMediaItem.title}
                className="w-full h-auto rounded-lg"
              />
            )}
            {selectedMediaItem.type === 'video' && (
              <video
                src={selectedMediaItem.url}
                controls
                className="w-full h-auto rounded-lg"
              />
            )}
            <div className="mt-4 text-white">
              <h3 className="text-xl font-semibold">{selectedMediaItem.title}</h3>
              {selectedMediaItem.description && (
                <p className="mt-2 text-gray-300">{selectedMediaItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};