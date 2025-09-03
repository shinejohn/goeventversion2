import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { mockPerformers } from '../../mockdata/performers';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, MapPinIcon, UserIcon, BuildingIcon, MailIcon, PhoneIcon, InfoIcon, FileTextIcon, CheckCircleIcon, CheckIcon, XIcon, PlusIcon, MinusIcon, DollarSignIcon, SaveIcon, SendIcon, UploadIcon, HelpCircleIcon, AlertCircleIcon, StarIcon, MusicIcon } from 'lucide-react';
type BookPerformerPageProps = {
  performerId?: string;
};
export const BookPerformerPage = ({
  performerId = 'performer-1'
}: BookPerformerPageProps) => {
  const navigate = useNavigate();
  const [performer, setPerformer] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inquiryReference, setInquiryReference] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // Form state
  const [formData, setFormData] = useState({
    // Event Information
    eventType: '',
    eventTypeOther: '',
    eventName: '',
    venueName: '',
    venueAddress: '',
    eventDate: '',
    alternativeDates: ['', ''],
    expectedAttendance: '',
    budgetRange: '1000-2000',
    // Contact Details
    contactName: '',
    organization: '',
    email: '',
    phone: '',
    role: 'Individual',
    // Additional Information
    eventDescription: '',
    specialRequirements: {
      soundSystem: false,
      lighting: false,
      stageSetup: false,
      backlineEquipment: false,
      merchandiseTable: false,
      greenRoom: false,
      foodBeverages: false,
      transportation: false,
      accommodation: false
    },
    previousExperience: 'no',
    heardAbout: '',
    // Terms and agreements
    agreeToTerms: false
  });
  // Load performer data
  useEffect(() => {
    const performerData = mockPerformers.find(p => p.id === performerId);
    setPerformer(performerData);
  }, [performerId]);
  // Handle form data changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      checked
    } = e.target;
    if (name.includes('.')) {
      // Handle nested properties (e.g., specialRequirements.soundSystem)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };
  // Handle alternative date changes
  const handleAlternativeDateChange = (index: number, value: string) => {
    const newDates = [...formData.alternativeDates];
    newDates[index] = value;
    setFormData(prev => ({
      ...prev,
      alternativeDates: newDates
    }));
  };
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };
  // Validate form
  const validateForm = () => {
    // Required fields
    return formData.eventType !== '' && (formData.eventType !== 'Other' || formData.eventTypeOther !== '') && formData.eventName !== '' && formData.venueName !== '' && formData.eventDate !== '' && formData.expectedAttendance !== '' && formData.contactName !== '' && formData.email !== '' && formData.phone !== '' && formData.agreeToTerms;
  };
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      // Generate a booking reference
      const reference = `INQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setInquiryReference(reference);
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Scroll to top
      typeof window !== "undefined" && window.scrollTo(0, 0);
    }, 1500);
  };
  // Handle save draft
  const handleSaveDraft = () => {
    alert('Draft saved! You can return to complete your booking later.');
  };
  // Return to performer profile
  const handleReturnToProfile = () => {
    navigate(`/performers/${performerId}`);
  };
  // If performer is not loaded yet, show loading
  if (!performer) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading performer information...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={handleReturnToProfile} className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              <span>Back to {performer.name}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Book {performer.name}
        </h1>
        <p className="text-gray-600 mb-6">
          Fill out the form below to inquire about booking {performer.name} for
          your event.
        </p>
        {isSubmitted /* Confirmation Section */ ? <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Booking Inquiry Submitted!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in booking {performer.name}. We have
                received your inquiry and will respond within 48 hours.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 inline-block">
                <p className="text-sm text-gray-500 mb-1">
                  Your reference number
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {inquiryReference}
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Please save your reference number for future communications.
                  We'll send a confirmation email to{' '}
                  <span className="font-medium">{formData.email}</span> with all
                  the details.
                </p>
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-left">
                  <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                    <InfoIcon className="h-5 w-5 mr-2" />
                    What happens next?
                  </h3>
                  <ol className="list-decimal pl-5 text-sm text-yellow-800 space-y-1">
                    <li>The performer will review your booking request</li>
                    <li>You'll receive a response within 48 hours</li>
                    <li>
                      If accepted, you'll receive a detailed quote and contract
                    </li>
                    <li>
                      Once terms are agreed, you'll secure the booking with a
                      deposit
                    </li>
                  </ol>
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={handleReturnToProfile} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md">
                  Return to Performer Profile
                </button>
                <button onClick={() => navigate('/performers')} className="px-6 py-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md">
                  Browse More Performers
                </button>
              </div>
            </div>
          </div> : <div className="space-y-6">
            {/* Performer Summary Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 h-48 md:h-auto">
                  <img src={performer.profileImage} alt={performer.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex items-center mb-2">
                    <h2 className="text-xl font-bold text-gray-900 mr-2">
                      {performer.name}
                    </h2>
                    {performer.isVerified && <div className="tooltip" data-tip="Verified Performer">
                        <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                      </div>}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {performer.genres.map((genre: string, index: number) => <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {genre}
                      </span>)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{performer.homeCity}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <StarIcon className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      <span>
                        {performer.rating} ({performer.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MusicIcon className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{performer.showsPlayed}+ performances</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{performer.yearsActive} years experience</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {performer.takesRequests && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Takes Requests
                      </span>}
                    {performer.availableForPrivateEvents && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Private Events
                      </span>}
                    {performer.isFamilyFriendly && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Family Friendly
                      </span>}
                    {performer.offersMeetAndGreet && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Meet & Greet
                      </span>}
                  </div>
                </div>
              </div>
            </div>
            {/* Booking Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <form onSubmit={handleSubmit}>
                {/* Event Information Section */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Event Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Type <span className="text-red-500">*</span>
                      </label>
                      <select id="eventType" name="eventType" value={formData.eventType} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required>
                        <option value="" disabled>
                          Select event type
                        </option>
                        <option value="Concert/Show">Concert/Show</option>
                        <option value="Private Party">Private Party</option>
                        <option value="Corporate Event">Corporate Event</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Festival">Festival</option>
                        <option value="Other">Other</option>
                      </select>
                      {formData.eventType === 'Other' && <div className="mt-3">
                          <label htmlFor="eventTypeOther" className="block text-sm font-medium text-gray-700 mb-1">
                            Specify Event Type{' '}
                            <span className="text-red-500">*</span>
                          </label>
                          <input type="text" id="eventTypeOther" name="eventTypeOther" value={formData.eventTypeOther} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Please specify" required={formData.eventType === 'Other'} />
                        </div>}
                    </div>
                    <div>
                      <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Name <span className="text-red-500">*</span>
                      </label>
                      <input type="text" id="eventName" name="eventName" value={formData.eventName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., Annual Company Gala, Wedding Reception" required />
                    </div>
                    <div>
                      <label htmlFor="venueName" className="block text-sm font-medium text-gray-700 mb-1">
                        Venue Name <span className="text-red-500">*</span>
                      </label>
                      <input type="text" id="venueName" name="venueName" value={formData.venueName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., The Grand Ballroom, Private Residence" required />
                    </div>
                    <div>
                      <label htmlFor="venueAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Venue Address <span className="text-red-500">*</span>
                      </label>
                      <input type="text" id="venueAddress" name="venueAddress" value={formData.venueAddress} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Full address" required />
                    </div>
                    <div>
                      <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="date" id="eventDate" name="eventDate" value={formData.eventDate} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alternative Dates{' '}
                        <span className="text-gray-500 text-xs">
                          (optional)
                        </span>
                      </label>
                      <div className="space-y-2">
                        {formData.alternativeDates.map((date, index) => <div key={index} className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <CalendarIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input type="date" value={date} onChange={e => handleAlternativeDateChange(index, e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder={`Alternative date ${index + 1}`} />
                          </div>)}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="expectedAttendance" className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Attendance{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input type="number" id="expectedAttendance" name="expectedAttendance" value={formData.expectedAttendance} onChange={handleInputChange} min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Number of guests" required />
                    </div>
                    <div>
                      <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700 mb-1">
                        Budget Range
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSignIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <select id="budgetRange" name="budgetRange" value={formData.budgetRange} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                          <option value="Under 500">Under $500</option>
                          <option value="500-1000">$500 - $1,000</option>
                          <option value="1000-2000">$1,000 - $2,000</option>
                          <option value="2000-3000">$2,000 - $3,000</option>
                          <option value="3000-5000">$3,000 - $5,000</option>
                          <option value="Over 5000">Over $5,000</option>
                          <option value="Flexible">
                            Flexible / To be discussed
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Contact Details Section */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Contact Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" id="contactName" name="contactName" value={formData.contactName} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Full name" required />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                        Organization{' '}
                        <span className="text-gray-500 text-xs">
                          (if applicable)
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <BuildingIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" id="organization" name="organization" value={formData.organization} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Company or organization name" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MailIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="your@email.com" required />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PhoneIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="(123) 456-7890" required />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Role
                      </label>
                      <select id="role" name="role" value={formData.role} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="Venue Owner">Venue Owner</option>
                        <option value="Event Planner">Event Planner</option>
                        <option value="Promoter">Promoter</option>
                        <option value="Individual">Individual</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                {/* Additional Information Section */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Additional Information
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Description{' '}
                        <span className="text-gray-500 text-xs">
                          (1000 char max)
                        </span>
                      </label>
                      <textarea id="eventDescription" name="eventDescription" value={formData.eventDescription} onChange={handleInputChange} rows={4} maxLength={1000} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Please provide details about your event, including the atmosphere you're trying to create, any themes, and specific performance expectations."></textarea>
                      <div className="text-xs text-gray-500 mt-1 text-right">
                        {formData.eventDescription.length}/1000 characters
                      </div>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requirements
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {Object.entries(formData.specialRequirements).map(([key, value]) => <div key={key} className="flex items-start">
                              <div className="flex items-center h-5">
                                <input id={`req-${key}`} name={`specialRequirements.${key}`} type="checkbox" checked={value as boolean} onChange={handleCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                              </div>
                              <div className="ml-3 text-sm">
                                <label htmlFor={`req-${key}`} className="font-medium text-gray-700">
                                  {key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </label>
                              </div>
                            </div>)}
                      </div>
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-gray-700 mb-1">
                        Have you booked live music before?
                      </span>
                      <div className="mt-1 space-x-6">
                        <label className="inline-flex items-center">
                          <input type="radio" name="previousExperience" value="yes" checked={formData.previousExperience === 'yes'} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                          <span className="ml-2 text-sm text-gray-700">
                            Yes
                          </span>
                        </label>
                        <label className="inline-flex items-center">
                          <input type="radio" name="previousExperience" value="no" checked={formData.previousExperience === 'no'} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                          <span className="ml-2 text-sm text-gray-700">No</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="heardAbout" className="block text-sm font-medium text-gray-700 mb-1">
                        How did you hear about this performer?
                      </label>
                      <select id="heardAbout" name="heardAbout" value={formData.heardAbout} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Please select</option>
                        <option value="When's The Fun Platform">
                          When's The Fun Platform
                        </option>
                        <option value="Search Engine">Search Engine</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Friend/Referral">Friend/Referral</option>
                        <option value="Saw them perform">
                          Saw them perform
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-1">
                        Attach Event Rider or Additional Documents{' '}
                        <span className="text-gray-500 text-xs">
                          (optional)
                        </span>
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="fileUpload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                              <span>Upload a file</span>
                              <input id="fileUpload" name="fileUpload" type="file" className="sr-only" onChange={handleFileUpload} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PDF, DOC, DOCX up to 10MB
                          </p>
                        </div>
                      </div>
                      {uploadedFile && <div className="mt-2 flex items-center text-sm text-gray-600">
                          <FileTextIcon className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{uploadedFile.name}</span>
                          <button type="button" onClick={() => setUploadedFile(null)} className="ml-2 text-red-600 hover:text-red-800">
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>}
                    </div>
                  </div>
                </div>
                {/* Terms and Agreements */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="agreeToTerms" name="agreeToTerms" type="checkbox" checked={formData.agreeToTerms} onChange={handleCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" required />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                        I agree to the{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-800">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-800">
                          Privacy Policy
                        </a>{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <p className="text-gray-500">
                        By submitting this form, you agree to share your contact
                        information with the performer and When's The Fun
                        platform.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Form Actions */}
                <div className="p-6 flex flex-col sm:flex-row-reverse sm:justify-between gap-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button type="submit" disabled={isSubmitting} className={`px-6 py-3 rounded-md text-white font-medium flex items-center justify-center ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                      {isSubmitting ? <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending Inquiry...
                        </> : <>
                          <SendIcon className="h-4 w-4 mr-2" />
                          Send Booking Inquiry
                        </>}
                    </button>
                    <button type="button" onClick={handleSaveDraft} className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center">
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Save Draft
                    </button>
                  </div>
                  <button type="button" onClick={handleReturnToProfile} className="px-6 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center justify-center sm:justify-start">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
            {/* Booking Tips */}
            <div className="bg-indigo-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-indigo-800 mb-4 flex items-center">
                <HelpCircleIcon className="h-5 w-5 mr-2" />
                Tips for a Successful Booking
              </h3>
              <ul className="space-y-2 text-indigo-700">
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    Be specific about your event type, atmosphere, and audience
                    to help the performer prepare.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    Include alternative dates if possible to increase chances of
                    availability.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    Provide accurate attendance numbers to ensure appropriate
                    performance setup.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    Consider technical requirements like sound system, lighting,
                    and stage space.
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    Book well in advance (3+ months) for best availability,
                    especially for weekend dates.
                  </span>
                </li>
              </ul>
              <div className="mt-4 text-sm text-indigo-700">
                Need help with your booking?{' '}
                <a href="#" className="font-medium underline">
                  Contact our booking specialists
                </a>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};