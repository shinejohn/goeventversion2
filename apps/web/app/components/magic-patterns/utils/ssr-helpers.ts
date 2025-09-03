/**
 * SSR Helper Utilities
 * 
 * Safe wrappers for browser-only APIs
 */

export const isBrowser = () => typeof window !== 'undefined';

export const isServer = () => typeof window === 'undefined';

export const safeWindow = () => {
  if (isBrowser()) {
    return window;
  }
  return undefined;
};

export const safeDocument = () => {
  if (isBrowser()) {
    return document;
  }
  return undefined;
};

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (isBrowser() && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (isBrowser() && window.localStorage) {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (isBrowser() && window.localStorage) {
      localStorage.removeItem(key);
    }
  },
  clear: (): void => {
    if (isBrowser() && window.localStorage) {
      localStorage.clear();
    }
  }
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (isBrowser() && window.sessionStorage) {
      return sessionStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (isBrowser() && window.sessionStorage) {
      sessionStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (isBrowser() && window.sessionStorage) {
      sessionStorage.removeItem(key);
    }
  },
  clear: (): void => {
    if (isBrowser() && window.sessionStorage) {
      sessionStorage.clear();
    }
  }
};

export const safeNavigator = () => {
  if (isBrowser()) {
    return navigator;
  }
  return undefined;
};

// Safe wrapper for window.location
export const safeLocation = () => {
  if (isBrowser()) {
    return window.location;
  }
  return {
    href: '',
    origin: '',
    pathname: '',
    search: '',
    hash: ''
  };
};

// Toast notification to replace alert
export const showToast = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
  if (isBrowser()) {
    // This should be replaced with your actual toast implementation
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
};

// Modal confirm to replace window.confirm
export const showConfirm = async (message: string): Promise<boolean> => {
  if (isBrowser()) {
    // This should be replaced with your actual modal implementation
    return window.confirm(message);
  }
  return false;
};

// Modal prompt to replace window.prompt
export const showPrompt = async (message: string, defaultValue?: string): Promise<string | null> => {
  if (isBrowser()) {
    // This should be replaced with your actual modal implementation
    return window.prompt(message, defaultValue);
  }
  return null;
};
