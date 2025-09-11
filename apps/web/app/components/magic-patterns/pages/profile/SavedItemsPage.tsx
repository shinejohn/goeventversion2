import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { CalendarIcon, MapPinIcon, MusicIcon, HeartIcon, TrashIcon, EyeIcon, ShareIcon } from 'lucide-react';

interface SavedItem {
  id: string;
  type: 'event' | 'venue' | 'performer';
  itemId: string;
  savedAt: string;
  event?: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    venue: string;
    location: string;
  };
  venue?: {
    id: string;
    name: string;
    address: string;
    location: string;
  };
  performer?: {
    id: string;
    name: string;
    genre: string;
    image: string;
  };
}

interface SavedItemsData {
  events: SavedItem[];
  venues: SavedItem[];
  performers: SavedItem[];
}

interface SavedItemsPageProps {
  savedItems: SavedItemsData;
  user: {
    id: string;
    email: string;
  } | null;
  error?: string;
}

export const SavedItemsPage = ({ savedItems, user, error }: SavedItemsPageProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'events' | 'venues' | 'performers'>('events');
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  const handleRemoveItem = async (itemId: string) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    
    try {
      // TODO: Implement remove saved item API call
      console.log('Removing item:', itemId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from local state
      // This would be handled by the parent component in a real implementation
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Saved Items</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'events', label: 'Events', count: savedItems.events.length, icon: CalendarIcon },
    { id: 'venues', label: 'Venues', count: savedItems.venues.length, icon: MapPinIcon },
    { id: 'performers', label: 'Performers', count: savedItems.performers.length, icon: MusicIcon },
  ];

  const renderEventItem = (item: SavedItem) => (
    <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.event?.title}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {formatDate(item.event?.startDate || '')} at {formatTime(item.event?.startDate || '')}
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPinIcon className="h-4 w-4 mr-2" />
            {item.event?.venue} - {item.event?.location}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/events/${item.event?.id}`)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              View Event
            </button>
            <button
              onClick={() => navigate(`/events/${item.event?.id}`)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ShareIcon className="h-4 w-4 mr-1" />
              Share
            </button>
          </div>
        </div>
        <button
          onClick={() => handleRemoveItem(item.id)}
          disabled={removingItems.has(item.id)}
          className="ml-4 p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  const renderVenueItem = (item: SavedItem) => (
    <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.venue?.name}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <MapPinIcon className="h-4 w-4 mr-2" />
            {item.venue?.address} - {item.venue?.location}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/venues/${item.venue?.id}`)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              View Venue
            </button>
            <button
              onClick={() => navigate(`/venues/${item.venue?.id}`)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ShareIcon className="h-4 w-4 mr-1" />
              Share
            </button>
          </div>
        </div>
        <button
          onClick={() => handleRemoveItem(item.id)}
          disabled={removingItems.has(item.id)}
          className="ml-4 p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  const renderPerformerItem = (item: SavedItem) => (
    <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={item.performer?.image || '/placeholder-performer.jpg'}
              alt={item.performer?.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.performer?.name}</h3>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <MusicIcon className="h-4 w-4 mr-2" />
              {item.performer?.genre}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/performers/${item.performer?.id}`)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                View Profile
              </button>
              <button
                onClick={() => navigate(`/performers/${item.performer?.id}`)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ShareIcon className="h-4 w-4 mr-1" />
                Share
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => handleRemoveItem(item.id)}
          disabled={removingItems.has(item.id)}
          className="ml-4 p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Items</h1>
          <p className="mt-2 text-gray-600">
            Your favorite events, venues, and performers
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'events' && (
            <div>
              {savedItems.events.length === 0 ? (
                <div className="text-center py-12">
                  <HeartIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved events</h3>
                  <p className="text-gray-600 mb-6">Start exploring events and save your favorites!</p>
                  <button
                    onClick={() => navigate('/events')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Browse Events
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {savedItems.events.map(renderEventItem)}
                </div>
              )}
            </div>
          )}

          {activeTab === 'venues' && (
            <div>
              {savedItems.venues.length === 0 ? (
                <div className="text-center py-12">
                  <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved venues</h3>
                  <p className="text-gray-600 mb-6">Start exploring venues and save your favorites!</p>
                  <button
                    onClick={() => navigate('/venues')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Browse Venues
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {savedItems.venues.map(renderVenueItem)}
                </div>
              )}
            </div>
          )}

          {activeTab === 'performers' && (
            <div>
              {savedItems.performers.length === 0 ? (
                <div className="text-center py-12">
                  <MusicIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved performers</h3>
                  <p className="text-gray-600 mb-6">Start exploring performers and save your favorites!</p>
                  <button
                    onClick={() => navigate('/performers')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Browse Performers
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {savedItems.performers.map(renderPerformerItem)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedItemsPage;
