export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // If already has a community path, pass through
    if (url.pathname.startsWith('/c/')) {
      return fetch(request);
    }
    
    // Get Cloudflare's geo data
    const country = request.cf?.country || 'US';
    const city = request.cf?.city || null;
    const region = request.cf?.region || null;
    const latitude = request.cf?.latitude || null;
    const longitude = request.cf?.longitude || null;
    const timezone = request.cf?.timezone || 'America/New_York';
    
    // Quick community mapping at the edge
    const communitySlug = await getCommunitySlug(
      { country, city, region, latitude, longitude },
      env
    );
    
    // Redirect to community calendar
    if (url.pathname === '/') {
      return Response.redirect(`${url.origin}/c/${communitySlug}`, 302);
    }
    
    // Add geo headers for the app
    const modifiedRequest = new Request(request);
    modifiedRequest.headers.set('CF-Detected-Country', country);
    modifiedRequest.headers.set('CF-Detected-City', city || '');
    modifiedRequest.headers.set('CF-Detected-Region', region || '');
    modifiedRequest.headers.set('CF-Timezone', timezone);
    
    return fetch(modifiedRequest);
  }
};

async function getCommunitySlug(geo, env) {
  // Use Cloudflare KV for ultra-fast community lookups
  const cacheKey = `${geo.city}-${geo.region}-${geo.country}`;
  
  // Check KV cache
  const cached = await env.COMMUNITY_KV.get(cacheKey);
  if (cached) return cached;
  
  // Map major cities directly at edge
  const cityMap = {
    'New York': 'nyc',
    'Los Angeles': 'los-angeles',
    'Chicago': 'chicago',
    'Houston': 'houston',
    'Phoenix': 'phoenix',
    'Philadelphia': 'philadelphia',
    'San Antonio': 'san-antonio',
    'San Diego': 'san-diego',
    'Dallas': 'dallas',
    'Miami': 'miami',
    'Tampa': 'tampa',
    'Clearwater': 'clearwater',
    // Add more cities
  };
  
  const slug = cityMap[geo.city] || 'clearwater';
  
  // Cache for next time
  await env.COMMUNITY_KV.put(cacheKey, slug, { expirationTtl: 86400 });
  
  return slug;
}