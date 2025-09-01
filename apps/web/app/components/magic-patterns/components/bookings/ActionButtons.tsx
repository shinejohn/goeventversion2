import React, { useState, createElement } from 'react';
import { CalendarIcon, ShareIcon, MessageSquareIcon, FileTextIcon, SettingsIcon, DownloadIcon, ClipboardCopyIcon, CheckIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
type ActionButtonsProps = {
  booking: any;
};
export const ActionButtons = ({
  booking
}: ActionButtonsProps) => {
  const {
    navigateTo
  } = useNavigationContext();
  const [copySuccess, setCopySuccess] = useState(false);
  const [calendarSuccess, setCalendarSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  // Handle add to calendar
  const handleAddToCalendar = () => {
    // Create calendar event data
    const event = {
      title: booking.title || `Booking at ${booking.venue?.name || 'Venue'}`,
      start: booking.date || new Date(),
      end: booking.endDate || new Date(new Date().getTime() + 3 * 60 * 60 * 1000),
      location: booking.venue?.address || 'Venue Address',
      description: `Booking ID: ${booking.bookingId || 'Unknown'}`
    };
    // Create ICS file content
    const startDate = event.start.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = event.end.toISOString().replace(/-|:|\.\d+/g, '');
    const icsContent = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `SUMMARY:${event.title}`, `DTSTART:${startDate}`, `DTEND:${endDate}`, `LOCATION:${event.location}`, `DESCRIPTION:${event.description}`, 'END:VEVENT', 'END:VCALENDAR'].join('\n');
    // Create download link
    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `booking_${booking.bookingId || 'event'}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Show success message
    setCalendarSuccess(true);
    setTimeout(() => setCalendarSuccess(false), 3000);
  };
  // Handle share event
  const handleShareEvent = () => {
    // Copy booking link to clipboard
    const bookingUrl = `https://whensthefun.com/bookings/${booking.bookingId || 'unknown'}`;
    navigator.clipboard.writeText(bookingUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  // Handle message venue
  const handleMessageVenue = () => {
    // In a real app, this would open a messaging interface
    setMessageSuccess(true);
    setTimeout(() => setMessageSuccess(false), 2000);
    setTimeout(() => {
      navigateTo('/messages');
    }, 1000);
  };
  // Handle view contract
  const handleViewContract = () => {
    // In a real app, this would download the contract PDF
    // For this demo, we'll just simulate the download
    // Create a simple text representation of the contract
    const contractText = [`BOOKING CONTRACT`, `Booking ID: ${booking.bookingId || 'Unknown'}`, `Date: ${booking.date ? booking.date.toLocaleDateString() : 'Unknown Date'}`, `Venue: ${booking.venue?.name || 'Unknown Venue'}`, `\nTerms and Conditions:`, `1. Cancellations must be made 30 days prior to event for full refund.`, `2. Changes to event details must be submitted in writing.`, `3. Damage to venue property is the responsibility of the booking party.`].join('\n');
    // Create download link
    const blob = new Blob([contractText], {
      type: 'text/plain;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `contract_${booking.bookingId || 'booking'}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Show success message
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };
  // Handle manage booking
  const handleManageBooking = () => {
    // In a real app, this would navigate to the booking management page
    navigateTo(`/bookings/manage/${booking.bookingId || 'unknown'}`);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-6">
      {/* Success Messages */}
      {calendarSuccess && <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center">
          <CheckIcon className="h-5 w-5 mr-2" />
          Event added to calendar!
        </div>}
      {downloadSuccess && <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center">
          <CheckIcon className="h-5 w-5 mr-2" />
          Contract downloaded successfully!
        </div>}
      {messageSuccess && <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center">
          <CheckIcon className="h-5 w-5 mr-2" />
          Opening messaging interface...
        </div>}
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-medium text-gray-900">Actions</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <button onClick={handleAddToCalendar} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
            Add to Calendar
          </button>
          <button onClick={handleShareEvent} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            {copySuccess ? <>
                <CheckIcon className="h-5 w-5 mr-2 text-green-500" />
                Link Copied!
              </> : <>
                <ShareIcon className="h-5 w-5 mr-2 text-gray-500" />
                Share Event
              </>}
          </button>
          <button onClick={handleMessageVenue} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <MessageSquareIcon className="h-5 w-5 mr-2 text-gray-500" />
            Message Venue
          </button>
          <button onClick={handleViewContract} className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <FileTextIcon className="h-5 w-5 mr-2 text-gray-500" />
            View Contract
            <DownloadIcon className="h-4 w-4 ml-2 text-gray-400" />
          </button>
          <button onClick={handleManageBooking} className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm text-sm font-medium text-white">
            <SettingsIcon className="h-5 w-5 mr-2" />
            Manage Booking
          </button>
        </div>
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <ClipboardCopyIcon className="h-4 w-4" />
            <span>Booking ID: {booking.bookingId || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </div>;
};