import React from 'react';
import { useNavigationContext } from '../context/NavigationContext';
import { MapPin, Music, Calendar, Users, CheckCircle, Clock, DollarSign, Star, MessageSquare, Shield, Award, Search } from 'lucide-react';
export const BookingMarketplacePage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const marketplaceFeatures = [{
    title: 'Venue Booking',
    description: 'Find and book the perfect venue for your event, from intimate spaces to large concert halls.',
    icon: <MapPin className="h-8 w-8 text-indigo-600" />,
    path: '/book-it/venues'
  }, {
    title: 'Performer Booking',
    description: 'Discover and hire talented performers for your event, from musicians to speakers.',
    icon: <Music className="h-8 w-8 text-indigo-600" />,
    path: '/book-it/performers'
  }, {
    title: 'Event Services',
    description: 'Connect with event service providers for catering, photography, decor, and more.',
    icon: <Users className="h-8 w-8 text-indigo-600" />,
    path: '/book-it/services'
  }, {
    title: 'Equipment Rental',
    description: 'Rent sound systems, lighting, staging, and other equipment for your event.',
    icon: <DollarSign className="h-8 w-8 text-indigo-600" />,
    path: '/book-it/equipment'
  }];
  const venueCategories = ['Concert Halls', 'Theaters', 'Event Spaces', 'Restaurants & Bars', 'Outdoor Venues', 'Galleries & Museums', 'Studios', 'Conference Centers', 'Unique Spaces', 'Private Venues', 'Rooftops', 'Wedding Venues'];
  const performerTypes = ['Musicians & Bands', 'DJs', 'Comedians', 'Speakers', 'Dancers', 'Magicians', 'Actors', 'Performance Artists', 'MCs & Hosts', 'Cultural Performers', 'Tribute Acts', 'Specialty Acts'];
  const benefits = [{
    title: 'Secure Booking',
    description: 'Our secure booking system protects both parties with contracts, deposits, and payment protection.',
    icon: <Shield className="h-5 w-5 text-green-500 mt-1 mr-3" />
  }, {
    title: 'Verified Listings',
    description: 'All venues and performers are verified to ensure quality and reliability.',
    icon: <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
  }, {
    title: 'Direct Communication',
    description: 'Connect directly with venues and performers through our messaging system.',
    icon: <MessageSquare className="h-5 w-5 text-green-500 mt-1 mr-3" />
  }, {
    title: 'Transparent Pricing',
    description: 'Clear pricing information with no hidden fees or surprises.',
    icon: <DollarSign className="h-5 w-5 text-green-500 mt-1 mr-3" />
  }, {
    title: 'Flexible Scheduling',
    description: 'Easy-to-use calendar system to check availability and schedule bookings.',
    icon: <Calendar className="h-5 w-5 text-green-500 mt-1 mr-3" />
  }, {
    title: 'Trusted Reviews',
    description: 'Read verified reviews from past clients to make informed decisions.',
    icon: <Star className="h-5 w-5 text-green-500 mt-1 mr-3" />
  }];
  const testimonials = [{
    quote: 'The Booking Marketplace made finding and securing a venue for our corporate event incredibly easy. We found the perfect space within our budget, and the booking process was seamless.',
    author: 'Jennifer Martinez',
    role: 'Event Coordinator, TechCorp',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }, {
    quote: "As a venue owner, the platform has connected us with clients we wouldn't have reached otherwise. The calendar management and payment processing features have streamlined our operations significantly.",
    author: 'Michael Chen',
    role: 'Owner, The Grand Hall',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }, {
    quote: "I found an amazing jazz band for my wedding through When's The Fun. The ability to browse videos of their performances and read reviews from other clients made the decision easy.",
    author: 'David Wilson',
    role: 'Private Event Client',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }];
  const faqs = [{
    question: 'How does the booking process work?',
    answer: 'The booking process is simple: Search for venues or performers that match your criteria, check their availability on the calendar, send a booking request with your event details, and wait for confirmation. Once confirmed, you can secure the booking with a deposit through our secure payment system.'
  }, {
    question: 'Are there any fees for using the Booking Marketplace?',
    answer: 'For event planners and individuals booking venues or performers, there are no fees to search or browse. A small service fee is added at checkout to cover payment processing and platform maintenance. Venues and performers pay a commission on bookings received through the platform.'
  }, {
    question: 'What happens if I need to cancel a booking?',
    answer: 'Cancellation policies vary by venue and performer. Each listing includes detailed cancellation terms that are agreed upon at the time of booking. Our platform helps facilitate refunds according to these policies when cancellations occur.'
  }, {
    question: 'How are venues and performers verified?',
    answer: 'We have a comprehensive verification process that includes identity verification, business documentation review, and in some cases, physical site visits for venues. We also collect and verify reviews from real customers to ensure quality.'
  }, {
    question: 'Can I negotiate prices or request custom packages?',
    answer: 'Yes! While many listings have standard pricing, you can always message the venue or performer directly to discuss custom requirements, special packages, or negotiate rates for your specific event needs.'
  }];
  const stats = [{
    metric: '5,000+',
    description: 'Venues available for booking'
  }, {
    metric: '12,000+',
    description: 'Performers and service providers'
  }, {
    metric: '98%',
    description: 'Booking satisfaction rate'
  }, {
    metric: '50,000+',
    description: 'Successful bookings annually'
  }];
  return <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              Booking Marketplace
            </h1>
            <p className="text-xl text-teal-100 mb-8">
              Find and book venues, performers, and services for your next event
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigateTo('/book-it/venues')} className="px-8 py-3 bg-white text-teal-600 font-medium rounded-md hover:bg-teal-50 transition-colors">
                Find Venues
              </button>
              <button onClick={() => navigateTo('/book-it/performers')} className="px-8 py-3 bg-teal-700 text-white font-medium rounded-md hover:bg-teal-800 transition-colors">
                Book Performers
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Marketplace Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything You Need for Your Event
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our marketplace connects you with venues, performers, and services
              to make your event a success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {marketplaceFeatures.map((feature, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigateTo(feature.path)}>
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center" onClick={e => {
              e.stopPropagation();
              navigateTo(feature.path);
            }}>
                  Explore
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>)}
          </div>
        </div>
      </div>
      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {stat.metric}
                </div>
                <p className="text-gray-600">{stat.description}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Venue Categories */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Explore Venue Categories
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Find the perfect space for your event from our diverse selection
              of venues
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {venueCategories.map((category, index) => <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigateTo(`/book-it/venues?category=${category.toLowerCase().replace(/\s+/g, '-')}`)}>
                <p className="font-medium text-gray-900">{category}</p>
              </div>)}
          </div>
          <div className="mt-12 text-center">
            <button onClick={() => navigateTo('/book-it/venues')} className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center">
              Browse All Venues
              <MapPin className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {/* Performer Types */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Discover Performers
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Find the perfect entertainment for your event from our talented
              performers
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {performerTypes.map((type, index) => <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigateTo(`/book-it/performers?category=${type.toLowerCase().replace(/\s+/g, '-')}`)}>
                <p className="font-medium text-gray-900">{type}</p>
              </div>)}
          </div>
          <div className="mt-12 text-center">
            <button onClick={() => navigateTo('/book-it/performers')} className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center">
              Browse All Performers
              <Music className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {/* How It Works */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our booking process is simple, secure, and designed to make your
              event planning easier
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
            step: '01',
            title: 'Search & Compare',
            description: 'Browse venues and performers filtered by your specific requirements and budget.',
            icon: <Search className="h-8 w-8 text-indigo-600" />
          }, {
            step: '02',
            title: 'Check Availability',
            description: 'View real-time calendars to find available dates that work for your event.',
            icon: <Calendar className="h-8 w-8 text-indigo-600" />
          }, {
            step: '03',
            title: 'Request Booking',
            description: 'Send booking requests with your event details directly through our platform.',
            icon: <MessageSquare className="h-8 w-8 text-indigo-600" />
          }, {
            step: '04',
            title: 'Confirm & Pay',
            description: 'Secure your booking with our safe payment system and digital contracts.',
            icon: <CheckCircle className="h-8 w-8 text-indigo-600" />
          }].map((step, index) => <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                  {step.icon}
                </div>
                <div className="text-sm font-medium text-indigo-600 mb-2">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Benefits */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Use Our Booking Marketplace
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our platform offers unique advantages that make the booking
                process smoother, safer, and more efficient for everyone
                involved.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => <div key={index} className="flex items-start">
                    {benefit.icon}
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>)}
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Event planning" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
      {/* Testimonials */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              What Our Users Say
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from event planners, venue owners, and performers who use our
              marketplace
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img src={testimonial.image} alt={testimonial.author} className="h-12 w-12 rounded-full object-cover mr-4" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex text-yellow-400">
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                    <Star className="h-5 w-5 fill-current" />
                  </div>
                </div>
                <p className="text-gray-800">"{testimonial.quote}"</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* FAQs */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our booking marketplace
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {faqs.map((faq, index) => <div key={index}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>)}
            </div>
          </div>
        </div>
      </div>
      {/* For Vendors Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-700 rounded-lg overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Are You a Venue Owner or Performer?
                </h2>
                <p className="text-xl text-indigo-200 mb-6">
                  Join our marketplace to reach more clients and grow your
                  business
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <Award className="h-5 w-5 text-indigo-300 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Increase Your Visibility</h3>
                      <p className="text-indigo-200">
                        Reach thousands of potential clients looking for venues
                        and performers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-indigo-300 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Streamline Your Bookings</h3>
                      <p className="text-indigo-200">
                        Manage your calendar, bookings, and payments all in one
                        place
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 text-indigo-300 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Grow Your Revenue</h3>
                      <p className="text-indigo-200">
                        Fill more dates and increase your bookings with our
                        platform
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => navigateTo('/venues/submit')} className="px-6 py-3 bg-white text-indigo-700 font-medium rounded-md hover:bg-indigo-50 transition-colors">
                    List Your Venue
                  </button>
                  <button onClick={() => navigateTo('/performers/register')} className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-800 transition-colors border border-white">
                    Register as a Performer
                  </button>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Venue owners and performers" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find the Perfect Venue or Performer?
          </h2>
          <p className="text-xl text-teal-200 mb-8 max-w-3xl mx-auto">
            Start exploring our marketplace today and make your next event
            unforgettable
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigateTo('/book-it/venues')} className="px-8 py-3 bg-white text-teal-700 font-medium rounded-md hover:bg-teal-50 transition-colors">
              Find Venues
            </button>
            <button onClick={() => navigateTo('/book-it/performers')} className="px-8 py-3 bg-teal-800 text-white font-medium rounded-md hover:bg-teal-900 transition-colors border border-teal-600">
              Book Performers
            </button>
          </div>
        </div>
      </div>
    </div>;
};