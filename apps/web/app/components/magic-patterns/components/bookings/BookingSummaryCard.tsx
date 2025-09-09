import React from 'react';
import { UserIcon, UsersIcon, ClockIcon, CalendarIcon } from 'lucide-react';
import QRCode from 'react-qr-code';
type BookingSummaryCardProps = {
  booking: any;
};
export const BookingSummaryCard = ({
  booking
}: BookingSummaryCardProps) => {
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
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '';
    const [hour, minute] = timeString.split(':');
    const hourNum = parseInt(hour);
    return hourNum === 0 ? `12:${minute} AM` : hourNum < 12 ? `${hourNum}:${minute} AM` : hourNum === 12 ? `12:${minute} PM` : `${hourNum - 12}:${minute} PM`;
  };
  const calculateDuration = () => {
    const startHour = parseInt(booking.startTime.split(':')[0]);
    const endHour = parseInt(booking.endTime.split(':')[0]);
    let durationHours = endHour - startHour;
    if (durationHours <= 0) durationHours += 24; // Handle overnight events
    return `${durationHours} hours`;
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Booking Summary</h2>
          <span className="text-sm text-gray-500">
            Booking ID:{' '}
            <span className="font-mono font-medium">{booking.bookingId}</span>
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Event details */}
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-4">
              {booking.eventName}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Date</div>
                  <div className="text-gray-900">
                    {formatDate(booking.date)}
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Time</div>
                  <div className="text-gray-900">
                    {formatTime(booking.startTime)} -{' '}
                    {formatTime(booking.endTime)}
                    <span className="text-gray-500 text-sm ml-2">
                      ({calculateDuration()})
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <UsersIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Guests
                  </div>
                  <div className="text-gray-900">
                    {booking.guestCount} people
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <UserIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Event Type
                  </div>
                  <div className="text-gray-900">{booking.eventType}</div>
                </div>
              </div>
            </div>
          </div>
          {/* Right side - QR code */}
          <div className="mt-6 md:mt-0 md:ml-6 flex flex-col items-center">
            <div className="bg-white p-2 rounded-lg border border-gray-200 mb-2">
              <QRCode value={booking.bookingId} size={128} />
            </div>
            <div className="text-xs text-gray-500 text-center">
              Scan for check-in
            </div>
          </div>
        </div>
      </div>
    </div>;
};