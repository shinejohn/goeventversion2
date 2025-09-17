import React, { useState } from 'react';
import { CheckIcon, StoreIcon, TrendingUpIcon, UsersIcon, ShieldCheckIcon, HeadphonesIcon, DollarSignIcon, PackageIcon, BarChartIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

export const BecomeVendorPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('professional');

  const plans = [
    {
      id: 'basic',
      name: 'Basic Vendor',
      price: '$19',
      period: '/month',
      description: 'Perfect for individuals and small businesses',
      features: [
        'Up to 20 product listings',
        'Basic analytics dashboard',
        'Standard commission rate (15%)',
        'Email support',
        'Monthly payouts',
      ],
      limitations: [
        'No featured products',
        'Limited promotion tools',
      ]
    },
    {
      id: 'professional',
      name: 'Professional Vendor',
      price: '$49',
      period: '/month',
      description: 'Ideal for growing businesses',
      features: [
        'Up to 100 product listings',
        'Advanced analytics & insights',
        'Reduced commission rate (10%)',
        'Priority email & chat support',
        'Bi-weekly payouts',
        'Featured products (5/month)',
        'Promotional tools access',
        'Custom store page',
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Vendor',
      price: '$149',
      period: '/month',
      description: 'For established businesses and brands',
      features: [
        'Unlimited product listings',
        'Full analytics suite',
        'Lowest commission rate (7%)',
        'Dedicated account manager',
        'Weekly payouts',
        'Unlimited featured products',
        'Priority promotion placement',
        'Custom branding options',
        'API access',
        'Bulk upload tools',
      ]
    }
  ];

  const benefits = [
    {
      icon: UsersIcon,
      title: 'Access to Event Community',
      description: 'Reach thousands of event organizers, performers, and attendees actively looking for supplies.'
    },
    {
      icon: TrendingUpIcon,
      title: 'Grow Your Business',
      description: 'Leverage our marketing tools and featured placements to increase your visibility and sales.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Platform',
      description: 'Sell with confidence on our secure platform with fraud protection and reliable payment processing.'
    },
    {
      icon: BarChartIcon,
      title: 'Analytics & Insights',
      description: 'Track your performance with detailed analytics and insights to optimize your listings.'
    },
    {
      icon: HeadphonesIcon,
      title: 'Dedicated Support',
      description: 'Get help when you need it with our responsive vendor support team.'
    },
    {
      icon: DollarSignIcon,
      title: 'Competitive Rates',
      description: 'Enjoy some of the lowest commission rates in the industry with transparent pricing.'
    }
  ];

  const handleGetStarted = () => {
    navigate('/auth/register?type=vendor&plan=' + selectedPlan);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl mb-6">
              Become a GoEventCity Vendor
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Join our marketplace and reach thousands of event organizers and enthusiasts. 
              Grow your business with the leading event supplies platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started Now
              </button>
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600">50K+</div>
              <div className="text-gray-600 mt-2">Active Buyers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600">$2M+</div>
              <div className="text-gray-600 mt-2">Monthly Sales</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600">1000+</div>
              <div className="text-gray-600 mt-2">Active Vendors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600">4.8/5</div>
              <div className="text-gray-600 mt-2">Vendor Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Sell on GoEventCity?</h2>
            <p className="text-xl text-gray-600">Join a thriving marketplace designed for the event industry</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <Icon className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600">Select the plan that best fits your business needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow-md p-8 relative ${
                  plan.popular ? 'ring-2 ring-purple-600' : ''
                } ${selectedPlan === plan.id ? 'bg-purple-50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 text-sm rounded-bl-lg rounded-tr-lg">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors mb-6 ${
                    selectedPlan === plan.id
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                </button>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation, idx) => (
                    <li key={`limit-${idx}`} className="flex items-start text-gray-400">
                      <span className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 text-center">✕</span>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={handleGetStarted}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors"
            >
              Get Started with {plans.find(p => p.id === selectedPlan)?.name}
            </button>
            <p className="text-gray-600 mt-4">30-day money-back guarantee • No setup fees • Cancel anytime</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Start selling in just a few simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your vendor account and choose your plan</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">List Products</h3>
              <p className="text-gray-600">Add your products with photos, descriptions, and pricing</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Start Selling</h3>
              <p className="text-gray-600">Your products go live and customers can start purchasing</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold mb-2">Get Paid</h3>
              <p className="text-gray-600">Receive payouts according to your plan schedule</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">What types of products can I sell?</h3>
              <p className="text-gray-600">You can sell any event-related products including equipment, supplies, decorations, promotional items, and more. All products must comply with our marketplace guidelines.</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">How do I get paid?</h3>
              <p className="text-gray-600">Payments are processed automatically according to your plan's payout schedule. We support direct deposit, PayPal, and wire transfers for your convenience.</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-600">Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades will be applied at the start of your next billing cycle.</p>
            </div>
            <div className="bg-white rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">What support is available?</h3>
              <p className="text-gray-600">All vendors have access to our help center and email support. Professional and Enterprise plans include additional support channels and faster response times.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Selling?</h2>
          <p className="text-xl text-purple-100 mb-8">Join thousands of successful vendors on GoEventCity today</p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Become a Vendor Now
          </button>
        </div>
      </div>
    </div>
  );
};