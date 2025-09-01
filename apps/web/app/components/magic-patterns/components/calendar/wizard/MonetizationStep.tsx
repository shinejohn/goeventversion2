import React, { useState } from 'react';
import { PlusIcon, TrashIcon, XIcon } from 'lucide-react';
type MonetizationStepProps = {
  formData: any;
  updateFormData: (data: any) => void;
};
export const MonetizationStep = ({
  formData,
  updateFormData
}: MonetizationStepProps) => {
  const [monetization, setMonetization] = useState(formData.monetization || {
    isPaid: false,
    price: 0,
    benefits: [],
    sponsorSlots: 0,
    promoCodes: []
  });
  const [newBenefit, setNewBenefit] = useState('');
  const [newPromoCode, setNewPromoCode] = useState({
    code: '',
    discount: 10,
    expiresAt: ''
  });
  const handleAddBenefit = () => {
    if (newBenefit.trim() && !monetization.benefits.includes(newBenefit.trim())) {
      setMonetization({
        ...monetization,
        benefits: [...monetization.benefits, newBenefit.trim()]
      });
      setNewBenefit('');
    }
  };
  const handleRemoveBenefit = (benefit: string) => {
    setMonetization({
      ...monetization,
      benefits: monetization.benefits.filter(b => b !== benefit)
    });
  };
  const handleAddPromoCode = () => {
    if (newPromoCode.code.trim() && !monetization.promoCodes.some(p => p.code === newPromoCode.code.trim())) {
      setMonetization({
        ...monetization,
        promoCodes: [...monetization.promoCodes, {
          ...newPromoCode,
          code: newPromoCode.code.trim()
        }]
      });
      setNewPromoCode({
        code: '',
        discount: 10,
        expiresAt: ''
      });
    }
  };
  const handleRemovePromoCode = (code: string) => {
    setMonetization({
      ...monetization,
      promoCodes: monetization.promoCodes.filter(p => p.code !== code)
    });
  };
  const handleSubmit = () => {
    updateFormData(monetization);
  };
  return <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Monetization
        </h2>
        <p className="text-sm text-gray-500">
          Set up subscription options and sponsorship opportunities for your
          calendar.
        </p>
      </div>
      {/* Paid Calendar Toggle */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="paid-toggle" className="block text-sm font-medium text-gray-700">
            Enable Paid Subscription
          </label>
          <button type="button" role="switch" aria-checked={monetization.isPaid} className={`${monetization.isPaid ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`} onClick={() => setMonetization({
          ...monetization,
          isPaid: !monetization.isPaid
        })}>
            <span aria-hidden="true" className={`${monetization.isPaid ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Charge a subscription fee for access to your calendar.
        </p>
      </div>
      {monetization.isPaid && <>
          {/* Subscription Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Subscription Price ($)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input type="number" name="price" id="price" min="0.99" step="0.01" value={monetization.price} onChange={e => setMonetization({
            ...monetization,
            price: parseFloat(e.target.value) || 0
          })} className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="0.00" />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">USD / month</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Recommended: $2.99 - $9.99 per month depending on value and
              exclusivity.
            </p>
          </div>
          {/* Member Benefits */}
          <div>
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
              Subscriber Benefits
            </label>
            <div className="flex items-center">
              <input type="text" id="benefits" value={newBenefit} onChange={e => setNewBenefit(e.target.value)} placeholder="e.g., Early access to event tickets" className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddBenefit();
            }
          }} />
              <button type="button" onClick={handleAddBenefit} className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              List the benefits subscribers will receive. Be specific and
              compelling.
            </p>
            {monetization.benefits.length > 0 && <ul className="mt-3 space-y-2">
                {monetization.benefits.map((benefit, index) => <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="ml-2 text-gray-700">{benefit}</span>
                    <button type="button" onClick={() => handleRemoveBenefit(benefit)} className="ml-2 text-gray-400 hover:text-red-500">
                      <XIcon className="h-4 w-4" />
                    </button>
                  </li>)}
              </ul>}
          </div>
          {/* Sponsor Slots */}
          <div>
            <label htmlFor="sponsor-slots" className="block text-sm font-medium text-gray-700 mb-1">
              Sponsor Slots
            </label>
            <input type="number" id="sponsor-slots" min="0" max="10" value={monetization.sponsorSlots} onChange={e => setMonetization({
          ...monetization,
          sponsorSlots: parseInt(e.target.value) || 0
        })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            <p className="mt-1 text-sm text-gray-500">
              Number of sponsor slots available on your calendar (0-10).
            </p>
          </div>
          {/* Promo Codes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promotional Codes
            </label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="promo-code" className="block text-xs text-gray-500 mb-1">
                    Code
                  </label>
                  <input type="text" id="promo-code" value={newPromoCode.code} onChange={e => setNewPromoCode({
                ...newPromoCode,
                code: e.target.value.toUpperCase()
              })} placeholder="e.g., LAUNCH25" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>
                <div>
                  <label htmlFor="promo-discount" className="block text-xs text-gray-500 mb-1">
                    Discount (%)
                  </label>
                  <input type="number" id="promo-discount" min="1" max="100" value={newPromoCode.discount} onChange={e => setNewPromoCode({
                ...newPromoCode,
                discount: parseInt(e.target.value) || 0
              })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>
                <div>
                  <label htmlFor="promo-expires" className="block text-xs text-gray-500 mb-1">
                    Expires On
                  </label>
                  <input type="date" id="promo-expires" value={newPromoCode.expiresAt} onChange={e => setNewPromoCode({
                ...newPromoCode,
                expiresAt: e.target.value
              })} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button type="button" onClick={handleAddPromoCode} disabled={!newPromoCode.code.trim() || !newPromoCode.expiresAt} className={`inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium ${!newPromoCode.code.trim() || !newPromoCode.expiresAt ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'text-white bg-indigo-600 hover:bg-indigo-700'}`}>
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  Add Promo Code
                </button>
              </div>
            </div>
            {monetization.promoCodes.length > 0 && <div className="bg-white shadow-sm overflow-hidden rounded-md border border-gray-200">
                <ul role="list" className="divide-y divide-gray-200">
                  {monetization.promoCodes.map(promo => <li key={promo.code} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {promo.code}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {promo.discount}% off
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          Expires:{' '}
                          {new Date(promo.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button type="button" onClick={() => handleRemovePromoCode(promo.code)} className="text-gray-400 hover:text-red-500">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </li>)}
                </ul>
              </div>}
          </div>
        </>}
      <div className="h-px bg-gray-200 my-8"></div>
      <button type="button" onClick={handleSubmit} className="hidden">
        Save and Continue
      </button>
    </div>;
};