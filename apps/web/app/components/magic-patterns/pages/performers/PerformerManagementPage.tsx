import React, { useState } from 'react';
import { ArrowLeftIcon, HomeIcon, ChevronRightIcon, PlusIcon, CalendarIcon, MessageCircleIcon, BarChartIcon, SettingsIcon, ClockIcon, CheckCircleIcon, XCircleIcon, EditIcon, TrashIcon, EyeIcon, BellIcon, UsersIcon, DollarSignIcon, ImageIcon, TagIcon, GlobeIcon, ChevronLeftIcon, ChevronDownIcon, SaveIcon, RefreshCwIcon, ShieldIcon, HelpCircleIcon, FileTextIcon, MusicIcon, MicIcon, StarIcon, HeadphonesIcon, MapPinIcon, VideoIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
// Mock data for performer management
const myPerformers = [{
  id: 'performer-1',
  name: 'The Jazz Quartet',
  performerType: 'Band',
  genre: 'Jazz',
  status: 'active',
  image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  totalBookings: 32,
  upcomingBookings: 4,
  hourlyRate: '$150',
  location: 'Clearwater, FL'
}, {
  id: 'performer-2',
  name: 'Sarah Davis',
  performerType: 'Solo Artist',
  genre: 'Folk/Acoustic',
  status: 'active',
  image: 'https://images.unsplash.com/photo-1516575334481-f85287c2c82d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  lastUpdated: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  totalBookings: 24,
  upcomingBookings: 2,
  hourlyRate: '$100',
  location: 'St. Petersburg, FL'
}];
// Mock data for booking requests
const bookingRequests = [{
  id: 'request-1',
  venueName: 'The Grand Ballroom',
  eventName: 'Corporate Gala',
  date: '2024-07-15',
  time: '19:00 - 22:00',
  fee: '$600',
  status: 'pending',
  clientName: 'Tech Innovations Inc.',
  message: 'Looking for a jazz band to play at our annual corporate gala. Would need a 3-hour set with breaks.',
  received: '2024-06-01T14:30:00Z'
}, {
  id: 'request-2',
  venueName: 'Waterfront Pavilion',
  eventName: 'Wedding Reception',
  date: '2024-08-22',
  time: '16:00 - 20:00',
  fee: '$800',
  status: 'pending',
  clientName: 'Emma & Jason',
  message: 'We love your music and would be thrilled if you could perform at our wedding reception. Looking for a mix of covers and originals.',
  received: '2024-06-03T09:15:00Z'
}];
// Mock data for calendar events
const calendarEvents = [{
  id: 'event-1',
  title: 'Corporate Gala',
  venue: 'The Grand Ballroom',
  date: new Date(2024, 5, 15),
  startTime: '19:00',
  endTime: '22:00',
  client: 'Tech Innovations Inc.',
  status: 'confirmed',
  color: 'bg-green-100 text-green-800 border-green-200',
  fee: '$600'
}, {
  id: 'event-2',
  title: 'Wedding Reception',
  venue: 'Waterfront Pavilion',
  date: new Date(2024, 5, 22),
  startTime: '16:00',
  endTime: '20:00',
  client: 'Emma & Jason',
  status: 'confirmed',
  color: 'bg-green-100 text-green-800 border-green-200',
  fee: '$800'
}, {
  id: 'event-3',
  title: 'Summer Concert Series',
  venue: 'Central Park Amphitheater',
  date: new Date(2024, 5, 10),
  startTime: '18:00',
  endTime: '20:00',
  client: 'City of Clearwater',
  status: 'pending',
  color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  fee: '$450'
}, {
  id: 'event-4',
  title: 'Jazz Club Night',
  venue: 'Blue Note Lounge',
  date: new Date(2024, 5, 5),
  startTime: '21:00',
  endTime: '23:30',
  client: 'Blue Note Lounge',
  status: 'confirmed',
  color: 'bg-green-100 text-green-800 border-green-200',
  fee: '$350'
}, {
  id: 'event-5',
  title: 'Charity Fundraiser',
  venue: 'The Historic Theatre',
  date: new Date(2024, 5, 28),
  startTime: '19:00',
  endTime: '21:00',
  client: 'Hope Foundation',
  status: 'confirmed',
  color: 'bg-green-100 text-green-800 border-green-200',
  fee: '$500'
}];
// Mock data for analytics
const analyticsData = {
  bookings: {
    total: 32,
    thisMonth: 6,
    lastMonth: 4,
    growth: '+50%'
  },
  revenue: {
    total: '$15,800',
    thisMonth: '$3,200',
    lastMonth: '$2,400',
    growth: '+33%'
  },
  inquiries: {
    total: 48,
    thisMonth: 12,
    lastMonth: 10,
    growth: '+20%'
  },
  topVenues: [{
    name: 'The Grand Ballroom',
    bookings: 8,
    revenue: '$4,800'
  }, {
    name: 'Waterfront Pavilion',
    bookings: 6,
    revenue: '$4,200'
  }, {
    name: 'Blue Note Lounge',
    bookings: 5,
    revenue: '$1,750'
  }],
  popularGenres: [{
    genre: 'Jazz Standards',
    bookings: 14,
    percentage: '44%'
  }, {
    genre: 'Swing',
    bookings: 10,
    percentage: '31%'
  }, {
    genre: 'Bossa Nova',
    bookings: 8,
    percentage: '25%'
  }]
};
export const PerformerManagementPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('performers');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showBookingDetails, setShowBookingDetails] = useState<string | null>(null);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('month');
  const [settingsSection, setSettingsSection] = useState('general');
  const handleBackToPerformers = () => {
    navigate('/performers');
  };
  const handleAddPerformer = () => {
    // In a real app, this would navigate to a form to add a new performer profile
    alert('Add new performer profile');
  };
  const handleEditPerformer = (performerId: string) => {
    // In a real app, this would navigate to an edit page
    alert(`Edit performer ${performerId}`);
  };
  const handleViewPerformer = (performerId: string) => {
    navigate(`/performers/${performerId}`);
  };
  const handleDeletePerformer = (performerId: string) => {
    // In a real app, this would show a confirmation dialog
    alert(`Delete performer ${performerId}`);
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
            <button onClick={() => navigate('/performers')} className="hover:text-gray-700">
              Performers
            </button>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium">
              Performer Management
            </span>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button onClick={handleBackToPerformers} className="mb-2 flex items-center text-indigo-600 hover:text-indigo-800">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Performers
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Performer Management
            </h1>
            <p className="text-gray-600">
              Manage your performer profiles and booking requests
            </p>
          </div>
          <button onClick={handleAddPerformer} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Performer
          </button>
        </div>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <MusicIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Performers
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {myPerformers.length}
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
                        {myPerformers.reduce((sum, performer) => sum + performer.upcomingBookings, 0)}
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
                  <DollarSignIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Earnings
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {analyticsData.revenue.total}
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
            <button onClick={() => setActiveTab('performers')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'performers' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <MusicIcon className="h-5 w-5 inline mr-2" />
              My Performers
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
              Performance Calendar
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
        {activeTab === 'performers' && <div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">
                  My Performers
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performer
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
                    {myPerformers.map(performer => <tr key={performer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img className="h-10 w-10 rounded-md object-cover" src={performer.image} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {performer.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {performer.performerType} • {performer.genre}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${performer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {performer.status === 'active' ? 'Active' : 'Pending Review'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {performer.upcomingBookings} upcoming
                          </div>
                          <div className="text-sm text-gray-500">
                            {performer.totalBookings} total
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(performer.lastUpdated).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleViewPerformer(performer.id)} className="text-indigo-600 hover:text-indigo-900 mr-3" title="View performer profile">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleEditPerformer(performer.id)} className="text-blue-600 hover:text-blue-900 mr-3" title="Edit performer">
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeletePerformer(performer.id)} className="text-red-600 hover:text-red-900" title="Delete performer">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
              {myPerformers.length === 0 && <div className="text-center py-12">
                  <MusicIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No performers
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding a new performer profile.
                  </p>
                  <div className="mt-6">
                    <button onClick={handleAddPerformer} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add New Performer
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
                        Fee
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.fee}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleViewBookingRequest(request.id)} className="text-indigo-600 hover:text-indigo-900 mr-3" title="View request">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleApproveRequest(request.id)} className="text-green-600 hover:text-green-900 mr-3" title="Accept request">
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
                    your performances.
                  </p>
                </div>}
            </div>
          </div>}
        {activeTab === 'calendar' && <div className="space-y-6">
            {/* Calendar View */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Performance Calendar
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
                      Performance Details
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
                                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
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
                                      {event.fee}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Deposit:{' '}
                                      {parseInt(event.fee.substring(1)) * 0.3}{' '}
                                      (paid)
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium text-gray-700 mb-2">
                              Performance Requirements
                            </h5>
                            <p className="text-sm text-gray-600">
                              Client has requested a 2-hour set with a 15-minute
                              break. They've requested a mix of jazz standards
                              and some contemporary covers. PA system will be
                              provided by the venue.
                            </p>
                          </div>
                          <div className="flex justify-end space-x-3 pt-4">
                            {event.status === 'pending' && <>
                                <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                  Decline
                                </button>
                                <button className="px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700">
                                  Confirm
                                </button>
                              </>}
                            {event.status === 'confirmed' && <>
                                <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                                  Cancel Performance
                                </button>
                                <button className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700">
                                  Edit Details
                                </button>
                              </>}
                          </div>
                        </div>)}
                  </div>
                </div>
              </div>}
            {/* Upcoming Performances */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Upcoming Performances
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
                        <div className="flex flex-col items-end">
                          <span className={`px-2 py-1 rounded-full text-xs ${event.status === 'confirmed' ? 'bg-green-100 text-green-800' : event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </span>
                          <span className="mt-1 text-sm font-medium text-gray-900">
                            {event.fee}
                          </span>
                        </div>
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
                      No upcoming performances
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You don't have any performances scheduled.
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
                      Performances
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
                      <div className="absolute top-0 left-0 h-2 bg-green-500 rounded-full" style={{
                    width: '55%'
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
                    Top Venues
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
                            Performances
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
              {/* Popular Music Genres */}
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Popular Music Genres
                  </h3>
                </div>
                <div className="px-4 py-3 sm:px-6">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Genre
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Performances
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Percentage
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {analyticsData.popularGenres.map((genre, index) => <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {genre.genre}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                              {genre.bookings}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                              {genre.percentage}
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
                    <option value="profile">Performer Profile</option>
                    <option value="payments">Payment Settings</option>
                    <option value="availability">Availability</option>
                    <option value="privacy">Privacy & Security</option>
                    <option value="notifications">Notifications</option>
                  </select>
                </div>
                <div className="hidden lg:block">
                  <ul className="space-y-1">
                    {[{
                  id: 'general',
                  label: 'General Settings',
                  icon: <SettingsIcon className="h-5 w-5" />
                }, {
                  id: 'profile',
                  label: 'Performer Profile',
                  icon: <MusicIcon className="h-5 w-5" />
                }, {
                  id: 'payments',
                  label: 'Payment Settings',
                  icon: <DollarSignIcon className="h-5 w-5" />
                }, {
                  id: 'availability',
                  label: 'Availability',
                  icon: <CalendarIcon className="h-5 w-5" />
                }, {
                  id: 'privacy',
                  label: 'Privacy & Security',
                  icon: <ShieldIcon className="h-5 w-5" />
                }, {
                  id: 'notifications',
                  label: 'Notifications',
                  icon: <BellIcon className="h-5 w-5" />
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
                  {settingsSection === 'profile' && 'Performer Profile'}
                  {settingsSection === 'payments' && 'Payment Settings'}
                  {settingsSection === 'availability' && 'Availability'}
                  {settingsSection === 'privacy' && 'Privacy & Security'}
                  {settingsSection === 'notifications' && 'Notification Preferences'}
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
                        Account Information
                      </h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <div className="mt-1">
                            <input type="text" name="full-name" id="full-name" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="Alex Johnson" />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
                            Contact Email
                          </label>
                          <div className="mt-1">
                            <input type="email" name="contact-email" id="contact-email" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="alex@jazzquartet.com" />
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
                            <input type="text" name="website" id="website" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="https://jazzquartet.com" />
                          </div>
                        </div>
                        <div className="sm:col-span-6">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                          </label>
                          <div className="mt-1">
                            <input type="text" name="address" id="address" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="123 Music Street, Clearwater, FL 33755" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Social Media Links
                      </h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                            Instagram
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                              instagram.com/
                            </span>
                            <input type="text" name="instagram" id="instagram" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300" defaultValue="jazzquartet" />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                            Facebook
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                              facebook.com/
                            </span>
                            <input type="text" name="facebook" id="facebook" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300" defaultValue="thejazzquartet" />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                            YouTube
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                              youtube.com/
                            </span>
                            <input type="text" name="youtube" id="youtube" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300" defaultValue="@jazzquartet" />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="spotify" className="block text-sm font-medium text-gray-700">
                            Spotify
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                              spotify.com/artist/
                            </span>
                            <input type="text" name="spotify" id="spotify" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300" defaultValue="3xY2szE1UmKWZR4u" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>}
                {settingsSection === 'profile' && <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Performer Profile
                      </h4>
                      <div className="mb-6">
                        <label htmlFor="profile-photo" className="block text-sm font-medium text-gray-700">
                          Profile Photo
                        </label>
                        <div className="mt-2 flex items-center space-x-5">
                          <div className="flex-shrink-0">
                            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                              <img src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Profile" className="h-full w-full object-cover" />
                            </div>
                          </div>
                          <button type="button" className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Change
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                          <label htmlFor="performer-name" className="block text-sm font-medium text-gray-700">
                            Performer/Band Name
                          </label>
                          <div className="mt-1">
                            <input type="text" name="performer-name" id="performer-name" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="The Jazz Quartet" />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="performer-type" className="block text-sm font-medium text-gray-700">
                            Performer Type
                          </label>
                          <div className="mt-1">
                            <select id="performer-type" name="performer-type" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="band">
                              <option value="band">Band</option>
                              <option value="solo">Solo Artist</option>
                              <option value="duo">Duo</option>
                              <option value="dj">DJ</option>
                              <option value="orchestra">Orchestra</option>
                              <option value="ensemble">Ensemble</option>
                            </select>
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                            Primary Genre
                          </label>
                          <div className="mt-1">
                            <select id="genre" name="genre" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="jazz">
                              <option value="jazz">Jazz</option>
                              <option value="rock">Rock</option>
                              <option value="pop">Pop</option>
                              <option value="classical">Classical</option>
                              <option value="folk">Folk/Acoustic</option>
                              <option value="electronic">Electronic</option>
                              <option value="country">Country</option>
                              <option value="rnb">R&B/Soul</option>
                              <option value="hiphop">Hip Hop</option>
                              <option value="latin">Latin</option>
                              <option value="world">World</option>
                            </select>
                          </div>
                        </div>
                        <div className="sm:col-span-6">
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                            Bio/Description
                          </label>
                          <div className="mt-1">
                            <textarea id="bio" name="bio" rows={5} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="The Jazz Quartet is a versatile ensemble specializing in classic jazz standards, swing, and bossa nova. With over 10 years of experience performing at weddings, corporate events, and jazz clubs throughout Florida, our group brings sophisticated entertainment to any occasion." />
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Brief description of your music, style, and
                            experience.
                          </p>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="years-active" className="block text-sm font-medium text-gray-700">
                            Years Active
                          </label>
                          <div className="mt-1">
                            <input type="number" name="years-active" id="years-active" min="0" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="10" />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="group-size" className="block text-sm font-medium text-gray-700">
                            Group Size
                          </label>
                          <div className="mt-1">
                            <input type="number" name="group-size" id="group-size" min="1" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="4" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Music Samples
                      </h4>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-md p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600">
                                <MusicIcon className="h-6 w-6" />
                              </div>
                              <div className="ml-4">
                                <h5 className="text-sm font-medium text-gray-900">
                                  Autumn Leaves.mp3
                                </h5>
                                <p className="text-xs text-gray-500">
                                  3:42 • 4.8MB
                                </p>
                              </div>
                            </div>
                            <button className="text-sm text-red-600 hover:text-red-800">
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-md p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600">
                                <MusicIcon className="h-6 w-6" />
                              </div>
                              <div className="ml-4">
                                <h5 className="text-sm font-medium text-gray-900">
                                  Take Five.mp3
                                </h5>
                                <p className="text-xs text-gray-500">
                                  5:24 • 7.2MB
                                </p>
                              </div>
                            </div>
                            <button className="text-sm text-red-600 hover:text-red-800">
                              Remove
                            </button>
                          </div>
                        </div>
                        <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add Music Sample
                        </button>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Performance Photos
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        <div className="relative aspect-w-1 aspect-h-1">
                          <img src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Performance" className="object-cover rounded-md" />
                          <button className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700">
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="relative aspect-w-1 aspect-h-1">
                          <img src="https://images.unsplash.com/photo-1461784180009-21b7d50b07f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Performance" className="object-cover rounded-md" />
                          <button className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700">
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="relative aspect-w-1 aspect-h-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md">
                          <button className="text-gray-500 hover:text-gray-700">
                            <PlusIcon className="h-8 w-8" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Upload high-quality photos of your performances to
                        attract more bookings.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Video Links
                      </h4>
                      <div className="space-y-4 mb-4">
                        <div className="flex items-center space-x-3">
                          <input type="text" name="video-link-1" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="https://www.youtube.com/watch?v=example1" />
                          <button className="text-red-600 hover:text-red-800">
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input type="text" name="video-link-2" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="https://www.youtube.com/watch?v=example2" />
                          <button className="text-red-600 hover:text-red-800">
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Video Link
                      </button>
                    </div>
                  </div>}
                {settingsSection === 'payments' && <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Rates & Pricing
                      </h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="hourly-rate" className="block text-sm font-medium text-gray-700">
                            Standard Hourly Rate
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                $
                              </span>
                            </div>
                            <input type="text" name="hourly-rate" id="hourly-rate" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="0.00" defaultValue="150.00" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                USD
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="minimum-booking" className="block text-sm font-medium text-gray-700">
                            Minimum Booking Duration (hours)
                          </label>
                          <div className="mt-1">
                            <input type="number" name="minimum-booking" id="minimum-booking" min="1" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="2" />
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="travel-fee" className="block text-sm font-medium text-gray-700">
                            Travel Fee (per mile)
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                $
                              </span>
                            </div>
                            <input type="text" name="travel-fee" id="travel-fee" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="0.00" defaultValue="0.50" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                USD
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="travel-radius" className="block text-sm font-medium text-gray-700">
                            Maximum Travel Distance (miles)
                          </label>
                          <div className="mt-1">
                            <input type="number" name="travel-radius" id="travel-radius" min="0" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="50" />
                          </div>
                        </div>
                        <div className="sm:col-span-6">
                          <label htmlFor="deposit-policy" className="block text-sm font-medium text-gray-700">
                            Deposit Policy
                          </label>
                          <div className="mt-1">
                            <select id="deposit-policy" name="deposit-policy" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="30percent">
                              <option value="none">No deposit required</option>
                              <option value="flat100">$100 flat deposit</option>
                              <option value="flat200">$200 flat deposit</option>
                              <option value="30percent">
                                30% of total fee
                              </option>
                              <option value="50percent">
                                50% of total fee
                              </option>
                            </select>
                          </div>
                        </div>
                        <div className="sm:col-span-6">
                          <label htmlFor="cancellation-policy" className="block text-sm font-medium text-gray-700">
                            Cancellation Policy
                          </label>
                          <div className="mt-1">
                            <textarea id="cancellation-policy" name="cancellation-policy" rows={3} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="Cancellations made 30+ days before the event date will receive a full refund of the deposit. Cancellations made 14-29 days before will receive a 50% refund. Cancellations made less than 14 days before will not be refunded." />
                          </div>
                        </div>
                      </div>
                    </div>
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
                              <option>SSN</option>
                              <option>EIN</option>
                            </select>
                          </div>
                        </div>
                        <div className="sm:col-span-3">
                          <label htmlFor="tax-id" className="block text-sm font-medium text-gray-700">
                            Tax ID Number
                          </label>
                          <div className="mt-1">
                            <input type="text" name="tax-id" id="tax-id" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="•••-••-5678" />
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
                {settingsSection === 'availability' && <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Regular Availability
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Set your regular availability for bookings. This helps
                        clients know when you're typically available to perform.
                      </p>
                      <div className="space-y-4">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => <div key={day} className="flex items-center justify-between border-b border-gray-200 pb-4">
                            <div className="flex items-center">
                              <input id={`available-${day.toLowerCase()}`} name={`available-${day.toLowerCase()}`} type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" defaultChecked={['Friday', 'Saturday', 'Sunday'].includes(day)} />
                              <label htmlFor={`available-${day.toLowerCase()}`} className="ml-2 block text-sm font-medium text-gray-700">
                                {day}
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <select name={`start-time-${day.toLowerCase()}`} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="18:00" disabled={!['Friday', 'Saturday', 'Sunday'].includes(day)}>
                                {Array.from({
                          length: 24
                        }).map((_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          return <option key={`${hour}:00`} value={`${hour}:00`}>
                                      {hour}:00
                                    </option>;
                        })}
                              </select>
                              <span className="text-gray-500">to</span>
                              <select name={`end-time-${day.toLowerCase()}`} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="23:00" disabled={!['Friday', 'Saturday', 'Sunday'].includes(day)}>
                                {Array.from({
                          length: 24
                        }).map((_, i) => {
                          const hour = i.toString().padStart(2, '0');
                          return <option key={`${hour}:00`} value={`${hour}:00`}>
                                      {hour}:00
                                    </option>;
                        })}
                              </select>
                            </div>
                          </div>)}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Blocked Dates
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Add specific dates when you're not available for
                        bookings.
                      </p>
                      <div className="space-y-4 mb-4">
                        <div className="flex items-center space-x-3">
                          <input type="date" name="blocked-date-1" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="2024-07-04" />
                          <button className="text-red-600 hover:text-red-800">
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <input type="date" name="blocked-date-2" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" defaultValue="2024-07-15" />
                          <button className="text-red-600 hover:text-red-800">
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Blocked Date
                      </button>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">
                        Booking Preferences
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="auto-approve" name="auto-approve" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="auto-approve" className="font-medium text-gray-700">
                              Auto-approve bookings
                            </label>
                            <p className="text-gray-500">
                              Automatically approve booking requests that match
                              your availability.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="advance-notice" name="advance-notice" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="advance-notice" className="font-medium text-gray-700">
                              Require advance notice
                            </label>
                            <div className="mt-1 flex items-center">
                              <span className="mr-2">Minimum</span>
                              <select name="advance-notice-days" className="block w-24 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="7">
                                {[1, 2, 3, 5, 7, 14, 30].map(days => <option key={days} value={days}>
                                    {days}
                                  </option>)}
                              </select>
                              <span className="ml-2">
                                days notice for bookings
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="booking-buffer" name="booking-buffer" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="booking-buffer" className="font-medium text-gray-700">
                              Add buffer between bookings
                            </label>
                            <div className="mt-1 flex items-center">
                              <span className="mr-2">Require</span>
                              <select name="buffer-hours" className="block w-24 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="3">
                                {[1, 2, 3, 4, 6, 8, 12, 24].map(hours => <option key={hours} value={hours}>
                                    {hours}
                                  </option>)}
                              </select>
                              <span className="ml-2">
                                hours between performances
                              </span>
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
                              Public Performer Profile
                            </label>
                            <p className="text-gray-500">
                              Make your performer profile visible to the public.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="show-earnings" name="show-earnings" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="show-earnings" className="font-medium text-gray-700">
                              Display Rates Publicly
                            </label>
                            <p className="text-gray-500">
                              Show your performance rates on your public
                              profile.
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
                        Account Access
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Connected Devices
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
                            <input id="review-notifications" name="review-notifications" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="review-notifications" className="font-medium text-gray-700">
                              New Reviews
                            </label>
                            <p className="text-gray-500">
                              Receive notifications when you receive new
                              reviews.
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
                            <input id="sms-upcoming-performances" name="sms-upcoming-performances" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" defaultChecked />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="sms-upcoming-performances" className="font-medium text-gray-700">
                              Upcoming Performance Reminders
                            </label>
                            <p className="text-gray-500">
                              Receive SMS reminders for upcoming performances.
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
              </div>
            </div>
          </div>}
      </div>
    </div>;
};