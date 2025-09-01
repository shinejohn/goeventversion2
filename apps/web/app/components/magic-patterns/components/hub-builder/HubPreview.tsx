import React from 'react';
import { HubData } from '../../pages/hub/create';
import { CalendarIcon, MessageSquareIcon, UserIcon, ImageIcon, UsersIcon } from 'lucide-react';
type HubPreviewProps = {
  hubData: HubData;
};
export const HubPreview: React.FC<HubPreviewProps> = ({
  hubData
}) => {
  // Get active sections in order
  const activeSections = hubData.sections.filter(section => section.enabled).sort((a, b) => a.order - b.order);
  // Get a random image if header image is not set
  const headerImage = hubData.design.headerImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
  return <div className="w-full h-full overflow-y-auto" style={{
    fontFamily: hubData.design.fonts.body,
    color: hubData.design.colors.text,
    backgroundColor: hubData.design.colors.background
  }}>
      {/* Header */}
      <header className="relative">
        <div className="w-full h-48 bg-cover bg-center" style={{
        backgroundImage: `url(${headerImage})`
      }}>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white" style={{
              fontFamily: hubData.design.fonts.heading
            }}>
                {hubData.name || 'Hub Name'}
              </h1>
              {hubData.mission && <p className="mt-2 text-sm text-white max-w-lg mx-auto">
                  {hubData.mission}
                </p>}
            </div>
          </div>
        </div>
        <div className="h-12 flex items-center justify-between px-4 shadow-sm" style={{
        backgroundColor: hubData.design.colors.primary,
        color: '#ffffff'
      }}>
          <div className="flex space-x-4">
            <button className="text-sm font-medium">Home</button>
            <button className="text-sm font-medium">Events</button>
            <button className="text-sm font-medium">Discussions</button>
            <button className="text-sm font-medium">Members</button>
            <button className="text-sm font-medium">About</button>
          </div>
          <div>
            <button className="px-3 py-1 text-sm font-medium rounded-md" style={{
            backgroundColor: hubData.design.colors.accent
          }}>
              Join
            </button>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Preview of sections based on layout */}
        {hubData.design.layout === 'magazine' && <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {activeSections.map(section => <div key={section.id} className="p-4 border rounded-lg shadow-sm" style={{
            borderColor: `${hubData.design.colors.primary}20`
          }}>
                  <h2 className="text-lg font-bold mb-4" style={{
              fontFamily: hubData.design.fonts.heading,
              color: hubData.design.colors.primary
            }}>
                    {section.title}
                  </h2>
                  {/* Section content preview based on type */}
                  {renderSectionPreview(section)}
                </div>)}
            </div>
            <div className="space-y-6">
              {/* Sidebar */}
              <div className="p-4 border rounded-lg shadow-sm">
                <h2 className="text-lg font-bold mb-4" style={{
              fontFamily: hubData.design.fonts.heading,
              color: hubData.design.colors.primary
            }}>
                  About This Hub
                </h2>
                <p className="text-sm mb-3">
                  {hubData.mission || 'Hub description will appear here.'}
                </p>
                <div className="flex items-center text-sm">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  <span>1,234 members</span>
                </div>
              </div>
              {/* Sponsor slot if enabled */}
              {hubData.monetization.sponsorSlots.some(slot => slot.position === 'sidebar' && slot.enabled) && <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                  <div className="text-xs uppercase text-gray-500 mb-2">
                    Sponsor
                  </div>
                  <div className="h-32 bg-gray-200 flex items-center justify-center rounded">
                    <span className="text-gray-400">Sponsor Ad</span>
                  </div>
                </div>}
            </div>
          </div>}
        {hubData.design.layout === 'blog' && <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3 space-y-6">
              {activeSections.map(section => <div key={section.id} className="p-4 border rounded-lg shadow-sm" style={{
            borderColor: `${hubData.design.colors.primary}20`
          }}>
                  <h2 className="text-lg font-bold mb-4" style={{
              fontFamily: hubData.design.fonts.heading,
              color: hubData.design.colors.primary
            }}>
                    {section.title}
                  </h2>
                  {/* Section content preview based on type */}
                  {renderSectionPreview(section)}
                </div>)}
            </div>
            <div className="space-y-6">
              {/* Sidebar */}
              <div className="p-4 border rounded-lg shadow-sm">
                <h2 className="text-lg font-bold mb-4" style={{
              fontFamily: hubData.design.fonts.heading,
              color: hubData.design.colors.primary
            }}>
                  About This Hub
                </h2>
                <p className="text-sm mb-3">
                  {hubData.mission || 'Hub description will appear here.'}
                </p>
                <div className="flex items-center text-sm">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  <span>1,234 members</span>
                </div>
              </div>
              {/* Sponsor slot if enabled */}
              {hubData.monetization.sponsorSlots.some(slot => slot.position === 'sidebar' && slot.enabled) && <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                  <div className="text-xs uppercase text-gray-500 mb-2">
                    Sponsor
                  </div>
                  <div className="h-32 bg-gray-200 flex items-center justify-center rounded">
                    <span className="text-gray-400">Sponsor Ad</span>
                  </div>
                </div>}
            </div>
          </div>}
        {hubData.design.layout === 'community' && <div className="space-y-6">
            {activeSections.map(section => <div key={section.id} className="p-4 border rounded-lg shadow-sm" style={{
          borderColor: `${hubData.design.colors.primary}20`
        }}>
                <h2 className="text-lg font-bold mb-4" style={{
            fontFamily: hubData.design.fonts.heading,
            color: hubData.design.colors.primary
          }}>
                  {section.title}
                </h2>
                {/* Section content preview based on type */}
                {renderSectionPreview(section)}
              </div>)}
          </div>}
      </main>
      {/* Footer */}
      <footer className="py-6 mt-8" style={{
      backgroundColor: `${hubData.design.colors.primary}10`
    }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold" style={{
              fontFamily: hubData.design.fonts.heading
            }}>
                {hubData.name || 'Hub Name'}
              </h3>
              <p className="text-sm mt-1">
                {hubData.geographicScope === 'local' && 'Local Community'}
                {hubData.geographicScope === 'regional' && 'Regional Community'}
                {hubData.geographicScope === 'national' && 'National Community'}
                {hubData.geographicScope === 'global' && 'Global Community'}
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="text-sm">Terms</button>
              <button className="text-sm">Privacy</button>
              <button className="text-sm">Contact</button>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
