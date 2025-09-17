import React from 'react';
import { CheckIcon, MailIcon, CalendarIcon, BarChartIcon, ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

interface AdvertiseSuccessPageProps {
  selectedPlan: string;
}

export const AdvertiseSuccessPage = ({ selectedPlan }: AdvertiseSuccessPageProps) => {
  const navigate = useNavigate();
  
  const planNames = {
    basic: 'Basic',
    professional: 'Professional',
    enterprise: 'Enterprise'
  };
  
  const planName = planNames[selectedPlan as keyof typeof planNames] || 'Professional';
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-full h-20 w-20 flex items-center justify-center">
                <CheckIcon className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">
              Welcome to When's The Fun Advertising!
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Your {planName} advertising package has been activated successfully
            </p>
          </div>
        </div>
      </div>
      
      {/* Next Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Happens Next?</h2>
          <p className="text-xl text-gray-600">
            Here's how to get started with your advertising campaign
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="bg-orange-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <MailIcon className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Check Your Email</h3>
            <p className="text-gray-600">
              We've sent a confirmation email with your account details and login information
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Schedule Your Ads</h3>
            <p className="text-gray-600">
              Access your advertiser dashboard to create and schedule your first campaigns
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <BarChartIcon className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Track Performance</h3>
            <p className="text-gray-600">
              Monitor your campaign analytics and optimize for better results
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Ready to create your first campaign?
          </h3>
          <p className="text-gray-600 mb-6">
            Access your advertiser dashboard to start promoting your events and venues
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard/advertiser')}
              className="inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-medium rounded-md shadow-sm hover:bg-orange-700"
            >
              Go to Advertiser Dashboard
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/advertise')}
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-medium rounded-md shadow-sm border border-gray-300 hover:bg-gray-50"
            >
              Learn More About Advertising
            </button>
          </div>
        </div>
        
        {/* Support Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Need Help Getting Started?</h3>
            <p className="text-gray-600 mb-4">
              Our support team is here to help you create successful advertising campaigns
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Campaign setup assistance</li>
              <li>• Best practices guide</li>
              <li>• Creative guidelines</li>
              <li>• Performance optimization tips</li>
            </ul>
            <button
              onClick={() => navigate('/help/advertising')}
              className="mt-4 text-orange-600 font-medium hover:text-orange-700"
            >
              Visit Help Center →
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Your Account Manager</h3>
            <p className="text-gray-600 mb-4">
              {planName === 'Enterprise' 
                ? 'Your dedicated account manager will contact you within 24 hours'
                : 'Our sales team is available to help you maximize your advertising investment'
              }
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center">
                <MailIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span>sales@whensthefun.com</span>
              </p>
              <p className="flex items-center">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span>Mon-Fri 9am-5pm EST</span>
              </p>
            </div>
            <button
              onClick={() => navigate('/advertise/contact')}
              className="mt-4 text-orange-600 font-medium hover:text-orange-700"
            >
              Contact Sales Team →
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer CTA */}
      <div className="bg-orange-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Thank you for choosing When's The Fun!
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            We're excited to help you reach more customers and grow your business
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-orange-600 text-white font-medium rounded-md shadow-sm hover:bg-orange-700"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};