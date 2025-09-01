import React from 'react';
import { CheckIcon, HelpCircleIcon } from 'lucide-react';
type RequirementsStepProps = {
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRadioChange: (name: string, value: string) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
};
export const RequirementsStep = ({
  formData,
  onInputChange,
  onCheckboxChange,
  onRadioChange,
  onPrevStep,
  onNextStep
}: RequirementsStepProps) => {
  return <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Event Requirements
      </h2>
      {/* Space Needs */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Space Needs</h3>
        {/* Layout Preference */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Layout Preference
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[{
            value: 'reception',
            label: 'Reception Style',
            description: 'Standing, mingling setup'
          }, {
            value: 'theater',
            label: 'Theater Style',
            description: 'Rows of chairs facing front'
          }, {
            value: 'classroom',
            label: 'Classroom Style',
            description: 'Tables with chairs facing front'
          }, {
            value: 'banquet',
            label: 'Banquet Style',
            description: 'Round tables with chairs'
          }, {
            value: 'conference',
            label: 'Conference Style',
            description: 'U-shaped or boardroom table'
          }, {
            value: 'custom',
            label: 'Custom Layout',
            description: 'Describe in special requests'
          }].map(layout => <div key={layout.value} className={`border rounded-lg p-4 cursor-pointer ${formData.layoutPreference === layout.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => onRadioChange('layoutPreference', layout.value)}>
                <div className="flex items-start">
                  <div className={`h-5 w-5 rounded-full border flex-shrink-0 mr-2 flex items-center justify-center ${formData.layoutPreference === layout.value ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
                    {formData.layoutPreference === layout.value && <div className="h-2 w-2 rounded-full bg-white"></div>}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {layout.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {layout.description}
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        {/* Special Requirements */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requirements
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start">
              <input type="checkbox" id="specialRequirements.stage" name="specialRequirements.stage" checked={formData.specialRequirements.stage} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <label htmlFor="specialRequirements.stage" className="ml-2 block text-sm text-gray-700">
                Stage/Performance area
              </label>
            </div>
            <div className="flex items-start">
              <input type="checkbox" id="specialRequirements.danceFloor" name="specialRequirements.danceFloor" checked={formData.specialRequirements.danceFloor} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <label htmlFor="specialRequirements.danceFloor" className="ml-2 block text-sm text-gray-700">
                Dance floor
              </label>
            </div>
            <div className="flex items-start">
              <input type="checkbox" id="specialRequirements.separateRooms" name="specialRequirements.separateRooms" checked={formData.specialRequirements.separateRooms} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <label htmlFor="specialRequirements.separateRooms" className="ml-2 block text-sm text-gray-700">
                Separate rooms needed
              </label>
            </div>
            <div className="flex items-start">
              <input type="checkbox" id="specialRequirements.outdoorAccess" name="specialRequirements.outdoorAccess" checked={formData.specialRequirements.outdoorAccess} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <label htmlFor="specialRequirements.outdoorAccess" className="ml-2 block text-sm text-gray-700">
                Outdoor access required
              </label>
            </div>
          </div>
        </div>
        {/* Equipment Needs */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Equipment Needs
          </label>
          <div className="space-y-3">
            <div className="flex items-start">
              <input type="checkbox" id="equipmentNeeds.tablesChairs" name="equipmentNeeds.tablesChairs" checked={formData.equipmentNeeds.tablesChairs} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <div className="ml-2">
                <label htmlFor="equipmentNeeds.tablesChairs" className="block text-sm text-gray-700">
                  Tables & Chairs
                </label>
                {formData.equipmentNeeds.tablesChairs && <div className="mt-2 grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="tablesCount" className="block text-xs text-gray-500">
                        Number of tables
                      </label>
                      <input type="number" id="tablesCount" name="equipmentNeeds.tablesCount" value={formData.equipmentNeeds.tablesCount} onChange={onInputChange} min="0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                      <label htmlFor="chairsCount" className="block text-xs text-gray-500">
                        Number of chairs
                      </label>
                      <input type="number" id="chairsCount" name="equipmentNeeds.chairsCount" value={formData.equipmentNeeds.chairsCount} onChange={onInputChange} min="0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                  </div>}
              </div>
            </div>
            <div className="flex items-start">
              <input type="checkbox" id="equipmentNeeds.av" name="equipmentNeeds.av" checked={formData.equipmentNeeds.av} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <label htmlFor="equipmentNeeds.av" className="ml-2 block text-sm text-gray-700">
                A/V Equipment (projector, microphone, speakers)
              </label>
            </div>
            <div className="flex items-start">
              <input type="checkbox" id="equipmentNeeds.lighting" name="equipmentNeeds.lighting" checked={formData.equipmentNeeds.lighting} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <label htmlFor="equipmentNeeds.lighting" className="ml-2 block text-sm text-gray-700">
                Special Lighting
              </label>
            </div>
            <div className="flex items-start">
              <input type="checkbox" id="equipmentNeeds.decorations" name="equipmentNeeds.decorations" checked={formData.equipmentNeeds.decorations} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <label htmlFor="equipmentNeeds.decorations" className="ml-2 block text-sm text-gray-700">
                Decorations Allowed
              </label>
            </div>
          </div>
        </div>
      </div>
      {/* Catering Plans */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Catering Plans
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <input type="radio" id="cateringPlans-venue" name="cateringPlans" value="venue" checked={formData.cateringPlans === 'venue'} onChange={() => onRadioChange('cateringPlans', 'venue')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
            <label htmlFor="cateringPlans-venue" className="ml-2 block text-sm text-gray-700">
              Using venue catering
            </label>
          </div>
          <div className="flex items-center">
            <input type="radio" id="cateringPlans-outside" name="cateringPlans" value="outside" checked={formData.cateringPlans === 'outside'} onChange={() => onRadioChange('cateringPlans', 'outside')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
            <label htmlFor="cateringPlans-outside" className="ml-2 block text-sm text-gray-700">
              Bringing outside catering
            </label>
          </div>
          <div className="flex items-center">
            <input type="radio" id="cateringPlans-none" name="cateringPlans" value="none" checked={formData.cateringPlans === 'none'} onChange={() => onRadioChange('cateringPlans', 'none')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
            <label htmlFor="cateringPlans-none" className="ml-2 block text-sm text-gray-700">
              No food/beverage
            </label>
          </div>
        </div>
      </div>
      {/* Additional Services */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Additional Services
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <HelpCircleIcon className="h-4 w-4 mr-1" />
            <span>Additional fees apply</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start">
              <input type="checkbox" id="additionalServices.eventStaff" name="additionalServices.eventStaff" checked={formData.additionalServices.eventStaff} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <div className="ml-2">
                <label htmlFor="additionalServices.eventStaff" className="block text-sm font-medium text-gray-700">
                  Event Staff
                </label>
                <p className="text-xs text-gray-500">
                  $45/hour per staff member
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <input type="checkbox" id="additionalServices.security" name="additionalServices.security" checked={formData.additionalServices.security} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <div className="ml-2">
                <label htmlFor="additionalServices.security" className="block text-sm font-medium text-gray-700">
                  Security
                </label>
                <p className="text-xs text-gray-500">
                  $55/hour per security guard
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <input type="checkbox" id="additionalServices.cleaning" name="additionalServices.cleaning" checked={formData.additionalServices.cleaning} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <div className="ml-2">
                <label htmlFor="additionalServices.cleaning" className="block text-sm font-medium text-gray-700">
                  Cleaning Service
                </label>
                <p className="text-xs text-gray-500">$250 flat fee</p>
              </div>
            </div>
            <div className="flex items-start">
              <input type="checkbox" id="additionalServices.equipmentRental" name="additionalServices.equipmentRental" checked={formData.additionalServices.equipmentRental} onChange={onCheckboxChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <div className="ml-2">
                <label htmlFor="additionalServices.equipmentRental" className="block text-sm font-medium text-gray-700">
                  Equipment Rental
                </label>
                <p className="text-xs text-gray-500">Starting at $500</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests or Additional Information
          </label>
          <textarea id="specialRequests" name="specialRequests" value={formData.specialRequests} onChange={onInputChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Please provide any additional details about your event requirements..."></textarea>
        </div>
      </div>
      {/* Insurance & Licenses */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Insurance & Licenses
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Do you have event insurance?
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input type="radio" id="hasInsurance-yes" name="hasInsurance" value="yes" checked={formData.hasInsurance === 'yes'} onChange={() => onRadioChange('hasInsurance', 'yes')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                <label htmlFor="hasInsurance-yes" className="ml-2 block text-sm text-gray-700">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="hasInsurance-no" name="hasInsurance" value="no" checked={formData.hasInsurance === 'no'} onChange={() => onRadioChange('hasInsurance', 'no')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                <label htmlFor="hasInsurance-no" className="ml-2 block text-sm text-gray-700">
                  No
                </label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="hasInsurance-info" name="hasInsurance" value="info" checked={formData.hasInsurance === 'info'} onChange={() => onRadioChange('hasInsurance', 'info')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                <label htmlFor="hasInsurance-info" className="ml-2 block text-sm text-gray-700">
                  Need more information
                </label>
              </div>
            </div>
            {formData.hasInsurance === 'no' && <div className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                Note: Event insurance may be required by this venue. The venue
                will provide more details if needed.
              </div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Will you need an alcohol license?
            </label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input type="radio" id="alcoholLicense-yes" name="alcoholLicense" value="yes" checked={formData.alcoholLicense === 'yes'} onChange={() => onRadioChange('alcoholLicense', 'yes')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                <label htmlFor="alcoholLicense-yes" className="ml-2 block text-sm text-gray-700">
                  Yes
                </label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="alcoholLicense-no" name="alcoholLicense" value="no" checked={formData.alcoholLicense === 'no'} onChange={() => onRadioChange('alcoholLicense', 'no')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                <label htmlFor="alcoholLicense-no" className="ml-2 block text-sm text-gray-700">
                  No
                </label>
              </div>
              <div className="flex items-center">
                <input type="radio" id="alcoholLicense-na" name="alcoholLicense" value="na" checked={formData.alcoholLicense === 'na'} onChange={() => onRadioChange('alcoholLicense', 'na')} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                <label htmlFor="alcoholLicense-na" className="ml-2 block text-sm text-gray-700">
                  Not applicable
                </label>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="otherPermits" className="block text-sm font-medium text-gray-700 mb-1">
              Other permits or licenses needed
            </label>
            <input type="text" id="otherPermits" name="otherPermits" value={formData.otherPermits} onChange={onInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., Sound permit, fire permit, etc." />
          </div>
        </div>
      </div>
      {/* Form Actions */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button type="button" onClick={onPrevStep} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium">
          Back
        </button>
        <button type="button" onClick={onNextStep} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium">
          Continue to Review
        </button>
      </div>
    </div>;
};