import React, { Component } from 'react';
/**
 * Component: Event Hero
 * Type: CSR
 * Mockdata: OFF
 * Description: Hero section for event detail page with image, title, and actions
 * Components: None
 */
import { ArrowLeftIcon, ShareIcon, HeartIcon } from 'lucide-react';
type EventHeroProps = {
  image: string;
  title: string;
  date: Date;
  endDate?: Date;
  isSaved: boolean;
  onSaveToggle: () => void;
};
export const EventHero = ({
  image,
  title,
  date,
  endDate,
  isSaved,
  onSaveToggle
}: EventHeroProps) => {
  // Format date for display
  const formatEventDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };
  const formatEventTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  // Create date range string
  const getDateRangeString = () => {
    if (!endDate || date.toDateString() === endDate.toDateString()) {
      return `${formatEventDate(date)} • ${formatEventTime(date)}`;
    }
    // Multi-day event
    return `${formatEventDate(date)} - ${formatEventDate(endDate)}`;
  };
  return <div className="relative h-[300px] sm:h-[350px] md:h-[400px] w-full bg-gray-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={image} alt={title} className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70"></div>
      </div>
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <button onClick={() => window.history.back()} className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full transition-colors duration-150 shadow-md" aria-label="Go back">
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
      </div>
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-10 flex space-x-3">
        <button onClick={() => {
        if (typeof navigator !== "undefined" && navigator.share) {
          typeof navigator !== "undefined" && navigator.share({
            title: title,
            text: `Check out ${title}`,
            url: window.location.href
          });
        }
      }} className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full transition-colors duration-150 shadow-md" aria-label="Share event">
          <ShareIcon className="h-5 w-5" />
        </button>
        <button onClick={onSaveToggle} className={`p-2.5 backdrop-blur-sm rounded-full transition-colors duration-150 shadow-md ${isSaved ? 'bg-pink-500/90 hover:bg-pink-600/90 text-white' : 'bg-black/40 hover:bg-black/60 text-white'}`} aria-label={isSaved ? 'Unsave event' : 'Save event'}>
          <HeartIcon className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>
      {/* Event Title and Date */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-5 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-sm">
            {title}
          </h1>
          <p className="text-base md:text-lg text-white/90 drop-shadow-sm">
            {getDateRangeString()}
          </p>
        </div>
      </div>
    </div>;
};