import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, MapPinIcon, CalendarIcon, ClockIcon, StarIcon, UsersIcon, HeartIcon, ShareIcon, ArrowLeftIcon, ChevronRightIcon, ChevronLeftIcon, ExternalLinkIcon, MessageCircleIcon, CheckIcon, XIcon, InfoIcon, HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ImageGallery } from '../../../components/venue-detail/ImageGallery';
import { BookingWidget } from '../../../components/venue-detail/BookingWidget';
import { AmenitiesSection } from '../../../components/venue-detail/AmenitiesSection';
import { PricingSection } from '../../../components/venue-detail/PricingSection';
import { AvailabilityCalendar } from '../../../components/venue-detail/AvailabilityCalendar';
import { SpaceDetailsSection } from '../../../components/venue-detail/SpaceDetailsSection';
import { LocationSection } from '../../../components/venue-detail/LocationSection';
import { ReviewsSection } from '../../../components/venue-detail/ReviewsSection';
import { SimilarVenues } from '../../../components/venue-detail/SimilarVenues';
import { BookingRequestPopup, BookingFormData } from '../../../components/venue-detail/BookingRequestPopup';
import { BookingConfirmationPopup } from '../../../components/venue-detail/BookingConfirmationPopup';
interface VenueDetailPageProps {
  venue: any;
  upcomingEvents?: any[];
}

