import React from 'react';
import { LayoutIcon, MonitorIcon, MicIcon, SpeakerIcon, TableIcon, UtensilsIcon, WineIcon, AlertCircleIcon } from 'lucide-react';
type SpaceSetupFormProps = {
  formData: any;
  venue: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSpaceSelection: (spaceId: string, isSelected: boolean) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  isValid: boolean;
};
export const SpaceSetupForm = ({
  formData,
  venue,
  onInputChange,
  onSpaceSelection,
  onPrevStep,
  onNextStep,
  isValid
}: SpaceSetupFormProps) => {
  const layoutOptions = [{
    id: 'reception',
    label: 'Reception/Standing',
    icon: '👥',
    description: 'Open floor plan for mingling'
  }, {
    id: 'theater',
    label: 'Theater Style',
    icon: '🎭',
    description: 'Rows of chairs facing a stage or focal point'
  }, {
    id: 'classroom',
    label: 'Classroom',
    icon: '📚',
    description: 'Rows of tables with chairs facing forward'
  }, {
    id: 'banquet',
    label: 'Banquet/Rounds',
    icon: '🍽️',
    description: 'Round tables with chairs for dining'
  }, {
    id: 'boardroom',
    label: 'Boardroom',
    icon: '💼',
    description: 'One large table with chairs around it'
  }, {
    id: 'u-shape',
    label: 'U-Shape',
    icon: '⊃',
    description: 'Tables arranged in a U shape'
  }, {
    id: 'hollow-square',
    label: 'Hollow Square',
    icon: '□',
    description: 'Tables arranged in a square with open center'
  }, {
    id: 'custom',
    label: 'Custom Layout',
    icon: '✏️',
    description: 'Describe your custom layout requirements'
  }];
  return <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Space & Setup</h2>
      {/* Space Selection (if multiple spaces) */}
      {venue.spaces && venue.spaces.length > 0 && <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Space Selection
          </h3>
          {venue.spaces.length === 1 ? <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <p className="text-gray-700">
                This venue has only one space available:{' '}
                <strong>{venue.spaces[0].name}</strong>
              </p>
            </div> : <div>
              <p className="text-sm text-gray-600 mb-4">
                Select one or more spaces for your event:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {venue.spaces.map((space: any) => <div key={space.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="h-40 overflow-hidden">
                      <img src={space.images[0]} alt={space.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start">
                        <input type="checkbox" id={`space-${space.id}`} checked={formData.selectedSpaces.includes(space.id)} onChange={e => onSpaceSelection(space.id, e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
                        <div className="ml-3">
                          <label htmlFor={`space-${space.id}`} className="block font-medium text-gray-900">
                            {space.name}
                          </label>
                          <p className="text-sm text-gray-500 mt-1">
                            {space.description}
                          </p>
                          <div className="flex items-center mt-2 text-sm text-gray-600">
                            <span className="mr-3">
                              Up to {space.capacity.standing} guests
                            </span>
                            <span>${space.pricePerHour}/hour</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>
              {venue.spaces.length > 1 && formData.selectedSpaces.length > 1 && <div className="mt-4 p-4 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> You've selected multiple spaces.
                      Our team will help coordinate the setup across all spaces.
                    </p>
                  </div>}
            </div>}
        </div>}
      {/* Layout Preference */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Layout Preference
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {layoutOptions.map(layout => <div key={layout.id}>
              <input type="radio" id={`layout-${layout.id}`} name="layoutPreference" value={layout.id} checked={formData.layoutPreference === layout.id} onChange={onInputChange} className="sr-only" />
              <label htmlFor={`layout-${layout.id}`} className={`block p-4 border rounded-lg cursor-pointer text-center h-full transition-colors ${formData.layoutPreference === layout.id ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="text-2xl mb-2">{layout.icon}</div>
                <div className="font-medium text-gray-900">{layout.label}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {layout.description}
                </div>
              </label>
            </div>)}
        </div>
        {formData.layoutPreference === 'custom' && <div className="mt-4">
            <label htmlFor="customLayoutRequirements" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Layout Requirements
            </label>
            <textarea id="customLayoutRequirements" name="customLayoutRequirements" value={formData.customLayoutRequirements} onChange={onInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Please describe your custom layout requirements in detail..."></textarea>
          </div>}
      </div>
      {/* Equipment Needs */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Equipment Needs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="equipmentNeeds.projector" name="equipmentNeeds.projector" checked={formData.equipmentNeeds.projector} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="equipmentNeeds.projector" className="ml-2 block text-sm text-gray-700 flex items-center">
                <MonitorIcon className="h-4 w-4 mr-1 text-gray-500" />
                Projector & Screen
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="equipmentNeeds.microphone" name="equipmentNeeds.microphone" checked={formData.equipmentNeeds.microphone} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="equipmentNeeds.microphone" className="ml-2 block text-sm text-gray-700 flex items-center">
                <MicIcon className="h-4 w-4 mr-1 text-gray-500" />
                Microphone(s)
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="equipmentNeeds.speakers" name="equipmentNeeds.speakers" checked={formData.equipmentNeeds.speakers} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="equipmentNeeds.speakers" className="ml-2 block text-sm text-gray-700 flex items-center">
                <SpeakerIcon className="h-4 w-4 mr-1 text-gray-500" />
                Sound System
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="equipmentNeeds.stage" name="equipmentNeeds.stage" checked={formData.equipmentNeeds.stage} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="equipmentNeeds.stage" className="ml-2 block text-sm text-gray-700 flex items-center">
                <LayoutIcon className="h-4 w-4 mr-1 text-gray-500" />
                Stage/Riser
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="equipmentNeeds.lighting" name="equipmentNeeds.lighting" checked={formData.equipmentNeeds.lighting} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="equipmentNeeds.lighting" className="ml-2 block text-sm text-gray-700">
                Special Lighting
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="equipmentNeeds.danceFloor" name="equipmentNeeds.danceFloor" checked={formData.equipmentNeeds.danceFloor} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="equipmentNeeds.danceFloor" className="ml-2 block text-sm text-gray-700">
                Dance Floor
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="equipmentNeeds.tables" name="equipmentNeeds.tables" checked={formData.equipmentNeeds.tables} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="equipmentNeeds.tables" className="ml-2 block text-sm text-gray-700 flex items-center">
                <TableIcon className="h-4 w-4 mr-1 text-gray-500" />
                Tables
              </label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="equipmentNeeds.chairs" name="equipmentNeeds.chairs" checked={formData.equipmentNeeds.chairs} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="equipmentNeeds.chairs" className="ml-2 block text-sm text-gray-700">
                Chairs
              </label>
            </div>
          </div>
          {(formData.equipmentNeeds.tables || formData.equipmentNeeds.chairs) && <div className="md:col-span-2 grid grid-cols-2 gap-4">
              {formData.equipmentNeeds.tables && <div>
                  <label htmlFor="equipmentNeeds.tablesCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Tables
                  </label>
                  <input type="number" id="equipmentNeeds.tablesCount" name="equipmentNeeds.tablesCount" value={formData.equipmentNeeds.tablesCount} onChange={onInputChange} min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>}
              {formData.equipmentNeeds.chairs && <div>
                  <label htmlFor="equipmentNeeds.chairsCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Chairs
                  </label>
                  <input type="number" id="equipmentNeeds.chairsCount" name="equipmentNeeds.chairsCount" value={formData.equipmentNeeds.chairsCount} onChange={onInputChange} min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>}
            </div>}
        </div>
      </div>
      {/* Catering/Bar */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Catering & Bar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="cateringNeeds.service" className="block text-sm font-medium text-gray-700 mb-1">
              Catering Service
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UtensilsIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select id="cateringNeeds.service" name="cateringNeeds.service" value={formData.cateringNeeds.service} onChange={onInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="none">No catering needed</option>
                <option value="basic">Basic catering (buffet style)</option>
                <option value="full">
                  Full-service catering (plated meals)
                </option>
                <option value="outside">Using outside caterer</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="cateringNeeds.barPackage" className="block text-sm font-medium text-gray-700 mb-1">
              Bar Service
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <WineIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select id="cateringNeeds.barPackage" name="cateringNeeds.barPackage" value={formData.cateringNeeds.barPackage} onChange={onInputChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="none">No bar service needed</option>
                <option value="beer-wine">Beer & Wine Only</option>
                <option value="full-bar">Full Bar Service</option>
                <option value="custom">Custom Bar Package</option>
              </select>
            </div>
          </div>
          {(formData.cateringNeeds.service !== 'none' || formData.cateringNeeds.barPackage !== 'none') && <div className="md:col-span-2">
              <label htmlFor="cateringNeeds.dietaryRequirements" className="block text-sm font-medium text-gray-700 mb-1">
                Dietary Requirements/Special Requests
              </label>
              <textarea id="cateringNeeds.dietaryRequirements" name="cateringNeeds.dietaryRequirements" value={formData.cateringNeeds.dietaryRequirements} onChange={onInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Please list any dietary restrictions, allergies, or special catering/bar requests..."></textarea>
            </div>}
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
                Please complete all required selections
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {venue.spaces && venue.spaces.length > 1 && formData.selectedSpaces.length === 0 && <li>Select at least one space for your event</li>}
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
          Continue to Services & Add-ons
        </button>
      </div>
    </div>;
};