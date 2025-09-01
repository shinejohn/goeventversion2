import React from 'react';
import { CheckCircleIcon, CalendarIcon, ClockIcon, UsersIcon, MapPinIcon, MailIcon, PhoneIcon, ArrowRightIcon, PrinterIcon, DownloadIcon, CalendarDaysIcon } from 'lucide-react';
type BookingConfirmationProps = {
  venue: any;
  formData: any;
  pricing: any;
  bookingReference: string;
  onViewBookings: () => void;
  onBrowseVenues: () => void;
};
export const BookingConfirmation = ({
  venue,
  formData,
  pricing,
  bookingReference,
  onViewBookings,
  onBrowseVenues
}: BookingConfirmationProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const hour = parseInt(timeString.split(':')[0]);
    return hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
  };
  return <div className="p-6">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <CheckCircleIcon className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Booking Request Submitted!
        </h2>
        <p className="mt-2 text-gray-600">
          Your booking request has been sent to the venue. You'll receive a
          confirmation email shortly.
        </p>
      </div>
      {/* Booking Reference */}
      <div className="bg-indigo-50 rounded-lg p-4 mb-8 text-center">
        <p className="text-sm text-indigo-700">Booking Reference</p>
        <p className="text-xl font-bold text-indigo-900">{bookingReference}</p>
        <p className="text-sm text-indigo-700 mt-1">
          Please save this reference number for your records
        </p>
      </div>
      {/* Booking Summary */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Booking Summary</h3>
          <div className="flex space-x-2">
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
              <PrinterIcon className="h-3.5 w-3.5 mr-1" />
              Print
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50">
              <DownloadIcon className="h-3.5 w-3.5 mr-1" />
              Download
            </button>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <CalendarDaysIcon className="h-4 w-4 mr-2 text-indigo-600" />
                Event Details
              </h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Event:</span>{' '}
                  {formData.eventName}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Type:</span>{' '}
                  {formData.eventType}
                </p>
                <p className="text-sm flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {formatDate(formData.primaryDate)}
                </p>
                <p className="text-sm flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {formatTime(formData.startTime)} -{' '}
                  {formatTime(formData.endTime)}
                </p>
                <p className="text-sm flex items-center">
                  <UsersIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {formData.expectedAttendance} guests
                </p>
              </div>
            </div>
            {/* Venue Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <BuildingIcon className="h-4 w-4 mr-2 text-indigo-600" />
                Venue Information
              </h4>
              <div className="space-y-2">
                <p className="text-sm font-medium">{venue.name}</p>
                <p className="text-sm flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {venue.location.address}
                </p>
                <p className="text-sm flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {venue.contactPerson?.phone || '(555) 123-4567'}
                </p>
                <p className="text-sm flex items-center">
                  <MailIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {venue.contactPerson?.email || 'contact@venue.com'}
                </p>
              </div>
            </div>
            {/* Pricing Summary */}
            <div className="md:col-span-2">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <DollarSignIcon className="h-4 w-4 mr-2 text-indigo-600" />
                Pricing Details
              </h4>
              <div className="bg-gray-50 rounded-md p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    ${pricing.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Service fee & taxes</span>
                  <span className="text-gray-900">
                    ${pricing.taxFees.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-200 mt-2">
                  <span>Estimated Total</span>
                  <span>${pricing.total.toLocaleString()}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Deposit Due:</span> $
                  {pricing.deposit.toLocaleString()} (30% of total)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Next Steps */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Next Steps</h3>
        </div>
        <div className="px-6 py-4">
          <ol className="space-y-4">
            <li className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm">
                  1
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Venue Review
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  The venue will review your booking request and check
                  availability.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm">
                  2
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Confirmation
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  You'll receive an email confirmation with payment instructions
                  for the deposit.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm">
                  3
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Secure Your Booking
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Pay the deposit to secure your booking. The remaining balance
                  will be due closer to the event date.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <button onClick={onViewBookings} className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          View My Bookings
        </button>
        <button onClick={onBrowseVenues} className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Browse More Venues
        </button>
      </div>
    </div>;
};