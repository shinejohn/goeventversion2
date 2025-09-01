import React, { useState } from 'react';
import { HubData } from '../../pages/hub/create';
import { PlusIcon, XIcon, DollarSignIcon, CreditCardIcon, TagIcon, LinkIcon, InfoIcon, CheckIcon, AlertCircleIcon } from 'lucide-react';
type MonetizationSetupProps = {
  hubData: HubData;
  updateHubData: (section: string, field: string, value: any) => void;
};
export const MonetizationSetup: React.FC<MonetizationSetupProps> = ({
  hubData,
  updateHubData
}) => {
  const [activeTab, setActiveTab] = useState<'tiers' | 'sponsors' | 'affiliate'>('tiers');
  const [newTierName, setNewTierName] = useState('');
  const [newTierPrice, setNewTierPrice] = useState('');
  const [newTierPeriod, setNewTierPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [newTierBenefit, setNewTierBenefit] = useState('');
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  // Add a new membership tier
  const addMembershipTier = () => {
    if (!newTierName.trim() || !newTierPrice.trim()) return;
    const price = parseFloat(newTierPrice);
    if (isNaN(price) || price < 0) return;
    const newTierId = `tier-${Date.now()}`;
    const newTier = {
      id: newTierId,
      name: newTierName,
      price: price,
      billingPeriod: newTierPeriod,
      benefits: []
    };
    updateHubData('monetization', 'membershipTiers', [...hubData.monetization.membershipTiers, newTier]);
    setNewTierName('');
    setNewTierPrice('');
  };
  // Delete a membership tier
  const deleteMembershipTier = (tierId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this membership tier?');
    if (!confirmed) return;
    updateHubData('monetization', 'membershipTiers', hubData.monetization.membershipTiers.filter(tier => tier.id !== tierId));
  };
  // Add a benefit to a tier
  const addBenefitToTier = (tierId: string) => {
    if (!newTierBenefit.trim()) return;
    updateHubData('monetization', 'membershipTiers', hubData.monetization.membershipTiers.map(tier => {
      if (tier.id === tierId) {
        return {
          ...tier,
          benefits: [...tier.benefits, newTierBenefit]
        };
      }
      return tier;
    }));
    setNewTierBenefit('');
  };
  // Remove a benefit from a tier
  const removeBenefitFromTier = (tierId: string, benefitIndex: number) => {
    updateHubData('monetization', 'membershipTiers', hubData.monetization.membershipTiers.map(tier => {
      if (tier.id === tierId) {
        return {
          ...tier,
          benefits: tier.benefits.filter((_, index) => index !== benefitIndex)
        };
      }
      return tier;
    }));
  };
  // Toggle sponsor slot enabled state
  const toggleSponsorEnabled = (sponsorId: string) => {
    updateHubData('monetization', 'sponsorSlots', hubData.monetization.sponsorSlots.map(slot => {
      if (slot.id === sponsorId) {
        return {
          ...slot,
          enabled: !slot.enabled
        };
      }
      return slot;
    }));
  };
  // Update sponsor slot price
  const updateSponsorPrice = (sponsorId: string, price: string) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) return;
    updateHubData('monetization', 'sponsorSlots', hubData.monetization.sponsorSlots.map(slot => {
      if (slot.id === sponsorId) {
        return {
          ...slot,
          price: numPrice
        };
      }
      return slot;
    }));
  };
  // Add a new sponsor slot
  const addSponsorSlot = () => {
    const newSlotId = `sponsor-${Date.now()}`;
    const newSlot = {
      id: newSlotId,
      name: 'New Sponsor Slot',
      price: 99,
      position: 'sidebar',
      enabled: true
    };
    updateHubData('monetization', 'sponsorSlots', [...hubData.monetization.sponsorSlots, newSlot]);
    setEditingSponsorId(newSlotId);
  };
  // Delete a sponsor slot
  const deleteSponsorSlot = (slotId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this sponsor slot?');
    if (!confirmed) return;
    updateHubData('monetization', 'sponsorSlots', hubData.monetization.sponsorSlots.filter(slot => slot.id !== slotId));
  };
  // Update sponsor slot name
  const updateSponsorName = (slotId: string, name: string) => {
    updateHubData('monetization', 'sponsorSlots', hubData.monetization.sponsorSlots.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          name
        };
      }
      return slot;
    }));
  };
  // Update sponsor slot position
  const updateSponsorPosition = (slotId: string, position: string) => {
    updateHubData('monetization', 'sponsorSlots', hubData.monetization.sponsorSlots.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          position
        };
      }
      return slot;
    }));
  };
  // Toggle affiliate program
  const toggleAffiliateProgram = () => {
    updateHubData('monetization', 'affiliateEnabled', !hubData.monetization.affiliateEnabled);
  };
  // Update affiliate commission
  const updateAffiliateCommission = (commission: string) => {
    const numCommission = parseFloat(commission);
    if (isNaN(numCommission) || numCommission < 0 || numCommission > 100) return;
    updateHubData('monetization', 'affiliateCommission', numCommission);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button onClick={() => setActiveTab('tiers')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'tiers' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Membership Tiers
        </button>
        <button onClick={() => setActiveTab('sponsors')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'sponsors' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Sponsor Slots
        </button>
        <button onClick={() => setActiveTab('affiliate')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'affiliate' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Affiliate Program
        </button>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {/* Membership Tiers */}
        {activeTab === 'tiers' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Membership Pricing Tiers
              </h3>
              <div className="flex items-center">
                <CreditCardIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Create paid membership levels with benefits
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Set up different membership tiers with unique benefits to monetize
              your hub. Members can subscribe to access exclusive content and
              features.
            </p>
            {/* Add New Tier */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Add New Membership Tier
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label htmlFor="tier-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Tier Name
                  </label>
                  <input id="tier-name" type="text" value={newTierName} onChange={e => setNewTierName(e.target.value)} placeholder="e.g., Premium Member" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label htmlFor="tier-price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      $
                    </span>
                    <input id="tier-price" type="text" value={newTierPrice} onChange={e => setNewTierPrice(e.target.value)} placeholder="9.99" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" />
                    <select value={newTierPeriod} onChange={e => setNewTierPeriod(e.target.value as 'monthly' | 'yearly')} className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      <option value="monthly">/month</option>
                      <option value="yearly">/year</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={addMembershipTier} disabled={!newTierName.trim() || !newTierPrice.trim()} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  Add Tier
                </button>
              </div>
            </div>
            {/* Membership Tiers List */}
            {hubData.monetization.membershipTiers.length === 0 ? <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                <DollarSignIcon className="h-8 w-8 mx-auto mb-2" />
                <p className="mb-2">No membership tiers defined yet</p>
                <p className="text-sm">
                  Add tiers to offer premium content and features
                </p>
              </div> : <div className="space-y-6">
                {hubData.monetization.membershipTiers.map(tier => <div key={tier.id} className="border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="mr-2">
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-800">
                            <CreditCardIcon className="h-4 w-4" />
                          </span>
                        </div>
                        <div>
                          <h4 className="text-md font-medium text-gray-900">
                            {tier.name}
                          </h4>
                          <div className="text-sm text-gray-500">
                            ${tier.price}
                            {tier.billingPeriod === 'monthly' ? '/month' : '/year'}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => deleteMembershipTier(tier.id)} className="p-1 rounded-md text-red-500 hover:bg-red-50" title="Delete tier">
                        <XIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">
                        Benefits
                      </h5>
                      {tier.benefits.length === 0 ? <p className="text-sm text-gray-500 italic mb-3">
                          No benefits added yet
                        </p> : <ul className="space-y-2 mb-4">
                          {tier.benefits.map((benefit, index) => <li key={index} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-sm text-gray-700">
                                  {benefit}
                                </span>
                              </div>
                              <button onClick={() => removeBenefitFromTier(tier.id, index)} className="text-gray-400 hover:text-red-500">
                                <XIcon className="h-4 w-4" />
                              </button>
                            </li>)}
                        </ul>}
                      {/* Add Benefit */}
                      <div className="mt-2 flex">
                        <input type="text" value={editingTierId === tier.id ? newTierBenefit : ''} onChange={e => setNewTierBenefit(e.target.value)} onFocus={() => setEditingTierId(tier.id)} placeholder="Add a benefit..." className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" />
                        <button onClick={() => addBenefitToTier(tier.id)} disabled={!newTierBenefit.trim() || editingTierId !== tier.id} className="inline-flex items-center px-3 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>)}
              </div>}
          </div>}
        {/* Sponsor Slots */}
        {activeTab === 'sponsors' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Sponsor Slots
              </h3>
              <button onClick={addSponsorSlot} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Add Slot
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Create sponsor slots to monetize your hub through advertising.
              Each slot can be positioned in different areas of your hub and
              priced accordingly.
            </p>
            {/* Sponsor Slots List */}
            {hubData.monetization.sponsorSlots.length === 0 ? <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                <TagIcon className="h-8 w-8 mx-auto mb-2" />
                <p className="mb-2">No sponsor slots defined yet</p>
                <p className="text-sm">
                  Add slots to offer advertising opportunities
                </p>
              </div> : <div className="space-y-4">
                {hubData.monetization.sponsorSlots.map(slot => <div key={slot.id} className="border rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        {editingSponsorId === slot.id ? <input type="text" value={slot.name} onChange={e => updateSponsorName(slot.id, e.target.value)} onBlur={() => setEditingSponsorId(null)} className="flex-1 min-w-0 block px-3 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 mr-2" autoFocus /> : <h4 className="text-md font-medium text-gray-900 cursor-pointer" onClick={() => setEditingSponsorId(slot.id)}>
                            {slot.name}
                          </h4>}
                        <div className="flex items-center space-x-2">
                          <button onClick={() => toggleSponsorEnabled(slot.id)} className={`px-2.5 py-1.5 text-xs font-medium rounded ${slot.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {slot.enabled ? 'Enabled' : 'Disabled'}
                          </button>
                          <button onClick={() => deleteSponsorSlot(slot.id)} className="p-1 rounded-md text-red-500 hover:bg-red-50" title="Delete slot">
                            <XIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`${slot.id}-price`} className="block text-sm font-medium text-gray-700 mb-1">
                            Price
                          </label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                              $
                            </span>
                            <input id={`${slot.id}-price`} type="text" value={slot.price} onChange={e => updateSponsorPrice(slot.id, e.target.value)} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Price per month
                          </p>
                        </div>
                        <div>
                          <label htmlFor={`${slot.id}-position`} className="block text-sm font-medium text-gray-700 mb-1">
                            Position
                          </label>
                          <select id={`${slot.id}-position`} value={slot.position} onChange={e => updateSponsorPosition(slot.id, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="sidebar">Sidebar</option>
                            <option value="top">Top Banner</option>
                            <option value="bottom">Bottom Banner</option>
                            <option value="in-content">In-Content</option>
                            <option value="featured">Featured Section</option>
                          </select>
                          <p className="mt-1 text-xs text-gray-500">
                            Where the sponsor will appear
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <InfoIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-900">
                              Slot Preview
                            </h4>
                            <p className="mt-1 text-xs text-gray-500">
                              {slot.position === 'sidebar' && 'Appears in the sidebar of your hub pages'}
                              {slot.position === 'top' && 'Appears at the top of your hub pages'}
                              {slot.position === 'bottom' && 'Appears at the bottom of your hub pages'}
                              {slot.position === 'in-content' && 'Appears between content sections'}
                              {slot.position === 'featured' && 'Appears in a highlighted featured section'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>)}
              </div>}
          </div>}
        {/* Affiliate Program */}
        {activeTab === 'affiliate' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Affiliate Program
              </h3>
              <div className="flex items-center">
                <LinkIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Set up referral rewards for your members
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Enable an affiliate program to reward members who bring new
              subscribers to your hub. They'll earn a commission on membership
              fees paid by people they refer.
            </p>
            <div className="mb-6 p-5 border rounded-lg">
              <div className="flex items-start mb-4">
                <div className="flex items-center h-5">
                  <input id="affiliate-enabled" type="checkbox" checked={hubData.monetization.affiliateEnabled} onChange={toggleAffiliateProgram} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="affiliate-enabled" className="font-medium text-gray-700">
                    Enable Affiliate Program
                  </label>
                  <p className="text-gray-500">
                    Allow members to earn commissions by referring new paid
                    subscribers
                  </p>
                </div>
              </div>
              {hubData.monetization.affiliateEnabled && <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="max-w-xs">
                    <label htmlFor="affiliate-commission" className="block text-sm font-medium text-gray-700 mb-1">
                      Commission Rate (%)
                    </label>
                    <div className="flex">
                      <input id="affiliate-commission" type="text" value={hubData.monetization.affiliateCommission} onChange={e => updateAffiliateCommission(e.target.value)} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" />
                      <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        %
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Percentage of membership fees paid to the referrer
                    </p>
                  </div>
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-1">
                        First-Month Earnings
                      </h4>
                      <p className="text-sm text-gray-600">
                        $
                        {(hubData.monetization.membershipTiers[0]?.price || 0) * (hubData.monetization.affiliateCommission / 100) || 0}{' '}
                        per referral
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-1">
                        Payout Threshold
                      </h4>
                      <p className="text-sm text-gray-600">$25.00</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-1">
                        Payout Schedule
                      </h4>
                      <p className="text-sm text-gray-600">Monthly</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <InfoIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          About Affiliate Programs
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            Affiliate programs can help grow your membership by
                            incentivizing word-of-mouth marketing. Members will
                            receive a unique referral link to share with others.
                          </p>
                          <p className="mt-2">
                            You'll need to set up payment methods to pay out
                            commissions to your affiliates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>}
            </div>
            {!hubData.monetization.membershipTiers.length && hubData.monetization.affiliateEnabled && <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-800">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircleIcon className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium">
                        No Membership Tiers
                      </h3>
                      <div className="mt-2 text-sm">
                        <p>
                          You've enabled the affiliate program but haven't
                          created any membership tiers. Add at least one paid
                          membership tier for the affiliate program to work.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>}
          </div>}
      </div>
    </div>;
};