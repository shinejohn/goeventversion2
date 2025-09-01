import React from 'react';
import { ChevronRightIcon } from 'lucide-react';
type EventDetailsFormProps = {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onAlternativeDateChange: (index: number, value: string) => void;
  onNextStep: () => void;
  isValid: boolean;
};
export const EventDetailsForm = ({
  formData,
  onInputChange,
  onAlternativeDateChange,
  onNextStep,
  isValid
}: EventDetailsFormProps) => {
  return <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Event Details
      </h2>
      <div className="space-y-6">
        {/* Event Type */}
        <div>
          <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
            Event Type
          </label>
          <select id="eventType" name="eventType" value={formData.eventType} onChange={onInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            <option value="">Select event type</option>
            <option value="concert">Concert</option>
            <option value="wedding">Wedding</option>
            <option value="corporate">Corporate Event</option>
            <option value="birthday">Birthday Party</option>
            <option value="other">Other</option>
          </select>
        </div>
        {/* Event Name */}
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
            Event Name
          </label>
          <input type="text" id="eventName" name="eventName" value={formData.eventName} onChange={onInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        {/* Expected Attendance */}
        <div>
          <label htmlFor="expectedAttendance" className="block text-sm font-medium text-gray-700 mb-1">
            Expected Number of Guests
          </label>
          <input type="number" id="expectedAttendance" name="expectedAttendance" value={formData.expectedAttendance} onChange={onInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        {/* Primary Date */}
        <div>
          <label htmlFor="primaryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Date
          </label>
          <input type="date" id="primaryDate" name="primaryDate" value={formData.primaryDate} onChange={onInputChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        {/* Alternative Dates */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alternative Dates (Optional)
          </label>
          <div className="space-y-2">
            {formData.alternativeDates.map((date: string, index: number) => <input key={index} type="date" value={date} onChange={e => onAlternativeDateChange(index, e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />)}
          </div>
        </div>
      </div>
      {/* Navigation */}
      <div className="mt-8 flex justify-end">
        <button type="button" onClick={onNextStep} disabled={!isValid} className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${isValid ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
          Continue
          <ChevronRightIcon className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>;
};