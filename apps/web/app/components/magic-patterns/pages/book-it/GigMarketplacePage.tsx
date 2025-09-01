import React, { Children } from 'react';
import { useNavigationContext } from '../../context/NavigationContext';
import { Music, MapPin, Calendar, DollarSign, Users, Search, Filter, ChevronDown, Star, Clock, MessageSquare, Briefcase, CheckCircle, ArrowRight, FileText, Bell } from 'lucide-react';
export const GigMarketplacePage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  // Sample gig listings
  const featuredGigs = [{
    id: 1,
    title: 'Jazz Pianist Needed for Upscale Restaurant',
    location: 'Downtown, Chicago',
    date: 'Every Friday & Saturday',
    time: '7:00 PM - 10:00 PM',
    budget: '$200-300 per night',
    description: 'Seeking an experienced jazz pianist for our upscale dining establishment. Looking for someone who can create a sophisticated atmosphere with a repertoire of jazz standards and tasteful originals.',
    requirements: ['3+ years professional experience', 'Solo piano performance', 'Professional appearance', 'Reliable transportation'],
    venue: {
      name: 'The Blue Note Bistro',
      rating: 4.8,
      reviews: 24
    },
    applicants: 8,
    postedDate: '2 days ago',
    category: 'Music'
  }, {
    id: 2,
    title: 'DJ for Corporate Holiday Party',
    location: 'Marriott Hotel, Atlanta',
    date: 'December 15, 2023',
    time: '8:00 PM - 12:00 AM',
    budget: '$500-750',
    description: 'Tech company seeking DJ for our annual holiday party. Looking for someone who can read the room and play a mix of current hits and classics that will keep employees of all ages engaged.',
    requirements: ['Professional equipment', 'Corporate event experience', 'Ability to take requests', 'Clean, professional appearance'],
    venue: {
      name: 'Marriott Conference Center',
      rating: 4.6,
      reviews: 32
    },
    applicants: 12,
    postedDate: '5 days ago',
    category: 'Music'
  }, {
    id: 3,
    title: 'Live Band for Wedding Reception',
    location: 'Sunset Gardens, San Diego',
    date: 'April 22, 2024',
    time: '6:00 PM - 10:00 PM',
    budget: '$1,500-2,000',
    description: 'Seeking a versatile 4-5 piece band for our wedding reception. We want a band that can play a variety of genres including pop, rock, and some jazz standards. Must be able to learn our first dance song.',
    requirements: ['Full band with vocalist', 'Wedding experience', 'Professional appearance', 'Own equipment and transportation'],
    venue: {
      name: 'Sunset Gardens',
      rating: 4.9,
      reviews: 56
    },
    applicants: 5,
    postedDate: '1 week ago',
    category: 'Music'
  }];
  const recentGigs = [{
    id: 4,
    title: 'Acoustic Guitarist for Coffee Shop',
    location: 'Brew & Bean, Portland',
    date: 'Weekends',
    budget: '$100-150 per session',
    applicants: 3,
    postedDate: '1 day ago',
    category: 'Music'
  }, {
    id: 5,
    title: 'Comedian for Corporate Team Building',
    location: 'Virtual Event',
    date: 'January 15, 2024',
    budget: '$400-600',
    applicants: 7,
    postedDate: '3 days ago',
    category: 'Comedy'
  }, {
    id: 6,
    title: 'String Quartet for Wedding Ceremony',
    location: 'St. James Chapel, Boston',
    date: 'June 10, 2024',
    budget: '$800-1,200',
    applicants: 2,
    postedDate: '4 days ago',
    category: 'Music'
  }, {
    id: 7,
    title: "Magician for Children's Birthday Party",
    location: 'Private Residence, Denver',
    date: 'December 3, 2023',
    budget: '$250-350',
    applicants: 4,
    postedDate: '2 days ago',
    category: 'Entertainment'
  }, {
    id: 8,
    title: 'Salsa Band for Restaurant Grand Opening',
    location: 'Havana Nights, Miami',
    date: 'January 20, 2024',
    budget: '$1,000-1,500',
    applicants: 6,
    postedDate: '1 week ago',
    category: 'Music'
  }];
  const categories = [{
    name: 'Music',
    count: 152,
    icon: <Music className="h-5 w-5" />
  }, {
    name: 'DJ',
    count: 87,
    icon: <HeadphonesIcon className="h-5 w-5" />
  }, {
    name: 'Comedy',
    count: 43,
    icon: <SmileIcon className="h-5 w-5" />
  }, {
    name: 'Magic',
    count: 28,
    icon: <WandIcon className="h-5 w-5" />
  }, {
    name: 'Dance',
    count: 65,
    icon: <MusicIcon className="h-5 w-5" />
  }, {
    name: 'MC/Host',
    count: 39,
    icon: <MicIcon className="h-5 w-5" />
  }];
  const steps = [{
    title: 'Create Your Gig Listing',
    description: 'Describe your event, requirements, and budget to attract the right performers.',
    icon: <FileText className="h-8 w-8 text-teal-600" />
  }, {
    title: 'Receive Proposals',
    description: 'Review detailed proposals from interested performers who match your needs.',
    icon: <MessageSquare className="h-8 w-8 text-teal-600" />
  }, {
    title: 'Choose Your Performer',
    description: 'Compare proposals, check reviews, and select the perfect match for your event.',
    icon: <CheckCircle className="h-8 w-8 text-teal-600" />
  }, {
    title: 'Secure Your Booking',
    description: 'Finalize details and confirm your booking with our secure payment system.',
    icon: <Calendar className="h-8 w-8 text-teal-600" />
  }];
  return <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              Find the Perfect Performer for Your Event
            </h1>
            <p className="text-xl text-teal-100 mb-8">
              Post a gig and receive proposals from talented performers ready to
              make your event unforgettable
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigateTo('/book-it/create-gig')} className="px-8 py-3 bg-white text-teal-600 font-medium rounded-md hover:bg-teal-50 transition-colors">
                Post a Gig
              </button>
              <button onClick={() => navigateTo('/performers')} className="px-8 py-3 bg-teal-700 text-white font-medium rounded-md hover:bg-teal-800 transition-colors">
                Browse Performers
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Search Section */}
      <div className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input type="text" placeholder="Search for gigs..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center text-gray-700 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center text-gray-700 hover:bg-gray-50">
                <MapPin className="h-4 w-4 mr-2" />
                Location
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center text-gray-700 hover:bg-gray-50">
                <Calendar className="h-4 w-4 mr-2" />
                Date
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category, index) => <button key={index} className="flex items-center justify-between w-full px-3 py-2 text-left rounded-md hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="text-gray-500 mr-3">{category.icon}</div>
                      <span>{category.name}</span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {category.count}
                    </span>
                  </button>)}
              </div>
              <div className="border-t border-gray-200 my-6 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Budget</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />
                    <span className="ml-2">Under $100</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />
                    <span className="ml-2">$100 - $300</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />
                    <span className="ml-2">$300 - $500</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />
                    <span className="ml-2">$500 - $1,000</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />
                    <span className="ml-2">$1,000+</span>
                  </label>
                </div>
              </div>
              <div className="border-t border-gray-200 my-6 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Event Type
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />
                    <span className="ml-2">Wedding</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />
                    <span className="ml-2">Corporate Event</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />
                    <span className="ml-2">Private Party</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />
                    <span className="ml-2">Restaurant/Bar</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500" />
                    <span className="ml-2">Festival/Public Event</span>
                  </label>
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors">
                  Apply Filters
                </button>
                <button className="w-full px-4 py-2 text-gray-700 font-medium mt-2">
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Gigs */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Featured Gigs
                </h2>
                <button onClick={() => navigateTo('/book-it/gigs/featured')} className="text-teal-600 font-medium hover:text-teal-800 flex items-center">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
              <div className="space-y-6">
                {featuredGigs.map(gig => <div key={gig.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo(`/book-it/gigs/${gig.id}`)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-block bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                          Featured
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {gig.title}
                        </h3>
                        <div className="flex flex-wrap gap-y-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center mr-4">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            {gig.location}
                          </div>
                          <div className="flex items-center mr-4">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            {gig.date}
                          </div>
                          <div className="flex items-center mr-4">
                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                            {gig.time}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                            {gig.budget}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{gig.applicants} applicants</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{gig.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {gig.requirements.map((req, index) => <span key={index} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {req}
                        </span>)}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">
                            {gig.venue.name}
                          </p>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="ml-1 text-gray-600">
                              {gig.venue.rating} ({gig.venue.reviews} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Posted {gig.postedDate}
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* Recent Gigs */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Recent Gigs
                </h2>
                <button onClick={() => navigateTo('/book-it/gigs/recent')} className="text-teal-600 font-medium hover:text-teal-800 flex items-center">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentGigs.map(gig => <div key={gig.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo(`/book-it/gigs/${gig.id}`)}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {gig.title}
                      </h3>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
                        {gig.category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center mr-4">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        {gig.location}
                      </div>
                      <div className="flex items-center mr-4">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {gig.date}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        {gig.budget}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{gig.applicants} applicants</span>
                      </div>
                      <div className="text-gray-500">
                        Posted {gig.postedDate}
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* How It Works */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Finding the perfect performer for your event is easy with our gig
              marketplace
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* For Performers */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Are You a Performer?
                </h2>
                <p className="text-xl text-teal-100 mb-6">
                  Find gigs, submit proposals, and grow your performance
                  business
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-teal-300 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">
                        Discover Relevant Opportunities
                      </h3>
                      <p className="text-teal-100">
                        Find gigs that match your skills, location, and
                        availability
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Bell className="h-5 w-5 text-teal-300 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">
                        Get Notified About New Gigs
                      </h3>
                      <p className="text-teal-100">
                        Receive alerts when new opportunities matching your
                        profile are posted
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Briefcase className="h-5 w-5 text-teal-300 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">
                        Build Your Performance Business
                      </h3>
                      <p className="text-teal-100">
                        Grow your client base and increase your bookings
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => navigateTo('/performers/register')} className="px-6 py-3 bg-white text-teal-700 font-medium rounded-md hover:bg-teal-50 transition-colors">
                    Join as a Performer
                  </button>
                  <button onClick={() => navigateTo('/performers/tools')} className="px-6 py-3 bg-teal-800 text-white font-medium rounded-md hover:bg-teal-900 transition-colors border border-teal-600">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Musician performing" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-teal-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect Performer?
          </h2>
          <p className="text-xl text-teal-200 mb-8 max-w-3xl mx-auto">
            Post your gig today and start receiving proposals from talented
            performers
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigateTo('/book-it/create-gig')} className="px-8 py-3 bg-white text-teal-700 font-medium rounded-md hover:bg-teal-50 transition-colors">
              Post a Gig
            </button>
            <button onClick={() => navigateTo('/book-it/how-it-works')} className="px-8 py-3 bg-teal-800 text-white font-medium rounded-md hover:bg-teal-900 transition-colors border border-teal-600">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>;
};
// Additional icons needed
const HeadphonesIcon = props => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>;
const SmileIcon = props => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>;
const WandIcon = props => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>;
const MusicIcon = props => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>;
const MicIcon = props => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>;