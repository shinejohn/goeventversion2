import React, { useState } from 'react';
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, SaveIcon, EditIcon } from 'lucide-react';
type AutomationRulesStepProps = {
  formData: any;
  updateFormData: (data: any) => void;
};
export const AutomationRulesStep = ({
  formData,
  updateFormData
}: AutomationRulesStepProps) => {
  const [rules, setRules] = useState<any[]>(formData.automationRules || []);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);
  const [currentRule, setCurrentRule] = useState({
    id: '',
    name: '',
    conditions: {
      categories: [],
      locations: [],
      keywords: [],
      venues: {
        include: [],
        exclude: []
      },
      timePreferences: {
        days: [],
        timeRange: {
          start: '',
          end: ''
        }
      },
      priceRange: {
        min: 0,
        max: 100
      }
    },
    autoApprove: true
  });
  const [expandedRuleIndex, setExpandedRuleIndex] = useState<number | null>(null);
  const handleAddRule = () => {
    setIsAddingRule(true);
    setCurrentRule({
      id: `rule-${Date.now()}`,
      name: '',
      conditions: {
        categories: [],
        locations: [],
        keywords: [],
        venues: {
          include: [],
          exclude: []
        },
        timePreferences: {
          days: [],
          timeRange: {
            start: '',
            end: ''
          }
        },
        priceRange: {
          min: 0,
          max: 100
        }
      },
      autoApprove: true
    });
  };
  const handleEditRule = (index: number) => {
    setEditingRuleIndex(index);
    setCurrentRule(rules[index]);
    setIsAddingRule(true);
  };
  const handleDeleteRule = (index: number) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
    updateFormData(newRules);
  };
  const handleSaveRule = () => {
    if (editingRuleIndex !== null) {
      const newRules = [...rules];
      newRules[editingRuleIndex] = currentRule;
      setRules(newRules);
      updateFormData(newRules);
    } else {
      setRules([...rules, currentRule]);
      updateFormData([...rules, currentRule]);
    }
    setIsAddingRule(false);
    setEditingRuleIndex(null);
  };
  const handleCancelRule = () => {
    setIsAddingRule(false);
    setEditingRuleIndex(null);
  };
  const toggleRuleExpansion = (index: number) => {
    setExpandedRuleIndex(expandedRuleIndex === index ? null : index);
  };
  // Helper function to update the current rule
  const updateCurrentRule = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCurrentRule({
        ...currentRule,
        conditions: {
          ...currentRule.conditions,
          [parent]: {
            ...currentRule.conditions[parent],
            [child]: value
          }
        }
      });
    } else if (field === 'autoApprove') {
      setCurrentRule({
        ...currentRule,
        autoApprove: value
      });
    } else if (field === 'name') {
      setCurrentRule({
        ...currentRule,
        name: value
      });
    } else {
      setCurrentRule({
        ...currentRule,
        conditions: {
          ...currentRule.conditions,
          [field]: value
        }
      });
    }
  };
  // Helper function to handle array inputs
  const handleArrayInput = (field: string, value: string, type: 'add' | 'remove') => {
    let currentArray = [];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      currentArray = [...currentRule.conditions[parent][child]];
    } else {
      currentArray = [...currentRule.conditions[field]];
    }
    if (type === 'add' && !currentArray.includes(value)) {
      currentArray.push(value);
    } else if (type === 'remove') {
      currentArray = currentArray.filter(item => item !== value);
    }
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updateCurrentRule(`${parent}.${child}`, currentArray);
    } else {
      updateCurrentRule(field, currentArray);
    }
  };
  return <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Automation Rules
        </h2>
        <p className="text-sm text-gray-500">
          Set up rules to automatically include events in your calendar based on
          specific criteria.
        </p>
      </div>
      {!isAddingRule ? <div>
          {rules.length === 0 ? <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Automation Rules Yet
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                Create rules to automatically add events to your calendar based
                on categories, locations, keywords, and more.
              </p>
              <button type="button" onClick={handleAddRule} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Create First Rule
              </button>
            </div> : <div>
              <div className="space-y-4 mb-6">
                {rules.map((rule, index) => <div key={rule.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer" onClick={() => toggleRuleExpansion(index)}>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {rule.name}
                        </span>
                        <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {rule.autoApprove ? 'Auto-approve' : 'Manual review'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <button type="button" onClick={e => {
                  e.stopPropagation();
                  handleEditRule(index);
                }} className="mr-2 text-gray-400 hover:text-gray-500">
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={e => {
                  e.stopPropagation();
                  handleDeleteRule(index);
                }} className="mr-2 text-gray-400 hover:text-red-500">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                        {expandedRuleIndex === index ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
                      </div>
                    </div>
                    {expandedRuleIndex === index && <div className="px-4 py-3 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {rule.conditions.categories.length > 0 && <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">
                                Categories
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {rule.conditions.categories.map(cat => <span key={cat} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    {cat}
                                  </span>)}
                              </div>
                            </div>}
                          {rule.conditions.locations.length > 0 && <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">
                                Locations
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {rule.conditions.locations.map(loc => <span key={loc} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    {loc}
                                  </span>)}
                              </div>
                            </div>}
                          {rule.conditions.keywords.length > 0 && <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">
                                Keywords
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {rule.conditions.keywords.map(keyword => <span key={keyword} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                    {keyword}
                                  </span>)}
                              </div>
                            </div>}
                          {(rule.conditions.venues.include.length > 0 || rule.conditions.venues.exclude.length > 0) && <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">
                                Venues
                              </h4>
                              {rule.conditions.venues.include.length > 0 && <div className="mb-1">
                                  <span className="text-xs text-gray-500">
                                    Include:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {rule.conditions.venues.include.map(venue => <span key={venue} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                          {venue}
                                        </span>)}
                                  </div>
                                </div>}
                              {rule.conditions.venues.exclude.length > 0 && <div>
                                  <span className="text-xs text-gray-500">
                                    Exclude:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {rule.conditions.venues.exclude.map(venue => <span key={venue} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                          {venue}
                                        </span>)}
                                  </div>
                                </div>}
                            </div>}
                          {rule.conditions.timePreferences.days.length > 0 && <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">
                                Days & Times
                              </h4>
                              <div className="text-sm text-gray-600">
                                <div>
                                  Days:{' '}
                                  {rule.conditions.timePreferences.days.map(day => {
                        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        return dayNames[day];
                      }).join(', ')}
                                </div>
                                {rule.conditions.timePreferences.timeRange.start && <div>
                                    Time:{' '}
                                    {rule.conditions.timePreferences.timeRange.start}{' '}
                                    -{' '}
                                    {rule.conditions.timePreferences.timeRange.end}
                                  </div>}
                              </div>
                            </div>}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">
                              Price Range
                            </h4>
                            <div className="text-sm text-gray-600">
                              ${rule.conditions.priceRange.min} - $
                              {rule.conditions.priceRange.max === 1000 ? '∞' : rule.conditions.priceRange.max}
                            </div>
                          </div>
                        </div>
                      </div>}
                  </div>)}
              </div>
              <button type="button" onClick={handleAddRule} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Add Another Rule
              </button>
            </div>}
        </div> : <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingRuleIndex !== null ? 'Edit Automation Rule' : 'Create Automation Rule'}
          </h3>
          <div className="space-y-6">
            {/* Rule Name */}
            <div>
              <label htmlFor="rule-name" className="block text-sm font-medium text-gray-700 mb-1">
                Rule Name*
              </label>
              <input type="text" id="rule-name" value={currentRule.name} onChange={e => updateCurrentRule('name', e.target.value)} placeholder="e.g., Jazz Events Downtown" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Categories */}
              <div>
                <label htmlFor="categories" className="block text-sm font-medium text-gray-700 mb-1">
                  Categories
                </label>
                <div className="relative">
                  <select id="categories" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" onChange={e => {
                if (e.target.value) {
                  handleArrayInput('categories', e.target.value, 'add');
                  e.target.value = '';
                }
              }}>
                    <option value="">Select categories to include</option>
                    <option value="music">Music</option>
                    <option value="jazz">Jazz</option>
                    <option value="blues">Blues</option>
                    <option value="rock">Rock</option>
                    <option value="pop">Pop</option>
                    <option value="classical">Classical</option>
                    <option value="food">Food & Drink</option>
                    <option value="arts">Arts & Culture</option>
                    <option value="sports">Sports</option>
                    <option value="family">Family</option>
                    <option value="nightlife">Nightlife</option>
                  </select>
                </div>
                {currentRule.conditions.categories.length > 0 && <div className="mt-2 flex flex-wrap gap-2">
                    {currentRule.conditions.categories.map(category => <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category}
                        <button type="button" onClick={() => handleArrayInput('categories', category, 'remove')} className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none">
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>)}
                  </div>}
              </div>
              {/* Locations */}
              <div>
                <label htmlFor="locations" className="block text-sm font-medium text-gray-700 mb-1">
                  Locations
                </label>
                <div className="flex items-center">
                  <input type="text" id="locations" placeholder="e.g., downtown, beachfront" className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" onKeyDown={e => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  e.preventDefault();
                  handleArrayInput('locations', e.currentTarget.value.trim(), 'add');
                  e.currentTarget.value = '';
                }
              }} />
                  <button type="button" onClick={e => {
                const input = typeof document !== "undefined" && document.getElementById('locations') as HTMLInputElement;
                if (input.value.trim()) {
                  handleArrayInput('locations', input.value.trim(), 'add');
                  input.value = '';
                }
              }} className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                {currentRule.conditions.locations.length > 0 && <div className="mt-2 flex flex-wrap gap-2">
                    {currentRule.conditions.locations.map(location => <span key={location} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {location}
                        <button type="button" onClick={() => handleArrayInput('locations', location, 'remove')} className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none">
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>)}
                  </div>}
              </div>
              {/* Keywords */}
              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords
                </label>
                <div className="flex items-center">
                  <input type="text" id="keywords" placeholder="e.g., live music, performance" className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" onKeyDown={e => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  e.preventDefault();
                  handleArrayInput('keywords', e.currentTarget.value.trim(), 'add');
                  e.currentTarget.value = '';
                }
              }} />
                  <button type="button" onClick={e => {
                const input = typeof document !== "undefined" && document.getElementById('keywords') as HTMLInputElement;
                if (input.value.trim()) {
                  handleArrayInput('keywords', input.value.trim(), 'add');
                  input.value = '';
                }
              }} className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                {currentRule.conditions.keywords.length > 0 && <div className="mt-2 flex flex-wrap gap-2">
                    {currentRule.conditions.keywords.map(keyword => <span key={keyword} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {keyword}
                        <button type="button" onClick={() => handleArrayInput('keywords', keyword, 'remove')} className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:outline-none">
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>)}
                  </div>}
              </div>
              {/* Venues */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Venues
                </label>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="venues-include" className="block text-xs text-gray-500 mb-1">
                      Include these venues:
                    </label>
                    <div className="flex items-center">
                      <input type="text" id="venues-include" placeholder="e.g., Blue Note, Jazz Corner" className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" onKeyDown={e => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      e.preventDefault();
                      handleArrayInput('venues.include', e.currentTarget.value.trim(), 'add');
                      e.currentTarget.value = '';
                    }
                  }} />
                      <button type="button" onClick={e => {
                    const input = typeof document !== "undefined" && document.getElementById('venues-include') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleArrayInput('venues.include', input.value.trim(), 'add');
                      input.value = '';
                    }
                  }} className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    {currentRule.conditions.venues.include.length > 0 && <div className="mt-2 flex flex-wrap gap-2">
                        {currentRule.conditions.venues.include.map(venue => <span key={venue} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {venue}
                            <button type="button" onClick={() => handleArrayInput('venues.include', venue, 'remove')} className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-yellow-400 hover:bg-yellow-200 hover:text-yellow-500 focus:outline-none">
                              <XIcon className="h-3 w-3" />
                            </button>
                          </span>)}
                      </div>}
                  </div>
                  <div>
                    <label htmlFor="venues-exclude" className="block text-xs text-gray-500 mb-1">
                      Exclude these venues:
                    </label>
                    <div className="flex items-center">
                      <input type="text" id="venues-exclude" placeholder="e.g., venues to exclude" className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" onKeyDown={e => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      e.preventDefault();
                      handleArrayInput('venues.exclude', e.currentTarget.value.trim(), 'add');
                      e.currentTarget.value = '';
                    }
                  }} />
                      <button type="button" onClick={e => {
                    const input = typeof document !== "undefined" && document.getElementById('venues-exclude') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleArrayInput('venues.exclude', input.value.trim(), 'add');
                      input.value = '';
                    }
                  }} className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    {currentRule.conditions.venues.exclude.length > 0 && <div className="mt-2 flex flex-wrap gap-2">
                        {currentRule.conditions.venues.exclude.map(venue => <span key={venue} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {venue}
                            <button type="button" onClick={() => handleArrayInput('venues.exclude', venue, 'remove')} className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-red-400 hover:bg-red-200 hover:text-red-500 focus:outline-none">
                              <XIcon className="h-3 w-3" />
                            </button>
                          </span>)}
                      </div>}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Time Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time & Day Preferences
                </label>
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">
                    Days of the week:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => <button key={day} type="button" onClick={() => {
                  const days = [...currentRule.conditions.timePreferences.days];
                  const dayIndex = days.indexOf(index);
                  if (dayIndex === -1) {
                    days.push(index);
                  } else {
                    days.splice(dayIndex, 1);
                  }
                  updateCurrentRule('timePreferences.days', days);
                }} className={`px-3 py-1 rounded-md text-sm ${currentRule.conditions.timePreferences.days.includes(index) ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                          {day}
                        </button>)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="time-start" className="block text-xs text-gray-500 mb-1">
                      Start time:
                    </label>
                    <input type="time" id="time-start" value={currentRule.conditions.timePreferences.timeRange.start} onChange={e => {
                  updateCurrentRule('timePreferences.timeRange', {
                    ...currentRule.conditions.timePreferences.timeRange,
                    start: e.target.value
                  });
                }} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  </div>
                  <div>
                    <label htmlFor="time-end" className="block text-xs text-gray-500 mb-1">
                      End time:
                    </label>
                    <input type="time" id="time-end" value={currentRule.conditions.timePreferences.timeRange.end} onChange={e => {
                  updateCurrentRule('timePreferences.timeRange', {
                    ...currentRule.conditions.timePreferences.timeRange,
                    end: e.target.value
                  });
                }} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  </div>
                </div>
              </div>
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="price-min" className="block text-xs text-gray-500 mb-1">
                      Minimum Price ($):
                    </label>
                    <input type="number" id="price-min" value={currentRule.conditions.priceRange.min} onChange={e => {
                  updateCurrentRule('priceRange', {
                    ...currentRule.conditions.priceRange,
                    min: parseInt(e.target.value) || 0
                  });
                }} min="0" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  </div>
                  <div>
                    <label htmlFor="price-max" className="block text-xs text-gray-500 mb-1">
                      Maximum Price ($):
                    </label>
                    <input type="number" id="price-max" value={currentRule.conditions.priceRange.max} onChange={e => {
                  updateCurrentRule('priceRange', {
                    ...currentRule.conditions.priceRange,
                    max: parseInt(e.target.value) || 0
                  });
                }} min="0" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="flex items-center">
                    <input type="checkbox" checked={currentRule.conditions.priceRange.includeFree} onChange={e => {
                  updateCurrentRule('priceRange', {
                    ...currentRule.conditions.priceRange,
                    includeFree: e.target.checked
                  });
                }} className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    <span className="ml-2 text-sm text-gray-700">
                      Include free events
                    </span>
                  </label>
                </div>
              </div>
            </div>
            {/* Auto-approve or Manual Review */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Approval
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input type="radio" name="approval" checked={currentRule.autoApprove} onChange={() => updateCurrentRule('autoApprove', true)} className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                  <span className="ml-2 text-sm text-gray-700">
                    Auto-approve events
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="approval" checked={!currentRule.autoApprove} onChange={() => updateCurrentRule('autoApprove', false)} className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                  <span className="ml-2 text-sm text-gray-700">
                    Manual review required
                  </span>
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button type="button" onClick={handleCancelRule} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                Cancel
              </button>
              <button type="button" onClick={handleSaveRule} disabled={!currentRule.name} className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium ${!currentRule.name ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'} flex items-center`}>
                <SaveIcon className="h-4 w-4 mr-1.5" />
                {editingRuleIndex !== null ? 'Update Rule' : 'Save Rule'}
              </button>
            </div>
          </div>
        </div>}
      <div className="h-px bg-gray-200 my-8"></div>
      <button type="button" onClick={() => updateFormData(rules)} className="hidden">
        Save and Continue
      </button>
    </div>;
};
function XIcon(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18"></path>
      <path d="m6 6 12 12"></path>
    </svg>;
}