import React, { useState } from 'react';
import { CreditCardIcon, LockIcon, CheckCircleIcon } from 'lucide-react';
type SubmitStepProps = {
  formData: any;
  pricing: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrevStep: () => void;
  onSubmit: () => void;
};
export const SubmitStep = ({
  formData,
  pricing,
  onInputChange,
  onCheckboxChange,
  onPrevStep,
  onSubmit
}: SubmitStepProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  // Mock saved cards
  const savedCards = [{
    id: 'card1',
    last4: '4242',
    brand: 'Visa',
    expiry: '05/25'
  }];
  // Handle submit
  const handleSubmit = () => {
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      onSubmit();
      setIsProcessing(false);
    }, 1500);
  };
  // Validate card details
  const isCardValid = () => {
    if (formData.paymentMethod === 'saved') {
      return true;
    }
    return formData.cardNumber.length >= 16 && formData.cardExpiry.length >= 5 && formData.cardCvv.length >= 3 && formData.billingZip.length >= 5;
  };
  return <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Payment Information
      </h2>
      {/* Amount Summary */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-900">Booking Total</h3>
          <span className="text-xl font-bold text-gray-900">
            ${pricing.total}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          <p>
            A 20% hold (${Math.round(pricing.total * 0.2)}) will be placed on
            your card if the venue accepts your booking.
          </p>
        </div>
      </div>
      {/* Payment Method Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Payment Method
        </h3>
        {savedCards.length > 0 && <div className="mb-4">
            <div className="flex items-center mb-3">
              <input type="radio" id="payment-saved" name="paymentMethod" value="saved" checked={formData.paymentMethod === 'saved'} onChange={() => onInputChange({
            target: {
              name: 'paymentMethod',
              value: 'saved'
            }
          } as any)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
              <label htmlFor="payment-saved" className="ml-2 block text-sm font-medium text-gray-700">
                Use saved card
              </label>
            </div>
            {formData.paymentMethod === 'saved' && <div className="ml-6 space-y-3">
                {savedCards.map(card => <div key={card.id} className="flex items-center p-3 border border-gray-200 rounded-md bg-white">
                    <input type="radio" id={card.id} name="savedCardId" value={card.id} checked={true} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                    <label htmlFor={card.id} className="ml-2 flex items-center flex-1">
                      <span className="text-sm font-medium text-gray-700">
                        {card.brand} •••• {card.last4}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        Expires {card.expiry}
                      </span>
                    </label>
                  </div>)}
              </div>}
          </div>}
        <div className="flex items-center mb-4">
          <input type="radio" id="payment-new" name="paymentMethod" value="new" checked={formData.paymentMethod === 'new'} onChange={() => onInputChange({
          target: {
            name: 'paymentMethod',
            value: 'new'
          }
        } as any)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
          <label htmlFor="payment-new" className="ml-2 block text-sm font-medium text-gray-700">
            Add new card
          </label>
        </div>
        {formData.paymentMethod === 'new' && <div className="ml-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCardIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="text" id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={onInputChange} placeholder="1234 5678 9012 3456" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" maxLength={19} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input type="text" id="cardExpiry" name="cardExpiry" value={formData.cardExpiry} onChange={onInputChange} placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" maxLength={5} />
                </div>
                <div>
                  <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input type="text" id="cardCvv" name="cardCvv" value={formData.cardCvv} onChange={onInputChange} placeholder="123" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" maxLength={4} />
                </div>
              </div>
              <div>
                <label htmlFor="billingZip" className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Zip Code
                </label>
                <input type="text" id="billingZip" name="billingZip" value={formData.billingZip} onChange={onInputChange} placeholder="12345" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" maxLength={10} />
              </div>
              <div className="flex items-start">
                <input type="checkbox" id="saveCard" name="saveCard" checked={formData.saveCard} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
                <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
                  Save this card for future bookings
                </label>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              <LockIcon className="h-4 w-4 text-gray-500 mr-2" />
              Your payment information is encrypted and secure.
            </div>
          </div>}
      </div>
      {/* Final Actions */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-center bg-gray-50 p-4 rounded-md border border-gray-200">
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-sm text-gray-700">
            By clicking "Submit Booking Request", you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-800">
              Terms of Service
            </a>{' '}
            and authorize the payment terms described above.
          </span>
        </div>
      </div>
      {/* Form Actions */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <div className="flex space-x-4">
          <button type="button" onClick={onPrevStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium">
            Back
          </button>
          <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium" onClick={() => window.history.back()}>
            Save as Draft
          </button>
        </div>
        <button type="button" onClick={handleSubmit} disabled={!isCardValid() || isProcessing} className={`px-6 py-3 rounded-md text-white font-medium flex items-center ${isCardValid() && !isProcessing ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}>
          {isProcessing ? <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </> : 'Submit Booking Request'}
        </button>
      </div>
    </div>;
};