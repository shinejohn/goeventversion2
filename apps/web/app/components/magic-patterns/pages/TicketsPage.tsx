import React, { useState, createElement } from 'react';
import { ArrowRightIcon, TicketIcon, CalendarIcon, MapPinIcon, ClockIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
export const TicketsPage = () => {
  const navigate = useNavigate();
  const ticketCategories = [{
    title: 'Buy Tickets',
    description: 'Browse and purchase tickets for upcoming events',
    path: '/tickets/buy',
    icon: '🎟️'
  }, {
    title: 'Sell Tickets',
    description: "List tickets for events you can't attend",
    path: '/tickets/sell',
    icon: '💰'
  }, {
    title: 'My Tickets',
    description: 'View and manage your ticket purchases',
    path: '/tickets/my-tickets',
    icon: '📱'
  }, {
    title: 'Gift Tickets',
    description: 'Send event tickets as gifts to friends and family',
    path: '/tickets/gift',
    icon: '🎁'
  }, {
    title: 'Group Discounts',
    description: 'Special rates for group ticket purchases',
    path: '/tickets/groups',
    icon: '👥'
  }];
  // Sample upcoming events with tickets
  const upcomingEvents = [{
    id: 'event-1',
    title: 'Clearwater Jazz Holiday',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'Oct 15-18, 2024',
    time: '5:00 PM',
    venue: 'Coachman Park',
    price: '$25',
    status: 'On Sale'
  }, {
    id: 'event-2',
    title: 'Summer Sunset Concert Series',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'August 20, 2024',
    time: '7:30 PM',
    venue: 'Pier 60',
    price: '$15',
    status: 'Selling Fast'
  }, {
    id: 'event-3',
    title: 'Comedy Night at Capitol Theatre',
    image: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'August 25, 2024',
    time: '8:00 PM',
    venue: 'Capitol Theatre',
    price: '$30',
    status: 'On Sale'
  }, {
    id: 'event-4',
    title: 'Local Craft Beer Festival',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'September 10, 2024',
    time: '2:00 PM - 8:00 PM',
    venue: 'Waterfront Park',
    price: '$45',
    status: 'Early Bird'
  }, {
    id: 'event-5',
    title: 'Ruth Eckerd Hall: Symphony Orchestra',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'September 18, 2024',
    time: '7:00 PM',
    venue: 'Ruth Eckerd Hall',
    price: '$50-$120',
    status: 'On Sale'
  }, {
    id: 'event-6',
    title: 'Downtown Art Walk & Wine Tasting',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: 'October 1, 2024',
    time: '6:00 PM - 9:00 PM',
    venue: 'Downtown Arts District',
    price: '$35',
    status: 'Limited'
  }];
  return <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              Tickets & Passes
            </h1>
            <p className="mt-3 text-xl">
              Buy, sell, and manage tickets for local events
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <button onClick={() => navigate('/tickets/buy')} className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50">
                  <TicketIcon className="h-5 w-5 mr-2" />
                  Browse Tickets
                </button>
              </div>
              <div className="ml-3 inline-flex">
                <button onClick={() => navigate('/profile/tickets')} className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  My Tickets
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Ticket Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Ticket Options
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {ticketCategories.map((category, index) => <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer text-center" onClick={() => navigate(category.path)}>
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className="text-lg font-bold text-gray-900">
                {category.title}
              </h3>
              <p className="text-gray-600 mt-2 text-sm">
                {category.description}
              </p>
              <div className="mt-4 flex justify-center">
                <ArrowRightIcon className="h-5 w-5 text-indigo-600" />
              </div>
            </div>)}
        </div>
      </div>
      {/* Featured Events with Tickets */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Upcoming Events
            </h2>
            <button className="text-indigo-600 hover:text-indigo-800 flex items-center font-medium" onClick={() => navigate('/tickets/buy')}>
              View all events
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(event => {
            const [shareSuccess, setShareSuccess] = useState(false);
            const [calendarSuccess, setCalendarSuccess] = useState(false);
            const [showSharePopup, setShowSharePopup] = useState(false);
            // Handle share event
            const handleShareEvent = e => {
              e.stopPropagation();
              setShowSharePopup(true);
            };
            // Handle add to calendar
            const handleAddToCalendar = e => {
              e.stopPropagation();
              // Parse date string (simplified for demo)
              const eventDate = new Date();
              const eventEndDate = new Date(eventDate);
              eventEndDate.setHours(eventEndDate.getHours() + 3);
              // Format for iCal
              const startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
              const endDate = eventEndDate.toISOString().replace(/-|:|\.\d+/g, '');
              const icsContent = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `SUMMARY:${event.title}`, `DTSTART:${startDate}`, `DTEND:${endDate}`, `LOCATION:${event.venue}`, `DESCRIPTION:${event.title} at ${event.venue}. ${event.status} - ${event.price}`, 'END:VEVENT', 'END:VCALENDAR'].join('\n');
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
              setCalendarSuccess(true);
              setTimeout(() => setCalendarSuccess(false), 2000);
            };
            return <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/tickets/${event.id}/select`)}>
                  <div className="h-48 overflow-hidden relative">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                    <div className="absolute top-0 right-0 m-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${event.status === 'Selling Fast' ? 'bg-orange-100 text-orange-800' : event.status === 'Limited' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <ClockIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      {event.venue}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        {event.price}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button onClick={handleShareEvent} className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100" title="Share Event">
                          {shareSuccess ? <CheckIcon className="h-4 w-4 text-green-500" /> : <ShareIcon className="h-4 w-4" />}
                        </button>
                        <button onClick={handleAddToCalendar} className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100" title="Add to Calendar">
                          {calendarSuccess ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CalendarIcon className="h-4 w-4" />}
                        </button>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-1 rounded" onClick={e => {
                      e.stopPropagation();
                      navigate(`/tickets/${event.id}/select`);
                    }}>
                          Get Tickets
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Share Popup */}
                  {showSharePopup && <SharePopup isOpen={showSharePopup} onClose={() => setShowSharePopup(false)} title={event.title} description={`${event.title} at ${event.venue} on ${event.date}, ${event.time}. Status: ${event.status}`} url={`${window.location.origin}/event/${event.id}`} image={event.image} />}
                </div>;
          })}
          </div>
        </div>
      </div>
      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">
              How do I receive my tickets?
            </h3>
            <p className="text-gray-600">
              After purchase, tickets are delivered to your email and accessible
              in your account. You can print them or use the mobile version for
              entry.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">
              Can I get a refund if I can't attend?
            </h3>
            <p className="text-gray-600">
              Refund policies vary by event. Check the event details page for
              specific refund terms. Many events allow you to resell your
              tickets through our platform.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">
              How do I sell tickets I can't use?
            </h3>
            <p className="text-gray-600">
              Visit the "Sell Tickets" section, select your event, set your
              price, and list your tickets. We'll handle the secure transaction
              when someone purchases them.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">
              Are there fees for buying tickets?
            </h3>
            <p className="text-gray-600">
              Service fees vary by event and are clearly displayed before
              checkout. Some events offer fee-free tickets during special
              promotions.
            </p>
          </div>
        </div>
        <div className="text-center mt-8">
          <button className="text-indigo-600 hover:text-indigo-800 font-medium" onClick={() => navigate('/help/tickets')}>
            View all ticket FAQs
          </button>
        </div>
      </div>
    </div>;
};