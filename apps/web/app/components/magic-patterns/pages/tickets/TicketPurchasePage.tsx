import React, { useEffect, useState, Children } from 'react';
import { TicketIcon, CalendarIcon, MapPinIcon, ClockIcon, ChevronLeftIcon, InfoIcon, UserIcon, CreditCardIcon, CheckIcon } from 'lucide-react';
import { useNavigate, Form, useActionData } from 'react-router';
import { TicketPurchaseConfirmation } from '../../components/tickets/TicketPurchaseConfirmation';
interface TicketPurchasePageProps {
  event?: any;
}

export const TicketPurchasePage = ({ event }: TicketPurchasePageProps) => {
  const navigate = useNavigate();
  const actionData = useActionData();
  const [selectedTicketType, setSelectedTicketType] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock login state

  // Handle successful ticket purchase
  useEffect(() => {
    if (actionData?.success && actionData?.ticketId) {
      setShowConfirmation(true);
    }
  }, [actionData]);
  
  // Use real event data or fallback
  const eventData = event ? {
    id: event.id,
    name: event.title,
    date: new Date(event.start_datetime),
    time: new Date(event.start_datetime).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }),
    endTime: new Date(event.end_datetime).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }),
    venue: {
      name: event.venue?.name || 'TBA',
      address: event.venue ? `${event.venue.address}, ${event.venue.city}, ${event.venue.state}` : 'TBA'
    },
    image: event.image_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    description: event.description
  } : {
    id: 'event-1',
    name: 'Clearwater Jazz Holiday',
    date: new Date('2024-10-15T17:00:00'),
    time: '5:00 PM',
    endTime: '11:00 PM',
    venue: {
      name: 'Coachman Park',
      address: '301 Drew St, Clearwater, FL 33755'
    },
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    description: 'The Clearwater Jazz Holiday is a four-day music festival featuring jazz, blues, and rock performances. Join us for a celebration of music, food, and community in beautiful Coachman Park.'
  };
  // Available ticket types
  const ticketTypes = [{
    id: 'general',
    name: 'General Admission',
    description: 'Lawn seating, bring your own chair or blanket',
    price: 25,
    available: true,
    maxQuantity: 8
  }, {
    id: 'reserved',
    name: 'Reserved Seating',
    description: 'Assigned seat in covered area',
    price: 75,
    available: true,
    maxQuantity: 6
  }, {
    id: 'vip',
    name: 'VIP Package',
    description: 'Premium seating, exclusive lounge access, complimentary food & drink',
    price: 150,
    available: true,
    maxQuantity: 4
  }, {
    id: 'platinum',
    name: 'Platinum VIP',
    description: 'Front row seating, backstage access, meet & greet with artists',
    price: 250,
    available: false,
    maxQuantity: 2
  }];
  // Selected ticket data
  const selectedTicket = ticketTypes.find(ticket => ticket.id === selectedTicketType);
  // Calculate fees (10% of ticket price)
  const calculateFees = () => {
    if (!selectedTicket) return 0;
    return selectedTicket.price * quantity * 0.1;
  };
  // Calculate total
  const calculateTotal = () => {
    if (!selectedTicket) return 0;
    return selectedTicket.price * quantity + calculateFees();
  };
  // Format date
  const formatDate = date => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  // Handle continue to payment
  const handleContinueToPayment = () => {
    if (!selectedTicket) return;
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      navigate('/auth/sign-in?redirectTo=/tickets/purchase/' + eventData.id);
      return;
    }
    setShowConfirmation(true);
  };
  return <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => navigate('/events')} className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back to Events
          </button>
        </div>
      </div>

      {/* Error Message */}
      {actionData?.error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{actionData.error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Event info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                  <div className="h-48 rounded-md overflow-hidden">
                    <img src={eventData.image} alt={eventData.name} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {eventData.name}
                  </h1>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{formatDate(eventData.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <ClockIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>
                      {eventData.time} - {eventData.endTime}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>
                      {eventData.venue.name}, {eventData.venue.address}
                    </span>
                  </div>
                  <p className="text-gray-600">{eventData.description}</p>
                </div>
              </div>
            </div>
            {/* Ticket selection */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TicketIcon className="h-5 w-5 text-indigo-600 mr-2" />
                Select Tickets
              </h2>
              <div className="space-y-4">
                {ticketTypes.map(ticket => <div key={ticket.id} className={`border rounded-lg p-4 ${selectedTicketType === ticket.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'} ${!ticket.available ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => {
                if (ticket.available) {
                  setSelectedTicketType(ticket.id);
                  setQuantity(1);
                }
              }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {ticket.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {ticket.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${ticket.price.toFixed(2)}
                        </p>
                        {!ticket.available && <span className="inline-block mt-1 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                            Sold Out
                          </span>}
                      </div>
                    </div>
                    {selectedTicketType === ticket.id && <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                            Quantity:
                          </label>
                          <select id="quantity" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} className="ml-2 block w-20 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            {Array.from({
                        length: ticket.maxQuantity
                      }, (_, i) => i + 1).map(num => <option key={num} value={num}>
                                {num}
                              </option>)}
                          </select>
                        </div>
                      </div>}
                  </div>)}
              </div>
            </div>
            {/* Additional info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Event Information
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Event Details
                  </h3>
                  <p className="text-gray-600">
                    The Clearwater Jazz Holiday is a four-day music festival
                    featuring jazz, blues, and rock performances. This year's
                    lineup includes Grammy-winning artists and local favorites.
                    Food vendors and a full bar will be available.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Ticket Policy
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>All sales are final. No refunds or exchanges.</li>
                    <li>Tickets are transferable through your account.</li>
                    <li>Event is rain or shine.</li>
                    <li>Children under 10 admitted free with paying adult.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Order summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              {selectedTicket ? <>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{selectedTicket.name}</p>
                        <p className="text-sm text-gray-600">
                          {quantity} x ${selectedTicket.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(quantity * selectedTicket.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <p className="text-gray-600">Subtotal</p>
                      <p>${(quantity * selectedTicket.price).toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <div className="flex items-start">
                        <p className="text-gray-600">Service Fee</p>
                        <button className="ml-1 text-gray-400 hover:text-gray-600">
                          <InfoIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <p>${calculateFees().toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between font-bold">
                      <p>Total</p>
                      <p>${calculateTotal().toFixed(2)}</p>
                    </div>
                  </div>
                  <Form method="post">
                    <input type="hidden" name="ticketType" value={selectedTicketType} />
                    <input type="hidden" name="quantity" value={quantity} />
                    <input type="hidden" name="price" value={selectedTicket.price} />
                    <input type="hidden" name="attendees" value={JSON.stringify([])} />
                    <button 
                      type="submit"
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Continue to Payment
                    </button>
                  </Form>
                </> : <div className="text-center py-8">
                  <TicketIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Select a ticket type to continue
                  </p>
                </div>}
              <div className="mt-6 text-sm text-gray-600">
                <p className="mb-2">
                  <span className="font-medium">Ticket Policy:</span> All sales
                  are final. No refunds or exchanges.
                </p>
                <p>
                  <span className="font-medium">Questions?</span>{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-800">
                    Contact support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Purchase Confirmation Modal */}
      {showConfirmation && selectedTicket && <TicketPurchaseConfirmation ticketData={{
      id: `TICKET-${Math.floor(Math.random() * 1000000)}`,
      eventName: eventData.name,
      date: eventData.date,
      venue: eventData.venue,
      ticketType: selectedTicket.name,
      price: selectedTicket.price,
      quantity: quantity,
      fees: calculateFees()
    }} onClose={() => setShowConfirmation(false)} />}
    </div>;
};