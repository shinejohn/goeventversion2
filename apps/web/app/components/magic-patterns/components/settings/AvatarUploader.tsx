import React, { useState, useRef, Component } from 'react';
/**
 * Component: Avatar Uploader
 * Type: CSR
 * Mockdata: OFF
 * Description: Image upload with crop functionality
 * Components: None
 */
import { CameraIcon, UploadIcon } from 'lucide-react';
type AvatarUploaderProps = {
  currentAvatar: string;
};
export const AvatarUploader = ({
  currentAvatar
}: AvatarUploaderProps) => {
  const [avatar, setAvatar] = useState(currentAvatar);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // In a real implementation, we would show a cropping interface here
    // For this demo, we'll just simulate the upload
    setIsUploading(true);
    // Simulate file upload and processing
    setTimeout(() => {
      // Create a fake URL for demo purposes
      // In a real app, we would upload to a server and get back a URL
      const reader = new FileReader();
      reader.onload = e => {
        setAvatar(e.target?.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }, 1500);
  };
  const handleRemoveAvatar = () => {
    // In a real app, we would call an API to remove the avatar
    setAvatar('');
  };
  return <div>
      <div className="flex items-center">
        <div className="relative">
          <div className={`h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200 ${isUploading ? 'opacity-50' : ''}`} onClick={handleAvatarClick}>
            {avatar ? <img src={avatar} alt="User avatar" className="h-full w-full object-cover" /> : <CameraIcon className="h-8 w-8 text-gray-400" />}
            {isUploading && <div className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>}
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
        <div className="ml-5">
          <button type="button" className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={handleAvatarClick}>
            <UploadIcon className="h-4 w-4 inline mr-1" />
            Change
          </button>
          {avatar && <button type="button" className="ml-3 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={handleRemoveAvatar}>
              Remove
            </button>}
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500">JPG, PNG or GIF. 1MB max.</p>
    </div>;
};