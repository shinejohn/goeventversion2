import React from 'react';
import { CalendarIcon, ClockIcon, UsersIcon, MapPinIcon, InfoIcon } from 'lucide-react';
type ReviewStepProps = {
  venue: any;
  formData: any;
  pricing: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
};
export const ReviewStep = ({
  venue,
  formData,
  pricing,
  onInputChange,
  onCheckboxChange,
  onPrevStep,
  onNextStep
}: ReviewStepProps) => {
  // Calculate event duration
  const startHour = parseInt(formData.startTime.split(':')[0]);
  const endHour = parseInt(formData.endTime.split(':')[0]);
  let durationHours = endHour - startHour;
  if (durationHours <= 0) durationHours += 24; // Handle overnight events
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  // Format time for display
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '';
    const hour = parseInt(timeString.split(':')[0]);
    return hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
  };
  // Check if terms are accepted
  const areTermsAccepted = formData.agreeHouseRules && formData.agreePlatformTerms;
  return <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Review & Pricing</h2>
      {/* Booking Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Booking Summary
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start mb-4">
            <div className="h-16 w-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
              <img src={venue.images[0]} alt={venue.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{venue.name}</h4>
              <div className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {venue.location.address}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-start">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">Date</div>
                <div className="text-gray-900">
                  {formatDate(formData.primaryDate)}
                </div>
                {formData.alternativeDates.some((d: any) => d) && <div className="text-xs text-gray-500 mt-1">
                    Alternative dates available if needed
                  </div>}
              </div>
            </div>
            <div className="flex items-start">
              <ClockIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">Time</div>
                <div className="text-gray-900">
                  {formatTime(formData.startTime)} -{' '}
                  {formatTime(formData.endTime)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formData.setupTime} setup + {formData.breakdownTime}{' '}
                  breakdown
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <UsersIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Attendance
                </div>
                <div className="text-gray-900">
                  {formData.expectedAttendance} guests
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formData.ageRange}
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <InfoIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-700">
                  Event Type
                </div>
                <div className="text-gray-900">
                  {formData.eventType === 'Other' ? formData.eventTypeOther : formData.eventType}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formData.eventName}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="font-medium text-gray-900 mb-3">
              Pricing Breakdown
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Base Rate: ${venue.pricePerHour} × {durationHours} hours
                </span>
                <span className="text-gray-900">${pricing.basePrice}</span>
              </div>
              {pricing.setupCost > 0 && <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Setup Time: {formData.setupTime}
                  </span>
                  <span className="text-gray-900">${pricing.setupCost}</span>
                </div>}
              {pricing.breakdownCost > 0 && <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Breakdown Time: {formData.breakdownTime}
                  </span>
                  <span className="text-gray-900">
                    ${pricing.breakdownCost}
                  </span>
                </div>}
              {/* Additional Services */}
              {pricing.additionalServicesCost > 0 && <>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-600">Additional Services:</span>
                    <span className="text-gray-900">
                      ${pricing.additionalServicesCost}
                    </span>
                  </div>
                  {formData.additionalServices.eventStaff && <div className="flex justify-between text-xs pl-4">
                      <span className="text-gray-500">
                        Event Staff (2 staff × {durationHours} hours)
                      </span>
                      <span className="text-gray-500">
                        ${45 * durationHours * 2}
                      </span>
                    </div>}
                  {formData.additionalServices.security && <div className="flex justify-between text-xs pl-4">
                      <span className="text-gray-500">
                        Security (2 guards × {durationHours} hours)
                      </span>
                      <span className="text-gray-500">
                        ${55 * durationHours * 2}
                      </span>
                    </div>}
                  {formData.additionalServices.cleaning && <div className="flex justify-between text-xs pl-4">
                      <span className="text-gray-500">Cleaning Service</span>
                      <span className="text-gray-500">$250</span>
                    </div>}
                  {formData.additionalServices.equipmentRental && <div className="flex justify-between text-xs pl-4">
                      <span className="text-gray-500">Equipment Rental</span>
                      <span className="text-gray-500">$500</span>
                    </div>}
                </>}
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                <span className="font-medium">Subtotal</span>
                <span className="font-medium">${pricing.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Fee (10%)</span>
                <span className="text-gray-900">${pricing.serviceFee}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                <span>Estimated Total</span>
                <span>${pricing.total}</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>
                Final pricing will be confirmed upon booking approval.
                Additional fees may apply based on specific venue requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Message to Venue */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Message to Venue
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Tell the venue owner about your event and any special requirements. A
          personal note can help your booking request stand out.
        </p>
        <textarea id="messageToVenue" name="messageToVenue" value={formData.messageToVenue} onChange={onInputChange} rows={4} maxLength={500} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Introduce yourself and share any additional details about your event that would help the venue prepare for your booking..."></textarea>
        <div className="text-xs text-gray-500 mt-1 flex justify-between">
          <div>
            <strong>Tips:</strong> Mention any special occasions, specific
            needs, or why you chose this venue.
          </div>
          <div>{formData.messageToVenue.length}/500 characters</div>
        </div>
      </div>
      {/* Terms & Conditions */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Terms & Conditions
        </h3>
        <div className="space-y-4">
          {/* Cancellation Policy */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Cancellation Policy</h4>
            </div>
            <div className="p-4 text-sm text-gray-700">
              <ul className="space-y-2">
                <li>
                  • Full refund if canceled at least 30 days before event date
                </li>
                <li>
                  • 50% refund if canceled between 14-29 days before event date
                </li>
                <li>
                  • No refund if canceled less than 14 days before event date
                </li>
                <li>• Service fees are non-refundable</li>
              </ul>
            </div>
          </div>
          {/* House Rules */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">House Rules</h4>
            </div>
            <div className="p-4 text-sm text-gray-700">
              <ul className="space-y-2">
                {venue.houseRules.map((rule: string, index: number) => <li key={index}>• {rule}</li>)}
              </ul>
              <div className="mt-4 flex items-start">
                <input type="checkbox" id="agreeHouseRules" name="agreeHouseRules" checked={formData.agreeHouseRules} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" required />
                <label htmlFor="agreeHouseRules" className="ml-2 block text-sm text-gray-700">
                  I agree to follow all house rules and venue policies
                </label>
              </div>
            </div>
          </div>
          {/* Platform Terms */}
          <div className="flex items-start">
            <input type="checkbox" id="agreePlatformTerms" name="agreePlatformTerms" checked={formData.agreePlatformTerms} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" required />
            <label htmlFor="agreePlatformTerms" className="ml-2 block text-sm text-gray-700">
              I agree to the{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-800">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-800">
                Privacy Policy
              </a>
            </label>
          </div>
        </div>
      </div>
      {/* Payment Authorization */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Payment Authorization
        </h3>
        <p className="text-sm text-gray-700 mb-4">
          Your card will not be charged at this time. By proceeding, you
          authorize When's The Fun to place a temporary hold of $
          {Math.round(pricing.total * 0.2)} (20% of the total) if your booking
          is accepted by the venue. This amount will be applied to your final
          payment.
        </p>
        <div className="flex items-start">
          <input type="checkbox" id="authorizePayment" name="authorizePayment" checked={formData.authorizePayment} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" required />
          <label htmlFor="authorizePayment" className="ml-2 block text-sm text-gray-700">
            I authorize When's The Fun to place a hold on my payment method if
            my booking request is accepted
          </label>
        </div>
      </div>
      {/* Form Actions */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button type="button" onClick={onPrevStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium">
          Back
        </button>
        <button type="button" onClick={onNextStep} disabled={!areTermsAccepted || !formData.authorizePayment} className={`px-6 py-3 rounded-md text-white font-medium ${areTermsAccepted && formData.authorizePayment ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}>
          Continue to Payment
        </button>
      </div>
    </div>;
};