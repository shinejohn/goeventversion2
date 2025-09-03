import React from 'react';
import { ArrowRightIcon, CalendarIcon, MapPinIcon, MusicIcon, BuildingIcon, CheckCircleIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
export const BookItPage = () => {
  const navigate = useNavigate();
  const bookingCategories = [{
    title: 'Book a Venue',
    description: 'Find and reserve the perfect space for your event',
    path: '/book-it/venues',
    icon: <BuildingIcon className="h-10 w-10 text-purple-600" />
  }, {
    title: 'Book a Performer',
    description: 'Hire musicians, DJs, comedians and more for your event',
    path: '/book-it/performers',
    icon: <MusicIcon className="h-10 w-10 text-purple-600" />
  }, {
    title: 'Post a Gig',
    description: 'Let performers know about your opportunity',
    path: '/book-it/post-gig',
    icon: <CalendarIcon className="h-10 w-10 text-purple-600" />
  }];
  // How it works steps
  const howItWorksSteps = [{
    title: 'Tell us about your event',
    description: "Share your event details, including date, location, budget, and what you're looking for"
  }, {
    title: 'Browse options or get matched',
    description: 'Explore available venues and performers, or let us match you with the perfect fit'
  }, {
    title: 'Connect and book',
    description: 'Message directly with venues and performers, then book securely through our platform'
  }, {
    title: 'Enjoy your event',
    description: 'Focus on your event while we handle the details and ensure everything runs smoothly'
  }];
  // Success stories
  const successStories = [{
    name: 'Sarah M.',
    role: 'Wedding Planner',
    quote: "Book It made finding the perfect venue and band for my client's wedding so easy. The direct messaging feature saved me hours of phone calls.",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }, {
    name: 'Mike T.',
    role: 'Restaurant Owner',
    quote: "I've found amazing local musicians for our weekend performances. The booking process is streamlined and professional.",
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }, {
    name: 'The Sunset Vibes',
    role: 'Local Band',
    quote: "Since joining the platform, we've doubled our bookings. The gig alerts help us find opportunities we would have missed otherwise.",
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }];
  // Safe navigation handler
  const handleNavigation = (path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback direct navigation
      window.location.href = path;
    }
  };
  return <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-900 bg-opacity-50 mb-4">
              NEW
            </span>
            <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">
              Book It: One-Stop Event Planning
            </h1>
            <p className="mt-3 text-xl max-w-3xl mx-auto">
              Find and book venues and performers for your next event with our
              streamlined booking platform
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => handleNavigation('/book-it/venues')} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50">
                <BuildingIcon className="h-5 w-5 mr-2" />
                Find a Venue
              </button>
              <button onClick={() => handleNavigation('/book/performer')} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50">
                <MusicIcon className="h-5 w-5 mr-2" />
                Book a Performer
              </button>
              <button onClick={() => handleNavigation('/book-it/create-gig')} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                Post a Gig
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Booking Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            What would you like to book?
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose an option to get started with your event planning
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bookingCategories.map((category, index) => <div key={index} className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-all cursor-pointer text-center" onClick={() => handleNavigation(category.path)}>
              <div className="flex justify-center mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {category.title}
              </h3>
              <p className="text-gray-600 mb-6">{category.description}</p>
              <button className="text-purple-600 hover:text-purple-800 font-medium flex items-center justify-center mx-auto" onClick={e => {
            e.stopPropagation();
            handleNavigation(category.path);
          }}>
                Get Started
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </button>
            </div>)}
        </div>
      </div>
      {/* How It Works */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">
              Our simple process makes event planning easy
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => <div key={index} className="relative">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 h-full">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-800 text-xl font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < howItWorksSteps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRightIcon className="h-8 w-8 text-gray-300" />
                  </div>}
              </div>)}
          </div>
          <div className="text-center mt-12">
            <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700" onClick={() => handleNavigation('/book-it/how-it-works')}>
              Learn More About Our Process
            </button>
          </div>
        </div>
      </div>
      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Use Book It?</h2>
          <p className="mt-4 text-xl text-gray-600">
            The easiest way to plan and book your event
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                <CheckCircleIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Verified Providers
            </h3>
            <p className="text-gray-600">
              All venues and performers are verified with reviews from real
              customers
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Secure Booking
            </h3>
            <p className="text-gray-600">
              Protected payments and contractual agreements for peace of mind
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Streamlined Process
            </h3>
            <p className="text-gray-600">
              Save time with our all-in-one platform for finding, comparing, and
              booking
            </p>
          </div>
        </div>
      </div>
      {/* Testimonials */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Success Stories
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Hear from people who've used Book It
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-4">
                  <img src={story.image} alt={story.name} className="h-12 w-12 rounded-full mr-4" />
                  <div>
                    <h3 className="font-bold text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-600">{story.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{story.quote}"</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to plan your event?
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join thousands of event planners who've simplified their booking
          process with Book It
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-sm" onClick={() => handleNavigation('/book-it/start')}>
            Start Planning
          </button>
          <button className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-md shadow-sm border border-gray-300" onClick={() => handleNavigation('/book-it/how-it-works')}>
            Learn More
          </button>
        </div>
      </div>
    </div>;
};