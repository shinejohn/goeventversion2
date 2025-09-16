import React, { useState } from 'react';
import { 
  CalendarIcon, 
  MapPinIcon, 
  UsersIcon,
  MusicIcon,
  StarIcon,
  ArrowRightIcon,
  PlusIcon,
  ClockIcon,
  DollarSignIcon
} from 'lucide-react';
import { useNavigate } from 'react-router';

interface EventType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  popular?: boolean;
}

export const EventCreationStart = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const eventTypes: EventType[] = [
    {
      id: 'concert',
      name: 'Concert',
      description: 'Live music performances and shows',
      icon: <MusicIcon className="h-8 w-8" />,
      color: 'bg-purple-500',
      features: ['Ticket sales', 'Seating charts', 'Artist management', 'Merchandise'],
      popular: true
    },
    {
      id: 'conference',
      name: 'Conference',
      description: 'Professional gatherings and seminars',
      icon: <UsersIcon className="h-8 w-8" />,
      color: 'bg-blue-500',
      features: ['Speaker management', 'Session tracking', 'Networking', 'Materials']
    },
    {
      id: 'festival',
      name: 'Festival',
      description: 'Multi-day events with multiple activities',
      icon: <StarIcon className="h-8 w-8" />,
      color: 'bg-green-500',
      features: ['Multiple stages', 'Vendor management', 'Camping options', 'Food & drink']
    },
    {
      id: 'sports',
      name: 'Sports Event',
      description: 'Athletic competitions and tournaments',
      icon: <UsersIcon className="h-8 w-8" />,
      color: 'bg-red-500',
      features: ['Team management', 'Brackets', 'Live scoring', 'Merchandise']
    },
    {
      id: 'workshop',
      name: 'Workshop',
      description: 'Educational and hands-on learning sessions',
      icon: <UsersIcon className="h-8 w-8" />,
      color: 'bg-yellow-500',
      features: ['Materials included', 'Small groups', 'Hands-on learning', 'Certificates']
    },
    {
      id: 'exhibition',
      name: 'Exhibition',
      description: 'Art shows, trade shows, and displays',
      icon: <StarIcon className="h-8 w-8" />,
      color: 'bg-indigo-500',
      features: ['Booth management', 'Visitor tracking', 'Networking', 'Lead capture']
    }
  ];

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleContinue = () => {
    if (selectedType) {
      navigate(`/events/create/details?type=${selectedType}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Your Event</h1>
              <p className="mt-2 text-gray-600">Choose the type of event you want to create</p>
            </div>
            <button
              onClick={() => navigate('/events')}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-indigo-600">Event Type</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Details</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Tickets</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                4
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">Publish</span>
            </div>
          </div>
        </div>

        {/* Event Type Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What type of event are you creating?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all hover:shadow-lg ${
                  selectedType === type.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {type.popular && (
                  <div className="absolute -top-2 -right-2">
                    <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                
                <div className="flex items-center mb-4">
                  <div className={`${type.color} text-white p-3 rounded-lg mr-4`}>
                    {type.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {type.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {selectedType === type.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start Options */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/events/create/quick')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-4">
                <PlusIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Quick Event</h4>
                <p className="text-sm text-gray-600">Create a simple event in minutes</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/events/create/template')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
            >
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-4">
                <StarIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Use Template</h4>
                <p className="text-sm text-gray-600">Start with a pre-made template</p>
              </div>
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!selectedType}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

