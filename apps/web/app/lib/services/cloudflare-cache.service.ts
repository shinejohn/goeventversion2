export class CloudflareCacheService {
  private static readonly API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
  private static readonly ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
  
  /**
   * Purge cache when events are updated
   */
  static async purgeEventCache(communitySlug: string, eventId?: string) {
    if (!this.API_TOKEN || !this.ZONE_ID) {
      console.warn('Cloudflare credentials not configured');
      return;
    }
    
    try {
      // Purge by cache tags
      const tags = [`community-${communitySlug}`];
      if (eventId) {
        tags.push(`event-${eventId}`);
      }
      
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.ZONE_ID}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tags })
        }
      );
      
      if (response.ok) {
        console.log(`✅ Cloudflare cache purged for tags: ${tags.join(', ')}`);
      }
    } catch (error) {
      console.error('Failed to purge Cloudflare cache:', error);
    }
  }
  
  /**
   * Purge cache when venues are updated
   */
  static async purgeVenueCache(communitySlug: string, venueId?: string) {
    if (!this.API_TOKEN || !this.ZONE_ID) {
      console.warn('Cloudflare credentials not configured');
      return;
    }
    
    try {
      const tags = [`community-${communitySlug}`];
      if (venueId) {
        tags.push(`venue-${venueId}`);
      }
      
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.ZONE_ID}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tags })
        }
      );
      
      if (response.ok) {
        console.log(`✅ Cloudflare cache purged for venue tags: ${tags.join(', ')}`);
      }
    } catch (error) {
      console.error('Failed to purge Cloudflare cache:', error);
    }
  }
  
  /**
   * Purge cache for a specific URL
   */
  static async purgeURL(url: string) {
    if (!this.API_TOKEN || !this.ZONE_ID) {
      console.warn('Cloudflare credentials not configured');
      return;
    }
    
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.ZONE_ID}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ files: [url] })
        }
      );
      
      if (response.ok) {
        console.log(`✅ Cloudflare cache purged for URL: ${url}`);
      }
    } catch (error) {
      console.error('Failed to purge Cloudflare cache:', error);
    }
  }
  
  /**
   * Purge everything (use sparingly!)
   */
  static async purgeEverything() {
    if (!this.API_TOKEN || !this.ZONE_ID) {
      console.warn('Cloudflare credentials not configured');
      return;
    }
    
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.ZONE_ID}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ purge_everything: true })
        }
      );
      
      if (response.ok) {
        console.log('✅ Cloudflare cache purged completely');
      }
    } catch (error) {
      console.error('Failed to purge Cloudflare cache:', error);
    }
  }
}

// Use in event creation/update
export async function createEvent(data: CreateEventInput) {
  const event = await supabase.from('events').insert(data);
  
  // Purge Cloudflare cache so new event appears immediately
  await CloudflareCacheService.purgeEventCache(data.communitySlug);
  
  return event;
}