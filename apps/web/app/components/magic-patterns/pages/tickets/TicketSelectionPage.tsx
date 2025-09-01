import React, { useEffect, useState } from 'react';
import { TicketIcon, PlusIcon, MinusIcon, InfoIcon, CalendarIcon, MapPinIcon, ClockIcon, ChevronRightIcon, TagIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
import { ProgressIndicator } from '../../components/booking/ProgressIndicator';
export const TicketSelectionPage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [eventData, setEventData] = useState<any>(null);
  const [availableTickets, setAvailableTickets] = useState([]);
  const [availableAddons, setAvailableAddons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Fetch event and ticket data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // API call would go here
        await new Promise(resolve => setTimeout(resolve, 500));
        // Empty event data instead of mock data
        setEventData({
          id: '',
          name: '',
          date: '',
          time: '',
          venue: '',
          address: '',
          image: ''
        });
        // Empty available tickets instead of mock data
        setAvailableTickets([]);
        // Empty available add-ons instead of mock data
        setAvailableAddons([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  // Initialize selected tickets and add-ons if empty
  useEffect(() => {
    if (selectedTickets.length === 0 && availableTickets.length > 0) {
      setSelectedTickets(availableTickets.map((ticket: any) => ({
        ...ticket,
        quantity: 0
      })));
    }
    if (selectedAddons.length === 0 && availableAddons.length > 0) {
      setSelectedAddons(availableAddons.map((addon: any) => ({
        ...addon,
        quantity: 0
      })));
    }
  }, [availableTickets, availableAddons]);
  // Update ticket quantity
  const updateTicketQuantity = (id: string, change: number) => {
    setSelectedTickets((prev: any[]) => prev.map(ticket => {
      if (ticket.id === id) {
        const newQuantity = Math.max(0, Math.min(ticket.maxQuantity, ticket.quantity + change));
        return {
          ...ticket,
          quantity: newQuantity
        };
      }
      return ticket;
    }));
  };
  // Update add-on quantity
  const updateAddonQuantity = (id: string, change: number) => {
    setSelectedAddons((prev: any[]) => prev.map(addon => {
      if (addon.id === id) {
        const newQuantity = Math.max(0, Math.min(addon.maxQuantity, addon.quantity + change));
        return {
          ...addon,
          quantity: newQuantity
        };
      }
      return addon;
    }));
  };
  // Apply promo code
  const handleApplyPromoCode = () => {
    if (promoCode.toLowerCase() === 'jazz10') {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoApplied(false);
      setPromoError(true);
    }
  };
  // Calculate subtotal
  const calculateSubtotal = () => {
    const ticketsTotal = selectedTickets.reduce((sum, ticket: any) => sum + ticket.price * ticket.quantity, 0);
    const addonsTotal = selectedAddons.reduce((sum, addon: any) => sum + addon.price * addon.quantity, 0);
    return ticketsTotal + addonsTotal;
  };
  // Calculate marketplace fee (10%)
  const calculateMarketplaceFee = () => {
    return calculateSubtotal() * 0.1;
  };
  // Calculate total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const fee = calculateMarketplaceFee();
    const discount = promoApplied ? subtotal * 0.1 : 0;
    return subtotal + fee - discount;
  };
  // Check if any tickets are selected
  const hasSelectedTickets = selectedTickets.some((ticket: any) => ticket.quantity > 0);
  // Check if all selected tickets are free
  const hasOnlyFreeTickets = hasSelectedTickets && selectedTickets.every((ticket: any) => ticket.quantity > 0 && ticket.price === 0 || ticket.quantity === 0) && selectedAddons.every((addon: any) => addon.quantity === 0);
  // Proceed to checkout
  const handleProceedToCheckout = () => {
    if (!hasSelectedTickets) return;
    // Store ticket selection in sessionStorage
    sessionStorage.setItem('selectedTickets', JSON.stringify({
      tickets: selectedTickets.filter((t: any) => t.quantity > 0),
      addons: selectedAddons.filter((a: any) => a.quantity > 0),
      event: eventData,
      promoApplied,
      subtotal: calculateSubtotal(),
      marketplaceFee: calculateMarketplaceFee(),
      total: calculateTotal(),
      isFreeOrder: hasOnlyFreeTickets
    }));
    navigateTo('/checkout/details');
  };
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  if (!eventData) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <TicketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Event Not Found</h2>
          <p className="mt-2 text-gray-600">
            The event you're looking for could not be found or is no longer
            available.
          </p>
          <button onClick={() => navigateTo('/tickets')} className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Browse Events
          </button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <ProgressIndicator currentStep={1} steps={['Select Tickets', 'Your Details', 'Payment', 'Confirmation']} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main ticket selection column */}
          <div className="lg:col-span-2">
            {/* Event info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start">
                <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                  {eventData.image ? <img src={eventData.image} alt={eventData.name} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <TicketIcon className="h-8 w-8 text-gray-400" />
                    </div>}
                </div>
                <div className="ml-4">
                  <h1 className="text-xl font-bold text-gray-900">
                    {eventData.name}
                  </h1>
                  <div className="mt-1 flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{eventData.date}</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{eventData.time}</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span>{eventData.venue}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Ticket selection */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TicketIcon className="h-5 w-5 text-indigo-600 mr-2" />
                Select Tickets
              </h2>
              {selectedTickets.length > 0 ? <div className="space-y-4">
                  {selectedTickets.map((ticket: any) => <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {ticket.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {ticket.description}
                          </p>
                          <p className="mt-1 font-medium text-gray-900">
                            {ticket.price === 0 ? <span className="text-green-600">Free</span> : `$${ticket.price.toFixed(2)}`}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button onClick={() => updateTicketQuantity(ticket.id, -1)} disabled={ticket.quantity === 0} className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-300 disabled:opacity-50">
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="w-6 text-center">
                            {ticket.quantity}
                          </span>
                          <button onClick={() => updateTicketQuantity(ticket.id, 1)} disabled={ticket.quantity >= ticket.maxQuantity} className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-300 disabled:opacity-50">
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {ticket.quantity >= ticket.maxQuantity && <p className="mt-2 text-sm text-orange-600">
                          Maximum {ticket.maxQuantity} tickets per order
                        </p>}
                    </div>)}
                </div> : <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <TicketIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No tickets available for this event
                  </p>
                </div>}
            </div>
            {/* Add-ons selection */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TagIcon className="h-5 w-5 text-indigo-600 mr-2" />
                Enhance Your Experience
              </h2>
              {selectedAddons.length > 0 ? <div className="space-y-4">
                  {selectedAddons.map((addon: any) => <div key={addon.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {addon.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {addon.description}
                          </p>
                          <p className="mt-1 font-medium text-gray-900">
                            ${addon.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button onClick={() => updateAddonQuantity(addon.id, -1)} disabled={addon.quantity === 0} className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-300 disabled:opacity-50">
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="w-6 text-center">
                            {addon.quantity}
                          </span>
                          <button onClick={() => updateAddonQuantity(addon.id, 1)} disabled={addon.quantity >= addon.maxQuantity} className="h-8 w-8 rounded-full flex items-center justify-center border border-gray-300 disabled:opacity-50">
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>)}
                </div> : <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <TagIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No add-ons available for this event
                  </p>
                </div>}
            </div>
            {/* Promo code */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Promo Code
              </h2>
              <div className="flex space-x-2">
                <input type="text" className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="Enter promo code" value={promoCode} onChange={e => setPromoCode(e.target.value)} />
                <button onClick={handleApplyPromoCode} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Apply
                </button>
              </div>
              {promoApplied && <p className="mt-2 text-sm text-green-600">
                  Promo code applied! 10% discount added.
                </p>}
              {promoError && <p className="mt-2 text-sm text-red-600">
                  Invalid promo code. Please try again.
                </p>}
            </div>
          </div>
          {/* Order summary column */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              {hasSelectedTickets ? <>
                  <div className="space-y-4 mb-6">
                    {selectedTickets.filter((t: any) => t.quantity > 0).map((ticket: any) => <div key={ticket.id} className="flex justify-between">
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
                    {selectedAddons.filter((a: any) => a.quantity > 0).map((addon: any) => <div key={addon.id} className="flex justify-between">
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
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <p className="text-gray-600">Subtotal</p>
                      <p>${calculateSubtotal().toFixed(2)}</p>
                    </div>
                    {calculateSubtotal() > 0 && <div className="flex justify-between text-sm mb-2">
                        <div className="flex items-start">
                          <p className="text-gray-600">Marketplace Fee (10%)</p>
                          <button className="ml-1 text-gray-400 hover:text-gray-600">
                            <InfoIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <p>${calculateMarketplaceFee().toFixed(2)}</p>
                      </div>}
                    {promoApplied && <div className="flex justify-between text-sm mb-2 text-green-600">
                        <p>Discount (10%)</p>
                        <p>-${(calculateSubtotal() * 0.1).toFixed(2)}</p>
                      </div>}
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between font-bold">
                      <p>Total</p>
                      <p>${calculateTotal().toFixed(2)}</p>
                    </div>
                    {hasOnlyFreeTickets && <p className="text-sm text-green-600 mt-2">
                        No payment required for free tickets
                      </p>}
                  </div>
                  <button onClick={handleProceedToCheckout} className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    {hasOnlyFreeTickets ? 'Register Now' : 'Proceed to Checkout'}
                  </button>
                </> : <div className="text-center py-8">
                  <TicketIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Select tickets to continue</p>
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
    </div>;
};