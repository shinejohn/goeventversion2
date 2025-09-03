import React from 'react';
import { useNavigate } from 'react-router';
import { Award, Star, Calendar, MapPin, Music, Users, TrendingUp, ArrowRight, Quote, Heart, PlayCircle } from 'lucide-react';
export const SuccessStoriesPage = () => {
  const navigate = useNavigate();
  const featuredStories = [{
    title: 'How Sunset Music Festival Increased Attendance by 40%',
    category: 'Event Organizer',
    description: "Learn how this annual music festival used When's The Fun to expand their reach and attract new attendees.",
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    path: '/success-stories/sunset-music-festival'
  }, {
    title: 'The Urban Loft: From New Venue to Booked Solid in 3 Months',
    category: 'Venue Owner',
    description: 'See how this boutique event space used our platform to quickly establish themselves in a competitive market.',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    path: '/success-stories/urban-loft'
  }, {
    title: 'Jazz Quartet Quintuples Bookings Through Performer Profile',
    category: 'Performer',
    description: 'Discover how this local jazz group leveraged our platform to find new venues and grow their fanbase.',
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    path: '/success-stories/jazz-quartet'
  }];
  const successMetrics = [{
    metric: '40%',
    description: 'Average increase in event attendance'
  }, {
    metric: '3.5x',
    description: 'Average ROI for advertising clients'
  }, {
    metric: '85%',
    description: 'Venues reporting increased bookings'
  }, {
    metric: '90%',
    description: 'Client satisfaction rate'
  }];
  const testimonials = [{
    quote: "When's The Fun transformed our business. As a small venue in a competitive market, we struggled to get noticed. Within three months of listing on the platform, our bookings increased by 200% and we're now regularly hosting events we never would have connected with otherwise.",
    author: 'Sarah Johnson',
    role: 'Owner, The Emerald Room',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }, {
    quote: "The analytics tools have been invaluable for understanding our audience. We've been able to tailor our event offerings based on actual data, resulting in a 40% increase in ticket sales and much higher attendee satisfaction.",
    author: 'Michael Chen',
    role: 'Director, Citywide Arts Festival',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }, {
    quote: "As a touring musician, finding venues used to be my biggest challenge. Now I can book an entire tour through When's The Fun, connecting with venues that match my style and audience. My income has stabilized and I'm playing better venues than ever before.",
    author: 'Elena Rodriguez',
    role: 'Independent Musician',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }];
  const categories = [{
    title: 'Event Organizers',
    description: 'Success stories from events of all sizes',
    icon: <Calendar className="h-8 w-8 text-indigo-600" />,
    path: '/success-stories/categories/event-organizers'
  }, {
    title: 'Venue Owners',
    description: 'How venues are growing their business',
    icon: <MapPin className="h-8 w-8 text-indigo-600" />,
    path: '/success-stories/categories/venue-owners'
  }, {
    title: 'Performers',
    description: 'Artists and entertainers finding new opportunities',
    icon: <Music className="h-8 w-8 text-indigo-600" />,
    path: '/success-stories/categories/performers'
  }, {
    title: 'Communities',
    description: 'How local communities are being transformed',
    icon: <Users className="h-8 w-8 text-indigo-600" />,
    path: '/success-stories/categories/communities'
  }];
  const caseStudies = [{
    title: 'Downtown Revival: How Arts Events Transformed a City Center',
    category: 'Community Impact',
    description: 'This comprehensive case study examines how a series of coordinated arts events helped revitalize a struggling downtown district, increasing foot traffic by 65% and leading to 12 new business openings.',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    metrics: ['65% increase in downtown foot traffic', '12 new businesses opened', '32% increase in weekend revenue for existing businesses'],
    path: '/success-stories/downtown-revival'
  }, {
    title: 'From Local Band to Regional Sensation: The Story of Midnight Echo',
    category: 'Performer Success',
    description: "Follow the journey of indie band Midnight Echo as they used When's The Fun to expand from local gigs to becoming a regional touring act, growing their audience and income substantially over 18 months.",
    image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    metrics: ['300% increase in booking requests', 'Expanded from 3 to 22 cities', 'Grew average audience size from 75 to 350 people'],
    path: '/success-stories/midnight-echo'
  }];
  const recentStories = [{
    title: 'How a Community Calendar Brought a Neighborhood Together',
    category: 'Community Impact',
    date: 'June 15, 2023',
    path: '/success-stories/neighborhood-calendar'
  }, {
    title: 'Virtual Event Platform Helps Charity Raise Record Donations',
    category: 'Event Organizer',
    date: 'May 28, 2023',
    path: '/success-stories/virtual-charity-event'
  }, {
    title: 'Historic Theater Finds New Audience Through Digital Marketing',
    category: 'Venue Owner',
    date: 'May 10, 2023',
    path: '/success-stories/historic-theater'
  }, {
    title: 'Food Festival Doubles Vendor Applications with Platform Tools',
    category: 'Event Organizer',
    date: 'April 22, 2023',
    path: '/success-stories/food-festival'
  }, {
    title: 'DJ Collective Creates Successful Event Series From Scratch',
    category: 'Performer',
    date: 'April 5, 2023',
    path: '/success-stories/dj-collective'
  }];
  return <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              Success Stories
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Real results from real clients using When's The Fun to grow their
              events, venues, and performances
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigate('/success-stories/categories')} className="px-8 py-3 bg-white text-purple-600 font-medium rounded-md hover:bg-purple-50 transition-colors">
                Browse Stories
              </button>
              <button onClick={() => navigate('/contact')} className="px-8 py-3 bg-purple-700 text-white font-medium rounded-md hover:bg-purple-800 transition-colors">
                Share Your Story
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Featured Success Stories */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Success Stories
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how businesses and individuals are achieving remarkable
              results
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredStories.map((story, index) => <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(story.path)}>
                <div className="h-48 overflow-hidden relative">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {story.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{story.description}</p>
                  <button className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center" onClick={e => {
                e.stopPropagation();
                navigate(story.path);
              }}>
                    Read Full Story
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* Success Metrics */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Real Results</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our clients consistently achieve impressive outcomes with our
              platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {successMetrics.map((metric, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {metric.metric}
                </div>
                <p className="text-gray-600">{metric.description}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Video Testimonial Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Hear From Our Clients
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                The Emerald Room went from a struggling venue to a thriving
                events space in just six months after joining When's The Fun.
                Owner Sarah Johnson shares her journey and the strategies that
                led to their success.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      200% Increase in Bookings
                    </h3>
                    <p className="text-gray-600">
                      From 5-8 events per month to 15-20 events
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      New Client Demographics
                    </h3>
                    <p className="text-gray-600">
                      Expanded from corporate events to diverse event types
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      4.9/5 Average Rating
                    </h3>
                    <p className="text-gray-600">
                      Maintained quality while scaling operations
                    </p>
                  </div>
                </div>
              </div>
              <button onClick={() => navigate('/success-stories/emerald-room')} className="mt-6 px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors">
                Read Full Case Study
              </button>
            </div>
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl bg-gray-900 flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="The Emerald Room venue" className="absolute inset-0 w-full h-full object-cover opacity-80" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm mb-4 cursor-pointer hover:bg-white/30 transition-colors">
                  <PlayCircle className="h-12 w-12 text-white" />
                </div>
                <p className="text-white font-medium">Watch Sarah's Story</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Browse By Category
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Explore success stories relevant to your business or interests
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(category.path)}>
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {category.title}
                </h3>
                <p className="text-gray-600">{category.description}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Testimonials */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Client Testimonials
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Hear directly from the people who have transformed their
              businesses with When's The Fun
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4 text-indigo-600">
                  <Quote className="h-8 w-8" />
                </div>
                <p className="text-gray-800 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img src={testimonial.image} alt={testimonial.author} className="h-12 w-12 rounded-full object-cover mr-4" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* Case Studies */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              In-Depth Case Studies
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Detailed analyses of how our clients achieved exceptional results
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(study.path)}>
                <div className="h-48 overflow-hidden relative">
                  <img src={study.image} alt={study.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {study.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {study.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{study.description}</p>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Key Results:
                    </h4>
                    <ul className="space-y-1">
                      {study.metrics.map((metric, metricIndex) => <li key={metricIndex} className="text-sm text-gray-600 flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <Award className="h-4 w-4 text-indigo-600" />
                          </div>
                          <span className="ml-2">{metric}</span>
                        </li>)}
                    </ul>
                  </div>
                  <button className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center" onClick={e => {
                e.stopPropagation();
                navigate(study.path);
              }}>
                    Read Case Study
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* Recent Stories */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Success Stories
            </h2>
            <button onClick={() => navigate('/success-stories/all')} className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
              View All Stories
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            {recentStories.map((story, index) => <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between" onClick={() => navigate(story.path)}>
                <div>
                  <div className="text-sm text-indigo-600 mb-1">
                    {story.category}
                  </div>
                  <h3 className="font-medium text-gray-900">{story.title}</h3>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-4">
                    {story.date}
                  </span>
                  <ArrowRight className="h-4 w-4 text-indigo-600" />
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* Share Your Story */}
      <div className="py-16 bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-12 w-12 mx-auto mb-6 text-pink-400" />
          <h2 className="text-3xl font-bold mb-4">
            Have a Success Story to Share?
          </h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
            We'd love to hear how When's The Fun has helped your business or
            event. Share your story with us and you might be featured on our
            website!
          </p>
          <button onClick={() => navigate('/contact')} className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-md hover:bg-indigo-50 transition-colors">
            Share Your Story
          </button>
        </div>
      </div>
    </div>;
};