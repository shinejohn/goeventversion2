import type { Route } from './+types/test-$id';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  console.log('[TEST EVENT LOADER] Route hit with ID:', params.id);
  
  return {
    eventId: params.id,
    message: 'Test event loader working!',
    timestamp: new Date().toISOString()
  };
};

export default function TestEventPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Test Event Detail Page</h1>
      <p>This confirms the dynamic routing is working.</p>
    </div>
  );
}
