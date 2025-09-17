import React, { useState } from 'react';
import { PhoneIcon, MailIcon, MapPinIcon, ArrowLeftIcon, CheckIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

export const AdvertiseContactPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    company: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    message: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };
  
  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">Thank You!</h1>
              <p className="text-xl">We've received your inquiry and will get back to you soon.</p>
            </div>
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-green-50 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
            <CheckIcon className="h-12 w-12 text-green-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your request has been submitted</h2>
          <p className="text-lg text-gray-600 mb-8">
            A member of our sales team will contact you within 24 hours to discuss your advertising needs.
          </p>
          
          <button
            onClick={() => navigate('/advertise')}
            className="px-6 py-3 bg-orange-600 text-white font-medium rounded-md shadow-sm hover:bg-orange-700"
          >
            Back to Advertising
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate('/advertise/packages')}
              className="mr-4 p-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-4xl font-extrabold">Contact Our Sales Team</h1>
          </div>
          <p className="text-xl opacity-90 max-w-3xl">
            Let's create a custom advertising solution that fits your specific needs and budget
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Our advertising specialists are here to help you create the perfect campaign for your business.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <PhoneIcon className="h-6 w-6 text-orange-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-gray-600">1-800-555-0123</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9am-5pm EST</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MailIcon className="h-6 w-6 text-orange-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-gray-600">sales@whensthefun.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPinIcon className="h-6 w-6 text-orange-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Office</p>
                  <p className="text-gray-600">123 Main Street</p>
                  <p className="text-gray-600">Tampa, FL 33601</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-orange-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">Why Choose Custom?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Tailored pricing for your budget</li>
                <li>• Custom campaign strategies</li>
                <li>• Volume discounts available</li>
                <li>• Flexible contract terms</li>
                <li>• Dedicated account management</li>
              </ul>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={formData.contactName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    placeholder="Street address, city, state, ZIP"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Tell us about your advertising needs (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="What type of events do you promote? What are your advertising goals?"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  * Required fields. We'll use this information to contact you about your custom advertising solution.
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/advertise/packages')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ← Back to packages
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-orange-600 text-white font-medium rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};