import React from 'react';
import { useNavigationContext } from '../../context/NavigationContext';
import { ArrowRight, BarChart, Calendar, CheckCircle, ChevronLeft, Clock, DollarSign, MapPin, Star, Users, Building, Image, MessageSquare, Zap } from 'lucide-react';
export const UrbanLoftPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const results = [{
    metric: '200%',
    description: 'Increase in bookings within 3 months',
    icon: <Calendar className="h-8 w-8 text-blue-600" />
  }, {
    metric: '85%',
    description: 'Occupancy rate achieved',
    icon: <Building className="h-8 w-8 text-blue-600" />
  }, {
    metric: '4.9/5',
    description: 'Average client satisfaction rating',
    icon: <Star className="h-8 w-8 text-blue-600" />
  }, {
    metric: '68%',
    description: 'Increase in revenue',
    icon: <DollarSign className="h-8 w-8 text-blue-600" />
  }];
  const strategies = [{
    title: 'Professional Photography Investment',
    description: "Hired a professional photographer to showcase the venue's unique industrial-chic aesthetic and flexible layout options."
  }, {
    title: 'Targeted Event Packages',
    description: 'Created specialized packages for different event types (corporate, wedding, social) with clear pricing and inclusions.'
  }, {
    title: 'Responsive Inquiry Management',
    description: 'Implemented a policy to respond to all booking inquiries within 2 hours, with personalized messages addressing specific needs.'
  }, {
    title: 'Local Vendor Partnerships',
    description: 'Formed partnerships with caterers, decorators, and event planners to offer comprehensive packages and referral benefits.'
  }, {
    title: 'Data-Driven Pricing Strategy',
    description: 'Used platform analytics to optimize pricing based on seasonality, day of week, and market demand.'
  }];
  const testimonials = [{
    quote: "When's The Fun completely changed our business trajectory. As a new venue without an established reputation, the platform gave us immediate visibility to the right audience.",
    author: 'Michael Rodriguez',
    role: 'Owner, The Urban Loft'
  }, {
    quote: 'The analytics tools helped us understand our market and optimize our offerings. We could see exactly what types of events were in demand and adjust our packages accordingly.',
    author: 'Sarah Johnson',
    role: 'Events Manager, The Urban Loft'
  }];
  return <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-indigo-600">
        <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="The Urban Loft venue space" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
          <div className="mb-6">
            <button onClick={() => navigateTo('/success-stories')} className="inline-flex items-center text-white hover:text-blue-200 transition-colors">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Success Stories
            </button>
          </div>
          <div>
            <span className="inline-block bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
              Venue Owner Success Story
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              The Urban Loft: From New Venue to Booked Solid in 3 Months
            </h1>
            <div className="flex items-center text-white text-lg">
              <Building className="h-5 w-5 mr-2" />
              <span className="mr-6">Event Space</span>
              <MapPin className="h-5 w-5 mr-2" />
              <span className="mr-6">Denver, CO</span>
              <Users className="h-5 w-5 mr-2" />
              <span>Capacity: 150 guests</span>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Article */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg max-w-none">
              <h2>The Challenge</h2>
              <p>
                When Michael Rodriguez and his team renovated a former
                industrial space into The Urban Loft, they faced the classic new
                venue dilemma: how to build credibility, attract clients, and
                establish a reputation in a competitive market with no track
                record or reviews.
              </p>
              <p>
                Located in Denver's RiNo Arts District, The Urban Loft offered a
                beautiful industrial-chic aesthetic with exposed brick, large
                windows, and flexible configurations. Despite the quality of
                their space and competitive pricing, they struggled to gain
                traction during their first two months of operation.
              </p>
              <p>Key challenges included:</p>
              <ul>
                <li>No established reputation or reviews as a new venue</li>
                <li>Strong competition from established venues in the area</li>
                <li>
                  Limited marketing budget after significant renovation costs
                </li>
                <li>
                  Difficulty showcasing the venue's versatility to potential
                  clients
                </li>
                <li>
                  No established processes for inquiry management and booking
                </li>
              </ul>
              <h2>The Solution</h2>
              <p>
                In March 2022, The Urban Loft team partnered with When's The Fun
                to implement a comprehensive venue marketing and management
                strategy:
              </p>
              <h3>Professional Profile Development</h3>
              <p>
                They invested in professional photography that showcased the
                venue in different configurations (wedding ceremony, corporate
                meeting, cocktail reception) and created a detailed profile
                highlighting their unique features, amenities, and technical
                specifications.
              </p>
              <h3>Strategic Pricing and Packages</h3>
              <p>
                Working with the platform's venue specialists, they developed
                targeted packages for different event types with transparent
                pricing and clear inclusions. They offered introductory rates
                and special promotions for first-time clients to build their
                booking calendar and review base.
              </p>
              <h3>Responsive Inquiry Management</h3>
              <p>
                The team committed to responding to all platform inquiries
                within two hours, with personalized messages addressing the
                specific needs mentioned in each request. They used the
                platform's messaging system to maintain all communication in one
                place and track conversation history.
              </p>
              <h3>Local Vendor Network</h3>
              <p>
                They built partnerships with local caterers, decorators, and
                event planners who were also on the platform, creating a network
                of preferred vendors and mutual referrals that added value for
                clients seeking comprehensive event solutions.
              </p>
              <h3>Data-Driven Optimization</h3>
              <p>
                Using the platform's analytics tools, they tracked which event
                types generated the most inquiries and highest conversion rates,
                allowing them to refine their offerings and marketing approach
                based on real market demand.
              </p>
              <h2>The Results</h2>
              <p>
                Within three months of implementing these strategies, The Urban
                Loft transformed from an unknown venue to one of the most
                sought-after event spaces in the area:
              </p>
              <ul>
                <li>
                  <strong>200% increase in booking inquiries</strong> compared
                  to their first two months
                </li>
                <li>
                  <strong>85% occupancy rate achieved</strong> for weekend
                  dates, with weekday bookings growing steadily
                </li>
                <li>
                  <strong>4.9/5 average rating</strong> from clients who booked
                  through the platform
                </li>
                <li>
                  <strong>68% increase in revenue</strong> compared to projected
                  figures
                </li>
                <li>
                  <strong>Diversified event portfolio</strong> including
                  corporate events (40%), weddings (30%), and social gatherings
                  (30%)
                </li>
              </ul>
              <h2>Key Strategies for Success</h2>
              <p>
                The Urban Loft's rapid success wasn't just about listing their
                venue—it was about how they leveraged the platform's tools and
                implemented best practices:
              </p>
            </div>
            {/* Strategies Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {strategies.map((strategy, index) => <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {strategy.title}
                  </h3>
                  <p className="text-gray-600">{strategy.description}</p>
                </div>)}
            </div>
            {/* Conclusion */}
            <div className="mt-12 prose prose-lg max-w-none">
              <h2>Looking Forward</h2>
              <p>
                With a solid foundation established, The Urban Loft is now
                focused on growth and refinement. They've expanded their team to
                include a dedicated events manager and are investing in
                additional amenities based on client feedback gathered through
                the platform.
              </p>
              <p>
                "We're now in a position to be selective about the events we
                host and focus on maximizing revenue rather than just filling
                the calendar," says Michael. "The platform continues to be our
                primary source of quality leads and bookings."
              </p>
              <blockquote>
                <p>
                  "As a new venue without an established reputation, When's The
                  Fun gave us immediate visibility to our target market. The
                  platform didn't just help us find clients—it helped us build
                  our entire business model."
                </p>
                <footer>— Michael Rodriguez, Owner, The Urban Loft</footer>
              </blockquote>
            </div>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Results Summary */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Results at a Glance
              </h3>
              <div className="space-y-6">
                {results.map((result, index) => <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">{result.icon}</div>
                    <div className="ml-4">
                      <p className="text-3xl font-bold text-blue-600">
                        {result.metric}
                      </p>
                      <p className="text-gray-600">{result.description}</p>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* Testimonials */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                What They're Saying
              </h3>
              <div className="space-y-6">
                {testimonials.map((testimonial, index) => <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-gray-600 italic mb-2">
                      "{testimonial.quote}"
                    </p>
                    <p className="font-medium text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>)}
              </div>
            </div>
            {/* Venue Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                About the Venue
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Building className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Venue Type</p>
                    <p className="text-gray-600">Industrial-chic event space</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">
                      RiNo Arts District, Denver, CO
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Capacity</p>
                    <p className="text-gray-600">150 seated, 200 standing</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Image className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Features</p>
                    <p className="text-gray-600">
                      Exposed brick, large windows, flexible layout, A/V
                      equipment, catering kitchen
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Event Types</p>
                    <p className="text-gray-600">
                      Corporate events, weddings, social gatherings, photo
                      shoots
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Own or manage a venue?</h3>
              <p className="mb-6">
                Learn how When's The Fun can help you increase bookings and
                revenue for your space.
              </p>
              <button onClick={() => navigateTo('/venues/submit')} className="w-full bg-white text-blue-600 font-medium py-2 px-4 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center">
                List Your Venue
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Related Success Stories */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Explore More Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigateTo('/success-stories/sunset-music-festival')}>
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Sunset Music Festival crowd" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                  Event Organizer
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  How Sunset Music Festival Increased Attendance by 40%
                </h3>
                <p className="text-gray-600 mb-4">
                  Learn how this annual music festival used When's The Fun to
                  expand their reach and attract new attendees.
                </p>
                <button className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                  Read Story
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigateTo('/success-stories/jazz-quartet')}>
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Jazz Quartet performing" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                  Performer
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Jazz Quartet Quintuples Bookings Through Performer Profile
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover how this local jazz group leveraged our platform to
                  find new venues and grow their fanbase.
                </p>
                <button className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                  Read Story
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigateTo('/success-stories/food-festival')}>
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Food festival vendors" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <span className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                  Event Organizer
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Food Festival Doubles Vendor Applications with Platform Tools
                </h3>
                <p className="text-gray-600 mb-4">
                  How a local food festival streamlined vendor management and
                  expanded their event.
                </p>
                <button className="text-blue-600 font-medium hover:text-blue-800 flex items-center">
                  Read Story
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Grow Your Venue Business?
          </h2>
          <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Join hundreds of venue owners who are increasing bookings and
            revenue with When's The Fun
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigateTo('/venues/submit')} className="px-8 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 transition-colors">
              List Your Venue
            </button>
            <button onClick={() => navigateTo('/contact')} className="px-8 py-3 bg-blue-800 text-white font-medium rounded-md hover:bg-blue-900 transition-colors border border-blue-600">
              Talk to Our Team
            </button>
          </div>
        </div>
      </div>
    </div>;
};