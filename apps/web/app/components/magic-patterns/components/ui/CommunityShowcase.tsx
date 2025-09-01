import React, { useEffect, useState, Component } from 'react';
/**
 * Page: Community Showcase Component
 * Type: CSR
 * Mockdata: ON
 * Description: Rotating background images with community stats and featured event advertising
 * Components: None
 */
import { useNavigationContext } from '../../context/NavigationContext';
import { ArrowRightIcon } from 'lucide-react';
// Mock data for community showcase
const mockShowcaseData = [{
  id: 1,
  image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  title: 'Clearwater Beach Festival',
  eventUrl: '/event',
  stats: {
    events: 427,
    venues: 85,
    performers: 230
  }
}, {
  id: 2,
  image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  title: 'Downtown Music Series',
  eventUrl: '/event',
  stats: {
    events: 312,
    venues: 64,
    performers: 180
  }
}, {
  id: 3,
  image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  title: 'Art Walk & Gallery Night',
  eventUrl: '/event',
  stats: {
    events: 215,
    venues: 42,
    performers: 95
  }
}];
export const CommunityShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {
    navigateTo
  } = useNavigationContext();
  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % mockShowcaseData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const currentShowcase = mockShowcaseData[currentIndex];
  const handleEventClick = () => {
    navigateTo(currentShowcase.eventUrl);
  };
  return <>
      <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
      <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000" style={{
      backgroundImage: `url(${currentShowcase.image})`
    }}></div>
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-20 px-8 cursor-pointer" onClick={handleEventClick}>
        <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
          Featured Event
        </div>
        <h1 className="text-4xl font-bold mb-4">{currentShowcase.title}</h1>
        <button className="mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 border border-white border-opacity-30" onClick={handleEventClick}>
          View Event Details
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </button>
        <div className="grid grid-cols-3 gap-8 mt-8">
          <div className="text-center">
            <div className="text-4xl font-bold">
              {currentShowcase.stats.events}
            </div>
            <div className="text-sm mt-1">Events Today</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">
              {currentShowcase.stats.venues}
            </div>
            <div className="text-sm mt-1">Local Venues</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">
              {currentShowcase.stats.performers}
            </div>
            <div className="text-sm mt-1">Performers</div>
          </div>
        </div>
        <div className="mt-12">
          <div className="text-lg font-medium mb-2">
            Join your local community
          </div>
          <div className="text-sm opacity-80">
            Discover events, connect with others, and never miss what's
            happening
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
        <div className="flex space-x-2">
          {mockShowcaseData.map((_, index) => <button key={index} className={`h-2 w-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`} onClick={e => {
          e.stopPropagation();
          setCurrentIndex(index);
        }} aria-label={`View showcase ${index + 1}`}></button>)}
        </div>
      </div>
    </>;
};