import React from 'react';
import { useNavigationContext } from '../context/NavigationContext';
import { Heart, Users, Landmark, TrendingUp, Calendar, Briefcase, Leaf, Globe } from 'lucide-react';
export const CommunityImpactPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const impactStats = [{
    number: '500+',
    label: 'Local Communities Served',
    icon: <Users className="h-8 w-8 text-indigo-600" />
  }, {
    number: '$2.5M+',
    label: 'Generated for Local Economies',
    icon: <Landmark className="h-8 w-8 text-indigo-600" />
  }, {
    number: '10,000+',
    label: 'Events Supported Annually',
    icon: <Calendar className="h-8 w-8 text-indigo-600" />
  }, {
    number: '2,500+',
    label: 'Local Businesses Promoted',
    icon: <Briefcase className="h-8 w-8 text-indigo-600" />
  }];
  const initiatives = [{
    title: 'Community Calendar Grants',
    description: 'We provide free premium calendars to nonprofit organizations, community groups, and underserved communities to help them promote their events and increase participation.',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }, {
    title: 'Performer Spotlight Program',
    description: 'Our program helps emerging local artists gain visibility by featuring them prominently on our platform and connecting them with venues and event organizers.',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }, {
    title: 'Small Business Accelerator',
    description: 'We offer reduced fees and enhanced visibility for small, local venues and event-related businesses to help them compete and grow their customer base.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }, {
    title: 'Digital Inclusion Program',
    description: 'We work with community centers to provide training on how to use our platform, ensuring that everyone can benefit from digital event discovery regardless of technical background.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }];
  const testimonials = [{
    quote: "When's The Fun has transformed how our small town connects. Our community events now reach five times the audience they used to, bringing people together who might never have met otherwise.",
    author: 'Sarah Johnson',
    role: 'Community Center Director',
    location: 'Clearwater, FL'
  }, {
    quote: 'As a local musician, I struggled to find gigs and build an audience. The Performer Spotlight program gave me the visibility I needed to book regular shows and build a loyal following.',
    author: 'Marcus Rivera',
    role: 'Independent Musician',
    location: 'Tampa, FL'
  }, {
    quote: "Our nonprofit was able to increase event attendance by 200% using the free calendar tools provided by When's The Fun. This has directly translated to more donations and community support.",
    author: 'Aisha Washington',
    role: 'Nonprofit Executive Director',
    location: 'St. Petersburg, FL'
  }];
  return <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              Our Community Impact
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Building stronger, more connected communities through shared
              experiences and local partnerships
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigateTo('/partner-with-us')} className="px-8 py-3 bg-white text-green-600 font-medium rounded-md hover:bg-green-50 transition-colors">
                Partner With Us
              </button>
              <button onClick={() => navigateTo('/community-stories')} className="px-8 py-3 bg-green-700 text-white font-medium rounded-md hover:bg-green-800 transition-colors">
                Read Success Stories
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Impact Stats */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Impact by the Numbers
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We're proud of the positive change we've helped create in
              communities across the country.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Our Mission */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Community Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At When's The Fun, we believe that vibrant communities are built
                through shared experiences and meaningful connections. Our
                mission goes beyond simply listing events—we're committed to
                fostering community growth, supporting local businesses, and
                creating spaces where everyone feels welcome.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Through our platform, we aim to break down barriers to
                participation, amplify diverse voices, and ensure that events of
                all sizes and types can find their audience. We measure our
                success not just in user numbers, but in the strength of the
                communities we serve.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Heart className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Supporting Local Economies
                    </h3>
                    <p className="mt-1 text-gray-600">
                      We prioritize local businesses and help keep dollars
                      within communities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Fostering Inclusion
                    </h3>
                    <p className="mt-1 text-gray-600">
                      We work to ensure our platform is accessible and
                      representative of all community members.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Building Capacity
                    </h3>
                    <p className="mt-1 text-gray-600">
                      We provide tools and resources to help organizations grow
                      their impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Community gathering" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
      {/* Community Initiatives */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Community Initiatives
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We're actively investing in programs that strengthen communities
              and create opportunities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {initiatives.map((initiative, index) => <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                <div className="h-48 relative">
                  <img src={initiative.image} alt={initiative.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {initiative.title}
                  </h3>
                  <p className="text-gray-600">{initiative.description}</p>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* Sustainability Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1536599018102-9f803c140fc1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Sustainable events" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Promoting Sustainable Events
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We're committed to helping event organizers reduce environmental
                impact while maximizing social benefit. Our platform highlights
                sustainable practices and provides resources for greener events.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Leaf className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Green Event Certification
                    </h3>
                    <p className="mt-1 text-gray-600">
                      We recognize and promote events that meet sustainability
                      criteria.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Globe className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Carbon Offset Integration
                    </h3>
                    <p className="mt-1 text-gray-600">
                      Event creators can offer carbon offset options with ticket
                      purchases.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      Sustainability Resources
                    </h3>
                    <p className="mt-1 text-gray-600">
                      We provide guides and vendor connections for more
                      sustainable events.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Testimonials */}
      <div className="py-16 bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Community Voices</h2>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
              Hear from the people and organizations who have partnered with us.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <div key={index} className="bg-indigo-800 rounded-lg p-6">
                <div className="mb-4">
                  <svg className="h-8 w-8 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-indigo-100 mb-6">{testimonial.quote}</p>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-indigo-300 text-sm">{testimonial.role}</p>
                  <p className="text-indigo-300 text-sm">
                    {testimonial.location}
                  </p>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Us in Making a Difference
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Whether you're an event organizer, venue owner, or community leader,
            partner with us to create more vibrant, connected communities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigateTo('/partner-with-us')} className="px-8 py-3 bg-white text-green-700 font-medium rounded-md hover:bg-green-50 transition-colors">
              Become a Partner
            </button>
            <button onClick={() => navigateTo('/contact')} className="px-8 py-3 bg-green-700 text-white font-medium rounded-md hover:bg-green-800 transition-colors border border-white">
              Contact Our Impact Team
            </button>
          </div>
        </div>
      </div>
    </div>;
};