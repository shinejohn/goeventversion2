import React from 'react';
import { useNavigationContext } from '../../context/NavigationContext';
import { MailIcon, PhoneIcon, UserIcon } from 'lucide-react';
export const AdvertisingContactPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  return <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">
              Contact Our Advertising Team
            </h1>
            <p className="mt-3 text-xl max-w-3xl mx-auto">
              Get personalized help with your advertising needs
            </p>
          </div>
        </div>
      </div>
      {/* Contact Form Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our advertising specialists are ready to help you create the
              perfect campaign for your business. Fill out the form and we'll
              get back to you within 24 hours.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <PhoneIcon className="h-6 w-6 text-orange-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">Call Us</h3>
                  <p className="text-gray-600">(727) 555-1234</p>
                </div>
              </div>
              <div className="flex items-start">
                <MailIcon className="h-6 w-6 text-orange-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-900">Email Us</h3>
                  <p className="text-gray-600">advertising@whensthefun.com</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">
                Not ready to talk?
              </h3>
              <p className="text-gray-600 mb-4">
                Browse our advertising packages to learn more about our
                offerings.
              </p>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700" onClick={() => navigateTo('/advertise/packages')}>
                View Packages
              </button>
            </div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Contact Form
            </h3>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="text" name="name" id="name" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="John Smith" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="email" name="email" id="email" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="tel" name="phone" id="phone" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="(727) 555-1234" />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  How can we help?
                </label>
                <div className="mt-1">
                  <textarea id="message" name="message" rows={4} className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500" placeholder="Tell us about your advertising needs..."></textarea>
                </div>
              </div>
              <div>
                <button type="submit" className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>;
};