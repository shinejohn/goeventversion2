import React, { useState } from 'react';
import { CheckIcon, InfoIcon } from 'lucide-react';
type PricingSectionProps = {
  id: string;
  venue: any;
};
export const PricingSection = ({
  id,
  venue
}: PricingSectionProps) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  return <section id={id} className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Pricing & Packages
      </h2>
      {/* Standard Pricing */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Standard Pricing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              ${venue.pricePerHour}
            </div>
            <div className="text-gray-600">per hour</div>
            <div className="text-sm text-gray-500 mt-2">Minimum 4 hours</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              ${venue.pricePerEvent}
            </div>
            <div className="text-gray-600">per event</div>
            <div className="text-sm text-gray-500 mt-2">Up to 8 hours</div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">
              ${venue.pricePerDay}
            </div>
            <div className="text-gray-600">per day</div>
            <div className="text-sm text-gray-500 mt-2">24-hour access</div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Multi-day discounts available for bookings of 2+ consecutive days.
          Contact for custom pricing for extended bookings.
        </p>
      </div>
      {/* Package Options */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Package Options
        </h3>
        <div className="space-y-4">
          {venue.packageOptions.map((pkg: any, index: number) => <div key={index} className={`border rounded-lg p-4 ${selectedPackage === pkg.name ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {pkg.description}
                  </p>
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">
                      What's included:
                    </h5>
                    <ul className="space-y-1">
                      {pkg.included.map((item: string, idx: number) => <li key={idx} className="flex items-start">
                          <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-600">{item}</span>
                        </li>)}
                    </ul>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    ${pkg.price}
                  </div>
                  <button onClick={() => setSelectedPackage(pkg.name)} className={`mt-2 px-4 py-1 rounded-md text-sm font-medium ${selectedPackage === pkg.name ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    {selectedPackage === pkg.name ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            </div>)}
        </div>
      </div>
      {/* Additional Fees */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Additional Fees
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="space-y-3">
            {venue.additionalFees.map((fee: any, index: number) => <div key={index} className="flex justify-between items-start">
                <div className="flex items-start">
                  <InfoIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">{fee.name}</div>
                    <div className="text-sm text-gray-600">
                      {fee.description}
                    </div>
                  </div>
                </div>
                <div className="font-medium text-gray-900">${fee.amount}</div>
              </div>)}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              All prices are subject to applicable taxes. Additional fees may
              apply for special requests or equipment.
            </p>
          </div>
        </div>
      </div>
    </section>;
};