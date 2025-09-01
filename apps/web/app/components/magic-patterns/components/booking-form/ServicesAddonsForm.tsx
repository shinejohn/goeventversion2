import React, { useState } from 'react';
import { UserIcon, ShieldIcon, CarIcon, TrashIcon, PlusIcon, XIcon, AlertCircleIcon } from 'lucide-react';
type ServicesAddonsFormProps = {
  formData: any;
  venue: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAddVendor: (vendor: {
    type: string;
    name: string;
    contact: string;
  }) => void;
  onRemoveVendor: (index: number) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  isValid: boolean;
};
export const ServicesAddonsForm = ({
  formData,
  venue,
  onInputChange,
  onAddVendor,
  onRemoveVendor,
  onPrevStep,
  onNextStep,
  isValid
}: ServicesAddonsFormProps) => {
  const [newVendor, setNewVendor] = useState({
    type: '',
    name: '',
    contact: ''
  });
  const handleVendorInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setNewVendor(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleAddVendor = () => {
    if (newVendor.type && newVendor.name && newVendor.contact) {
      onAddVendor(newVendor);
      setNewVendor({
        type: '',
        name: '',
        contact: ''
      });
    }
  };
  const vendorTypes = ['Caterer', 'Photographer', 'Videographer', 'Florist', 'DJ/Entertainment', 'Decorator', 'Bakery', 'Rental Company', 'Lighting', 'Transportation', 'Other'];
  return <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Services & Add-ons
      </h2>
      {/* Additional Services */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Additional Services
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Select any additional services you'd like to add to your booking:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-indigo-300 transition-colors">
            <div className="flex items-start">
              <input type="checkbox" id="additionalServices.eventCoordinator" name="additionalServices.eventCoordinator" checked={formData.additionalServices.eventCoordinator} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <div className="ml-3">
                <label htmlFor="additionalServices.eventCoordinator" className="block font-medium text-gray-900 flex items-center">
                  <UserIcon className="h-4 w-4 mr-2 text-indigo-500" />
                  Event Coordinator
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Professional on-site coordinator to manage your event
                </p>
                <p className="text-sm font-medium text-gray-900 mt-2">$500</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-indigo-300 transition-colors">
            <div className="flex items-start">
              <input type="checkbox" id="additionalServices.securityStaff" name="additionalServices.securityStaff" checked={formData.additionalServices.securityStaff} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <div className="ml-3">
                <label htmlFor="additionalServices.securityStaff" className="block font-medium text-gray-900 flex items-center">
                  <ShieldIcon className="h-4 w-4 mr-2 text-indigo-500" />
                  Security Staff
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Professional security personnel (2 staff members)
                </p>
                <p className="text-sm font-medium text-gray-900 mt-2">$350</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-indigo-300 transition-colors">
            <div className="flex items-start">
              <input type="checkbox" id="additionalServices.valetParking" name="additionalServices.valetParking" checked={formData.additionalServices.valetParking} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <div className="ml-3">
                <label htmlFor="additionalServices.valetParking" className="block font-medium text-gray-900 flex items-center">
                  <CarIcon className="h-4 w-4 mr-2 text-indigo-500" />
                  Valet Parking
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Valet service for your guests (up to 100 vehicles)
                </p>
                <p className="text-sm font-medium text-gray-900 mt-2">$600</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-indigo-300 transition-colors">
            <div className="flex items-start">
              <input type="checkbox" id="additionalServices.decorationServices" name="additionalServices.decorationServices" checked={formData.additionalServices.decorationServices} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <div className="ml-3">
                <label htmlFor="additionalServices.decorationServices" className="block font-medium text-gray-900 flex items-center">
                  <div className="h-4 w-4 mr-2 text-indigo-500" />
                  Decoration Services
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Basic decoration package with consultation
                </p>
                <p className="text-sm font-medium text-gray-900 mt-2">$800</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-indigo-300 transition-colors">
            <div className="flex items-start">
              <input type="checkbox" id="additionalServices.cleanupCrew" name="additionalServices.cleanupCrew" checked={formData.additionalServices.cleanupCrew} onChange={onInputChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1" />
              <div className="ml-3">
                <label htmlFor="additionalServices.cleanupCrew" className="block font-medium text-gray-900 flex items-center">
                  <TrashIcon className="h-4 w-4 mr-2 text-indigo-500" />
                  Cleanup Crew
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Additional cleanup services after your event
                </p>
                <p className="text-sm font-medium text-gray-900 mt-2">$250</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Vendor Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Vendor Information
        </h3>
        <div className="mb-4">
          <div className="flex items-center">
            <input type="radio" id="usingVenuePreferred-yes" name="vendorInformation.usingVenuePreferred" value="true" checked={formData.vendorInformation.usingVenuePreferred} onChange={() => {
            const e = {
              target: {
                name: 'vendorInformation.usingVenuePreferred',
                value: true,
                type: 'checkbox'
              }
            };
            onInputChange(e as any);
          }} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
            <label htmlFor="usingVenuePreferred-yes" className="ml-2 block text-sm text-gray-700">
              I'll use the venue's preferred vendors
            </label>
          </div>
          <div className="flex items-center mt-2">
            <input type="radio" id="usingVenuePreferred-no" name="vendorInformation.usingVenuePreferred" value="false" checked={!formData.vendorInformation.usingVenuePreferred} onChange={() => {
            const e = {
              target: {
                name: 'vendorInformation.usingVenuePreferred',
                value: false,
                type: 'checkbox'
              }
            };
            onInputChange(e as any);
          }} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
            <label htmlFor="usingVenuePreferred-no" className="ml-2 block text-sm text-gray-700">
              I'll bring my own vendors
            </label>
          </div>
        </div>
        {!formData.vendorInformation.usingVenuePreferred && <div className="mt-4">
            <p className="text-sm text-gray-600 mb-4">
              Please list any outside vendors you plan to use for your event:
            </p>
            {/* Vendor List */}
            {formData.vendorInformation.outsideVendors.length > 0 && <div className="mb-4">
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vendor Type
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vendor Name
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact Info
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.vendorInformation.outsideVendors.map((vendor: any, index: number) => <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {vendor.type}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {vendor.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {vendor.contact}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <button type="button" onClick={() => onRemoveVendor(index)} className="text-red-600 hover:text-red-900">
                                <XIcon className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>}
            {/* Add Vendor Form */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Add Vendor
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="vendorType" className="block text-xs font-medium text-gray-700 mb-1">
                    Vendor Type
                  </label>
                  <select id="vendorType" name="type" value={newVendor.type} onChange={handleVendorInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                    <option value="">Select type</option>
                    {vendorTypes.map(type => <option key={type} value={type}>
                        {type}
                      </option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="vendorName" className="block text-xs font-medium text-gray-700 mb-1">
                    Vendor Name
                  </label>
                  <input type="text" id="vendorName" name="name" value={newVendor.name} onChange={handleVendorInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Company name" />
                </div>
                <div>
                  <label htmlFor="vendorContact" className="block text-xs font-medium text-gray-700 mb-1">
                    Contact Info
                  </label>
                  <div className="flex">
                    <input type="text" id="vendorContact" name="contact" value={newVendor.contact} onChange={handleVendorInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Email or phone" />
                    <button type="button" onClick={handleAddVendor} disabled={!newVendor.type || !newVendor.name || !newVendor.contact} className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {!formData.vendorInformation.outsideVendors.length && <div className="mt-2 text-xs text-gray-500">
                <p>
                  Please add at least one vendor if you're bringing your own.
                </p>
              </div>}
          </div>}
      </div>
      {/* Validation Message */}
      {!isValid && <div className="mb-6 p-4 bg-red-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Please complete all required information
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {!formData.vendorInformation.usingVenuePreferred && formData.vendorInformation.outsideVendors.length === 0 && <li>
                        Add at least one vendor if you're bringing your own
                      </li>}
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
          Continue to Contact & Payment
        </button>
      </div>
    </div>;
};