import React, { useState } from 'react';
import { ArrowLeftIcon, BuildingIcon, HomeIcon, ChevronRightIcon, PlusIcon, CalendarIcon, MessageCircleIcon, BarChartIcon, SettingsIcon, ClockIcon, CheckCircleIcon, XCircleIcon, EditIcon, TrashIcon, EyeIcon, BellIcon, UsersIcon, DollarSignIcon, ImageIcon, TagIcon, GlobeIcon, ChevronLeftIcon, ChevronDownIcon, SaveIcon, RefreshCwIcon, ShieldIcon, AlertCircleIcon, HelpCircleIcon, FileTextIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { mockVenues } from '../../mockdata/venues';
export const VenueManagementPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('venues');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showBookingDetails, setShowBookingDetails] = useState<string | null>(null);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('month');
  const [settingsSection, setSettingsSection] = useState('general');
  // Mock data for venue management
  const myVenues = mockVenues.slice(0, 3).map(venue => ({
    ...venue,
    status: Math.random() > 0.3 ? 'active' : 'pending',
    lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    totalBookings: Math.floor(Math.random() * 50),
    upcomingBookings: Math.floor(Math.random() * 10)
  }));
  // Mock data for booking requests
  const bookingRequests = [{
    id: 'request-1',
    venueName: 'Grand Ballroom',
    eventName: 'Corporate Retreat',
    date: '2024-07-15',
    time: '09:00 - 17:00',
    guestCount: 120,
    status: 'pending',
    clientName: 'Tech Innovations Inc.',
    message: 'Looking to host our annual corporate retreat. Would need full AV setup and catering options.',
    received: '2024-06-01T14:30:00Z'
  }, {
    id: 'request-2',
    venueName: 'Waterfront Pavilion',
    eventName: 'Wedding Reception',
    date: '2024-08-22',
    time: '16:00 - 23:00',
    guestCount: 150,
    status: 'pending',
    clientName: 'Emma & Jason',
    message: 'Planning our wedding reception. Would love to discuss decoration options and menu choices.',
    received: '2024-06-03T09:15:00Z'
  }];
  // Mock data for calendar events
  const calendarEvents = [{
    id: 'event-1',
    title: 'Corporate Retreat',
    venue: 'Grand Ballroom',
    date: new Date(2024, 5, 15),
    startTime: '09:00',
    endTime: '17:00',
    client: 'Tech Innovations Inc.',
    status: 'confirmed',
    color: 'bg-green-100 text-green-800 border-green-200'
  }, {
    id: 'event-2',
    title: 'Wedding Reception',
    venue: 'Waterfront Pavilion',
    date: new Date(2024, 5, 22),
    startTime: '16:00',
    endTime: '23:00',
    client: 'Emma & Jason',
    status: 'confirmed',
    color: 'bg-green-100 text-green-800 border-green-200'
  }, {
    id: 'event-3',
    title: 'Birthday Party',
    venue: 'Urban Loft Gallery',
    date: new Date(2024, 5, 10),
    startTime: '18:00',
    endTime: '22:00',
    client: 'Michael Smith',
    status: 'pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }, {
    id: 'event-4',
    title: 'Product Launch',
    venue: 'The Grand Ballroom',
    date: new Date(2024, 5, 5),
    startTime: '10:00',
    endTime: '15:00',
    client: 'Nexus Technologies',
    status: 'confirmed',
    color: 'bg-green-100 text-green-800 border-green-200'
  }, {
    id: 'event-5',
    title: 'Charity Gala',
    venue: 'The Historic Theatre',
    date: new Date(2024, 5, 28),
    startTime: '19:00',
    endTime: '23:00',
    client: 'Hope Foundation',
    status: 'confirmed',
    color: 'bg-green-100 text-green-800 border-green-200'
  }];
  // Mock data for analytics
  const analyticsData = {
    bookings: {
      total: 48,
      thisMonth: 12,
      lastMonth: 8,
      growth: '+50%'
    },
    revenue: {
      total: '$124,500',
      thisMonth: '$32,800',
      lastMonth: '$27,500',
      growth: '+19%'
    },
    inquiries: {
      total: 156,
      thisMonth: 38,
      lastMonth: 42,
      growth: '-10%'
    },
    topVenues: [{
      name: 'The Grand Ballroom',
      bookings: 18,
      revenue: '$48,200'
    }, {
      name: 'Waterfront Pavilion',
      bookings: 15,
      revenue: '$37,500'
    }, {
      name: 'The Historic Theatre',
      bookings: 9,
      revenue: '$22,800'
    }],
    popularDays: [{
      day: 'Saturday',
      bookings: 22,
      percentage: '46%'
    }, {
      day: 'Friday',
      bookings: 14,
      percentage: '29%'
    }, {
      day: 'Sunday',
      bookings: 8,
      percentage: '17%'
    }]
  };
  const handleBackToVenues = () => {
    navigate('/venues');
  };
  const handleAddVenue = () => {
    navigate('/venues/submit');
  };
  const handleEditVenue = (venueId: string) => {
    // In a real app, this would navigate to an edit page
    alert(`Edit venue ${venueId}`);
  };
  const handleViewVenue = (venueId: string) => {
    navigate(`/venues/${venueId}`);
  };
  const handleDeleteVenue = (venueId: string) => {
    // In a real app, this would show a confirmation dialog
    alert(`Delete venue ${venueId}`);
  };
  const handleViewBookingRequest = (requestId: string) => {
    // In a real app, this would navigate to a request detail page
    alert(`View booking request ${requestId}`);
  };
  const handleApproveRequest = (requestId: string) => {
    // In a real app, this would approve the request
    alert(`Approve booking request ${requestId}`);
  };
  const handleDeclineRequest = (requestId: string) => {
    // In a real app, this would decline the request
    alert(`Decline booking request ${requestId}`);
  };
  const handleViewBookingDetails = (eventId: string) => {
    setShowBookingDetails(eventId);
  };
  const handleSaveSettings = (section: string) => {
    // In a real app, this would save the settings
    alert(`Saving settings for section: ${section}`);
  };
  // Calendar utility functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  const getPreviousMonth = () => {
    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setCurrentMonth(previousMonth);
  };
  const getNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>);
    }
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = calendarEvents.filter(event => event.date.getDate() === day && event.date.getMonth() === month && event.date.getFullYear() === year);
      days.push(<div key={`day-${day}`} className="h-24 border border-gray-200 p-1 overflow-hidden">
          <div className="text-right text-sm font-medium text-gray-700 mb-1">
            {day}
          </div>
          <div className="space-y-1 overflow-y-auto max-h-[calc(100%-20px)]">
            {dayEvents.map(event => <button key={event.id} onClick={() => handleViewBookingDetails(event.id)} className={`block w-full text-left text-xs px-1.5 py-0.5 rounded border truncate ${event.color}`}>
                {event.startTime} - {event.title}
              </button>)}
          </div>
        </div>);
    }
    return days;
  };
  return <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-gray-700 flex items-center">
              <HomeIcon className="h-4 w-4 mr-1" />
              Home
            </button>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <button onClick={() => navigate('/venues')} className="hover:text-gray-700">
              Venues
            </button>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium">Venue Management</span>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button onClick={handleBackToVenues} className="mb-2 flex items-center text-indigo-600 hover:text-indigo-800">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Venues
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Venue Management
            </h1>
            <p className="text-gray-600">
              Manage your venues and booking requests
            </p>
          </div>
          <button onClick={handleAddVenue} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Venue
          </button>
        </div>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <BuildingIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Venues
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {myVenues.length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <CalendarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Upcoming Bookings
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {myVenues.reduce((sum, venue) => sum + venue.upcomingBookings, 0)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <BellIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Requests
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {bookingRequests.length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <BarChartIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Bookings
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {myVenues.reduce((sum, venue) => sum + venue.totalBookings, 0)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('venues')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'venues' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <BuildingIcon className="h-5 w-5 inline mr-2" />
              My Venues
            </button>
            <button onClick={() => setActiveTab('requests')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'requests' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <MessageCircleIcon className="h-5 w-5 inline mr-2" />
              Booking Requests
              {bookingRequests.length > 0 && <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                  {bookingRequests.length}
                </span>}
            </button>
            <button onClick={() => setActiveTab('calendar')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'calendar' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <CalendarIcon className="h-5 w-5 inline mr-2" />
              Calendar
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'analytics' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <BarChartIcon className="h-5 w-5 inline mr-2" />
              Analytics
            </button>
            <button onClick={() => setActiveTab('settings')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <SettingsIcon className="h-5 w-5 inline mr-2" />
              Settings
            </button>
          </nav>
        </div>
        {/* Tab Content */}
        {activeTab === 'venues' && <div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">My Venues</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Venue
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bookings
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {myVenues.map(venue => <tr key={venue.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img className="h-10 w-10 rounded-md object-cover" src={venue.images[0]} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {venue.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {venue.venueType}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${venue.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {venue.status === 'active' ? 'Active' : 'Pending Review'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {venue.upcomingBookings} upcoming
                          </div>
                          <div className="text-sm text-gray-500">
                            {venue.totalBookings} total
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(venue.lastUpdated).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleViewVenue(venue.id)} className="text-indigo-600 hover:text-indigo-900 mr-3" title="View venue">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleEditVenue(venue.id)} className="text-blue-600 hover:text-blue-900 mr-3" title="Edit venue">
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteVenue(venue.id)} className="text-red-600 hover:text-red-900" title="Delete venue">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
              {myVenues.length === 0 && <div className="text-center py-12">
                  <BuildingIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No venues
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding a new venue.
                  </p>
                  <div className="mt-6">
                    <button onClick={handleAddVenue} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add New Venue
                    </button>
                  </div>
                </div>}
            </div>
          </div>}
        {activeTab === 'requests' && <div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Booking Requests
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request Details
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Received
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookingRequests.map(request => <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {request.eventName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.venueName}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {request.guestCount} guests
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {request.clientName}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {request.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(request.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.received).toLocaleDateString()} at{' '}
                          {new Date(request.received).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleViewBookingRequest(request.id)} className="text-indigo-600 hover:text-indigo-900 mr-3" title="View request">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleApproveRequest(request.id)} className="text-green-600 hover:text-green-900 mr-3" title="Approve request">
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeclineRequest(request.id)} className="text-red-600 hover:text-red-900" title="Decline request">
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
              {bookingRequests.length === 0 && <div className="text-center py-12">
                  <MessageCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No booking requests
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You'll see booking requests here when clients inquire about
                    your venues.
                  </p>
                </div>}
            </div>
          </div>}
        {activeTab === 'calendar' && <div className="space-y-6">
            {/* Calendar View */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Venue Calendar
                </h3>
                <div className="flex items-center space-x-2">
                  <button onClick={getPreviousMonth} className="p-1 rounded-full hover:bg-gray-100" title="Previous month">
                    <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <h4 className="text-md font-medium text-gray-900 min-w-[140px] text-center">
                    {currentMonth.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
                  </h4>
                  <button onClick={getNextMonth} className="p-1 rounded-full hover:bg-gray-100" title="Next month">
                    <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                {/* Calendar Legend */}
                <div className="flex items-center justify-end mb-4 text-xs space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-100 border border-green-200 rounded-sm mr-1"></div>
                    <span>Confirmed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded-sm mr-1"></div>
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-100 border border-red-200 rounded-sm mr-1"></div>
                    <span>Canceled</span>
                  </div>
                </div>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px bg-gray-200">
                  {/* Day headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="bg-gray-50 text-center py-2 text-sm font-medium text-gray-500">
                        {day}
                      </div>)}
                  {/* Calendar days */}
                  {renderCalendar()}
                </div>
              </div>
            </div>
            {/* Booking Details Popup */}
            {showBookingDetails && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Booking Details
                    </h3>
                    <button onClick={() => setShowBookingDetails(null)} className="text-gray-400 hover:text-gray-500">
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-6">
                    {calendarEvents.filter(event => event.id === showBookingDetails).map(event => <div key={event.id} className="space-y-4">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">
                              {event.title}
                            </h4>
                            <p className="text-gray-600">{event.venue}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h5 className="font-medium text-gray-700 mb-2">
                                Event Details
                              </h5>
                              <div className="space-y-2">
                                <div className="flex items-start">
                                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {event.date.toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <ClockIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {event.startTime} - {event.endTime}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <UsersIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      Client: {event.client}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <TagIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium">
                                      <span className={`px-2 py-1 rounded-full text-xs ${event.status === 'confirmed' ? 'bg-green-100 text-green-800' : event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h5 className="font-medium text-gray-700 mb-2">
                                Venue Information
                              </h5>
                              <div className="space-y-2">
                                <div className="flex items-start">
                                  <BuildingIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {event.venue}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-start">
                                  <DollarSignIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      $1,200.00
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Deposit: $400.00 (paid)
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium text-gray-700 mb-2">
                              Special Requirements
                            </h5>
                            <p className="text-sm text-gray-600">
                              Client has requested special AV setup and catering
                              for 50 people. Vegetarian options needed. Early
                              access requested for decorations (2 hours before
                              event).
                            </p>
                          </div>
                          <div className="flex justify-end space-x-3 pt-4">
                            {event.status === 'pending' && <>
                                <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                  Decline
                                </button>
                                <button className="px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700">
                                  Approve
                                </button>
                              </>}
                            {event.status === 'confirmed' && <>
                                <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                  Cancel Booking
                                </button>
                                <button className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700">
                                  Edit Booking
                                </button>
                              </>}
                          </div>
                        </div>)}
                  </div>
                </div>
              </div>}
            {/* Upcoming Bookings */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Upcoming Bookings
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {calendarEvents.filter(event => event.date >= new Date()).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 3).map(event => <div key={event.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="bg-gray-100 rounded-md p-3 text-center min-w-[60px]">
                            <div className="text-xs font-medium text-gray-500">
                              {event.date.toLocaleDateString('en-US', {
                        month: 'short'
                      })}
                            </div>
                            <div className="text-xl font-bold text-gray-900">
                              {event.date.getDate()}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {event.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {event.venue}
                            </p>
                            <div className="mt-1 flex items-center">
                              <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500">
                                {event.startTime} - {event.endTime}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${event.status === 'confirmed' ? 'bg-green-100 text-green-800' : event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button onClick={() => handleViewBookingDetails(event.id)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                          View Details
                        </button>
                      </div>
                    </div>)}
                {calendarEvents.filter(event => event.date >= new Date()).length === 0 && <div className="text-center py-8">
                    <CalendarIcon className="mx-auto h-10 w-10 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No upcoming bookings
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You don't have any bookings scheduled.
                    </p>
                  </div>}
              </div>
            </div>
          </div>}
        {activeTab === 'analytics' && <div className="space-y-6">
            {/* Analytics Controls */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center flex-wrap gap-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Performance Analytics
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="inline-flex rounded-md shadow-sm">
                    <button onClick={() => setAnalyticsTimeframe('month')} className={`px-4 py-2 text-sm font-medium rounded-l-md ${analyticsTimeframe === 'month' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}>
                      Month
                    </button>
                    <button onClick={() => setAnalyticsTimeframe('quarter')} className={`px-4 py-2 text-sm font-medium ${analyticsTimeframe === 'quarter' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-gray-300'}`}>
                      Quarter
                    </button>
                    <button onClick={() => setAnalyticsTimeframe('year')} className={`px-4 py-2 text-sm font-medium rounded-r-md ${analyticsTimeframe === 'year' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}>
                      Year
                    </button>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-md">
                    <RefreshCwIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bookings Card */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Bookings
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {analyticsData.bookings.growth}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.bookings.thisMonth}
                    </p>
                    <p className="text-sm text-gray-500">
                      vs {analyticsData.bookings.lastMonth} last{' '}
                      {analyticsTimeframe}
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="relative h-2 bg-gray-200 rounded-full">
                      <div className="absolute top-0 left-0 h-2 bg-green-500 rounded-full" style={{
                    width: '75%'
                  }}></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Revenue Card */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Revenue
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {analyticsData.revenue.growth}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.revenue.thisMonth}
                    </p>
                    <p className="text-sm text-gray-500">
                      vs {analyticsData.revenue.lastMonth} last{' '}
                      {analyticsTimeframe}
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="relative h-2 bg-gray-200 rounded-full">
                      <div className="absolute top-0 left-0 h-2 bg-green-500 rounded-full" style={{
                    width: '65%'
                  }}></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Inquiries Card */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Inquiries
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {analyticsData.inquiries.growth}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.inquiries.thisMonth}
                    </p>
                    <p className="text-sm text-gray-500">
                      vs {analyticsData.inquiries.lastMonth} last{' '}
                      {analyticsTimeframe}
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="relative h-2 bg-gray-200 rounded-full">
                      <div className="absolute top-0 left-0 h-2 bg-red-500 rounded-full" style={{
                    width: '45%'
                  }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performing Venues */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Top Performing Venues
                  </h3>
                </div>
                <div className="px-4 py-3 sm:px-6">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Venue
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bookings
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {analyticsData.topVenues.map((venue, index) => <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {venue.name}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                              {venue.bookings}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                              {venue.revenue}
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* Popular Booking Days */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Popular Booking Days
                  </h3>
                </div>
                <div className="px-4 py-3 sm:px-6">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Day
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bookings
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Percentage
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {analyticsData.popularDays.map((day, index) => <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {day.day}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                              {day.bookings}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                              {day.percentage}
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>}
        {activeTab === 'settings' && <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Sidebar */}
            <div className="lg:col-span-1 bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">Settings</h3>
              </div>
              <nav className="py-4">
                <div className="px-4 mb-4 lg:hidden">
                  <select className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" value={settingsSection} onChange={e => setSettingsSection(e.target.value)}>
                    <option value="general">General Settings</option>
                    <option value="notifications">Notifications</option>
                    <option value="payments">Payment Settings</option>
                    <option value="team">Team Members</option>
                    <option value="privacy">Privacy & Security</option>
                    <option value="integrations">Integrations</option>
                  </select>
                </div>
                <div className="hidden lg:block">
                  <ul className="space-y-1">
                    {[{
                  id: 'general',
                  label: 'General Settings',
                  icon: <SettingsIcon className="h-5 w-5" />
                }, {
                  id: 'notifications',
                  label: 'Notifications',
                  icon: <BellIcon className="h-5 w-5" />
                }, {
                  id: 'payments',
                  label: 'Payment Settings',
                  icon: <DollarSignIcon className="h-5 w-5" />
                }, {
                  id: 'team',
                  label: 'Team Members',
                  icon: <UsersIcon className="h-5 w-5" />
                }, {
                  id: 'privacy',
                  label: 'Privacy & Security',
                  icon: <ShieldIcon className="h-5 w-5" />
                }, {
                  id: 'integrations',
                  label: 'Integrations',
                  icon: <GlobeIcon className="h-5 w-5" />
                }].map(section => <li key={section.id}>
                        <button onClick={() => setSettingsSection(section.id)} className={`w-full flex items-center px-4 py-2 text-sm font-medium ${settingsSection === section.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                          <span className={`mr-3 ${settingsSection === section.id ? 'text-indigo-500' : 'text-gray-500'}`}>
                            {section.icon}
                          </span>
                          {section.label}
                        </button>
                      </li>)}
                  </ul>
                </div>
              </nav>
            </div>
            {/* Settings Content */}
            <div className="lg:col-span-3 bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {settingsSection === 'general' && 'General Settings'}
                  {settingsSection === 'notifications' && 'Notification Preferences'}
                  {settingsSection === 'payments' && 'Payment Settings'}
                  {settingsSection === 'team' && 'Team Members'}
                  {settingsSection === 'privacy' && 'Privacy & Security'}
                  {settingsSection === 'integrations' && 'Integrations'}
                </h3>
                <button onClick={() => handleSaveSettings(settingsSection)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <SaveIcon className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
              <div className="p-6">
                {settingsSection === 'general' && <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Venue Information
                      </h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="business-name" className="block text-sm font-medium text-gray-700">
                            Business Name
                          </label>
                          <div className="mt-1">
                            <input type="text" name="business-name" id="business-name" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="Clearwater Venues LLC" />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
                            Contact Email
                          </label>
                          <div className="mt-1">
                            <input type="email" name="contact-email" id="contact-email" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="contact@clearwatervenues.com" />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <div className="mt-1">
                            <input type="text" name="phone" id="phone" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="(727) 555-1234" />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                            Website
                          </label>
                          <div className="mt-1">
                            <input type="text" name="website" id="website" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="https://clearwatervenues.com" />
                          </div>
                        </div>
                        <div className="sm:col-span-6">
                          <label htmlFor="business-description" className="block text-sm font-medium text-gray-700">
                            Business Description
                          </label>
                          <div className="mt-1">
                            <textarea id="business-description" name="business-description" rows={3} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="We offer premium event venues in the Clearwater area for weddings, corporate events, and special occasions." />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Business Address
                      </h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                          <label htmlFor="street-address" className="block text-sm font-medium text-gray-700">
                            Street Address
                          </label>
                          <div className="mt-1">
                            <input type="text" name="street-address" id="street-address" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="123 Main Street" />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                          </label>
                          <div className="mt-1">
                            <input type="text" name="city" id="city" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="Clearwater" />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                            State
                          </label>
                          <div className="mt-1">
                            <input type="text" name="state" id="state" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="FL" />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                            ZIP / Postal Code
                          </label>
                          <div className="mt-1">
                            <input type="text" name="zip" id="zip" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="33755" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Business Logo
                      </h4>
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="h-8 w-8" />
                          </div>
                        </div>
                        <div>
                          <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Upload New Logo
                          </button>
                          <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG, GIF up to 2MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>}
                {settingsSection === 'notifications' && <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Email Notifications
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="booking-requests" name="booking-requests" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="booking-requests" className="font-medium text-gray-700">
                              New Booking Requests
                            </label>
                            <p className="text-gray-500">
                              Receive notifications when new booking requests
                              are submitted.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="booking-confirmations" name="booking-confirmations" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="booking-confirmations" className="font-medium text-gray-700">
                              Booking Confirmations
                            </label>
                            <p className="text-gray-500">
                              Receive notifications when bookings are confirmed.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="booking-cancellations" name="booking-cancellations" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="booking-cancellations" className="font-medium text-gray-700">
                              Booking Cancellations
                            </label>
                            <p className="text-gray-500">
                              Receive notifications when bookings are canceled.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="payment-notifications" name="payment-notifications" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="payment-notifications" className="font-medium text-gray-700">
                              Payment Notifications
                            </label>
                            <p className="text-gray-500">
                              Receive notifications for payments and refunds.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="system-updates" name="system-updates" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="system-updates" className="font-medium text-gray-700">
                              System Updates
                            </label>
                            <p className="text-gray-500">
                              Receive notifications about system updates and new
                              features.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        SMS Notifications
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="sms-booking-requests" name="sms-booking-requests" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="sms-booking-requests" className="font-medium text-gray-700">
                              New Booking Requests
                            </label>
                            <p className="text-gray-500">
                              Receive SMS notifications for new booking
                              requests.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="sms-urgent-notifications" name="sms-urgent-notifications" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="sms-urgent-notifications" className="font-medium text-gray-700">
                              Urgent Notifications
                            </label>
                            <p className="text-gray-500">
                              Receive SMS for urgent matters (cancellations,
                              etc.).
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Notification Recipients
                      </h4>
                      <div className="mt-1">
                        <input type="email" name="notification-email" id="notification-email" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Enter additional email addresses (comma separated)" />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Add additional email addresses to receive notifications.
                      </p>
                    </div>
                  </div>}
                {settingsSection === 'payments' && <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Payment Methods
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-12 bg-blue-100 rounded flex items-center justify-center text-blue-800 font-bold text-xs">
                              VISA
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                Visa ending in 4242
                              </p>
                              <p className="text-xs text-gray-500">
                                Expires 12/2025
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-sm text-indigo-600 hover:text-indigo-800">
                              Edit
                            </button>
                            <button className="text-sm text-red-600 hover:text-red-800">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Payment Method
                      </button>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Payout Information
                      </h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="bank-name" className="block text-sm font-medium text-gray-700">
                            Bank Name
                          </label>
                          <div className="mt-1">
                            <input type="text" name="bank-name" id="bank-name" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="First National Bank" />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="account-type" className="block text-sm font-medium text-gray-700">
                            Account Type
                          </label>
                          <div className="mt-1">
                            <select id="account-type" name="account-type" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                              <option>Checking</option>
                              <option>Savings</option>
                              <option>Business Checking</option>
                            </select>
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="account-number" className="block text-sm font-medium text-gray-700">
                            Account Number
                          </label>
                          <div className="mt-1">
                            <input type="text" name="account-number" id="account-number" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="••••••7890" />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="routing-number" className="block text-sm font-medium text-gray-700">
                            Routing Number
                          </label>
                          <div className="mt-1">
                            <input type="text" name="routing-number" id="routing-number" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="••••1234" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Tax Information
                      </h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="tax-id-type" className="block text-sm font-medium text-gray-700">
                            Tax ID Type
                          </label>
                          <div className="mt-1">
                            <select id="tax-id-type" name="tax-id-type" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                              <option>EIN</option>
                              <option>SSN</option>
                            </select>
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="tax-id" className="block text-sm font-medium text-gray-700">
                            Tax ID Number
                          </label>
                          <div className="mt-1">
                            <input type="text" name="tax-id" id="tax-id" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="••-•••5678" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <FileTextIcon className="h-4 w-4 mr-2" />
                          Download Tax Documents
                        </button>
                      </div>
                    </div>
                  </div>}
                {settingsSection === 'team' && <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Team Members
                      </h4>
                      <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    JS
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      John Smith
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  Owner
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  john@clearwatervenues.com
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                  Edit
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    SD
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      Sarah Davis
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  Manager
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  sarah@clearwatervenues.com
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                  Edit
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  Remove
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4">
                        <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Invite Team Member
                        </button>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Role Permissions
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-700">
                              Owner
                            </h5>
                            <p className="text-xs text-gray-500 mt-1">
                              Full access to all features and settings
                            </p>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-700">
                              Manager
                            </h5>
                            <p className="text-xs text-gray-500 mt-1">
                              Can manage venues, bookings, and view reports
                            </p>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center">
                                <input id="manager-bookings" name="manager-bookings" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                                <label htmlFor="manager-bookings" className="ml-2 text-xs text-gray-700">
                                  Manage bookings
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input id="manager-venues" name="manager-venues" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                                <label htmlFor="manager-venues" className="ml-2 text-xs text-gray-700">
                                  Manage venues
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input id="manager-reports" name="manager-reports" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                                <label htmlFor="manager-reports" className="ml-2 text-xs text-gray-700">
                                  View reports
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input id="manager-settings" name="manager-settings" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                <label htmlFor="manager-settings" className="ml-2 text-xs text-gray-700">
                                  Edit settings
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>}
                {settingsSection === 'privacy' && <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Security Settings
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                            Current Password
                          </label>
                          <div className="mt-1">
                            <input type="password" name="current-password" id="current-password" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="••••••••" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                            New Password
                          </label>
                          <div className="mt-1">
                            <input type="password" name="new-password" id="new-password" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="••••••••" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                          </label>
                          <div className="mt-1">
                            <input type="password" name="confirm-password" id="confirm-password" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="••••••••" />
                          </div>
                        </div>
                        <div className="pt-2">
                          <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Update Password
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Two-Factor Authentication
                      </h4>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="enable-2fa" name="enable-2fa" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="enable-2fa" className="font-medium text-gray-700">
                            Enable Two-Factor Authentication
                          </label>
                          <p className="text-gray-500">
                            Add an extra layer of security to your account.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Privacy Settings
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="public-profile" name="public-profile" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="public-profile" className="font-medium text-gray-700">
                              Public Business Profile
                            </label>
                            <p className="text-gray-500">
                              Make your business profile visible to the public.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="share-analytics" name="share-analytics" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="share-analytics" className="font-medium text-gray-700">
                              Share Analytics Data
                            </label>
                            <p className="text-gray-500">
                              Allow anonymous usage data to improve our
                              services.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Session Management
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Active Sessions
                        </h5>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Chrome on Windows
                              </p>
                              <p className="text-xs text-gray-500">
                                Last active: Just now
                              </p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Current
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Safari on iPhone
                              </p>
                              <p className="text-xs text-gray-500">
                                Last active: 2 days ago
                              </p>
                            </div>
                            <button className="text-xs text-red-600 hover:text-red-800">
                              Log Out
                            </button>
                          </div>
                        </div>
                        <div className="mt-4">
                          <button type="button" className="text-sm text-red-600 hover:text-red-800 font-medium">
                            Log Out of All Devices
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>}
                {settingsSection === 'integrations' && <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Connected Services
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                              <GlobeIcon className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                              <h5 className="text-sm font-medium text-gray-900">
                                Google Calendar
                              </h5>
                              <p className="text-xs text-gray-500">
                                Sync your bookings with Google Calendar
                              </p>
                            </div>
                          </div>
                          <div>
                            <button type="button" className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700">
                              Connected
                            </button>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                              <DollarSignIcon className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                              <h5 className="text-sm font-medium text-gray-900">
                                Stripe Payments
                              </h5>
                              <p className="text-xs text-gray-500">
                                Process payments and manage subscriptions
                              </p>
                            </div>
                          </div>
                          <div>
                            <button type="button" className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                              Connect
                            </button>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                              <MessageCircleIcon className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                              <h5 className="text-sm font-medium text-gray-900">
                                Slack Notifications
                              </h5>
                              <p className="text-xs text-gray-500">
                                Get booking notifications in your Slack
                                workspace
                              </p>
                            </div>
                          </div>
                          <div>
                            <button type="button" className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                              Connect
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        API Access
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-sm font-medium text-gray-700">
                            API Keys
                          </h5>
                          <button type="button" className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                            <PlusIcon className="h-3 w-3 mr-1" />
                            Generate New Key
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Production API Key
                              </p>
                              <p className="text-xs text-gray-500">
                                Created: Jan 15, 2024
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="text-xs text-gray-600 hover:text-gray-800">
                                Show
                              </button>
                              <button className="text-xs text-red-600 hover:text-red-800">
                                Revoke
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500">
                          <p>
                            Use API keys to access your venue data
                            programmatically.
                          </p>
                          <p className="mt-1">
                            <a href="#" className="text-indigo-600 hover:text-indigo-800">
                              View API documentation
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Webhooks
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-sm font-medium text-gray-700">
                            Webhook Endpoints
                          </h5>
                          <button type="button" className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                            <PlusIcon className="h-3 w-3 mr-1" />
                            Add Endpoint
                          </button>
                        </div>
                        <div className="text-center py-4 text-sm text-gray-500">
                          <p>No webhook endpoints configured.</p>
                          <p className="mt-1">
                            Add an endpoint to receive real-time updates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>}
              </div>
            </div>
          </div>}
      </div>
    </div>;
};