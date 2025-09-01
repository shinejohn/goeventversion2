import React from 'react';
import { UserIcon, BuildingIcon, MailIcon, PhoneIcon, ClockIcon, CreditCardIcon, DollarSignIcon, AlertCircleIcon } from 'lucide-react';
type ContactPaymentFormProps = {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBudgetChange: (min: number, max: number) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  isValid: boolean;
};
export const ContactPaymentForm = ({
  formData,
  onInputChange,
  onBudgetChange,
  onPrevStep,
  onNextStep,
  isValid
}: ContactPaymentFormProps) => {
  const handleBudgetMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = parseInt(e.target.value) || 0;
    onBudgetChange(min, formData.budgetRange.max);
  };
  const handleBudgetMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = parseInt(e.target.value) || 0;
    onBudgetChange(formData.budgetRange.min, max);
  };
  return <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Contact & Payment
      </h2>
      {/* Contact Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contactInfo.fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" id="contactInfo.fullName" name="contactInfo.fullName" value={formData.contactInfo.fullName} onChange={onInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="John Doe" required />
            </div>
          </div>
          <div>
            <label htmlFor="contactInfo.organization" className="block text-sm font-medium text-gray-700 mb-1">
              Organization{' '}
              <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" id="contactInfo.organization" name="contactInfo.organization" value={formData.contactInfo.organization} onChange={onInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Company or organization name" />
            </div>
          </div>
          <div>
            <label htmlFor="contactInfo.email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="email" id="contactInfo.email" name="contactInfo.email" value={formData.contactInfo.email} onChange={onInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="you@example.com" required />
            </div>
          </div>
          <div>
            <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="tel" id="contactInfo.phone" name="contactInfo.phone" value={formData.contactInfo.phone} onChange={onInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="(555) 123-4567" required />
            </div>
          </div>
          <div>
            <label htmlFor="contactInfo.bestContactTime" className="block text-sm font-medium text-gray-700 mb-1">
              Best Time to Contact
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select id="contactInfo.bestContactTime" name="contactInfo.bestContactTime" value={formData.contactInfo.bestContactTime} onChange={onInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="anytime">Anytime</option>
                <option value="morning">Morning (9AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 5PM)</option>
                <option value="evening">Evening (5PM - 8PM)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Budget Range */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Range</h3>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <div className="flex items-center mb-4">
            <DollarSignIcon className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              What's your budget range for this event?
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="budgetMin" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum ($)
              </label>
              <input type="number" id="budgetMin" value={formData.budgetRange.min} onChange={handleBudgetMinChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor="budgetMax" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum ($)
              </label>
              <input type="number" id="budgetMax" value={formData.budgetRange.max} onChange={handleBudgetMaxChange} min={formData.budgetRange.min} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            This helps us tailor our recommendations to your budget. A deposit
            will be required to secure your booking.
          </p>
        </div>
      </div>
      {/* Payment Method */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Payment Method for Deposit
        </h3>
        <div className="space-y-4">
          <div className="relative border border-gray-200 rounded-md p-4">
            <div className="flex items-start">
              <input id="paymentMethod-creditCard" name="paymentMethod" type="radio" value="creditCard" checked={formData.paymentMethod === 'creditCard'} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 mt-1" />
              <div className="ml-3">
                <label htmlFor="paymentMethod-creditCard" className="block font-medium text-gray-900 flex items-center">
                  <CreditCardIcon className="h-4 w-4 mr-2 text-gray-500" />
                  Credit or Debit Card
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Secure payment via our payment processor. No charges until
                  your booking is confirmed.
                </p>
              </div>
            </div>
          </div>
          <div className="relative border border-gray-200 rounded-md p-4">
            <div className="flex items-start">
              <input id="paymentMethod-bankTransfer" name="paymentMethod" type="radio" value="bankTransfer" checked={formData.paymentMethod === 'bankTransfer'} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 mt-1" />
              <div className="ml-3">
                <label htmlFor="paymentMethod-bankTransfer" className="block font-medium text-gray-900">
                  Bank Transfer
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Transfer details will be provided after your booking is
                  confirmed.
                </p>
              </div>
            </div>
          </div>
          <div className="relative border border-gray-200 rounded-md p-4">
            <div className="flex items-start">
              <input id="paymentMethod-payLater" name="paymentMethod" type="radio" value="payLater" checked={formData.paymentMethod === 'payLater'} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 mt-1" />
              <div className="ml-3">
                <label htmlFor="paymentMethod-payLater" className="block font-medium text-gray-900">
                  Pay Later
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Submit your booking request now and add payment details later.
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Note: A deposit (typically 30% of the total) will be required to
          secure your booking.
        </p>
      </div>
      {/* Special Notes */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Special Notes
        </h3>
        <textarea id="specialNotes" name="specialNotes" value={formData.specialNotes} onChange={onInputChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Any additional information or special requests we should know about..."></textarea>
      </div>
      {/* Validation Message */}
      {!isValid && <div className="mb-6 p-4 bg-red-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please complete all required fields
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {!formData.contactInfo.fullName && <li>Enter your full name</li>}
                  {!formData.contactInfo.email && <li>Enter your email address</li>}
                  {!formData.contactInfo.phone && <li>Enter your phone number</li>}
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
        <button type="button" onClick={onNextStep} disabled={!isValid} className={`px-6 py-3 rounded-md text-white font-medium ${isValid ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}>
          Continue to Review
        </button>
      </div>
    </div>;
};