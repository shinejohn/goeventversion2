import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, MapPinIcon } from 'lucide-react';
type FilterSidebarProps = {
  selectedGenres: string[];
  selectedAvailability: string | null;
  selectedTouringStatus: string | null;
  selectedExperienceLevel: string | null;
  selectedSpecialFeatures: string[];
  distance: number;
  applyFilters: (genres: string[], availability: string | null, touringStatus: string | null, experienceLevel: string | null, specialFeatures: string[], distance: number) => void;
  resetFilters: () => void;
  isMobile: boolean;
  closeMobileFilter?: () => void;
};
export const FilterSidebar = ({
  selectedGenres,
  selectedAvailability,
  selectedTouringStatus,
  selectedExperienceLevel,
  selectedSpecialFeatures,
  distance,
  applyFilters,
  resetFilters,
  isMobile,
  closeMobileFilter
}: FilterSidebarProps) => {
  // Local state to track filter selections before applying
  const [genres, setGenres] = useState<string[]>(selectedGenres);
  const [availability, setAvailability] = useState<string | null>(selectedAvailability);
  const [touringStatus, setTouringStatus] = useState<string | null>(selectedTouringStatus);
  const [experienceLevel, setExperienceLevel] = useState<string | null>(selectedExperienceLevel);
  const [specialFeatures, setSpecialFeatures] = useState<string[]>(selectedSpecialFeatures);
  const [distanceValue, setDistanceValue] = useState(distance);
  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    genres: true,
    availability: true,
    touringStatus: true,
    experienceLevel: true,
    specialFeatures: true,
    location: true
  });
  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  // Handle genre selection
  const handleGenreChange = (genre: string) => {
    if (genres.includes(genre)) {
      setGenres(genres.filter(g => g !== genre));
    } else {
      setGenres([...genres, genre]);
    }
  };
  // Handle special feature selection
  const handleFeatureChange = (feature: string) => {
    if (specialFeatures.includes(feature)) {
      setSpecialFeatures(specialFeatures.filter(f => f !== feature));
    } else {
      setSpecialFeatures([...specialFeatures, feature]);
    }
  };
  // Apply all filters
  const handleApplyFilters = () => {
    applyFilters(genres, availability, touringStatus, experienceLevel, specialFeatures, distanceValue);
    if (closeMobileFilter && isMobile) {
      closeMobileFilter();
    }
  };
  // Reset all filters
  const handleResetFilters = () => {
    setGenres([]);
    setAvailability(null);
    setTouringStatus(null);
    setExperienceLevel(null);
    setSpecialFeatures([]);
    setDistanceValue(50);
    resetFilters();
    if (closeMobileFilter && isMobile) {
      closeMobileFilter();
    }
  };
  // Genre counts (mock data)
  const genreCounts = {
    'Rock/Alternative': 342,
    'Pop/Top 40': 287,
    'Hip-Hop/Rap': 203,
    'Country/Folk': 178,
    'Jazz/Blues': 156,
    'Electronic/DJ': 189,
    'Classical/Orchestra': 92,
    Comedy: 118,
    'Cover Bands': 223,
    'Kids/Family': 64
  };
  return <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
      </div>
      <div className="p-4 space-y-6">
        {/* Genre/Category Filter */}
        <div>
          <button className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2" onClick={() => toggleSection('genres')}>
            <span>Genre/Category</span>
            {expandedSections.genres ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
          </button>
          {expandedSections.genres && <div className="space-y-2 mt-2">
              {Object.entries(genreCounts).map(([genre, count]) => <div key={genre} className="flex items-center">
                  <input id={`genre-${genre}`} type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={genres.includes(genre)} onChange={() => handleGenreChange(genre)} />
                  <label htmlFor={`genre-${genre}`} className="ml-2 text-sm text-gray-700 flex-grow">
                    {genre}
                  </label>
                  <span className="text-xs text-gray-500">{count}</span>
                </div>)}
              <button className="text-sm text-indigo-600 hover:text-indigo-800 mt-2">
                Show more genres
              </button>
            </div>}
        </div>
        {/* Availability Filter */}
        <div>
          <button className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2" onClick={() => toggleSection('availability')}>
            <span>Availability</span>
            {expandedSections.availability ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
          </button>
          {expandedSections.availability && <div className="space-y-2 mt-2">
              <div className="flex items-center">
                <input id="availability-tonight" type="radio" name="availability" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={availability === 'tonight'} onChange={() => setAvailability('tonight')} />
                <label htmlFor="availability-tonight" className="ml-2 text-sm text-gray-700">
                  Tonight
                </label>
              </div>
              <div className="flex items-center">
                <input id="availability-weekend" type="radio" name="availability" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={availability === 'this-weekend'} onChange={() => setAvailability('this-weekend')} />
                <label htmlFor="availability-weekend" className="ml-2 text-sm text-gray-700">
                  This Weekend
                </label>
              </div>
              <div className="flex items-center">
                <input id="availability-7days" type="radio" name="availability" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={availability === 'next-7-days'} onChange={() => setAvailability('next-7-days')} />
                <label htmlFor="availability-7days" className="ml-2 text-sm text-gray-700">
                  Next 7 Days
                </label>
              </div>
              <div className="flex items-center">
                <input id="availability-30days" type="radio" name="availability" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={availability === 'next-30-days'} onChange={() => setAvailability('next-30-days')} />
                <label htmlFor="availability-30days" className="ml-2 text-sm text-gray-700">
                  Next 30 Days
                </label>
              </div>
              <div className="flex items-center">
                <input id="availability-custom" type="radio" name="availability" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={availability === 'custom-date'} onChange={() => setAvailability('custom-date')} />
                <label htmlFor="availability-custom" className="ml-2 text-sm text-gray-700">
                  Custom Date Range
                </label>
              </div>
              {availability === 'custom-date' && <div className="mt-2 grid grid-cols-2 gap-2">
                  <input type="date" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  <input type="date" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>}
            </div>}
        </div>
        {/* Touring Status */}
        <div>
          <button className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2" onClick={() => toggleSection('touringStatus')}>
            <span>Touring Status</span>
            {expandedSections.touringStatus ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
          </button>
          {expandedSections.touringStatus && <div className="space-y-2 mt-2">
              <div className="flex items-center">
                <input id="touring-all" type="radio" name="touring" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={touringStatus === null} onChange={() => setTouringStatus(null)} />
                <label htmlFor="touring-all" className="ml-2 text-sm text-gray-700">
                  All Performers
                </label>
              </div>
              <div className="flex items-center">
                <input id="touring-now" type="radio" name="touring" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={touringStatus === 'currently-touring'} onChange={() => setTouringStatus('currently-touring')} />
                <label htmlFor="touring-now" className="ml-2 text-sm text-gray-700">
                  Currently Touring
                </label>
              </div>
              <div className="flex items-center">
                <input id="touring-local" type="radio" name="touring" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={touringStatus === 'local-only'} onChange={() => setTouringStatus('local-only')} />
                <label htmlFor="touring-local" className="ml-2 text-sm text-gray-700">
                  Local Artists Only
                </label>
              </div>
              <div className="flex items-center">
                <input id="touring-booking" type="radio" name="touring" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={touringStatus === 'available-booking'} onChange={() => setTouringStatus('available-booking')} />
                <label htmlFor="touring-booking" className="ml-2 text-sm text-gray-700">
                  Available for Booking
                </label>
              </div>
            </div>}
        </div>
        {/* Location Filter */}
        <div>
          <button className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2" onClick={() => toggleSection('location')}>
            <span>Location</span>
            {expandedSections.location ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
          </button>
          {expandedSections.location && <div className="space-y-4 mt-2">
              <div>
                <label htmlFor="distance-slider" className="block text-sm font-medium text-gray-700 mb-2">
                  Within {distanceValue} miles of
                </label>
                <div className="flex items-center gap-2 mb-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" defaultValue="Clearwater, FL">
                    <option>Clearwater, FL</option>
                    <option>Tampa, FL</option>
                    <option>St. Petersburg, FL</option>
                    <option>Use my location</option>
                  </select>
                </div>
                <input id="distance-slider" type="range" min="5" max="100" step="5" value={distanceValue} onChange={e => setDistanceValue(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5 mi</span>
                  <span>50 mi</span>
                  <span>100 mi</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Touring Through
                </label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" defaultValue="">
                  <option value="">Select cities</option>
                  <option>Tampa, FL</option>
                  <option>Orlando, FL</option>
                  <option>Miami, FL</option>
                  <option>Jacksonville, FL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Home Base
                </label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" defaultValue="">
                  <option value="">Any location</option>
                  <option>Clearwater, FL</option>
                  <option>Tampa, FL</option>
                  <option>St. Petersburg, FL</option>
                  <option>Dunedin, FL</option>
                </select>
              </div>
            </div>}
        </div>
        {/* Experience Level */}
        <div>
          <button className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2" onClick={() => toggleSection('experienceLevel')}>
            <span>Experience Level</span>
            {expandedSections.experienceLevel ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
          </button>
          {expandedSections.experienceLevel && <div className="space-y-2 mt-2">
              <div className="flex items-center">
                <input id="experience-all" type="radio" name="experience" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={experienceLevel === null} onChange={() => setExperienceLevel(null)} />
                <label htmlFor="experience-all" className="ml-2 text-sm text-gray-700">
                  All Performers
                </label>
              </div>
              <div className="flex items-center">
                <input id="experience-verified" type="radio" name="experience" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={experienceLevel === 'verified-professionals'} onChange={() => setExperienceLevel('verified-professionals')} />
                <label htmlFor="experience-verified" className="ml-2 text-sm text-gray-700">
                  Verified Professionals
                </label>
              </div>
              <div className="flex items-center">
                <input id="experience-rising" type="radio" name="experience" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={experienceLevel === 'rising-stars'} onChange={() => setExperienceLevel('rising-stars')} />
                <label htmlFor="experience-rising" className="ml-2 text-sm text-gray-700">
                  Rising Stars
                </label>
              </div>
              <div className="flex items-center">
                <input id="experience-established" type="radio" name="experience" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={experienceLevel === 'established-acts'} onChange={() => setExperienceLevel('established-acts')} />
                <label htmlFor="experience-established" className="ml-2 text-sm text-gray-700">
                  Established Acts
                </label>
              </div>
              <div className="flex items-center">
                <input id="experience-legends" type="radio" name="experience" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" checked={experienceLevel === 'legends'} onChange={() => setExperienceLevel('legends')} />
                <label htmlFor="experience-legends" className="ml-2 text-sm text-gray-700">
                  Legends/Veterans
                </label>
              </div>
            </div>}
        </div>
        {/* Special Features */}
        <div>
          <button className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2" onClick={() => toggleSection('specialFeatures')}>
            <span>Special Features</span>
            {expandedSections.specialFeatures ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
          </button>
          {expandedSections.specialFeatures && <div className="space-y-2 mt-2">
              <div className="flex items-center">
                <input id="feature-meet" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={specialFeatures.includes('meet-greet')} onChange={() => handleFeatureChange('meet-greet')} />
                <label htmlFor="feature-meet" className="ml-2 text-sm text-gray-700">
                  Meet & Greets Available
                </label>
              </div>
              <div className="flex items-center">
                <input id="feature-merch" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={specialFeatures.includes('merchandise')} onChange={() => handleFeatureChange('merchandise')} />
                <label htmlFor="feature-merch" className="ml-2 text-sm text-gray-700">
                  Merchandise for Sale
                </label>
              </div>
              <div className="flex items-center">
                <input id="feature-original" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={specialFeatures.includes('original-music')} onChange={() => handleFeatureChange('original-music')} />
                <label htmlFor="feature-original" className="ml-2 text-sm text-gray-700">
                  Original Music
                </label>
              </div>
              <div className="flex items-center">
                <input id="feature-requests" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={specialFeatures.includes('takes-requests')} onChange={() => handleFeatureChange('takes-requests')} />
                <label htmlFor="feature-requests" className="ml-2 text-sm text-gray-700">
                  Takes Requests
                </label>
              </div>
              <div className="flex items-center">
                <input id="feature-private" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={specialFeatures.includes('private-events')} onChange={() => handleFeatureChange('private-events')} />
                <label htmlFor="feature-private" className="ml-2 text-sm text-gray-700">
                  Available for Private Events
                </label>
              </div>
              <div className="flex items-center">
                <input id="feature-family" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" checked={specialFeatures.includes('family-friendly')} onChange={() => handleFeatureChange('family-friendly')} />
                <label htmlFor="feature-family" className="ml-2 text-sm text-gray-700">
                  Family Friendly
                </label>
              </div>
            </div>}
        </div>
        {/* Filter Action Buttons */}
        <div className="pt-4 flex flex-col gap-2">
          <button type="button" onClick={handleApplyFilters} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Apply Filters
          </button>
          <button type="button" onClick={handleResetFilters} className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Reset All
          </button>
        </div>
      </div>
    </div>;
};