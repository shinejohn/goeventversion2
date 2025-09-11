import React from 'react';
import { UserIcon, MapPinIcon, InfoIcon, StarIcon, MessageSquareIcon } from 'lucide-react';
type ContentTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  eventData: any;
};
export const ContentTabs = ({
  activeTab,
  setActiveTab,
  eventData
}: ContentTabsProps) => {
  const tabs = [{
    id: 'overview',
    label: 'Overview',
    icon: <InfoIcon className="h-5 w-5" />
  }, {
    id: 'lineup',
    label: 'Lineup',
    icon: <UserIcon className="h-5 w-5" />
  }, {
    id: 'venue',
    label: 'Venue',
    icon: <MapPinIcon className="h-5 w-5" />
  }, {
    id: 'reviews',
    label: 'Reviews',
    icon: <StarIcon className="h-5 w-5" />
  }, {
    id: 'discussion',
    label: 'Q&A',
    icon: <MessageSquareIcon className="h-5 w-5" />
  }];
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{
            __html: eventData?.description || 'No description available'
          }} />
            <h3>Event Highlights</h3>
            <ul>
              {(eventData?.highlights || []).map((highlight: string, index: number) => <li key={index}>{highlight}</li>)}
            </ul>
            <h3>What to Bring</h3>
            <ul>
              {(eventData?.whatToBring || []).map((item: string, index: number) => <li key={index}>{item}</li>)}
            </ul>
            <h3>Accessibility</h3>
            <ul>
              {(eventData?.accessibility || []).map((item: any, index: number) => <li key={index}>
                  <strong>{item.type}: </strong>
                  {item.details}
                </li>)}
            </ul>
          </div>;
      case 'lineup':
        return <div>
            {(eventData?.lineup || []).map((day: any, index: number) => <div key={index} className="mb-8">
                <h3 className="text-lg font-bold mb-4">{day.day}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(day.acts || []).map((act: any, actIndex: number) => <div key={actIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="h-32 mb-4 rounded-md overflow-hidden">
                        <img src={act.image} alt={act.name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-medium text-lg">{act.name}</h4>
                      <p className="text-gray-600 text-sm">
                        {act.startTime} - {act.endTime}
                      </p>
                      <p className="text-gray-500 text-sm">{act.stage}</p>
                    </div>)}
                </div>
              </div>)}
          </div>;
      case 'venue':
        return <div>
            <h3 className="text-lg font-bold mb-4">About the Venue</h3>
            <p className="text-gray-600 mb-6">{eventData?.venue?.description || 'No venue description available'}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Amenities</h4>
                <ul className="space-y-2">
                  {(eventData?.venue?.amenities || []).map((amenity: string, index: number) => <li key={index} className="flex items-center text-gray-600">
                        <span className="mr-2">•</span>
                        {amenity}
                      </li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Nearby</h4>
                <ul className="space-y-2">
                  {(eventData?.venue?.nearbyAmenities || []).map((item: any, index: number) => <li key={index} className="flex items-center text-gray-600">
                        <span className="mr-2">•</span>
                        {item.name} ({item.distance})
                      </li>)}
                </ul>
              </div>
            </div>
          </div>;
      case 'reviews':
        return <div>
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                <StarIcon className="h-6 w-6 text-yellow-400 fill-current" />
                <span className="ml-2 text-2xl font-bold">
                  {eventData?.reviews?.average || 0}
                </span>
              </div>
              <span className="mx-2 text-gray-500">•</span>
              <span className="text-gray-600">
                {eventData?.reviews?.count || 0} reviews
              </span>
            </div>
            <div className="space-y-6">
              {(eventData?.reviews?.items || []).map((review: any, index: number) => <div key={index} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center mb-2">
                    <img src={review.user?.image} alt={review.user?.name} className="h-10 w-10 rounded-full mr-3" />
                    <div>
                      <div className="font-medium">{review.user?.name || 'Anonymous'}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    {Array.from({
                  length: 5
                }).map((_, i) => <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                  </div>
                  <p className="text-gray-600">{review.text}</p>
                </div>)}
            </div>
          </div>;
      case 'discussion':
        return <div>
            <div className="space-y-6">
              {(eventData?.questions || []).map((qa: any, index: number) => <div key={index} className="border-b border-gray-200 pb-6">
                  <h4 className="font-medium mb-2">{qa.question}</h4>
                  <p className="text-gray-600 mb-2">{qa.answer}</p>
                  <div className="text-sm text-gray-500">
                    Answered by {qa.answeredBy} •{' '}
                    {new Date(qa.date).toLocaleDateString()}
                  </div>
                </div>)}
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`
                flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}>
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>)}
        </nav>
      </div>
      {/* Tab Content */}
      <div className="py-6">{renderTabContent()}</div>
    </div>;
};