import React from 'react';
import { useNavigate } from 'react-router';
import { MapPinIcon, CalendarIcon, UsersIcon, DollarSignIcon, BarChartIcon, CheckCircleIcon, ArrowRightIcon } from 'lucide-react';
export const ListYourVenuePage = () => {
  const navigate = useNavigate();
  const benefits = [{
    title: 'Reach More Event Planners',
    description: 'Connect with thousands of event planners actively searching for venues like yours.',
    icon: <UsersIcon className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Manage Your Calendar',
    description: 'Our integrated calendar system helps you track bookings and avoid scheduling conflicts.',
    icon: <CalendarIcon className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Increase Revenue',
    description: "Fill more dates and maximize your venue's earning potential with our booking platform.",
    icon: <DollarSignIcon className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Analytics & Insights',
    description: "Access detailed analytics about your venue's performance and visitor engagement.",
    icon: <BarChartIcon className="h-8 w-8 text-indigo-600" />
  }];
  const features = ['Customizable venue profile with high-quality photo gallery', 'Real-time availability calendar', 'Secure messaging system with potential clients', 'Automated booking requests and confirmations', 'Reviews and ratings management', 'Promotion in venue search results', 'Featured venue opportunities', 'Mobile-friendly management dashboard', 'Integration with your existing booking system (Premium)', 'Detailed analytics and performance reports'];
  const pricingPlans = [{
    name: 'Basic',
    price: '$0',
    period: 'forever',
    features: ['Basic venue profile', 'Up to 5 photos', 'Calendar management', 'Booking requests', 'Standard support'],
    recommended: false,
    ctaText: 'Get Started Free'
  }, {
    name: 'Premium',
    price: '$49',
    period: 'per month',
    features: ['Enhanced venue profile', 'Unlimited photos & virtual tours', 'Priority in search results', 'Advanced calendar features', 'Booking request management', 'Analytics dashboard', 'Priority support'],
    recommended: true,
    ctaText: 'Start 14-Day Free Trial'
  }, {
    name: 'Professional',
    price: '$99',
    period: 'per month',
    features: ['Everything in Premium', 'Featured venue placement', 'API access for integration', 'Dedicated account manager', 'Marketing promotion package', 'Preferred vendor network', '24/7 VIP support'],
    recommended: false,
    ctaText: 'Contact Sales'
  }];
  const steps = [{
    number: '1',
    title: 'Create Your Account',
    description: "Sign up for a free When's The Fun account to get started."
  }, {
    number: '2',
    title: 'Build Your Profile',
    description: 'Add details about your venue, upload photos, and set your availability.'
  }, {
    number: '3',
    title: 'Set Your Terms',
    description: 'Define your booking policies, pricing, and any special requirements.'
  }, {
    number: '4',
    title: 'Start Receiving Bookings',
    description: 'Review and respond to booking requests from event planners.'
  }];
  const testimonials = [{
    quote: "Since listing our venue on When's The Fun, we've seen a 40% increase in bookings. The platform makes it easy to manage our calendar and communicate with clients.",
    author: 'Michael Rodriguez',
    role: 'Owner, The Urban Loft',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }, {
    quote: "The analytics tools have been invaluable for understanding our market and optimizing our pricing. We've been able to identify peak booking times and adjust accordingly.",
    author: 'Sarah Johnson',
    role: 'Manager, Bayview Event Center',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }];
  const faqs = [{
    question: 'How much does it cost to list my venue?',
    answer: 'We offer a free Basic plan that allows you to list your venue with essential features. Premium and Professional plans are available for venues looking for enhanced visibility and additional features.'
  }, {
    question: 'How do I receive payments for bookings?',
    answer: "When's The Fun offers secure payment processing. You can choose to receive payments directly to your bank account or through our platform's payment system, which handles deposits, final payments, and refunds if necessary."
  }, {
    question: 'Can I integrate with my existing booking system?',
    answer: 'Yes, our Professional plan includes API access that allows integration with popular booking systems. Our team can assist with custom integrations to ensure a seamless experience.'
  }, {
    question: 'What types of venues can be listed?',
    answer: "We welcome a wide variety of venues including event spaces, restaurants, bars, theaters, galleries, outdoor venues, and unique spaces. If you're unsure if your venue qualifies, please contact our support team."
  }, {
    question: 'How long does it take to get my venue approved?',
    answer: 'Most venues are approved within 1-2 business days after submission. Our team reviews each listing to ensure it meets our quality standards before it goes live on the platform.'
  }];
  return <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              List Your Venue on When's The Fun
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Connect with event planners, fill your calendar, and grow your
              venue business
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigate('/venues/submit')} className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-md hover:bg-indigo-50 transition-colors">
                List Your Venue
              </button>
              <button onClick={() => navigate('/partner-with-us')} className="px-8 py-3 bg-indigo-700 text-white font-medium rounded-md hover:bg-indigo-800 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Why List Your Venue With Us
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Join hundreds of venue owners who are growing their business with
              When's The Fun
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Powerful Features for Venue Owners
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our platform is designed specifically for venue owners and
                managers, with tools to streamline your booking process and
                maximize your venue's potential.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800">{feature}</p>
                    </div>
                  </div>)}
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Venue dashboard" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
      {/* How It Works */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started is easy with our simple 4-step process
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 text-xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Pricing Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your venue
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
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                        <span>{feature}</span>
                      </li>)}
                  </ul>
                  <button onClick={() => navigate('/venues/submit')} className={`w-full py-3 px-4 rounded-md font-medium ${plan.recommended ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
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
              What Venue Owners Say
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from venue owners who have grown their business with When's
              The Fun
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <img src={testimonial.image} alt={testimonial.author} className="h-16 w-16 rounded-full object-cover" />
                  </div>
                  <div>
                    <p className="text-gray-800 mb-4">"{testimonial.quote}"</p>
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
      {/* FAQs */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about listing your venue
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
          <h2 className="text-3xl font-bold mb-4">Ready to List Your Venue?</h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
            Join hundreds of venues already growing their business on When's The
            Fun
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigate('/venues/submit')} className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-md hover:bg-indigo-50 transition-colors">
              List Your Venue
            </button>
            <button onClick={() => navigate('/contact')} className="px-8 py-3 bg-indigo-800 text-white font-medium rounded-md hover:bg-indigo-900 transition-colors border border-indigo-600">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>;
};