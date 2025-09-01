import { type SupabaseClient } from '@supabase/supabase-js';
import { IPCacheService } from './ip-cache.service';

export interface Location {
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  country?: string;
  accuracy?: 'precise' | 'city' | 'region' | 'country' | 'default';
}

export class GeolocationService {
  private static readonly DEFAULT_LOCATION: Location = {
    lat: 27.9506,  // Default to Clearwater, FL
    lng: -82.4572,
    city: 'Clearwater',
    state: 'FL',
    country: 'US',
    accuracy: 'default'
  };

  /**
   * Detect user location using Cloudflare + Railway
   */
  static async detectUserLocation(request: Request): Promise<Location> {
    // Strategy 1: Check for saved user preference
    const savedLocation = this.getSavedLocation(request);
    if (savedLocation) {
      return { ...savedLocation, accuracy: 'precise' };
    }

    // Strategy 2: Use Cloudflare's geo headers (BEST - no API calls needed!)
    const cfLocation = this.getCloudflareLocation(request);
    if (cfLocation) {
      console.log('🌍 Using Cloudflare geo data - no API call needed!');
      return { ...cfLocation, accuracy: 'city' };
    }

    // Strategy 3: Fallback to IP geolocation if CF headers missing
    const ipLocation = await this.getIPLocation(request);
    if (ipLocation) {
      return { ...ipLocation, accuracy: 'city' };
    }

    // Strategy 4: Default location
    return this.DEFAULT_LOCATION;
  }

