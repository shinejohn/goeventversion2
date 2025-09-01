import React, { useEffect, useState } from 'react';
import { CalendarIcon, ClockIcon, MessageCircleIcon, HeartIcon } from 'lucide-react';
type BookingWidgetProps = {
  venue: any;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  onBookingRequest: () => void;
  onSendMessage: () => void;
};
export const BookingWidget = ({
  venue,
  selectedDate,
  setSelectedDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  onBookingRequest,
  onSendMessage
}: BookingWidgetProps) => {
  const [duration, setDuration] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  // Calculate pricing when date/times change
  useEffect(() => {
    if (!selectedDate) {
      setDuration(0);
      setSubtotal(0);
      setServiceFee(0);
      setTotal(0);
      return;
    }
    // Parse start and end times
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);
    // Calculate duration in hours
    let hours = endHour - startHour;
    if (hours <= 0) hours += 24; // Handle overnight events
    setDuration(hours);
    // Calculate pricing
    const basePrice = venue.pricePerHour * hours;
    setSubtotal(basePrice);
    // Service fee (10%)
    const fee = Math.round(basePrice * 0.1);
    setServiceFee(fee);
    // Total
    setTotal(basePrice + fee);
    // Check if date is available
    // This would be more complex in a real implementation
    const dateString = selectedDate.toISOString().split('T')[0];
    setIsAvailable(!venue.unavailableDates.includes(dateString));
  }, [selectedDate, startTime, endTime, venue]);
  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  // Format date for input
  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };
  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSelectedDate(new Date(e.target.value));
    } else {
      setSelectedDate(null);
    }
  };
  return <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Request to Book
        </h3>
        {/* Date Selection */}
        <div className="mb-4">
          <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-1">
            Event Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="date" id="event-date" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={formatDateForInput(selectedDate)} onChange={handleDateChange} />
          </div>
        </div>
        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select id="start-time" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={startTime} onChange={e => setStartTime(e.target.value)}>
                {Array.from({
                length: 24
              }).map((_, hour) => <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                    {hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`}
                  </option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select id="end-time" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value={endTime} onChange={e => setEndTime(e.target.value)}>
                {Array.from({
                length: 24
              }).map((_, hour) => <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                    {hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`}
                  </option>)}
              </select>
            </div>
          </div>
        </div>
        {/* Availability Status */}
        {selectedDate && <div className={`mb-6 p-3 rounded-md ${isAvailable ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <div className="flex items-center">
              {isAvailable ? <>
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">
                    Available on {formatDate(selectedDate)}
                  </span>
                </> : <>
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">
                    Not available on {formatDate(selectedDate)}
                  </span>
                </>}
            </div>
          </div>}
        {/* Pricing Display */}
        <div className="border-t border-gray-200 pt-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-4">Pricing Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                ${venue.pricePerHour} × {duration} hours
              </span>
              <span className="text-gray-900">${subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service fee (10%)</span>
              <span className="text-gray-900">${serviceFee}</span>
            </div>
            <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-100">
              <span>Estimated total</span>
              <span>${total}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Final pricing will be confirmed upon booking approval. Additional
            services or fees may apply.
          </p>
        </div>
        {/* Primary CTA */}
        <button onClick={onBookingRequest} disabled={!selectedDate || !isAvailable} className={`w-full py-3 px-4 rounded-md font-medium text-white ${!selectedDate || !isAvailable ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
          Send Booking Request
        </button>
        {/* Secondary Actions */}
        <div className="mt-4 flex space-x-2">
          <button onClick={onSendMessage} className="flex-1 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <MessageCircleIcon className="h-4 w-4 mr-2" />
            Message Venue
          </button>
        </div>
      </div>
      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 text-center">
        <p className="text-sm text-gray-600">
          This venue typically responds within{' '}
          <span className="font-medium">{venue.responseTimeHours} hours</span>
        </p>
      </div>
    </div>;
};