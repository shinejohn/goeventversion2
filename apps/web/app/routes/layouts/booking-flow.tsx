import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { ChevronRight, Calendar, MapPin, Music } from 'lucide-react';
import { cn } from '@kit/ui/utils';

/**
 * Booking Flow Layout
 * Wizard-style layout for booking venues, performers, and creating events
 * Focuses on the core entities: Events, Venues, Performers
 */

interface Step {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const bookingSteps: Step[] = [
  { id: 'event-details', name: 'Event Details', href: '/book/event-details', icon: Calendar },
  { id: 'venue-performer', name: 'Venue & Performer', href: '/book/requirements', icon: MapPin },
  { id: 'services', name: 'Services & Add-ons', href: '/book/services', icon: Music },
  { id: 'payment', name: 'Payment', href: '/book/payment', icon: Calendar },
  { id: 'review', name: 'Review & Submit', href: '/book/review', icon: Calendar },
];

function getStepNumber(pathname: string): number {
  const stepIndex = bookingSteps.findIndex(step => pathname.includes(step.id));
  return stepIndex >= 0 ? stepIndex + 1 : 1;
}

export default function BookingFlowLayout() {
  const location = useLocation();
  const currentStep = getStepNumber(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple header with logo and progress */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/logo.svg" alt="When The Fun" className="h-8 w-auto" />
              <span className="text-sm text-gray-500">Booking</span>
            </Link>
            
            {/* Progress indicator */}
            <div className="hidden md:flex items-center gap-2">
              {bookingSteps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                        index + 1 < currentStep
                          ? "bg-blue-600 text-white"
                          : index + 1 === currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      )}
                    >
                      {index + 1}
                    </div>
                    <span className={cn(
                      "ml-2 text-sm font-medium hidden lg:block",
                      index + 1 <= currentStep ? "text-gray-900" : "text-gray-500"
                    )}>
                      {step.name}
                    </span>
                  </div>
                  {index < bookingSteps.length - 1 && (
                    <ChevronRight className="h-5 w-5 text-gray-400 mx-2" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Exit button */}
            <Link
              to="/venues"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Exit
            </Link>
          </div>
        </div>
        
        {/* Mobile progress bar */}
        <div className="md:hidden px-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              Step {currentStep} of {bookingSteps.length}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / bookingSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Simple footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>© {new Date().getFullYear()} When The Fun. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/help" className="hover:text-gray-900">Help</Link>
              <Link to="/terms-of-service" className="hover:text-gray-900">Terms</Link>
              <Link to="/privacy-policy" className="hover:text-gray-900">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}