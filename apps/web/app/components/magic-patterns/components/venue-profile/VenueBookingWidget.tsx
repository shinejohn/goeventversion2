import React, { useState } from 'react';
import { CalendarIcon, UsersIcon, ClockIcon, MessageCircleIcon, CheckIcon, CalendarDaysIcon, DollarSignIcon } from 'lucide-react';
type VenueBookingWidgetProps = {
  venue: any;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  onCheckAvailability: () => void;
  onSendMessage: () => void;
  isMobile?: boolean;
};
export const VenueBookingWidget = ({
  venue,
  selectedDate,
  setSelectedDate,
  onCheckAvailability,
  onSendMessage,
  isMobile = false
}: VenueBookingWidgetProps) => {
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('23:00');
  const [showInstantQuote, setShowInstantQuote] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState<any>(null);
  const eventTypes = ['Wedding', 'Corporate Event', 'Birthday Party', 'Conference', 'Concert', 'Photoshoot', 'Private Dinner', 'Networking Event', 'Product Launch', 'Other'];
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setSelectedDate(date);
  };
  const handleGetQuote = () => {
    if (!selectedDate || !eventType || !guestCount) {
      alert('Please fill in all required fields');
      return;
    }
    // Calculate hours
    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);
    const hours = end > start ? end - start : 24 - start + end;
    // Calculate base cost
    const baseCost = venue.price_per_hour * hours;
    // Add fees
    const cleaningFee = venue.additionalFees.find((fee: any) => fee.name === 'Cleaning Fee')?.amount || 0;
    const securityDeposit = venue.additionalFees.find((fee: any) => fee.name === 'Security Deposit')?.amount || 0;
    // Generate quote
    setQuoteDetails({
      date: selectedDate.toLocaleDateString(),
      hours,
      baseCost,
      cleaningFee,
      securityDeposit,
      total: baseCost + cleaningFee + securityDeposit
    });
    setShowInstantQuote(true);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-medium text-gray-900">
          Check Availability
        </h2>
      </div>
      <div className="p-6">
        {!showInstantQuote ? <div className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Event Date*
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="date" id="date" value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''} onChange={handleDateChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
              </div>
            </div>
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                Event Type*
              </label>
              <select id="eventType" value={eventType} onChange={e => setEventType(e.target.value)} className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
                <option value="">Select event type</option>
                {eventTypes.map(type => <option key={type} value={type}>
                    {type}
                  </option>)}
              </select>
            </div>
            <div>
              <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Guests*
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UsersIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input type="number" id="guestCount" value={guestCount} onChange={e => setGuestCount(e.target.value)} min="1" max={venue.capacity} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder={`Up to ${venue.capacity} guests`} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    {Array.from({
                  length: 24
                }).map((_, i) => <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                      </option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <select id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  {Array.from({
                length: 24
              }).map((_, i) => <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                    </option>)}
                </select>
              </div>
            </div>
            <div className="pt-4">
              <button onClick={handleGetQuote} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700">
                Get Instant Quote
              </button>
              <button onClick={onCheckAvailability} className="w-full mt-3 border border-indigo-600 text-indigo-600 py-2 px-4 rounded-md font-medium hover:bg-indigo-50">
                Check Availability
              </button>
              <button onClick={onSendMessage} className="w-full mt-3 flex items-center justify-center border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50">
                <MessageCircleIcon className="h-4 w-4 mr-2" />
                Message Venue
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex items-start">
                <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                <span>No credit card required to check availability</span>
              </div>
              <div className="flex items-start mt-1">
                <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                <span>{venue.responseTimeHours}h average response time</span>
              </div>
            </div>
          </div> : <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Instant Quote
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">{quoteDetails.date}</span>
                </div>
                <span className="text-gray-700">
                  {quoteDetails.hours} hours
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {startTime === '00:00' ? '12:00 AM' : parseInt(startTime) < 12 ? `${parseInt(startTime)}:00 AM` : parseInt(startTime) === 12 ? '12:00 PM' : `${parseInt(startTime) - 12}:00 PM`}{' '}
                -
                {endTime === '00:00' ? '12:00 AM' : parseInt(endTime) < 12 ? `${parseInt(endTime)}:00 AM` : parseInt(endTime) === 12 ? '12:00 PM' : `${parseInt(endTime) - 12}:00 PM`}
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Base rental ({quoteDetails.hours} hours @ $
                  {venue.price_per_hour}/hr)
                </span>
                <span className="text-gray-900">${quoteDetails.baseCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cleaning fee</span>
                <span className="text-gray-900">
                  ${quoteDetails.cleaningFee}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Security deposit (refundable)
                </span>
                <span className="text-gray-900">
                  ${quoteDetails.securityDeposit}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${quoteDetails.total}</span>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <button onClick={onCheckAvailability} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700">
                Request to Book
              </button>
              <button onClick={() => setShowInstantQuote(false)} className="w-full mt-3 border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-50">
                Modify Request
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex items-start">
                <DollarSignIcon className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                <span>You won't be charged yet</span>
              </div>
            </div>
          </div>}
      </div>
      {/* Special Offer Banner */}
      <div className="px-6 py-4 bg-amber-50 border-t border-amber-100">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">
              Special Offer
            </h3>
            <div className="mt-1 text-sm text-amber-700">
              <p>20% off for weekday bookings in June. Use code JUNE20.</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};