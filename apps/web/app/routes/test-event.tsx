import type { Route } from './+types/test-event';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  console.log('[TEST ROUTE] Test route hit!');
  
  return {
    message: 'Test route working!',
    timestamp: new Date().toISOString()
  };
};

export default function TestEventPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Test Route Working!</h1>
      <p>This confirms the routing system is working.</p>
    </div>
  );
}
