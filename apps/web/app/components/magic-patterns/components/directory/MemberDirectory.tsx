import React, { useEffect, useState } from 'react';
import { SearchIcon, FilterIcon, UsersIcon, MapPinIcon, CalendarIcon, StarIcon, MessageCircleIcon, UserPlusIcon, ChevronDownIcon, XIcon, CheckIcon, ChevronRightIcon, ChevronLeftIcon } from 'lucide-react';
type Member = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  location: string;
  joinDate: string;
  contributionCount: number;
  isFollowing?: boolean;
  badges?: string[];
  bio?: string;
  tags?: string[];
  lastActive?: string;
};
type MemberDirectoryProps = {
  members: Member[];
  onViewProfile: (memberId: string) => void;
  onMessage: (memberId: string) => void;
  onFollow: (memberId: string, isFollowing: boolean) => void;
  isLoading?: boolean;
  totalMembers?: number;
  showFilters?: boolean;
  showPagination?: boolean;
  itemsPerPage?: number;
  onFilterChange?: (filters: MemberFilters) => void;
};
type MemberFilters = {
  role: string;
  joinDate: string;
  activityLevel: string;
  location: string;
  search: string;
};
export const MemberDirectory = ({
  members = [],
  onViewProfile,
  onMessage,
  onFollow,
  isLoading = false,
  totalMembers = 0,
  showFilters = true,
  showPagination = true,
  itemsPerPage = 12,
  onFilterChange
}: MemberDirectoryProps) => {
  const [filters, setFilters] = useState<MemberFilters>({
    role: 'all',
    joinDate: 'all',
    activityLevel: 'all',
    location: 'all',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleMembers, setVisibleMembers] = useState<Member[]>([]);
  // Available filter options
  const roleOptions = ['All', 'Admin', 'Moderator', 'Contributor', 'Member'];
  const joinDateOptions = ['All', 'Today', 'This Week', 'This Month', 'This Year'];
  const activityOptions = ['All', 'Very Active', 'Active', 'Occasional', 'Inactive'];
  useEffect(() => {
    // In a real app, this would likely be handled by the parent component
    // through the onFilterChange callback, which would fetch filtered data from an API
    if (onFilterChange) {
      onFilterChange(filters);
    } else {
      // Simple client-side filtering for demo purposes
      let filtered = [...members];
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(member => member.name.toLowerCase().includes(searchLower) || member.bio?.toLowerCase().includes(searchLower) || member.tags?.some(tag => tag.toLowerCase().includes(searchLower)));
      }
      if (filters.role !== 'all') {
        filtered = filtered.filter(member => member.role.toLowerCase() === filters.role.toLowerCase());
      }
      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedMembers = filtered.slice(startIndex, startIndex + itemsPerPage);
      setVisibleMembers(paginatedMembers);
    }
  }, [filters, members, currentPage, itemsPerPage, onFilterChange]);
  const handleFilterChange = (filterName: keyof MemberFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    // Reset to first page when filters change
    setCurrentPage(1);
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search input is already updated in state through handleFilterChange
    // This just prevents form submission
  };
  const clearFilters = () => {
    setFilters({
      role: 'all',
      joinDate: 'all',
      activityLevel: 'all',
      location: 'all',
      search: ''
    });
    setCurrentPage(1);
  };
  const totalPages = Math.ceil((totalMembers || members.length) / itemsPerPage);
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header with search and filters */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <UsersIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Members Directory
            </h2>
            {totalMembers > 0 && <span className="ml-2 text-sm text-gray-500">
                ({totalMembers} total)
              </span>}
          </div>
          <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
            <input type="text" placeholder="Search members..." value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} className="pl-9 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
          </form>
        </div>
        {showFilters && <>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {/* Filter toggle button (mobile) */}
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="sm:hidden inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <FilterIcon className="h-4 w-4 mr-1" />
                Filters
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </button>
              {/* Desktop filters */}
              <div className="hidden sm:flex flex-wrap items-center gap-2">
                {/* Role filter */}
                <div className="relative">
                  <select value={filters.role} onChange={e => handleFilterChange('role', e.target.value)} className="appearance-none pl-3 pr-8 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="all">All Roles</option>
                    {roleOptions.slice(1).map(role => <option key={role} value={role.toLowerCase()}>
                        {role}
                      </option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                {/* Join date filter */}
                <div className="relative">
                  <select value={filters.joinDate} onChange={e => handleFilterChange('joinDate', e.target.value)} className="appearance-none pl-3 pr-8 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="all">Join Date</option>
                    {joinDateOptions.slice(1).map(option => <option key={option} value={option.toLowerCase().replace(/\s+/g, '_')}>
                        {option}
                      </option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                {/* Activity level filter */}
                <div className="relative">
                  <select value={filters.activityLevel} onChange={e => handleFilterChange('activityLevel', e.target.value)} className="appearance-none pl-3 pr-8 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="all">Activity Level</option>
                    {activityOptions.slice(1).map(option => <option key={option} value={option.toLowerCase().replace(/\s+/g, '_')}>
                        {option}
                      </option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                {/* Clear filters button */}
                {(filters.role !== 'all' || filters.joinDate !== 'all' || filters.activityLevel !== 'all' || filters.location !== 'all' || filters.search !== '') && <button onClick={clearFilters} className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <XIcon className="h-4 w-4 mr-1" />
                    Clear Filters
                  </button>}
              </div>
            </div>
            {/* Mobile filter panel */}
            {isFilterOpen && <div className="sm:hidden mt-4 p-4 bg-gray-50 rounded-md">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select value={filters.role} onChange={e => handleFilterChange('role', e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      <option value="all">All Roles</option>
                      {roleOptions.slice(1).map(role => <option key={role} value={role.toLowerCase()}>
                          {role}
                        </option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Join Date
                    </label>
                    <select value={filters.joinDate} onChange={e => handleFilterChange('joinDate', e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      <option value="all">All Time</option>
                      {joinDateOptions.slice(1).map(option => <option key={option} value={option.toLowerCase().replace(/\s+/g, '_')}>
                          {option}
                        </option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Activity Level
                    </label>
                    <select value={filters.activityLevel} onChange={e => handleFilterChange('activityLevel', e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      <option value="all">Any Activity</option>
                      {activityOptions.slice(1).map(option => <option key={option} value={option.toLowerCase().replace(/\s+/g, '_')}>
                          {option}
                        </option>)}
                    </select>
                  </div>
                  <div className="flex justify-between pt-4">
                    <button onClick={clearFilters} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                      Clear All
                    </button>
                    <button onClick={() => setIsFilterOpen(false)} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>}
          </>}
      </div>
      {/* Member grid */}
      <div className="p-4">
        {isLoading ? <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500">Loading members...</p>
          </div> : visibleMembers.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleMembers.map(member => <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img src={member.avatar} alt={member.name} className="h-14 w-14 rounded-full object-cover" />
                    {member.lastActive && new Date(member.lastActive) > new Date(Date.now() - 15 * 60 * 1000) && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium text-gray-900 truncate cursor-pointer hover:text-indigo-600" onClick={() => onViewProfile(member.id)}>
                        {member.name}
                      </h3>
                      <div className="ml-2 flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.role === 'Admin' ? 'bg-purple-100 text-purple-800' : member.role === 'Moderator' ? 'bg-blue-100 text-blue-800' : member.role === 'Contributor' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {member.role}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span className="truncate">{member.location}</span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>Joined {member.joinDate}</span>
                    </div>
                    {member.contributionCount > 0 && <div className="mt-1 flex items-center text-sm text-gray-500">
                        <StarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{member.contributionCount} contributions</span>
                      </div>}
                    {member.badges && member.badges.length > 0 && <div className="mt-2 flex flex-wrap gap-1">
                        {member.badges.map((badge, index) => <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            {badge}
                          </span>)}
                      </div>}
                  </div>
                </div>
                <div className="mt-4 flex space-x-2 justify-end">
                  <button onClick={() => onMessage(member.id)} className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <MessageCircleIcon className="h-3.5 w-3.5 mr-1" />
                    Message
                  </button>
                  <button onClick={() => onFollow(member.id, !member.isFollowing)} className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-xs font-medium rounded-md ${member.isFollowing ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50' : 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700'}`}>
                    {member.isFollowing ? <>
                        <CheckIcon className="h-3.5 w-3.5 mr-1" />
                        Following
                      </> : <>
                        <UserPlusIcon className="h-3.5 w-3.5 mr-1" />
                        Follow
                      </>}
                  </button>
                </div>
              </div>)}
          </div> : <div className="text-center py-12">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No members found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
            <div className="mt-6">
              <button onClick={clearFilters} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Clear Filters
              </button>
            </div>
          </div>}
      </div>
      {/* Pagination */}
      {showPagination && totalPages > 1 && <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
              Previous
            </button>
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, totalMembers || members.length)}
                </span>{' '}
                of{' '}
                <span className="font-medium">
                  {totalMembers || members.length}
                </span>{' '}
                members
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                {/* Page numbers */}
                {Array.from({
              length: Math.min(5, totalPages)
            }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                // Show all pages if 5 or fewer
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                // Show first 5 pages
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                // Show last 5 pages
                pageNum = totalPages - 4 + i;
              } else {
                // Show 2 pages before and after current page
                pageNum = currentPage - 2 + i;
              }
              return <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}>
                        {pageNum}
                      </button>;
            })}
                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>}
    </div>;
};