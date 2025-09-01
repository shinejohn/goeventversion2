import React, { useState } from 'react';
import { ArrowLeftIcon, BuildingIcon, CheckCircleIcon, HomeIcon, ChevronRightIcon, MapPinIcon, UsersIcon, DollarSignIcon, ImageIcon, ClipboardIcon, CheckIcon, ClockIcon, InfoIcon, PlusIcon, XIcon, CalendarIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
export const SubmitVenuePage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    venueName: '',
    venueType: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    // Location
    address: '',
    city: '',
    state: '',
    zip: '',
    // Features
    capacity: '',
    squareFootage: '',
    amenities: [] as string[],
    accessibility: [] as string[],
    // Availability & Pricing
    availableDays: [] as string[],
    availableTimeStart: '09:00',
    availableTimeEnd: '23:00',
    basePrice: '',
    pricingModel: 'hourly',
    minimumHours: '4',
    // Photos & Documents
    photos: [] as File[],
    floorPlan: null as File | null,
    documents: [] as File[],
    // Terms & Agreement
    termsAgreed: false,
    listingAgreed: false
  });
  // Available venue types
  const venueTypes = ['Event Space', 'Conference Center', 'Banquet Hall', 'Wedding Venue', 'Studio', 'Rooftop', 'Garden/Outdoor', 'Restaurant/Bar', 'Theater', 'Gallery', 'Warehouse', 'Loft', 'Hotel', 'Private Residence', 'Other'];
  // Available amenities
  const amenityOptions = ['WiFi', 'Sound System', 'Projector/Screen', 'Stage', 'Kitchen', 'Bar', 'Furniture', 'Lighting', 'Parking', 'Outdoor Space', 'Catering Services', 'Security', 'Coat Check', 'Restrooms', 'Air Conditioning', 'Heating'];
  // Accessibility options
  const accessibilityOptions = ['Wheelchair Accessible', 'Elevator Access', 'Accessible Restrooms', 'Accessible Parking', 'Step-free Access', 'Braille Signage', 'Hearing Loop System'];
  // Days of the week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };
  const handleCheckboxChange = (name: string, value: string, isChecked: boolean) => {
    if (isChecked) {
      setFormData({
        ...formData,
        [name]: [...formData[name as keyof typeof formData], value]
      });
    } else {
      setFormData({
        ...formData,
        [name]: (formData[name as keyof typeof formData] as string[]).filter(item => item !== value)
      });
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = e.target.files;
    if (!files) return;
    if (fieldName === 'photos') {
      setFormData({
        ...formData,
        photos: [...formData.photos, ...Array.from(files)]
      });
    } else if (fieldName === 'floorPlan') {
      setFormData({
        ...formData,
        floorPlan: files[0]
      });
    } else if (fieldName === 'documents') {
      setFormData({
        ...formData,
        documents: [...formData.documents, ...Array.from(files)]
      });
    }
  };
  const handleRemoveFile = (fieldName: string, index: number) => {
    if (fieldName === 'photos') {
      const updatedPhotos = [...formData.photos];
      updatedPhotos.splice(index, 1);
      setFormData({
        ...formData,
        photos: updatedPhotos
      });
    } else if (fieldName === 'floorPlan') {
      setFormData({
        ...formData,
        floorPlan: null
      });
    } else if (fieldName === 'documents') {
      const updatedDocuments = [...formData.documents];
      updatedDocuments.splice(index, 1);
      setFormData({
        ...formData,
        documents: updatedDocuments
      });
    }
  };
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        // Basic Info
        return formData.venueName.trim() !== '' && formData.venueType !== '' && formData.description.trim() !== '' && formData.email.trim() !== '';
      case 2:
        // Location
        return formData.address.trim() !== '' && formData.city.trim() !== '' && formData.state.trim() !== '' && formData.zip.trim() !== '';
      case 3:
        // Features
        return formData.capacity.trim() !== '' && formData.squareFootage.trim() !== '' && formData.amenities.length > 0;
      case 4:
        // Availability & Pricing
        return formData.availableDays.length > 0 && formData.basePrice.trim() !== '';
      case 5:
        // Photos & Documents
        return formData.photos.length > 0;
      case 6:
        // Terms & Agreement
        return formData.termsAgreed && formData.listingAgreed;
      default:
        return true;
    }
  };
  const nextStep = () => {
    if (validateCurrentStep()) {
      window.scrollTo(0, 0);
      setCurrentStep(currentStep + 1);
    } else {
      alert('Please fill out all required fields before proceeding.');
    }
  };
  const prevStep = () => {
    window.scrollTo(0, 0);
    setCurrentStep(currentStep - 1);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) {
      alert('Please agree to the terms and conditions.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error submitting venue:', error);
      alert('An error occurred while submitting your venue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleBackToVenues = () => {
    navigateTo('/venues');
  };
  return <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm text-gray-500">
            <button onClick={() => navigateTo('/')} className="hover:text-gray-700 flex items-center">
              <HomeIcon className="h-4 w-4 mr-1" />
              Home
            </button>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <button onClick={() => navigateTo('/venues')} className="hover:text-gray-700">
              Venues
            </button>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium">Submit Venue</span>
          </nav>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!isSubmitted ? <>
            {/* Form Header */}
            <div className="text-center mb-8">
              <BuildingIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900">
                Submit Your Venue
              </h1>
              <p className="mt-2 text-gray-600">
                List your space on our platform and connect with event planners
                and organizers.
              </p>
            </div>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5, 6].map(step => <div key={step} className={`flex flex-col items-center ${step <= currentStep ? 'text-indigo-600' : 'text-gray-400'}`}>
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step < currentStep ? 'bg-indigo-600 text-white' : step === currentStep ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-600' : 'bg-gray-200 text-gray-500'}`}>
                      {step < currentStep ? <CheckIcon className="h-5 w-5" /> : step}
                    </div>
                    <div className="text-xs mt-1 hidden sm:block">
                      {step === 1 ? 'Basic Info' : step === 2 ? 'Location' : step === 3 ? 'Features' : step === 4 ? 'Availability' : step === 5 ? 'Photos' : 'Review'}
                    </div>
                  </div>)}
              </div>
              <div className="relative mt-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-between">
                  {[1, 2, 3, 4, 5, 6].map(step => <div key={step} className={`h-5 w-5 rounded-full ${step <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>)}
                </div>
              </div>
            </div>
            {/* Form Content */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Basic Information */}
                {currentStep === 1 && <div className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <InfoIcon className="h-5 w-5 text-indigo-500 mr-2" />
                      Basic Information
                    </h2>
                    <p className="text-sm text-gray-600">
                      Let's start with the essential details about your venue.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="venueName" className="block text-sm font-medium text-gray-700 mb-1">
                          Venue Name *
                        </label>
                        <input type="text" id="venueName" name="venueName" required value={formData.venueName} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g. The Grand Hall" />
                      </div>
                      <div>
                        <label htmlFor="venueType" className="block text-sm font-medium text-gray-700 mb-1">
                          Venue Type *
                        </label>
                        <select id="venueType" name="venueType" required value={formData.venueType} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          <option value="">Select venue type</option>
                          {venueTypes.map(type => <option key={type} value={type}>
                              {type}
                            </option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description *
                        </label>
                        <textarea id="description" name="description" rows={4} required value={formData.description} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Describe your venue, its unique features, and what makes it special..."></textarea>
                        <p className="mt-1 text-xs text-gray-500">
                          Minimum 50 characters. Include details about the
                          atmosphere, history, and unique selling points.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="(123) 456-7890" />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                          </label>
                          <input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="venue@example.com" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input type="url" id="website" name="website" value={formData.website} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://www.yourvenue.com" />
                      </div>
                    </div>
                  </div>}
                {/* Step 2: Location */}
                {currentStep === 2 && <div className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <MapPinIcon className="h-5 w-5 text-indigo-500 mr-2" />
                      Location
                    </h2>
                    <p className="text-sm text-gray-600">
                      Provide the address and location details for your venue.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address *
                        </label>
                        <input type="text" id="address" name="address" required value={formData.address} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="123 Main Street" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input type="text" id="city" name="city" required value={formData.city} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Seattle" />
                        </div>
                        <div className="md:col-span-1">
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <input type="text" id="state" name="state" required value={formData.state} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="WA" />
                        </div>
                        <div className="md:col-span-1">
                          <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code *
                          </label>
                          <input type="text" id="zip" name="zip" required value={formData.zip} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="98101" />
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-sm text-gray-700">
                          Your venue's exact location will be shown on a map to
                          help potential clients find you. If you have any
                          special instructions for finding the venue, you can
                          add them in the description.
                        </p>
                      </div>
                    </div>
                  </div>}
                {/* Step 3: Features */}
                {currentStep === 3 && <div className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <UsersIcon className="h-5 w-5 text-indigo-500 mr-2" />
                      Features & Amenities
                    </h2>
                    <p className="text-sm text-gray-600">
                      Tell us about your venue's capacity, features, and
                      amenities.
                    </p>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                            Maximum Capacity *
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input type="number" id="capacity" name="capacity" min="1" required value={formData.capacity} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="100" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                people
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700 mb-1">
                            Square Footage *
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input type="number" id="squareFootage" name="squareFootage" min="1" required value={formData.squareFootage} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="2000" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                sq ft
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amenities *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {amenityOptions.map(amenity => <div key={amenity} className="flex items-start">
                              <div className="flex items-center h-5">
                                <input id={`amenity-${amenity}`} name={`amenity-${amenity}`} type="checkbox" checked={formData.amenities.includes(amenity)} onChange={e => handleCheckboxChange('amenities', amenity, e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                              </div>
                              <div className="ml-2 text-sm">
                                <label htmlFor={`amenity-${amenity}`} className="font-medium text-gray-700">
                                  {amenity}
                                </label>
                              </div>
                            </div>)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Accessibility Features
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {accessibilityOptions.map(option => <div key={option} className="flex items-start">
                              <div className="flex items-center h-5">
                                <input id={`accessibility-${option}`} name={`accessibility-${option}`} type="checkbox" checked={formData.accessibility.includes(option)} onChange={e => handleCheckboxChange('accessibility', option, e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                              </div>
                              <div className="ml-2 text-sm">
                                <label htmlFor={`accessibility-${option}`} className="font-medium text-gray-700">
                                  {option}
                                </label>
                              </div>
                            </div>)}
                        </div>
                      </div>
                    </div>
                  </div>}
                {/* Step 4: Availability & Pricing */}
                {currentStep === 4 && <div className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <CalendarIcon className="h-5 w-5 text-indigo-500 mr-2" />
                      Availability & Pricing
                    </h2>
                    <p className="text-sm text-gray-600">
                      Set your venue's availability and pricing details.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Available Days *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {daysOfWeek.map(day => <div key={day} className="flex items-start">
                              <div className="flex items-center h-5">
                                <input id={`day-${day}`} name={`day-${day}`} type="checkbox" checked={formData.availableDays.includes(day)} onChange={e => handleCheckboxChange('availableDays', day, e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                              </div>
                              <div className="ml-2 text-sm">
                                <label htmlFor={`day-${day}`} className="font-medium text-gray-700">
                                  {day}
                                </label>
                              </div>
                            </div>)}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="availableTimeStart" className="block text-sm font-medium text-gray-700 mb-1">
                            Available From
                          </label>
                          <select id="availableTimeStart" name="availableTimeStart" value={formData.availableTimeStart} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            {Array.from({
                        length: 24
                      }).map((_, i) => <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                              </option>)}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="availableTimeEnd" className="block text-sm font-medium text-gray-700 mb-1">
                            Available Until
                          </label>
                          <select id="availableTimeEnd" name="availableTimeEnd" value={formData.availableTimeEnd} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            {Array.from({
                        length: 24
                      }).map((_, i) => <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                {i === 0 ? '12:00 AM' : i < 12 ? `${i}:00 AM` : i === 12 ? '12:00 PM' : `${i - 12}:00 PM`}
                              </option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                          <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
                            Base Price *
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">
                                $
                              </span>
                            </div>
                            <input type="number" id="basePrice" name="basePrice" min="0" required value={formData.basePrice} onChange={handleInputChange} className="block w-full pl-7 pr-12 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="100" />
                          </div>
                        </div>
                        <div className="md:col-span-1">
                          <label htmlFor="pricingModel" className="block text-sm font-medium text-gray-700 mb-1">
                            Pricing Model
                          </label>
                          <select id="pricingModel" name="pricingModel" value={formData.pricingModel} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="hourly">Per Hour</option>
                            <option value="daily">Per Day</option>
                            <option value="flat">Flat Rate</option>
                          </select>
                        </div>
                        <div className="md:col-span-1">
                          <label htmlFor="minimumHours" className="block text-sm font-medium text-gray-700 mb-1">
                            Minimum Hours
                          </label>
                          <select id="minimumHours" name="minimumHours" value={formData.minimumHours} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="1">1 hour</option>
                            <option value="2">2 hours</option>
                            <option value="3">3 hours</option>
                            <option value="4">4 hours</option>
                            <option value="6">6 hours</option>
                            <option value="8">8 hours</option>
                          </select>
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <InfoIcon className="h-5 w-5 text-yellow-400" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                              Pricing Information
                            </h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <p>
                                The base price is the starting point for
                                bookings. You'll have the opportunity to
                                customize pricing for specific dates, add
                                cleaning fees, security deposits, and other
                                charges after your listing is approved.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>}
                {/* Step 5: Photos & Documents */}
                {currentStep === 5 && <div className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <ImageIcon className="h-5 w-5 text-indigo-500 mr-2" />
                      Photos & Documents
                    </h2>
                    <p className="text-sm text-gray-600">
                      Upload photos and documents to showcase your venue.
                    </p>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Venue Photos *
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="photos" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                <span>Upload photos</span>
                                <input id="photos" name="photos" type="file" multiple accept="image/*" className="sr-only" onChange={e => handleFileChange(e, 'photos')} />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          Upload at least 5 high-quality photos showcasing
                          different areas of your venue.
                        </p>
                        {formData.photos.length > 0 && <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {formData.photos.map((photo, index) => <div key={index} className="relative group rounded-md overflow-hidden">
                                <img src={URL.createObjectURL(photo)} alt={`Venue photo ${index + 1}`} className="h-24 w-full object-cover" />
                                <button type="button" onClick={() => handleRemoveFile('photos', index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <XIcon className="h-4 w-4" />
                                </button>
                              </div>)}
                          </div>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Floor Plan (Optional)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="floorPlan" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                <span>Upload floor plan</span>
                                <input id="floorPlan" name="floorPlan" type="file" accept="image/*,.pdf" className="sr-only" onChange={e => handleFileChange(e, 'floorPlan')} />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PDF or image file up to 10MB
                            </p>
                          </div>
                        </div>
                        {formData.floorPlan && <div className="mt-4 relative group rounded-md overflow-hidden border border-gray-300 p-2">
                            <div className="flex items-center">
                              <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                              </svg>
                              <span className="ml-2 text-sm text-gray-700">
                                {formData.floorPlan.name}
                              </span>
                              <button type="button" onClick={() => handleRemoveFile('floorPlan', 0)} className="ml-auto bg-red-600 text-white rounded-full p-1">
                                <XIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Documents (Optional)
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="documents" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                <span>Upload documents</span>
                                <input id="documents" name="documents" type="file" multiple accept=".pdf,.doc,.docx" className="sr-only" onChange={e => handleFileChange(e, 'documents')} />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PDF, DOC, DOCX up to 10MB
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          Upload any additional documents such as venue
                          policies, catering menus, or rental agreements.
                        </p>
                        {formData.documents.length > 0 && <div className="mt-4 space-y-2">
                            {formData.documents.map((doc, index) => <div key={index} className="relative group rounded-md overflow-hidden border border-gray-300 p-2">
                                <div className="flex items-center">
                                  <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                  </svg>
                                  <span className="ml-2 text-sm text-gray-700">
                                    {doc.name}
                                  </span>
                                  <button type="button" onClick={() => handleRemoveFile('documents', index)} className="ml-auto bg-red-600 text-white rounded-full p-1">
                                    <XIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>)}
                          </div>}
                      </div>
                    </div>
                  </div>}
                {/* Step 6: Review & Submit */}
                {currentStep === 6 && <div className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <CheckIcon className="h-5 w-5 text-indigo-500 mr-2" />
                      Review & Submit
                    </h2>
                    <p className="text-sm text-gray-600">
                      Please review your venue information and submit your
                      listing.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Venue Summary
                      </h3>
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Venue Name
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formData.venueName}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Venue Type
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formData.venueType}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Address
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formData.address}, {formData.city},{' '}
                            {formData.state} {formData.zip}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Capacity
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formData.capacity} people
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Square Footage
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formData.squareFootage} sq ft
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Base Price
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            ${formData.basePrice}{' '}
                            {formData.pricingModel === 'hourly' ? 'per hour' : formData.pricingModel === 'daily' ? 'per day' : 'flat rate'}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Available Days
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formData.availableDays.join(', ')}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Available Hours
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formData.availableTimeStart} to{' '}
                            {formData.availableTimeEnd}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Photos
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {formData.photos.length} photos uploaded
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="termsAgreed" name="termsAgreed" type="checkbox" checked={formData.termsAgreed} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="termsAgreed" className="font-medium text-gray-700">
                            I agree to the{' '}
                            <a href="#" className="text-indigo-600 hover:text-indigo-500">
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-indigo-600 hover:text-indigo-500">
                              Privacy Policy
                            </a>
                          </label>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="listingAgreed" name="listingAgreed" type="checkbox" checked={formData.listingAgreed} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="listingAgreed" className="font-medium text-gray-700">
                            I confirm that all information provided is accurate
                            and I have the authority to list this venue
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>}
                <div className="px-6 py-4 bg-gray-50 flex justify-between">
                  {currentStep > 1 && <button type="button" onClick={prevStep} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Back
                    </button>}
                  {currentStep === 1 && <button type="button" onClick={() => navigateTo('/venues')} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Cancel
                    </button>}
                  {currentStep < 6 ? <button type="button" onClick={nextStep} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Continue
                    </button> : <button type="submit" disabled={isSubmitting || !formData.termsAgreed || !formData.listingAgreed} className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting || !formData.termsAgreed || !formData.listingAgreed ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {isSubmitting ? 'Submitting...' : 'Submit Venue'}
                    </button>}
                </div>
              </form>
            </div>
          </> : <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Venue Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for submitting your venue, {formData.venueName}. Our
                team will review your submission and get back to you within 2-3
                business days.
              </p>
              <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
                <h3 className="font-medium text-gray-900 mb-3">Next Steps</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>
                      Our team will review your venue details and photos
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <span>
                      You'll receive an email notification when your venue is
                      approved
                    </span>
                  </li>
                  <li className="flex items-start">
                    <DollarSignIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                    <span>
                      Once approved, you can manage your venue listing,
                      availability, and pricing
                    </span>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => navigateTo('/venues/management')} className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Go to Venue Management
                </button>
                <button onClick={() => navigateTo('/venues')} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                  Browse Venues
                </button>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};