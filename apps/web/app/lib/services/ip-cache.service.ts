import { type Location } from './geolocation.service';

/**
 * Simple in-memory cache for IP geolocation results
 * In production, consider using Redis or another caching solution
 */
export class IPCacheService {
  private static cache = new Map<string, { location: Location; expires: number }>();
  private static readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get cached location for an IP
   */
  static async getCachedLocation(ip: string): Promise<Location | null> {
    const cached = this.cache.get(ip);
    
    if (!cached) {
      return null;
    }
    
    // Check if cache is expired
    if (Date.now() > cached.expires) {
      this.cache.delete(ip);
      return null;
    }
    
    console.log(`📦 Using cached location for IP: ${ip}`);
    return cached.location;
  }
  
  /**
   * Cache a location for an IP
   */
  static async cacheLocation(ip: string, location: Location): Promise<void> {
    this.cache.set(ip, {
      location,
      expires: Date.now() + this.CACHE_TTL
    });
    
    // Clean up old entries periodically
    if (this.cache.size > 1000) {
      this.cleanupExpiredEntries();
    }
  }
  
  /**
   * Clean up expired entries
   */
  private static cleanupExpiredEntries(): void {
    const now = Date.now();
    
    for (const [ip, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(ip);
      }
    }
  }
  
  /**
   * Clear all cached entries
   */
  static clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache statistics
   */
  static getStats(): { size: number; hits: number; misses: number } {
    return {
      size: this.cache.size,
      hits: 0, // Would need to track this
      misses: 0 // Would need to track this
    };
  }
}