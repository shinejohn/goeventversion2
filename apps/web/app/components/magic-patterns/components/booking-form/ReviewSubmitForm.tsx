import React from 'react';
import { CheckIcon, AlertCircleIcon, PrinterIcon, DownloadIcon, CalendarIcon, ClockIcon, UsersIcon, LayoutIcon, WifiIcon, UtensilsIcon, UserIcon, BuildingIcon, PhoneIcon, MailIcon, CreditCardIcon } from 'lucide-react';
type ReviewSubmitFormProps = {
  formData: any;
  venue: any;
  pricing: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onPrevStep: () => void;
  onSubmit: () => void;
  isValid: boolean;
};
export const ReviewSubmitForm = ({
  formData,
  venue,
  pricing,
  onInputChange,
  onPrevStep,
  onSubmit,
  isValid
}: ReviewSubmitFormProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const hour = parseInt(timeString.split(':')[0]);
    return hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
  };
  return <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Review & Submit</h2>
      {/* Action Buttons */}
      <div className="flex justify-end mb-6">
        <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-2">
          <PrinterIcon className="h-4 w-4 mr-2" />
          Print
        </button>
        <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          <DownloadIcon className="h-4 w-4 mr-2" />
          Save as PDF
        </button>
      </div>
      {/* Booking Summary */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Booking Summary</h3>
        </div>
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Venue Information */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Venue</h4>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-md overflow-hidden">
                <img src={venue.images[0]} alt={venue.name} className="h-full w-full object-cover" />
              </div>
              <div className="ml-3">
                <h5 className="text-base font-medium text-gray-900">
                  {venue.name}
                </h5>
                <p className="text-sm text-gray-500">
                  {venue.location.address}
                </p>
              </div>
            </div>
          </div>
          {/* Event Information */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">{formData.eventName}</span> (
                {formData.eventType})
              </p>
              <p className="text-sm flex items-center text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
                {formatDate(formData.primaryDate)}
              </p>
              <p className="text-sm flex items-center text-gray-600">
                <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                {formatTime(formData.startTime)} -{' '}
                {formatTime(formData.endTime)}
              </p>
              <p className="text-sm flex items-center text-gray-600">
                <UsersIcon className="h-4 w-4 mr-1 text-gray-400" />
                {formData.expectedAttendance} guests
              </p>
            </div>
          </div>
          {/* Space & Setup */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Space & Setup</h4>
            <div className="space-y-1">
              {venue.spaces && formData.selectedSpaces.length > 0 ? <p className="text-sm">
                  <span className="font-medium">Selected Spaces:</span>{' '}
                  {formData.selectedSpaces.map((spaceId: string) => {
                const space = venue.spaces.find((s: any) => s.id === spaceId);
                return space ? space.name : '';
              }).join(', ')}
                </p> : <p className="text-sm">
                  <span className="font-medium">Entire Venue</span>
                </p>}
              <p className="text-sm flex items-center text-gray-600">
                <LayoutIcon className="h-4 w-4 mr-1 text-gray-400" />
                {formData.layoutPreference.charAt(0).toUpperCase() + formData.layoutPreference.slice(1)}{' '}
                Layout
              </p>
              {formData.equipmentNeeds && Object.keys(formData.equipmentNeeds).filter(key => formData.equipmentNeeds[key] === true && key !== 'tables' && key !== 'chairs').length > 0 && <p className="text-sm flex items-start text-gray-600">
                    <WifiIcon className="h-4 w-4 mr-1 text-gray-400 mt-0.5" />
                    <span>
                      <span className="font-medium">Equipment:</span>{' '}
                      {Object.keys(formData.equipmentNeeds).filter(key => formData.equipmentNeeds[key] === true && key !== 'tables' && key !== 'chairs' && key !== 'tablesCount' && key !== 'chairsCount').map(key => key.charAt(0).toUpperCase() + key.slice(1)).join(', ')}
                    </span>
                  </p>}
              {formData.cateringNeeds.service !== 'none' && <p className="text-sm flex items-center text-gray-600">
                  <UtensilsIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {formData.cateringNeeds.service === 'basic' ? 'Basic Catering' : formData.cateringNeeds.service === 'full' ? 'Full-Service Catering' : 'Outside Catering'}
                </p>}
            </div>
          </div>
          {/* Contact Information */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Contact Information
            </h4>
            <div className="space-y-1">
              <p className="text-sm flex items-center">
                <UserIcon className="h-4 w-4 mr-1 text-gray-400" />
                {formData.contactInfo.fullName}
              </p>
              {formData.contactInfo.organization && <p className="text-sm flex items-center text-gray-600">
                  <BuildingIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {formData.contactInfo.organization}
                </p>}
              <p className="text-sm flex items-center text-gray-600">
                <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                {formData.contactInfo.phone}
              </p>
              <p className="text-sm flex items-center text-gray-600">
                <MailIcon className="h-4 w-4 mr-1 text-gray-400" />
                {formData.contactInfo.email}
              </p>
            </div>
          </div>
          {/* Payment Method */}
          <div className="md:col-span-2">
            <h4 className="font-medium text-gray-900 mb-2">
              Payment Information
            </h4>
            <div className="flex items-center">
              <CreditCardIcon className="h-4 w-4 mr-1 text-gray-400" />
              <span className="text-sm text-gray-600">
                {formData.paymentMethod === 'creditCard' ? 'Credit/Debit Card' : formData.paymentMethod === 'bankTransfer' ? 'Bank Transfer' : 'Pay Later'}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                (${pricing.deposit.toLocaleString()} deposit due upon approval)
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Pricing Summary */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Pricing Summary</h3>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-3">
            {pricing.basePrice > 0 && <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base venue rental</span>
                <span className="text-gray-900">
                  ${pricing.basePrice.toLocaleString()}
                </span>
              </div>}
            {pricing.spacesPrice > 0 && <div className="flex justify-between text-sm">
                <span className="text-gray-600">Selected spaces</span>
                <span className="text-gray-900">
                  ${pricing.spacesPrice.toLocaleString()}
                </span>
              </div>}
            {pricing.setupBreakdownPrice > 0 && <div className="flex justify-between text-sm">
                <span className="text-gray-600">Setup & breakdown time</span>
                <span className="text-gray-900">
                  ${pricing.setupBreakdownPrice.toLocaleString()}
                </span>
              </div>}
            {pricing.equipmentPrice > 0 && <div className="flex justify-between text-sm">
                <span className="text-gray-600">Equipment rental</span>
                <span className="text-gray-900">
                  ${pricing.equipmentPrice.toLocaleString()}
                </span>
              </div>}
            {pricing.cateringPrice > 0 && <div className="flex justify-between text-sm">
                <span className="text-gray-600">Catering & bar service</span>
                <span className="text-gray-900">
                  ${pricing.cateringPrice.toLocaleString()}
                </span>
              </div>}
            {pricing.servicesPrice > 0 && <div className="flex justify-between text-sm">
                <span className="text-gray-600">Additional services</span>
                <span className="text-gray-900">
                  ${pricing.servicesPrice.toLocaleString()}
                </span>
              </div>}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">
                  ${pricing.subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">
                  Service fee & taxes (22.5%)
                </span>
                <span className="text-gray-900">
                  ${pricing.taxFees.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between font-medium text-base mt-3 pt-3 border-t border-gray-200">
                <span>Estimated Total</span>
                <span>${pricing.total.toLocaleString()}</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Deposit due upon booking approval: $
                {pricing.deposit.toLocaleString()} (30% of total)
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Terms & Conditions */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Terms & Conditions
        </h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <input type="checkbox" id="termsAccepted" name="termsAccepted" checked={formData.termsAccepted} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
            <div className="ml-3">
              <label htmlFor="termsAccepted" className="block text-sm font-medium text-gray-900">
                I agree to the Terms of Service and Privacy Policy
              </label>
              <p className="mt-1 text-xs text-gray-500">
                By checking this box, you agree to our{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-800">
                  Terms of Service
                </a>{' '}
                and acknowledge our{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-800">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <input type="checkbox" id="cancellationPolicyAccepted" name="cancellationPolicyAccepted" checked={formData.cancellationPolicyAccepted} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
            <div className="ml-3">
              <label htmlFor="cancellationPolicyAccepted" className="block text-sm font-medium text-gray-900">
                I understand the cancellation policy
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Cancellations made 30+ days before your event receive a full
                refund minus a $100 administrative fee. Cancellations 15-29 days
                before receive a 50% refund. Cancellations less than 15 days
                before the event are non-refundable.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Validation Message */}
      {!isValid && <div className="mb-6 p-4 bg-red-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please accept the terms and conditions
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {!formData.termsAccepted && <li>You must agree to the Terms of Service</li>}
                  {!formData.cancellationPolicyAccepted && <li>You must acknowledge the cancellation policy</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>}
      {/* Form Actions */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button type="button" onClick={onPrevStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50">
          Back
        </button>
        <button type="button" onClick={onSubmit} disabled={!isValid} className={`inline-flex items-center px-6 py-3 rounded-md text-white font-medium ${isValid ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}>
          <CheckIcon className="h-5 w-5 mr-2" />
          Submit Booking Request
        </button>
      </div>
    </div>;
};