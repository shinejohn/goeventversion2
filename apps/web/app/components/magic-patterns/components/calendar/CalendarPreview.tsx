import React from 'react';
import { CalendarIcon, UsersIcon, TagIcon, MapPinIcon, DollarSignIcon } from 'lucide-react';
type CalendarPreviewProps = {
  formData: any;
};
export const CalendarPreview = ({
  formData
}: CalendarPreviewProps) => {
  // Helper function to determine the text color based on background color
  const getTextColorClass = (colorTheme: string) => {
    switch (colorTheme) {
      case 'yellow':
      case 'green':
      case 'cyan':
        return 'text-gray-900';
      default:
        return 'text-white';
    }
  };
  // Helper function to get background color class
  const getBgColorClass = (colorTheme: string) => {
    return `bg-${colorTheme}-600`;
  };
  return <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {/* Banner */}
      <div className="relative h-32 bg-gray-200">
        {formData.customization?.bannerImage ? <img src={formData.customization.bannerImage} alt="Calendar banner" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-sm">Banner Image</span>
          </div>}
        {/* Logo */}
        <div className="absolute -bottom-6 left-4">
          <div className="h-12 w-12 rounded-lg border-2 border-white shadow-sm overflow-hidden bg-white">
            {formData.customization?.logo ? <img src={formData.customization.logo} alt="Calendar logo" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
              </div>}
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="pt-8 px-4 pb-4">
        <h3 className="font-bold text-gray-900 truncate">
          {formData.name || 'Calendar Name'}
        </h3>
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{formData.category || 'Category'}</span>
          {formData.visibility && <>
              <span className="mx-1">•</span>
              <span className="capitalize">{formData.visibility}</span>
            </>}
        </div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {formData.description || 'Calendar description will appear here...'}
        </p>
        {formData.tags && formData.tags.length > 0 && <div className="mt-3 flex flex-wrap gap-1">
            {formData.tags.slice(0, 3).map((tag, index) => <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                {tag}
              </span>)}
            {formData.tags.length > 3 && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                +{formData.tags.length - 3} more
              </span>}
          </div>}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span className="capitalize">
              {formData.geographicScope || 'Local'}
            </span>
          </div>
          {formData.monetization?.isPaid && <div className="flex items-center text-sm text-gray-500 mt-1">
              <DollarSignIcon className="h-4 w-4 mr-1" />
              <span>${formData.monetization.price || '0.00'}/month</span>
            </div>}
        </div>
      </div>
      {/* Footer */}
      <div className={`px-4 py-3 ${formData.customization?.colorTheme ? getBgColorClass(formData.customization.colorTheme) : 'bg-indigo-600'} ${formData.customization?.colorTheme ? getTextColorClass(formData.customization.colorTheme) : 'text-white'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm">
            <UsersIcon className="h-4 w-4 mr-1 opacity-80" />
            <span className="opacity-90">0 followers</span>
          </div>
          <button className="text-xs font-medium px-2 py-1 rounded-md bg-white/20 hover:bg-white/30">
            Follow
          </button>
        </div>
      </div>
    </div>;
};