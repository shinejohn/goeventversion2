import React from 'react';
import { CheckIcon, ArrowRightIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
export const AdPackagesPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  // Pricing plans
  const pricingPlans = [{
    name: 'Basic',
    price: '$49',
    period: 'per month',
    description: 'Perfect for small businesses and occasional events',
    features: ['Event promotion for up to 3 events', 'Standard listing placement', 'Basic performance analytics', 'Community directory listing'],
    cta: 'Get Started',
    highlighted: false,
    path: '/checkout/details?plan=basic-advertising'
  }, {
    name: 'Professional',
    price: '$99',
    period: 'per month',
    description: 'Ideal for regular event organizers and venues',
    features: ['Event promotion for up to 10 events', 'Featured listing placement', 'Advanced performance analytics', 'Email newsletter inclusion', 'Social media promotion', 'Priority support'],
    cta: 'Start Free Trial',
    highlighted: true,
    path: '/checkout/details?plan=professional-advertising'
  }, {
    name: 'Enterprise',
    price: '$249',
    period: 'per month',
    description: 'For major venues and event series',
    features: ['Unlimited event promotions', 'Premium listing placement', 'Comprehensive analytics dashboard', 'Dedicated email campaigns', 'Homepage showcase rotation', 'Dedicated account manager', 'Custom reporting'],
    cta: 'Purchase Now',
    highlighted: false,
    path: '/checkout/details?plan=enterprise-advertising'
  }];
  return <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">
              Advertising Packages
            </h1>
            <p className="mt-3 text-xl max-w-3xl mx-auto">
              Choose the perfect advertising solution to reach your target
              audience
            </p>
          </div>
        </div>
      </div>
      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Select Your Advertising Package
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that fits your business needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => <div key={index} className={`border rounded-lg overflow-hidden ${plan.highlighted ? 'border-orange-500 shadow-lg relative' : 'border-gray-200'}`}>
              {plan.highlighted && <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-orange-500 text-white text-xs font-bold rounded-full h-16 w-16 flex items-center justify-center transform rotate-12">
                  <span className="text-center leading-tight">
                    BEST
                    <br />
                    VALUE
                  </span>
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
                      <CheckIcon className={`h-5 w-5 ${plan.highlighted ? 'text-orange-500' : 'text-green-500'} mr-2 mt-0.5 flex-shrink-0`} />
                      <span className="text-gray-700">{feature}</span>
                    </li>)}
                </ul>
                <div className="mt-8">
                  <button className={`w-full py-3 px-4 rounded-md shadow font-medium ${plan.highlighted ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'}`} onClick={() => navigateTo(plan.path)}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            </div>)}
        </div>
        <div className="text-center mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Need a custom solution?
          </h3>
          <p className="text-gray-600 mb-4">
            Our team can create a tailored advertising package to meet your
            specific needs
          </p>
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700" onClick={() => navigateTo('/advertise/contact')}>
            Contact Our Sales Team
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to know about our advertising packages
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {[{
            question: 'How soon will my ads start running?',
            answer: 'Once your payment is processed, your ads will typically start running within 24 hours. For enterprise customers, we offer expedited setup.'
          }, {
            question: 'Can I change my plan later?',
            answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.'
          }, {
            question: 'Do you offer refunds?',
            answer: "We offer a 7-day money-back guarantee if you're not satisfied with our services. After that period, refunds are considered on a case-by-case basis."
          }, {
            question: 'How do I track the performance of my ads?',
            answer: 'All plans include access to our analytics dashboard where you can track impressions, clicks, and conversions in real-time.'
          }].map((faq, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>)}
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="bg-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to boost your visibility?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join hundreds of local businesses who've increased their audience
            with our advertising solutions
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-white text-orange-600 font-medium rounded-md shadow-sm hover:bg-orange-50" onClick={() => navigateTo('/checkout/details?plan=professional-advertising')}>
              Get Started Now
            </button>
            <button className="px-8 py-3 bg-orange-700 text-white font-medium rounded-md shadow-sm border border-orange-500 hover:bg-orange-800" onClick={() => navigateTo('/advertise/contact')}>
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>;
};