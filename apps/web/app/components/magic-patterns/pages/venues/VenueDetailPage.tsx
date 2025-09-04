import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { MapPinIcon, CalendarIcon, ClockIcon, StarIcon, UsersIcon, HeartIcon, ShareIcon, CheckCircleIcon, ArrowLeftIcon, ExternalLinkIcon, MessageCircleIcon, CheckIcon, XIcon, InfoIcon, MusicIcon, DollarSignIcon, WifiIcon, CameraIcon, LayoutIcon, PhoneIcon, GlobeIcon, TicketIcon, UserIcon, CalendarDaysIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

interface VenueDetailPageProps {
  venue?: any;
  upcomingEvents?: any[];
}

export const VenueDetailPage = ({ venue: propVenue, upcomingEvents: propEvents = [] }: VenueDetailPageProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Use real venue data from props - no fallback to mock data
  if (!propVenue) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Venue Not Found</h2>
          <p className="mt-2 text-gray-600">The venue you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/venues')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Browse All Venues
          </button>
        </div>
      </div>
    );
  }
  
  const venue = propVenue;
  const upcomingEvents = propEvents || [];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: venue.name,
        text: `Check out ${venue.name} on When's The Fun`,
        url: window.location.href
      });
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // In a real app, this would make an API call to save/unsave
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // In a real app, this would make an API call to follow/unfollow
  };

  const handleBookNow = () => {
    navigate(`/venues/${venue.id}/book`);
  };

  const handleContactVenue = () => {
    setShowContactForm(true);
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: { [key: string]: any } = {
      'Wi-Fi': WifiIcon,
      'Parking': CalendarIcon,
      'Sound System': MusicIcon,
      'Lighting': LayoutIcon,
      'Photography': CameraIcon,
      'Air Conditioning': CheckIcon,
      'Stage': MusicIcon,
      'Kitchen': DollarSignIcon,
      'Bar': DollarSignIcon,
      'Outdoor Space': CalendarIcon
    };
    return icons[amenity] || CheckIcon;
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'events', label: 'Events' },
    { id: 'photos', label: 'Photos' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/venues')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                {venue.name}
                {venue.verified && (
                  <CheckCircleIcon className="h-5 w-5 text-blue-500 ml-2" />
                )}
              </h1>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {venue.location.address}
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleSave}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <HeartIcon className={`h-5 w-5 ${isSaved ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
              </button>
              <button 
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ShareIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        <div className="grid grid-cols-4 gap-0.5 h-96">
          {venue.images.slice(0, 5).map((image: string, index: number) => (
            <div 
              key={index}
              className={`relative ${index === 0 ? 'col-span-2 row-span-2' : ''} ${index === 4 ? 'relative' : ''}`}
            >
              <img 
                src={image} 
                alt={`${venue.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 4 && venue.images.length > 5 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <CameraIcon className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-lg font-medium">+{venue.images.length - 5} more</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {venue.rating || 4.5}
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {venue.capacity}
                </div>
                <div className="text-sm text-gray-600">Capacity</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {venue.reviewCount || 0}
                </div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {'$'.repeat(venue.priceRange || 2)}
                </div>
                <div className="text-sm text-gray-600">Price</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6">
              <div className="flex space-x-8">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 relative ${
                      activeTab === tab.id 
                        ? 'text-indigo-600 font-medium' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* About */}
                <div>
                  <h2 className="text-xl font-bold mb-4">About {venue.name}</h2>
                  <p className="text-gray-600">
                    {venue.description || `${venue.name} is a ${venue.venueType} venue located in ${venue.location.address}. With a capacity of ${venue.capacity} guests, it offers a perfect setting for various events and gatherings.`}
                  </p>
                </div>

                {/* Amenities */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {venue.amenities.map((amenity: string, index: number) => {
                      const Icon = getAmenityIcon(amenity);
                      return (
                        <div key={index} className="flex items-center">
                          <Icon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-gray-700">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Location</h2>
                  <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <MapPinIcon className="h-8 w-8 text-gray-400" />
                    <span className="ml-2 text-gray-500">Interactive map would go here</span>
                  </div>
                  <p className="mt-4 text-gray-600">
                    {venue.location.address}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold">Upcoming Events</h2>
                {upcomingEvents.length > 0 ? (
                  <div className="grid gap-6">
                    {upcomingEvents.map((event: any) => (
                      <div 
                        key={event.id}
                        className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        <img 
                          src={event.image} 
                          alt={event.name}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-grow">
                          <h3 className="font-bold text-lg">{event.name}</h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {event.date.toLocaleDateString()}
                            <ClockIcon className="h-4 w-4 ml-3 mr-1" />
                            {event.time}
                          </div>
                          <div className="flex items-center mt-2">
                            <span className="text-indigo-600 font-medium">{event.ticketPrice}</span>
                            <span className={`ml-3 text-sm px-2 py-0.5 rounded-full ${
                              event.ticketStatus === 'Available' ? 'bg-green-100 text-green-800' : 
                              event.ticketStatus === 'Selling Fast' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {event.ticketStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarDaysIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No upcoming events scheduled at this venue</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'photos' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {venue.images.map((image: string, index: number) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`${venue.name} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Reviews</h2>
                <div className="text-center py-12">
                  <MessageCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No reviews yet</p>
                  <p className="text-sm text-gray-400 mt-2">Be the first to review this venue</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking & Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Booking Card */}
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-2">Book This Venue</h3>
                  <p className="text-sm text-gray-600">
                    Starting from ${venue.price_per_hour || 100}/hour
                  </p>
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 mb-3"
                >
                  Check Availability
                </button>

                <button
                  onClick={handleContactVenue}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50"
                >
                  <MessageCircleIcon className="h-5 w-5 inline-block mr-2" />
                  Contact Venue
                </button>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Quick Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Venue Type</span>
                      <span className="font-medium">{venue.venueType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Capacity</span>
                      <span className="font-medium">{venue.capacity} guests</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price Range</span>
                      <span className="font-medium">{'$'.repeat(venue.priceRange || 2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Host Info */}
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Venue Host</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Venue Management</p>
                    <p className="text-sm text-gray-600">Typically responds in 1 hour</p>
                  </div>
                </div>
                <button
                  onClick={handleFollow}
                  className={`w-full py-2 px-4 rounded-md font-medium ${
                    isFollowing 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow Venue'}
                </button>
              </div>

              {/* Contact Info */}
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Contact Info</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center text-gray-600 hover:text-indigo-600">
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    <span>Call Venue</span>
                  </a>
                  <a href="#" className="flex items-center text-gray-600 hover:text-indigo-600">
                    <GlobeIcon className="h-5 w-5 mr-2" />
                    <span>Visit Website</span>
                  </a>
                  <a href="#" className="flex items-center text-gray-600 hover:text-indigo-600">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Contact {venue.name}</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Tell us about your event..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700"
                >
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};