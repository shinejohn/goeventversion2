import React from 'react';
import { XIcon, CheckCircleIcon, CalendarIcon, ClockIcon, ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
type BookingConfirmationPopupProps = {
  venueName: string;
  selectedDate: Date | null;
  startTime: string;
  endTime: string;
  onClose: () => void;
};
export const BookingConfirmationPopup = ({
  venueName,
  selectedDate,
  startTime,
  endTime,
  onClose
}: BookingConfirmationPopupProps) => {
  const navigate = useNavigate();
  const handleViewBookings = () => {
    navigate('/bookings/confirmed');
    onClose();
  };
  const handleClose = () => {
    onClose();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-xl">Booking Request Sent</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Your booking request has been sent!
          </h3>
          <p className="text-gray-600 mb-6">
            We've sent your request to {venueName}. You'll receive a
            confirmation email shortly and the venue will respond within 24
            hours.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-center mb-2">
              <CalendarIcon className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="font-medium">
                {selectedDate ? selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              }) : 'Date not selected'}
              </span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="font-medium">
                {startTime} - {endTime}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleViewBookings} className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center">
              View My Bookings
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </button>
            <button onClick={handleClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>;
};