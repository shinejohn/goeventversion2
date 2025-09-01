import React from 'react';
import { useNavigationContext } from '../context/NavigationContext';
import { Music, Calendar, DollarSign, BarChart, Users, MessageSquare, Globe, Star, CheckCircle, Clock, Briefcase, Award } from 'lucide-react';
export const PerformerToolsPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const tools = [{
    title: 'Profile Builder',
    description: 'Create a stunning profile that showcases your talent with photos, videos, and audio samples.',
    icon: <Users className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Availability Calendar',
    description: "Manage your schedule and let venues and event planners see when you're available to perform.",
    icon: <Calendar className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Booking Management',
    description: 'Track and manage all your bookings in one place, from inquiry to payment.',
    icon: <Briefcase className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Analytics Dashboard',
    description: 'Gain insights into your profile views, booking rates, and audience demographics.',
    icon: <BarChart className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Messaging System',
    description: 'Communicate directly with venues and event planners through our secure messaging platform.',
    icon: <MessageSquare className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Payment Processing',
    description: 'Receive payments securely with our integrated payment system, including deposits and final payments.',
    icon: <DollarSign className="h-8 w-8 text-indigo-600" />
  }];
  const performerTypes = ['Musicians & Bands', 'DJs', 'Comedians', 'Dancers', 'Magicians', 'Speakers', 'Actors', 'Performance Artists', 'Photographers', 'Videographers', 'Catering & Chefs', 'Event Staff'];
  const pricingPlans = [{
    name: 'Starter',
    price: '$0',
    period: 'forever',
    features: ['Basic performer profile', 'Up to 3 media uploads', 'Availability calendar', 'Receive booking inquiries', 'Community forum access'],
    recommended: false,
    ctaText: 'Get Started Free'
  }, {
    name: 'Professional',
    price: '$19',
    period: 'per month',
    features: ['Enhanced performer profile', 'Unlimited media uploads', 'Featured in search results', 'Advanced calendar features', 'Booking management tools', 'Analytics dashboard', 'Priority support'],
    recommended: true,
    ctaText: 'Start 14-Day Free Trial'
  }, {
    name: 'Agency',
    price: '$49',
    period: 'per month',
    features: ['Everything in Professional', 'Manage multiple performers', 'Custom branding', 'Advanced analytics', 'API access', 'Dedicated account manager', 'Marketing promotion package'],
    recommended: false,
    ctaText: 'Contact Sales'
  }];
  const successMetrics = [{
    metric: '35%',
    description: 'Average increase in bookings for performers in their first year'
  }, {
    metric: '12,000+',
    description: 'Active performers on the platform'
  }, {
    metric: '85%',
    description: 'Booking request response rate'
  }, {
    metric: '$2.5M+',
    description: 'Paid to performers through our platform monthly'
  }];
  const testimonials = [{
    quote: "When's The Fun has transformed my career. I've gone from scrambling for gigs to having a steady stream of bookings, all while spending less time on admin and more time making music.",
    author: 'James Wilson',
    role: 'Jazz Musician',
    image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }, {
    quote: 'The analytics tools have been eye-opening. I can see which parts of my profile attract the most attention and have adjusted my marketing accordingly. My booking rate has increased by 40%.',
    author: 'Elena Rodriguez',
    role: 'Classical Vocalist',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }, {
    quote: 'As an agency representing multiple performers, the platform has streamlined our operations tremendously. The calendar management and payment processing features alone have saved us countless hours.',
    author: 'Marcus Johnson',
    role: 'Talent Agency Owner',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }];
  const faqs = [{
    question: 'How do I get started as a performer?',
    answer: "Creating your performer profile is easy! Simply sign up for a free account, select 'I am a performer' during registration, and follow the guided setup process. You can start with our free Starter plan and upgrade anytime as your needs grow."
  }, {
    question: 'What types of performers can join the platform?',
    answer: "We welcome a wide variety of performers including musicians, bands, DJs, comedians, dancers, speakers, and many more. If you provide entertainment or services for events, you're welcome on our platform."
  }, {
    question: 'How much does it cost to use the performer tools?',
    answer: 'We offer a free Starter plan that allows you to create a basic profile and receive booking inquiries. Our Professional plan ($19/month) offers enhanced features for individual performers, while our Agency plan ($49/month) is designed for those managing multiple performers.'
  }, {
    question: 'How do payments work?',
    answer: 'When you receive a booking, you can set your payment terms including deposits and final payment dates. Clients can pay you securely through our platform, and funds are transferred to your bank account with a small processing fee.'
  }, {
    question: 'Can I integrate my existing website or calendar?',
    answer: "Yes, our Professional and Agency plans include API access that allows you to integrate your When's The Fun calendar with your existing website or other calendar systems. Our support team can help you with the integration process."
  }];
  return <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              Tools for Performers
            </h1>
            <p className="text-xl text-purple-100 mb-8">
              Everything you need to showcase your talent, get discovered, and
              grow your career
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigateTo('/performers/register')} className="px-8 py-3 bg-white text-purple-600 font-medium rounded-md hover:bg-purple-50 transition-colors">
                Create Your Profile
              </button>
              <button onClick={() => navigateTo('/performers/tools/demo')} className="px-8 py-3 bg-purple-700 text-white font-medium rounded-md hover:bg-purple-800 transition-colors">
                See Demo
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Tools Overview */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Powerful Tools for Performers
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive suite of tools helps you manage your career and
              connect with opportunities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {tool.title}
                </h3>
                <p className="text-gray-600">{tool.description}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Success Metrics */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Proven Results</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of performers who are growing their careers with
              When's The Fun
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
      {/* For All Performer Types */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              For All Types of Performers
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're a solo act or part of a larger group, our platform
              is designed for you
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {performerTypes.map((type, index) => <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                <p className="font-medium text-gray-900">{type}</p>
              </div>)}
          </div>
          <div className="mt-12 text-center">
            <button onClick={() => navigateTo('/performers')} className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center">
              Browse Performers
              <Music className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {/* Features Showcase */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Showcase Your Talent
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Your profile is your digital stage. Make it count with our
                comprehensive profile builder that lets you showcase your talent
                in the best light.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Rich Media Gallery
                    </h3>
                    <p className="text-gray-600">
                      Upload photos, videos, and audio samples to showcase your
                      performances
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Performance History
                    </h3>
                    <p className="text-gray-600">
                      Display your past gigs and venues to build credibility
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Testimonials & Reviews
                    </h3>
                    <p className="text-gray-600">
                      Collect and display reviews from past clients and venues
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Custom Packages
                    </h3>
                    <p className="text-gray-600">
                      Create and showcase different performance packages and
                      pricing options
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Performer profile" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
      {/* Calendar Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Calendar management" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Streamlined Calendar Management
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Take control of your schedule with our powerful calendar tools
                designed specifically for performers.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Availability Settings
                    </h3>
                    <p className="text-gray-600">
                      Set your available dates and times for bookings
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Booking Management
                    </h3>
                    <p className="text-gray-600">
                      Track pending, confirmed, and completed bookings
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Globe className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">Travel Radius</h3>
                    <p className="text-gray-600">
                      Define your travel preferences and get matched with
                      relevant opportunities
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MessageSquare className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Automated Notifications
                    </h3>
                    <p className="text-gray-600">
                      Receive alerts for new booking requests and upcoming
                      performances
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
              Choose the plan that works best for your career stage
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
                      /{plan.period}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                        <span>{feature}</span>
                      </li>)}
                  </ul>
                  <button onClick={() => navigateTo('/performers/register')} className={`w-full py-3 px-4 rounded-md font-medium ${plan.recommended ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
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
              Hear from performers who have grown their careers with When's The
              Fun
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
              Find answers to common questions about our performer tools
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
            Ready to Grow Your Career?
          </h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
            Join thousands of performers already using When's The Fun to book
            more gigs and manage their careers
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigateTo('/performers/register')} className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-md hover:bg-indigo-50 transition-colors">
              Create Your Profile
            </button>
            <button onClick={() => navigateTo('/contact')} className="px-8 py-3 bg-indigo-800 text-white font-medium rounded-md hover:bg-indigo-900 transition-colors border border-indigo-600">
              Contact Our Team
            </button>
          </div>
        </div>
      </div>
    </div>;
};