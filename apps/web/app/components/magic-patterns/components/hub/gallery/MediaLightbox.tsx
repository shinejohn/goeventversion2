import React, { useEffect, useState } from 'react';
import { XIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon, ShareIcon, DownloadIcon, MessageSquareIcon, PlayIcon, PauseIcon, VolumeXIcon, Volume2Icon } from 'lucide-react';
type MediaLightboxProps = {
  mediaItem: any;
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  onLike: () => void;
};
export const MediaLightbox = ({
  mediaItem,
  onClose,
  onNavigate,
  onLike
}: MediaLightboxProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [comment, setComment] = useState('');
  // Format the date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  // Handle key presses for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        onNavigate('next');
      } else if (e.key === 'ArrowLeft') {
        onNavigate('prev');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onNavigate]);
  // Prevent body scrolling while lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  // Toggle play/pause for video or audio
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  // Toggle mute/unmute for video or audio
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  // Handle download
  const handleDownload = () => {
    // In a real app, this would trigger a download of the media file
    alert(`Downloading ${mediaItem.title}`);
  };
  // Handle share
  const handleShare = () => {
    // In a real app, this would open a share dialog
    alert(`Sharing ${mediaItem.title}`);
  };
  // Handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      // In a real app, this would submit the comment to the server
      alert(`Comment submitted: ${comment}`);
      setComment('');
    }
  };
  // Prevent clicks inside the content area from closing the lightbox
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute top-4 right-4 z-10">
        <button className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors" onClick={onClose}>
          <XIcon className="h-6 w-6" />
        </button>
      </div>
      {/* Navigation buttons */}
      <button className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors" onClick={e => {
      e.stopPropagation();
      onNavigate('prev');
    }}>
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors" onClick={e => {
      e.stopPropagation();
      onNavigate('next');
    }}>
        <ChevronRightIcon className="h-6 w-6" />
      </button>
      {/* Main content area */}
      <div className="max-w-6xl w-full max-h-screen flex flex-col lg:flex-row" onClick={handleContentClick}>
        {/* Media display area */}
        <div className="lg:flex-1 flex items-center justify-center p-4 relative">
          {mediaItem.type === 'image' ? <img src={mediaItem.url} alt={mediaItem.title} className="max-h-[70vh] max-w-full object-contain" /> : mediaItem.type === 'video' ? <div className="relative w-full max-w-3xl">
              <div className="aspect-video bg-black flex items-center justify-center" onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
                <img src={mediaItem.thumbnail} alt={mediaItem.title} className="max-h-full max-w-full object-contain" />
                {/* Video controls */}
                {showControls && <div className="absolute inset-0 flex flex-col justify-between p-4">
                    <div className="flex justify-end">
                      <button className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70" onClick={toggleMute}>
                        {isMuted ? <VolumeXIcon className="h-5 w-5" /> : <Volume2Icon className="h-5 w-5" />}
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <button className="p-4 rounded-full bg-black/50 text-white hover:bg-black/70" onClick={togglePlayPause}>
                        {isPlaying ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="h-8 w-8" />}
                      </button>
                    </div>
                    <div className="w-full bg-gray-600 h-1 rounded overflow-hidden">
                      <div className="bg-white h-1 w-1/3"></div>
                    </div>
                  </div>}
              </div>
            </div> : <div className="w-full max-w-md">
              <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center">
                <div className="w-full aspect-square max-w-xs relative bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg mb-4 flex items-center justify-center">
                  <MusicIcon className="h-24 w-24 text-white/70" />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="flex space-x-4 items-center">
                      <button className="p-3 rounded-full bg-white text-gray-800 hover:bg-gray-200" onClick={togglePlayPause}>
                        {isPlaying ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
                      </button>
                      <button className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30" onClick={toggleMute}>
                        {isMuted ? <VolumeXIcon className="h-5 w-5" /> : <Volume2Icon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white h-1.5 w-1/4"></div>
                </div>
                <div className="w-full flex justify-between text-white/70 text-xs mt-2">
                  <span>0:45</span>
                  <span>{mediaItem.duration}</span>
                </div>
              </div>
            </div>}
        </div>
        {/* Info sidebar */}
        <div className="lg:w-80 bg-white p-4 overflow-y-auto max-h-[70vh] lg:max-h-screen">
          <h2 className="text-xl font-bold text-gray-900">{mediaItem.title}</h2>
          <div className="flex items-center mt-4">
            <img src={mediaItem.contributor.avatar} alt={mediaItem.contributor.name} className="h-10 w-10 rounded-full mr-3" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {mediaItem.contributor.name}
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(mediaItem.uploadedAt)}
              </div>
            </div>
          </div>
          {mediaItem.description && <p className="mt-4 text-sm text-gray-600">
              {mediaItem.description}
            </p>}
          {mediaItem.event && <div className="mt-4">
              <span className="text-xs font-medium text-gray-500">Event</span>
              <div className="text-sm font-medium text-indigo-600">
                {mediaItem.event}
              </div>
            </div>}
          {/* Tags */}
          {mediaItem.tags && mediaItem.tags.length > 0 && <div className="mt-4">
              <span className="text-xs font-medium text-gray-500">Tags</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {mediaItem.tags.map((tag: string, index: number) => <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    {tag}
                  </span>)}
              </div>
            </div>}
          {/* Actions */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <button className={`flex items-center ${mediaItem.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`} onClick={e => {
            e.stopPropagation();
            onLike();
          }}>
              <HeartIcon className="h-5 w-5 mr-1" />
              <span>{mediaItem.likes}</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-gray-700" onClick={handleShare}>
              <ShareIcon className="h-5 w-5 mr-1" />
              <span>Share</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-gray-700" onClick={handleDownload}>
              <DownloadIcon className="h-5 w-5 mr-1" />
              <span>Download</span>
            </button>
          </div>
          {/* Comments section */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 flex items-center">
              <MessageSquareIcon className="h-4 w-4 mr-1" />
              Comments ({mediaItem.comments})
            </h3>
            <form onSubmit={handleCommentSubmit} className="mt-3">
              <div className="flex">
                <input type="text" placeholder="Add a comment..." className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={comment} onChange={e => setComment(e.target.value)} />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700" disabled={!comment.trim()}>
                  Post
                </button>
              </div>
            </form>
            {/* Sample comments */}
            <div className="mt-4 space-y-4">
              <div className="flex">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Commenter" className="h-8 w-8 rounded-full mr-2" />
                <div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      Jane Smith
                    </span>
                    <span className="text-gray-500 text-xs ml-2">
                      2 days ago
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Great shot! Love the composition.
                  </p>
                </div>
              </div>
              <div className="flex">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Commenter" className="h-8 w-8 rounded-full mr-2" />
                <div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">John Doe</span>
                    <span className="text-gray-500 text-xs ml-2">
                      1 week ago
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    This is amazing! Where was this taken?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
// Add the missing MusicIcon component
function MusicIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>;
}