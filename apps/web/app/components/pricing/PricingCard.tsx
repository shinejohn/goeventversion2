import React from 'react';
import { Check, X } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: number;
  yearlyPrice: number;
  description: string;
  features: string[];
  limitations: string[];
  isPopular?: boolean;
  userType: 'fan' | 'performer' | 'venue_manager' | 'influencer' | 'organizer';
  onSelect: (userType: string, plan: string) => void;
  selected?: boolean;
}

export function PricingCard({
  title,
  price,
  yearlyPrice,
  description,
  features,
  limitations,
  isPopular = false,
  userType,
  onSelect,
  selected = false
}: PricingCardProps) {
  const [isYearly, setIsYearly] = React.useState(false);
  
  const currentPrice = isYearly ? yearlyPrice : price;
  const savings = isYearly ? Math.round(((price * 12) - yearlyPrice) / (price * 12) * 100) : 0;

  return (
    <div className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
      isPopular ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
    } ${selected ? 'ring-2 ring-green-500' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl font-bold text-gray-900">
              ${currentPrice}
            </span>
            <span className="text-gray-500">/{isYearly ? 'year' : 'month'}</span>
          </div>
          
          {isYearly && savings > 0 && (
            <div className="text-sm text-green-600 font-medium">
              Save {savings}% with yearly billing
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-3 py-1 rounded-full text-sm ${
              !isYearly ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-3 py-1 rounded-full text-sm ${
              isYearly ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {limitations.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Limitations:</h4>
            <ul className="space-y-2">
              {limitations.map((limitation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500 text-sm">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={() => onSelect(userType, isYearly ? 'yearly' : 'monthly')}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
          selected
            ? 'bg-green-500 text-white hover:bg-green-600'
            : isPopular
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {selected ? 'Selected' : `Choose ${title}`}
      </button>
    </div>
  );
}
