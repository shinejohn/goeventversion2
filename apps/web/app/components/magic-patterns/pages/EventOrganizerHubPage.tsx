import React from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Users, Ticket, BarChart, CheckCircle, Clock, DollarSign, MessageSquare, Mail, Star, PieChart, Zap, Award } from 'lucide-react';
export const EventOrganizerHubPage = () => {
  const navigate = useNavigate();
  const features = [{
    title: 'Event Creation & Management',
    description: 'Create, edit, and manage your events with our intuitive event builder. Set dates, times, ticket types, and more.',
    icon: <Calendar className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Ticketing & Registration',
    description: 'Sell tickets directly through our platform with flexible pricing options, promo codes, and group discounts.',
    icon: <Ticket className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Attendee Management',
    description: 'Track RSVPs, manage guest lists, and communicate with attendees before, during, and after your event.',
    icon: <Users className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Analytics & Reporting',
    description: 'Gain valuable insights into ticket sales, attendee demographics, marketing performance, and more.',
    icon: <BarChart className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Marketing Tools',
    description: 'Promote your events with email campaigns, social media integration, and SEO optimization.',
    icon: <Mail className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'On-Site Check-In',
    description: 'Streamline the check-in process with our mobile app, QR code scanning, and real-time attendee tracking.',
    icon: <CheckCircle className="h-8 w-8 text-indigo-600" />
  }];
  const eventTypes = ['Concerts & Music Festivals', 'Conferences & Seminars', 'Workshops & Classes', 'Networking Events', 'Fundraisers & Charity Events', 'Art Exhibitions & Galleries', 'Food & Drink Festivals', 'Sports Events & Tournaments', 'Community Gatherings', 'Corporate Events', 'Private Parties', 'Virtual & Hybrid Events'];
  const pricingPlans = [{
    name: 'Basic',
    price: '$0',
    period: 'per event',
    features: ['Create and publish events', 'Basic ticketing (up to 50 tickets)', 'Email notifications', 'Mobile-friendly event pages', 'Standard support'],
    recommended: false,
    ctaText: 'Get Started Free'
  }, {
    name: 'Professional',
    price: '$49',
    period: 'per event',
    features: ['Everything in Basic', 'Unlimited tickets', 'Custom branding', 'Multiple ticket types', 'Discount codes & promotions', 'Attendee management', 'Basic analytics', 'Priority support'],
    recommended: true,
    ctaText: 'Start 14-Day Free Trial'
  }, {
    name: 'Enterprise',
    price: '$199',
    period: 'per month',
    features: ['Everything in Professional', 'Unlimited events', 'Advanced analytics', 'API access', 'White-label solution', 'Dedicated account manager', 'Custom integrations', '24/7 premium support'],
    recommended: false,
    ctaText: 'Contact Sales'
  }];
  const successMetrics = [{
    metric: '250,000+',
    description: 'Events hosted on our platform annually'
  }, {
    metric: '5.2M+',
    description: 'Tickets sold through our platform'
  }, {
    metric: '98%',
    description: 'Customer satisfaction rate'
  }, {
    metric: '35%',
    description: 'Average increase in attendance for repeat events'
  }];
  const testimonials = [{
    quote: "When's The Fun has revolutionized how we manage our annual music festival. From ticket sales to on-site check-in, everything runs smoothly, allowing us to focus on creating an amazing experience for our attendees.",
    author: 'Sophia Chen',
    role: 'Festival Director, Harmony Music Festival',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }, {
    quote: "The analytics tools have been invaluable for understanding our audience and optimizing our marketing efforts. We've seen a 40% increase in ticket sales since switching to When's The Fun.",
    author: 'Marcus Johnson',
    role: 'Event Coordinator, TechConf',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }, {
    quote: 'As someone who organizes multiple events each month, the Enterprise plan has been a game-changer. The ability to manage everything from one dashboard and access detailed reports has saved us countless hours.',
    author: 'Alicia Rodriguez',
    role: 'Director of Events, Community Builders Association',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }];
  const faqs = [{
    question: 'How do I get started with the Event Organizer Hub?',
    answer: "Getting started is easy! Simply create a free account, click on 'Create Event,' and follow the guided setup process. You can publish your event immediately or save it as a draft while you finalize the details."
  }, {
    question: 'What types of events can I organize on the platform?',
    answer: "Our platform supports a wide variety of events including concerts, conferences, workshops, networking events, fundraisers, art exhibitions, food festivals, sports events, community gatherings, and more. If you can dream it, you can organize it on When's The Fun!"
  }, {
    question: 'How does the ticketing system work?',
    answer: 'Our ticketing system allows you to create multiple ticket types with different pricing tiers, early bird rates, VIP options, and more. You can sell tickets directly through our platform, and attendees will receive digital tickets via email. We charge a small processing fee per ticket sold.'
  }, {
    question: 'Can I customize the look of my event page?',
    answer: 'Yes! With our Professional and Enterprise plans, you can customize your event page with your own branding, colors, logos, and custom domains. The Basic plan offers standard customization options.'
  }, {
    question: 'What kind of support do you offer?',
    answer: 'All plans include access to our knowledge base and community forum. The Basic plan includes standard email support, while Professional and Enterprise plans include priority support with faster response times. Enterprise customers also receive a dedicated account manager and 24/7 premium support.'
  }];
  return <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              Event Organizer Hub
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Everything you need to create, manage, and grow successful events
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigate('/events/create')} className="px-8 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors">
                Create an Event
              </button>
              <button onClick={() => navigate('/organizer-hub/demo')} className="px-8 py-3 bg-blue-700 text-white font-medium rounded-md hover:bg-blue-800 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Features Overview */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Powerful Tools for Event Organizers
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform helps you at every stage of the event
              lifecycle
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Success Metrics */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Trusted by Event Organizers Worldwide
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of organizers who are creating successful events
              with When's The Fun
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {successMetrics.map((item, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {item.metric}
                </div>
                <p className="text-gray-600">{item.description}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* For All Event Types */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              For Every Type of Event
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is flexible enough to handle any event you can
              imagine
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {eventTypes.map((type, index) => <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                <p className="font-medium text-gray-900">{type}</p>
              </div>)}
          </div>
          <div className="mt-12 text-center">
            <button onClick={() => navigate('/events')} className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center">
              Browse Events
              <Calendar className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {/* Ticketing & Registration */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Seamless Ticketing & Registration
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our powerful ticketing system makes it easy to sell tickets,
                manage registrations, and track attendance.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Multiple Ticket Types
                    </h3>
                    <p className="text-gray-600">
                      Create different ticket tiers, early bird specials, VIP
                      packages, and more
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Promotional Codes
                    </h3>
                    <p className="text-gray-600">
                      Offer discounts and special pricing with customizable
                      promo codes
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Group Discounts
                    </h3>
                    <p className="text-gray-600">
                      Encourage group purchases with automatic discounts for
                      multiple tickets
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Mobile Tickets
                    </h3>
                    <p className="text-gray-600">
                      Attendees receive digital tickets that can be scanned at
                      the door
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Secure Payment Processing
                    </h3>
                    <p className="text-gray-600">
                      Accept credit cards, PayPal, and other payment methods
                      with encrypted transactions
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Ticketing dashboard" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
      {/* Analytics & Insights */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Analytics dashboard" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Data-Driven Event Planning
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Make informed decisions with our comprehensive analytics and
                reporting tools.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <BarChart className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Sales Tracking
                    </h3>
                    <p className="text-gray-600">
                      Monitor ticket sales in real-time with detailed breakdowns
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <PieChart className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Attendee Demographics
                    </h3>
                    <p className="text-gray-600">
                      Understand your audience with detailed demographic data
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Zap className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Marketing Performance
                    </h3>
                    <p className="text-gray-600">
                      Track the effectiveness of your promotional campaigns
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Real-Time Reporting
                    </h3>
                    <p className="text-gray-600">
                      Access up-to-the-minute data on your event's performance
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Revenue Analysis
                    </h3>
                    <p className="text-gray-600">
                      Track revenue streams, expenses, and profitability
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pricing Plans */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your event
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => <div key={index} className={`bg-white rounded-lg shadow-md overflow-hidden ${plan.recommended ? 'ring-2 ring-indigo-600' : ''}`}>
                {plan.recommended && <div className="bg-indigo-600 text-white text-center py-2 text-sm font-medium">
                    Recommended
                  </div>}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="ml-1 text-xl text-gray-500">
                      {plan.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                        <span>{feature}</span>
                      </li>)}
                  </ul>
                  <button onClick={() => navigate('/events/create')} className={`w-full py-3 px-4 rounded-md font-medium ${plan.recommended ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                    {plan.ctaText}
                  </button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* Testimonials */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Success Stories
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from event organizers who have achieved success with When's
              The Fun
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
              Find answers to common questions about our event organizer tools
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
      {/* CTA Section */}
      <div className="bg-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Create Your Event?
          </h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
            Join thousands of successful event organizers on When's The Fun
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigate('/events/create')} className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-md hover:bg-indigo-50 transition-colors">
              Create an Event
            </button>
            <button onClick={() => navigate('/contact')} className="px-8 py-3 bg-indigo-800 text-white font-medium rounded-md hover:bg-indigo-900 transition-colors border border-indigo-600">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>;
};