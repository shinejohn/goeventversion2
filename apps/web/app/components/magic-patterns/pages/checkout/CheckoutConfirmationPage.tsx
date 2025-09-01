import React, { useEffect, useState } from 'react';
import { CheckIcon, DownloadIcon, ShareIcon, TicketIcon, CalendarIcon, SmartphoneIcon, MailIcon, PrinterIcon } from 'lucide-react';
import { ProgressIndicator } from '../../components/booking/ProgressIndicator';
import { useNavigationContext } from '../../context/NavigationContext';
import { Invoice } from '../../components/checkout/Invoice';
export const CheckoutConfirmationPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const [orderData, setOrderData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [isFreeOrder, setIsFreeOrder] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [orderNumber, setOrderNumber] = useState('');
  // Animation effect on load
  useEffect(() => {
    const checkmarkAnimation = document.getElementById('checkmark-animation');
    if (checkmarkAnimation) {
      checkmarkAnimation.classList.add('scale-100');
      checkmarkAnimation.classList.remove('scale-0');
    }
    // Load order data
    const completedOrder = sessionStorage.getItem('completedOrder');
    const storedOrder = sessionStorage.getItem('selectedTickets');
    const storedCustomer = sessionStorage.getItem('customerInfo');
    if (completedOrder) {
      // For paid orders
      const parsedOrder = JSON.parse(completedOrder);
      setOrderData(parsedOrder);
      setCustomerInfo(parsedOrder.customer);
      setIsFreeOrder(parsedOrder.isFreeOrder);
      setOrderNumber(parsedOrder.orderNumber);
      if (parsedOrder.customer.deliveryMethod === 'sms') {
        setDeliveryFee(1);
      }
    } else if (storedOrder && storedCustomer) {
      // For free orders
      const parsedOrder = JSON.parse(storedOrder);
      const parsedCustomer = JSON.parse(storedCustomer);
      setOrderData(parsedOrder);
      setCustomerInfo(parsedCustomer);
      setIsFreeOrder(true);
      setOrderNumber('WTF-' + Math.floor(Math.random() * 10000000).toString().padStart(8, '0'));
      if (parsedCustomer.deliveryMethod === 'sms') {
        setDeliveryFee(1);
      }
    } else {
      // No order data, redirect back
      navigateTo('/tickets/select');
    }
  }, []);
  const handleViewTickets = () => {
    navigateTo('/profile/tickets');
  };
  if (!orderData || !customerInfo) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        Loading...
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <ProgressIndicator currentStep={isFreeOrder ? 3 : 4} steps={['Select Tickets', 'Your Details', !isFreeOrder && 'Payment', 'Confirmation'].filter(Boolean)} />
        </div>
        {/* Success Animation */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div id="checkmark-animation" className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center transform scale-0 transition-transform duration-500 ease-out">
            <CheckIcon className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 text-center">
            {isFreeOrder ? 'Registration Complete!' : 'Order Complete!'}
          </h1>
          <p className="mt-2 text-gray-600 text-center">
            {isFreeOrder ? 'Your free tickets have been reserved successfully.' : 'Your tickets have been purchased successfully.'}
          </p>
        </div>
        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              {!isFreeOrder && <button onClick={() => setShowInvoice(true)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                  <DownloadIcon className="h-4 w-4 mr-1" />
                  View Invoice
                </button>}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium">{orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {isFreeOrder ? 'Registration Date' : 'Purchase Date'}
                </p>
                <p className="font-medium">{new Date().toLocaleString()}</p>
              </div>
              {!isFreeOrder && <div>
                  <p className="text-sm text-gray-500">Total Paid</p>
                  <p className="font-medium">
                    ${(orderData.total + deliveryFee).toFixed(2)}
                  </p>
                </div>}
              <div>
                <p className="text-sm text-gray-500">Delivery Method</p>
                <p className="font-medium">
                  {customerInfo.deliveryMethod === 'sms' ? 'SMS' : 'Email'}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex items-center mb-4">
                <MailIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <h3 className="font-medium text-gray-900">Ticket Delivery</h3>
                  <p className="text-sm text-gray-600">
                    Your tickets have been sent to {customerInfo.email}
                    {customerInfo.deliveryMethod === 'sms' && ` and via SMS to ${customerInfo.phone}`}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={handleViewTickets} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <TicketIcon className="h-4 w-4 mr-2" />
                  View Tickets
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <SmartphoneIcon className="h-4 w-4 mr-2" />
                  Send to Phone
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Print Tickets
                </button>
              </div>
            </div>
            {/* Event Details */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex">
                <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                  <img src={orderData.event.image} alt={orderData.event.name} className="h-full w-full object-cover" />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900">
                    {orderData.event.name}
                  </h3>
                  <p className="text-gray-600">
                    {orderData.event.date} • {orderData.event.time}
                  </p>
                  <p className="text-gray-600">{orderData.event.venue}</p>
                  <p className="text-sm text-gray-500">
                    {orderData.event.address}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-900 mb-2">
                  Ticket Summary
                </h4>
                {orderData.tickets.map((ticket, index) => <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{ticket.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {ticket.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {ticket.price === 0 ? <span className="text-green-600">Free</span> : `$${(ticket.price * ticket.quantity).toFixed(2)}`}
                    </p>
                  </div>)}
                {orderData.addons && orderData.addons.length > 0 && <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-2">Add-ons</h4>
                    {orderData.addons.map((addon, index) => <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{addon.name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {addon.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          ${(addon.price * addon.quantity).toFixed(2)}
                        </p>
                      </div>)}
                  </div>}
              </div>
            </div>
          </div>
        </div>
        {/* What's Next Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              What's Next
            </h2>
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <MailIcon className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">
                    Check your email
                  </h3>
                  <p className="text-sm text-gray-600">
                    We've sent your tickets and receipt to your email.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <SmartphoneIcon className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">
                    Download the WTF app
                  </h3>
                  <p className="text-sm text-gray-600">
                    Get easy access to your tickets, updates, and more.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <CalendarIcon className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">Add to calendar</h3>
                  <p className="text-sm text-gray-600">
                    Don't miss the event - add it to your calendar now.
                  </p>
                  <div className="mt-2 flex space-x-2">
                    <button className="text-sm text-indigo-600 hover:text-indigo-500">
                      Google
                    </button>
                    <button className="text-sm text-indigo-600 hover:text-indigo-500">
                      Apple
                    </button>
                    <button className="text-sm text-indigo-600 hover:text-indigo-500">
                      Outlook
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <ShareIcon className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">
                    Share with friends
                  </h3>
                  <p className="text-sm text-gray-600">
                    Let your friends know you're going!
                  </p>
                  <div className="mt-2">
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <ShareIcon className="h-4 w-4 mr-2" />
                      Share Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Account Creation Card (if not logged in) */}
        <div className="bg-indigo-50 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-bold text-indigo-900 mb-2">
              Save your tickets by creating an account
            </h2>
            <p className="text-indigo-700 mb-4">
              Create an account to easily access your tickets and purchase
              history.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-indigo-700 mb-1">
                  Email
                </label>
                <input type="email" id="email" className="block w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" defaultValue={customerInfo.email} readOnly />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-indigo-700 mb-1">
                  Create Password
                </label>
                <input type="password" id="password" className="block w-full rounded-md border-indigo-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="Choose a password" />
              </div>
              <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Create Account
              </button>
            </div>
          </div>
        </div>
        {/* Continue Shopping Link */}
        <div className="mt-8 text-center">
          <button onClick={() => navigateTo('/events')} className="text-indigo-600 hover:text-indigo-800 font-medium">
            Continue browsing events
          </button>
        </div>
      </div>
      {/* Invoice Modal */}
      {showInvoice && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Invoice</h2>
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
              <Invoice orderData={orderData} customerInfo={customerInfo} deliveryFee={deliveryFee} invoiceNumber={`INV-${orderNumber.substring(4)}`} date={new Date().toISOString().split('T')[0]} />
              <div className="mt-6 flex justify-end">
                <button onClick={() => setShowInvoice(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};