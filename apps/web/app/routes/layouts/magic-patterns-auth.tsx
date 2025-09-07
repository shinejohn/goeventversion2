import React from 'react';
import { Outlet, Link } from 'react-router';

/**
 * Magic Patterns Auth Layout
 * Minimal, centered layout for authentication pages
 * Preserves the Vite/Magic Patterns design system
 */
export default function MagicPatternsAuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Simple header with logo only */}
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link to="/" className="inline-flex">
            <img 
              src="/logo.svg" 
              alt="When The Fun" 
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </div>
      
      {/* Centered content area */}
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      
      {/* Simple footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} When The Fun. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/terms-of-service" className="text-sm text-gray-500 hover:text-gray-900">
                Terms
              </Link>
              <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-gray-900">
                Privacy
              </Link>
              <Link to="/help" className="text-sm text-gray-500 hover:text-gray-900">
                Help
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}