import React, { useState, Component } from 'react';
import { XIcon, CopyIcon, FacebookIcon, TwitterIcon, LinkedinIcon, MailIcon, CheckIcon } from 'lucide-react';
type SharePopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  url: string;
  image?: string;
};
export const SharePopup: React.FC<SharePopupProps> = ({
  isOpen,
  onClose,
  title,
  description,
  url,
  image
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const shareOptions = [{
    name: 'Facebook',
    icon: <FacebookIcon className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-600',
    onClick: () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank');
    }
  }, {
    name: 'Twitter',
    icon: <TwitterIcon className="h-5 w-5" />,
    color: 'bg-sky-100 text-sky-600',
    onClick: () => {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    }
  }, {
    name: 'LinkedIn',
    icon: <LinkedinIcon className="h-5 w-5" />,
    color: 'bg-blue-100 text-blue-800',
    onClick: () => {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    }
  }, {
    name: 'Email',
    icon: <MailIcon className="h-5 w-5" />,
    color: 'bg-gray-100 text-gray-600',
    onClick: () => {
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`;
    }
  }];
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Share Event</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        {image && <div className="mb-4">
            <img src={image} alt={title} className="w-full h-32 object-cover rounded" />
          </div>}
        <h4 className="font-medium mb-1">{title}</h4>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="mb-4">
          <div className="relative">
            <input type="text" value={url} readOnly className="w-full pr-10 py-2 pl-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
            <button onClick={handleCopyLink} className="absolute inset-y-0 right-0 px-3 flex items-center" title="Copy to clipboard">
              {copied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <CopyIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {shareOptions.map(option => <button key={option.name} onClick={option.onClick} className={`flex flex-col items-center justify-center p-3 rounded-lg ${option.color} hover:opacity-90 transition-opacity`}>
              {option.icon}
              <span className="text-xs mt-1">{option.name}</span>
            </button>)}
        </div>
      </div>
    </div>;
};