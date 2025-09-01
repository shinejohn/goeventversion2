import { useEffect } from 'react';

export function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Send client timezone to server for better location detection
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Set as cookie for server to read
    document.cookie = `wtf_timezone=${timezone}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Also attempt HTML5 geolocation if user permits (optional)
    if ('geolocation' in navigator) {
      // Don't block on this - it's just for improvement
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: 'precise'
          };
          
          // Save precise location
          document.cookie = `wtf_precise_location=${encodeURIComponent(JSON.stringify(location))}; path=/; max-age=2592000; SameSite=Lax`;
          
          // Optionally reload to use new location
          if (!document.cookie.includes('wtf_location')) {
            window.location.reload();
          }
        },
        (error) => {
          console.log('Geolocation not available:', error.message);
        },
        { 
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 86400000 // Cache for 24 hours
        }
      );
    }
  }, []);
  
  return <>{children}</>;
}