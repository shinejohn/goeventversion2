import React from 'react';
import { useNavigationContext } from '../../context/NavigationContext';
import { ArrowRight, BarChart, Calendar, CheckCircle, ChevronLeft, Clock, DollarSign, MapPin, Music, Star, Users } from 'lucide-react';
export const SunsetMusicFestivalPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const results = [{
    metric: '40%',
    description: 'Increase in attendance',
    icon: <Users className="h-8 w-8 text-indigo-600" />
  }, {
    metric: '65%',
    description: 'Increase in ticket revenue',
    icon: <DollarSign className="h-8 w-8 text-indigo-600" />
  }, {
    metric: '3.2x',
    description: 'Return on marketing spend',
    icon: <BarChart className="h-8 w-8 text-indigo-600" />
  }, {
    metric: '28%',
    description: 'Increase in new attendees',
    icon: <Star className="h-8 w-8 text-indigo-600" />
  }];
  const strategies = [{
    title: 'Targeted Digital Marketing',
    description: 'Used platform data to create highly targeted advertising campaigns based on musical preferences and past event attendance.'
  }, {
    title: 'Early Bird Promotions',
    description: 'Implemented tiered ticket pricing with platform-exclusive early bird offers that created urgency and drove early sales.'
  }, {
    title: 'Performer Collaboration',
    description: "Partnered with performers to cross-promote the festival to their followers through the platform's integration tools."
  }, {
    title: 'Location-Based Marketing',
    description: "Leveraged the platform's geolocation features to target potential attendees within a 200-mile radius."
  }, {
    title: 'Community Engagement',
    description: 'Created pre-festival virtual events and discussions to build community and excitement before the main event.'
  }];
  const testimonials = [{
    quote: "When's The Fun transformed how we approach marketing our festival. The data insights alone were worth the investment, but the integrated promotional tools took our event to a whole new level.",
    author: 'Michael Rodriguez',
    role: 'Marketing Director, Sunset Music Festival'
  }, {
    quote: 'The ability to target music fans based on genre preferences was a game-changer. We reached exactly the right audience and saw immediate results in ticket sales.',
    author: 'Sarah Johnson',
    role: 'Event Coordinator, Sunset Music Festival'
  }];
  return <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-indigo-600 to-purple-600">
        <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Sunset Music Festival crowd" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
          <div className="mb-6">
            <button onClick={() => navigateTo('/success-stories')} className="inline-flex items-center text-white hover:text-indigo-200 transition-colors">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Success Stories
            </button>
          </div>
          <div>
            <span className="inline-block bg-indigo-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
              Event Organizer Success Story
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How Sunset Music Festival Increased Attendance by 40%
            </h1>
            <div className="flex items-center text-white text-lg">
              <Calendar className="h-5 w-5 mr-2" />
              <span className="mr-6">Annual Festival</span>
              <MapPin className="h-5 w-5 mr-2" />
              <span className="mr-6">Tampa Bay, FL</span>
              <Music className="h-5 w-5 mr-2" />
              <span>Electronic & Dance Music</span>
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
                Sunset Music Festival, an annual electronic music event in Tampa
                Bay, was facing increasing competition from new festivals in the
                region. Despite a strong reputation and five years of history,
                attendance had plateaued, and organizers were concerned about
                long-term growth. They needed to expand their reach, attract new
                attendees, and increase revenue without compromising the
                festival's identity.
              </p>
              <p>Key challenges included:</p>
              <ul>
                <li>Reaching new audiences beyond their existing fan base</li>
                <li>Differentiating from competing festivals in the region</li>
                <li>Improving pre-festival engagement and excitement</li>
                <li>Increasing ticket sales without heavy discounting</li>
                <li>Optimizing marketing spend for better ROI</li>
              </ul>
              <h2>The Solution</h2>
              <p>
                In January 2022, Sunset Music Festival partnered with When's The
                Fun to implement a comprehensive digital strategy. They
                leveraged our platform's audience data, marketing tools, and
                community features to create a multi-faceted approach:
              </p>
              <h3>Data-Driven Audience Targeting</h3>
              <p>
                Using When's The Fun's audience insights, the festival team
                identified potential attendees based on music preferences, past
                event attendance, and geographic location. This allowed them to
                create highly targeted marketing campaigns that reached the
                right people with the right message.
              </p>
              <h3>Strategic Ticket Release Schedule</h3>
              <p>
                Working with our platform's ticketing experts, they developed a
                tiered ticket release strategy with platform-exclusive early
                bird offers. This created urgency and drove early sales, while
                the transparent countdown timers on the event page encouraged
                prompt purchasing decisions.
              </p>
              <h3>Performer Integration</h3>
              <p>
                The festival team connected with confirmed performers through
                our platform, enabling artists to easily promote their upcoming
                appearance to their followers. This cross-promotion amplified
                reach and lent authenticity to marketing efforts.
              </p>
              <h3>Community Building</h3>
              <p>
                Three months before the festival, organizers launched a series
                of virtual pre-events and discussion forums on the platform.
                These included DJ livestreams, artist Q&As, and festival
                preparation guides, creating community and excitement well
                before the main event.
              </p>
              <h3>Location-Based Marketing</h3>
              <p>
                Using our geotargeting capabilities, they created specialized
                promotions for potential attendees within driving distance,
                including group packages and transportation options that removed
                barriers to attendance.
              </p>
              <h2>The Results</h2>
              <p>
                The partnership with When's The Fun delivered exceptional
                results for Sunset Music Festival:
              </p>
              <ul>
                <li>
                  <strong>40% increase in overall attendance</strong> compared
                  to the previous year
                </li>
                <li>
                  <strong>65% increase in ticket revenue</strong> due to both
                  higher attendance and less reliance on last-minute discounting
                </li>
                <li>
                  <strong>
                    28% of attendees were first-time festival-goers
                  </strong>
                  , indicating successful expansion beyond their core audience
                </li>
                <li>
                  <strong>3.2x return on marketing spend</strong>, a significant
                  improvement from previous years
                </li>
                <li>
                  <strong>
                    89% of surveyed attendees rated the festival experience as
                    "excellent" or "very good"
                  </strong>
                  , showing that growth didn't compromise quality
                </li>
              </ul>
              <h2>Key Strategies for Success</h2>
              <p>
                The festival's success wasn't just about using the platform's
                tools—it was about how they used them. Here are the strategies
                that made the difference:
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
                Following their success, Sunset Music Festival has expanded
                their partnership with When's The Fun. For their upcoming
                festival, they're implementing new features including an
                interactive festival map, personalized attendee schedules, and a
                community-driven playlist that will shape some of the
                programming.
              </p>
              <p>
                "The platform has become an essential part of our event planning
                and marketing strategy," says Festival Director Carlos Mendez.
                "We're not just selling more tickets—we're building a stronger
                community around our event, which is ultimately what ensures
                long-term success."
              </p>
              <blockquote>
                <p>
                  "When's The Fun helped us transform from a regional festival
                  to a destination event that draws attendees from across the
                  country. The data-driven approach and community features made
                  all the difference."
                </p>
                <footer>— Carlos Mendez, Festival Director</footer>
              </blockquote>
            </div>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Results Summary */}
            <div className="bg-indigo-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Results at a Glance
              </h3>
              <div className="space-y-6">
                {results.map((result, index) => <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">{result.icon}</div>
                    <div className="ml-4">
                      <p className="text-3xl font-bold text-indigo-600">
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
                {testimonials.map((testimonial, index) => <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
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
            {/* Festival Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                About the Festival
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Annual Event</p>
                    <p className="text-gray-600">Memorial Day Weekend</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">
                      Raymond James Stadium, Tampa Bay, FL
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Music className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Genre</p>
                    <p className="text-gray-600">
                      Electronic, Dance, House, Techno
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Attendance</p>
                    <p className="text-gray-600">20,000+ attendees</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Duration</p>
                    <p className="text-gray-600">2-day festival</p>
                  </div>
                </div>
              </div>
            </div>
            {/* CTA */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">
                Ready to grow your event?
              </h3>
              <p className="mb-6">
                Learn how When's The Fun can help you increase attendance and
                revenue for your next event.
              </p>
              <button onClick={() => navigateTo('/organizer-hub')} className="w-full bg-white text-indigo-600 font-medium py-2 px-4 rounded-md hover:bg-indigo-50 transition-colors flex items-center justify-center">
                Explore Event Organizer Hub
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigateTo('/success-stories/urban-loft')}>
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="The Urban Loft venue" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                  Venue Owner
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  The Urban Loft: From New Venue to Booked Solid in 3 Months
                </h3>
                <p className="text-gray-600 mb-4">
                  See how this boutique event space used our platform to quickly
                  establish themselves in a competitive market.
                </p>
                <button className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
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
                <button className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                  Read Story
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigateTo('/success-stories/downtown-revival')}>
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Downtown street festival" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                  Community Impact
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Downtown Revival: How Arts Events Transformed a City Center
                </h3>
                <p className="text-gray-600 mb-4">
                  This case study examines how coordinated arts events helped
                  revitalize a struggling downtown district.
                </p>
                <button className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                  Read Story
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Your Success Story?
          </h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
            Join thousands of event organizers who are growing their audiences
            and increasing revenue with When's The Fun
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigateTo('/events/create')} className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-md hover:bg-indigo-50 transition-colors">
              Create Your Event
            </button>
            <button onClick={() => navigateTo('/contact')} className="px-8 py-3 bg-indigo-800 text-white font-medium rounded-md hover:bg-indigo-900 transition-colors border border-indigo-600">
              Talk to Our Team
            </button>
          </div>
        </div>
      </div>
    </div>;
};