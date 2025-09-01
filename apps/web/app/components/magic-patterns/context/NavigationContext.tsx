import React, { useCallback, useEffect, useState, createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
type NavigationContextType = {
  navigateTo: (path: string) => void;
  currentPath: string;
  error: Error | null;
};
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);
export const NavigationProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    // Ensure the context is properly initialized
    try {
      setCurrentPath(location.pathname);
      setIsInitialized(true);
    } catch (error) {
      console.error('Navigation initialization error:', error);
      setError(error instanceof Error ? error : new Error('Initialization failed'));
    }
  }, [location]);
  const navigateTo = useCallback((path: string) => {
    if (!isInitialized) {
      console.warn('Navigation attempted before initialization');
      return;
    }
    try {
      setError(null);
      // Handle external URLs
      if (path.startsWith('http')) {
        window.location.href = path;
        return;
      }
      // Handle internal navigation
      navigate(path);
      setCurrentPath(path);
    } catch (error) {
      console.error('Navigation error:', error);
      setError(error instanceof Error ? error : new Error('Navigation failed'));
      // Attempt fallback navigation
      try {
        window.location.href = path;
      } catch (fallbackError) {
        console.error('Fallback navigation failed:', fallbackError);
        setError(fallbackError instanceof Error ? fallbackError : new Error('Navigation failed'));
      }
    }
  }, [navigate, isInitialized]);
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Initializing navigation...</div>
      </div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Navigation error: {error.message}</div>
      </div>;
  }
  return <NavigationContext.Provider value={{
    navigateTo,
    currentPath,
    error
  }}>
      {children}
    </NavigationContext.Provider>;
};
export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};