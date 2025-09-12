import type { Route } from './+types/simple-$id';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  console.log('[SIMPLE EVENT LOADER] Route hit with ID:', params.id);
  
  return {
    eventId: params.id,
    message: 'Simple event loader working!',
    timestamp: new Date().toISOString()
  };
};

export default function SimpleEventPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Simple Event Detail Page</h1>
      <p>This confirms the dynamic routing is working.</p>
    </div>
  );
}
