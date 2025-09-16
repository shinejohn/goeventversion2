import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon,
  DollarSignIcon,
  UsersIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  TicketIcon,
  StarIcon
} from 'lucide-react';
import { useNavigate } from 'react-router';

interface Event {
  id: string;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  venue: {
    name: string;
    address: string;
  };
  price_min: number;
  price_max: number;
  capacity: number;
  image_url: string;
  category: string;
}

interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  max_per_order: number;
  is_active: boolean;
}

interface EventPurchasePageProps {
  event: Event;
  ticketTypes: TicketType[];
}

export const EventPurchasePage = ({ event, ticketTypes }: EventPurchasePageProps) => {
  const navigate = useNavigate();
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [useBillingAddress, setUseBillingAddress] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const updateTicketQuantity = (ticketId: string, change: number) => {
    setSelectedTickets(prev => {
      const current = prev[ticketId] || 0;
      const newQuantity = Math.max(0, current + change);
      
      if (newQuantity === 0) {
        const { [ticketId]: removed, ...rest } = prev;
        return rest;
      }
      
      return { ...prev, [ticketId]: newQuantity };
    });
  };

  const getTotalPrice = () => {
    return Object.entries(selectedTickets).reduce((total, [ticketId, quantity]) => {
      const ticket = ticketTypes.find(t => t.id === ticketId);
      return total + (ticket ? ticket.price * quantity : 0);
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((total, quantity) => total + quantity, 0);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (getTotalTickets() === 0) {
      newErrors.tickets = 'Please select at least one ticket';
    }
    
    if (!customerInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!customerInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!customerInfo.email.trim()) newErrors.email = 'Email is required';
    if (!customerInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    
    if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
    if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
    if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
    if (!paymentInfo.nameOnCard.trim()) newErrors.nameOnCard = 'Name on card is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to confirmation page
      navigate(`/events/${event.id}/confirmation?tickets=${getTotalTickets()}&total=${getTotalPrice()}`);
    } catch (error) {
      console.error('Purchase error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Purchase Tickets</h1>
              <p className="mt-2 text-gray-600">Complete your event ticket purchase</p>
            </div>
            <button
              onClick={() => navigate(`/events/${event.id}`)}
              className="text-gray-500 hover:text-gray-700"
            >
              Back to Event
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-start space-x-4">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {formatDate(event.start_datetime)}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {formatTime(event.start_datetime)} - {formatTime(event.end_datetime)}
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {event.venue.name}, {event.venue.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Selection */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <TicketIcon className="h-5 w-5 mr-2 text-indigo-600" />
                Select Tickets
              </h3>
              
              {errors.tickets && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {errors.tickets}
                </div>
              )}

              <div className="space-y-4">
                {ticketTypes.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{ticket.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                        <div className="flex items-center mt-2">
                          <DollarSignIcon className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-lg font-bold text-green-600">
                            ${ticket.price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            per ticket
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => updateTicketQuantity(ticket.id, -1)}
                          disabled={!selectedTickets[ticket.id]}
                          className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        
                        <span className="w-12 text-center font-semibold">
                          {selectedTickets[ticket.id] || 0}
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => updateTicketQuantity(ticket.id, 1)}
                          disabled={selectedTickets[ticket.id] >= ticket.max_per_order}
                          className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Customer Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="(555) 123-4567"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <CreditCardIcon className="h-5 w-5 mr-2 text-indigo-600" />
                Payment Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">
                    Name on Card *
                  </label>
                  <input
                    type="text"
                    id="nameOnCard"
                    value={paymentInfo.nameOnCard}
                    onChange={(e) => setPaymentInfo(prev => ({ ...prev, nameOnCard: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.nameOnCard ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.nameOnCard && <p className="mt-1 text-sm text-red-600">{errors.nameOnCard}</p>}
                </div>

                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                      errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="MM/YY"
                    />
                    {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.cvv ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="123"
                    />
                    {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4">
                {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                  const ticket = ticketTypes.find(t => t.id === ticketId);
                  if (!ticket) return null;
                  
                  return (
                    <div key={ticketId} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{ticket.name}</p>
                        <p className="text-sm text-gray-600">Qty: {quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        ${(ticket.price * quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
                
                {getTotalTickets() === 0 && (
                  <p className="text-gray-500 text-center py-4">No tickets selected</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={getTotalTickets() === 0 || isProcessing}
                className="w-full mt-6 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    Complete Purchase
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center text-sm text-gray-600">
                <ShieldCheckIcon className="h-4 w-4 mr-2 text-green-600" />
                Secure payment processing
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

