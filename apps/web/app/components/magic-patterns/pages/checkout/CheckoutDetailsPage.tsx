import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, InfoIcon, TicketIcon, CheckIcon, SmartphoneIcon, MailIcon, UserIcon } from 'lucide-react';
import { ProgressIndicator } from '../../components/booking/ProgressIndicator';
import { useNavigate } from 'react-router';
export const CheckoutDetailsPage = () => {
  const navigate = useNavigate();
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(true);
  const [createAccount, setCreateAccount] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('mobile');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptUpdates, setAcceptUpdates] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [isFreeOrder, setIsFreeOrder] = useState(false);
  // Load order data from session storage
  useEffect(() => {
    const storedOrder = sessionStorage.getItem('selectedTickets');
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      setOrderData(parsedOrder);
      setIsFreeOrder(parsedOrder.isFreeOrder);
      setPromoApplied(parsedOrder.promoApplied);
    } else {
      // No order data, redirect back to ticket selection
      navigate('/tickets/select');
    }
  }, []);
  // Handle continue to next step
  const handleContinue = e => {
    e.preventDefault();
    if (acceptTerms) {
      // Store customer info in session storage
      sessionStorage.setItem('customerInfo', JSON.stringify({
        firstName: e.target.firstName.value,
        lastName: e.target.lastName.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        deliveryMethod,
        createAccount
      }));
      // Navigate to payment or confirmation based on whether it's a free order
      if (isFreeOrder) {
        navigate('/checkout/confirmation');
      } else {
        navigate('/checkout/payment');
      }
    }
  };
  if (!orderData) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <ProgressIndicator currentStep={2} steps={['Select Tickets', 'Your Details', isFreeOrder ? 'Confirmation' : 'Payment', !isFreeOrder && 'Confirmation'].filter(Boolean)} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Your Information
              </h2>
              <form onSubmit={handleContinue}>
                <div className="space-y-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address*
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MailIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input type="email" id="email" name="email" className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="email@example.com" required />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Your tickets will be sent to this email
                        </p>
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number*
                        </label>
                        <input type="tel" id="phone" name="phone" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="(555) 555-5555" required />
                        <p className="mt-1 text-xs text-gray-500">
                          For important updates about your tickets
                        </p>
                      </div>
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name*
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input type="text" id="firstName" name="firstName" className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name*
                        </label>
                        <input type="text" id="lastName" name="lastName" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                      </div>
                    </div>
                  </div>
                  {/* Create Account Option */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="createAccount" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={createAccount} onChange={e => setCreateAccount(e.target.checked)} />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="createAccount" className="font-medium text-gray-700">
                          Create an account to manage your tickets
                        </label>
                        <p className="text-sm text-gray-500">
                          Save your information for faster checkout next time
                        </p>
                      </div>
                    </div>
                    {createAccount && <div className="mt-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input type="password" id="password" name="password" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="Create a password" />
                        <div className="mt-4 bg-indigo-50 rounded-md p-4">
                          <h4 className="font-medium text-indigo-800 mb-2">
                            Account Benefits:
                          </h4>
                          <ul className="space-y-1 text-sm text-indigo-700">
                            <li className="flex items-center">
                              <CheckIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                              Easy access to your tickets anytime
                            </li>
                            <li className="flex items-center">
                              <CheckIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                              Transfer tickets to friends with one click
                            </li>
                            <li className="flex items-center">
                              <CheckIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                              View your complete purchase history
                            </li>
                            <li className="flex items-center">
                              <CheckIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                              Receive exclusive offers and presale codes
                            </li>
                          </ul>
                        </div>
                      </div>}
                  </div>
                  {/* Delivery Method */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Delivery Method
                    </h3>
                    <div className="space-y-4">
                      <div className="relative border rounded-md p-4 flex cursor-pointer focus:outline-none" onClick={() => setDeliveryMethod('mobile')}>
                        <div className="flex items-center h-5">
                          <input id="mobile" name="deliveryMethod" type="radio" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={deliveryMethod === 'mobile'} onChange={() => setDeliveryMethod('mobile')} />
                        </div>
                        <div className="ml-3 flex justify-between w-full">
                          <div>
                            <label htmlFor="mobile" className="font-medium text-gray-900">
                              Mobile Ticket
                            </label>
                            <p className="text-gray-500 text-sm">
                              Tickets delivered to your email - just show on
                              your phone
                            </p>
                          </div>
                          <div className="text-indigo-600 font-medium">
                            Free
                          </div>
                        </div>
                      </div>
                      <div className="relative border rounded-md p-4 flex cursor-pointer focus:outline-none" onClick={() => setDeliveryMethod('sms')}>
                        <div className="flex items-center h-5">
                          <input id="sms" name="deliveryMethod" type="radio" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={deliveryMethod === 'sms'} onChange={() => setDeliveryMethod('sms')} />
                        </div>
                        <div className="ml-3 flex justify-between w-full">
                          <div>
                            <label htmlFor="sms" className="font-medium text-gray-900">
                              SMS Delivery
                            </label>
                            <p className="text-gray-500 text-sm">
                              Get your tickets sent directly to your phone via
                              text message
                            </p>
                          </div>
                          <div className="text-indigo-600 font-medium">
                            +$1.00
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Terms Acceptance */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="terms" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} required />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="terms" className="font-medium text-gray-700">
                            I agree to the{' '}
                            <a href="#" className="text-indigo-600 hover:text-indigo-500">
                              Terms and Conditions
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-indigo-600 hover:text-indigo-500">
                              Privacy Policy
                            </a>
                          </label>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="updates" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={acceptUpdates} onChange={e => setAcceptUpdates(e.target.checked)} />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="updates" className="font-medium text-gray-700">
                            I agree to receive updates about this event and
                            similar events
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Continue Button */}
                  <div className="pt-6">
                    <button type="submit" className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      {isFreeOrder ? 'Complete Registration' : 'Continue to Payment'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {/* Order Summary Column */}
          <div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-6">
              {/* Mobile Collapsible Header */}
              <div className="lg:hidden p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer" onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}>
                <h2 className="text-lg font-bold text-gray-900">
                  Order Summary
                </h2>
                <button className="text-gray-500">
                  {isOrderSummaryOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                </button>
              </div>
              {/* Summary Content - Collapsible on Mobile */}
              <div className={`p-6 ${isOrderSummaryOpen ? 'block' : 'hidden lg:block'}`}>
                <div className="hidden lg:block mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Order Summary
                  </h2>
                </div>
                {/* Event Details */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900">
                    {orderData.event.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {orderData.event.date} • {orderData.event.time}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {orderData.event.venue}
                  </p>
                </div>
                {/* Ticket Breakdown */}
                <div className="space-y-4 mb-6">
                  {orderData.tickets.map((ticket, index) => <div key={index} className="flex justify-between">
                      <div>
                        <p className="font-medium">{ticket.name}</p>
                        <p className="text-sm text-gray-600">
                          {ticket.quantity} x ${ticket.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(ticket.quantity * ticket.price).toFixed(2)}
                      </p>
                    </div>)}
                  {orderData.addons && orderData.addons.map((addon, index) => <div key={index} className="flex justify-between">
                        <div>
                          <p className="font-medium">{addon.name}</p>
                          <p className="text-sm text-gray-600">
                            {addon.quantity} x ${addon.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-medium">
                          ${(addon.quantity * addon.price).toFixed(2)}
                        </p>
                      </div>)}
                </div>
                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">Subtotal</p>
                    <p>${orderData.subtotal.toFixed(2)}</p>
                  </div>
                  {!isFreeOrder && <div className="flex justify-between text-sm">
                      <div className="flex items-start">
                        <p className="text-gray-600">Marketplace Fee (10%)</p>
                        <button className="ml-1 text-gray-400 hover:text-gray-600">
                          <InfoIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <p>${orderData.marketplaceFee.toFixed(2)}</p>
                    </div>}
                  {deliveryMethod === 'sms' && !isFreeOrder && <div className="flex justify-between text-sm">
                      <p className="text-gray-600">SMS Delivery</p>
                      <p>$1.00</p>
                    </div>}
                  {promoApplied && !isFreeOrder && <div className="flex justify-between text-sm text-green-600">
                      <p>Promo Discount (10%)</p>
                      <p>-${(orderData.subtotal * 0.1).toFixed(2)}</p>
                    </div>}
                </div>
                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <p className="font-bold text-gray-900">Total</p>
                    <p className="font-bold text-gray-900">
                      $
                      {(orderData.total + (deliveryMethod === 'sms' ? 1 : 0)).toFixed(2)}
                    </p>
                  </div>
                  {isFreeOrder && <p className="mt-2 text-sm text-green-600">
                      No payment required
                    </p>}
                </div>
                {/* Secure Checkout Badge */}
                <div className="mt-6 bg-gray-50 p-3 rounded-md text-center">
                  <p className="text-sm text-gray-600 flex items-center justify-center">
                    <InfoIcon className="h-4 w-4 mr-1 text-gray-400" />
                    All transactions are secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};