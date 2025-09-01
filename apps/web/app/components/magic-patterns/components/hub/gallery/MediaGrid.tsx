import React from 'react';
import { MediaItem } from './MediaItem';
type MediaGridProps = {
  mediaItems: any[];
  viewMode: 'grid' | 'masonry';
  onOpenLightbox: (mediaItem: any) => void;
  onLike: (mediaId: string) => void;
};
export const MediaGrid = ({
  mediaItems,
  viewMode,
  onOpenLightbox,
  onLike
}: MediaGridProps) => {
  // For masonry layout, split items into columns
  const createColumns = (items: any[], columnCount: number) => {
    const columns: any[][] = Array.from({
      length: columnCount
    }, () => []);
    // Sort items by type to group them better visually
    const sortedItems = [...items].sort((a, b) => {
      if (a.type === b.type) return 0;
      if (a.type === 'image') return -1;
      if (b.type === 'image') return 1;
      if (a.type === 'video') return -1;
      if (b.type === 'video') return 1;
      return 0;
    });
    // Distribute items across columns
    sortedItems.forEach((item, index) => {
      columns[index % columnCount].push(item);
    });
    return columns;
  };
  // Determine column count based on screen size
  const getColumnCount = () => {
    // This is a simplified approach - in a real app, you might want to use a resize observer
    // or media queries to determine the column count dynamically
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 768) return 2;
    return 3;
  };
  if (viewMode === 'masonry') {
    const columnCount = getColumnCount();
    const columns = createColumns(mediaItems, columnCount);
    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map((column, columnIndex) => <div key={columnIndex} className="flex flex-col space-y-4">
            {column.map((item: any) => <MediaItem key={item.id} media={item} onClick={() => onOpenLightbox(item)} onLike={() => onLike(item.id)} />)}
          </div>)}
      </div>;
  }
  // Grid view
  return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mediaItems.map(item => <MediaItem key={item.id} media={item} onClick={() => onOpenLightbox(item)} onLike={() => onLike(item.id)} />)}
    </div>;
};