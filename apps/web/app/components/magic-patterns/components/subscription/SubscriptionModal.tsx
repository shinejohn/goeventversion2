import React, { useEffect, useState } from 'react';
import { XIcon, CheckIcon, CreditCardIcon, LockIcon, AlertCircleIcon, ChevronRightIcon } from 'lucide-react';
type SubscriptionTier = {
  id: string;
  name: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  recommended?: boolean;
};
type SubscriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (tier: SubscriptionTier, paymentDetails: any) => Promise<boolean>;
  availableTiers: SubscriptionTier[];
};
export const SubscriptionModal = ({
  isOpen,
  onClose,
  onSubscribe,
  availableTiers = [{
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'monthly',
    features: ['Basic access to events', 'Create personal calendar', 'Save up to 10 events']
  }, {
    id: 'supporter',
    name: 'Supporter',
    price: 9.99,
    interval: 'monthly',
    features: ['All Free features', 'No ads', 'Early access to tickets', 'Unlimited saved events', 'Calendar sharing'],
    recommended: true
  }, {
    id: 'vip',
    name: 'VIP',
    price: 19.99,
    interval: 'monthly',
    features: ['All Supporter features', 'Priority support', 'Exclusive event invites', 'Discounted tickets', 'Venue partnership benefits']
  }]
}: SubscriptionModalProps) => {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [step, setStep] = useState<'select' | 'payment' | 'confirmation'>('select');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: ''
  });
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSelectedTier(null);
      setError(null);
      setPromoCode('');
      setPromoApplied(false);
      setPromoDiscount(0);
      setTermsAccepted(false);
    }
  }, [isOpen]);
  if (!isOpen) return null;
  const handleSelectTier = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    if (tier.id === 'free') {
      setStep('confirmation');
    } else {
      setStep('payment');
    }
  };
  const handlePaymentDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setPaymentDetails({
        ...paymentDetails,
        [name]: formatted.substring(0, 19) // limit to 16 digits + 3 spaces
      });
      return;
    }
    // Format expiry date
    if (name === 'expiry') {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
      }
      setPaymentDetails({
        ...paymentDetails,
        [name]: formatted.substring(0, 5)
      });
      return;
    }
    setPaymentDetails({
      ...paymentDetails,
      [name]: value
    });
  };
  const handleApplyPromo = () => {
    // This would normally validate with an API
    if (promoCode.toLowerCase() === 'first10') {
      setPromoApplied(true);
      setPromoDiscount(10);
      setError(null);
    } else {
      setPromoApplied(false);
      setPromoDiscount(0);
      setError('Invalid promo code');
    }
  };
  const handleSubmit = async () => {
    if (!selectedTier) return;
    // Basic validation
    if (selectedTier.id !== 'free') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvc) {
        setError('Please fill in all payment details');
        return;
      }
      if (!termsAccepted) {
        setError('Please accept the terms and conditions');
        return;
      }
    }
    setIsProcessing(true);
    setError(null);
    try {
      // In a real app, this would process the payment
      const success = await onSubscribe(selectedTier, paymentDetails);
      if (success) {
        setStep('confirmation');
      } else {
        setError('Subscription failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  const calculatePrice = (tier: SubscriptionTier) => {
    if (tier.price === 0) return 'Free';
    let price = tier.price;
    if (isYearly) {
      price = price * 10; // 2 months free with yearly
    }
    if (promoApplied && step === 'payment') {
      price = price - price * (promoDiscount / 100);
    }
    return `$${price.toFixed(2)}/${isYearly ? 'year' : 'month'}`;
  };
  return <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Header */}
          <div className="bg-white px-4 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {step === 'select' && 'Choose Your Plan'}
                {step === 'payment' && 'Complete Your Subscription'}
                {step === 'confirmation' && 'Subscription Confirmed'}
              </h3>
              <button onClick={onClose} className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          {/* Content */}
          <div className="bg-white px-4 py-5 sm:p-6">
            {/* Step 1: Select Tier */}
            {step === 'select' && <div>
                <div className="flex justify-center mb-6">
                  <div className="relative flex bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setIsYearly(false)} className={`px-4 py-2 text-sm font-medium ${!isYearly ? 'bg-white rounded-md shadow-sm text-gray-900' : 'text-gray-500'}`}>
                      Monthly
                    </button>
                    <button onClick={() => setIsYearly(true)} className={`px-4 py-2 text-sm font-medium ${isYearly ? 'bg-white rounded-md shadow-sm text-gray-900' : 'text-gray-500'}`}>
                      Yearly{' '}
                      <span className="text-green-600 text-xs">Save 16%</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {availableTiers.map(tier => <div key={tier.id} className={`border rounded-lg p-4 cursor-pointer transition-all ${tier.recommended ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => handleSelectTier(tier)}>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {tier.name}
                          </h4>
                          <p className="text-gray-500 text-sm mt-1">
                            {tier.features.length} features
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            {calculatePrice(tier)}
                          </div>
                          {tier.recommended && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-1">
                              Recommended
                            </span>}
                        </div>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {tier.features.map((feature, index) => <li key={index} className="flex items-start">
                            <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                            <span className="text-sm text-gray-600">
                              {feature}
                            </span>
                          </li>)}
                      </ul>
                      <button className={`mt-4 w-full py-2 px-4 rounded-md text-sm font-medium ${tier.id === 'free' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`} onClick={e => {
                  e.stopPropagation();
                  handleSelectTier(tier);
                }}>
                        {tier.id === 'free' ? 'Continue with Free' : 'Select Plan'}
                      </button>
                    </div>)}
                </div>
              </div>}
            {/* Step 2: Payment */}
            {step === 'payment' && selectedTier && <div>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {selectedTier.name} Plan
                      </h4>
                      <p className="text-sm text-gray-500">
                        {isYearly ? 'Annual billing' : 'Monthly billing'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {calculatePrice(selectedTier)}
                      </div>
                      <button className="text-sm text-indigo-600 hover:text-indigo-800" onClick={() => setStep('select')}>
                        Change
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card information
                    </label>
                    <div className="relative">
                      <input type="text" name="cardNumber" placeholder="1234 5678 9012 3456" value={paymentDetails.cardNumber} onChange={handlePaymentDetailsChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10 py-2 border" maxLength={19} />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CreditCardIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration
                      </label>
                      <input type="text" name="expiry" placeholder="MM/YY" value={paymentDetails.expiry} onChange={handlePaymentDetailsChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border" maxLength={5} />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <input type="text" name="cvc" placeholder="123" value={paymentDetails.cvc} onChange={handlePaymentDetailsChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border" maxLength={3} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name on card
                    </label>
                    <input type="text" name="cardName" placeholder="John Smith" value={paymentDetails.cardName} onChange={handlePaymentDetailsChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Promo code (optional)
                    </label>
                    <div className="flex space-x-2">
                      <input type="text" value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Enter code" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 border" disabled={promoApplied} />
                      <button onClick={handleApplyPromo} className={`px-4 py-2 rounded-md text-sm font-medium ${promoApplied ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`} disabled={promoApplied || !promoCode}>
                        {promoApplied ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                    {promoApplied && <p className="mt-1 text-sm text-green-600">
                        {promoDiscount}% discount applied!
                      </p>}
                  </div>
                  <div className="flex items-start mt-4">
                    <div className="flex items-center h-5">
                      <input id="terms" name="terms" type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="text-gray-600">
                        I agree to the{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-500">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-500">
                          Privacy Policy
                        </a>
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        You can cancel your subscription at any time from your
                        account settings. Refunds are processed according to our
                        refund policy.
                      </p>
                    </div>
                  </div>
                  {error && <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <AlertCircleIcon className="h-5 w-5 text-red-400" />
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <LockIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-500">
                        Secure payment
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <img src="https://cdn.pixabay.com/photo/2015/05/26/09/37/paypal-784404_1280.png" alt="PayPal" className="h-6" />
                      <img src="https://cdn.pixabay.com/photo/2021/12/07/18/45/visa-6854328_1280.png" alt="Visa" className="h-6" />
                      <img src="https://cdn.pixabay.com/photo/2015/05/26/09/37/master-card-784405_1280.png" alt="Mastercard" className="h-6" />
                    </div>
                  </div>
                </div>
              </div>}
            {/* Step 3: Confirmation */}
            {step === 'confirmation' && selectedTier && <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedTier.id === 'free' ? "You're all set!" : 'Payment Successful!'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedTier.id === 'free' ? 'You now have access to the Free plan features.' : `You're now subscribed to the ${selectedTier.name} plan.`}
                </p>
                <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">
                    What's next?
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                        <div className="absolute inset-0 rounded-full bg-indigo-600 flex items-center justify-center">
                          <span className="text-white text-xs">1</span>
                        </div>
                      </div>
                      <p className="ml-2 text-sm text-gray-600">
                        {selectedTier.id === 'free' ? 'Explore events and create your personal calendar' : 'Your account has been upgraded with new features'}
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                        <div className="absolute inset-0 rounded-full bg-indigo-600 flex items-center justify-center">
                          <span className="text-white text-xs">2</span>
                        </div>
                      </div>
                      <p className="ml-2 text-sm text-gray-600">
                        {selectedTier.id === 'free' ? "Save events you're interested in attending" : 'Check your email for a receipt and confirmation details'}
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                        <div className="absolute inset-0 rounded-full bg-indigo-600 flex items-center justify-center">
                          <span className="text-white text-xs">3</span>
                        </div>
                      </div>
                      <p className="ml-2 text-sm text-gray-600">
                        Customize your preferences in account settings
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="flex space-x-3">
                  <button onClick={onClose} className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                    Close
                  </button>
                  <button onClick={() => {
                onClose();
                // This would navigate to account page in a real app
              }} className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none flex items-center justify-center">
                    My Account
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>}
          </div>
          {/* Footer */}
          {step === 'payment' && <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              <button type="button" className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${isProcessing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`} onClick={handleSubmit} disabled={isProcessing}>
                {isProcessing ? <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </> : `Subscribe for ${calculatePrice(selectedTier)}`}
              </button>
              <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setStep('select')} disabled={isProcessing}>
                Back
              </button>
            </div>}
        </div>
      </div>
    </div>;
};