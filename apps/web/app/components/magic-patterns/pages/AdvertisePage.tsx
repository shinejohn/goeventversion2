import React from 'react';
import { ArrowRightIcon, MegaphoneIcon, BarChartIcon, UsersIcon, MailIcon, CheckIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
export const AdvertisePage = () => {
  const navigate = useNavigate();
  const adOptions = [{
    title: 'Event Promotion',
    description: 'Boost visibility for your events with targeted promotions',
    path: '/advertise/event-promotion',
    icon: <CalendarIcon className="h-10 w-10 text-orange-500" />
  }, {
    title: 'Featured Listings',
    description: 'Get premium placement in search results and category pages',
    path: '/advertise/featured-listings',
    icon: <StarIcon className="h-10 w-10 text-orange-500" />
  }, {
    title: 'Homepage Showcase',
    description: 'Display your events or venue on our high-traffic homepage',
    path: '/advertise/homepage-showcase',
    icon: <LayoutIcon className="h-10 w-10 text-orange-500" />
  }, {
    title: 'Email Campaigns',
    description: 'Reach our subscriber base with targeted email promotions',
    path: '/advertise/email-campaigns',
    icon: <MailIcon className="h-10 w-10 text-orange-500" />
  }];
  // Pricing plans
  const pricingPlans = [{
    name: 'Basic',
    price: '$49',
    period: 'per month',
    description: 'Perfect for small businesses and occasional events',
    features: ['Event promotion for up to 3 events', 'Standard listing placement', 'Basic performance analytics', 'Community directory listing'],
    cta: 'Get Started',
    highlighted: false
  }, {
    name: 'Professional',
    price: '$99',
    period: 'per month',
    description: 'Ideal for regular event organizers and venues',
    features: ['Event promotion for up to 10 events', 'Featured listing placement', 'Advanced performance analytics', 'Email newsletter inclusion', 'Social media promotion', 'Priority support'],
    cta: 'Start Free Trial',
    highlighted: true
  }, {
    name: 'Enterprise',
    price: '$249',
    period: 'per month',
    description: 'For major venues and event series',
    features: ['Unlimited event promotions', 'Premium listing placement', 'Comprehensive analytics dashboard', 'Dedicated email campaigns', 'Homepage showcase rotation', 'Dedicated account manager', 'Custom reporting'],
    cta: 'Contact Sales',
    highlighted: false
  }];
  // Success metrics
  const successMetrics = [{
    label: 'Average Increase in Event Attendance',
    value: '37%'
  }, {
    label: 'Increase in Ticket Sales',
    value: '42%'
  }, {
    label: 'Return on Ad Spend',
    value: '3.8x'
  }, {
    label: 'Monthly Active Users',
    value: '50K+'
  }];
  return <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">
              Grow Your Audience with When's The Fun
            </h1>
            <p className="mt-3 text-xl max-w-3xl mx-auto">
              Reach thousands of local event-goers with our targeted advertising
              solutions
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigate('/advertise/packages')} className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50">
                <MegaphoneIcon className="h-5 w-5 mr-2" />
                View Ad Packages
              </button>
              <button onClick={() => navigate('/advertise/contact')} className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* New CTA Banner */}
      <div className="bg-orange-100 border-y border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <MegaphoneIcon className="h-6 w-6 text-orange-500 mr-2" />
              <span className="text-lg font-medium text-orange-800">
                Ready to advertise? Choose from our packages!
              </span>
            </div>
            <button onClick={() => navigate('/advertise/packages')} className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md shadow-sm">
              View Pricing & Packages
            </button>
          </div>
        </div>
      </div>
      {/* Success Metrics */}
      <div className="bg-orange-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {successMetrics.map((metric, index) => <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-orange-600">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm md:text-base text-gray-700">
                  {metric.label}
                </p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Advertising Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Advertising Solutions
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the right advertising option for your business
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {adOptions.map((option, index) => <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-4">{option.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                {option.title}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {option.description}
              </p>
              <div className="flex justify-center">
                <button className="px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-md font-medium" onClick={() => navigate(option.path)}>
                  Learn More
                </button>
              </div>
            </div>)}
        </div>
        <div className="mt-12 text-center">
          <button onClick={() => navigate('/advertise/packages')} className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md shadow-md">
            View All Advertising Packages
          </button>
        </div>
      </div>
      {/* Audience Targeting */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Reach Your Target Audience
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our platform connects you with local event-goers who are
                actively searching for things to do in your area. Target by:
              </p>
              <ul className="space-y-4">
                {['Location and neighborhood', 'Event categories and interests', 'Demographics and behavior', 'Time of day and day of week'].map((item, index) => <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>)}
              </ul>
              <div className="mt-8">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700" onClick={() => navigate('/advertise/targeting')}>
                  Learn About Targeting
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Audience targeting" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>
      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Advertising Packages
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that fits your business needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => <div key={index} className={`border rounded-lg overflow-hidden ${plan.highlighted ? 'border-orange-500 shadow-lg' : 'border-gray-200'}`}>
              {plan.highlighted && <div className="bg-orange-500 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-xl font-medium text-gray-500">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-start">
                      <CheckIcon className={`h-5 w-5 ${plan.highlighted ? 'text-orange-500' : 'text-green-500'} mr-2 mt-0.5`} />
                      <span className="text-gray-700">{feature}</span>
                    </li>)}
                </ul>
                <div className="mt-8">
                  <button className={`w-full py-3 px-4 rounded-md shadow font-medium ${plan.highlighted ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'}`} onClick={() => navigate(`/advertise/packages/${plan.name.toLowerCase()}`)}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            </div>)}
        </div>
        <div className="text-center mt-8 text-gray-600">
          Looking for something custom?{' '}
          <a href="#" onClick={e => {
          e.preventDefault();
          navigate('/advertise/contact');
        }} className="text-orange-600 font-medium">
            Contact our sales team
          </a>
        </div>
      </div>
      {/* Analytics Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 hidden lg:block">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Analytics dashboard" className="rounded-lg shadow-lg" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Measure Your Success
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Track the performance of your advertising campaigns with our
                comprehensive analytics dashboard:
              </p>
              <ul className="space-y-4">
                {['Real-time impressions and click data', 'Audience demographics and interests', 'Conversion tracking for ticket sales', 'ROI and performance metrics', 'Custom reports and insights'].map((item, index) => <li key={index} className="flex items-start">
                    <BarChartIcon className="h-5 w-5 text-orange-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>)}
              </ul>
              <div className="mt-8">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700" onClick={() => navigate('/advertise/analytics')}>
                  View Demo Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Success Stories</h2>
          <p className="mt-4 text-xl text-gray-600">
            See how businesses like yours achieved results
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Ruth Eckerd Hall" className="h-12 w-12 rounded-full mr-4" />
              <div>
                <h3 className="font-bold text-gray-900">Ruth Eckerd Hall</h3>
                <p className="text-sm text-gray-600">Concert Venue</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Our featured listings consistently sell out faster than our
              non-promoted events. The ROI has been exceptional."
            </p>
            <div className="mt-4 text-sm text-orange-600 font-medium">
              45% increase in ticket sales
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Clearwater Arts Festival" className="h-12 w-12 rounded-full mr-4" />
              <div>
                <h3 className="font-bold text-gray-900">
                  Clearwater Arts Festival
                </h3>
                <p className="text-sm text-gray-600">Annual Event</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "The email campaign brought in attendees who had never heard of
              our festival before. We saw our most diverse audience yet."
            </p>
            <div className="mt-4 text-sm text-orange-600 font-medium">
              32% increase in first-time attendees
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="The District Lounge" className="h-12 w-12 rounded-full mr-4" />
              <div>
                <h3 className="font-bold text-gray-900">The District Lounge</h3>
                <p className="text-sm text-gray-600">Bar & Music Venue</p>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Homepage showcase ads have transformed our weeknight business.
              We're now seeing consistent crowds every night of the week."
            </p>
            <div className="mt-4 text-sm text-orange-600 font-medium">
              58% increase in weeknight revenue
            </div>
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to boost your visibility?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join hundreds of local businesses who've increased their audience
            with our advertising solutions
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-white text-orange-600 font-medium rounded-md shadow-sm hover:bg-orange-50" onClick={() => navigate('/advertise/packages')}>
              View Ad Packages
            </button>
            <button className="px-8 py-3 bg-orange-700 text-white font-medium rounded-md shadow-sm border border-orange-500 hover:bg-orange-800" onClick={() => navigate('/checkout/details?plan=professional-advertising')}>
              Purchase Now
            </button>
          </div>
        </div>
      </div>
    </div>;
};
// Additional icons needed for this page
const CalendarIcon = props => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>;
const StarIcon = props => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>;
const LayoutIcon = props => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>;