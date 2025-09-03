import type { Route } from '../../types/app/routes/+types/root.tsx';

export default function TicketBuyRoute() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Buy Tickets</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500">Browse and buy event tickets here.</p>
        </div>
      </div>
    </div>
  );
}