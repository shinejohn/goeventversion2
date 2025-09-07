'use client';

import { useState } from 'react';
import { cn } from '@kit/ui/cn';
import { getDefaultEventImage, getDefaultPerformerImage, getDefaultVenueImage } from '@kit/shared/constants/default-images';

interface EntityImageProps {
  src?: string | null;
  alt: string;
  entityType: 'event' | 'venue' | 'performer';
  entityCategory?: string | null;
  className?: string;
  width?: number;
  height?: number;
}

export function EntityImage({
  src,
  alt,
  entityType,
  entityCategory,
  className,
  width = 800,
  height = 600,
}: EntityImageProps) {
  const [error, setError] = useState(false);

  // Get the appropriate default image based on entity type and category
  const getDefaultImage = () => {
    switch (entityType) {
      case 'event':
        return getDefaultEventImage(entityCategory);
      case 'venue':
        return getDefaultVenueImage(entityCategory);
      case 'performer':
        return getDefaultPerformerImage(entityCategory);
      default:
        return getDefaultEventImage(null);
    }
  };

  // Use default image if no src provided or on error
  const imageSrc = (!src || error) ? getDefaultImage() : src;

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={cn('object-cover', className)}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}