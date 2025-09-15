import React from 'react';

export default function BookingWizardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Wizard</h1>
        <p className="text-gray-600 mb-8">Coming soon - guided booking process</p>
        <a
          href="/book-it"
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Go to Book It
        </a>
      </div>
    </div>
  );
}
