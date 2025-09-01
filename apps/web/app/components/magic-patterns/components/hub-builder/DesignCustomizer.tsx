import React, { useState } from 'react';
import { HubData } from '../../pages/hub/create';
import { ImageIcon, VideoIcon, RefreshCwIcon, CheckIcon, PaletteIcon, TypeIcon, LayoutIcon, AlertCircleIcon } from 'lucide-react';
type DesignCustomizerProps = {
  hubData: HubData;
  updateHubData: (section: string, field: string, value: any) => void;
  errors: Record<string, string[]>;
};
// Mock design templates
const DESIGN_TEMPLATES = [{
  id: 'default',
  name: 'Modern Default',
  description: 'Clean, minimalist design with focus on content',
  thumbnail: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
}, {
  id: 'magazine',
  name: 'Magazine Style',
  description: 'Bold headers and featured content blocks',
  thumbnail: 'https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
}, {
  id: 'community',
  name: 'Community Focus',
  description: 'Emphasizes member interactions and discussions',
  thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
}, {
  id: 'creative',
  name: 'Creative',
  description: 'Artistic layout with unique visual elements',
  thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
}, {
  id: 'minimal',
  name: 'Minimal',
  description: 'Ultra-clean design with maximum whitespace',
  thumbnail: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
}];
// Font options
const FONT_OPTIONS = [{
  id: 'Inter',
  name: 'Inter',
  description: 'Clean and modern'
}, {
  id: 'Roboto',
  name: 'Roboto',
  description: 'Classic and versatile'
}, {
  id: 'Playfair Display',
  name: 'Playfair Display',
  description: 'Elegant serif'
}, {
  id: 'Montserrat',
  name: 'Montserrat',
  description: 'Bold and contemporary'
}, {
  id: 'Merriweather',
  name: 'Merriweather',
  description: 'Readable serif'
}, {
  id: 'Open Sans',
  name: 'Open Sans',
  description: 'Friendly and approachable'
}, {
  id: 'Poppins',
  name: 'Poppins',
  description: 'Geometric and modern'
}, {
  id: 'Lora',
  name: 'Lora',
  description: 'Elegant and balanced'
}];
// Layout options
const LAYOUT_OPTIONS = [{
  id: 'magazine',
  name: 'Magazine',
  description: 'Grid-based with featured content blocks'
}, {
  id: 'blog',
  name: 'Blog',
  description: 'Chronological content with sidebar'
}, {
  id: 'community',
  name: 'Community',
  description: 'Focus on member interactions and discussions'
}];
export const DesignCustomizer: React.FC<DesignCustomizerProps> = ({
  hubData,
  updateHubData,
  errors
}) => {
  const [activeTab, setActiveTab] = useState<'template' | 'header' | 'colors' | 'typography' | 'layout'>('template');
  const [headerType, setHeaderType] = useState<'image' | 'video'>('image');
  // Update header image
  const handleHeaderImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateHubData('design', 'headerImage', e.target.value);
  };
  // Update header video
  const handleHeaderVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateHubData('design', 'headerVideo', e.target.value);
  };
  // Update color
  const handleColorChange = (colorKey: string, value: string) => {
    updateHubData('design', 'colors', {
      ...hubData.design.colors,
      [colorKey]: value
    });
  };
  // Update font
  const handleFontChange = (fontKey: string, value: string) => {
    updateHubData('design', 'fonts', {
      ...hubData.design.fonts,
      [fontKey]: value
    });
  };
  // Update template
  const handleTemplateChange = (templateId: string) => {
    updateHubData('design', 'template', templateId);
  };
  // Update layout
  const handleLayoutChange = (layoutId: 'magazine' | 'blog' | 'community') => {
    updateHubData('design', 'layout', layoutId);
  };
  // Generate a random color scheme
  const generateRandomColorScheme = () => {
    const colorSchemes = [
    // Blue/Purple
    {
      primary: '#4f46e5',
      secondary: '#818cf8',
      accent: '#c084fc',
      background: '#ffffff',
      text: '#1f2937'
    },
    // Green/Teal
    {
      primary: '#10b981',
      secondary: '#34d399',
      accent: '#06b6d4',
      background: '#f8fafc',
      text: '#0f172a'
    },
    // Orange/Red
    {
      primary: '#f97316',
      secondary: '#fb923c',
      accent: '#ef4444',
      background: '#ffffff',
      text: '#1f2937'
    },
    // Purple/Pink
    {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#ec4899',
      background: '#f8fafc',
      text: '#0f172a'
    },
    // Teal/Blue
    {
      primary: '#0d9488',
      secondary: '#2dd4bf',
      accent: '#3b82f6',
      background: '#ffffff',
      text: '#1f2937'
    }];
    const randomScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    updateHubData('design', 'colors', randomScheme);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button onClick={() => setActiveTab('template')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'template' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Template
        </button>
        <button onClick={() => setActiveTab('header')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'header' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Header
        </button>
        <button onClick={() => setActiveTab('colors')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'colors' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Colors
        </button>
        <button onClick={() => setActiveTab('typography')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'typography' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Typography
        </button>
        <button onClick={() => setActiveTab('layout')} className={`px-4 py-3 text-sm font-medium ${activeTab === 'layout' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
          Layout
        </button>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {/* Template Selection */}
        {activeTab === 'template' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Choose a Template
              </h3>
              <span className="text-sm text-gray-500">
                You can customize any template further
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DESIGN_TEMPLATES.map(template => <div key={template.id} onClick={() => handleTemplateChange(template.id)} className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${hubData.design.template === template.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="aspect-video bg-gray-100 relative">
                    <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                    {hubData.design.template === template.id && <div className="absolute top-2 right-2 bg-indigo-500 text-white p-1 rounded-full">
                        <CheckIcon className="h-4 w-4" />
                      </div>}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900">
                      {template.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>)}
            </div>
          </div>}
        {/* Header Image/Video */}
        {activeTab === 'header' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Header Media
              </h3>
              <div className="flex border border-gray-200 rounded-md overflow-hidden">
                <button onClick={() => setHeaderType('image')} className={`flex items-center px-3 py-1.5 text-sm ${headerType === 'image' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                  <ImageIcon className="h-4 w-4 mr-1.5" />
                  Image
                </button>
                <button onClick={() => setHeaderType('video')} className={`flex items-center px-3 py-1.5 text-sm ${headerType === 'video' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                  <VideoIcon className="h-4 w-4 mr-1.5" />
                  Video
                </button>
              </div>
            </div>
            {headerType === 'image' && <>
                <div className="mb-4">
                  <label htmlFor="header-image" className="block text-sm font-medium text-gray-700 mb-1">
                    Header Image URL
                  </label>
                  <input id="header-image" type="text" value={hubData.design.headerImage} onChange={handleHeaderImageChange} placeholder="https://example.com/image.jpg" className={`w-full px-3 py-2 border ${errors.headerImage ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} />
                  {errors.headerImage && <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircleIcon className="h-4 w-4 mr-1" />
                      {errors.headerImage[0]}
                    </p>}
                  <p className="mt-1 text-xs text-gray-500">
                    Recommended size: 1600 x 600 pixels. Use a high-quality
                    image that represents your hub.
                  </p>
                </div>
                <div className="mt-4 aspect-[3/1] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  {hubData.design.headerImage ? <img src={hubData.design.headerImage} alt="Header preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                        <span className="text-sm">No image selected</span>
                      </div>
                    </div>}
                </div>
              </>}
            {headerType === 'video' && <>
                <div className="mb-4">
                  <label htmlFor="header-video" className="block text-sm font-medium text-gray-700 mb-1">
                    Header Video URL
                  </label>
                  <input id="header-video" type="text" value={hubData.design.headerVideo || ''} onChange={handleHeaderVideoChange} placeholder="https://example.com/video.mp4" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  <p className="mt-1 text-xs text-gray-500">
                    Recommended format: MP4, 16:9 aspect ratio, max 10MB. Short
                    looping videos work best.
                  </p>
                </div>
                <div className="mt-4 aspect-[3/1] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <VideoIcon className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-sm">Video preview not available</span>
                  </div>
                </div>
              </>}
          </div>}
        {/* Color Scheme */}
        {activeTab === 'colors' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Color Scheme
              </h3>
              <button onClick={generateRandomColorScheme} className="flex items-center text-sm text-indigo-600 hover:text-indigo-800">
                <RefreshCwIcon className="h-4 w-4 mr-1.5" />
                Generate Random Scheme
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="primary-color" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <div className="flex">
                  <div className="w-10 h-10 rounded-l-md border border-r-0 border-gray-300" style={{
                backgroundColor: hubData.design.colors.primary
              }}></div>
                  <input id="primary-color" type="text" value={hubData.design.colors.primary} onChange={e => handleColorChange('primary', e.target.value)} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Main brand color used for buttons, links, and accents
                </p>
              </div>
              <div>
                <label htmlFor="secondary-color" className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Color
                </label>
                <div className="flex">
                  <div className="w-10 h-10 rounded-l-md border border-r-0 border-gray-300" style={{
                backgroundColor: hubData.design.colors.secondary
              }}></div>
                  <input id="secondary-color" type="text" value={hubData.design.colors.secondary} onChange={e => handleColorChange('secondary', e.target.value)} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Complementary color used for secondary elements
                </p>
              </div>
              <div>
                <label htmlFor="accent-color" className="block text-sm font-medium text-gray-700 mb-1">
                  Accent Color
                </label>
                <div className="flex">
                  <div className="w-10 h-10 rounded-l-md border border-r-0 border-gray-300" style={{
                backgroundColor: hubData.design.colors.accent
              }}></div>
                  <input id="accent-color" type="text" value={hubData.design.colors.accent} onChange={e => handleColorChange('accent', e.target.value)} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Highlight color for special elements and calls to action
                </p>
              </div>
              <div>
                <label htmlFor="background-color" className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <div className="flex">
                  <div className="w-10 h-10 rounded-l-md border border-r-0 border-gray-300" style={{
                backgroundColor: hubData.design.colors.background
              }}></div>
                  <input id="background-color" type="text" value={hubData.design.colors.background} onChange={e => handleColorChange('background', e.target.value)} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Main background color for your hub
                </p>
              </div>
              <div>
                <label htmlFor="text-color" className="block text-sm font-medium text-gray-700 mb-1">
                  Text Color
                </label>
                <div className="flex">
                  <div className="w-10 h-10 rounded-l-md border border-r-0 border-gray-300" style={{
                backgroundColor: hubData.design.colors.text
              }}></div>
                  <input id="text-color" type="text" value={hubData.design.colors.text} onChange={e => handleColorChange('text', e.target.value)} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Main text color for readability
                </p>
              </div>
            </div>
            {/* Color Preview */}
            <div className="mt-6 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Color Scheme Preview
              </h4>
              <div className="p-4 rounded" style={{
            backgroundColor: hubData.design.colors.background
          }}>
                <h3 className="text-xl font-bold mb-2" style={{
              color: hubData.design.colors.text
            }}>
                  Your Hub Title
                </h3>
                <p className="text-sm mb-3" style={{
              color: hubData.design.colors.text
            }}>
                  This is how your content will look with the selected color
                  scheme.
                </p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1.5 text-sm font-medium rounded-md text-white" style={{
                backgroundColor: hubData.design.colors.primary
              }}>
                    Primary Button
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium rounded-md text-white" style={{
                backgroundColor: hubData.design.colors.secondary
              }}>
                    Secondary Button
                  </button>
                  <button className="px-3 py-1.5 text-sm font-medium rounded-md text-white" style={{
                backgroundColor: hubData.design.colors.accent
              }}>
                    Accent Button
                  </button>
                </div>
              </div>
            </div>
          </div>}
        {/* Typography */}
        {activeTab === 'typography' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Typography</h3>
              <div className="flex items-center">
                <TypeIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Choose fonts that reflect your hub's personality
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="heading-font" className="block text-sm font-medium text-gray-700 mb-1">
                  Heading Font
                </label>
                <select id="heading-font" value={hubData.design.fonts.heading} onChange={e => handleFontChange('heading', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  {FONT_OPTIONS.map(font => <option key={font.id} value={font.id}>
                      {font.name} - {font.description}
                    </option>)}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Used for titles, headings, and important text
                </p>
              </div>
              <div>
                <label htmlFor="body-font" className="block text-sm font-medium text-gray-700 mb-1">
                  Body Font
                </label>
                <select id="body-font" value={hubData.design.fonts.body} onChange={e => handleFontChange('body', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  {FONT_OPTIONS.map(font => <option key={font.id} value={font.id}>
                      {font.name} - {font.description}
                    </option>)}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Used for paragraphs and general content
                </p>
              </div>
            </div>
            {/* Typography Preview */}
            <div className="mt-6 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Typography Preview
              </h4>
              <div className="p-4 bg-white rounded">
                <h1 className="text-3xl mb-2" style={{
              fontFamily: hubData.design.fonts.heading,
              color: hubData.design.colors.text
            }}>
                  This is a Heading 1
                </h1>
                <h2 className="text-2xl mb-2" style={{
              fontFamily: hubData.design.fonts.heading,
              color: hubData.design.colors.text
            }}>
                  This is a Heading 2
                </h2>
                <h3 className="text-xl mb-3" style={{
              fontFamily: hubData.design.fonts.heading,
              color: hubData.design.colors.text
            }}>
                  This is a Heading 3
                </h3>
                <p className="mb-2" style={{
              fontFamily: hubData.design.fonts.body,
              color: hubData.design.colors.text
            }}>
                  This is a paragraph of text that shows how your body content
                  will appear. The selected font should be highly readable at
                  different sizes and work well for longer blocks of text.
                </p>
                <p className="text-sm" style={{
              fontFamily: hubData.design.fonts.body,
              color: hubData.design.colors.text
            }}>
                  This is smaller text that might appear in captions, metadata,
                  or supporting information.
                </p>
                <div className="mt-3">
                  <a href="#" style={{
                color: hubData.design.colors.primary,
                fontFamily: hubData.design.fonts.body
              }}>
                    This is how links will appear
                  </a>
                </div>
              </div>
            </div>
          </div>}
        {/* Layout */}
        {activeTab === 'layout' && <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Layout Style
              </h3>
              <div className="flex items-center">
                <LayoutIcon className="h-4 w-4 mr-1.5 text-gray-500" />
                <span className="text-sm text-gray-500">
                  Choose how content is organized
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {LAYOUT_OPTIONS.map(layout => <div key={layout.id} onClick={() => handleLayoutChange(layout.id as 'magazine' | 'blog' | 'community')} className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${hubData.design.layout === layout.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="h-32 bg-gray-100 relative flex items-center justify-center">
                    <LayoutIcon className="h-8 w-8 text-gray-400" />
                    {hubData.design.layout === layout.id && <div className="absolute top-2 right-2 bg-indigo-500 text-white p-1 rounded-full">
                        <CheckIcon className="h-4 w-4" />
                      </div>}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900">{layout.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {layout.description}
                    </p>
                  </div>
                </div>)}
            </div>
            {/* Layout Preview */}
            <div className="mt-6 p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Layout Preview
              </h4>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <LayoutIcon className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">
                    {hubData.design.layout === 'magazine' && 'Magazine layout with featured content blocks'}
                    {hubData.design.layout === 'blog' && 'Blog layout with chronological content'}
                    {hubData.design.layout === 'community' && 'Community layout with focus on member interactions'}
                  </p>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};