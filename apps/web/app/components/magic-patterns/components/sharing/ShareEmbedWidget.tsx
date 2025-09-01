import React, { useEffect, useState, useRef, createElement, Component } from 'react';
import { FacebookIcon, TwitterIcon, LinkedinIcon, InstagramIcon, MailIcon, LinkIcon, CopyIcon, CheckIcon, XIcon, CodeIcon, DownloadIcon, ChevronDownIcon, ExternalLinkIcon } from 'lucide-react';
type ShareEmbedWidgetProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'event' | 'calendar' | 'venue' | 'performer' | 'article';
  position?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  embedOptions?: {
    width?: number;
    height?: number;
    showHeader?: boolean;
    showFooter?: boolean;
    theme?: 'light' | 'dark';
  };
};
export const ShareEmbedWidget = ({
  isOpen,
  onClose,
  title,
  description,
  url,
  image,
  type = 'event',
  position,
  embedOptions = {
    width: 600,
    height: 450,
    showHeader: true,
    showFooter: true,
    theme: 'light'
  }
}: ShareEmbedWidgetProps) => {
  const [activeTab, setActiveTab] = useState<'share' | 'embed' | 'qr'>('share');
  const [copied, setCopied] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [embedSettings, setEmbedSettings] = useState(embedOptions);
  const [showEmbedSettings, setShowEmbedSettings] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  // Generate a simple QR code placeholder to avoid external API dependency
  const generateQRCodeDataURL = (data: string) => {
    try {
      const size = 200;
      const svg = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${size}" height="${size}" fill="white" stroke="#000" stroke-width="2"/>
          <rect x="20" y="20" width="20" height="20" fill="black"/>
          <rect x="50" y="20" width="20" height="20" fill="black"/>
          <rect x="80" y="20" width="20" height="20" fill="black"/>
          <rect x="110" y="20" width="20" height="20" fill="black"/>
          <rect x="140" y="20" width="20" height="20" fill="black"/>
          <rect x="170" y="20" width="10" height="20" fill="black"/>
          <text x="${size / 2}" y="${size - 10}" text-anchor="middle" font-family="Arial" font-size="8" fill="black">QR Code</text>
        </svg>
      `;
      // Safe base64 encoding with fallback
      try {
        return `data:image/svg+xml;base64,${btoa(svg)}`;
      } catch (btoa_error) {
        console.warn('btoa encoding failed, using URI encoding:', btoa_error);
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      }
    } catch (error) {
      console.error('QR code generation error:', error);
      // Return a simple fallback
      return 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="100" y="100" text-anchor="middle" font-family="Arial" font-size="14" fill="%236b7280"%3EQR Code%3C/text%3E%3C/svg%3E';
    }
  };
  // Generate QR code and embed code when component mounts or when url changes
  useEffect(() => {
    try {
      // Generate QR code placeholder instead of using external API
      const qrUrl = generateQRCodeDataURL(url || '');
      setQrCodeUrl(qrUrl);
      // Generate embed code
      updateEmbedCode();
    } catch (error) {
      console.error('Error generating QR code or embed code:', error);
      // Fallback to simple data URL
      setQrCodeUrl('data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ctext x="100" y="100" text-anchor="middle" font-family="Arial" font-size="14" fill="%236b7280"%3EQR Code%3C/text%3E%3C/svg%3E');
    }
  }, [url, embedSettings]);
  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  // Update embed code when settings change
  const updateEmbedCode = () => {
    const {
      width,
      height,
      showHeader,
      showFooter,
      theme
    } = embedSettings;
    const code = `<iframe
  src="${url}?embed=true&header=${showHeader ? '1' : '0'}&footer=${showFooter ? '1' : '0'}&theme=${theme}"
  width="${width}"
  height="${height}"
  style="border: 1px solid #e5e7eb; border-radius: 8px;"
  title="${title}"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>`;
    setEmbedCode(code);
  };
  // Handle copy link to clipboard with error handling
  const copyToClipboard = (text: string, type: 'link' | 'embed' = 'link') => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(error => {
          console.error('Clipboard API failed:', error);
          fallbackCopyToClipboard(text);
        });
      } else {
        fallbackCopyToClipboard(text);
      }
    } catch (error) {
      console.error('Copy to clipboard error:', error);
      fallbackCopyToClipboard(text);
    }
  };
  // Fallback copy method
  const fallbackCopyToClipboard = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Fallback copy failed:', error);
    }
  };
  // Handle download QR code with error handling
  const downloadQrCode = () => {
    try {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${(title || 'qr-code').replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download QR code error:', error);
    }
  };
  // Handle email share
  const shareViaEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${description}\n\nCheck it out: ${url}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };
  // Social media share functions
  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
  };
  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`);
  };
  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
  };
  const shareToInstagram = () => {
    // Instagram doesn't have a direct web share URL, this would typically open the app
    alert('Instagram sharing typically requires the mobile app. Copy the link and share it manually on Instagram.');
  };
  // Update embed settings
  const handleEmbedSettingChange = (setting: string, value: any) => {
    setEmbedSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  if (!isOpen) return null;
  const positionStyles = position || {
    top: 0,
    right: 0
  };
  return <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div ref={widgetRef} className="absolute bg-white rounded-lg shadow-xl w-80 overflow-hidden z-50" style={positionStyles} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">Share {type}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button className={`flex-1 py-3 text-sm font-medium ${activeTab === 'share' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('share')}>
            Share
          </button>
          <button className={`flex-1 py-3 text-sm font-medium ${activeTab === 'embed' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('embed')}>
            Embed
          </button>
          <button className={`flex-1 py-3 text-sm font-medium ${activeTab === 'qr' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('qr')}>
            QR Code
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {/* Share Tab */}
          {activeTab === 'share' && <>
              {/* Preview */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {title}
                </p>
                {image && <img src={image} alt={title} className="w-full h-32 object-cover rounded-md mb-3" />}
              </div>

              {/* Copy Link */}
              <div className="flex items-center mb-4">
                <div className="flex-1 relative">
                  <input type="text" value={url} readOnly className="w-full pr-10 pl-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                  <button onClick={() => copyToClipboard(url)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700" title="Copy to clipboard">
                    {copied ? <CheckIcon className="h-5 w-5 text-green-500" /> : <CopyIcon className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <button onClick={shareToFacebook} className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                  <FacebookIcon className="h-5 w-5" />
                  <span className="text-xs mt-1">Facebook</span>
                </button>
                <button onClick={shareToTwitter} className="flex flex-col items-center justify-center p-3 rounded-lg bg-sky-500 text-white hover:bg-sky-600">
                  <TwitterIcon className="h-5 w-5" />
                  <span className="text-xs mt-1">Twitter</span>
                </button>
                <button onClick={shareToLinkedIn} className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-700 text-white hover:bg-blue-800">
                  <LinkedinIcon className="h-5 w-5" />
                  <span className="text-xs mt-1">LinkedIn</span>
                </button>
                <button onClick={shareToInstagram} className="flex flex-col items-center justify-center p-3 rounded-lg bg-pink-600 text-white hover:bg-pink-700">
                  <InstagramIcon className="h-5 w-5" />
                  <span className="text-xs mt-1">Instagram</span>
                </button>
              </div>

              {/* Email Button */}
              <button onClick={shareViaEmail} className="w-full flex items-center justify-center p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 mb-2">
                <MailIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">Share via Email</span>
              </button>

              {/* Native Share (if available) */}
              {navigator.share && <button onClick={() => {
            navigator.share({
              title,
              text: description,
              url
            }).catch(console.error);
          }} className="w-full flex items-center justify-center p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                  <ExternalLinkIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm">Share using device options</span>
                </button>}
            </>}

          {/* Embed Tab */}
          {activeTab === 'embed' && <>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Embed Code
                  </h4>
                  <button onClick={() => setShowEmbedSettings(!showEmbedSettings)} className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                    Customize
                    <ChevronDownIcon className="h-4 w-4 ml-1" />
                  </button>
                </div>

                {/* Embed Settings */}
                {showEmbedSettings && <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Dimensions
                        </label>
                        <div className="flex space-x-2">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <input type="number" value={embedSettings.width} onChange={e => handleEmbedSettingChange('width', parseInt(e.target.value))} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" min="200" max="1200" />
                              <span className="ml-1 text-xs text-gray-500">
                                px
                              </span>
                            </div>
                            <label className="block text-xs text-gray-500 mt-1">
                              Width
                            </label>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <input type="number" value={embedSettings.height} onChange={e => handleEmbedSettingChange('height', parseInt(e.target.value))} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" min="200" max="1000" />
                              <span className="ml-1 text-xs text-gray-500">
                                px
                              </span>
                            </div>
                            <label className="block text-xs text-gray-500 mt-1">
                              Height
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                          Show Header
                        </label>
                        <button type="button" className={`${embedSettings.showHeader ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-5 w-10 items-center rounded-full`} onClick={() => handleEmbedSettingChange('showHeader', !embedSettings.showHeader)}>
                          <span className={`${embedSettings.showHeader ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                          Show Footer
                        </label>
                        <button type="button" className={`${embedSettings.showFooter ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-5 w-10 items-center rounded-full`} onClick={() => handleEmbedSettingChange('showFooter', !embedSettings.showFooter)}>
                          <span className={`${embedSettings.showFooter ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Theme
                        </label>
                        <select value={embedSettings.theme} onChange={e => handleEmbedSettingChange('theme', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                      </div>
                    </div>
                  </div>}

                {/* Embed Code Display */}
                <div className="relative">
                  <textarea readOnly value={embedCode} rows={5} className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono text-xs p-2" />
                  <button onClick={() => copyToClipboard(embedCode, 'embed')} className="absolute top-2 right-2 p-1 rounded-md bg-white shadow-sm border border-gray-300 text-gray-500 hover:text-gray-700" title="Copy embed code">
                    {copied ? <CheckIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Preview
                </h4>
                <div className="bg-gray-100 rounded-md p-2 flex items-center justify-center border border-gray-200" style={{
              height: '150px'
            }}>
                  <div className="text-center">
                    <CodeIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Embed preview</p>
                  </div>
                </div>
              </div>
            </>}

          {/* QR Code Tab */}
          {activeTab === 'qr' && <>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500 mb-4">
                  Scan this QR code to access this {type} on a mobile device
                </p>
                <div className="bg-white p-2 rounded-md border border-gray-200 inline-block mb-2">
                  <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  This QR code links to: <br />
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 break-all">
                    {url}
                  </a>
                </p>
                <button onClick={downloadQrCode} className="w-full flex items-center justify-center p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                  <DownloadIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm">Download QR Code</span>
                </button>
              </div>
              <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-md">
                <p className="font-medium mb-1">Uses for QR codes:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Print on promotional materials</li>
                  <li>Include in email campaigns</li>
                  <li>Display at physical locations</li>
                  <li>Add to business cards</li>
                </ul>
              </div>
            </>}
        </div>
      </div>
    </div>;
};