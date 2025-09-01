import { useEffect } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (element: string, options: TurnstileOptions) => void;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileOptions {
  sitekey: string;
  callback: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
  language?: string;
  appearance?: 'always' | 'execute' | 'interaction-only';
}

export function TurnstileWidget({ onVerify }: { onVerify: (token: string) => void }) {
  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      window.turnstile?.render('#turnstile-widget', {
        sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
        callback: onVerify,
        theme: 'light',
        size: 'normal'
      });
    };
    
    return () => {
      document.body.removeChild(script);
    };
  }, [onVerify]);
  
  return <div id="turnstile-widget" />;
}