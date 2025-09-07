import React from 'react';
import { GearPage } from '~/components/magic-patterns/pages/GearPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/gear';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    // Fetch categories
    const { data: categories, error: categoriesError } = await client
      .from('product_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
    }

    // Fetch featured products
    const { data: products, error: productsError } = await client
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(6);

    if (productsError) {
      console.error('Error fetching products:', productsError);
    }

    // Transform to match UI expectations
    const shopCategories = categories?.map(cat => ({
      title: cat.title,
      description: cat.description,
      path: cat.path,
      image: cat.image
    })) || [];

    const featuredProducts = products?.map(product => ({
      id: product.id,
      name: product.name,
      image: product.image,
      price: `$${product.price.toFixed(2)}`,
      category: product.category,
      // Include optional metadata fields
      ...(product.event && { event: product.event }),
      ...(product.artist && { artist: product.artist }),
      ...(product.era && { era: product.era }),
      ...(product.includes && { includes: product.includes }),
      ...(product.featured && { featured: product.featured })
    })) || [];

    return {
      title: 'Gear - GoEventCity',
      shopCategories,
      featuredProducts
    };
  } catch (error) {
    console.error('Error in gear loader:', error);
    // Return empty arrays on error, component will use fallback mock data
    return {
      title: 'Gear - GoEventCity',
      shopCategories: [],
      featuredProducts: []
    };
  }
};

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: data?.title || 'GoEventCity',
    },
    {
      name: 'description',
      content: 'Discover amazing events and experiences in your city',
    },
  ];
};

// SSR-safe pattern using props.loaderData
export default function GearRoute(props: Route.ComponentProps) {
  const data = props.loaderData;
  
  return (
    <GearPage 
      shopCategories={data.shopCategories}
      featuredProducts={data.featuredProducts}
    />
  );
}
