/**
 * Default images by entity type
 * Uses Unsplash images for high-quality defaults
 */

export const DEFAULT_IMAGES = {
  venues: {
    theater: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&h=600&fit=crop',
    'concert-hall': 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
    'event-space': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
    'convention-center': 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop',
    restaurant: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop',
    bar: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
    club: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop',
    'outdoor-venue': 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop',
    stadium: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop',
    park: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&h=600&fit=crop',
    gallery: 'https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?w=800&h=600&fit=crop',
    default: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop'
  },
  
  performers: {
    band: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    'solo-artist': 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&h=600&fit=crop',
    dj: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&h=600&fit=crop',
    comedian: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=600&fit=crop',
    speaker: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
    magician: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop',
    dancer: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&h=600&fit=crop',
    theater: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop',
    orchestra: 'https://images.unsplash.com/photo-1519683109079-d5f539e1542f?w=800&h=600&fit=crop',
    choir: 'https://images.unsplash.com/photo-1519683384663-1a0dec35ea18?w=800&h=600&fit=crop',
    default: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop'
  },
  
  events: {
    music: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop',
    concert: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
    festival: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
    comedy: 'https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800&h=600&fit=crop',
    theater: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=600&fit=crop',
    'food-drink': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    sports: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&h=600&fit=crop',
    conference: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    workshop: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop',
    'art-exhibition': 'https://images.unsplash.com/photo-1536924430914-91f9e2041b83?w=800&h=600&fit=crop',
    film: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&h=600&fit=crop',
    networking: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop',
    charity: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop',
    community: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
    default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop'
  }
};

/**
 * Get default image for a venue type
 */
export function getDefaultVenueImage(venueType?: string | null): string {
  if (!venueType) return DEFAULT_IMAGES.venues.default;
  
  const normalizedType = venueType.toLowerCase().replace(/\s+/g, '-');
  return DEFAULT_IMAGES.venues[normalizedType as keyof typeof DEFAULT_IMAGES.venues] || DEFAULT_IMAGES.venues.default;
}

/**
 * Get default image for a performer category
 */
export function getDefaultPerformerImage(category?: string | null): string {
  if (!category) return DEFAULT_IMAGES.performers.default;
  
  const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
  return DEFAULT_IMAGES.performers[normalizedCategory as keyof typeof DEFAULT_IMAGES.performers] || DEFAULT_IMAGES.performers.default;
}

/**
 * Get default image for an event category
 */
export function getDefaultEventImage(category?: string | null): string {
  if (!category) return DEFAULT_IMAGES.events.default;
  
  const normalizedCategory = category.toLowerCase().replace(/[&]/g, '').replace(/\s+/g, '-');
  return DEFAULT_IMAGES.events[normalizedCategory as keyof typeof DEFAULT_IMAGES.events] || DEFAULT_IMAGES.events.default;
}