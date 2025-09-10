import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { UserPlusIcon, UserIcon, SearchIcon, UsersIcon, UserMinusIcon, MessageCircleIcon, MailIcon, ChevronDownIcon, FilterIcon } from 'lucide-react';
// Mock data for friends
const mockFriends = [{
  id: 'user-234',
  name: 'Jessica Taylor',
  username: 'jessicataylor',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  location: 'Clearwater, FL',
  mutualFriends: 15,
  lastActive: '2 hours ago',
  status: 'friend' // 'friend', 'pending', 'requested'
}, {
  id: 'user-345',
  name: 'Marcus Wilson',
  username: 'marcuswilson',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  location: 'Tampa, FL',
  mutualFriends: 8,
  lastActive: '5 hours ago',
  status: 'friend'
}, {
  id: 'user-456',
  name: 'Sarah Williams',
  username: 'sarahw',
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  location: 'St. Petersburg, FL',
  mutualFriends: 23,
  lastActive: 'Just now',
  status: 'friend'
}, {
  id: 'user-567',
  name: 'Daniel Lee',
  username: 'daniellee',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  location: 'Clearwater, FL',
  mutualFriends: 5,
  lastActive: '1 day ago',
  status: 'friend'
}, {
  id: 'user-678',
  name: 'Sophia Garcia',
  username: 'sophiagarcia',
  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  location: 'Dunedin, FL',
  mutualFriends: 12,
  lastActive: '3 days ago',
  status: 'friend'
}];
// Mock data for friend requests
const mockFriendRequests = [{
  id: 'user-789',
  name: 'Mike Chen',
  username: 'mikechen',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  location: 'Orlando, FL',
  mutualFriends: 3,
  requestDate: '2 days ago',
  status: 'pending' // They sent you a request
}, {
  id: 'user-890',
  name: 'Emily Johnson',
  username: 'emilyj',
  avatar: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  location: 'Tampa, FL',
  mutualFriends: 7,
  requestDate: '1 week ago',
  status: 'pending'
}];
// Mock data for friend suggestions
const mockFriendSuggestions = [{
  id: 'user-901',
  name: 'James Wilson',
  username: 'jameswilson',
  avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  location: 'St. Petersburg, FL',
  mutualFriends: 14,
  status: 'suggestion'
}, {
  id: 'user-012',
  name: 'Olivia Martinez',
  username: 'oliviam',
  avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  location: 'Clearwater, FL',
  mutualFriends: 6,
  status: 'suggestion'
}, {
  id: 'user-123',
  name: 'Ethan Brown',
  username: 'ethanb',
  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  location: 'Tampa, FL',
  mutualFriends: 9,
  status: 'suggestion'
}, {
  id: 'user-234',
  name: 'Ava Thompson',
  username: 'avat',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  location: 'Dunedin, FL',
  mutualFriends: 4,
  status: 'suggestion'
}];
// Mock data for sent requests
const mockSentRequests = [{
  id: 'user-345',
  name: 'Liam Davis',
  username: 'liamd',
  avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  location: 'St. Petersburg, FL',
  mutualFriends: 2,
  requestDate: '3 days ago',
  status: 'requested' // You sent them a request
}, {
  id: 'user-456',
  name: 'Noah Smith',
  username: 'noahs',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  location: 'Tampa, FL',
  mutualFriends: 5,
  requestDate: '1 day ago',
  status: 'requested'
}];
const FriendsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState(mockFriends);
  const [friendRequests, setFriendRequests] = useState(mockFriendRequests);
  const [friendSuggestions, setFriendSuggestions] = useState(mockFriendSuggestions);
  const [sentRequests, setSentRequests] = useState(mockSentRequests);
  // Handle accepting friend request
  const handleAcceptRequest = (userId: string) => {
    // Find the user in friend requests
    const user = friendRequests.find(req => req.id === userId);
    if (!user) return;
    // Remove from requests and add to friends
    setFriendRequests(friendRequests.filter(req => req.id !== userId));
    setFriends([...friends, {
      ...user,
      status: 'friend',
      lastActive: 'Just now'
    }]);
  };
  // Handle declining friend request
  const handleDeclineRequest = (userId: string) => {
    setFriendRequests(friendRequests.filter(req => req.id !== userId));
  };
  // Handle sending friend request
  const handleSendRequest = (userId: string) => {
    // Find the user in suggestions
    const user = friendSuggestions.find(sug => sug.id === userId);
    if (!user) return;
    // Remove from suggestions and add to sent requests
    setFriendSuggestions(friendSuggestions.filter(sug => sug.id !== userId));
    setSentRequests([...sentRequests, {
      ...user,
      status: 'requested',
      requestDate: 'Just now'
    }]);
  };
  // Handle canceling sent request
  const handleCancelRequest = (userId: string) => {
    // Remove from sent requests and add back to suggestions
    const user = sentRequests.find(req => req.id === userId);
    if (!user) return;
    setSentRequests(sentRequests.filter(req => req.id !== userId));
    setFriendSuggestions([...friendSuggestions, {
      ...user,
      status: 'suggestion'
    }]);
  };
  // Handle removing friend
  const handleRemoveFriend = (userId: string) => {
    // Remove from friends and add to suggestions
    const user = friends.find(friend => friend.id === userId);
    if (!user) return;
    setFriends(friends.filter(friend => friend.id !== userId));
    setFriendSuggestions([...friendSuggestions, {
      ...user,
      status: 'suggestion'
    }]);
  };
  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => friend.name.toLowerCase().includes(searchQuery.toLowerCase()) || friend.username.toLowerCase().includes(searchQuery.toLowerCase()));
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Friends</h1>
          <p className="text-gray-600">
            Connect with friends and discover new people with similar interests.
          </p>
        </div>
        {/* Main content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar - Friend navigation */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow">
              <nav className="p-2">
                <button onClick={() => setActiveTab('all')} className={`flex items-center w-full px-3 py-2 text-left rounded-md ${activeTab === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <UsersIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">All Friends</span>
                  <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {friends.length}
                  </span>
                </button>
                <button onClick={() => setActiveTab('requests')} className={`flex items-center w-full px-3 py-2 text-left rounded-md ${activeTab === 'requests' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <UserPlusIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Friend Requests</span>
                  {friendRequests.length > 0 && <span className="ml-auto bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                      {friendRequests.length}
                    </span>}
                </button>
                <button onClick={() => setActiveTab('suggestions')} className={`flex items-center w-full px-3 py-2 text-left rounded-md ${activeTab === 'suggestions' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <UserIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Suggestions</span>
                </button>
                <button onClick={() => setActiveTab('sent')} className={`flex items-center w-full px-3 py-2 text-left rounded-md ${activeTab === 'sent' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <MailIcon className="h-5 w-5 mr-3" />
                  <span className="font-medium">Sent Requests</span>
                  {sentRequests.length > 0 && <span className="ml-auto bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {sentRequests.length}
                    </span>}
                </button>
              </nav>
            </div>
            <div className="mt-6 bg-white rounded-lg shadow p-4">
              <h3 className="font-medium text-gray-900 mb-3">Friend Lists</h3>
              <div className="space-y-2">
                <button className="flex items-center w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-50">
                  <span className="font-medium">Close Friends</span>
                  <span className="ml-auto text-gray-500 text-sm">12</span>
                </button>
                <button className="flex items-center w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-50">
                  <span className="font-medium">Event Buddies</span>
                  <span className="ml-auto text-gray-500 text-sm">8</span>
                </button>
                <button className="flex items-center w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-50">
                  <span className="font-medium">Music Lovers</span>
                  <span className="ml-auto text-gray-500 text-sm">15</span>
                </button>
                <button className="flex items-center w-full px-3 py-2 text-left rounded-md text-gray-700 hover:bg-gray-50">
                  <span className="font-medium">Work Colleagues</span>
                  <span className="ml-auto text-gray-500 text-sm">6</span>
                </button>
              </div>
              <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                + Create New List
              </button>
            </div>
          </div>
          {/* Main content area */}
          <div className="md:w-3/4">
            {/* Search and filter */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input type="text" placeholder="Search friends by name or username" className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <FilterIcon className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    Add Friend
                  </button>
                </div>
              </div>
            </div>
            {/* Friend content based on active tab */}
            {activeTab === 'all' && <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    All Friends ({filteredFriends.length})
                  </h2>
                </div>
                {filteredFriends.length > 0 ? <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredFriends.map(friend => <div key={friend.id} className="border border-gray-200 rounded-lg p-4 flex">
                        <img src={friend.avatar} alt={friend.name} className="h-16 w-16 rounded-full object-cover" />
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium text-gray-900">
                            {friend.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            @{friend.username}
                          </p>
                          <div className="text-xs text-gray-500 mt-1">
                            {friend.location}
                          </div>
                          <div className="text-xs text-gray-500">
                            {friend.mutualFriends} mutual friends • Active{' '}
                            {friend.lastActive}
                          </div>
                          <div className="mt-2 flex space-x-2">
                            <button onClick={() => navigate(`/profile/${friend.username}`)} className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                              View Profile
                            </button>
                            <button onClick={() => navigate(`/social/messages/${friend.id}`)} className="px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200">
                              Message
                            </button>
                            <div className="relative ml-auto">
                              <button className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                                <ChevronDownIcon className="h-4 w-4" />
                              </button>
                              {/* Dropdown menu would go here */}
                            </div>
                          </div>
                        </div>
                      </div>)}
                  </div> : <div className="p-8 text-center">
                    <p className="text-gray-500">
                      No friends found matching your search.
                    </p>
                  </div>}
              </div>}
            {activeTab === 'requests' && <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Friend Requests ({friendRequests.length})
                  </h2>
                </div>
                {friendRequests.length > 0 ? <div className="p-4 space-y-4">
                    {friendRequests.map(request => <div key={request.id} className="border border-gray-200 rounded-lg p-4 flex">
                        <img src={request.avatar} alt={request.name} className="h-16 w-16 rounded-full object-cover" />
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium text-gray-900">
                            {request.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            @{request.username}
                          </p>
                          <div className="text-xs text-gray-500 mt-1">
                            {request.location}
                          </div>
                          <div className="text-xs text-gray-500">
                            {request.mutualFriends} mutual friends • Requested{' '}
                            {request.requestDate}
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <button onClick={() => handleAcceptRequest(request.id)} className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                              Accept
                            </button>
                            <button onClick={() => handleDeclineRequest(request.id)} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
                              Decline
                            </button>
                            <button onClick={() => navigate(`/profile/${request.username}`)} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>)}
                  </div> : <div className="p-8 text-center">
                    <p className="text-gray-500">
                      You have no pending friend requests.
                    </p>
                  </div>}
              </div>}
            {activeTab === 'suggestions' && <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    People You May Know
                  </h2>
                </div>
                {friendSuggestions.length > 0 ? <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {friendSuggestions.map(suggestion => <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 flex">
                        <img src={suggestion.avatar} alt={suggestion.name} className="h-16 w-16 rounded-full object-cover" />
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium text-gray-900">
                            {suggestion.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            @{suggestion.username}
                          </p>
                          <div className="text-xs text-gray-500 mt-1">
                            {suggestion.location}
                          </div>
                          <div className="text-xs text-gray-500">
                            {suggestion.mutualFriends} mutual friends
                          </div>
                          <div className="mt-2 flex space-x-2">
                            <button onClick={() => handleSendRequest(suggestion.id)} className="px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200">
                              <UserPlusIcon className="h-4 w-4 mr-1 inline-block" />
                              Add Friend
                            </button>
                            <button onClick={() => navigate(`/profile/${suggestion.username}`)} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>)}
                  </div> : <div className="p-8 text-center">
                    <p className="text-gray-500">
                      No friend suggestions at the moment.
                    </p>
                  </div>}
              </div>}
            {activeTab === 'sent' && <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Sent Requests ({sentRequests.length})
                  </h2>
                </div>
                {sentRequests.length > 0 ? <div className="p-4 space-y-4">
                    {sentRequests.map(request => <div key={request.id} className="border border-gray-200 rounded-lg p-4 flex">
                        <img src={request.avatar} alt={request.name} className="h-16 w-16 rounded-full object-cover" />
                        <div className="ml-4 flex-1">
                          <h3 className="font-medium text-gray-900">
                            {request.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            @{request.username}
                          </p>
                          <div className="text-xs text-gray-500 mt-1">
                            {request.location}
                          </div>
                          <div className="text-xs text-gray-500">
                            {request.mutualFriends} mutual friends • Sent{' '}
                            {request.requestDate}
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <button onClick={() => handleCancelRequest(request.id)} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
                              Cancel Request
                            </button>
                            <button onClick={() => navigate(`/profile/${request.username}`)} className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>)}
                  </div> : <div className="p-8 text-center">
                    <p className="text-gray-500">
                      You haven't sent any friend requests.
                    </p>
                  </div>}
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export { FriendsPage };
export default FriendsPage;