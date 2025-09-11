import React, { useState, createElement } from 'react';
import { TicketIcon, CalendarIcon, MapPinIcon, ClockIcon, ShareIcon, DownloadIcon, ChevronRightIcon, StarIcon, ArrowRightIcon, UserIcon, XIcon, CheckIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
interface TicketsPageProps {
  tickets?: any[];
  user?: any;
}

export const TicketsPage = ({ tickets: propTickets, user }: TicketsPageProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [filter, setFilter] = useState('all');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [transferEmail, setTransferEmail] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [calendarSuccess, setCalendarSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  // Use real ticket data or fallback to mock data
  const tickets = propTickets ? {
    upcoming: propTickets.filter(t => t.status === 'active' && new Date(t.eventDate) > new Date()),
    past: propTickets.filter(t => t.status === 'active' && new Date(t.eventDate) <= new Date()),
    transferred: propTickets.filter(t => t.status === 'transferred')
  } : {
    upcoming: [{
      id: 'ticket-1',
      eventName: 'Clearwater Jazz Holiday',
      date: new Date(2024, 9, 15, 17, 0),
      venue: {
        name: 'Coachman Park',
        address: '301 Drew St, Clearwater, FL 33755'
      },
      ticketType: 'General Admission',
      quantity: 2,
      status: 'valid',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }, {
      id: 'ticket-2',
      eventName: 'Summer Sunset Concert Series',
      date: new Date(2024, 7, 20, 19, 30),
      venue: {
        name: 'Pier 60',
        address: '1 Causeway Blvd, Clearwater, FL 33767'
      },
      ticketType: 'VIP Access',
      quantity: 1,
      status: 'valid',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }, {
      id: 'ticket-3',
      eventName: 'Comedy Night at Capitol Theatre',
      date: new Date(2024, 7, 25, 20, 0),
      venue: {
        name: 'Capitol Theatre',
        address: '405 Cleveland St, Clearwater, FL 33755'
      },
      ticketType: 'Reserved Seating',
      quantity: 3,
      status: 'expires-soon',
      image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }],
    past: [{
      id: 'ticket-4',
      eventName: 'Ruth Eckerd Hall: Symphony Orchestra',
      date: new Date(2023, 8, 18, 19, 0),
      venue: {
        name: 'Ruth Eckerd Hall',
        address: '1111 McMullen Booth Rd, Clearwater, FL 33759'
      },
      ticketType: 'Orchestra Level',
      quantity: 2,
      status: 'used',
      image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }, {
      id: 'ticket-5',
      eventName: 'Downtown Art Walk & Wine Tasting',
      date: new Date(2023, 9, 1, 18, 0),
      venue: {
        name: 'Downtown Arts District',
        address: 'Cleveland St, Clearwater, FL 33755'
      },
      ticketType: 'General Admission',
      quantity: 4,
      status: 'used',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }],
    transferred: [{
      id: 'ticket-6',
      eventName: 'Local Craft Beer Festival',
      date: new Date(2024, 8, 10, 14, 0),
      venue: {
        name: 'Waterfront Park',
        address: '1 Beach Dr, Clearwater, FL 33767'
      },
      ticketType: 'General Admission',
      quantity: 1,
      status: 'transferred',
      recipient: {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com'
      },
      transferDate: new Date(2024, 7, 15),
      image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }]
  };
  // Format date for display
  const formatEventDate = date => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const formatEventTime = date => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  // Get status badge based on ticket status
  const getStatusBadge = status => {
    switch (status) {
      case 'valid':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Valid
          </span>;
      case 'not-yet-valid':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Not Yet Valid
          </span>;
      case 'expires-soon':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Expires Soon
          </span>;
      case 'used':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Used
          </span>;
      case 'transferred':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Transferred
          </span>;
      default:
        return null;
    }
  };
  // Filter tickets based on selected filter
  const getFilteredTickets = () => {
    const ticketsToFilter = tickets[activeTab];
    if (filter === 'all') {
      return ticketsToFilter;
    }
    if (filter === 'this-week') {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      return ticketsToFilter.filter(ticket => ticket.date >= today && ticket.date <= nextWeek);
    }
    if (filter === 'this-month') {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      return ticketsToFilter.filter(ticket => ticket.date >= today && ticket.date <= nextMonth);
    }
    return ticketsToFilter;
  };
  const handleViewTicket = ticketId => {
    navigate(`/tickets/${ticketId}`);
  };
  // Handle transfer ticket
  const handleTransferTicket = ticket => {
    setSelectedTicket(ticket);
    setTransferEmail('');
    setTransferSuccess(false);
    setShowTransferModal(true);
  };
  // Handle confirm transfer
  const handleConfirmTransfer = e => {
    e.preventDefault();
    // Simulate API call to transfer ticket
    setTimeout(() => {
      setTransferSuccess(true);
      setTimeout(() => {
        setShowTransferModal(false);
        // In a real app, we would update the ticket status and move it to transferred tab
      }, 2000);
    }, 1000);
  };
  // Handle add to calendar
  const handleAddToCalendar = ticket => {
    // Create calendar event data
    const event = {
      title: ticket.eventName,
      start: ticket.date,
      venue: ticket.venue.name,
      address: ticket.venue.address
    };
    // Create ICS file content
    const startDate = ticket.date.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(ticket.date.getTime() + 3 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '');
    const icsContent = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `SUMMARY:${event.title}`, `DTSTART:${startDate}`, `DTEND:${endDate}`, `LOCATION:${event.venue}, ${event.address}`, 'END:VEVENT', 'END:VCALENDAR'].join('\n');
    // Create download link
    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = typeof document !== "undefined" && document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Show success message
    setCalendarSuccess(true);
    setTimeout(() => setCalendarSuccess(false), 3000);
  };
  // Handle download ticket
  const handleDownloadTicket = ticket => {
    // In a real app, this would generate a PDF with ticket details
    // For this demo, we'll just simulate the download
    // Create a simple text representation of the ticket
    const ticketText = [`Event: ${ticket.eventName}`, `Date: ${formatEventDate(ticket.date)}`, `Time: ${formatEventTime(ticket.date)}`, `Venue: ${ticket.venue.name}`, `Address: ${ticket.venue.address}`, `Ticket Type: ${ticket.ticketType}`, `Quantity: ${ticket.quantity}`, `Ticket ID: ${ticket.id}`].join('\n');
    // Create download link
    const blob = new Blob([ticketText], {
      type: 'text/plain;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = typeof document !== "undefined" && document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ticket_${ticket.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Show success message
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Tickets</h1>
            <p className="text-gray-600">
              View and manage all your event tickets
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button onClick={() => navigate('/events')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <TicketIcon className="h-4 w-4 mr-2" />
              Find More Events
            </button>
          </div>
        </div>
        {/* Success Messages */}
        {calendarSuccess && <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center">
            <CheckIcon className="h-5 w-5 mr-2" />
            Event added to calendar!
          </div>}
        {downloadSuccess && <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center">
            <CheckIcon className="h-5 w-5 mr-2" />
            Ticket downloaded successfully!
          </div>}
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('upcoming')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'upcoming' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Upcoming
            </button>
            <button onClick={() => setActiveTab('past')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'past' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Past
            </button>
            <button onClick={() => setActiveTab('transferred')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'transferred' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Transferred
            </button>
          </nav>
        </div>
        {/* Filter Options (Only show for upcoming) */}
        {activeTab === 'upcoming' && <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
              All Upcoming
            </button>
            <button onClick={() => setFilter('this-week')} className={`px-3 py-1 rounded-full text-sm ${filter === 'this-week' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
              This Week
            </button>
            <button onClick={() => setFilter('this-month')} className={`px-3 py-1 rounded-full text-sm ${filter === 'this-month' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
              This Month
            </button>
          </div>}
        {/* Ticket List */}
        <div className="space-y-4">
          {getFilteredTickets().length > 0 ? getFilteredTickets().map(ticket => <div key={ticket.id} className={`bg-white rounded-lg shadow-sm overflow-hidden border ${activeTab === 'past' ? 'border-gray-200' : 'border-gray-200 hover:border-indigo-300'} transition-all duration-200`}>
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row">
                  {/* Event Image */}
                  <div className="sm:w-1/4 mb-4 sm:mb-0 sm:mr-6">
                    <div className="h-32 sm:h-full w-full rounded-md overflow-hidden bg-gray-200">
                      <img src={ticket.image} alt={ticket.eventName} className="h-full w-full object-cover" />
                    </div>
                  </div>
                  {/* Ticket Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-1">
                          {ticket.eventName}
                        </h2>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>{formatEventDate(ticket.date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <ClockIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>{formatEventTime(ticket.date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>{ticket.venue.name}</span>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
                        <div className="flex items-center mb-2">
                          {getStatusBadge(ticket.status)}
                          <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            {ticket.quantity}{' '}
                            {ticket.quantity > 1 ? 'tickets' : 'ticket'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">
                          {ticket.ticketType}
                        </p>
                        {/* Recipient info for transferred tickets */}
                        {activeTab === 'transferred' && ticket.recipient && <div className="mt-2 flex items-center text-sm text-gray-600">
                            <UserIcon className="h-4 w-4 mr-1" />
                            <span>Sent to: {ticket.recipient.name}</span>
                          </div>}
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className={`flex flex-wrap gap-2 ${activeTab === 'past' ? 'opacity-70' : ''}`}>
                      <button onClick={() => handleViewTicket(ticket.id)} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <TicketIcon className="h-4 w-4 mr-1" />
                        View Ticket
                      </button>
                      {activeTab !== 'transferred' && <button onClick={() => handleTransferTicket(ticket)} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <ShareIcon className="h-4 w-4 mr-1" />
                          Transfer
                        </button>}
                      {activeTab !== 'past' && activeTab !== 'transferred' && <button onClick={() => handleAddToCalendar(ticket)} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Add to Calendar
                        </button>}
                      <button onClick={() => handleDownloadTicket(ticket)} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <DownloadIcon className="h-4 w-4 mr-1" />
                        Download
                      </button>
                      {activeTab === 'past' && <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <StarIcon className="h-4 w-4 mr-1" />
                          Leave Review
                        </button>}
                      {activeTab === 'transferred' && <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <ArrowRightIcon className="h-4 w-4 mr-1" />
                          Revoke Transfer
                        </button>}
                    </div>
                  </div>
                </div>
              </div>) : <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tickets found
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'upcoming' ? "You don't have any upcoming events" : activeTab === 'past' ? "You haven't attended any past events yet" : "You haven't transferred any tickets yet"}
              </p>
              <button onClick={() => navigate('/events')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Browse Events
              </button>
            </div>}
        </div>
      </div>
      {/* Transfer Ticket Modal */}
      {showTransferModal && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button onClick={() => setShowTransferModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <XIcon className="h-5 w-5" />
            </button>
            {!transferSuccess ? <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Transfer Ticket
                </h2>
                <p className="text-gray-600 mb-6">
                  Enter the email address of the person you want to transfer
                  your ticket to.
                </p>
                <form onSubmit={handleConfirmTransfer}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Email
                    </label>
                    <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="friend@example.com" value={transferEmail} onChange={e => setTransferEmail(e.target.value)} required />
                  </div>
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Ticket Details
                    </h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="font-medium">{selectedTicket?.eventName}</p>
                      <p className="text-sm text-gray-600">
                        {formatEventDate(selectedTicket?.date)} •{' '}
                        {formatEventTime(selectedTicket?.date)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedTicket?.ticketType} •{' '}
                        {selectedTicket?.quantity}{' '}
                        {selectedTicket?.quantity > 1 ? 'tickets' : 'ticket'}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button type="button" onClick={() => setShowTransferModal(false)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                      Transfer Ticket
                    </button>
                  </div>
                </form>
              </> : <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Transfer Successful!
                </h2>
                <p className="text-gray-600">
                  Your ticket has been sent to {transferEmail}
                </p>
              </div>}
          </div>
        </div>}
    </div>;
};