// Helper function to render section preview based on type
const renderSectionPreview = (section: any) => {
  switch (section.type) {
    case 'hero':
      return <div className="text-center py-4">
          {section.settings.showTitle && <h3 className="text-xl font-bold mb-2">Welcome to our Hub</h3>}
          {section.settings.showDescription && <p className="text-sm mb-4">
              Join our community to connect with like-minded individuals.
            </p>}
          {section.settings.ctaEnabled && <button className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium">
              {section.settings.ctaText || 'Join Now'}
            </button>}
        </div>;
    case 'featured':
      return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({
          length: Math.min(section.settings.itemCount, 3)
        }).map((_, i) => <div key={i} className="border rounded-md overflow-hidden">
              {section.settings.showImages && <div className="h-32 bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>}
              <div className="p-3">
                <h4 className="font-medium text-sm">Featured Item {i + 1}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Short description of this item
                </p>
              </div>
            </div>)}
        </div>;
    case 'events':
      return <div className="space-y-3">
          {Array.from({
          length: Math.min(section.settings.itemCount, 3)
        }).map((_, i) => <div key={i} className="flex items-start p-2 border-b last:border-b-0">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                <CalendarIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Upcoming Event {i + 1}</h4>
                {section.settings.showDate && <p className="text-xs text-gray-500">
                    June {15 + i}, 2023 • 7:00 PM
                  </p>}
                {section.settings.showLocation && <p className="text-xs text-gray-500 mt-1">
                    Downtown Venue, New York
                  </p>}
              </div>
            </div>)}
        </div>;
    case 'members':
      return <div>
          {section.settings.showCount && <p className="text-sm mb-3">1,234 members in this community</p>}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Array.from({
            length: Math.min(section.settings.featuredCount, 6)
          }).map((_, i) => <div key={i} className="text-center">
                <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-1 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs font-medium truncate">Member {i + 1}</p>
                {section.settings.showJoinDate && <p className="text-xs text-gray-500">Joined May '23</p>}
              </div>)}
          </div>
        </div>;
    case 'discussions':
      return <div className="space-y-3">
          {Array.from({
          length: Math.min(section.settings.itemCount, 3)
        }).map((_, i) => <div key={i} className="flex items-start p-2 border-b last:border-b-0">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <MessageSquareIcon className="h-4 w-4 text-gray-500" />
              </div>
              <div>
                <h4 className="font-medium text-sm">
                  Discussion Topic {i + 1}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  This is a preview of the discussion content...
                </p>
                <div className="flex items-center mt-1">
                  {section.settings.showAuthor && <span className="text-xs text-gray-500 mr-3">
                      by User{i + 1}
                    </span>}
                  {section.settings.showReplyCount && <span className="text-xs text-gray-500">
                      {5 + i} replies
                    </span>}
                </div>
              </div>
            </div>)}
        </div>;
    case 'gallery':
      return <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Array.from({
          length: Math.min(section.settings.itemCount, 8)
        }).map((_, i) => <div key={i} className="aspect-square bg-gray-200 rounded flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>)}
        </div>;
    case 'custom':
      return <div>
          {section.settings.content ? <div className="text-sm">{section.settings.content}</div> : <div className="text-sm text-gray-500 italic">
              Custom content will appear here
            </div>}
        </div>;
    default:
      return <div className="text-sm text-gray-500 italic">
          Content for this section type will appear here
        </div>;
  }
};