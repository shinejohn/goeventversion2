import React from 'react';
import type { Route } from './+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { redirect } from 'react-router';
import { z } from 'zod';
import { getLogger } from '@kit/shared/logger';

/**
 * Community Creator Route - Create new community hubs!
 * Form to create new community hubs with events and members
 * 
 * Time to build your community! 🏗️✨
 */

// Community creation schema
const CommunityCreateSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  website: z.string().url().optional().or(z.literal('')),
  social_media: z.string().url().optional().or(z.literal('')),
  is_public: z.boolean().default(true),
  tags: z.string().optional()
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const logger = await getLogger();
  
  try {
    logger.info({ name: 'community-create-loader' }, 'Loading community creation form...');
    
    // Get current user
    const { data: { user }, error: userError } = await client.auth.getUser();
    
    if (userError || !user) {
      logger.warn({ name: 'community-create-loader' }, 'User not authenticated, redirecting to sign in');
      return redirect('/auth/sign-in?redirectTo=/communities/create');
    }
    
    // Get user's account
    const { data: account, error: accountError } = await client
      .from('accounts')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (accountError || !account) {
      logger.error({ name: 'community-create-loader', error: accountError }, 'Error fetching user account');
      throw new Error('Failed to fetch user account');
    }
    
    return {
      user: {
        id: user.id,
        email: user.email,
        account: account
      },
      categories: [
        'Music & Entertainment',
        'Food & Dining',
        'Technology',
        'Sports & Fitness',
        'Arts & Culture',
        'Business & Networking',
        'Education',
        'Health & Wellness',
        'Travel & Adventure',
        'Gaming',
        'Photography',
        'Other'
      ]
    };
    
  } catch (error) {
    logger.error({ name: 'community-create-loader', error }, 'Error in community create loader');
    throw error;
  }
};

export const action = async ({ request }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const logger = await getLogger();
  
  try {
    logger.info({ name: 'community-create-action' }, 'Processing community creation...');
    
    // Get current user
    const { data: { user }, error: userError } = await client.auth.getUser();
    
    if (userError || !user) {
      logger.warn({ name: 'community-create-action' }, 'User not authenticated');
      return redirect('/auth/sign-in?redirectTo=/communities/create');
    }
    
    // Parse form data
    const formData = await request.formData();
    const rawData = {
      name: formData.get('name'),
      description: formData.get('description'),
      category: formData.get('category'),
      location: formData.get('location'),
      website: formData.get('website'),
      social_media: formData.get('social_media'),
      is_public: formData.get('is_public') === 'on',
      tags: formData.get('tags')
    };
    
    // Validate data
    const validatedData = CommunityCreateSchema.parse(rawData);
    
    // Create slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Create community hub
    const { data: communityHub, error: createError } = await client
      .from('community_hubs')
      .insert({
        name: validatedData.name,
        description: validatedData.description,
        slug: slug,
        category: validatedData.category,
        location: validatedData.location,
        website: validatedData.website || null,
        social_media: validatedData.social_media || null,
        is_public: validatedData.is_public,
        tags: validatedData.tags ? validatedData.tags.split(',').map(t => t.trim()) : [],
        creator_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (createError) {
      logger.error({ name: 'community-create-action', error: createError }, 'Error creating community hub');
      throw new Error('Failed to create community hub');
    }
    
    logger.info({ 
      name: 'community-create-action',
      communityId: communityHub.id,
      slug: communityHub.slug
    }, 'Community hub created successfully');
    
    // Redirect to the new community
    return redirect(`/communities/${communityHub.slug}`);
    
  } catch (error) {
    logger.error({ name: 'community-create-action', error }, 'Error in community create action');
    
    if (error instanceof z.ZodError) {
      return {
        error: 'Validation failed',
        details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      };
    }
    
    return {
      error: error instanceof Error ? error.message : 'Failed to create community'
    };
  }
};

export default function CommunityCreatePage({ loaderData }: Route.ComponentProps) {
  const { user, categories } = loaderData;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Community Hub
            </h1>
            <p className="text-gray-600">
              Build a community around shared interests and bring people together.
            </p>
          </div>
          
          <form method="post" className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Community Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter community name"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe your community and what makes it special"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="City, State or Online"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label htmlFor="social_media" className="block text-sm font-medium text-gray-700 mb-2">
                  Social Media
                </label>
                <input
                  type="url"
                  id="social_media"
                  name="social_media"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="music, events, local (comma separated)"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_public"
                name="is_public"
                defaultChecked
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
                Make this community public (visible to everyone)
              </label>
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Create Community
              </button>
              <a
                href="/communities"
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
