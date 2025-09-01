import React, { useEffect, useState } from 'react';
import { XIcon, SearchIcon, CalendarIcon, PlusIcon, CheckIcon, ClockIcon, MapPinIcon, AlertCircleIcon } from 'lucide-react';
type EventSuggestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventSuggestionData) => Promise<boolean>;
  calendarName?: string;
  hubName?: string;
  availableCategories?: string[];
};
type EventSuggestionData = {
  eventId?: string;
  isExistingEvent: boolean;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventDescription: string;
  eventUrl?: string;
  relevanceNote: string;
  selectedCategories: string[];
};
type SearchResult = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  image?: string;
};
export const EventSuggestionModal = ({
  isOpen,
  onClose,
  onSubmit,
  calendarName,
  hubName,
  availableCategories = ['Music', 'Food & Drink', 'Arts', 'Sports', 'Nightlife', 'Family', 'Business', 'Charity', 'Community', 'Education', 'Festival', 'Film', 'Health', 'Technology']
}: EventSuggestionModalProps) => {
  const [step, setStep] = useState<'search' | 'details' | 'confirmation'>('search');
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SearchResult | null>(null);
  const [isNewEvent, setIsNewEvent] = useState(false);
  const [formData, setFormData] = useState<EventSuggestionData>({
    isExistingEvent: false,
    eventName: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventDescription: '',
    relevanceNote: '',
    selectedCategories: []
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EventSuggestionData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('search');
      setIsSearching(false);
      setSearchQuery('');
      setSearchResults([]);
      setSelectedEvent(null);
      setIsNewEvent(false);
      setFormData({
        isExistingEvent: false,
        eventName: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        eventDescription: '',
        relevanceNote: '',
        selectedCategories: []
      });
      setErrors({});
      setIsSubmitting(false);
      setSubmitError(null);
    }
  }, [isOpen]);
  if (!isOpen) return null;
  // Mock search function - would be replaced with real API call
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock results
      const results: SearchResult[] = [{
        id: 'event-1',
        name: 'Summer Music Festival',
        date: '2024-07-15',
        time: '16:00',
        location: 'Central Park',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }, {
        id: 'event-2',
        name: 'Food Truck Rally',
        date: '2024-06-22',
        time: '12:00',
        location: 'Downtown Square',
        image: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }, {
        id: 'event-3',
        name: 'Art Gallery Opening',
        date: '2024-06-30',
        time: '19:00',
        location: 'Modern Art Museum',
        image: 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }].filter(event => event.name.toLowerCase().includes(searchQuery.toLowerCase()) || event.location.toLowerCase().includes(searchQuery.toLowerCase()));
      setSearchResults(results);
      setIsSearching(false);
    }, 800);
  };
  const handleSelectEvent = (event: SearchResult) => {
    setSelectedEvent(event);
    setFormData({
      ...formData,
      isExistingEvent: true,
      eventId: event.id,
      eventName: event.name,
      eventDate: event.date,
      eventTime: event.time,
      eventLocation: event.location
    });
    setStep('details');
  };
  const handleCreateNewEvent = () => {
    setIsNewEvent(true);
    setSelectedEvent(null);
    setFormData({
      ...formData,
      isExistingEvent: false,
      eventId: undefined,
      eventName: searchQuery
    });
    setStep('details');
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when field is updated
    if (errors[name as keyof EventSuggestionData]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  const handleCategoryToggle = (category: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedCategories.includes(category);
      return {
        ...prev,
        selectedCategories: isSelected ? prev.selectedCategories.filter(c => c !== category) : [...prev.selectedCategories, category]
      };
    });
  };
  const validateForm = () => {
    const newErrors: Partial<Record<keyof EventSuggestionData, string>> = {};
    if (!formData.isExistingEvent) {
      if (!formData.eventName) newErrors.eventName = 'Event name is required';
      if (!formData.eventDate) newErrors.eventDate = 'Date is required';
      if (!formData.eventLocation) newErrors.eventLocation = 'Location is required';
    }
    if (!formData.relevanceNote) newErrors.relevanceNote = 'Please explain why this event is relevant';
    if (formData.selectedCategories.length === 0) newErrors.selectedCategories = 'Select at least one category';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const success = await onSubmit(formData);
      if (success) {
        setStep('confirmation');
      } else {
        setSubmitError('Failed to submit suggestion. Please try again.');
      }
    } catch (err) {
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  return <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Header */}
          <div className="bg-white px-4 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {step === 'search' && 'Suggest an Event'}
                {step === 'details' && (formData.isExistingEvent ? 'Add Event Details' : 'Create New Event')}
                {step === 'confirmation' && 'Event Suggested'}
              </h3>
              <button onClick={onClose} className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          {/* Content */}
          <div className="bg-white px-4 py-5 sm:p-6">
            {/* Step 1: Search */}
            {step === 'search' && <div>
                <p className="text-sm text-gray-500 mb-4">
                  Suggest an event to add to{' '}
                  {calendarName || hubName || 'the calendar'}. Search for an
                  existing event or create a new one.
                </p>
                <form onSubmit={handleSearch} className="mb-6">
                  <div className="relative">
                    <input type="text" placeholder="Search for an event..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {isSearching ? <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg> : <span className="text-indigo-600 text-sm font-medium">
                          Search
                        </span>}
                    </button>
                  </div>
                </form>
                {searchResults.length > 0 ? <div className="space-y-4 mb-6">
                    <h4 className="font-medium text-gray-900">
                      Search Results
                    </h4>
                    {searchResults.map(event => <div key={event.id} className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => handleSelectEvent(event)}>
                        {event.image && <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden mr-3">
                            <img src={event.image} alt={event.name} className="h-full w-full object-cover" />
                          </div>}
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-gray-900">
                            {event.name}
                          </h5>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <CalendarIcon className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                            <span>{formatDate(event.date)}</span>
                            <span className="mx-1">•</span>
                            <ClockIcon className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                            <span>{event.time}</span>
                          </div>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <MapPinIcon className="flex-shrink-0 mr-1 h-3 w-3 text-gray-400" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <button className="ml-4 flex-shrink-0 text-indigo-600 hover:text-indigo-800 text-sm">
                          Select
                        </button>
                      </div>)}
                  </div> : searchQuery && !isSearching ? <div className="text-center py-6 mb-4">
                    <p className="text-sm text-gray-500 mb-4">
                      No events found matching "{searchQuery}"
                    </p>
                  </div> : null}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <button onClick={handleCreateNewEvent} className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700" disabled={!searchQuery.trim()}>
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create New Event
                  </button>
                </div>
              </div>}
            {/* Step 2: Details */}
            {step === 'details' && <div className="space-y-4">
                {formData.isExistingEvent && selectedEvent && <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <div className="flex items-start">
                      {selectedEvent.image && <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden mr-3">
                          <img src={selectedEvent.image} alt={selectedEvent.name} className="h-full w-full object-cover" />
                        </div>}
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {selectedEvent.name}
                        </h4>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <CalendarIcon className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" />
                          <span>{formatDate(selectedEvent.date)}</span>
                          <span className="mx-1">•</span>
                          <ClockIcon className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" />
                          <span>{selectedEvent.time}</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <MapPinIcon className="flex-shrink-0 mr-1 h-4 w-4 text-gray-400" />
                          <span>{selectedEvent.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>}
                {!formData.isExistingEvent && <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="eventName">
                        Event Name*
                      </label>
                      <input type="text" id="eventName" name="eventName" value={formData.eventName} onChange={handleInputChange} className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border ${errors.eventName ? 'border-red-300' : 'border-gray-300'}`} />
                      {errors.eventName && <p className="mt-1 text-sm text-red-600">
                          {errors.eventName}
                        </p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="eventDate">
                          Date*
                        </label>
                        <input type="date" id="eventDate" name="eventDate" value={formData.eventDate} onChange={handleInputChange} className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border ${errors.eventDate ? 'border-red-300' : 'border-gray-300'}`} />
                        {errors.eventDate && <p className="mt-1 text-sm text-red-600">
                            {errors.eventDate}
                          </p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="eventTime">
                          Time
                        </label>
                        <input type="time" id="eventTime" name="eventTime" value={formData.eventTime} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="eventLocation">
                        Location*
                      </label>
                      <input type="text" id="eventLocation" name="eventLocation" value={formData.eventLocation} onChange={handleInputChange} className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border ${errors.eventLocation ? 'border-red-300' : 'border-gray-300'}`} placeholder="Venue name or address" />
                      {errors.eventLocation && <p className="mt-1 text-sm text-red-600">
                          {errors.eventLocation}
                        </p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="eventDescription">
                        Description
                      </label>
                      <textarea id="eventDescription" name="eventDescription" rows={3} value={formData.eventDescription} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Brief description of the event" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="eventUrl">
                        Event URL
                      </label>
                      <input type="url" id="eventUrl" name="eventUrl" value={formData.eventUrl || ''} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://example.com/event" />
                    </div>
                  </div>}
                <div className="border-t border-gray-200 pt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="relevanceNote">
                      Why is this event relevant to{' '}
                      {calendarName || hubName || 'this calendar'}?*
                    </label>
                    <textarea id="relevanceNote" name="relevanceNote" rows={3} value={formData.relevanceNote} onChange={handleInputChange} className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border ${errors.relevanceNote ? 'border-red-300' : 'border-gray-300'}`} placeholder="Explain why this event would be a good fit" />
                    {errors.relevanceNote && <p className="mt-1 text-sm text-red-600">
                        {errors.relevanceNote}
                      </p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories*
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.map(category => <button key={category} type="button" onClick={() => handleCategoryToggle(category)} className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${formData.selectedCategories.includes(category) ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300' : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'}`}>
                          {formData.selectedCategories.includes(category) && <CheckIcon className="h-3.5 w-3.5 mr-1" />}
                          {category}
                        </button>)}
                    </div>
                    {errors.selectedCategories && <p className="mt-1 text-sm text-red-600">
                        {errors.selectedCategories}
                      </p>}
                  </div>
                </div>
                {submitError && <div className="mt-4 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <AlertCircleIcon className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{submitError}</p>
                      </div>
                    </div>
                  </div>}
              </div>}
            {/* Step 3: Confirmation */}
            {step === 'confirmation' && <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Event Suggested Successfully
                </h3>
                <p className="text-gray-600 mb-6">
                  Your event suggestion has been submitted to the curator for
                  review. You'll be notified when it's approved.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">
                    What happens next?
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                        <div className="absolute inset-0 rounded-full bg-indigo-600 flex items-center justify-center">
                          <span className="text-white text-xs">1</span>
                        </div>
                      </div>
                      <p className="ml-2 text-sm text-gray-600">
                        The curator will review your suggestion
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                        <div className="absolute inset-0 rounded-full bg-indigo-600 flex items-center justify-center">
                          <span className="text-white text-xs">2</span>
                        </div>
                      </div>
                      <p className="ml-2 text-sm text-gray-600">
                        If approved, the event will be added to{' '}
                        {calendarName || hubName || 'the calendar'}
                      </p>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                        <div className="absolute inset-0 rounded-full bg-indigo-600 flex items-center justify-center">
                          <span className="text-white text-xs">3</span>
                        </div>
                      </div>
                      <p className="ml-2 text-sm text-gray-600">
                        You'll receive a notification when a decision is made
                      </p>
                    </li>
                  </ul>
                </div>
                <button onClick={onClose} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Close
                </button>
              </div>}
          </div>
          {/* Footer */}
          {step === 'details' && <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              <button type="button" className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`} onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </> : 'Submit Suggestion'}
              </button>
              <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={() => setStep('search')} disabled={isSubmitting}>
                Back
              </button>
            </div>}
        </div>
      </div>
    </div>;
};