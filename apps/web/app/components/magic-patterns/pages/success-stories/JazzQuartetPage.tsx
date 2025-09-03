import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, BarChart, Calendar, CheckCircle, ChevronLeft, Clock, DollarSign, MapPin, Music, Star, Users, Mic, Globe, HeadphonesIcon, TrendingUp } from 'lucide-react';
export const JazzQuartetPage = () => {
  const navigate = useNavigate();
  const results = [{
    metric: '5x',
    description: 'Increase in booking requests',
    icon: <Calendar className="h-8 w-8 text-green-600" />
  }, {
    metric: '73%',
    description: 'Increase in performance income',
    icon: <DollarSign className="h-8 w-8 text-green-600" />
  }, {
    metric: '12',
    description: 'New venues added to regular rotation',
    icon: <MapPin className="h-8 w-8 text-green-600" />
  }, {
    metric: '2,500+',
    description: 'New fans and followers gained',
    icon: <Users className="h-8 w-8 text-green-600" />
  }];
  const strategies = [{
    title: 'High-Quality Media Portfolio',
    description: 'Invested in professional audio recordings, video performances, and photography to showcase their musical style and live performance quality.'
  }, {
    title: 'Detailed Performance Packages',
    description: 'Created clear packages for different event types with transparent pricing, set lengths, and repertoire options.'
  }, {
    title: 'Venue-Specific Outreach',
    description: 'Proactively contacted venues through the platform with personalized messages highlighting relevant experience and suitable musical offerings.'
  }, {
    title: 'Audience Building Strategy',
    description: "Leveraged the platform's event listings to encourage fans to follow their profile and receive notifications about upcoming performances."
  }, {
    title: 'Data-Driven Performance Calendar',
    description: 'Used platform analytics to identify high-demand dates and locations, optimizing their availability and travel schedule.'
  }];
  const testimonials = [{
    quote: "When's The Fun transformed our career trajectory. We went from struggling to find regular gigs to having a waitlist of venues wanting to book us.",
    author: 'Marcus Johnson',
    role: 'Bandleader, Moonlight Jazz Quartet'
  }, {
    quote: "The platform's tools helped us understand our audience and market ourselves effectively. We're now performing at venues we never thought would be accessible to us.",
    author: 'Elena Rodriguez',
    role: 'Pianist, Moonlight Jazz Quartet'
  }];
  return <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-green-600 to-teal-600">
        <img src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Jazz Quartet performing" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
          <div className="mb-6">
            <button onClick={() => navigate('/success-stories')} className="inline-flex items-center text-white hover:text-green-200 transition-colors">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Success Stories
            </button>
          </div>
          <div>
            <span className="inline-block bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
              Performer Success Story
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Jazz Quartet Quintuples Bookings Through Performer Profile
            </h1>
            <div className="flex items-center text-white text-lg">
              <Music className="h-5 w-5 mr-2" />
              <span className="mr-6">Jazz Ensemble</span>
              <MapPin className="h-5 w-5 mr-2" />
              <span className="mr-6">Chicago, IL</span>
              <Users className="h-5 w-5 mr-2" />
              <span>4-piece band</span>
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
                The Moonlight Jazz Quartet, a talented group of jazz musicians
                based in Chicago, had been performing together for three years
                with moderate success. Despite their musical prowess and
                positive audience feedback, they struggled with inconsistent
                bookings, difficulty reaching new venues, and challenges in
                growing their fan base beyond friends and family.
              </p>
              <p>
                As working musicians juggling day jobs and performance
                schedules, they lacked the time and expertise to effectively
                market themselves and secure regular gigs that paid fairly for
                their talent and experience.
              </p>
              <p>Key challenges included:</p>
              <ul>
                <li>Inconsistent booking schedule with frequent dry spells</li>
                <li>Difficulty breaking into new venues and event types</li>
                <li>Limited marketing resources and expertise</li>
                <li>Challenges in setting and negotiating appropriate rates</li>
                <li>
                  No systematic way to build and engage with their audience
                </li>
              </ul>
              <h2>The Solution</h2>
              <p>
                In February 2022, the Moonlight Jazz Quartet created a
                comprehensive performer profile on When's The Fun and
                implemented a strategic approach to growing their performance
                business:
              </p>
              <h3>Professional Media Portfolio</h3>
              <p>
                They invested in professional audio recordings, video
                performances, and photography that showcased their musical style
                and live performance quality. This media was prominently
                featured on their profile, giving venues and event planners an
                authentic preview of their performance quality.
              </p>
              <h3>Clear Performance Packages</h3>
              <p>
                Working with the platform's performer specialists, they
                developed distinct packages for different event types (cocktail
                hours, weddings, corporate events, jazz clubs) with transparent
                pricing, set lengths, and repertoire options. This clarity made
                it easier for clients to understand exactly what they were
                booking.
              </p>
              <h3>Proactive Venue Outreach</h3>
              <p>
                Rather than waiting for bookings to come to them, the quartet
                used the platform's venue directory to identify and contact
                suitable venues with personalized messages highlighting their
                relevant experience and how their music would enhance the
                venue's atmosphere.
              </p>
              <h3>Audience Building</h3>
              <p>
                They leveraged the platform's event listings to promote upcoming
                performances and encourage attendees to follow their profile for
                future shows. After performances, they used the platform's
                messaging system to thank attendees and maintain connections.
              </p>
              <h3>Data-Driven Performance Calendar</h3>
              <p>
                Using the platform's analytics tools, they identified
                high-demand dates and locations, allowing them to optimize their
                availability and travel schedule for maximum booking potential.
              </p>
              <h2>The Results</h2>
              <p>
                Within six months of implementing these strategies, the
                Moonlight Jazz Quartet transformed their booking situation and
                career trajectory:
              </p>
              <ul>
                <li>
                  <strong>5x increase in booking requests</strong> compared to
                  the previous six months
                </li>
                <li>
                  <strong>73% increase in performance income</strong>, allowing
                  two members to reduce their day job hours
                </li>
                <li>
                  <strong>12 new venues added to their regular rotation</strong>
                  , including prestigious jazz clubs and upscale hotels
                </li>
                <li>
                  <strong>Expanded performance types</strong> beyond their
                  traditional jazz club gigs to include corporate events,
                  weddings, and private parties
                </li>
                <li>
                  <strong>2,500+ new fans and followers</strong> on the
                  platform, creating a dedicated audience that follows them to
                  performances
                </li>
              </ul>
              <h2>Key Strategies for Success</h2>
              <p>
                The quartet's transformation wasn't just about having a
                profile—it was about how they strategically used the platform's
                tools to build their performance business:
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
                With a solid foundation of regular bookings and an engaged
                audience, the Moonlight Jazz Quartet is now focusing on
                expanding their geographic reach and developing new musical
                offerings based on client feedback gathered through the
                platform.
              </p>
              <p>
                "We're now in talks with music festivals and considering a small
                regional tour," says Marcus. "The financial stability from our
                regular bookings allows us to invest in new arrangements and
                equipment that further elevate our performances."
              </p>
              <blockquote>
                <p>
                  "When's The Fun didn't just help us find gigs—it helped us
                  build a sustainable career in music. We now have the business
                  infrastructure to match our musical abilities, and that's made
                  all the difference."
                </p>
                <footer>
                  — Marcus Johnson, Bandleader, Moonlight Jazz Quartet
                </footer>
              </blockquote>
            </div>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Results Summary */}
            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Results at a Glance
              </h3>
              <div className="space-y-6">
                {results.map((result, index) => <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">{result.icon}</div>
                    <div className="ml-4">
                      <p className="text-3xl font-bold text-green-600">
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
                {testimonials.map((testimonial, index) => <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
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
            {/* Performer Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                About the Quartet
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Music className="h-5 w-5 text-green-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Genre</p>
                    <p className="text-gray-600">Jazz, Swing, Bossa Nova</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-green-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Formation</p>
                    <p className="text-gray-600">
                      Piano, Bass, Drums, Saxophone
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mic className="h-5 w-5 text-green-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Performance Types
                    </p>
                    <p className="text-gray-600">
                      Jazz clubs, corporate events, weddings, private parties
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-green-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">
                      Based in Chicago, IL with regional travel
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-green-600 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Experience</p>
                    <p className="text-gray-600">
                      Performing together since 2019
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* CTA */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Are you a performer?</h3>
              <p className="mb-6">
                Learn how When's The Fun can help you book more gigs and grow
                your audience.
              </p>
              <button onClick={() => navigate('/performers/tools')} className="w-full bg-white text-green-600 font-medium py-2 px-4 rounded-md hover:bg-green-50 transition-colors flex items-center justify-center">
                Explore Performer Tools
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
            <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/success-stories/sunset-music-festival')}>
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
                <button className="text-green-600 font-medium hover:text-green-800 flex items-center">
                  Read Story
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/success-stories/urban-loft')}>
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
                <button className="text-green-600 font-medium hover:text-green-800 flex items-center">
                  Read Story
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/success-stories/dj-collective')}>
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1571266028243-a52300c2ffc5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="DJ performing" className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                  Performer
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  DJ Collective Creates Successful Event Series From Scratch
                </h3>
                <p className="text-gray-600 mb-4">
                  How a group of DJs used the platform to launch and grow their
                  own recurring event.
                </p>
                <button className="text-green-600 font-medium hover:text-green-800 flex items-center">
                  Read Story
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Grow Your Performance Career?
          </h2>
          <p className="text-xl text-green-200 mb-8 max-w-3xl mx-auto">
            Join thousands of performers who are booking more gigs and building
            their audience with When's The Fun
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigate('/performers/register')} className="px-8 py-3 bg-white text-green-700 font-medium rounded-md hover:bg-green-50 transition-colors">
              Create Your Profile
            </button>
            <button onClick={() => navigate('/performers/tools')} className="px-8 py-3 bg-green-800 text-white font-medium rounded-md hover:bg-green-900 transition-colors border border-green-600">
              Explore Performer Tools
            </button>
          </div>
        </div>
      </div>
    </div>;
};