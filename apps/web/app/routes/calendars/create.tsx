import { Form, redirect, useActionData } from 'react-router';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';

const calendarSchema = z.object({
  name: z.string().min(1, 'Calendar name is required'),
  description: z.string().optional(),
  visibility: z.enum(['public', 'private', 'friends']),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  categories: z.array(z.string()).optional(),
  is_monetized: z.boolean().default(false),
  subscription_price: z.number().optional(),
  one_time_price: z.number().optional()
});

export async function loader({ request }: { request: Request }) {
  const client = getSupabaseServerClient(request);
  
  // Check if user is authenticated
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (!user || userError) {
    return redirect('/auth/sign-in?redirectTo=/calendars/create');
  }
  
  return { user };
}

export async function action({ request }: { request: Request }) {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  // Get current user
  const { data: { user } } = await client.auth.getUser();
  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }

  // Get user's account
  const { data: account } = await client
    .from('accounts')
    .select('id')
    .eq('primary_owner_user_id', user.id)
    .single();

  try {
    const calendarData = calendarSchema.parse({
      name: formData.get('name'),
      description: formData.get('description'),
      visibility: formData.get('visibility') || 'private',
      color: formData.get('color') || '#4F46E5',
      categories: JSON.parse(formData.get('categories') as string || '[]'),
      is_monetized: formData.get('is_monetized') === 'true',
      subscription_price: formData.get('subscription_price') 
        ? parseFloat(formData.get('subscription_price') as string) 
        : undefined,
      one_time_price: formData.get('one_time_price') 
        ? parseFloat(formData.get('one_time_price') as string) 
        : undefined
    });

    // Create calendar
    const { data: calendar, error } = await client
      .from('calendars')
      .insert({
        owner_id: user.id,
        account_id: account?.id || user.id,
        ...calendarData,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      })
      .select()
      .single();

    if (error) {
      console.error('Calendar creation error:', error);
      return { error: 'Failed to create calendar' };
    }

    // Redirect to the new calendar
    return redirect(`/calendars/${calendar.slug}`);

  } catch (error) {
    console.error('Validation error:', error);
    return { error: 'Invalid calendar data' };
  }
}

export default function CreateCalendarRoute() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create a New Calendar</h1>
      
      {actionData?.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
          {actionData.error}
        </div>
      )}

      <Form method="post" className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Calendar Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-1">
            Visibility
          </label>
          <select
            id="visibility"
            name="visibility"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="private">Private</option>
            <option value="friends">Friends Only</option>
            <option value="public">Public</option>
          </select>
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
            Calendar Color
          </label>
          <input
            type="color"
            id="color"
            name="color"
            defaultValue="#4F46E5"
            className="h-10 w-20"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Monetization Options</h3>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_monetized"
                value="true"
                className="mr-2"
              />
              <span>Enable monetization for this calendar</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="subscription_price" className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Subscription Price
              </label>
              <input
                type="number"
                id="subscription_price"
                name="subscription_price"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="one_time_price" className="block text-sm font-medium text-gray-700 mb-1">
                One-time Access Price
              </label>
              <input
                type="number"
                id="one_time_price"
                name="one_time_price"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create Calendar
          </button>
        </div>
      </Form>
    </div>
  );
}