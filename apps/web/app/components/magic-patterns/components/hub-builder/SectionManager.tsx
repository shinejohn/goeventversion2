import React, { useState } from 'react';
import { HubData } from '../../pages/hub/create';
import { GripIcon, PlusIcon, XIcon, ChevronUpIcon, ChevronDownIcon, EyeIcon, EyeOffIcon, SettingsIcon, LayoutIcon } from 'lucide-react';
type SectionManagerProps = {
  hubData: HubData;
  updateHubData: (newData: HubData) => void;
};
// Available section types
const SECTION_TYPES = [{
  id: 'hero',
  name: 'Hero Section',
  description: 'Large banner with title, description, and call to action',
  icon: '🏆'
}, {
  id: 'featured',
  name: 'Featured Content',
  description: 'Showcase selected content in a grid or carousel',
  icon: '⭐'
}, {
  id: 'events',
  name: 'Events List',
  description: 'Display upcoming events with details',
  icon: '📅'
}, {
  id: 'members',
  name: 'Community Members',
  description: 'Show active members and profiles',
  icon: '👥'
}, {
  id: 'discussions',
  name: 'Recent Discussions',
  description: 'Display latest forum topics and posts',
  icon: '💬'
}, {
  id: 'gallery',
  name: 'Media Gallery',
  description: 'Photo and video grid with lightbox',
  icon: '🖼️'
}, {
  id: 'about',
  name: 'About Section',
  description: 'Information about the hub and its purpose',
  icon: 'ℹ️'
}, {
  id: 'sponsors',
  name: 'Sponsors & Partners',
  description: 'Showcase sponsors and partner organizations',
  icon: '🤝'
}, {
  id: 'resources',
  name: 'Resources & Links',
  description: 'Collection of useful resources and links',
  icon: '📚'
}, {
  id: 'custom',
  name: 'Custom Section',
  description: 'Create a section with custom content',
  icon: '🔧'
}];
export const SectionManager: React.FC<SectionManagerProps> = ({
  hubData,
  updateHubData
}) => {
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  // Sort sections by order
  const sortedSections = [...hubData.sections].sort((a, b) => a.order - b.order);
  // Handle section drag start
  const handleDragStart = (sectionId: string) => {
    setDraggedSection(sectionId);
  };
  // Handle section drag over
  const handleDragOver = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    if (!draggedSection || draggedSection === targetSectionId) return;
    const sections = [...hubData.sections];
    const draggedIndex = sections.findIndex(section => section.id === draggedSection);
    const targetIndex = sections.findIndex(section => section.id === targetSectionId);
    if (draggedIndex === -1 || targetIndex === -1) return;
    // Reorder sections
    const newSections = sections.map(section => {
      if (section.id === draggedSection) {
        return {
          ...section,
          order: sections[targetIndex].order
        };
      }
      if (section.id === targetSectionId) {
        return {
          ...section,
          order: sections[draggedIndex].order
        };
      }
      return section;
    });
    updateHubData({
      ...hubData,
      sections: newSections
    });
  };
  // Handle section drag end
  const handleDragEnd = () => {
    setDraggedSection(null);
  };
  // Toggle section enabled state
  const toggleSectionEnabled = (sectionId: string) => {
    const sections = hubData.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          enabled: !section.enabled
        };
      }
      return section;
    });
    updateHubData({
      ...hubData,
      sections
    });
  };
  // Move section up
  const moveSectionUp = (sectionId: string) => {
    const sections = [...hubData.sections];
    const index = sections.findIndex(section => section.id === sectionId);
    if (index <= 0) return;
    // Swap order with previous section
    const prevSection = sections[index - 1];
    const currentSection = sections[index];
    const newSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          order: prevSection.order
        };
      }
      if (section.id === prevSection.id) {
        return {
          ...section,
          order: currentSection.order
        };
      }
      return section;
    });
    updateHubData({
      ...hubData,
      sections: newSections
    });
  };
  // Move section down
  const moveSectionDown = (sectionId: string) => {
    const sections = [...hubData.sections];
    const index = sections.findIndex(section => section.id === sectionId);
    if (index === -1 || index >= sections.length - 1) return;
    // Swap order with next section
    const nextSection = sections[index + 1];
    const currentSection = sections[index];
    const newSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          order: nextSection.order
        };
      }
      if (section.id === nextSection.id) {
        return {
          ...section,
          order: currentSection.order
        };
      }
      return section;
    });
    updateHubData({
      ...hubData,
      sections: newSections
    });
  };
  // Delete section
  const deleteSection = (sectionId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this section?');
    if (!confirmed) return;
    const newSections = hubData.sections.filter(section => section.id !== sectionId);
    // Reorder remaining sections
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      order: index
    }));
    updateHubData({
      ...hubData,
      sections: reorderedSections
    });
  };
  // Add new section
  const addSection = (sectionType: string) => {
    const sectionTypeInfo = SECTION_TYPES.find(type => type.id === sectionType);
    if (!sectionTypeInfo) return;
    const newSectionId = `${sectionType}-${Date.now()}`;
    const newSection = {
      id: newSectionId,
      type: sectionType,
      title: sectionTypeInfo.name,
      enabled: true,
      order: hubData.sections.length,
      settings: getDefaultSettingsForType(sectionType)
    };
    updateHubData({
      ...hubData,
      sections: [...hubData.sections, newSection]
    });
    setShowAddSection(false);
  };
  // Get default settings for a section type
  const getDefaultSettingsForType = (sectionType: string): Record<string, any> => {
    switch (sectionType) {
      case 'hero':
        return {
          showTitle: true,
          showDescription: true,
          ctaText: 'Join Now',
          ctaEnabled: true
        };
      case 'featured':
        return {
          itemCount: 3,
          showImages: true,
          contentType: 'mixed'
        };
      case 'events':
        return {
          itemCount: 4,
          showLocation: true,
          showDate: true
        };
      case 'members':
        return {
          showCount: true,
          featuredCount: 6,
          showJoinDate: false
        };
      case 'discussions':
        return {
          itemCount: 5,
          showAuthor: true,
          showReplyCount: true
        };
      case 'gallery':
        return {
          itemCount: 8,
          layout: 'grid',
          showCaption: true
        };
      case 'about':
        return {
          showMission: true,
          showTeam: false,
          showContact: true
        };
      case 'sponsors':
        return {
          layout: 'grid',
          showDescription: false,
          itemCount: 4
        };
      case 'resources':
        return {
          groupByCategory: true,
          showDescription: true,
          itemCount: 8
        };
      case 'custom':
        return {
          content: '',
          showTitle: true,
          backgroundColor: ''
        };
      default:
        return {};
    }
  };
  // Update section settings
  const updateSectionSettings = (sectionId: string, settingKey: string, value: any) => {
    const sections = hubData.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          settings: {
            ...section.settings,
            [settingKey]: value
          }
        };
      }
      return section;
    });
    updateHubData({
      ...hubData,
      sections
    });
  };
  // Update section title
  const updateSectionTitle = (sectionId: string, title: string) => {
    const sections = hubData.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          title
        };
      }
      return section;
    });
    updateHubData({
      ...hubData,
      sections
    });
  };
  // Render section settings based on type
  const renderSectionSettings = (section: HubData['sections'][0]) => {
    switch (section.type) {
      case 'hero':
        return <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input type="checkbox" checked={section.settings.showTitle} onChange={e => updateSectionSettings(section.id, 'showTitle', e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2" />
                Show Title
              </label>
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input type="checkbox" checked={section.settings.showDescription} onChange={e => updateSectionSettings(section.id, 'showDescription', e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2" />
                Show Description
              </label>
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input type="checkbox" checked={section.settings.ctaEnabled} onChange={e => updateSectionSettings(section.id, 'ctaEnabled', e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2" />
                Show Call to Action Button
              </label>
            </div>
            {section.settings.ctaEnabled && <div>
                <label htmlFor="cta-text" className="block text-sm font-medium text-gray-700 mb-1">
                  Button Text
                </label>
                <input id="cta-text" type="text" value={section.settings.ctaText} onChange={e => updateSectionSettings(section.id, 'ctaText', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>}
          </div>;
      case 'featured':
      case 'events':
      case 'discussions':
      case 'gallery':
      case 'resources':
        return <div className="space-y-4">
            <div>
              <label htmlFor={`${section.id}-count`} className="block text-sm font-medium text-gray-700 mb-1">
                Number of Items to Display
              </label>
              <select id={`${section.id}-count`} value={section.settings.itemCount} onChange={e => updateSectionSettings(section.id, 'itemCount', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                {[3, 4, 5, 6, 8, 10, 12].map(count => <option key={count} value={count}>
                    {count}
                  </option>)}
              </select>
            </div>
            {section.type === 'featured' && <div>
                <label htmlFor={`${section.id}-content-type`} className="block text-sm font-medium text-gray-700 mb-1">
                  Content Type
                </label>
                <select id={`${section.id}-content-type`} value={section.settings.contentType} onChange={e => updateSectionSettings(section.id, 'contentType', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="mixed">Mixed Content</option>
                  <option value="events">Events Only</option>
                  <option value="discussions">Discussions Only</option>
                  <option value="articles">Articles Only</option>
                </select>
              </div>}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input type="checkbox" checked={section.settings.showImages} onChange={e => updateSectionSettings(section.id, 'showImages', e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2" />
                Show Images
              </label>
            </div>
            {section.type === 'gallery' && <div>
                <label htmlFor={`${section.id}-layout`} className="block text-sm font-medium text-gray-700 mb-1">
                  Layout Style
                </label>
                <select id={`${section.id}-layout`} value={section.settings.layout} onChange={e => updateSectionSettings(section.id, 'layout', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="grid">Grid</option>
                  <option value="masonry">Masonry</option>
                  <option value="carousel">Carousel</option>
                </select>
              </div>}
          </div>;
      case 'members':
        return <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input type="checkbox" checked={section.settings.showCount} onChange={e => updateSectionSettings(section.id, 'showCount', e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2" />
                Show Member Count
              </label>
            </div>
            <div>
              <label htmlFor={`${section.id}-featured-count`} className="block text-sm font-medium text-gray-700 mb-1">
                Featured Members to Display
              </label>
              <select id={`${section.id}-featured-count`} value={section.settings.featuredCount} onChange={e => updateSectionSettings(section.id, 'featuredCount', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                {[4, 6, 8, 10, 12].map(count => <option key={count} value={count}>
                    {count}
                  </option>)}
              </select>
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input type="checkbox" checked={section.settings.showJoinDate} onChange={e => updateSectionSettings(section.id, 'showJoinDate', e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2" />
                Show Join Date
              </label>
            </div>
          </div>;
      case 'custom':
        return <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <input type="checkbox" checked={section.settings.showTitle} onChange={e => updateSectionSettings(section.id, 'showTitle', e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2" />
                Show Section Title
              </label>
            </div>
            <div>
              <label htmlFor={`${section.id}-content`} className="block text-sm font-medium text-gray-700 mb-1">
                Custom Content
              </label>
              <textarea id={`${section.id}-content`} value={section.settings.content} onChange={e => updateSectionSettings(section.id, 'content', e.target.value)} rows={4} placeholder="Add your custom content here. HTML is supported." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label htmlFor={`${section.id}-bg-color`} className="block text-sm font-medium text-gray-700 mb-1">
                Background Color (optional)
              </label>
              <input id={`${section.id}-bg-color`} type="text" value={section.settings.backgroundColor} onChange={e => updateSectionSettings(section.id, 'backgroundColor', e.target.value)} placeholder="#ffffff or rgba(255,255,255,0.8)" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>;
      default:
        return <div className="p-4 text-center text-gray-500">
            <p>Basic settings available for this section type.</p>
          </div>;
    }
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Section Manager</h2>
          <button onClick={() => setShowAddSection(!showAddSection)} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PlusIcon className="h-4 w-4 mr-1.5" />
            Add Section
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Drag and drop sections to reorder them. Toggle visibility or customize
          each section's settings.
        </p>
        {/* Add Section Panel */}
        {showAddSection && <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-md font-medium text-gray-900">
                Add New Section
              </h3>
              <button onClick={() => setShowAddSection(false)} className="text-gray-400 hover:text-gray-500">
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {SECTION_TYPES.map(sectionType => <button key={sectionType.id} onClick={() => addSection(sectionType.id)} className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                  <span className="text-2xl mr-3">{sectionType.icon}</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      {sectionType.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {sectionType.description}
                    </div>
                  </div>
                </button>)}
            </div>
          </div>}
        {/* Sections List */}
        <div className="space-y-3">
          {sortedSections.length === 0 ? <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
              <LayoutIcon className="h-8 w-8 mx-auto mb-2" />
              <p className="mb-2">No sections added yet</p>
              <button onClick={() => setShowAddSection(true)} className="text-indigo-600 hover:text-indigo-800 font-medium">
                Click to add your first section
              </button>
            </div> : sortedSections.map((section, index) => <div key={section.id} draggable onDragStart={() => handleDragStart(section.id)} onDragOver={e => handleDragOver(e, section.id)} onDragEnd={handleDragEnd} className={`border rounded-lg overflow-hidden ${draggedSection === section.id ? 'border-indigo-500 bg-indigo-50' : section.enabled ? 'border-gray-200' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center p-3 border-b border-gray-200 bg-gray-50">
                  <div className="cursor-move p-1 mr-2 text-gray-400 hover:text-gray-600">
                    <GripIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    {editingSectionId === section.id ? <input type="text" value={section.title} onChange={e => updateSectionTitle(section.id, e.target.value)} onBlur={() => setEditingSectionId(null)} onKeyDown={e => e.key === 'Enter' && setEditingSectionId(null)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" autoFocus /> : <h3 className="font-medium text-gray-900 cursor-pointer" onClick={() => setEditingSectionId(section.id)}>
                        {section.title}
                      </h3>}
                    <p className="text-xs text-gray-500">
                      {SECTION_TYPES.find(type => type.id === section.type)?.description || 'Custom section'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => toggleSectionEnabled(section.id)} className={`p-1 rounded-md ${section.enabled ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`} title={section.enabled ? 'Disable section' : 'Enable section'}>
                      {section.enabled ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
                    </button>
                    <button onClick={() => moveSectionUp(section.id)} disabled={index === 0} className={`p-1 rounded-md ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`} title="Move up">
                      <ChevronUpIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => moveSectionDown(section.id)} disabled={index === sortedSections.length - 1} className={`p-1 rounded-md ${index === sortedSections.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`} title="Move down">
                      <ChevronDownIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => deleteSection(section.id)} className="p-1 rounded-md text-red-500 hover:bg-red-50" title="Delete section">
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {/* Section Settings */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                      <SettingsIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                      Section Settings
                    </h4>
                  </div>
                  {renderSectionSettings(section)}
                </div>
              </div>)}
        </div>
      </div>
      {/* Tips and Info */}
      <div className="p-4 bg-blue-50 text-blue-800 text-sm">
        <p className="flex items-center">
          <span className="text-xl mr-2">💡</span>
          <span>
            <strong>Tip:</strong> For best results, keep your most important
            sections at the top. The Hero section is typically first, followed
            by featured content.
          </span>
        </p>
      </div>
    </div>;
};