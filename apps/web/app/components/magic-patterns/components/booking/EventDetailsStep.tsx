import React from 'react';
import { CalendarIcon, ClockIcon, UserIcon, PhoneIcon, MailIcon, BuildingIcon } from 'lucide-react';
type EventDetailsStepProps = {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAlternativeDateChange: (index: number, value: string) => void;
  onNextStep: () => void;
};
export const EventDetailsStep = ({
  formData,
  onInputChange,
  onAlternativeDateChange,
  onNextStep
}: EventDetailsStepProps) => {
  // Validate if required fields are filled
  const isFormValid = () => {
    return formData.eventName.trim() !== '' && formData.eventType !== '' && (formData.eventType !== 'Other' || formData.eventTypeOther.trim() !== '') && formData.expectedAttendance.trim() !== '' && formData.primaryDate.trim() !== '' && formData.contactName.trim() !== '' && formData.contactEmail.trim() !== '' && formData.contactPhone.trim() !== '';
  };
  return <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Event Details</h2>
      {/* Basic Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input type="text" id="eventName" name="eventName" value={formData.eventName} onChange={onInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., Annual Company Gala" required />
          </div>
          <div>
            <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
              Event Type <span className="text-red-500">*</span>
            </label>
            <select id="eventType" name="eventType" value={formData.eventType} onChange={onInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required>
              <option value="" disabled>
                Select event type
              </option>
              <option value="Private Party">Private Party</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Wedding">Wedding</option>
              <option value="Concert/Performance">Concert/Performance</option>
              <option value="Workshop/Class">Workshop/Class</option>
              <option value="Photo/Video Shoot">Photo/Video Shoot</option>
              <option value="Other">Other (specify)</option>
            </select>
            {formData.eventType === 'Other' && <div className="mt-3">
                <label htmlFor="eventTypeOther" className="block text-sm font-medium text-gray-700 mb-1">
                  Specify Event Type <span className="text-red-500">*</span>
                </label>
                <input type="text" id="eventTypeOther" name="eventTypeOther" value={formData.eventTypeOther} onChange={onInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Please specify your event type" required />
              </div>}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Event Description{' '}
              <span className="text-gray-500 text-xs">(500 char max)</span>
            </label>
            <textarea id="eventDescription" name="eventDescription" value={formData.eventDescription} onChange={onInputChange} rows={4} maxLength={500} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Briefly describe your event, its purpose, and any special requirements"></textarea>
            <div className="text-xs text-gray-500 mt-1 text-right">
              {formData.eventDescription.length}/500 characters
            </div>
          </div>
          <div>
            <label htmlFor="expectedAttendance" className="block text-sm font-medium text-gray-700 mb-1">
              Expected Attendance <span className="text-red-500">*</span>
            </label>
            <input type="number" id="expectedAttendance" name="expectedAttendance" value={formData.expectedAttendance} onChange={onInputChange} min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Number of guests" required />
          </div>
          <div>
            <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 mb-1">
              Age Range
            </label>
            <select id="ageRange" name="ageRange" value={formData.ageRange} onChange={onInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="All ages">All ages</option>
              <option value="18+">18+</option>
              <option value="21+">21+</option>
            </select>
          </div>
        </div>
      </div>
      {/* Date & Time */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Date & Time</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="primaryDate" className="block text-sm font-medium text-gray-700 mb-1">
              Primary Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="date" id="primaryDate" name="primaryDate" value={formData.primaryDate} onChange={onInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alternative Dates{' '}
              <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <div className="space-y-2">
              {formData.alternativeDates.map((date: string, index: number) => <div key={index} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="date" value={date} onChange={e => onAlternativeDateChange(index, e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder={`Alternative date ${index + 1}`} />
                </div>)}
            </div>
          </div>
          <div>
            <label htmlFor="setupTime" className="block text-sm font-medium text-gray-700 mb-1">
              Setup Time Needed
            </label>
            <select id="setupTime" name="setupTime" value={formData.setupTime} onChange={onInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="2 hours">2 hours</option>
              <option value="3 hours">3 hours</option>
              <option value="4 hours">4 hours</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Event Start
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select id="startTime" name="startTime" value={formData.startTime} onChange={onInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                  {Array.from({
                  length: 24
                }).map((_, hour) => <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                      {hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`}
                    </option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                Event End
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select id="endTime" name="endTime" value={formData.endTime} onChange={onInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                  {Array.from({
                  length: 24
                }).map((_, hour) => <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                      {hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`}
                    </option>)}
                </select>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="breakdownTime" className="block text-sm font-medium text-gray-700 mb-1">
              Breakdown Time
            </label>
            <select id="breakdownTime" name="breakdownTime" value={formData.breakdownTime} onChange={onInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="1.5 hours">1.5 hours</option>
              <option value="2 hours">2 hours</option>
            </select>
          </div>
        </div>
      </div>
      {/* Contact Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" id="contactName" name="contactName" value={formData.contactName} onChange={onInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Full name" required />
            </div>
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="email" id="contactEmail" name="contactEmail" value={formData.contactEmail} onChange={onInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="email@example.com" required />
            </div>
          </div>
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="tel" id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={onInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="(123) 456-7890" required />
            </div>
          </div>
          <div>
            <label htmlFor="contactOrganization" className="block text-sm font-medium text-gray-700 mb-1">
              Organization{' '}
              <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BuildingIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" id="contactOrganization" name="contactOrganization" value={formData.contactOrganization} onChange={onInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Company or organization name" />
            </div>
          </div>
          <div>
            <label htmlFor="bestTimeToCall" className="block text-sm font-medium text-gray-700 mb-1">
              Best Time to Call
            </label>
            <select id="bestTimeToCall" name="bestTimeToCall" value={formData.bestTimeToCall} onChange={onInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="Anytime">Anytime</option>
              <option value="Morning">Morning (9AM - 12PM)</option>
              <option value="Afternoon">Afternoon (12PM - 5PM)</option>
              <option value="Evening">Evening (5PM - 8PM)</option>
            </select>
          </div>
        </div>
      </div>
      {/* Form Actions */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button type="button" onClick={onNextStep} disabled={!isFormValid()} className={`px-6 py-3 rounded-md text-white font-medium ${isFormValid() ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}>
          Continue to Requirements
        </button>
      </div>
    </div>;
};