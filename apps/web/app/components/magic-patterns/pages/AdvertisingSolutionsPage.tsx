import React from 'react';
import { useNavigationContext } from '../context/NavigationContext';
import { Megaphone, Target, BarChart, Users, Globe, Mail, Calendar, Star, CheckCircle, Award, Zap, TrendingUp } from 'lucide-react';
export const AdvertisingSolutionsPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const adSolutions = [{
    title: 'Featured Events',
    description: 'Showcase your event at the top of search results and on the homepage to maximize visibility.',
    icon: <Calendar className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Targeted Email Campaigns',
    description: 'Reach users based on their interests, location, and event history with personalized email promotions.',
    icon: <Mail className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Banner Advertising',
    description: 'Display eye-catching banners across the platform to promote your events, venues, or services.',
    icon: <Megaphone className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Sponsored Content',
    description: 'Share your story through native content that engages our community of event-goers.',
    icon: <Globe className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Retargeting Campaigns',
    description: 'Re-engage users who have shown interest in your events or visited your pages.',
    icon: <Target className="h-8 w-8 text-indigo-600" />
  }, {
    title: 'Performance Analytics',
    description: 'Track and optimize your campaigns with detailed insights and reporting.',
    icon: <BarChart className="h-8 w-8 text-indigo-600" />
  }];
  const audienceStats = [{
    metric: '2.5M+',
    description: 'Monthly active users'
  }, {
    metric: '85%',
    description: 'Users aged 21-45'
  }, {
    metric: '70%',
    description: 'Users attend 3+ events monthly'
  }, {
    metric: '$120',
    description: 'Average spend per event'
  }];
  const pricingPlans = [{
    name: 'Starter',
    price: '$99',
    period: 'per month',
    features: ['Featured event listing (1 event)', 'Basic audience targeting', 'Standard analytics dashboard', 'Email support'],
    recommended: false,
    ctaText: 'Get Started'
  }, {
    name: 'Growth',
    price: '$299',
    period: 'per month',
    features: ['Featured event listings (3 events)', 'Banner advertising', 'Advanced audience targeting', 'Email campaign (1 per month)', 'Detailed analytics and reporting', 'Priority support'],
    recommended: true,
    ctaText: 'Most Popular'
  }, {
    name: 'Premium',
    price: '$799',
    period: 'per month',
    features: ['Featured event listings (unlimited)', 'Premium banner placements', 'Custom audience segments', 'Email campaigns (4 per month)', 'Sponsored content opportunities', 'Retargeting capabilities', 'Dedicated account manager'],
    recommended: false,
    ctaText: 'Contact Sales'
  }];
  const testimonials = [{
    quote: "Our festival attendance increased by 40% after running a targeted campaign on When's The Fun. The platform's ability to reach local event enthusiasts made all the difference.",
    author: 'Michael Chen',
    role: 'Marketing Director, Sunset Music Festival',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }, {
    quote: "The ROI we've seen from our advertising campaigns has been exceptional. The detailed analytics helped us refine our messaging and target the right audience segments.",
    author: 'Sarah Johnson',
    role: 'Event Coordinator, City Theater Company',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }, {
    quote: "As a venue owner, the Featured Listings have been invaluable for increasing our bookings. We're reaching people who are actively looking for spaces like ours.",
    author: 'David Rodriguez',
    role: 'Owner, The Grand Hall',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80'
  }];
  const faqs = [{
    question: "How do I get started with advertising on When's The Fun?",
    answer: 'Getting started is easy! You can sign up for an advertising account directly from our website, choose your preferred advertising solution, set your budget, and launch your campaign. Our team is available to help you optimize your campaign for the best results.'
  }, {
    question: 'What types of targeting options are available?',
    answer: 'We offer a variety of targeting options including location (city, neighborhood), demographics (age, gender), interests (music genres, event types), past attendance behavior, and more. Our Growth and Premium plans offer advanced targeting capabilities for more precise audience segmentation.'
  }, {
    question: 'How much should I budget for my advertising campaign?',
    answer: 'Advertising budgets vary depending on your goals, campaign duration, and target audience. Our Starter plan begins at $99/month, while more comprehensive solutions are available with our Growth and Premium plans. We recommend starting with a test budget to measure performance before scaling up.'
  }, {
    question: 'Can I track the performance of my campaigns?',
    answer: 'Yes, all advertising plans include access to our analytics dashboard where you can track impressions, clicks, conversions, and other key metrics. Our Growth and Premium plans offer more detailed reporting capabilities to help you optimize your campaigns.'
  }, {
    question: 'Do you offer custom advertising solutions?',
    answer: 'Absolutely! For advertisers with specific needs or larger budgets, we offer custom advertising solutions tailored to your goals. This might include sponsorship opportunities, custom content creation, or integrated marketing campaigns. Contact our sales team to discuss your requirements.'
  }];
  const adTypes = [{
    title: 'Event Promotion',
    description: 'Boost attendance for your events with targeted promotions',
    path: '/advertise/event-promotion',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }, {
    title: 'Featured Listings',
    description: 'Stand out in search results and category pages',
    path: '/advertise/featured-listings',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }, {
    title: 'Homepage Showcase',
    description: 'Premium placement on our high-traffic homepage',
    path: '/advertise/homepage-showcase',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }, {
    title: 'Email Campaigns',
    description: 'Reach our engaged audience directly in their inbox',
    path: '/advertise/email-campaigns',
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }];
  return <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              Advertising Solutions
            </h1>
            <p className="text-xl text-orange-100 mb-8">
              Connect with our engaged audience of event-goers and grow your
              business
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => navigateTo('/advertise/packages')} className="px-8 py-3 bg-white text-orange-600 font-medium rounded-md hover:bg-orange-50 transition-colors">
                View Pricing
              </button>
              <button onClick={() => navigateTo('/advertise/contact')} className="px-8 py-3 bg-orange-700 text-white font-medium rounded-md hover:bg-orange-800 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Audience Overview */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Reach Our Engaged Audience
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with millions of active event-goers who are looking for
              experiences like yours
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {audienceStats.map((stat, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {stat.metric}
                </div>
                <p className="text-gray-600">{stat.description}</p>
              </div>)}
          </div>
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Who You'll Reach
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Our platform connects you with an audience that's actively
                searching for events, venues, and experiences. These aren't just
                casual browsers—they're people ready to take action.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Event Enthusiasts
                    </h4>
                    <p className="text-gray-600">
                      Active event-goers who attend multiple events each month
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Local Audiences
                    </h4>
                    <p className="text-gray-600">
                      People looking for events and venues in their local area
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Event Planners
                    </h4>
                    <p className="text-gray-600">
                      Professionals searching for venues and services for their
                      events
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Trend Seekers</h4>
                    <p className="text-gray-600">
                      Early adopters looking for new and unique experiences
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Event audience" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
      {/* Advertising Solutions */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Our Advertising Solutions
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible options to meet your marketing goals and budget
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {adSolutions.map((solution, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                  {solution.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {solution.title}
                </h3>
                <p className="text-gray-600">{solution.description}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* Ad Types */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Choose Your Advertising Type
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our different advertising options tailored to your
              specific needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {adTypes.map((type, index) => <div key={index} className="group relative h-64 rounded-lg overflow-hidden shadow-md cursor-pointer" onClick={() => navigateTo(type.path)}>
                <img src={type.image} alt={type.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-bold text-2xl mb-2">
                    {type.title}
                  </h3>
                  <p className="text-white/90">{type.description}</p>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      {/* Why Advertise With Us */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Advertise With Us
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                When's The Fun offers unique advantages that help your marketing
                dollars go further and deliver measurable results.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Highly Targeted Audience
                    </h3>
                    <p className="text-gray-600">
                      Reach people based on location, interests, event history,
                      and more
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Intent-Based Platform
                    </h3>
                    <p className="text-gray-600">
                      Connect with users actively searching for events and
                      venues
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Detailed Analytics
                    </h3>
                    <p className="text-gray-600">
                      Track performance and optimize campaigns in real-time
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Flexible Options
                    </h3>
                    <p className="text-gray-600">
                      Solutions for every budget and marketing objective
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Expert Support
                    </h3>
                    <p className="text-gray-600">
                      Guidance from our experienced advertising team
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1550305080-4e029753abcf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Marketing analytics" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
      {/* Pricing Plans */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Advertising Packages
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your marketing goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => <div key={index} className={`bg-white rounded-lg shadow-md overflow-hidden ${plan.recommended ? 'ring-2 ring-indigo-600' : ''}`}>
                {plan.recommended && <div className="bg-indigo-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
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
                  <button onClick={() => navigateTo('/advertise/packages')} className={`w-full py-3 px-4 rounded-md font-medium ${plan.recommended ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                    {plan.ctaText}
                  </button>
                </div>
              </div>)}
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Need a custom solution?{' '}
              <button onClick={() => navigateTo('/advertise/contact')} className="text-indigo-600 font-medium hover:text-indigo-800">
                Contact our sales team
              </button>
            </p>
          </div>
        </div>
      </div>
      {/* Testimonials */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Success Stories
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from businesses that have achieved great results with our
              advertising solutions
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
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our advertising solutions
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
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto">
            Join hundreds of businesses already reaching our engaged audience of
            event-goers
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigateTo('/advertise/packages')} className="px-8 py-3 bg-white text-indigo-700 font-medium rounded-md hover:bg-indigo-50 transition-colors">
              View Pricing
            </button>
            <button onClick={() => navigateTo('/advertise/contact')} className="px-8 py-3 bg-indigo-800 text-white font-medium rounded-md hover:bg-indigo-900 transition-colors border border-indigo-600">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>;
};