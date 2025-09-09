import React from 'react';
import { CheckCircleIcon, CalendarIcon, ClockIcon, MapPinIcon, ArrowRightIcon, MailIcon, PhoneIcon, ClipboardCheckIcon } from 'lucide-react';
type ConfirmationStepProps = {
  venue: any;
  formData: any;
  pricing: any;
  bookingReference: string;
  onBrowseSimilarVenues: () => void;
};
export const ConfirmationStep = ({
  venue,
  formData,
  pricing,
  bookingReference,
  onBrowseSimilarVenues
}: ConfirmationStepProps) => {
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  // Format time for display
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '';
    const hour = parseInt(timeString.split(':')[0]);
    return hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
  };
  // Copy booking reference to clipboard
  const copyReferenceToClipboard = () => {
    typeof navigator !== "undefined" && navigator.clipboard.writeText(bookingReference);
    alert('Booking reference copied to clipboard!');
  };
  return <div className="p-6">
      {/* Success Message */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <CheckCircleIcon className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Booking Request Sent!
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Your booking request for {venue.name} has been submitted successfully.
          We'll notify you when the venue responds.
        </p>
      </div>
      {/* What Happens Next */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          What Happens Next
        </h3>
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 font-medium text-lg">
              1
            </div>
            <div className="ml-4">
              <h4 className="text-base font-medium text-gray-900">
                Venue Review
              </h4>
              <p className="text-sm text-gray-600">
                The venue will review your request and respond within{' '}
                {venue.responseTimeHours} hours.
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 font-medium text-lg">
              2
            </div>
            <div className="ml-4">
              <h4 className="text-base font-medium text-gray-900">
                Confirmation
              </h4>
              <p className="text-sm text-gray-600">
                Once approved, you'll receive a confirmation email with booking
                details.
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 font-medium text-lg">
              3
            </div>
            <div className="ml-4">
              <h4 className="text-base font-medium text-gray-900">
                Payment Processing
              </h4>
              <p className="text-sm text-gray-600">
                A 20% hold (${Math.round(pricing.total * 0.2)}) will be placed
                on your payment method.
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 font-medium text-lg">
              4
            </div>
            <div className="ml-4">
              <h4 className="text-base font-medium text-gray-900">
                Finalize Details
              </h4>
              <p className="text-sm text-gray-600">
                You can communicate with the venue through our messaging system
                to finalize any details.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center text-sm text-gray-600 bg-white p-3 rounded-md border border-gray-200">
          <MailIcon className="h-4 w-4 text-gray-400 mr-2" />A confirmation
          email has been sent to {formData.contactEmail}
        </div>
      </div>
      {/* Request Details */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Reference:</span>
            <span className="font-mono font-medium text-gray-900">
              {bookingReference}
            </span>
            <button onClick={copyReferenceToClipboard} className="text-indigo-600 hover:text-indigo-800">
              <ClipboardCheckIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-start">
              <div className="h-16 w-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                <img src={venue.images[0]} alt={venue.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{venue.name}</h4>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {venue.location.address}
                </div>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Date</div>
                  <div className="text-gray-900">
                    {formatDate(formData.primaryDate)}
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Time</div>
                  <div className="text-gray-900">
                    {formatTime(formData.startTime)} -{' '}
                    {formatTime(formData.endTime)}
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Contact
                  </div>
                  <div className="text-gray-900">{formData.contactPhone}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Total Amount:</span>
                <span className="font-bold">${pricing.total}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Initial Hold:</span>
                <span>${Math.round(pricing.total * 0.2)} (20%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* While You Wait */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          While You Wait
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-900 mb-2">
              View Your Bookings
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Track the status of this and other booking requests.
            </p>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
              Go to My Bookings
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-900 mb-2">
              Browse Similar Venues
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Explore alternatives in case this venue is unavailable.
            </p>
            <button onClick={onBrowseSimilarVenues} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
              See Similar Venues
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-900 mb-2">
              Complete Your Profile
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Add more details to improve your booking success rate.
            </p>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
              Update Profile
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>;
};