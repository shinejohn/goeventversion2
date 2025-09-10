import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { SearchIcon, UsersIcon, PlusIcon, FilterIcon, ChevronDownIcon, CalendarIcon, MessageCircleIcon, UserIcon, CheckIcon, XIcon, GlobeIcon, LockIcon } from 'lucide-react';
// Mock data for groups
const mockGroups = [{
  id: 'group-1',
  name: 'Clearwater Music Lovers',
  description: 'A community of music enthusiasts in the Clearwater area. We share upcoming concerts, discuss local bands, and organize meetups.',
  coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  members: 1245,
  friendsInGroup: 8,
  privacy: 'public',
  joined: true,
  activity: 'Very active',
  lastActive: '2 hours ago',
  category: 'Music'
}, {
  id: 'group-2',
  name: 'Clearwater Beach Events',
  description: 'Stay updated on all events happening at Clearwater Beach. From festivals to sunset celebrations, this is your go-to community.',
  coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  members: 3567,
  friendsInGroup: 15,
  privacy: 'public',
  joined: false,
  activity: 'Very active',
  lastActive: '1 hour ago',
  category: 'Local Events'
}, {
  id: 'group-3',
  name: 'Florida Musicians Network',
  description: 'A professional network for musicians across Florida. Find gigs, collaborate with other artists, and share industry insights.',
  coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  avatar: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  members: 5621,
  friendsInGroup: 3,
  privacy: 'private',
  joined: true,
  activity: 'Active',
  lastActive: '1 day ago',
  category: 'Professional'
}, {
  id: 'group-4',
  name: 'Tampa Bay Foodies',
  description: 'Discover the best restaurants, food trucks, and culinary events in Tampa Bay. Share your food experiences and recommendations.',
  coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  avatar: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  members: 7834,
  friendsInGroup: 22,
  privacy: 'public',
  joined: true,
  activity: 'Very active',
  lastActive: '5 hours ago',
  category: 'Food & Drink'
}, {
  id: 'group-5',
  name: 'Clearwater Art Community',
  description: 'Connect with local artists, discover galleries, and stay informed about art exhibitions and workshops in the Clearwater area.',
  coverImage: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  avatar: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  members: 2156,
  friendsInGroup: 5,
  privacy: 'public',
  joined: false,
  activity: 'Somewhat active',
  lastActive: '3 days ago',
  category: 'Arts & Culture'
}, {
  id: 'group-6',
  name: 'Florida Event Planners',
  description: 'A professional group for event planners in Florida. Share resources, discuss industry trends, and network with peers.',
  coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  avatar: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  members: 1823,
  friendsInGroup: 2,
  privacy: 'private',
  joined: false,
  activity: 'Active',
  lastActive: '2 days ago',
  category: 'Professional'
}];
// Mock data for suggested groups
const suggestedGroups = [{
  id: 'group-7',
  name: 'Clearwater Photography Club',
  description: 'Share your photography, learn new techniques, and join photo walks around Clearwater and Tampa Bay.',
  coverImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  avatar: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  members: 954,
  friendsInGroup: 1,
  privacy: 'public',
  joined: false,
  activity: 'Somewhat active',
  lastActive: '1 week ago',
  category: 'Photography'
}, {
  id: 'group-8',
  name: 'Tampa Bay Sports Fans',
  description: 'The ultimate community for Tampa Bay sports enthusiasts. Discuss Bucs, Rays, Lightning, and local sports events.',
  coverImage: 'https://images.unsplash.com/photo-1471295253337-3ceaaad65897?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  avatar: 'https://images.unsplash.com/photo-1471295253337-3ceaaad65897?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  members: 12453,
  friendsInGroup: 7,
  privacy: 'public',
  joined: false,
  activity: 'Very active',
  lastActive: '3 hours ago',
  category: 'Sports'
}, {
  id: 'group-9',
  name: 'Clearwater Tech Meetup',
  description: 'Connect with tech professionals in Clearwater. We organize regular meetups, workshops, and networking events.',
  coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  members: 765,
  friendsInGroup: 3,
  privacy: 'public',
  joined: false,
  activity: 'Active',
  lastActive: '2 days ago',
  category: 'Technology'
}];
// Group categories
const groupCategories = ['All Categories', 'Music', 'Local Events', 'Food & Drink', 'Arts & Culture', 'Professional', 'Sports', 'Technology', 'Photography', 'Outdoors', 'Family', 'Education', 'Health & Wellness'];
const GroupsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [groups, setGroups] = useState(mockGroups);
  const [suggestions, setSuggestions] = useState(suggestedGroups);
  // Handle joining a group
  const handleJoinGroup = (groupId: string) => {
    // If in suggestions, move to groups
    const suggestedGroup = suggestions.find(group => group.id === groupId);
    if (suggestedGroup) {
      setSuggestions(suggestions.filter(group => group.id !== groupId));
      setGroups([...groups, {
        ...suggestedGroup,
        joined: true
      }]);
      return;
    }
    // Otherwise just update the joined status
    setGroups(groups.map(group => group.id === groupId ? {
      ...group,
      joined: true
    } : group));
  };
  // Handle leaving a group
  const handleLeaveGroup = (groupId: string) => {
    setGroups(groups.map(group => group.id === groupId ? {
      ...group,
      joined: false
    } : group));
  };
  // Filter groups based on search query and category
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) || group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || group.category === selectedCategory;
    const matchesTab = activeTab === 'my-groups' ? group.joined : true;
    return matchesSearch && matchesCategory && matchesTab;
  });
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
          <p className="text-gray-600">
            Connect with people who share your interests
          </p>
        </div>

        {/* Main content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4">
                <button onClick={() => navigate('/social/groups/create')} className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create New Group
                </button>
              </div>
              <div className="border-t border-gray-200">
                <nav className="p-2">
                  <button onClick={() => setActiveTab('my-groups')} className={`flex items-center w-full px-3 py-2 text-left rounded-md ${activeTab === 'my-groups' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <UsersIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">My Groups</span>
                    <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {groups.filter(g => g.joined).length}
                    </span>
                  </button>
                  <button onClick={() => setActiveTab('discover')} className={`flex items-center w-full px-3 py-2 text-left rounded-md ${activeTab === 'discover' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <GlobeIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">Discover Groups</span>
                  </button>
                  <button onClick={() => setActiveTab('invites')} className={`flex items-center w-full px-3 py-2 text-left rounded-md ${activeTab === 'invites' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    <MessageCircleIcon className="h-5 w-5 mr-3" />
                    <span className="font-medium">Group Invites</span>
                    <span className="ml-auto bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                      3
                    </span>
                  </button>
                </nav>
              </div>
            </div>
            {/* Categories filter */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Categories</h3>
              </div>
              <div className="p-4 max-h-80 overflow-y-auto">
                <div className="space-y-2">
                  {groupCategories.map(category => <button key={category} onClick={() => setSelectedCategory(category)} className={`flex items-center w-full px-3 py-2 text-left rounded-md ${selectedCategory === category ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                      {category}
                    </button>)}
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="md:w-3/4">
            {/* Search and filter */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" placeholder="Search groups" className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <FilterIcon className="h-4 w-4 mr-2" />
                    Filter
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Groups content based on active tab */}
            {activeTab === 'my-groups' && <div>
                <h2 className="text-xl font-semibold mb-4">My Groups</h2>
                {filteredGroups.filter(g => g.joined).length > 0 ? <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredGroups.filter(g => g.joined).map(group => <div key={group.id} className="bg-white rounded-lg shadow overflow-hidden">
                          {/* Group header */}
                          <div className="h-32 relative">
                            <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                              <h3 className="text-white font-semibold text-lg">
                                {group.name}
                              </h3>
                            </div>
                            <div className="absolute top-2 right-2">
                              {group.privacy === 'private' ? <span className="bg-gray-800/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                  <LockIcon className="h-3 w-3 mr-1" />
                                  Private
                                </span> : <span className="bg-gray-800/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                  <GlobeIcon className="h-3 w-3 mr-1" />
                                  Public
                                </span>}
                            </div>
                          </div>
                          {/* Group info */}
                          <div className="p-4">
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {group.description}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                              <div className="flex items-center mr-4">
                                <UsersIcon className="h-4 w-4 mr-1" />
                                {group.members.toLocaleString()} members
                              </div>
                              <div>
                                {group.friendsInGroup}{' '}
                                {group.friendsInGroup === 1 ? 'friend' : 'friends'}{' '}
                                in group
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {group.activity} • Last active{' '}
                                {group.lastActive}
                              </span>
                              <div className="flex space-x-2">
                                <button onClick={() => navigate(`/social/groups/${group.id}`)} className="px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200">
                                  View
                                </button>
                                <button onClick={() => handleLeaveGroup(group.id)} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                  Leave
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>)}
                  </div> : <div className="bg-white rounded-lg shadow p-8 text-center">
                    <UsersIcon className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No groups found
                    </h3>
                    <p className="mt-1 text-gray-500">
                      You haven't joined any groups yet or none match your
                      search.
                    </p>
                    <div className="mt-6">
                      <button onClick={() => setActiveTab('discover')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Discover Groups
                      </button>
                    </div>
                  </div>}
              </div>}

            {activeTab === 'discover' && <div>
                <h2 className="text-xl font-semibold mb-4">Discover Groups</h2>
                {/* Suggested groups section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">
                    Suggested for You
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {suggestions.map(group => <div key={group.id} className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Group header */}
                        <div className="h-32 relative">
                          <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                            <h3 className="text-white font-semibold text-lg">
                              {group.name}
                            </h3>
                          </div>
                          <div className="absolute top-2 right-2">
                            {group.privacy === 'private' ? <span className="bg-gray-800/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                <LockIcon className="h-3 w-3 mr-1" />
                                Private
                              </span> : <span className="bg-gray-800/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                <GlobeIcon className="h-3 w-3 mr-1" />
                                Public
                              </span>}
                          </div>
                        </div>
                        {/* Group info */}
                        <div className="p-4">
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {group.description}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <div className="flex items-center mr-4">
                              <UsersIcon className="h-4 w-4 mr-1" />
                              {group.members.toLocaleString()} members
                            </div>
                            <div>
                              {group.friendsInGroup}{' '}
                              {group.friendsInGroup === 1 ? 'friend' : 'friends'}{' '}
                              in group
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {group.activity} • Last active {group.lastActive}
                            </span>
                            <div className="flex space-x-2">
                              <button onClick={() => handleJoinGroup(group.id)} className="px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200">
                                Join
                              </button>
                              <button onClick={() => navigate(`/social/groups/${group.id}`)} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>
                {/* Browse all groups */}
                <h3 className="text-lg font-medium mb-4">Browse All Groups</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredGroups.filter(g => !g.joined).map(group => <div key={group.id} className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Group header */}
                        <div className="h-32 relative">
                          <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                            <h3 className="text-white font-semibold text-lg">
                              {group.name}
                            </h3>
                          </div>
                          <div className="absolute top-2 right-2">
                            {group.privacy === 'private' ? <span className="bg-gray-800/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                <LockIcon className="h-3 w-3 mr-1" />
                                Private
                              </span> : <span className="bg-gray-800/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                <GlobeIcon className="h-3 w-3 mr-1" />
                                Public
                              </span>}
                          </div>
                        </div>
                        {/* Group info */}
                        <div className="p-4">
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                            {group.description}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <div className="flex items-center mr-4">
                              <UsersIcon className="h-4 w-4 mr-1" />
                              {group.members.toLocaleString()} members
                            </div>
                            <div>
                              {group.friendsInGroup}{' '}
                              {group.friendsInGroup === 1 ? 'friend' : 'friends'}{' '}
                              in group
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {group.activity} • Last active {group.lastActive}
                            </span>
                            <div className="flex space-x-2">
                              <button onClick={() => handleJoinGroup(group.id)} className="px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200">
                                Join
                              </button>
                              <button onClick={() => navigate(`/social/groups/${group.id}`)} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>)}
                </div>
              </div>}

            {activeTab === 'invites' && <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Group Invites
                  </h2>
                </div>
                <div className="p-4">
                  {/* Sample invites */}
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Group avatar" className="h-12 w-12 rounded-lg object-cover" />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">
                              Clearwater Music Festival Volunteers
                            </h3>
                            <span className="text-xs text-gray-500">
                              2 days ago
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Jessica Taylor invited you to join this group
                          </p>
                          <div className="mt-3 flex space-x-2">
                            <button className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                              <CheckIcon className="h-4 w-4 mr-1 inline-block" />
                              Accept
                            </button>
                            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
                              <XIcon className="h-4 w-4 mr-1 inline-block" />
                              Decline
                            </button>
                            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                              View Group
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <img src="https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Group avatar" className="h-12 w-12 rounded-lg object-cover" />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">
                              Tampa Bay Music Producers
                            </h3>
                            <span className="text-xs text-gray-500">
                              1 week ago
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Marcus Wilson invited you to join this group
                          </p>
                          <div className="mt-3 flex space-x-2">
                            <button className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                              <CheckIcon className="h-4 w-4 mr-1 inline-block" />
                              Accept
                            </button>
                            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
                              <XIcon className="h-4 w-4 mr-1 inline-block" />
                              Decline
                            </button>
                            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                              View Group
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Group avatar" className="h-12 w-12 rounded-lg object-cover" />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">
                              Clearwater Foodie Adventures
                            </h3>
                            <span className="text-xs text-gray-500">
                              3 days ago
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Sarah Williams invited you to join this group
                          </p>
                          <div className="mt-3 flex space-x-2">
                            <button className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                              <CheckIcon className="h-4 w-4 mr-1 inline-block" />
                              Accept
                            </button>
                            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
                              <XIcon className="h-4 w-4 mr-1 inline-block" />
                              Decline
                            </button>
                            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                              View Group
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export { GroupsPage };
export default GroupsPage;