export const VenueDetailPage = ({ venue: propVenue, upcomingEvents = [] }: VenueDetailPageProps) => {
  const venue = {
    ...propVenue,
    // Add additional fields needed for this detailed view
    verifiedDate: 'May 2023',
    responseRate: 98,
    bookingApprovalRate: 95,
    squareFootage: 5200,
    ceilingHeight: 18,
    parkingDetails: '200 spaces in attached garage, $10 per vehicle',
    publicTransit: [{
      type: 'Bus',
      lines: ['Route 52', 'Route 60'],
      distance: '0.2 miles'
    }, {
      type: 'Train',
      lines: ['Blue Line'],
      distance: '0.5 miles'
    }],
    loadInDetails: 'Loading dock available at rear entrance. Service elevator to main floor.',
    floorPlan: 'https://images.unsplash.com/photo-1532094349884-543019a69b2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    internetSpeed: '1 Gbps fiber, business-grade WiFi',
    powerDetails: '20 standard outlets, 4 high-capacity outlets for equipment',
    lightingOptions: 'Adjustable LED lighting system with dimmer controls',
    soundLimitations: 'No sound restrictions until 11 PM. After 11 PM, sound must be kept below 85 decibels.',
    capacityBreakdown: {
      standing: 500,
      seated: 350,
      theaterStyle: 400,
      banquetStyle: 300,
      classroom: 250,
      boardroom: 50
    },
    packageOptions: [{
      name: 'Basic Package',
      description: 'Venue rental only',
      price: 5000,
      included: ['Space rental', 'Basic cleaning', 'Standard lighting']
    }, {
      name: 'Premium Package',
      description: 'Venue rental with additional services',
      price: 8000,
      included: ['Space rental', 'Enhanced cleaning', 'Full lighting package', 'Sound system', 'Event coordinator', 'Security staff']
    }, {
      name: 'Deluxe Package',
      description: 'All-inclusive experience',
      price: 12000,
      included: ['Space rental', 'Enhanced cleaning', 'Full lighting package', 'Premium sound system', 'Event coordinator', 'Security staff', 'Catering for up to 200 guests', 'Bar service', 'Decor package']
    }],
    additionalFees: [{
      name: 'Cleaning Fee',
      amount: 350,
      description: 'Standard post-event cleaning'
    }, {
      name: 'Security Deposit',
      amount: 1000,
      description: 'Refundable if no damages'
    }, {
      name: 'Extended Hours',
      amount: 250,
      description: 'Per hour beyond standard booking'
    }, {
      name: 'Security Staff',
      amount: 45,
      description: 'Per security guard per hour'
    }],
    additionalServices: [{
      name: 'Catering',
      description: 'In-house and approved external options available',
      priceRange: '$45-85 per person'
    }, {
      name: 'Bar Service',
      description: 'Full bar packages, bartender included',
      priceRange: '$25-50 per person'
    }, {
      name: 'Equipment Rental',
      description: 'AV equipment, staging, furniture',
      priceRange: 'Varies by selection'
    }, {
      name: 'Event Staff',
      description: 'Servers, coat check, greeters',
      priceRange: '$35 per staff member per hour'
    }],
    houseRules: ['No smoking inside the venue', 'No confetti or glitter', 'All decorations must be approved', 'Music must end by 11:00 PM on weekdays', 'Outside alcohol is not permitted without proper licensing'],
    uniqueFeatures: ['Grand staircase entrance perfect for dramatic entrances', 'Private bridal suite and green room', 'State-of-the-art lighting system with customizable presets', 'Indoor/outdoor flow with access to private garden', 'Historic architectural details throughout'],
    bestFor: ['Weddings', 'Corporate Galas', 'Fundraisers', 'Award Ceremonies', 'Upscale Social Events'],
    neighborhoodDescription: 'Located in the heart of downtown, surrounded by hotels, restaurants, and nightlife. Walking distance to the waterfront and cultural attractions.',
    reviews: [{
      id: 'review-1',
      reviewer: {
        name: 'Jennifer K.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
      },
      rating: 5,
      date: 'June 15, 2023',
      eventType: 'Wedding Reception',
      comment: 'The Grand Ballroom was absolutely perfect for our wedding! The space is stunning with those crystal chandeliers, and the staff was incredibly attentive throughout the planning process and on our big day. The grand staircase made for amazing photo opportunities. Highly recommend!',
      venueResponse: "Thank you for your kind words, Jennifer! It was our pleasure to host your special day, and we're thrilled that everything exceeded your expectations."
    }, {
      id: 'review-2',
      reviewer: {
        name: 'Michael T.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
      },
      rating: 4,
      date: 'May 3, 2023',
      eventType: 'Corporate Gala',
      comment: 'We hosted our annual company gala here and were very pleased with the venue. The space accommodated our 300 guests comfortably, and the sound system was excellent for our presentations. Only giving 4 stars because the parking situation was a bit challenging for some of our attendees.'
    }, {
      id: 'review-3',
      reviewer: {
        name: 'Sarah L.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
      },
      rating: 5,
      date: 'April 22, 2023',
      eventType: 'Charity Fundraiser',
      comment: 'The Grand Ballroom provided the perfect elegant backdrop for our annual charity fundraiser. The flexible space allowed us to have a silent auction area, seated dinner, and dance floor. The venue manager was exceptionally helpful with coordinating our various vendors. Will definitely book again next year!'
    }, {
      id: 'review-4',
      reviewer: {
        name: 'David R.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80'
      },
      rating: 5,
      date: 'March 10, 2023',
      eventType: 'Corporate Conference',
      comment: 'Excellent venue for our three-day conference. The technical capabilities were impressive, and the staff was very accommodating with our complex setup requirements. The central location made it convenient for our out-of-town attendees who were staying at nearby hotels.'
    }],
    availabilityByDate: {
      // Simplified availability data
      '2024-06-01': 'fully-available',
      '2024-06-02': 'fully-available',
      '2024-06-03': 'fully-available',
      '2024-06-04': 'partially-available',
      '2024-06-05': 'unavailable',
      '2024-06-06': 'unavailable',
      '2024-06-07': 'partially-available',
      '2024-06-08': 'fully-available',
      '2024-06-09': 'fully-available',
      '2024-06-10': 'fully-available',
      '2024-06-11': 'fully-available',
      '2024-06-12': 'fully-available',
      '2024-06-13': 'fully-available',
      '2024-06-14': 'fully-available',
      '2024-06-15': 'unavailable',
      '2024-06-16': 'unavailable',
      '2024-06-17': 'fully-available',
      '2024-06-18': 'fully-available',
      '2024-06-19': 'fully-available',
      '2024-06-20': 'fully-available',
      '2024-06-21': 'fully-available',
      '2024-06-22': 'unavailable',
      '2024-06-23': 'unavailable',
      '2024-06-24': 'fully-available',
      '2024-06-25': 'fully-available',
      '2024-06-26': 'fully-available',
      '2024-06-27': 'fully-available',
      '2024-06-28': 'fully-available',
      '2024-06-29': 'partially-available',
      '2024-06-30': 'partially-available'
    }
  };
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('23:00');
  const [isSaved, setIsSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const [showMobileBooking, setShowMobileBooking] = useState(false);
  const [showBookingRequestPopup, setShowBookingRequestPopup] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  // Generate similar venues by filtering the mock data
  const similarVenues = mockVenues.filter(v => v.id !== venue.id && v.venueType === venue.venueType).slice(0, 4);
  // Handle back navigation
  const handleBack = () => {
    navigate('/book-it/venues');
  };
  // Handle save to favorites
  const handleSave = () => {
    setIsSaved(!isSaved);
  };
  // Handle share functionality
  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      typeof navigator !== "undefined" && navigator.share({
        title: venue.name,
        text: `Check out ${venue.name} on When's The Fun`,
        url: window.location.href
      }).catch(error => {
        console.log('Error sharing:', error);
      });
    } else {
      alert(`Share functionality: ${venue.name}`);
    }
  };
  // Handle booking request submission
  const handleBookingRequest = () => {
    if (!selectedDate) {
      alert('Please select a date for your event');
      return;
    }
    setShowBookingRequestPopup(true);
  };
  // Handle sending a message to the venue
  const handleSendMessage = () => {
    alert(`Opening message thread with ${venue.name}`);
  };
  // Handle booking form submission
  const handleBookingFormSubmit = (data: BookingFormData) => {
    console.log('Booking form submitted:', data);
    setShowBookingRequestPopup(false);
    setShowBookingConfirmation(true);
  };
  // Scroll to section handler
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = typeof document !== "undefined" && document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-gray-700 flex items-center">
              <HomeIcon className="h-4 w-4 mr-1" />
              Home
            </button>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <button onClick={() => navigate('/book')} className="hover:text-gray-700">
              Book It
            </button>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <button onClick={() => navigate('/book-it/venues')} className="hover:text-gray-700">
              Venues
            </button>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium">{venue.name}</span>
          </nav>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <button onClick={handleBack} className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Venues
        </button>
      </div>

      {/* Image Gallery */}
      <ImageGallery images={venue.images} venueName={venue.name} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Venue Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    {venue.name}
                    {venue.verified && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                        Verified Venue
                      </span>}
                  </h1>
                  <div className="flex items-center mt-1 text-gray-600">
                    <MapPinIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <span className="ml-1">{venue.location.address}</span>
                    <a href={`https://maps.google.com/?q=${venue.location.coordinates.lat},${venue.location.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-indigo-600 hover:text-indigo-800 text-sm">
                      Get Directions
                    </a>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={handleSave} className={`p-2 rounded-full ${isSaved ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`} aria-label="Save venue">
                    <HeartIcon className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={handleShare} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600" aria-label="Share venue">
                    <ShareIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center text-amber-500">
                  <StarIcon className="h-5 w-5 fill-current" />
                  <span className="ml-1 font-semibold">{venue.rating}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {venue.reviewCount} reviews
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center text-gray-700">
                  <UsersIcon className="h-5 w-5" />
                  <span className="ml-1 font-semibold">
                    Up to {venue.capacity}
                  </span>
                </div>
                <span className="text-sm text-gray-600">guests</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center text-gray-700">
                  <ClockIcon className="h-5 w-5" />
                  <span className="ml-1 font-semibold">
                    {venue.responseTimeHours}h
                  </span>
                </div>
                <span className="text-sm text-gray-600">response time</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center text-gray-700">
                  <CheckIcon className="h-5 w-5 text-green-500" />
                  <span className="ml-1 font-semibold">
                    {venue.bookingApprovalRate}%
                  </span>
                </div>
                <span className="text-sm text-gray-600">approval rate</span>
              </div>
            </div>

            {/* Section Navigation */}
            <div className="mb-8 border-b border-gray-200 overflow-x-auto">
              <div className="flex space-x-8">
                {[{
                id: 'about',
                label: 'About'
              }, {
                id: 'amenities',
                label: 'Amenities'
              }, {
                id: 'pricing',
                label: 'Pricing'
              }, {
                id: 'availability',
                label: 'Availability'
              }, {
                id: 'space',
                label: 'The Space'
              }, {
                id: 'location',
                label: 'Location'
              }, {
                id: 'reviews',
                label: 'Reviews'
              }].map(section => <button key={section.id} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeSection === section.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => scrollToSection(section.id)}>
                    {section.label}
                  </button>)}
              </div>
            </div>

            {/* About This Space */}
            <section id="about" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Space
              </h2>
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700">{venue.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Space Type
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {venue.venueType}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Best For
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {venue.bestFor.map((type, index) => <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {type}
                      </span>)}
                  </div>
                </div>
              </div>
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Unique Features
                </h3>
                <ul className="space-y-2">
                  {venue.uniqueFeatures.map((feature, index) => <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>)}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  House Rules
                </h3>
                <ul className="space-y-2">
                  {venue.houseRules.map((rule, index) => <li key={index} className="flex items-start">
                      <InfoIcon className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{rule}</span>
                    </li>)}
                </ul>
              </div>
            </section>

            {/* Amenities Section */}
            <AmenitiesSection id="amenities" amenities={venue.amenities} additionalServices={venue.additionalServices} />

            {/* Pricing Section */}
            <PricingSection id="pricing" venue={venue} />

            {/* Availability Calendar */}
            <AvailabilityCalendar id="availability" availabilityByDate={venue.availabilityByDate} selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            {/* The Space (Detailed Specs) */}
            <SpaceDetailsSection id="space" venue={venue} />

            {/* Location & Access */}
            <LocationSection id="location" venue={venue} />

            {/* Reviews Section */}
            <ReviewsSection id="reviews" reviews={venue.reviews} rating={venue.rating} reviewCount={venue.reviewCount} />
          </div>

          {/* Right Column - Booking Widget (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-4">
              <BookingWidget venue={venue} selectedDate={selectedDate} setSelectedDate={setSelectedDate} startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} onBookingRequest={handleBookingRequest} onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>

        {/* Similar Venues Section */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Similar Venues You Might Like
          </h2>
          <SimilarVenues venues={similarVenues} onVenueClick={venueId => navigate(`/book-it/venues/${venueId}`)} />
        </div>
      </div>

      {/* Mobile Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-900">
              ${venue.pricePerHour}/hour
            </div>
            <div className="text-sm text-gray-500">Base rate</div>
          </div>
          <button onClick={() => setShowMobileBooking(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700">
            Check Availability
          </button>
        </div>
      </div>

      {/* Mobile Booking Overlay */}
      {showMobileBooking && <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:hidden">
          <div className="bg-white rounded-t-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-lg">Request to Book</h3>
              <button onClick={() => setShowMobileBooking(false)} className="p-1 rounded-full bg-gray-100 text-gray-600">
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <BookingWidget venue={venue} selectedDate={selectedDate} setSelectedDate={setSelectedDate} startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} onBookingRequest={() => {
            setShowMobileBooking(false);
            handleBookingRequest();
          }} onSendMessage={() => {
            handleSendMessage();
            setShowMobileBooking(false);
          }} />
            </div>
          </div>
        </div>}

      {/* Booking Request Popup */}
      {showBookingRequestPopup && <BookingRequestPopup venueName={venue.name} selectedDate={selectedDate} startTime={startTime} endTime={endTime} onClose={() => setShowBookingRequestPopup(false)} onSubmit={handleBookingFormSubmit} />}

      {/* Booking Confirmation Popup */}
      {showBookingConfirmation && <BookingConfirmationPopup venueName={venue.name} selectedDate={selectedDate} startTime={startTime} endTime={endTime} onClose={() => setShowBookingConfirmation(false)} />}

      {/* Back to top button */}
      <button onClick={() => typeof window !== "undefined" && window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })} className="fixed bottom-20 right-6 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>;
};