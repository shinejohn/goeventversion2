import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { CalendarIcon, MapPinIcon, ClockIcon, UserIcon, TicketIcon, CreditCardIcon, CheckIcon, XIcon, AlertCircleIcon, ArrowRightIcon, FilterIcon } from 'lucide-react';

interface Booking {
  id: string;
  bookingNumber: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venueId: string;
  venueName: string;
  venueAddress: string;
  guestCount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  eventImageUrl?: string;
}

interface BookingsPageProps {
  bookings: Booking[];
  metrics?: {
    totalBookings: number;
    upcomingEvents: number;
    completedEvents: number;
    totalSpent: number;
  };
}

export const BookingsPage = ({ 
  bookings = [], 
  metrics = { 
    totalBookings: 0, 
    upcomingEvents: 0, 
    completedEvents: 0, 
    totalSpent: 0 
  } 
}: BookingsPageProps) => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter bookings based on status
  const filteredBookings = bookings.filter(booking => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'upcoming') return booking.status === 'confirmed' && new Date(booking.eventDate) >= new Date();
    if (filterStatus === 'past') return booking.status === 'completed' || new Date(booking.eventDate) < new Date();
    return booking.status === filterStatus;
  });
  
  // Group bookings by status
  const groupedBookings = {
    upcoming: filteredBookings.filter(b => b.status === 'confirmed' && new Date(b.eventDate) >= new Date()),
    pending: filteredBookings.filter(b => b.status === 'pending'),
    past: filteredBookings.filter(b => b.status === 'completed' || new Date(b.eventDate) < new Date()),
    cancelled: filteredBookings.filter(b => b.status === 'cancelled')
  };
  
  const getStatusBadge = (status: Booking['status'], paymentStatus: Booking['paymentStatus']) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircleIcon },
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckIcon },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XIcon },
      completed: { bg: 'bg-gray-100', text: 'text-gray-800', icon: CheckIcon }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };
  
  const getPaymentBadge = (paymentStatus: Booking['paymentStatus']) => {
    const paymentConfig = {
      pending: { bg: 'bg-orange-100', text: 'text-orange-800' },
      paid: { bg: 'bg-green-100', text: 'text-green-800' },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-800' }
    };
    
    const config = paymentConfig[paymentStatus];
    
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </span>
    );
  };
  
  const renderBookingCard = (booking: Booking) => (
    <div 
      key={booking.id} 
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
      onClick={() => navigate(`/events/${booking.eventId}`)}
    >
      <div className="flex">
        {booking.eventImageUrl && (
          <div className="w-32 h-32 flex-shrink-0">
            <img 
              src={booking.eventImageUrl} 
              alt={booking.eventTitle} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600">
                {booking.eventTitle}
              </h3>
              <p className="text-sm text-gray-500">Booking #{booking.bookingNumber}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {getStatusBadge(booking.status, booking.paymentStatus)}
              {getPaymentBadge(booking.paymentStatus)}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1 flex-shrink-0" />
              {new Date(booking.eventDate).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1 flex-shrink-0" />
              {booking.eventTime}
            </div>
            <div className="flex items-center">
              <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
              {booking.venueName}
            </div>
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 mr-1 flex-shrink-0" />
              {booking.guestCount} guests
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <div className="flex items-center text-lg font-semibold text-gray-900">
              <CreditCardIcon className="w-5 h-5 mr-1" />
              ${booking.totalAmount.toLocaleString()}
            </div>
            <button 
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/bookings/${booking.id}`);
              }}
            >
              View Details
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your event reservations and tickets</p>
            </div>
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Browse Events
            </button>
          </div>
        </div>
      </div>
      
      {/* Metrics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <TicketIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{metrics.totalBookings}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
                <p className="text-2xl font-semibold text-gray-900">{metrics.upcomingEvents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
                <CheckIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{metrics.completedEvents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <CreditCardIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900">${metrics.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FilterIcon className="w-4 h-4 mr-2" />
            Filters
          </button>
          <div className="flex flex-wrap gap-2">
            {['all', 'upcoming', 'pending', 'past', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bookings List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filterStatus === 'all' 
                ? 'Start exploring events to make your first booking!' 
                : `No ${filterStatus} bookings to display.`}
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/events')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Browse Events
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedBookings.upcoming.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Events</h2>
                <div className="space-y-4">
                  {groupedBookings.upcoming.map(renderBookingCard)}
                </div>
              </div>
            )}
            
            {groupedBookings.pending.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Pending Confirmation</h2>
                <div className="space-y-4">
                  {groupedBookings.pending.map(renderBookingCard)}
                </div>
              </div>
            )}
            
            {groupedBookings.past.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Past Events</h2>
                <div className="space-y-4">
                  {groupedBookings.past.map(renderBookingCard)}
                </div>
              </div>
            )}
            
            {groupedBookings.cancelled.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Cancelled</h2>
                <div className="space-y-4">
                  {groupedBookings.cancelled.map(renderBookingCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};