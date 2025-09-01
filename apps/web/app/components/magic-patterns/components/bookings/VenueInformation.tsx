import React, { Component } from 'react';
import { MapPinIcon, PhoneIcon, InfoIcon, CarIcon } from 'lucide-react';
type VenueInformationProps = {
  venue: any;
};
export const VenueInformation = ({
  venue
}: VenueInformationProps) => {
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-medium text-gray-900">
          Important Information
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          {/* Venue Address */}
          <div className="flex">
            <MapPinIcon className="h-5 w-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Venue Address
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {venue.location.address}
              </p>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(venue.location.address)}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500">
                View on map
                <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </a>
            </div>
          </div>
          {/* Contact Person */}
          <div className="flex">
            <PhoneIcon className="h-5 w-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Contact Person
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {venue.contactPerson.name}
              </p>
              <p className="text-sm text-gray-600">
                {venue.contactPerson.phone}
              </p>
              <p className="text-sm text-gray-600">
                {venue.contactPerson.email}
              </p>
            </div>
          </div>
          {/* Check-in Instructions */}
          <div className="flex">
            <InfoIcon className="h-5 w-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Check-in Instructions
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {venue.checkInInstructions}
              </p>
            </div>
          </div>
          {/* Parking/Access */}
          <div className="flex">
            <CarIcon className="h-5 w-5 text-gray-400 mt-1 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Parking & Access
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {venue.parkingInformation}
              </p>
            </div>
          </div>
          {/* Cancellation Policy */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">
              Cancellation Policy
            </h3>
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
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
      </div>
    </div>;
};