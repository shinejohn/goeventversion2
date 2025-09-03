import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
export const MarginEventAds = () => {
  // Mock ad data
  const ads = [{
    id: 'ad-1',
    title: 'Upcoming Jazz Festival',
    description: "Don't miss the biggest jazz event of the year!",
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    link: '/events/jazz-festival'
  }, {
    id: 'ad-2',
    title: 'Book Your Venue',
    description: 'List your venue and connect with event organizers.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    link: '/venues/submit'
  }];
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  // Rotate ads every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % ads.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [ads.length]);
  if (!isVisible) return null;
  const currentAd = ads[currentAdIndex];
  return <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 max-w-xs">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {!isMinimized && currentAd ? <>
            <div className="relative">
              <img src={currentAd?.image} alt={currentAd?.title} className="w-full h-32 object-cover" />
              <div className="absolute top-2 right-2 flex space-x-1">
                <button onClick={() => setIsMinimized(true)} className="bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70" title="Minimize">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button onClick={() => setIsVisible(false)} className="bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70" title="Close">
                  <XIcon className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-medium text-sm text-gray-900 mb-1">
                {currentAd?.title}
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                {currentAd?.description}
              </p>
              <a href={currentAd?.link} className="inline-block bg-indigo-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-indigo-700">
                Learn More
              </a>
            </div>
            <div className="px-3 pb-2">
              <div className="flex space-x-1">
                {ads.map((_, index) => <div key={index} className={`h-1 w-4 rounded ${index === currentAdIndex ? 'bg-indigo-600' : 'bg-gray-300'}`} />)}
              </div>
            </div>
          </> : <div className="p-2 flex items-center justify-between">
            <span className="text-xs text-gray-600">Event Ad</span>
            <div className="flex space-x-1">
              <button onClick={() => setIsMinimized(false)} className="text-gray-400 hover:text-gray-600" title="Expand">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
              <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-gray-600" title="Close">
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>}
      </div>
    </div>;
};