import React from 'react';
import { useNavigationContext } from '../context/NavigationContext';
import { Search, Calendar, CreditCard, Users, MapPin, Music, Ticket, ShoppingBag, Megaphone } from 'lucide-react';
export const HowItWorksPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const features = [{
    title: 'Discover Events',
    description: "Browse local events, filter by category, date, or location to find exactly what you're looking for.",
    icon: <Search className="h-8 w-8 text-indigo-600" />,
    cta: 'Browse Events',
    link: '/events'
  }, {
    title: 'Book Venues',
    description: 'Find and book the perfect venue for your next event, from intimate spaces to large venues.',
    icon: <MapPin className="h-8 w-8 text-indigo-600" />,
    cta: 'Find Venues',
    link: '/book-it/venues'
  }, {
    title: 'Hire Performers',
    description: 'Connect with talented performers for your event, from musicians and DJs to speakers and entertainers.',
    icon: <Music className="h-8 w-8 text-indigo-600" />,
    cta: 'Find Performers',
    link: '/performers'
  }, {
    title: 'Buy & Sell Tickets',
    description: 'Purchase tickets to events or sell tickets to your own events with our secure ticketing system.',
    icon: <Ticket className="h-8 w-8 text-indigo-600" />,
    cta: 'Manage Tickets',
    link: '/tickets'
  }, {
    title: 'Create Community Calendars',
    description: 'Build and share community calendars to keep your group, organization, or neighborhood informed.',
    icon: <Calendar className="h-8 w-8 text-indigo-600" />,
    cta: 'Explore Calendars',
    link: '/calendars/marketplace'
  }, {
    title: 'Shop Event Gear',
    description: 'Purchase merchandise, equipment, and supplies for your events from our curated marketplace.',
    icon: <ShoppingBag className="h-8 w-8 text-indigo-600" />,
    cta: 'Shop Now',
    link: '/gear'
  }, {
    title: 'Join Communities',
    description: 'Connect with like-minded individuals in interest-based communities and local hubs.',
    icon: <Users className="h-8 w-8 text-indigo-600" />,
    cta: 'Find Communities',
    link: '/hubs'
  }, {
    title: 'Advertise Your Business',
    description: 'Promote your business, event, or service to our engaged audience of event-goers.',
    icon: <Megaphone className="h-8 w-8 text-indigo-600" />,
    cta: 'Learn More',
    link: '/advertise'
  }];
  const steps = [{
    number: '01',
    title: 'Create Your Account',
    description: 'Sign up for a free account to access all of our features. Customize your profile and preferences to get personalized recommendations.'
  }, {
    number: '02',
    title: 'Explore & Discover',
    description: "Browse events, venues, and performers in your area. Use filters to find exactly what you're looking for based on your interests."
  }, {
    number: '03',
    title: 'Book & Purchase',
    description: 'Reserve venues, hire performers, or buy tickets with our secure booking and payment system. All transactions are protected.'
  }, {
    number: '04',
    title: 'Enjoy & Share',
    description: 'Attend events, leave reviews, and share your experiences with the community. Invite friends to join you at upcoming events.'
  }];
  return <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              How Go Event City Works
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Your all-in-one platform for discovering, planning, and enjoying
              events in your community
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigateTo('/signup')} className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-md hover:bg-indigo-50 transition-colors">
                Get Started
              </button>
              <button onClick={() => navigateTo('/events')} className="px-8 py-3 bg-indigo-700 text-white font-medium rounded-md hover:bg-indigo-800 transition-colors">
                Browse Events
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Platform Features */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything You Need in One Place
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Go Event City brings together all the tools you need to discover,
              plan, and enjoy events in your community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button onClick={() => navigateTo(feature.link)} className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                  {feature.cta}
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>)}
          </div>
        </div>
      </div>
      {/* How It Works Steps */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Simple Steps to Get Started
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started with Go Event City is easy. Follow these simple
              steps to begin discovering and enjoying events.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 text-2xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* For Different Users */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              For Everyone in the Event Ecosystem
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Go Event City serves everyone involved in creating and enjoying
              events.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                For Event-Goers
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Discover events based on your interests and location
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Purchase tickets securely through our platform
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Follow favorite venues, performers, and event creators
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Receive personalized event recommendations
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Share events with friends and coordinate attendance
                </li>
              </ul>
              <button onClick={() => navigateTo('/events')} className="mt-6 px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors">
                Find Events
              </button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                For Event Creators & Venues
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  List your venue or create events for free
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Manage bookings, availability, and scheduling
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sell tickets with low processing fees
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Promote your events to a targeted local audience
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Access analytics and insights to grow your business
                </li>
              </ul>
              <button onClick={() => navigateTo('/venues/submit')} className="mt-6 px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors">
                List Your Venue
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience the Fun?
          </h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
            Join thousands of users discovering events, venues, and performers
            in their community.
          </p>
          <button onClick={() => navigateTo('/signup')} className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-md hover:bg-indigo-50 transition-colors">
            Create Your Free Account
          </button>
        </div>
      </div>
    </div>;
};