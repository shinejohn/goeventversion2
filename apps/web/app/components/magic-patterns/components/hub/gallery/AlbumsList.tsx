import React, { useState, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, FolderIcon } from 'lucide-react';
type AlbumsListProps = {
  albums: any[];
  activeAlbumId: string | null;
  onSelectAlbum: (albumId: string | null) => void;
};
export const AlbumsList = ({
  albums,
  activeAlbumId,
  onSelectAlbum
}: AlbumsListProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  // Handle scrolling the albums list
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const {
      scrollLeft,
      scrollWidth,
      clientWidth
    } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };
  // Scroll left/right
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 300; // Adjust as needed
    const newScrollLeft = direction === 'left' ? scrollContainerRef.current.scrollLeft - scrollAmount : scrollContainerRef.current.scrollLeft + scrollAmount;
    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };
  if (albums.length === 0) return null;
  return <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Albums</h2>
        <button onClick={() => onSelectAlbum(null)} className={`text-sm ${!activeAlbumId ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'}`}>
          View All Media
        </button>
      </div>
      <div className="relative">
        {/* Left scroll button */}
        {showLeftArrow && <button className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md hover:bg-white" onClick={() => scroll('left')}>
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>}
        {/* Albums scroll container */}
        <div ref={scrollContainerRef} className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide" onScroll={handleScroll}>
          {albums.map(album => <div key={album.id} className={`flex-shrink-0 w-48 cursor-pointer group ${activeAlbumId === album.id ? 'ring-2 ring-indigo-500 rounded-lg' : ''}`} onClick={() => onSelectAlbum(album.id)}>
              <div className="relative h-32 rounded-lg overflow-hidden">
                {album.coverImage ? <img src={album.coverImage} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <FolderIcon className="h-12 w-12 text-gray-400" />
                  </div>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="text-white font-medium line-clamp-1">
                    {album.name}
                  </div>
                  <div className="text-white/80 text-xs">
                    {album.mediaCount} items
                  </div>
                </div>
              </div>
            </div>)}
        </div>
        {/* Right scroll button */}
        {showRightArrow && <button className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md hover:bg-white" onClick={() => scroll('right')}>
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>}
      </div>
    </div>;
};