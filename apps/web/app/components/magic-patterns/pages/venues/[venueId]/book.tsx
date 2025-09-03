import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { mockVenues } from '../../../mockdata/venues';
import { ArrowLeftIcon, CheckIcon, ChevronRightIcon, AlertCircleIcon } from 'lucide-react';
import { EventDetailsForm } from '../../../components/booking-form/EventDetailsForm';
import { SpaceSetupForm } from '../../../components/booking-form/SpaceSetupForm';
import { ServicesAddonsForm } from '../../../components/booking-form/ServicesAddonsForm';
import { ContactPaymentForm } from '../../../components/booking-form/ContactPaymentForm';
import { ReviewSubmitForm } from '../../../components/booking-form/ReviewSubmitForm';
import { BookingFormProgress } from '../../../components/booking-form/BookingFormProgress';
import { BookingConfirmation } from '../../../components/booking-form/BookingConfirmation';
// Mock user data for pre-filling the form
const mockUser = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '(555) 123-4567',
  organization: 'Johnson & Associates'
};
export default function VenueBookingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [venue, setVenue] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // Initial form state with all fields needed across all steps
  const [formData, setFormData] = useState({
    // Step 1: Event Details
    eventType: '',
    eventName: '',
    eventDescription: '',
    expectedAttendance: '',
    ageRange: 'All ages',
    isPublicEvent: false,
    primaryDate: '',
    alternativeDates: ['', ''],
    startTime: '18:00',
    endTime: '23:00',
    setupTime: '2 hours',
    breakdownTime: '1 hour',
    isFlexibleDates: false,
    // Step 2: Space & Setup
    selectedSpaces: [] as string[],
    layoutPreference: 'reception',
    customLayoutRequirements: '',
    equipmentNeeds: {
      projector: false,
      microphone: false,
      speakers: false,
      stage: false,
      lighting: false,
      danceFloor: false,
      tables: false,
      chairs: false,
      tablesCount: 10,
      chairsCount: 100
    },
    cateringNeeds: {
      service: 'none',
      dietaryRequirements: '',
      barPackage: 'none' // none, beer-wine, full-bar, custom
    },
    // Step 3: Services & Add-ons
    additionalServices: {
      eventCoordinator: false,
      securityStaff: false,
      valetParking: false,
      decorationServices: false,
      cleanupCrew: false
    },
    vendorInformation: {
      usingVenuePreferred: true,
      outsideVendors: [] as Array<{
        type: string;
        name: string;
        contact: string;
      }>
    },
    // Step 4: Contact & Payment
    contactInfo: {
      fullName: mockUser.name,
      organization: mockUser.organization,
      email: mockUser.email,
      phone: mockUser.phone,
      bestContactTime: 'anytime'
    },
    budgetRange: {
      min: 0,
      max: 10000
    },
    paymentMethod: 'creditCard',
    specialNotes: '',
    // Step 5: Review & Submit
    termsAccepted: false,
    cancellationPolicyAccepted: false
  });
  // Pricing calculation state
  const [pricing, setPricing] = useState({
    basePrice: 0,
    spacesPrice: 0,
    setupBreakdownPrice: 0,
    equipmentPrice: 0,
    cateringPrice: 0,
    servicesPrice: 0,
    subtotal: 0,
    taxFees: 0,
    total: 0,
    deposit: 0
  });
  // Load venue data
  useEffect(() => {
    setIsLoading(true);
    // In a real app, we would fetch the venue by ID from the URL
    // For this example, we'll use the first venue from our mock data
    try {
      const venueData = mockVenues[0];
      setVenue(venueData);
      // Pre-fill the form with any data that might be passed from the venue page
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedDate = tomorrow.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        primaryDate: formattedDate
      }));
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load venue data. Please try again.');
      setIsLoading(false);
    }
  }, []);
  // Calculate pricing whenever relevant form data changes
  useEffect(() => {
    if (!venue) return;
    // Calculate hours duration
    const startHour = parseInt(formData.startTime.split(':')[0]);
    const endHour = parseInt(formData.endTime.split(':')[0]);
    let hours = endHour >= startHour ? endHour - startHour : 24 - startHour + endHour;
    // Base price calculation
    let basePrice = venue.pricePerHour * hours;
    // Selected spaces price (if multiple spaces are available)
    let spacesPrice = 0;
    if (venue.spaces && formData.selectedSpaces.length > 0) {
      const selectedSpaces = venue.spaces.filter((space: any) => formData.selectedSpaces.includes(space.id));
      spacesPrice = selectedSpaces.reduce((total: number, space: any) => {
        return total + space.pricePerHour * hours;
      }, 0);
      // If spaces are selected, use their price instead of base price
      if (spacesPrice > 0) {
        basePrice = 0;
      }
    }
    // Setup and breakdown price
    const setupHours = parseInt(formData.setupTime.split(' ')[0]) || 0;
    const breakdownHours = parseInt(formData.breakdownTime.split(' ')[0]) || 0;
    const setupBreakdownPrice = (setupHours + breakdownHours) * (venue.pricePerHour * 0.5);
    // Equipment price
    let equipmentPrice = 0;
    if (formData.equipmentNeeds.projector) equipmentPrice += 150;
    if (formData.equipmentNeeds.microphone) equipmentPrice += 50;
    if (formData.equipmentNeeds.speakers) equipmentPrice += 200;
    if (formData.equipmentNeeds.stage) equipmentPrice += 500;
    if (formData.equipmentNeeds.lighting) equipmentPrice += 300;
    if (formData.equipmentNeeds.danceFloor) equipmentPrice += 400;
    // Catering price (estimated)
    let cateringPrice = 0;
    const guestCount = parseInt(formData.expectedAttendance) || 0;
    if (formData.cateringNeeds.service === 'basic') {
      cateringPrice = guestCount * 35; // $35 per person for basic catering
    } else if (formData.cateringNeeds.service === 'full') {
      cateringPrice = guestCount * 65; // $65 per person for full service
    }
    // Bar package
    if (formData.cateringNeeds.barPackage === 'beer-wine') {
      cateringPrice += guestCount * 25; // $25 per person for beer and wine
    } else if (formData.cateringNeeds.barPackage === 'full-bar') {
      cateringPrice += guestCount * 45; // $45 per person for full bar
    }
    // Additional services
    let servicesPrice = 0;
    if (formData.additionalServices.eventCoordinator) servicesPrice += 500;
    if (formData.additionalServices.securityStaff) servicesPrice += 350;
    if (formData.additionalServices.valetParking) servicesPrice += 600;
    if (formData.additionalServices.decorationServices) servicesPrice += 800;
    if (formData.additionalServices.cleanupCrew) servicesPrice += 250;
    // Calculate subtotal
    const subtotal = basePrice + spacesPrice + setupBreakdownPrice + equipmentPrice + cateringPrice + servicesPrice;
    // Tax and service fees (typically 20-25%)
    const taxFees = Math.round(subtotal * 0.225);
    // Total
    const total = subtotal + taxFees;
    // Deposit (typically 25-50% of total)
    const deposit = Math.round(total * 0.3);
    setPricing({
      basePrice,
      spacesPrice,
      setupBreakdownPrice,
      equipmentPrice,
      cateringPrice,
      servicesPrice,
      subtotal,
      taxFees,
      total,
      deposit
    });
  }, [venue, formData]);
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      // Handle nested properties (e.g., equipmentNeeds.projector)
      if (name.includes('.')) {
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
    }
    // Handle all other input types
    else {
      // Handle nested properties
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: value
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
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
  // Handle space selection
  const handleSpaceSelection = (spaceId: string, isSelected: boolean) => {
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        selectedSpaces: [...prev.selectedSpaces, spaceId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedSpaces: prev.selectedSpaces.filter(id => id !== spaceId)
      }));
    }
  };
  // Handle adding outside vendor
  const handleAddVendor = (vendor: {
    type: string;
    name: string;
    contact: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      vendorInformation: {
        ...prev.vendorInformation,
        outsideVendors: [...prev.vendorInformation.outsideVendors, vendor]
      }
    }));
  };
  // Handle removing outside vendor
  const handleRemoveVendor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vendorInformation: {
        ...prev.vendorInformation,
        outsideVendors: prev.vendorInformation.outsideVendors.filter((_, i) => i !== index)
      }
    }));
  };
  // Handle budget range change
  const handleBudgetChange = (min: number, max: number) => {
    setFormData(prev => ({
      ...prev,
      budgetRange: {
        min,
        max
      }
    }));
  };
  // Navigation between steps
  const handleNextStep = () => {
    typeof window !== "undefined" && window.scrollTo(0, 0);
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };
  const handlePrevStep = () => {
    typeof window !== "undefined" && window.scrollTo(0, 0);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };
  // Form submission
  const handleSubmit = () => {
    // In a real app, this would send the data to a server
    console.log('Submitting booking request:', formData);
    // Generate a booking reference
    const reference = `BK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setBookingReference(reference);
    // Show confirmation
    setIsSubmitted(true);
    typeof window !== "undefined" && window.scrollTo(0, 0);
  };
  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Your booking information will be lost.')) {
      navigate(`/venues/${venue.id}/${venue.name.toLowerCase().replace(/\s+/g, '-')}`);
    }
  };
  // Return to venue page
  const handleReturnToVenue = () => {
    navigate(`/venues/${venue.id}/${venue.name.toLowerCase().replace(/\s+/g, '-')}`);
  };
  // Validate current step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        // Event Details
        return !!formData.eventType && !!formData.eventName && !!formData.expectedAttendance && !!formData.primaryDate;
      case 2:
        // Space & Setup
        // If venue has multiple spaces, at least one must be selected
        if (venue?.spaces?.length > 1 && formData.selectedSpaces.length === 0) {
          return false;
        }
        return true;
      case 3:
        // Services & Add-ons
        // If using outside vendors, must have at least one vendor listed
        if (!formData.vendorInformation.usingVenuePreferred && formData.vendorInformation.outsideVendors.length === 0) {
          return false;
        }
        return true;
      case 4:
        // Contact & Payment
        return !!formData.contactInfo.fullName && !!formData.contactInfo.email && !!formData.contactInfo.phone;
      case 5:
        // Review & Submit
        return formData.termsAccepted && formData.cancellationPolicyAccepted;
      default:
        return true;
    }
  };
  // If venue is not loaded yet, show loading
  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading venue information...</p>
        </div>
      </div>;
  }
  // If there was an error loading the venue
  if (error) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="flex justify-center mb-4">
            <AlertCircleIcon className="h-16 w-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => navigate('/venues')} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Return to Venues
          </button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={handleReturnToVenue} className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              <span>Back to {venue.name}</span>
            </button>
            {!isSubmitted && <button onClick={handleCancel} className="text-gray-600 hover:text-gray-900 text-sm">
                Cancel
              </button>}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title & Progress Indicator */}
        {!isSubmitted && <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Book {venue.name}
              </h1>
              <div className="text-right">
                <div className="text-sm text-gray-500">Estimated Total</div>
                <div className="text-xl font-bold text-gray-900">
                  ${pricing.total.toLocaleString()}
                </div>
              </div>
            </div>
            <BookingFormProgress currentStep={currentStep} steps={['Event Details', 'Space & Setup', 'Services', 'Contact', 'Review']} />
          </div>}
        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {isSubmitted ? <BookingConfirmation venue={venue} formData={formData} pricing={pricing} bookingReference={bookingReference} onViewBookings={() => navigate('/my/bookings')} onBrowseVenues={() => navigate('/venues')} /> : <>
              {/* Step 1: Event Details */}
              {currentStep === 1 && <EventDetailsForm formData={formData} onInputChange={handleInputChange} onAlternativeDateChange={handleAlternativeDateChange} onNextStep={handleNextStep} isValid={validateStep(1)} />}
              {/* Step 2: Space & Setup */}
              {currentStep === 2 && <SpaceSetupForm formData={formData} venue={venue} onInputChange={handleInputChange} onSpaceSelection={handleSpaceSelection} onPrevStep={handlePrevStep} onNextStep={handleNextStep} isValid={validateStep(2)} />}
              {/* Step 3: Services & Add-ons */}
              {currentStep === 3 && <ServicesAddonsForm formData={formData} venue={venue} onInputChange={handleInputChange} onAddVendor={handleAddVendor} onRemoveVendor={handleRemoveVendor} onPrevStep={handlePrevStep} onNextStep={handleNextStep} isValid={validateStep(3)} />}
              {/* Step 4: Contact & Payment */}
              {currentStep === 4 && <ContactPaymentForm formData={formData} onInputChange={handleInputChange} onBudgetChange={handleBudgetChange} onPrevStep={handlePrevStep} onNextStep={handleNextStep} isValid={validateStep(4)} />}
              {/* Step 5: Review & Submit */}
              {currentStep === 5 && <ReviewSubmitForm formData={formData} venue={venue} pricing={pricing} onInputChange={handleInputChange} onPrevStep={handlePrevStep} onSubmit={handleSubmit} isValid={validateStep(5)} />}
            </>}
        </div>
        {/* Price Summary (Mobile) */}
        {!isSubmitted && <div className="mt-6 lg:hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900">Price Summary</h3>
                <span className="text-sm text-indigo-600">See Details</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-900">Estimated Total</span>
                  <span className="text-gray-900">
                    ${pricing.total.toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  ${pricing.deposit.toLocaleString()} deposit due at booking
                </div>
              </div>
            </div>
          </div>}
      </div>
      {/* Fixed Bottom Navigation (Mobile) */}
      {!isSubmitted && <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="flex justify-between items-center">
            {currentStep > 1 ? <button onClick={handlePrevStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium">
                Back
              </button> : <div></div>}
            <button onClick={currentStep < 5 ? handleNextStep : handleSubmit} disabled={!validateStep(currentStep)} className={`px-6 py-2 rounded-md text-white font-medium ${validateStep(currentStep) ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}>
              {currentStep < 5 ? 'Continue' : 'Submit Request'}
            </button>
          </div>
        </div>}
    </div>;
}