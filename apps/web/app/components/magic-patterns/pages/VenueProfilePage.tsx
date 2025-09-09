import React, { useState } from 'react';
import { 
  MapPinIcon, StarIcon, HeartIcon, ShareIcon, CheckCircleIcon, 
  CalendarIcon, ClockIcon, UsersIcon, DollarSignIcon, WifiIcon,
  CarIcon, MicIcon, ProjectorIcon, UtensilsIcon, AccessibilityIcon,
  PhoneIcon, MailIcon, GlobeIcon, ArrowRightIcon
} from 'lucide-react';
import { useNavigate } from '@react-router/react';
import { EntityImage } from '@kit/ui/makerkit/entity-image';

interface VenueProfilePageProps {
  venue: any;
}

export const VenueProfilePage = ({ venue }: VenueProfilePageProps) => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Check if venue exists or is invalid
  if (!venue || !venue.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Venue not found</h2>
          <p className="mt-2 text-gray-600">The venue you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/venues')}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Browse Venues
          </button>
        </div>
      </div>
    );
  }
  
  // Prepare images array - handle null venue
  const images = venue?.gallery_images || (venue?.image_url ? [venue.image_url] : []);
  
  // Amenities mapping
  const amenityIcons: Record<string, React.ReactNode> = {
    wifi: <WifiIcon className="h-5 w-5" />,
    parking: <CarIcon className="h-5 w-5" />,
    'sound-system': <MicIcon className="h-5 w-5" />,
    projector: <ProjectorIcon className="h-5 w-5" />,
    catering: <UtensilsIcon className="h-5 w-5" />,
    'wheelchair-accessible': <AccessibilityIcon className="h-5 w-5" />,
  };
  
  const amenitiesList = venue?.amenities && Array.isArray(venue.amenities) 
    ? venue.amenities 
    : Object.keys(venue?.amenities || {}).filter(key => venue?.amenities[key]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative h-96 bg-gray-900">
        {images.length > 0 ? (
          <>
            <EntityImage
              src={images[selectedImage]}
              alt={venue.name}
              entityType="venue"
              entityCategory={venue.venue_type}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {images.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      selectedImage === index ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <EntityImage
            src={null}
            alt={venue.name}
            entityType="venue"
            entityCategory={venue.venue_type}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition"
          >
            <HeartIcon className={`h-5 w-5 ${isSaved ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition">
            <ShareIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPinIcon className="h-5 w-5 mr-1" />
                  <span>{venue.address}</span>
                </div>
                <div className="flex items-center space-x-4">
                  {venue.is_verified && (
                    <div className="flex items-center text-green-600">
                      <CheckCircleIcon className="h-5 w-5 mr-1" />
                      <span className="text-sm">Verified Venue</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{venue.average_rating?.toFixed(1) || 'New'}</span>
                    <span className="ml-1 text-gray-500">({venue.total_reviews || 0} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">About This Venue</h2>
            <p className="text-gray-700 leading-relaxed">
              {venue.description || 'No description available for this venue.'}
            </p>
          </div>
          
          {/* Amenities */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenitiesList.map((amenity: string) => (
                <div key={amenity} className="flex items-center space-x-2">
                  {amenityIcons[amenity] || <CheckCircleIcon className="h-5 w-5" />}
                  <span className="capitalize">{amenity.replace(/-/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Upcoming Events */}
          {venue.upcoming_events && venue.upcoming_events.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Upcoming Events</h2>
                <button 
                  onClick={() => navigate(`/events?venue=${venue.id}`)}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  View all <ArrowRightIcon className="ml-1 h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {venue.upcoming_events.slice(0, 4).map((event: any) => (
                  <div 
                    key={event.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="flex space-x-4 p-4 border rounded-lg hover:shadow-md transition cursor-pointer"
                  >
                    <EntityImage
                      src={event.image_url}
                      alt={event.title}
                      entityType="event"
                      entityCategory={event.category}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(event.start_datetime).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-sm text-indigo-600 font-semibold">
                        ${event.price_min || 0}{event.price_max ? ` - $${event.price_max}` : '+'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Reviews */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            {venue.reviews && venue.reviews.length > 0 ? (
              <div className="space-y-4">
                {venue.reviews.slice(0, 5).map((review: any) => (
                  <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold">{review.reviewer?.name || 'Anonymous'}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.title && (
                      <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                    )}
                    <p className="text-gray-700">{review.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
            <div className="mb-4">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-bold">${venue.pricePerHour || venue.base_hourly_rate || 0}</span>
                <span className="text-gray-500">/hour</span>
              </div>
              <p className="text-sm text-gray-500">Minimum 2 hours booking</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-600">
                <UsersIcon className="h-5 w-5 mr-2" />
                <span>Capacity: {venue.capacity || venue.max_capacity || 'N/A'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>Available most days</span>
              </div>
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>24 hour response time</span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowBookingModal(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Check Availability
            </button>
          </div>
          
          {/* Contact Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              {venue.booking_email && (
                <div className="flex items-center text-gray-600">
                  <MailIcon className="h-5 w-5 mr-2" />
                  <a href={`mailto:${venue.booking_email}`} className="hover:text-indigo-600">
                    {venue.booking_email}
                  </a>
                </div>
              )}
              {venue.booking_phone && (
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  <a href={`tel:${venue.booking_phone}`} className="hover:text-indigo-600">
                    {venue.booking_phone}
                  </a>
                </div>
              )}
              {venue.website_url && (
                <div className="flex items-center text-gray-600">
                  <GlobeIcon className="h-5 w-5 mr-2" />
                  <a href={venue.website_url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600">
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};