import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, InfoIcon, LockIcon, CreditCardIcon, HomeIcon, CheckIcon, MapPinIcon, DownloadIcon, PrinterIcon } from 'lucide-react';
import { ProgressIndicator } from '../../components/booking/ProgressIndicator';
import { useNavigationContext } from '../../context/NavigationContext';
import { Invoice } from '../../components/checkout/Invoice';
export const CheckoutPaymentPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [sameAsContact, setSameAsContact] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  // Load order and customer data from session storage
  useEffect(() => {
    const storedOrder = sessionStorage.getItem('selectedTickets');
    const storedCustomer = sessionStorage.getItem('customerInfo');
    if (storedOrder && storedCustomer) {
      const parsedOrder = JSON.parse(storedOrder);
      const parsedCustomer = JSON.parse(storedCustomer);
      setOrderData(parsedOrder);
      setCustomerInfo(parsedCustomer);
      // Set delivery fee if SMS delivery is selected
      if (parsedCustomer.deliveryMethod === 'sms') {
        setDeliveryFee(1);
      }
    } else {
      // Missing data, redirect back
      navigateTo('/tickets/select');
    }
  }, []);
  const handleCompletePurchase = e => {
    e.preventDefault();
    setIsProcessing(true);
    // Generate unique order number
    const orderNumber = 'WTF-' + Math.floor(Math.random() * 10000000).toString().padStart(8, '0');
    // Store final order data with payment info
    sessionStorage.setItem('completedOrder', JSON.stringify({
      ...orderData,
      customer: customerInfo,
      orderNumber,
      paymentMethod,
      deliveryFee,
      purchaseDate: new Date().toISOString(),
      finalTotal: calculateTotal()
    }));
    // Simulate payment processing delay
    setTimeout(() => {
      navigateTo('/checkout/confirmation');
    }, 2000);
  };
  // Calculate total with all fees
  const calculateTotal = () => {
    if (!orderData) return 0;
    return orderData.total + deliveryFee;
  };
  // List of payment methods with their icons and details
  const paymentMethods = [{
    id: 'card',
    name: 'Credit/Debit Card',
    icon: <CreditCardIcon className="h-5 w-5 text-gray-400" />
  }, {
    id: 'paypal',
    name: 'PayPal',
    icon: <div className="flex items-center">
          <span className="text-[#0070ba] font-bold">Pay</span>
          <span className="text-[#003087] font-bold">Pal</span>
        </div>
  }, {
    id: 'apple',
    name: 'Apple Pay',
    icon: <span className="font-bold">Apple Pay</span>,
    showOnlyOn: 'ios'
  }, {
    id: 'google',
    name: 'Google Pay',
    icon: <span className="font-bold">Google Pay</span>,
    showOnlyOn: 'android'
  }];
  if (!orderData || !customerInfo) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <ProgressIndicator currentStep={3} steps={['Select Tickets', 'Your Details', 'Payment', 'Confirmation']} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Information
                </h2>
                <button onClick={() => setShowInvoice(true)} className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium">
                  <InfoIcon className="h-4 w-4 mr-1" />
                  View Invoice
                </button>
              </div>
              <form onSubmit={handleCompletePurchase}>
                <div className="space-y-6">
                  {/* Payment Methods */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Payment Method
                    </h3>
                    <div className="space-y-4">
                      {paymentMethods.map(method => <div key={method.id} className={`relative border rounded-md p-4 flex cursor-pointer focus:outline-none ${paymentMethod === method.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300'}`} onClick={() => setPaymentMethod(method.id)}>
                          <div className="flex items-center h-5">
                            <input id={method.id} name="paymentMethod" type="radio" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} />
                          </div>
                          <div className="ml-3 flex items-center">
                            <div className="mr-2">{method.icon}</div>
                            <label htmlFor={method.id} className="font-medium text-gray-900">
                              {method.name}
                            </label>
                          </div>
                        </div>)}
                    </div>
                  </div>
                  {/* Credit Card Form */}
                  {paymentMethod === 'card' && <div className="border-t border-gray-200 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <CreditCardIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input type="text" id="cardNumber" className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="1234 5678 9012 3456" required />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="expiration" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiration Date
                          </label>
                          <input type="text" id="expiration" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="MM/YY" required />
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input type="text" id="cvv" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="123" required />
                        </div>
                        <div>
                          <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code
                          </label>
                          <input type="text" id="zip" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="12345" required />
                        </div>
                        <div className="col-span-2">
                          <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
                            Name on Card
                          </label>
                          <input type="text" id="nameOnCard" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="John Doe" required />
                        </div>
                      </div>
                    </div>}
                  {/* PayPal, Apple Pay, or Google Pay Instructions */}
                  {paymentMethod !== 'card' && <div className="border-t border-gray-200 pt-6">
                      <div className="bg-gray-50 rounded-md p-4 text-center">
                        <p className="text-gray-700">
                          {paymentMethod === 'paypal' && "You'll be redirected to PayPal to complete your purchase securely."}
                          {paymentMethod === 'apple' && "You'll complete your purchase using Apple Pay."}
                          {paymentMethod === 'google' && "You'll complete your purchase using Google Pay."}
                        </p>
                      </div>
                    </div>}
                  {/* Billing Address */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Billing Address
                    </h3>
                    <div className="mb-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="sameAddress" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" checked={sameAsContact} onChange={e => setSameAsContact(e.target.checked)} />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="sameAddress" className="font-medium text-gray-700">
                            Same as contact information
                          </label>
                        </div>
                      </div>
                    </div>
                    {!sameAsContact && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <HomeIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input type="text" id="address" className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required={!sameAsContact} />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                          </label>
                          <input type="text" id="city" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required={!sameAsContact} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                              State
                            </label>
                            <select id="state" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required={!sameAsContact}>
                              <option value="">Select...</option>
                              <option value="FL">Florida</option>
                              <option value="CA">California</option>
                              <option value="NY">New York</option>
                              <option value="TX">Texas</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="billingZip" className="block text-sm font-medium text-gray-700 mb-1">
                              ZIP Code
                            </label>
                            <input type="text" id="billingZip" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required={!sameAsContact} />
                          </div>
                        </div>
                      </div>}
                  </div>
                  {/* Payment Allocation Information */}
                  <div className="border-t border-gray-200 pt-6">
                    <div className="bg-blue-50 rounded-md p-4">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                        <InfoIcon className="h-4 w-4 mr-2 text-blue-500" />
                        Payment Allocation Information
                      </h4>
                      <p className="text-sm text-blue-700 mb-2">
                        Your payment will be processed by Stripe and allocated
                        as follows:
                      </p>
                      <ul className="space-y-1 text-sm text-blue-700">
                        <li className="flex justify-between">
                          <span>Event Organizer:</span>
                          <span>${(orderData.subtotal * 0.9).toFixed(2)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Marketplace Fee:</span>
                          <span>${orderData.marketplaceFee.toFixed(2)}</span>
                        </li>
                        {deliveryFee > 0 && <li className="flex justify-between">
                            <span>Delivery Fee:</span>
                            <span>${deliveryFee.toFixed(2)}</span>
                          </li>}
                      </ul>
                    </div>
                  </div>
                  {/* Complete Purchase Button */}
                  <div className="pt-6">
                    <button type="submit" disabled={isProcessing} className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                      {isProcessing ? <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Payment...
                        </> : <>Complete Purchase - ${calculateTotal().toFixed(2)}</>}
                    </button>
                    {/* Security Badge */}
                    <div className="mt-4 flex justify-center items-center text-sm text-gray-600">
                      <LockIcon className="h-4 w-4 mr-1 text-green-600" />
                      <span>Secure Checkout - SSL Encrypted</span>
                    </div>
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
                {/* Customer Info */}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-1">
                    Customer Information
                  </h4>
                  <p className="text-sm text-gray-600">
                    {customerInfo.firstName} {customerInfo.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{customerInfo.email}</p>
                  <p className="text-sm text-gray-600">{customerInfo.phone}</p>
                </div>
                {/* Ticket Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-4 mb-6">
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
                  <div className="flex justify-between text-sm">
                    <div className="flex items-start">
                      <p className="text-gray-600">Marketplace Fee (10%)</p>
                      <button className="ml-1 text-gray-400 hover:text-gray-600">
                        <InfoIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <p>${orderData.marketplaceFee.toFixed(2)}</p>
                  </div>
                  {deliveryFee > 0 && <div className="flex justify-between text-sm">
                      <p className="text-gray-600">SMS Delivery</p>
                      <p>${deliveryFee.toFixed(2)}</p>
                    </div>}
                  {orderData.promoApplied && <div className="flex justify-between text-sm text-green-600">
                      <p>Promo Discount (10%)</p>
                      <p>-${(orderData.subtotal * 0.1).toFixed(2)}</p>
                    </div>}
                </div>
                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <p className="font-bold text-gray-900">Total</p>
                    <p className="font-bold text-lg text-gray-900">
                      ${calculateTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Invoice Modal */}
      {showInvoice && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Invoice Preview
                </h2>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100" title="Download Invoice">
                    <DownloadIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100" title="Print Invoice">
                    <PrinterIcon className="h-5 w-5" />
                  </button>
                  <button onClick={() => setShowInvoice(false)} className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <Invoice orderData={orderData} customerInfo={customerInfo} deliveryFee={deliveryFee} invoiceNumber={'INV-' + Math.floor(Math.random() * 10000000).toString().padStart(8, '0')} date={new Date().toISOString().split('T')[0]} />
              <div className="mt-6 flex justify-end">
                <button onClick={() => setShowInvoice(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};