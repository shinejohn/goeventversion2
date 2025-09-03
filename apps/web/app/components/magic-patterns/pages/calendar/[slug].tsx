import React, { useEffect, useState } from 'react';
import { CalendarIcon, ListIcon, MapPinIcon, UsersIcon, MessageSquareIcon, InfoIcon, ShareIcon, HeartIcon, PlusIcon, ExternalLinkIcon, CheckIcon, TrendingUpIcon, StarIcon, ClockIcon, ChevronDownIcon, FilterIcon, SunIcon, CloudIcon, CloudRainIcon, ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { CalendarTabs } from '../../components/calendar/CalendarTabs';
import { CalendarSidebar } from '../../components/calendar/CalendarSidebar';
import { CalendarEngagementBar } from '../../components/calendar/CalendarEngagementBar';
import { EventCard } from '../../components/calendar/EventCard';
export default function CalendarDetailPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('calendar');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list' | 'map'>('list');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isAddedToMyCalendars, setIsAddedToMyCalendars] = useState(false);
  const [calendarData, setCalendarData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Mock data for the calendar
  useEffect(() => {
    // Simulate API call to fetch calendar data
    setTimeout(() => {
      setCalendarData({
        id: 'downtown-jazz-nights',
        title: 'Downtown Jazz Nights',
        tagline: 'The best jazz performances in downtown venues',
        description: 'A curated collection of the finest jazz performances happening in downtown Clearwater. From smooth jazz to bebop, this calendar covers it all. Perfect for jazz enthusiasts looking to discover new artists and venues.',
        bannerImage: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        logo: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=300&q=80',
        creator: {
          id: 'jazz-association',
          name: 'Jazz Association',
          avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          verified: true
        },
        stats: {
          followers: 2547,
          growthRate: 12,
          events: 87,
          activeMembers: 843
        },
        isPaid: true,
        price: 4.99,
        categories: ['Music', 'Jazz', 'Nightlife', 'Arts & Culture'],
        tags: ['Live Music', 'Jazz', 'Downtown', 'Evening Events', 'Performances'],
        events: [{
          id: 'event-1',
          title: 'Tuesday Blues Night',
          image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          date: new Date(2024, 7, 15, 19, 30),
          venue: {
            name: 'Blue Note',
            neighborhood: 'Downtown',
            id: 'venue-1',
            slug: 'blue-note'
          },
          distance: {
            miles: 1.2,
            minutes: 5,
            mode: 'drive'
          },
          price: {
            isFree: false,
            min: 15,
            max: 25
          },
          categories: ['Jazz', 'Blues', 'Live Music'],
          curatorNote: 'A fantastic weekly event featuring local blues artists. Great for jazz enthusiasts who appreciate the blues influence.',
          highlightReason: 'Staff Pick',
          isPinned: true,
          weather: 'clear'
        }, {
          id: 'event-2',
          title: 'Saxophone Showcase',
          image: 'https://images.unsplash.com/photo-1541804627596-3b5b9ef58c93?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          date: new Date(2024, 7, 16, 20, 0),
          venue: {
            name: 'Jazz Corner',
            neighborhood: 'Arts District',
            id: 'venue-2',
            slug: 'jazz-corner'
          },
          distance: {
            miles: 2.3,
            minutes: 8,
            mode: 'drive'
          },
          price: {
            isFree: false,
            min: 20,
            max: 20
          },
          categories: ['Jazz', 'Instrumental', 'Live Music'],
          curatorNote: 'An evening dedicated to the saxophone, featuring both established and emerging artists.',
          highlightReason: 'Rising Star',
          isPinned: false,
          weather: 'cloudy'
        }, {
          id: 'event-3',
          title: 'Weekend Jazz Ensemble',
          image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          date: new Date(2024, 7, 18, 21, 0),
          venue: {
            name: 'Harmony Hall',
            neighborhood: 'Riverside',
            id: 'venue-3',
            slug: 'harmony-hall'
          },
          distance: {
            miles: 3.1,
            minutes: 12,
            mode: 'drive'
          },
          price: {
            isFree: false,
            min: 25,
            max: 40
          },
          categories: ['Jazz', 'Ensemble', 'Live Music'],
          curatorNote: 'A full jazz ensemble performing classics and original compositions. The acoustics in Harmony Hall are exceptional.',
          highlightReason: 'Must See',
          isPinned: true,
          weather: 'clear'
        }, {
          id: 'event-4',
          title: 'Jazz Fusion Night',
          image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          date: new Date(2024, 7, 20, 20, 30),
          venue: {
            name: 'Modern Lounge',
            neighborhood: 'Downtown',
            id: 'venue-4',
            slug: 'modern-lounge'
          },
          distance: {
            miles: 1.5,
            minutes: 6,
            mode: 'drive'
          },
          price: {
            isFree: false,
            min: 15,
            max: 15
          },
          categories: ['Jazz', 'Fusion', 'Live Music'],
          curatorNote: 'Experience the exciting blend of jazz with other genres like funk, rock, and world music.',
          highlightReason: 'New Event',
          isPinned: false,
          weather: 'clear'
        }, {
          id: 'event-5',
          title: 'Sunday Jazz Brunch',
          image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          date: new Date(2024, 7, 21, 11, 0),
          venue: {
            name: 'Riverside Cafe',
            neighborhood: 'Riverside',
            id: 'venue-5',
            slug: 'riverside-cafe'
          },
          distance: {
            miles: 2.8,
            minutes: 10,
            mode: 'drive'
          },
          price: {
            isFree: false,
            min: 30,
            max: 30
          },
          categories: ['Jazz', 'Brunch', 'Live Music'],
          curatorNote: 'Enjoy a delicious brunch while listening to smooth jazz. Perfect for a relaxing Sunday.',
          highlightReason: 'Family Friendly',
          isPinned: false,
          weather: 'sunny'
        }],
        contributors: [{
          id: 'user-1',
          name: 'Michael Scott',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          contributionCount: 23
        }, {
          id: 'user-2',
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          contributionCount: 17
        }, {
          id: 'user-3',
          name: 'David Chen',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          contributionCount: 12
        }],
        relatedCalendars: [{
          id: 'smooth-jazz-lovers',
          title: 'Smooth Jazz Lovers',
          image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          followers: 1824,
          eventCount: 42
        }, {
          id: 'downtown-nightlife',
          title: 'Downtown Nightlife',
          image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          followers: 3561,
          eventCount: 78
        }, {
          id: 'music-venues-guide',
          title: 'Music Venues Guide',
          image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          followers: 2915,
          eventCount: 104
        }],
        sponsors: [{
          id: 'sponsor-1',
          name: 'City Music Shop',
          logo: 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          url: 'https://example.com/city-music'
        }, {
          id: 'sponsor-2',
          name: 'Jazz FM Radio',
          logo: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          url: 'https://example.com/jazz-fm'
        }],
        about: {
          mission: 'Our mission is to promote jazz music in the downtown area and connect jazz enthusiasts with exceptional live performances.',
          history: 'Downtown Jazz Nights was founded in 2018 by a group of jazz enthusiasts who wanted to create a comprehensive resource for finding quality jazz events in the downtown area.',
          team: [{
            name: 'Robert Williams',
            role: 'Founder',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          }, {
            name: 'Lisa Chen',
            role: 'Events Curator',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          }, {
            name: 'Marcus Johnson',
            role: 'Community Manager',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          }],
          guidelines: 'We curate events based on quality, authenticity, and audience experience. We prioritize venues with good acoustics and a respect for the art form.'
        },
        discussions: [{
          id: 'discussion-1',
          user: {
            name: 'Alex Thompson',
            avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          },
          date: '3 days ago',
          content: 'Attended the Tuesday Blues Night last week and it was phenomenal! Highly recommend checking it out.',
          likes: 12,
          replies: 3
        }, {
          id: 'discussion-2',
          user: {
            name: 'Maria Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          },
          date: '1 week ago',
          content: 'Does anyone know if the Weekend Jazz Ensemble allows photography? I love to capture some shots for my portfolio.',
          replies: 8
        }, {
          id: 'discussion-3',
          user: {
            name: 'James Wilson',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
          },
          date: '2 weeks ago',
          content: 'The saxophone showcase was incredible. The talent in this city is amazing. Looking forward to more events like this!',
          likes: 18,
          replies: 2
        }],
        members: [{
          id: 'member-1',
          name: 'Jessica Chen',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          role: 'Admin',
          joinDate: '2 years ago'
        }, {
          id: 'member-2',
          name: 'Thomas Wright',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          role: 'Moderator',
          joinDate: '1 year ago'
        }, {
          id: 'member-3',
          name: 'Sophia Martinez',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          role: 'Member',
          joinDate: '8 months ago'
        }, {
          id: 'member-4',
          name: 'Michael Johnson',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          role: 'Member',
          joinDate: '6 months ago'
        }, {
          id: 'member-5',
          name: 'Emma Wilson',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          role: 'Member',
          joinDate: '3 months ago'
        }]
      });
      setIsLoading(false);
    }, 1000);
  }, []);
  // Helper function to get weather icon
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <SunIcon className="h-5 w-5 text-yellow-500" />;
      case 'cloudy':
        return <CloudIcon className="h-5 w-5 text-gray-400" />;
      case 'rainy':
        return <CloudRainIcon className="h-5 w-5 text-blue-400" />;
      default:
        return <SunIcon className="h-5 w-5 text-yellow-500" />;
    }
  };
  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };
  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
  };
  const handleAddToMyCalendars = () => {
    setIsAddedToMyCalendars(!isAddedToMyCalendars);
  };
  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* Calendar Header with Banner */}
      <div className="relative">
        <div className="h-64 md:h-80 w-full overflow-hidden">
          <img src={calendarData.bannerImage} alt={calendarData.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 text-white p-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="flex-shrink-0 -mt-16 md:mt-0 z-10">
              <img src={calendarData.logo} alt={`${calendarData.title} logo`} className="w-24 h-24 md:w-32 md:h-32 rounded-lg border-4 border-white shadow-lg object-cover" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{calendarData.title}</h1>
              <p className="text-gray-200 mt-1">{calendarData.tagline}</p>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  <img src={calendarData.creator.avatar} alt={calendarData.creator.name} className="w-6 h-6 rounded-full mr-2" />
                  <span className="text-gray-200 text-sm">
                    By {calendarData.creator.name}
                  </span>
                  {calendarData.creator.verified && <CheckIcon className="h-4 w-4 text-blue-400 ml-1" />}
                </div>
                <div className="flex items-center ml-4">
                  <UsersIcon className="h-4 w-4 text-gray-300 mr-1" />
                  <span className="text-gray-200 text-sm">
                    {calendarData.stats.followers.toLocaleString()} followers
                  </span>
                </div>
                <div className="flex items-center ml-4">
                  <TrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-gray-200 text-sm">
                    {calendarData.stats.growthRate}% growth
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {calendarData.categories.map((category: string) => <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {category}
                  </span>)}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
              <button onClick={handleFollow} className={`px-4 py-2 rounded-md text-sm font-medium ${isFollowing ? 'bg-white text-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} flex items-center justify-center min-w-[120px]`}>
                {isFollowing ? <>
                    <CheckIcon className="h-4 w-4 mr-1.5" />
                    Following
                  </> : <>
                    <PlusIcon className="h-4 w-4 mr-1.5" />
                    Follow
                  </>}
              </button>
              {calendarData.isPaid && <button onClick={handleSubscribe} className={`px-4 py-2 rounded-md text-sm font-medium ${isSubscribed ? 'bg-green-600 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'} flex items-center justify-center min-w-[120px]`}>
                  {isSubscribed ? <>
                      <CheckIcon className="h-4 w-4 mr-1.5" />
                      Subscribed
                    </> : <>Subscribe ${calendarData.price}/mo</>}
                </button>}
              <div className="relative">
                <button onClick={handleShare} className="px-4 py-2 rounded-md text-sm font-medium bg-white/20 hover:bg-white/30 text-white flex items-center justify-center">
                  <ShareIcon className="h-4 w-4 mr-1.5" />
                  Share
                </button>
                {showShareOptions && <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        Copy Link
                      </button>
                      <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        Share on Twitter
                      </button>
                      <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        Share on Facebook
                      </button>
                      <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        Embed Calendar
                      </button>
                    </div>
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <CalendarTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'calendar' && <>
                {/* View Toggles */}
                <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex space-x-2">
                      <button onClick={() => setViewMode('month')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${viewMode === 'month' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        <CalendarIcon className="h-4 w-4 mr-1.5" />
                        Month
                      </button>
                      <button onClick={() => setViewMode('week')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${viewMode === 'week' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        <CalendarIcon className="h-4 w-4 mr-1.5" />
                        Week
                      </button>
                      <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        <ListIcon className="h-4 w-4 mr-1.5" />
                        List
                      </button>
                      <button onClick={() => setViewMode('map')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${viewMode === 'map' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        <MapPinIcon className="h-4 w-4 mr-1.5" />
                        Map
                      </button>
                    </div>
                    <div className="flex items-center">
                      <div className="relative">
                        <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                          <FilterIcon className="h-4 w-4 mr-1.5" />
                          Filters
                          <ChevronDownIcon className="h-4 w-4 ml-1.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Category Pills */}
                  <div className="mt-4 flex overflow-x-auto pb-2 space-x-2">
                    {['all', 'jazz', 'blues', 'fusion', 'instrumental', 'vocal'].map(category => <button key={category} onClick={() => setSelectedCategory(category)} className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${selectedCategory === category ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>)}
                  </div>
                </div>
                {/* Events List */}
                <div className="space-y-6">
                  {calendarData.events.map((event: any) => <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="md:flex">
                        <div className="md:flex-shrink-0 h-48 md:h-auto md:w-48">
                          <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {event.title}
                              </h3>
                              <div className="flex items-center mt-1 text-sm text-gray-600">
                                <ClockIcon className="h-4 w-4 mr-1.5" />
                                {event.date.toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                              </div>
                              <div className="flex items-center mt-1 text-sm text-gray-600">
                                <MapPinIcon className="h-4 w-4 mr-1.5" />
                                {event.venue.name}, {event.venue.neighborhood}
                              </div>
                            </div>
                            <div className="flex items-center">
                              {getWeatherIcon(event.weather)}
                              <span className="ml-1 text-sm text-gray-600">
                                {event.weather === 'clear' ? 'Clear' : event.weather === 'cloudy' ? 'Cloudy' : 'Rainy'}
                              </span>
                            </div>
                          </div>
                          {/* Curator Note */}
                          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <InfoIcon className="h-5 w-5 text-yellow-600" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                  <span className="font-medium">
                                    Curator Note:
                                  </span>{' '}
                                  {event.curatorNote}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {event.categories.map((category: string) => <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {category}
                                </span>)}
                              {event.isPinned && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <StarIcon className="h-3 w-3 mr-1" />
                                  Pinned
                                </span>}
                              {event.highlightReason && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  {event.highlightReason}
                                </span>}
                            </div>
                            <div className="mt-2 sm:mt-0">
                              <span className="font-medium">
                                {event.price.isFree ? 'Free' : event.price.min === event.price.max ? `$${event.price.min}` : `$${event.price.min} - $${event.price.max}`}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button onClick={() => navigate(`/event/${event.id}`)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                              View Details
                              <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
              </>}
            {activeTab === 'about' && <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  About This Calendar
                </h2>
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Our Mission
                  </h3>
                  <p className="text-gray-700 mb-6">
                    {calendarData.about.mission}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Our History
                  </h3>
                  <p className="text-gray-700 mb-6">
                    {calendarData.about.history}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Curation Guidelines
                  </h3>
                  <p className="text-gray-700 mb-6">
                    {calendarData.about.guidelines}
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Our Team
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    {calendarData.about.team.map((member: any) => <div key={member.name} className="flex flex-col items-center text-center p-4 border border-gray-200 rounded-lg">
                        <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full mb-3" />
                        <h4 className="font-medium text-gray-900">
                          {member.name}
                        </h4>
                        <p className="text-gray-600 text-sm">{member.role}</p>
                      </div>)}
                  </div>
                </div>
              </div>}
            {activeTab === 'members' && <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Members ({calendarData.stats.activeMembers})
                  </h2>
                  <div className="relative">
                    <input type="text" placeholder="Search members..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-md" />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {calendarData.members.map((member: any) => <div key={member.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                      <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full mr-4" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {member.name}
                        </h4>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${member.role === 'Admin' ? 'bg-red-100 text-red-800' : member.role === 'Moderator' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            {member.role}
                          </span>
                          <span className="text-gray-500 text-xs ml-2">
                            Joined {member.joinDate}
                          </span>
                        </div>
                      </div>
                    </div>)}
                </div>
                <div className="mt-6 text-center">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Load More Members
                  </button>
                </div>
              </div>}
            {activeTab === 'discussion' && <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Discussion
                  </h2>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    <PlusIcon className="h-4 w-4 mr-1.5" />
                    New Post
                  </button>
                </div>
                <div className="space-y-6">
                  {calendarData.discussions.map((discussion: any) => <div key={discussion.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <img src={discussion.user.avatar} alt={discussion.user.name} className="w-10 h-10 rounded-full mr-4" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">
                              {discussion.user.name}
                            </h4>
                            <span className="text-gray-500 text-sm">
                              {discussion.date}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-2">
                            {discussion.content}
                          </p>
                          <div className="flex items-center mt-3 space-x-4">
                            <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                              <HeartIcon className="h-4 w-4 mr-1" />
                              Like ({discussion.likes})
                            </button>
                            <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                              <MessageSquareIcon className="h-4 w-4 mr-1" />
                              Reply ({discussion.replies})
                            </button>
                            <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
                              <ShareIcon className="h-4 w-4 mr-1" />
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
                <div className="mt-6 text-center">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Load More Posts
                  </button>
                </div>
              </div>}
          </div>
          {/* Sidebar */}
          <CalendarSidebar calendarData={calendarData} isAddedToMyCalendars={isAddedToMyCalendars} onAddToMyCalendars={handleAddToMyCalendars} />
        </div>
      </div>
      {/* Engagement Bar */}
      <CalendarEngagementBar isLiked={false} likeCount={247} commentCount={38} isAddedToMyCalendars={isAddedToMyCalendars} onAddToMyCalendars={handleAddToMyCalendars} />
      {/* Marketplace Banner */}
      <div className="bg-indigo-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Discover More Calendars</h3>
              <p className="text-indigo-200 mt-1">
                Find curated calendars for any interest or community
              </p>
            </div>
            <button onClick={() => navigate('/calendars')} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50">
              Browse Calendar Marketplace
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>;
}