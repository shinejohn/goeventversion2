import React, { useState } from 'react';
import { HubData } from '../../pages/hub/create';
import { PlusIcon, XIcon, CheckIcon, ShieldIcon, UserIcon, UsersIcon, FileTextIcon, AlertCircleIcon } from 'lucide-react';
type PermissionsRolesProps = {
  hubData: HubData;
  updateHubData: (section: string, field: string, value: any) => void;
};
// Available permissions
const AVAILABLE_PERMISSIONS = [{
  id: 'view',
  name: 'View Content',
  description: 'Access to view hub content'
}, {
  id: 'comment',
  name: 'Comment',
  description: 'Ability to comment on posts and discussions'
}, {
  id: 'post',
  name: 'Create Posts',
  description: 'Create new posts and discussions'
}, {
  id: 'create-events',
  name: 'Create Events',
  description: 'Create and manage events'
}, {
  id: 'upload-media',
  name: 'Upload Media',
  description: 'Upload photos and videos'
}, {
  id: 'invite-members',
  name: 'Invite Members',
  description: 'Invite new members to the hub'
}, {
  id: 'edit-others',
  name: "Edit Others' Content",
  description: 'Edit content created by other members'
}, {
  id: 'delete-others',
  name: "Delete Others' Content",
  description: 'Delete content created by other members'
}, {
  id: 'pin-content',
  name: 'Pin Content',
  description: 'Pin important content to the top'
}, {
  id: 'manage-members',
  name: 'Manage Members',
  description: 'Add or remove members'
}];
// Mock users for moderator selection
const MOCK_USERS = [{
  id: 'user1',
  name: 'Alex Johnson',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
}, {
  id: 'user2',
  name: 'Emma Wilson',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
}, {
  id: 'user3',
  name: 'Michael Brown',
  avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
}, {
  id: 'user4',
  name: 'Sophia Garcia',
  avatar: 'https://randomuser.me/api/portraits/women/29.jpg'
}, {
  id: 'user5',
  name: 'James Miller',
  avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
}, {
  id: 'user6',
  name: 'Olivia Davis',
  avatar: 'https://randomuser.me/api/portraits/women/17.jpg'
}, {
  id: 'user7',
  name: 'William Rodriguez',
  avatar: 'https://randomuser.me/api/portraits/men/55.jpg'
}, {
  id: 'user8',
  name: 'Ava Martinez',
  avatar: 'https://randomuser.me/api/portraits/women/63.jpg'
}];
export const PermissionsRoles: React.FC<PermissionsRolesProps> = ({
  hubData,
  updateHubData
}) => {
  const [activeTab, setActiveTab] = useState<'tiers' | 'moderators' | 'workflow' | 'guidelines'>('tiers');
  const [newTierName, setNewTierName] = useState('');
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [editingTierName, setEditingTierName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModerator, setShowAddModerator] = useState(false);
  // Add a new member tier
  const addMemberTier = () => {
    if (!newTierName.trim()) return;
    const newTierId = `tier-${Date.now()}`;
    const newTier = {
      id: newTierId,
      name: newTierName,
      permissions: ['view'] // Default permission
    };
    updateHubData('permissions', 'memberTiers', [...hubData.permissions.memberTiers, newTier]);
    setNewTierName('');
  };
  // Delete a member tier
  const deleteMemberTier = (tierId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this member tier?');
    if (!confirmed) return;
    updateHubData('permissions', 'memberTiers', hubData.permissions.memberTiers.filter(tier => tier.id !== tierId));
  };
  // Update tier name
  const updateTierName = (tierId: string) => {
    if (!editingTierName.trim()) return;
    updateHubData('permissions', 'memberTiers', hubData.permissions.memberTiers.map(tier => tier.id === tierId ? {
      ...tier,
      name: editingTierName
    } : tier));
    setEditingTierId(null);
    setEditingTierName('');
  };
  // Toggle a permission for a tier
  const togglePermission = (tierId: string, permissionId: string) => {
    updateHubData('permissions', 'memberTiers', hubData.permissions.memberTiers.map(tier => {
      if (tier.id === tierId) {
        const hasPermission = tier.permissions.includes(permissionId);
        return {
          ...tier,
          permissions: hasPermission ? tier.permissions.filter(id => id !== permissionId) : [...tier.permissions, permissionId]
        };
      }
      return tier;
    }));
  };
  // Add a moderator
  const addModerator = (userId: string) => {
    if (hubData.permissions.moderators.includes(userId)) return;
    updateHubData('permissions', 'moderators', [...hubData.permissions.moderators, userId]);
    setShowAddModerator(false);
    setSearchTerm('');
  };
  // Remove a moderator
  const removeModerator = (userId: string) => {
    updateHubData('permissions', 'moderators', hubData.permissions.moderators.filter(id => id !== userId));
  };
  // Update approval workflow
  const updateApprovalWorkflow = (workflow: 'none' | 'moderator' | 'admin') => {
    updateHubData('permissions', 'approvalWorkflow', workflow);
  };
  // Update contribution guidelines
  const updateContributionGuidelines = (guidelines: string) => {
    updateHubData('permissions', 'contributionGuidelines', guidelines);
  };
  // Filter users based on search term
  const filteredUsers = MOCK_USERS.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button onClick={() => setActiveTab('tiers')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'tiers' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Member Tiers
        </button>
        <button onClick={() => setActiveTab('moderators')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'moderators' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Moderators
        </button>
        <button onClick={() => setActiveTab('workflow')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'workflow' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Approval Workflow
        </button>
        <button onClick={() => setActiveTab('guidelines')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'guidelines' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Guidelines
        </button>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {/* Member Tiers */}
        {activeTab === 'tiers' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Member Tiers & Permissions
              </h3>
              <div className="flex items-center">
                <UsersIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Define access levels for different types of members
                </span>
              </div>
            </div>
            {/* Add New Tier */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Add New Member Tier
              </h4>
              <div className="flex">
                <input type="text" value={newTierName} onChange={e => setNewTierName(e.target.value)} placeholder="Tier name (e.g., Premium Member)" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" />
                <button onClick={addMemberTier} disabled={!newTierName.trim()} className="inline-flex items-center px-3 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  Add Tier
                </button>
              </div>
            </div>
            {/* Member Tiers List */}
            {hubData.permissions.memberTiers.length === 0 ? <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                <UsersIcon className="h-8 w-8 mx-auto mb-2" />
                <p className="mb-2">No member tiers defined yet</p>
                <p className="text-sm">
                  Add tiers to control access to different features
                </p>
              </div> : <div className="space-y-6">
                {hubData.permissions.memberTiers.map(tier => <div key={tier.id} className="border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                      {editingTierId === tier.id ? <div className="flex-1 mr-2">
                          <input type="text" value={editingTierName} onChange={e => setEditingTierName(e.target.value)} onBlur={() => updateTierName(tier.id)} onKeyDown={e => e.key === 'Enter' && updateTierName(tier.id)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" autoFocus />
                        </div> : <h4 className="text-md font-medium text-gray-900 cursor-pointer" onClick={() => {
                setEditingTierId(tier.id);
                setEditingTierName(tier.name);
              }}>
                          {tier.name}
                        </h4>}
                      <button onClick={() => deleteMemberTier(tier.id)} className="p-1 rounded-md text-red-500 hover:bg-red-50" title="Delete tier">
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">
                        Permissions
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {AVAILABLE_PERMISSIONS.map(permission => <div key={permission.id} className="flex items-start">
                            <div className="flex items-center h-5">
                              <input id={`${tier.id}-${permission.id}`} type="checkbox" checked={tier.permissions.includes(permission.id)} onChange={() => togglePermission(tier.id, permission.id)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor={`${tier.id}-${permission.id}`} className="font-medium text-gray-700">
                                {permission.name}
                              </label>
                              <p className="text-gray-500">
                                {permission.description}
                              </p>
                            </div>
                          </div>)}
                      </div>
                    </div>
                  </div>)}
              </div>}
          </div>}
        {/* Moderators */}
        {activeTab === 'moderators' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Moderator Assignments
              </h3>
              <button onClick={() => setShowAddModerator(!showAddModerator)} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Add Moderator
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Moderators help maintain community standards and can manage
              content and members based on the permissions you set.
            </p>
            {/* Add Moderator Panel */}
            {showAddModerator && <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Add Moderator
                  </h4>
                  <button onClick={() => setShowAddModerator(false)} className="text-gray-400 hover:text-gray-500">
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="mb-4">
                  <div className="relative">
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search for users..." className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <ul className="divide-y divide-gray-200">
                    {filteredUsers.length === 0 ? <li className="py-3 px-2 text-center text-gray-500">
                        No users found matching your search
                      </li> : filteredUsers.map(user => <li key={user.id} className={`py-3 px-2 flex items-center justify-between hover:bg-gray-100 cursor-pointer rounded-md ${hubData.permissions.moderators.includes(user.id) ? 'bg-indigo-50' : ''}`} onClick={() => addModerator(user.id)}>
                          <div className="flex items-center">
                            <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full mr-3" />
                            <span className="text-sm font-medium text-gray-900">
                              {user.name}
                            </span>
                          </div>
                          {hubData.permissions.moderators.includes(user.id) && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckIcon className="h-3 w-3 mr-1" />
                              Added
                            </span>}
                        </li>)}
                  </ul>
                </div>
              </div>}
            {/* Moderators List */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <h4 className="font-medium text-gray-700">
                  Current Moderators
                </h4>
              </div>
              <div className="divide-y divide-gray-200">
                {hubData.permissions.moderators.length === 0 ? <div className="p-6 text-center text-gray-500">
                    <ShieldIcon className="h-8 w-8 mx-auto mb-2" />
                    <p>No moderators assigned yet</p>
                    <p className="text-sm mt-1">
                      Moderators help maintain community standards
                    </p>
                  </div> : hubData.permissions.moderators.map(moderatorId => {
              const user = MOCK_USERS.find(u => u.id === moderatorId);
              if (!user) return null;
              return <div key={moderatorId} className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full mr-3" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Moderator
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeModerator(moderatorId)} className="p-1 rounded-md text-red-500 hover:bg-red-50" title="Remove moderator">
                          <XIcon className="h-5 w-5" />
                        </button>
                      </div>;
            })}
              </div>
            </div>
          </div>}
        {/* Approval Workflow */}
        {activeTab === 'workflow' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Content Approval Workflow
              </h3>
              <div className="flex items-center">
                <CheckIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Control how content is reviewed before publishing
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Choose how content is reviewed and approved before it's published
              to your hub.
            </p>
            <div className="space-y-4">
              <div className={`border rounded-lg p-4 cursor-pointer ${hubData.permissions.approvalWorkflow === 'none' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => updateApprovalWorkflow('none')}>
                <div className="flex items-center">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${hubData.permissions.approvalWorkflow === 'none' ? 'border-indigo-600' : 'border-gray-300'}`}>
                    {hubData.permissions.approvalWorkflow === 'none' && <div className="h-3 w-3 rounded-full bg-indigo-600" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      No Approval Required
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      All content is published immediately without review.
                    </p>
                  </div>
                </div>
              </div>
              <div className={`border rounded-lg p-4 cursor-pointer ${hubData.permissions.approvalWorkflow === 'moderator' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => updateApprovalWorkflow('moderator')}>
                <div className="flex items-center">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${hubData.permissions.approvalWorkflow === 'moderator' ? 'border-indigo-600' : 'border-gray-300'}`}>
                    {hubData.permissions.approvalWorkflow === 'moderator' && <div className="h-3 w-3 rounded-full bg-indigo-600" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Moderator Approval
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Content must be approved by a moderator before publishing.
                    </p>
                  </div>
                </div>
              </div>
              <div className={`border rounded-lg p-4 cursor-pointer ${hubData.permissions.approvalWorkflow === 'admin' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => updateApprovalWorkflow('admin')}>
                <div className="flex items-center">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${hubData.permissions.approvalWorkflow === 'admin' ? 'border-indigo-600' : 'border-gray-300'}`}>
                    {hubData.permissions.approvalWorkflow === 'admin' && <div className="h-3 w-3 rounded-full bg-indigo-600" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Admin Approval Only
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Only hub administrators can approve and publish content.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-800">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircleIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Important Note</h3>
                  <div className="mt-2 text-sm">
                    <p>
                      Stricter approval workflows can help maintain quality but
                      may slow down content publishing. Consider your
                      community's needs when choosing an approval process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>}
        {/* Contribution Guidelines */}
        {activeTab === 'guidelines' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Contribution Guidelines
              </h3>
              <div className="flex items-center">
                <FileTextIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Set clear expectations for community content
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Establish clear guidelines for the type of content and behavior
              that's acceptable in your hub. These guidelines will be visible to
              all members.
            </p>
            <div className="mb-6">
              <label htmlFor="contribution-guidelines" className="block text-sm font-medium text-gray-700 mb-1">
                Community Guidelines
              </label>
              <textarea id="contribution-guidelines" rows={12} value={hubData.permissions.contributionGuidelines} onChange={e => updateContributionGuidelines(e.target.value)} placeholder="Write your community guidelines here..." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Suggested Topics to Cover:
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Acceptable content types and formats</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Community standards and code of conduct</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Content quality expectations</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Self-promotion and advertising policies</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Copyright and intellectual property guidelines</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Consequences for violating guidelines</span>
                </li>
              </ul>
            </div>
          </div>}
      </div>
    </div>;
};