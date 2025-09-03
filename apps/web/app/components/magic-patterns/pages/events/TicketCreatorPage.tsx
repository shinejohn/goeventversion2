import React, { useEffect, useState } from 'react';
import { PlusIcon, MinusIcon, TrashIcon, EyeIcon, CalendarIcon, ClockIcon, MapPinIcon, TicketIcon, InfoIcon, ArrowLeftIcon, SaveIcon, CheckIcon, XIcon, AlertCircleIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
export const TicketCreatorPage = () => {
  const navigate = useNavigate();
  const [ticketTypes, setTicketTypes] = useState([{
    id: 'general',
    name: 'General Admission',
    description: 'Standard entry to the event',
    price: 25,
    quantity: 100,
    maxPerOrder: 8,
    minPerOrder: 1,
    isFree: false,
    isPublished: false,
    salesStart: new Date(),
    salesEnd: new Date(new Date().setDate(new Date().getDate() + 30)),
    showRemaining: true,
    absorb_fees: false
  }]);
  const [additionalOptions, setAdditionalOptions] = useState([{
    id: 'parking',
    name: 'Parking Pass',
    description: 'Guaranteed parking in main lot',
    price: 15,
    quantity: 50,
    maxPerOrder: 2,
    isRequired: false,
    isPublished: false
  }]);
  const [fees, setFees] = useState({
    marketplaceFee: 10,
    serviceFee: 2.5,
    facilityFee: 1.5
  });
  const [eventDetails, setEventDetails] = useState({
    name: 'Clearwater Jazz Holiday',
    date: 'October 15, 2024',
    time: '5:00 PM',
    venue: 'Coachman Park',
    address: '301 Drew St, Clearwater, FL 33755',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
  });
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('tickets');
  const [saveStatus, setSaveStatus] = useState(null); // null, 'saving', 'saved', 'error'
  const [publishStatus, setPublishStatus] = useState(null); // null, 'publishing', 'published', 'error'
  const [showFeeInfo, setShowFeeInfo] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  // Add a new ticket type
  const addTicketType = () => {
    const newId = `ticket-${Date.now()}`;
    setTicketTypes([...ticketTypes, {
      id: newId,
      name: 'New Ticket Type',
      description: 'Ticket description',
      price: 0,
      quantity: 50,
      maxPerOrder: 4,
      minPerOrder: 1,
      isFree: false,
      isPublished: false,
      salesStart: new Date(),
      salesEnd: new Date(new Date().setDate(new Date().getDate() + 30)),
      showRemaining: true,
      absorb_fees: false
    }]);
  };
  // Add a new add-on option
  const addOption = () => {
    const newId = `option-${Date.now()}`;
    setAdditionalOptions([...additionalOptions, {
      id: newId,
      name: 'New Add-on',
      description: 'Add-on description',
      price: 10,
      quantity: 50,
      maxPerOrder: 2,
      isRequired: false,
      isPublished: false
    }]);
  };
  // Update ticket type
  const updateTicketType = (id, field, value) => {
    setTicketTypes(ticketTypes.map(ticket => {
      if (ticket.id === id) {
        return {
          ...ticket,
          [field]: value
        };
      }
      return ticket;
    }));
  };
  // Update add-on option
  const updateOption = (id, field, value) => {
    setAdditionalOptions(additionalOptions.map(option => {
      if (option.id === id) {
        return {
          ...option,
          [field]: value
        };
      }
      return option;
    }));
  };
  // Remove ticket type
  const removeTicketType = id => {
    setTicketTypes(ticketTypes.filter(ticket => ticket.id !== id));
  };
  // Remove add-on option
  const removeOption = id => {
    setAdditionalOptions(additionalOptions.filter(option => option.id !== id));
  };
  // Handle date change
  const handleDateChange = (id, field, value) => {
    const date = new Date(value);
    updateTicketType(id, field, date);
  };
  // Save ticket configuration
  const saveTickets = () => {
    setSaveStatus('saving');
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('saved');
      // Reset status after a delay
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);
    }, 1500);
  };
  // Publish tickets
  const publishTickets = () => {
    setPublishStatus('publishing');
    // Mark all tickets as published
    setTicketTypes(ticketTypes.map(ticket => ({
      ...ticket,
      isPublished: true
    })));
    setAdditionalOptions(additionalOptions.map(option => ({
      ...option,
      isPublished: true
    })));
    // Simulate API call
    setTimeout(() => {
      setPublishStatus('published');
      setShowPublishConfirm(false);
      // Reset status after a delay
      setTimeout(() => {
        setPublishStatus(null);
      }, 3000);
    }, 1500);
  };
  // Calculate total potential revenue
  const calculatePotentialRevenue = () => {
    const ticketRevenue = ticketTypes.reduce((sum, ticket) => sum + ticket.price * ticket.quantity, 0);
    const optionRevenue = additionalOptions.reduce((sum, option) => sum + option.price * option.quantity, 0);
    return ticketRevenue + optionRevenue;
  };
  // Calculate marketplace fees
  const calculateMarketplaceFees = () => {
    const totalRevenue = calculatePotentialRevenue();
    return totalRevenue * fees.marketplaceFee / 100;
  };
  // Format currency
  const formatCurrency = amount => {
    return `$${amount.toFixed(2)}`;
  };
  // Format date for display
  const formatDate = date => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  // Format date for input field
  const formatDateForInput = date => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={() => navigate('/events')} className="mr-4 text-gray-500 hover:text-gray-700">
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Ticket Creator
              </h1>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => setShowPreview(!showPreview)} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <EyeIcon className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
              <button onClick={saveTickets} disabled={saveStatus === 'saving'} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400">
                {saveStatus === 'saving' ? <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </> : <>
                    <SaveIcon className="h-4 w-4 mr-2" />
                    Save Draft
                  </>}
              </button>
              <button onClick={() => setShowPublishConfirm(true)} disabled={publishStatus === 'publishing'} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400">
                {publishStatus === 'publishing' ? <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Publishing...
                  </> : <>
                    <TicketIcon className="h-4 w-4 mr-2" />
                    Publish Tickets
                  </>}
              </button>
            </div>
          </div>
          {/* Event details */}
          <div className="mt-6 bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <div className="flex items-start">
              <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                <img src={eventDetails.image} alt={eventDetails.name} className="h-full w-full object-cover" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {eventDetails.name}
                </h2>
                <div className="mt-1 flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{eventDetails.date}</span>
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{eventDetails.time}</span>
                </div>
                <div className="mt-1 flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{eventDetails.venue}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Status Messages */}
          {saveStatus === 'saved' && <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700">
                Ticket configuration saved successfully!
              </span>
            </div>}
          {publishStatus === 'published' && <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700">
                Tickets published successfully! They are now available for
                purchase.
              </span>
            </div>}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button onClick={() => setActiveTab('tickets')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tickets' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Ticket Types
                </button>
                <button onClick={() => setActiveTab('addons')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'addons' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Add-ons & Options
                </button>
                <button onClick={() => setActiveTab('settings')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  Settings
                </button>
              </nav>
            </div>
            {/* Ticket Types Tab */}
            {activeTab === 'tickets' && <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Ticket Types
                  </h2>
                  <button onClick={addTicketType} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Ticket Type
                  </button>
                </div>
                <div className="space-y-6">
                  {ticketTypes.map(ticket => <div key={ticket.id} className={`bg-white shadow-sm rounded-lg overflow-hidden border ${ticket.isPublished ? 'border-green-300' : 'border-gray-200'}`}>
                      {ticket.isPublished && <div className="bg-green-50 px-4 py-2 flex items-center">
                          <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-green-700">
                            Published
                          </span>
                        </div>}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-full">
                            <div className="flex justify-between">
                              <div className="w-3/4 pr-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Ticket Name
                                </label>
                                <input type="text" value={ticket.name} onChange={e => updateTicketType(ticket.id, 'name', e.target.value)} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Price
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">
                                      $
                                    </span>
                                  </div>
                                  <input type="number" min="0" step="0.01" value={ticket.price} onChange={e => updateTicketType(ticket.id, 'price', parseFloat(e.target.value))} disabled={ticket.isFree} className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100 disabled:text-gray-500" />
                                </div>
                                <div className="mt-1 flex items-center">
                                  <input id={`free-${ticket.id}`} type="checkbox" checked={ticket.isFree} onChange={e => {
                              updateTicketType(ticket.id, 'isFree', e.target.checked);
                              if (e.target.checked) {
                                updateTicketType(ticket.id, 'price', 0);
                              }
                            }} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                  <label htmlFor={`free-${ticket.id}`} className="ml-2 block text-sm text-gray-700">
                                    Free ticket
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea value={ticket.description} onChange={e => updateTicketType(ticket.id, 'description', e.target.value)} rows={2} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Available Quantity
                                </label>
                                <input type="number" min="1" value={ticket.quantity} onChange={e => updateTicketType(ticket.id, 'quantity', parseInt(e.target.value))} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Max Per Order
                                </label>
                                <input type="number" min="1" value={ticket.maxPerOrder} onChange={e => updateTicketType(ticket.id, 'maxPerOrder', parseInt(e.target.value))} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Sales Start
                                </label>
                                <input type="date" value={formatDateForInput(ticket.salesStart)} onChange={e => handleDateChange(ticket.id, 'salesStart', e.target.value)} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Sales End
                                </label>
                                <input type="date" value={formatDateForInput(ticket.salesEnd)} onChange={e => handleDateChange(ticket.id, 'salesEnd', e.target.value)} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                              </div>
                            </div>
                            <div className="mt-4 flex items-center">
                              <input id={`show-remaining-${ticket.id}`} type="checkbox" checked={ticket.showRemaining} onChange={e => updateTicketType(ticket.id, 'showRemaining', e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                              <label htmlFor={`show-remaining-${ticket.id}`} className="ml-2 block text-sm text-gray-700">
                                Show remaining ticket count to customers
                              </label>
                            </div>
                            <div className="mt-2 flex items-center">
                              <input id={`absorb-fees-${ticket.id}`} type="checkbox" checked={ticket.absorb_fees} onChange={e => updateTicketType(ticket.id, 'absorb_fees', e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                              <label htmlFor={`absorb-fees-${ticket.id}`} className="ml-2 block text-sm text-gray-700">
                                Absorb service fees (include in ticket price)
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button onClick={() => removeTicketType(ticket.id)} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>)}
                </div>
                {ticketTypes.length === 0 && <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                    <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No ticket types
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add at least one ticket type to sell tickets for your
                      event
                    </p>
                    <button onClick={addTicketType} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Ticket Type
                    </button>
                  </div>}
              </div>}
            {/* Add-ons Tab */}
            {activeTab === 'addons' && <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Add-ons & Options
                  </h2>
                  <button onClick={addOption} className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Option
                  </button>
                </div>
                <div className="space-y-6">
                  {additionalOptions.map(option => <div key={option.id} className={`bg-white shadow-sm rounded-lg overflow-hidden border ${option.isPublished ? 'border-green-300' : 'border-gray-200'}`}>
                      {option.isPublished && <div className="bg-green-50 px-4 py-2 flex items-center">
                          <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-green-700">
                            Published
                          </span>
                        </div>}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-full">
                            <div className="flex justify-between">
                              <div className="w-3/4 pr-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Add-on Name
                                </label>
                                <input type="text" value={option.name} onChange={e => updateOption(option.id, 'name', e.target.value)} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Price
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">
                                      $
                                    </span>
                                  </div>
                                  <input type="number" min="0" step="0.01" value={option.price} onChange={e => updateOption(option.id, 'price', parseFloat(e.target.value))} className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" />
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea value={option.description} onChange={e => updateOption(option.id, 'description', e.target.value)} rows={2} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Available Quantity
                                </label>
                                <input type="number" min="1" value={option.quantity} onChange={e => updateOption(option.id, 'quantity', parseInt(e.target.value))} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Max Per Order
                                </label>
                                <input type="number" min="1" value={option.maxPerOrder} onChange={e => updateOption(option.id, 'maxPerOrder', parseInt(e.target.value))} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                              </div>
                            </div>
                            <div className="mt-4 flex items-center">
                              <input id={`required-${option.id}`} type="checkbox" checked={option.isRequired} onChange={e => updateOption(option.id, 'isRequired', e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                              <label htmlFor={`required-${option.id}`} className="ml-2 block text-sm text-gray-700">
                                Required add-on (must be purchased with ticket)
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button onClick={() => removeOption(option.id)} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>)}
                </div>
                {additionalOptions.length === 0 && <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                    <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No add-ons or options
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add options like parking passes, merchandise, or VIP
                      upgrades
                    </p>
                    <button onClick={addOption} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Option
                    </button>
                  </div>}
              </div>}
            {/* Settings Tab */}
            {activeTab === 'settings' && <div>
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Fee Settings
                  </h2>
                  <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900">
                          Marketplace Fee
                        </h3>
                        <button onClick={() => setShowFeeInfo(!showFeeInfo)} className="ml-2 text-gray-400 hover:text-gray-600">
                          <InfoIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center">
                        <input type="number" min="0" max="100" step="0.1" value={fees.marketplaceFee} onChange={e => setFees({
                      ...fees,
                      marketplaceFee: parseFloat(e.target.value)
                    })} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-24 sm:text-sm border-gray-300 rounded-md" />
                        <span className="ml-2">%</span>
                      </div>
                    </div>
                    {showFeeInfo && <div className="bg-blue-50 p-4 rounded-md mb-4">
                        <p className="text-sm text-blue-700">
                          The marketplace fee is charged to help cover platform
                          costs and marketing efforts. This fee is calculated as
                          a percentage of the ticket price and is deducted from
                          your payout.
                        </p>
                      </div>}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900">
                          Service Fee
                        </h3>
                        <div className="flex items-center">
                          <span className="mr-2">$</span>
                          <input type="number" min="0" step="0.01" value={fees.serviceFee} onChange={e => setFees({
                        ...fees,
                        serviceFee: parseFloat(e.target.value)
                      })} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-24 sm:text-sm border-gray-300 rounded-md" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900">
                          Facility Fee
                        </h3>
                        <div className="flex items-center">
                          <span className="mr-2">$</span>
                          <input type="number" min="0" step="0.01" value={fees.facilityFee} onChange={e => setFees({
                        ...fees,
                        facilityFee: parseFloat(e.target.value)
                      })} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-24 sm:text-sm border-gray-300 rounded-md" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Fee Examples
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-600 mb-2">
                          For a $25 ticket:
                        </p>
                        <ul className="space-y-1 text-sm text-gray-600">
                          <li className="flex justify-between">
                            <span>
                              Marketplace Fee ({fees.marketplaceFee}%):
                            </span>
                            <span>
                              ${(25 * fees.marketplaceFee / 100).toFixed(2)}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span>Service Fee:</span>
                            <span>${fees.serviceFee.toFixed(2)}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Facility Fee:</span>
                            <span>${fees.facilityFee.toFixed(2)}</span>
                          </li>
                          <li className="flex justify-between font-medium pt-1 border-t border-gray-200 mt-1">
                            <span>Total Customer Price:</span>
                            <span>
                              $
                              {(25 + fees.serviceFee + fees.facilityFee).toFixed(2)}
                            </span>
                          </li>
                          <li className="flex justify-between font-medium text-indigo-700">
                            <span>Your Payout:</span>
                            <span>
                              $
                              {(25 - 25 * fees.marketplaceFee / 100).toFixed(2)}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Refund Policy
                  </h2>
                  <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Refund Policy
                      </label>
                      <select className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                        <option>No refunds</option>
                        <option>
                          Full refunds up to 7 days before the event
                        </option>
                        <option>
                          Full refunds up to 24 hours before the event
                        </option>
                        <option>Custom refund policy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custom Refund Policy (optional)
                      </label>
                      <textarea rows={4} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Enter your custom refund policy here..." />
                      <p className="mt-1 text-xs text-gray-500">
                        This policy will be displayed to customers during
                        checkout.
                      </p>
                    </div>
                  </div>
                </div>
              </div>}
          </div>
          {/* Preview Column */}
          <div className={`${showPreview ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-6">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-medium text-gray-900">Customer Preview</h2>
                <p className="text-sm text-gray-600">
                  This is how your tickets will appear to customers
                </p>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {eventDetails.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{eventDetails.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <ClockIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{eventDetails.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{eventDetails.venue}</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <TicketIcon className="h-4 w-4 text-gray-500 mr-2" />
                    Select Tickets
                  </h3>
                  {ticketTypes.length > 0 ? <div className="space-y-3">
                      {ticketTypes.map(ticket => <div key={ticket.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {ticket.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {ticket.description}
                              </p>
                              <p className="mt-1 font-medium text-gray-900">
                                {ticket.isFree ? <span className="text-green-600">Free</span> : `$${ticket.price.toFixed(2)}`}
                              </p>
                              {ticket.showRemaining && <p className="text-xs text-gray-500 mt-1">
                                  {ticket.quantity} remaining
                                </p>}
                            </div>
                            <div className="flex items-center space-x-3">
                              <button className="h-7 w-7 rounded-full flex items-center justify-center border border-gray-300">
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="w-5 text-center">0</span>
                              <button className="h-7 w-7 rounded-full flex items-center justify-center border border-gray-300">
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          {ticket.salesStart && ticket.salesEnd && <div className="mt-2 text-xs text-gray-500">
                              On sale: {formatDate(ticket.salesStart)} -{' '}
                              {formatDate(ticket.salesEnd)}
                            </div>}
                        </div>)}
                    </div> : <p className="text-gray-500 text-sm">
                      No ticket types added yet
                    </p>}
                </div>
                {additionalOptions.length > 0 && <div className="border-t border-gray-200 pt-4 mb-4">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Add-ons & Options
                    </h3>
                    <div className="space-y-3">
                      {additionalOptions.map(option => <div key={option.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {option.name}
                                {option.isRequired && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                    Required
                                  </span>}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {option.description}
                              </p>
                              <p className="mt-1 font-medium text-gray-900">
                                ${option.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <button className="h-7 w-7 rounded-full flex items-center justify-center border border-gray-300">
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="w-5 text-center">0</span>
                              <button className="h-7 w-7 rounded-full flex items-center justify-center border border-gray-300">
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </div>}
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Order Summary
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Select tickets to see the summary
                  </p>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Subtotal</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Service Fee</span>
                    <span>${fees.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <span>Facility Fee</span>
                    <span>${fees.facilityFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>
                      ${(fees.serviceFee + fees.facilityFee).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium opacity-50 cursor-not-allowed">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Publish Confirmation Modal */}
      {showPublishConfirm && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Publish Tickets
            </h2>
            <div className="mb-6">
              <AlertCircleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-gray-600">
                You're about to publish {ticketTypes.length} ticket types and{' '}
                {additionalOptions.length} add-ons for {eventDetails.name}.
              </p>
              <p className="mt-2 text-gray-600">
                Once published, tickets will be available for purchase
                immediately.
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md mb-6">
              <h3 className="font-medium text-yellow-800 mb-2">
                Potential Revenue Summary
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-yellow-800">Total Ticket Revenue:</span>
                  <span className="font-medium text-yellow-800">
                    {formatCurrency(ticketTypes.reduce((sum, ticket) => sum + ticket.price * ticket.quantity, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-800">Total Add-on Revenue:</span>
                  <span className="font-medium text-yellow-800">
                    {formatCurrency(additionalOptions.reduce((sum, option) => sum + option.price * option.quantity, 0))}
                  </span>
                </div>
                <div className="flex justify-between border-t border-yellow-200 pt-1 mt-1">
                  <span className="text-yellow-800">
                    Marketplace Fee ({fees.marketplaceFee}%):
                  </span>
                  <span className="font-medium text-yellow-800">
                    {formatCurrency(calculateMarketplaceFees())}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-yellow-800">
                    Your Potential Payout:
                  </span>
                  <span className="text-yellow-800">
                    {formatCurrency(calculatePotentialRevenue() - calculateMarketplaceFees())}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowPublishConfirm(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={publishTickets} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Publish Now
              </button>
            </div>
          </div>
        </div>}
    </div>;
};