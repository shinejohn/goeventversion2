'use client';

import { useState } from 'react';
import { cn } from '@kit/ui/cn';

// Default images for different entity types
const DEFAULT_IMAGES = {
  event: {
    default: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    concert: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    theater: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    conference: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    festival: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    comedy: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    workshop: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    art: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    music: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    outdoor: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    charity: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    family: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    business: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    meeting: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    educational: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    networking: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  venue: {
    default: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    theater: 'https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    arena: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    club: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    bar: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    coffeeshop: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    gallery: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    museum: 'https://images.unsplash.com/photo-1554168245-2827f82b8bf1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    park: 'https://images.unsplash.com/photo-1567283613516-30ee12c1c5b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    stadium: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    convention: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    community: 'https://images.unsplash.com/photo-1555545873-f7f0d2c67e7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    outdoor: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  performer: {
    default: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    musician: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    band: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    dj: 'https://images.unsplash.com/photo-1571266028243-d220c6a8d85f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    comedian: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    dancer: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    magician: 'https://images.unsplash.com/photo-1598411072028-c4642d98352c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    theater: 'https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    speaker: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    artist: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  user: {
    default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  organization: {
    default: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
} as const;

type EntityType = keyof typeof DEFAULT_IMAGES;
type EntityCategory<T extends EntityType> = keyof typeof DEFAULT_IMAGES[T];

function getDefaultImage<T extends EntityType>(
  entityType: T,
  category?: string
): string {
  const entityDefaults = DEFAULT_IMAGES[entityType];
  
  if (!entityDefaults) {
    return DEFAULT_IMAGES.event.default; // fallback to event default
  }

  if (category && category in entityDefaults) {
    return entityDefaults[category as EntityCategory<T>];
  }

  return entityDefaults.default;
}

interface EntityImageProps {
  src?: string | null;
  alt: string;
  entityType: EntityType;
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

  // Use default image if no src provided or on error
  const imageSrc = (!src || error) ? getDefaultImage(entityType, entityCategory || undefined) : src;

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