  /**
   * Get saved location from cookie
   */
  private static getSavedLocation(request: Request): Location | null {
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) return null;

    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(c => c.split('=').map(v => decodeURIComponent(v)))
    );
    
    if (cookies.wtf_location) {
      try {
        return JSON.parse(cookies.wtf_location);
      } catch (e) {
        console.error('Failed to parse location cookie:', e);
        return null;
      }
    }
    
    return null;
  }

  /**
   * Get location using IP geolocation service
   * Railway provides real client IPs via X-Forwarded-For header
   */
  private static async getIPLocation(request: Request): Promise<Location | null> {
    try {
      // Get client IP - prefer Cloudflare, fallback to Railway
      const ip = this.getClientIPFromCloudflare(request) || this.getClientIPFromRailway(request);
      
      if (!ip || ip === '127.0.0.1' || ip === '::1') {
        console.log('⚠️ Local IP detected, skipping geolocation');
        return null;
      }

      // Check cache first
      const cached = await IPCacheService.getCachedLocation(ip);
      if (cached) {
        return cached;
      }

      console.log(`🔍 Looking up location for IP: ${ip}`);

      // Perform IP lookup
      const location = await this.performIPLookup(ip);
      
      // Cache the result
      if (location) {
        await IPCacheService.cacheLocation(ip, location);
      }
      
      return location;
    } catch (error) {
      console.error('IP geolocation failed:', error);
      return null;
    }
  }

  /**
   * Perform the actual IP lookup using multiple services
   */
  private static async performIPLookup(ip: string): Promise<Location | null> {
    try {
      // Use ipapi.co free tier (1000 requests/day)
      // For production, consider using a paid service
      try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`, {
          headers: {
            'User-Agent': 'whensthefun/1.0',
          },
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Check for error response
          if (data.error) {
            console.error('IP API error:', data.reason);
            return null;
          }
          
          return {
            lat: data.latitude,
            lng: data.longitude,
            city: data.city,
            state: data.region_code || data.region,
            country: data.country_code || 'US'
          };
        }
      } catch (error) {
        console.error('Primary IP service failed, trying fallback:', error);
        
        // Fallback to ip-api.com (150 requests/minute)
        try {
          const fallbackResponse = await fetch(
            `http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,lat,lon`,
            { signal: AbortSignal.timeout(2000) }
          );
          
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json();
            
            if (data.status === 'success') {
              return {
                lat: data.lat,
                lng: data.lon,
                city: data.city,
                state: data.region,
                country: data.countryCode || 'US'
              };
            }
          }
        } catch (fallbackError) {
          console.error('Fallback IP service also failed:', fallbackError);
        }
      }
    } catch (error) {
      console.error('IP lookup failed:', error);
    }
    
    return null;
  }

  /**
   * Get location from Cloudflare headers (FREE and INSTANT!)
   * These are automatically added by Cloudflare
   */
  private static getCloudflareLocation(request: Request): Location | null {
    const headers = request.headers;
    
    // Cloudflare provides these headers for FREE on all plans
    const country = headers.get('CF-IPCountry');
    const city = headers.get('CF-IPCity');           // Enterprise plan only
    const region = headers.get('CF-Region');         // Enterprise plan only
    const lat = headers.get('CF-IPLatitude');        // Enterprise plan only
    const lng = headers.get('CF-IPLongitude');       // Enterprise plan only
    const postalCode = headers.get('CF-PostalCode'); // Enterprise plan only
    
    // If we have lat/lng (Enterprise), use it
    if (lat && lng) {
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        city: city || undefined,
        state: region || undefined,
        country: country || 'US'
      };
    }
    
    // For Free/Pro/Business plans, we get country and need to look up city
    // But we can use CF-Connecting-IP for more accurate IP lookup
    if (country) {
      // We at least know the country, can combine with IP lookup
      console.log(`📍 Cloudflare detected country: ${country}`);
      
      // Get the real IP from Cloudflare
      const realIP = headers.get('CF-Connecting-IP');
      if (realIP) {
        // Store for IP lookup with country hint
        request.headers.set('X-Real-Country', country);
      }
    }
    
    return null;
  }

  /**
   * Get client IP - Cloudflare version
   */
  private static getClientIPFromCloudflare(request: Request): string | null {
    const headers = request.headers;
    
    // CF-Connecting-IP is the REAL client IP from Cloudflare
    const cfIP = headers.get('CF-Connecting-IP');
    if (cfIP && this.isValidIP(cfIP)) {
      return cfIP;
    }
    
    // Fallback to Railway's X-Forwarded-For
    const forwardedFor = headers.get('X-Forwarded-For');
    if (forwardedFor) {
      const ips = forwardedFor.split(',').map(ip => ip.trim());
      const clientIP = ips[0];
      if (this.isValidIP(clientIP)) {
        return clientIP;
      }
    }
    
    return null;
  }

  /**
   * Get client IP from Railway's headers
   * Railway uses standard X-Forwarded-For header
   */
  private static getClientIPFromRailway(request: Request): string | null {
    const headers = request.headers;
    
    // Railway provides client IP in X-Forwarded-For
    const forwardedFor = headers.get('X-Forwarded-For');
    if (forwardedFor) {
      // X-Forwarded-For can contain multiple IPs: "client, proxy1, proxy2"
      // The first IP is the original client
      const ips = forwardedFor.split(',').map(ip => ip.trim());
      const clientIP = ips[0];
      
      if (this.isValidIP(clientIP)) {
        return clientIP;
      }
    }
    
    // Fallback to other possible headers
    const realIP = headers.get('X-Real-IP');
    if (realIP && this.isValidIP(realIP)) {
      return realIP;
    }
    
    return null;
  }

  /**
   * Validate IP address
   */
  private static isValidIP(ip: string): boolean {
    // IPv4 validation
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipv4Regex.test(ip)) {
      const parts = ip.split('.');
      return parts.every(part => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
      });
    }
    
    // Basic IPv6 validation
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    return ipv6Regex.test(ip);
  }

  /**
   * Infer rough location from timezone
   * This requires the client to send a X-Timezone header
   */
  private static getTimezoneLocation(request: Request): Location | null {
    const timezone = request.headers.get('X-Timezone');
    
    if (timezone) {
      // Map common US timezones to rough locations
      const timezoneMap: Record<string, Location> = {
        'America/New_York': { lat: 40.7128, lng: -74.0060, city: 'New York', state: 'NY', country: 'US' },
        'America/Chicago': { lat: 41.8781, lng: -87.6298, city: 'Chicago', state: 'IL', country: 'US' },
        'America/Denver': { lat: 39.7392, lng: -104.9903, city: 'Denver', state: 'CO', country: 'US' },
        'America/Los_Angeles': { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', state: 'CA', country: 'US' },
        'America/Phoenix': { lat: 33.4484, lng: -112.0740, city: 'Phoenix', state: 'AZ', country: 'US' },
        'America/Detroit': { lat: 42.3314, lng: -83.0458, city: 'Detroit', state: 'MI', country: 'US' },
        'America/Indiana/Indianapolis': { lat: 39.7684, lng: -86.1581, city: 'Indianapolis', state: 'IN', country: 'US' },
        'America/Kentucky/Louisville': { lat: 38.2527, lng: -85.7585, city: 'Louisville', state: 'KY', country: 'US' },
        'America/Anchorage': { lat: 61.2181, lng: -149.9003, city: 'Anchorage', state: 'AK', country: 'US' },
        'Pacific/Honolulu': { lat: 21.3099, lng: -157.8581, city: 'Honolulu', state: 'HI', country: 'US' },
      };

      return timezoneMap[timezone] || null;
    }

    return null;
  }

  /**
   * Save location preference as a cookie
   */
  static createLocationCookie(location: Location): string {
    const value = encodeURIComponent(JSON.stringify({
      lat: location.lat,
      lng: location.lng,
      city: location.city,
      state: location.state,
      country: location.country
    }));
    
    // Cookie expires in 30 days
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    
    return `wtf_location=${value}; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax; Secure`;
  }

  /**
   * Find nearest community based on location using PostGIS
   */
  static async findNearestCommunity(
    location: Location,
    supabase: SupabaseClient
  ): Promise<string> {
    try {
      console.log(`🔍 Finding nearest community to ${location.city || 'location'}`);
      
      // First try exact city match
      if (location.city && location.state) {
        const { data: exactMatch } = await supabase
          .from('communities')
          .select('slug')
          .ilike('city', location.city)
          .eq('state', location.state)
          .single();
          
        if (exactMatch) {
          console.log(`✅ Exact match found: ${exactMatch.slug}`);
          return exactMatch.slug;
        }
      }
      
      // Use PostGIS to find nearest community
      const { data, error } = await supabase.rpc('find_nearest_community', {
        lat: location.lat,
        lng: location.lng,
        max_distance_miles: 100 // Start with 100 mile radius
      });

      if (error) {
        console.error('PostGIS query error:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log(`📍 Nearest community: ${data[0].slug} (${Math.round(data[0].distance_miles)} miles away)`);
        return data[0].slug;
      }

      // If no community within 100 miles, expand search to 300 miles
      const { data: widerData } = await supabase.rpc('find_nearest_community', {
        lat: location.lat,
        lng: location.lng,
        max_distance_miles: 300
      });

      if (widerData && widerData.length > 0) {
        console.log(`🌐 Nearest major community: ${widerData[0].slug} (${Math.round(widerData[0].distance_miles)} miles away)`);
        return widerData[0].slug;
      }

      // Default fallback
      console.log('📌 Using default community: clearwater');
      return 'clearwater';
      
    } catch (error) {
      console.error('Error finding nearest community:', error);
      return 'clearwater'; // Safe fallback
    }
  }
}