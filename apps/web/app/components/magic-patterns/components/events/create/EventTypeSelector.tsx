import React, { useState } from 'react';
import { 
  MusicIcon, 
  UsersIcon, 
  StarIcon,
  CalendarIcon,
  CheckIcon,
  ArrowRightIcon
} from 'lucide-react';

interface EventType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  popular?: boolean;
  estimatedTime: string;
}

interface EventTypeSelectorProps {
  onSelect: (type: EventType) => void;
  onNext: () => void;
}

export const EventTypeSelector = ({ onSelect, onNext }: EventTypeSelectorProps) => {
  const [selectedType, setSelectedType] = useState<EventType | null>(null);

  const eventTypes: EventType[] = [
    {
      id: 'concert',
      name: 'Concert',
      description: 'Live music performances and shows',
      icon: <MusicIcon className="h-8 w-8" />,
      color: 'bg-purple-500',
      features: ['Ticket sales', 'Seating charts', 'Artist management', 'Merchandise'],
      popular: true,
      estimatedTime: '15-20 min'
    },
    {
      id: 'conference',
      name: 'Conference',
      description: 'Professional gatherings and seminars',
      icon: <UsersIcon className="h-8 w-8" />,
      color: 'bg-blue-500',
      features: ['Speaker management', 'Session tracking', 'Networking', 'Materials'],
      estimatedTime: '20-25 min'
    },
    {
      id: 'festival',
      name: 'Festival',
      description: 'Multi-day events with multiple activities',
      icon: <StarIcon className="h-8 w-8" />,
      color: 'bg-green-500',
      features: ['Multiple stages', 'Vendor management', 'Camping options', 'Food & drink'],
      estimatedTime: '25-30 min'
    },
    {
      id: 'sports',
      name: 'Sports Event',
      description: 'Athletic competitions and tournaments',
      icon: <UsersIcon className="h-8 w-8" />,
      color: 'bg-red-500',
      features: ['Team management', 'Brackets', 'Live scoring', 'Merchandise'],
      estimatedTime: '15-20 min'
    },
    {
      id: 'workshop',
      name: 'Workshop',
      description: 'Educational and hands-on learning sessions',
      icon: <UsersIcon className="h-8 w-8" />,
      color: 'bg-yellow-500',
      features: ['Materials included', 'Small groups', 'Hands-on learning', 'Certificates'],
      estimatedTime: '10-15 min'
    },
    {
      id: 'exhibition',
      name: 'Exhibition',
      description: 'Art shows, trade shows, and displays',
      icon: <StarIcon className="h-8 w-8" />,
      color: 'bg-indigo-500',
      features: ['Booth management', 'Visitor tracking', 'Networking', 'Lead capture'],
      estimatedTime: '20-25 min'
    }
  ];

  const handleTypeSelect = (type: EventType) => {
    setSelectedType(type);
    onSelect(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">What type of event are you creating?</h1>
            <p className="mt-2 text-gray-600">Choose the type that best fits your event</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {eventTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleTypeSelect(type)}
              className={`relative cursor-pointer rounded-lg border-2 p-6 transition-all hover:shadow-lg ${
                selectedType?.id === type.id
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

              <ul className="space-y-2 mb-4">
                {type.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>Setup time: {type.estimatedTime}</span>
                </div>
              </div>

              {selectedType?.id === type.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Start Options */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-4">
                <StarIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Use Template</h4>
                <p className="text-sm text-gray-600">Start with a pre-made template</p>
              </div>
            </button>
            
            <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-4">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Import from Calendar</h4>
                <p className="text-sm text-gray-600">Import existing events</p>
              </div>
            </button>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedType}
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue with {selectedType?.name || 'Event Type'}
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

