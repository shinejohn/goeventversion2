import React, { useState } from 'react';
import { SearchIcon, FilterIcon, CalendarIcon, MapPinIcon, MusicIcon, DollarSignIcon, ClockIcon, ArrowRightIcon, CheckCircleIcon } from 'lucide-react';
import { useNavigationContext } from '../../context/NavigationContext';
export const GigsMarketplacePage = () => {
  const {
    navigateTo
  } = useNavigationContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gigType: [],
    location: [],
    payRange: [],
    dateRange: '',
    performerType: []
  });
  // Mock gigs data
  const gigs = [{
    id: 'gig-1',
    title: 'Wedding Ceremony & Reception Band',
    description: 'Looking for a versatile band to play during our wedding ceremony and reception. Must be able to play a mix of classical for the ceremony and upbeat dance music for the reception.',
    date: '2024-08-15',
    time: '4:00 PM - 10:00 PM',
    location: 'Clearwater, FL',
    venue: 'Clearwater Beach Resort',
    payRange: '$800-1000',
    gigType: 'Wedding',
    performerType: 'Band',
    postedDate: '2024-06-01',
    applications: 5,
    isVerified: true,
    isPremium: true,
    contactName: 'Sarah Johnson',
    requirements: 'Must have experience with weddings. Repertoire should include classic love songs and popular dance hits.'
  }, {
    id: 'gig-2',
    title: 'Corporate Event DJ Needed',
    description: 'Seeking an experienced DJ for our annual company party. Looking for someone who can read the room and play appropriate music for a corporate environment while keeping energy high.',
    date: '2024-07-20',
    time: '7:00 PM - 11:00 PM',
    location: 'Tampa, FL',
    venue: 'Tampa Convention Center',
    payRange: '$500-700',
    gigType: 'Corporate Event',
    performerType: 'DJ',
    postedDate: '2024-06-02',
    applications: 8,
    isVerified: true,
    isPremium: false,
    contactName: 'Michael Torres',
    requirements: 'Professional appearance required. Must have own equipment and backup systems.'
  }, {
    id: 'gig-3',
    title: 'Acoustic Performer for Restaurant',
    description: 'Local seafood restaurant looking for an acoustic performer for regular weekend gigs. Singer-songwriter or small acoustic group preferred.',
    date: '2024-07-14',
    time: '6:00 PM - 9:00 PM',
    location: 'St. Petersburg, FL',
    venue: 'Seaside Grill',
    payRange: '$200-300',
    gigType: 'Restaurant',
    performerType: 'Solo Artist',
    postedDate: '2024-06-03',
    applications: 12,
    isVerified: true,
    isPremium: false,
    contactName: 'Lisa Martinez',
    requirements: 'Must have own equipment. Looking for mellow, crowd-pleasing covers and originals.'
  }, {
    id: 'gig-4',
    title: 'Jazz Band for Charity Fundraiser',
    description: 'Annual charity gala seeking a sophisticated jazz ensemble to provide background music during dinner and cocktail hour.',
    date: '2024-08-05',
    time: '5:30 PM - 8:30 PM',
    location: 'Clearwater, FL',
    venue: 'Clearwater Country Club',
    payRange: '$600-800',
    gigType: 'Charity Event',
    performerType: 'Jazz Group',
    postedDate: '2024-06-04',
    applications: 3,
    isVerified: true,
    isPremium: true,
    contactName: 'Robert Wilson',
    requirements: 'Professional attire required. Should have extensive jazz repertoire suitable for upscale events.'
  }, {
    id: 'gig-5',
    title: 'Cover Band for Beach Bar',
    description: 'Popular beach bar looking for an energetic cover band to play weekend nights throughout summer. Must know popular hits from 70s to today.',
    date: '2024-07-12',
    time: '8:00 PM - 12:00 AM',
    location: 'St. Petersburg, FL',
    venue: 'Sunset Beach Bar',
    payRange: '$400-600',
    gigType: 'Bar/Club',
    performerType: 'Cover Band',
    postedDate: '2024-06-05',
    applications: 15,
    isVerified: true,
    isPremium: false,
    contactName: 'Dave Richards',
    requirements: 'High energy a must. Should be comfortable with crowd interaction and requests.'
  }, {
    id: 'gig-6',
    title: 'Classical Quartet for Art Gallery Opening',
    description: 'Upscale art gallery seeking a string quartet for new exhibition opening. Looking for classical repertoire to create an elegant atmosphere.',
    date: '2024-07-25',
    time: '6:00 PM - 8:00 PM',
    location: 'Tampa, FL',
    venue: 'Modern Art Gallery',
    payRange: '$500-700',
    gigType: 'Cultural Event',
    performerType: 'Classical Ensemble',
    postedDate: '2024-06-06',
    applications: 2,
    isVerified: true,
    isPremium: false,
    contactName: 'Emily Chen',
    requirements: 'Professional classical training required. Must be punctual and professionally dressed.'
  }];
  // Filter gigs based on search and filters
  const filteredGigs = gigs.filter(gig => {
    // Search term filter
    if (searchTerm && !gig.title.toLowerCase().includes(searchTerm.toLowerCase()) && !gig.description.toLowerCase().includes(searchTerm.toLowerCase()) && !gig.location.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    // Gig type filter
    if (filters.gigType.length > 0 && !filters.gigType.includes(gig.gigType)) {
      return false;
    }
    // Location filter
    if (filters.location.length > 0 && !filters.location.includes(gig.location)) {
      return false;
    }
    // Performer type filter
    if (filters.performerType.length > 0 && !filters.performerType.includes(gig.performerType)) {
      return false;
    }
    // Pay range filter (simplified for demo)
    if (filters.payRange.length > 0) {
      const minPay = parseInt(gig.payRange.replace(/[^0-9-]/g, '').split('-')[0]);
      if (filters.payRange.includes('low') && minPay > 300) return false;
      if (filters.payRange.includes('medium') && (minPay < 300 || minPay > 600)) return false;
      if (filters.payRange.includes('high') && minPay < 600) return false;
    }
    return true;
  });
  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const current = [...prev[category]];
      if (current.includes(value)) {
        return {
          ...prev,
          [category]: current.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [category]: [...current, value]
        };
      }
    });
  };
  const clearFilters = () => {
    setFilters({
      gigType: [],
      location: [],
      payRange: [],
      dateRange: '',
      performerType: []
    });
    setSearchTerm('');
  };
  const handleViewGig = gigId => {
    navigateTo(`/book-it/gigs/${gigId}`);
  };
  // Count active filters
  const activeFilterCount = Object.values(filters).reduce((count, filterArray) => count + (Array.isArray(filterArray) ? filterArray.length : filterArray ? 1 : 0), 0);
  return <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Find Your Next Gig
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl text-purple-100">
              Browse opportunities and connect with people looking to book
              performers
            </p>
          </div>
          {/* Search Form */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="Search gigs by title, description, or location" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="Date Range" value={filters.dateRange} onChange={e => setFilters(prev => ({
                      ...prev,
                      dateRange: e.target.value
                    }))} />
                    </div>
                  </div>
                  <div>
                    <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700" onClick={() => setShowFilters(!showFilters)}>
                      <FilterIcon className="h-5 w-5 mr-2" />
                      Filters{' '}
                      {activeFilterCount > 0 && `(${activeFilterCount})`}
                    </button>
                  </div>
                  <div>
                    <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700" onClick={() => {
                    // In a real app, this would apply the search and filters
                    console.log('Search applied', {
                      searchTerm,
                      filters
                    });
                  }}>
                      Search Gigs
                    </button>
                  </div>
                </div>
                {/* Filter Panel */}
                {showFilters && <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Gig Type
                        </h3>
                        <div className="space-y-2">
                          {['Wedding', 'Corporate Event', 'Private Party', 'Bar/Club', 'Restaurant', 'Charity Event', 'Cultural Event'].map(type => <div key={type} className="flex items-center">
                              <input id={`type-${type}`} name="gigType" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" checked={filters.gigType.includes(type)} onChange={() => toggleFilter('gigType', type)} />
                              <label htmlFor={`type-${type}`} className="ml-3 text-sm text-gray-700">
                                {type}
                              </label>
                            </div>)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Location
                        </h3>
                        <div className="space-y-2">
                          {['Clearwater, FL', 'Tampa, FL', 'St. Petersburg, FL'].map(location => <div key={location} className="flex items-center">
                              <input id={`location-${location}`} name="location" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" checked={filters.location.includes(location)} onChange={() => toggleFilter('location', location)} />
                              <label htmlFor={`location-${location}`} className="ml-3 text-sm text-gray-700">
                                {location}
                              </label>
                            </div>)}
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mt-4 mb-2">
                          Pay Range
                        </h3>
                        <div className="space-y-2">
                          {[{
                        id: 'low',
                        label: 'Up to $300'
                      }, {
                        id: 'medium',
                        label: '$300 - $600'
                      }, {
                        id: 'high',
                        label: '$600+'
                      }].map(option => <div key={option.id} className="flex items-center">
                              <input id={`pay-${option.id}`} name="payRange" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" checked={filters.payRange.includes(option.id)} onChange={() => toggleFilter('payRange', option.id)} />
                              <label htmlFor={`pay-${option.id}`} className="ml-3 text-sm text-gray-700">
                                {option.label}
                              </label>
                            </div>)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          Performer Type
                        </h3>
                        <div className="space-y-2">
                          {['Band', 'DJ', 'Solo Artist', 'Jazz Group', 'Cover Band', 'Classical Ensemble'].map(type => <div key={type} className="flex items-center">
                              <input id={`performer-${type}`} name="performerType" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" checked={filters.performerType.includes(type)} onChange={() => toggleFilter('performerType', type)} />
                              <label htmlFor={`performer-${type}`} className="ml-3 text-sm text-gray-700">
                                {type}
                              </label>
                            </div>)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button type="button" className="text-sm text-gray-700 hover:text-gray-500" onClick={clearFilters}>
                        Clear all filters
                      </button>
                    </div>
                  </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredGigs.length} {filteredGigs.length === 1 ? 'Gig' : 'Gigs'}{' '}
              Available
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeFilterCount > 0 ? `Filtered by ${activeFilterCount} ${activeFilterCount === 1 ? 'criteria' : 'criteria'}` : 'Showing all gigs'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button onClick={() => navigateTo('/book-it/create-gig')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
              Post a New Gig
            </button>
          </div>
        </div>
        {/* Gig Results */}
        {filteredGigs.length === 0 ? <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <MusicIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No gigs found
            </h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any gigs matching your criteria. Try adjusting
              your filters or search terms.
            </p>
            <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200" onClick={clearFilters}>
              Clear all filters
            </button>
          </div> : <div className="space-y-6">
            {filteredGigs.map(gig => <div key={gig.id} className={`bg-white rounded-lg shadow-md overflow-hidden border ${gig.isPremium ? 'border-purple-300' : 'border-gray-200'}`}>
                {gig.isPremium && <div className="bg-purple-100 px-4 py-1 text-xs font-medium text-purple-800 flex items-center justify-center">
                    <CheckCircleIcon className="h-3 w-3 mr-1" /> Premium Gig
                  </div>}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <h3 className="text-xl font-bold text-gray-900">
                          {gig.title}
                        </h3>
                        {gig.isVerified && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />{' '}
                            Verified
                          </span>}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-1">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(gig.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {gig.time}
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {gig.venue}, {gig.location}
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          <MusicIcon className="h-3 w-3 mr-1" />
                          {gig.performerType}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {gig.gigType}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <DollarSignIcon className="h-3 w-3 mr-1" />
                          {gig.payRange}
                        </span>
                      </div>
                      <p className="mt-3 text-gray-600">{gig.description}</p>
                      <div className="mt-4 text-sm text-gray-500">
                        <span className="font-medium">Requirements:</span>{' '}
                        {gig.requirements}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Posted {new Date(gig.postedDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {gig.applications} applications
                        </div>
                      </div>
                      <div className="mt-4">
                        <button type="button" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700" onClick={() => handleViewGig(gig.id)}>
                          View Details
                          <ArrowRightIcon className="ml-1 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">Contact:</span>{' '}
                        {gig.contactName}
                      </div>
                      <button type="button" className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1 border border-purple-300 text-sm font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50" onClick={() => handleViewGig(gig.id)}>
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>
      {/* Create Gig CTA */}
      <div className="bg-purple-50 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Need to hire a performer?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Post your gig for free and connect with talented local performers
              ready to make your event special.
            </p>
            <div className="mt-6">
              <button type="button" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700" onClick={() => navigateTo('/book-it/create-gig')}>
                Create a Gig Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};