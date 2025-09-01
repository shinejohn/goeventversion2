import React, { useState } from 'react';
import { XIcon, CalendarIcon, ClockIcon, UsersIcon, CheckIcon } from 'lucide-react';
type BookingRequestPopupProps = {
  venueName: string;
  selectedDate: Date | null;
  startTime: string;
  endTime: string;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => void;
};
export type BookingFormData = {
  eventType: string;
  guestCount: number;
  additionalInfo: string;
  name: string;
  email: string;
  phone: string;
  agreeToTerms: boolean;
};
export const BookingRequestPopup = ({
  venueName,
  selectedDate,
  startTime,
  endTime,
  onClose,
  onSubmit
}: BookingRequestPopupProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    eventType: '',
    guestCount: 50,
    additionalInfo: '',
    name: '',
    email: '',
    phone: '',
    agreeToTerms: false
  });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 1000);
  };
  const handleNextStep = () => {
    setStep(2);
  };
  const handlePreviousStep = () => {
    setStep(1);
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="font-bold text-xl">Request to Book {venueName}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-500">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        {/* Booking Summary */}
        <div className="bg-indigo-50 p-4">
          <div className="flex items-center mb-2">
            <CalendarIcon className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="font-medium">
              {selectedDate ? selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            }) : 'Date not selected'}
            </span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="font-medium">
              {startTime} - {endTime}
            </span>
          </div>
        </div>
        <form onSubmit={step === 1 ? handleNextStep : handleSubmit}>
          <div className="p-6">
            {step === 1 ? <>
                <h3 className="font-medium text-lg mb-4">Event Details</h3>
                <div className="mb-4">
                  <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type *
                  </label>
                  <select id="eventType" name="eventType" required value={formData.eventType} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">Select event type</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Concert">Concert</option>
                    <option value="Conference">Conference</option>
                    <option value="Photoshoot">Photoshoot</option>
                    <option value="Private Party">Private Party</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Guests *
                  </label>
                  <div className="flex items-center">
                    <input type="number" id="guestCount" name="guestCount" min="1" required value={formData.guestCount} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                    <div className="ml-2 flex items-center">
                      <UsersIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information
                  </label>
                  <textarea id="additionalInfo" name="additionalInfo" rows={4} value={formData.additionalInfo} onChange={handleInputChange} placeholder="Tell us more about your event, special requirements, or questions..." className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                </div>
              </> : <>
                <h3 className="font-medium text-lg mb-4">
                  Contact Information
                </h3>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input type="text" id="name" name="name" required value={formData.name} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div className="mb-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="agreeToTerms" name="agreeToTerms" type="checkbox" required checked={formData.agreeToTerms} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeToTerms" className="text-gray-700">
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
                </div>
              </>}
          </div>
          <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
            {step === 1 ? <>
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Next
                </button>
              </> : <>
                <button type="button" onClick={handlePreviousStep} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Back
                </button>
                <button type="submit" disabled={isSubmitting} className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 flex items-center ${isSubmitting ? 'opacity-75' : ''}`}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  {!isSubmitting && <CheckIcon className="ml-1 h-4 w-4" />}
                </button>
              </>}
          </div>
        </form>
      </div>
    </div>;
};