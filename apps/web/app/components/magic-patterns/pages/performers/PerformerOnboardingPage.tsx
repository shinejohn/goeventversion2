import React, { useState } from 'react';
import { MusicIcon, CheckIcon, DollarSignIcon, BarChartIcon, UsersIcon, CalendarIcon, StarIcon, ArrowRightIcon, MapPinIcon, ClockIcon, CheckCircleIcon, TicketIcon, ShoppingBagIcon, GlobeIcon, CalendarDaysIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
export const PerformerOnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/performers/setup-profile');
    }
  };
  return <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              Grow Your Performance Career
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              When's The Fun connects performers with venues, events, and fans
              to help you book more gigs, grow your audience, and increase your
              income.
            </p>
          </div>
        </div>
      </div>
      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <span className="font-medium">1</span>
                </div>
                <span className="text-sm mt-2">Learn</span>
              </div>
              <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <span className="font-medium">2</span>
                </div>
                <span className="text-sm mt-2">Payment</span>
              </div>
              <div className={`flex-1 h-1 mx-4 ${currentStep >= 3 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <span className="font-medium">3</span>
                </div>
                <span className="text-sm mt-2">Profile</span>
              </div>
            </div>
          </div>
        </div>
        {/* Step 1: How It Works */}
        {currentStep === 1 && <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How When's The Fun Works for Performers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600">
                    <CalendarIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Book More Gigs
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Get discovered by venues and event organizers looking for
                    talent like you. Apply for gigs that match your style and
                    availability.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600">
                    <UsersIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Grow Your Audience
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Promote your upcoming shows to our community of local
                    event-goers who are actively looking for entertainment.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600">
                    <DollarSignIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Increase Your Income
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Set your rates, negotiate terms, and get paid securely
                    through our platform. No more chasing payments.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600">
                    <BarChartIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Track Your Success
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Get insights on your performance, reviews, and audience
                    engagement to help you improve and grow.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600">
                    <MusicIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Help Sell Events
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Create and promote your own events directly to fans. Control
                    every aspect from lineup to ticket prices.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600">
                    <TicketIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Help Sell Tickets
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Sell tickets directly to your fans with our integrated
                    ticketing system. Earn commissions on every sale.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600">
                    <ShoppingBagIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Sell Gear
                  </h3>
                  <p className="mt-2 text-gray-600">
                    List your merchandise, instruments, or equipment in our
                    marketplace and connect with buyers directly.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600">
                    <GlobeIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Create Your Own Community
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Build and manage a dedicated community hub for your fans,
                    connecting with them directly and driving engagement.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600">
                    <CalendarDaysIcon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Create Specialized Calendars
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Design custom calendars for your genre, tour, or local scene
                    to keep fans updated on all your performances.
                  </p>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              What's Included:
            </h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span>
                  Professional performer profile visible to venues and fans
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span>
                  Access to the gig marketplace with new opportunities daily
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span>
                  Promotion of your events on our platform and social media
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span>Secure payment processing with direct deposits</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span>Performance analytics and audience insights</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span>Dedicated support for performers</span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span>
                  Tools to create and manage your own events and calendars
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                <span>Merchandise and gear selling capabilities</span>
              </li>
            </ul>
            <div className="flex justify-center">
              <button onClick={handleContinue} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-sm">
                Continue to Subscription Options
                <ArrowRightIcon className="ml-2 h-5 w-5 inline" />
              </button>
            </div>
          </div>}
        {/* Step 2: Payment Options */}
        {currentStep === 2 && <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Choose Your Subscription Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Basic Plan */}
              <div className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 hover:shadow-md transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Basic</h3>
                <div className="text-3xl font-bold text-purple-600 mb-4">
                  $9.99
                  <span className="text-base font-normal text-gray-500">
                    /month
                  </span>
                </div>
                <p className="text-gray-600 mb-6">
                  Perfect for solo performers just getting started
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Standard performer profile</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Apply to up to 10 gigs per month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Basic analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Email support</span>
                  </li>
                </ul>
                <button className="w-full py-2 bg-purple-100 text-purple-700 font-medium rounded-md hover:bg-purple-200 transition-colors">
                  Select Plan
                </button>
              </div>
              {/* Pro Plan */}
              <div className="border-2 border-purple-500 rounded-lg p-6 shadow-md relative">
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  POPULAR
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="text-3xl font-bold text-purple-600 mb-4">
                  $24.99
                  <span className="text-base font-normal text-gray-500">
                    /month
                  </span>
                </div>
                <p className="text-gray-600 mb-6">
                  For active performers looking to grow
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Featured performer profile</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Unlimited gig applications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Promotion on our social media</span>
                  </li>
                </ul>
                <button className="w-full py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors">
                  Select Plan
                </button>
              </div>
              {/* Premium Plan */}
              <div className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 hover:shadow-md transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Premium
                </h3>
                <div className="text-3xl font-bold text-purple-600 mb-4">
                  $49.99
                  <span className="text-base font-normal text-gray-500">
                    /month
                  </span>
                </div>
                <p className="text-gray-600 mb-6">
                  For professional bands and established performers
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Premium featured profile</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Unlimited gig applications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Premium placement in search</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span>Featured in email newsletters</span>
                  </li>
                </ul>
                <button className="w-full py-2 bg-purple-100 text-purple-700 font-medium rounded-md hover:bg-purple-200 transition-colors">
                  Select Plan
                </button>
              </div>
            </div>
            <div className="text-center mb-8">
              <p className="text-gray-600">
                All plans include a 14-day free trial. Cancel anytime.
              </p>
            </div>
            <div className="flex justify-center">
              <button onClick={handleContinue} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-sm">
                Continue to Profile Setup
                <ArrowRightIcon className="ml-2 h-5 w-5 inline" />
              </button>
            </div>
          </div>}
        {/* Step 3: Profile Setup */}
        {currentStep === 3 && <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Set Up Your Performer Profile
            </h2>
            <div className="space-y-6 mb-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Performer/Band Name *
                </label>
                <input type="text" id="name" className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" placeholder="Your stage name or band name" />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Performance Category *
                </label>
                <select id="category" className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                  <option value="">Select a category</option>
                  <option value="band">Band</option>
                  <option value="solo-musician">Solo Musician</option>
                  <option value="dj">DJ</option>
                  <option value="comedian">Comedian</option>
                  <option value="dancer">Dancer</option>
                  <option value="speaker">Speaker</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="genres" className="block text-sm font-medium text-gray-700 mb-1">
                  Genres/Styles (select up to 3) *
                </label>
                <select id="genres" multiple className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" size={3}>
                  <option value="rock">Rock</option>
                  <option value="pop">Pop</option>
                  <option value="jazz">Jazz</option>
                  <option value="blues">Blues</option>
                  <option value="country">Country</option>
                  <option value="electronic">Electronic</option>
                  <option value="hip-hop">Hip Hop</option>
                  <option value="classical">Classical</option>
                  <option value="folk">Folk</option>
                  <option value="r-and-b">R&B</option>
                  <option value="metal">Metal</option>
                  <option value="indie">Indie</option>
                </select>
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio/Description *
                </label>
                <textarea id="bio" rows={4} className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" placeholder="Tell venues and fans about yourself, your music, and your performance style"></textarea>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Home Location *
                </label>
                <input type="text" id="location" className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500" placeholder="City, State" />
              </div>
              <div>
                <label htmlFor="price-range" className="block text-sm font-medium text-gray-700 mb-1">
                  Typical Price Range *
                </label>
                <select id="price-range" className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                  <option value="">Select price range</option>
                  <option value="$">$ (Under $200)</option>
                  <option value="$$">$$ ($200-$500)</option>
                  <option value="$$$">$$$ ($500-$1000)</option>
                  <option value="$$$$">$$$$ ($1000+)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center">
              <button onClick={handleContinue} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md shadow-sm">
                Complete Profile Setup
                <ArrowRightIcon className="ml-2 h-5 w-5 inline" />
              </button>
            </div>
          </div>}
        {/* Testimonials */}
        <div className="mt-12 bg-purple-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            What Performers Say About Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-gray-600 mb-4">
                "I've booked 12 gigs in my first month using When's The Fun. The
                platform connects me directly with venues looking for my style
                of music."
              </p>
              <div className="font-medium">
                <p className="text-gray-900">Sarah Johnson</p>
                <p className="text-gray-500 text-sm">Folk Singer-Songwriter</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-gray-600 mb-4">
                "As a DJ, I was struggling to find consistent work. Since
                joining When's The Fun, I'm now booked solid every weekend and
                have raised my rates."
              </p>
              <div className="font-medium">
                <p className="text-gray-900">DJ Coastal</p>
                <p className="text-gray-500 text-sm">Electronic Music DJ</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-gray-600 mb-4">
                "Our band has grown our local following by 300% in just 6
                months. The exposure through When's The Fun has been incredible
                for us."
              </p>
              <div className="font-medium">
                <p className="text-gray-900">The Sunset Vibes</p>
                <p className="text-gray-500 text-sm">Indie Rock Band</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};