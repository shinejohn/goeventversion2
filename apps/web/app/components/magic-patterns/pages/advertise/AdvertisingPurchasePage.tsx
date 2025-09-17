import React, { useState } from 'react';
import { CheckIcon, CreditCardIcon, ShieldCheckIcon, ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

interface AdvertisingPurchasePageProps {
  selectedPlan: string;
}

export const AdvertisingPurchasePage = ({ selectedPlan }: AdvertisingPurchasePageProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Plan details
  const plans = {
    basic: {
      name: 'Basic',
      price: '$49',
      period: 'per month',
      description: 'Perfect for small businesses and occasional events',
      features: [
        'Event promotion for up to 3 events',
        'Standard listing placement',
        'Basic performance analytics',
        'Community directory listing'
      ]
    },
    professional: {
      name: 'Professional',
      price: '$99',
      period: 'per month',
      description: 'Ideal for regular event organizers and venues',
      features: [
        'Event promotion for up to 10 events',
        'Featured listing placement',
        'Advanced performance analytics',
        'Email newsletter inclusion',
        'Social media promotion',
        'Priority support'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: '$249',
      period: 'per month',
      description: 'For major venues and event series',
      features: [
        'Unlimited event promotions',
        'Premium listing placement',
        'Comprehensive analytics dashboard',
        'Dedicated email campaigns',
        'Homepage showcase rotation',
        'Dedicated account manager',
        'Custom reporting'
      ]
    }
  };
  
  const currentPlan = plans[selectedPlan as keyof typeof plans] || plans.professional;
  
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingZip: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      // Navigate to success page or dashboard
      navigate('/advertise/success?plan=' + selectedPlan);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => navigate('/advertise/packages')}
              className="mr-4 p-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="text-3xl font-extrabold">Complete Your Purchase</h1>
          </div>
          <p className="text-xl opacity-90">
            You're one step away from boosting your visibility on When's The Fun
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{currentPlan.name} Plan</h4>
                <p className="text-sm text-gray-600 mt-1">{currentPlan.description}</p>
                <div className="mt-3 flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900">{currentPlan.price}</span>
                  <span className="text-gray-500 ml-1">/{currentPlan.period.replace('per ', '')}</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Today</span>
                  <span>{currentPlan.price}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Then {currentPlan.price} {currentPlan.period}
                </p>
              </div>
            </div>
          </div>
          
          {/* Purchase Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Business Information */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={formData.businessName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
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
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
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
                </div>
              </div>
              
              {/* Payment Information */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h3>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        required
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                      />
                      <CreditCardIcon className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        required
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        required
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        value={formData.cvv}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="billingZip" className="block text-sm font-medium text-gray-700 mb-2">
                      Billing ZIP Code
                    </label>
                    <input
                      type="text"
                      id="billingZip"
                      name="billingZip"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={formData.billingZip}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              {/* Security Notice */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-start">
                <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">Secure Payment Processing</p>
                  <p>Your payment information is encrypted and processed securely. We never store your card details.</p>
                </div>
              </div>
              
              {/* Submit Button */}
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
                  {loading ? 'Processing...' : `Purchase ${currentPlan.name} Plan`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};