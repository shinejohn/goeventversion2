import React, { useEffect, useState } from 'react';
import { ExternalLinkIcon, XIcon, ChevronLeftIcon, ChevronRightIcon, CameraIcon } from 'lucide-react';
type VenueImageGalleryProps = {
  images: string[];
  venueName: string;
  virtualTourUrl?: string;
};
export const VenueImageGallery = ({
  images,
  venueName,
  virtualTourUrl
}: VenueImageGalleryProps) => {
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const handleOpenModal = (index: number) => {
    setActiveIndex(index);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };
  const handleCloseModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };
  const handlePrevImage = () => {
    setActiveIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };
  const handleNextImage = () => {
    setActiveIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };
  const handleVirtualTour = () => {
    if (virtualTourUrl) {
      window.open(virtualTourUrl, '_blank');
    } else {
      alert('Virtual tour is not available for this venue');
    }
  };
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showModal) return;
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);
  return <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Image Category Tabs */}
        <div className="mb-4 hidden md:flex space-x-4 justify-center">
          {['all', 'interior', 'exterior', 'events'].map(category => <button key={category} className={`px-4 py-2 text-sm font-medium rounded-full ${activeCategory === category ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} onClick={() => setActiveCategory(category)}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px]">
          {/* Main large image */}
          <div className="md:col-span-2 md:row-span-2 relative">
            <img src={images[0]} alt={`${venueName} - Main view`} className="w-full h-full object-cover rounded-lg cursor-pointer" onClick={() => handleOpenModal(0)} />
          </div>
          {/* Smaller images grid */}
          {images.slice(1, 5).map((image, index) => <div key={index} className="relative hidden md:block">
              <img src={image} alt={`${venueName} - View ${index + 2}`} className="w-full h-full object-cover rounded-lg cursor-pointer" onClick={() => handleOpenModal(index + 1)} />
              {index === 3 && images.length > 5 && <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg cursor-pointer" onClick={() => handleOpenModal(4)}>
                  <span className="text-white text-lg font-medium">
                    +{images.length - 5} more
                  </span>
                </div>}
            </div>)}
        </div>
        {/* View all photos button */}
        <button className="absolute bottom-8 right-8 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md font-medium flex items-center hover:bg-gray-100" onClick={() => handleOpenModal(0)}>
          <CameraIcon className="h-4 w-4 mr-2" />
          View all {images.length} photos
        </button>
        {/* 360° Tour button */}
        {virtualTourUrl && <button className="absolute bottom-8 left-8 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md font-medium flex items-center hover:bg-gray-100" onClick={handleVirtualTour}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" />
              <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 16V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            360° Virtual Tour
          </button>}
      </div>
      {/* Full-screen gallery modal */}
      {showModal && <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Modal header */}
          <div className="p-4 flex justify-between items-center text-white">
            <div className="text-lg font-medium">{venueName}</div>
            <button onClick={handleCloseModal} className="p-1 rounded-full hover:bg-gray-800">
              <XIcon className="h-6 w-6" />
            </button>
          </div>
          {/* Modal content */}
          <div className="flex-1 flex items-center justify-center relative">
            <img src={images[activeIndex]} alt={`${venueName} - View ${activeIndex + 1}`} className="max-h-full max-w-full object-contain" />
            {/* Navigation buttons */}
            <button onClick={handlePrevImage} className="absolute left-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70">
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button onClick={handleNextImage} className="absolute right-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70">
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>
          {/* Modal footer */}
          <div className="p-4 text-white text-center">
            {activeIndex + 1} / {images.length}
          </div>
          {/* Thumbnail strip */}
          <div className="p-4 overflow-x-auto">
            <div className="flex space-x-2">
              {images.map((image, index) => <div key={index} className={`w-20 h-20 flex-shrink-0 cursor-pointer ${index === activeIndex ? 'ring-2 ring-white' : 'opacity-70'}`} onClick={() => setActiveIndex(index)}>
                  <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </div>)}
            </div>
          </div>
        </div>}
    </div>;
};