import React from 'react';
import { useLoaderData } from 'react-router';
import type { Route } from './+types';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { z } from 'zod';

// Magic Patterns imports
import { GearPage } from '~/components/magic-patterns/pages/GearPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';
import { getLogger } from '@kit/shared/logger';

/**
 * Shop/Gear Route - Get everything you need for the perfect event!
 * Equipment, merchandise, and gear for events, venues, and performers
 * 
 * Time to gear up for the fun! 🛍️🎪
 */

// Product data schema
const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  subcategory: z.string().nullable(),
  price: z.number(),
  compareAtPrice: z.number().nullable(),
  currency: z.string().default('USD'),
  images: z.array(z.string()),
  brand: z.string().nullable(),
  sku: z.string(),
  inStock: z.boolean(),
  stockCount: z.number(),
  rating: z.number().nullable(),
  reviewCount: z.number(),
  tags: z.array(z.string()),
  features: z.array(z.string()),
  isNew: z.boolean(),
  isSale: z.boolean(),
  isFeatured: z.boolean(),
});

type Product = z.infer<typeof ProductSchema>;

// Query parameter schema for shop browsing
const ShopQuerySchema = z.object({
  search: z.string().max(100).optional().default(''),
  category: z.enum([
    'audio', 'lighting', 'stage', 'instruments', 'dj-equipment',
    'merchandise', 'accessories', 'decorations', 'safety', 'other'
  ]).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.coerce.boolean().optional(),
  onSale: z.coerce.boolean().optional(),
  isNew: z.coerce.boolean().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(['price-asc', 'price-desc', 'newest', 'rating', 'popular']).optional().default('popular'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(24),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  
  try {
    // Parse query parameters
    const url = new URL(request.url);
    const rawParams = Object.fromEntries(url.searchParams);
    
    // Validate and parse query parameters
    const paramsResult = ShopQuerySchema.safeParse(rawParams);
    if (!paramsResult.success) {
      logger.warn({ error: paramsResult.error }, 'Invalid shop query parameters');
      // Continue with defaults even if params are invalid
    }
    
    const params = paramsResult.success ? paramsResult.data : ShopQuerySchema.parse({});
    
    // Build database query
    let query = client
      .from('products')
      .select(`
        id,
        name,
        description,
        category,
        subcategory,
        price,
        compare_at_price,
        currency,
        images,
        brand,
        sku,
        in_stock,
        stock_count,
        rating,
        review_count,
        tags,
        features,
        is_new,
        is_sale,
        is_featured,
        created_at
      `, { count: 'exact' })
      .eq('status', 'active');

    // Apply search filter
    if (params.search) {
      query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
    }

    // Apply category filter
    if (params.category) {
      query = query.eq('category', params.category);
    }

    // Apply price filters
    if (params.minPrice !== undefined) {
      query = query.gte('price', params.minPrice);
    }
    
    if (params.maxPrice !== undefined) {
      query = query.lte('price', params.maxPrice);
    }

    // Apply stock filter
    if (params.inStock !== undefined) {
      query = query.eq('in_stock', params.inStock);
    }

    // Apply sale filter
    if (params.onSale) {
      query = query.eq('is_sale', true);
    }

    // Apply new filter
    if (params.isNew) {
      query = query.eq('is_new', true);
    }

    // Apply rating filter
    if (params.rating !== undefined) {
      query = query.gte('rating', params.rating);
    }

    // Apply sorting
    switch (params.sort) {
      case 'price-asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false, nullsFirst: false });
        break;
      case 'popular':
      default:
        query = query.order('is_featured', { ascending: false })
          .order('review_count', { ascending: false });
        break;
    }

    // Apply pagination
    const offset = (params.page - 1) * params.limit;
    query = query.range(offset, offset + params.limit - 1);

    // Execute query
    const { data: products, count, error } = await query;

    if (error) {
      logger.error({ error }, 'Error fetching products');
      throw error;
    }

    // Transform products to match component expectations
    const transformedProducts: Product[] = (products || []).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      category: p.category,
      subcategory: p.subcategory,
      price: Number(p.price),
      compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : null,
      currency: p.currency || 'USD',
      images: p.images || [],
      brand: p.brand,
      sku: p.sku || '',
      inStock: p.in_stock,
      stockCount: p.stock_count || 0,
      rating: p.rating ? Number(p.rating) : null,
      reviewCount: p.review_count || 0,
      tags: p.tags || [],
      features: p.features || [],
      isNew: p.is_new || false,
      isSale: p.is_sale || false,
      isFeatured: p.is_featured || false,
    }));

    // Get featured products for sidebar
    const { data: featuredProducts } = await client
      .from('products')
      .select('id, name, price, images')
      .eq('status', 'active')
      .eq('is_featured', true)
      .limit(5);

    const categories = [
      { id: 'audio', name: 'Audio Equipment', count: 0 },
      { id: 'lighting', name: 'Lighting', count: 0 },
      { id: 'stage', name: 'Stage & Platforms', count: 0 },
      { id: 'dj-equipment', name: 'DJ Equipment', count: 0 },
      { id: 'merchandise', name: 'Merchandise', count: 0 },
      { id: 'accessories', name: 'Accessories', count: 0 },
      { id: 'decorations', name: 'Decorations', count: 0 },
    ];

    const brands = [
      { id: 'soundpro', name: 'SoundPro', count: 0 },
      { id: 'brightstage', name: 'BrightStage', count: 0 },
      { id: 'mixmaster', name: 'MixMaster', count: 0 },
      { id: 'eventpro', name: 'EventPro', count: 0 },
    ];

    return {
      products: transformedProducts,
      featured: featuredProducts?.map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image: p.images?.[0] || ''
      })) || [],
      categories,
      brands,
      priceRange: { min: 0, max: 5000 },
      filters: params,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / params.limit)
      }
    };
    
  } catch (error) {
    logger.error({ error }, 'Failed to load shop page');
    
    return {
      products: [],
      featured: [],
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 5000 },
      filters: ShopQuerySchema.parse({}),
      pagination: {
        page: 1,
        limit: 24,
        total: 0,
        totalPages: 0
      }
    };
  }
};

export async function action({ request }: Route.ActionArgs) {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  const action = formData.get('_action');
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      throw new Response('Please log in to continue', { status: 401 });
    }

    if (action === 'add-to-cart') {
      const productId = formData.get('productId') as string;
      const quantity = parseInt(formData.get('quantity') as string) || 1;
      
      // Check product availability
      const { data: product } = await client
        .from('products')
        .select('id, name, price, in_stock, stock_count')
        .eq('id', productId)
        .single();

      if (!product) {
        throw new Response('Product not found', { status: 404 });
      }

      if (!product.in_stock || product.stock_count < quantity) {
        throw new Response('Product is out of stock', { status: 400 });
      }

      // Add to cart (stored in user's cart table or session)
      const { error } = await client
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: productId,
          quantity,
          price: product.price,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,product_id'
        });

      if (error) {
        logger.error({ error }, 'Error adding to cart');
        throw new Response('Failed to add to cart', { status: 500 });
      }

      return { success: true, message: 'Added to cart' };
    }

    if (action === 'add-to-wishlist') {
      const productId = formData.get('productId') as string;
      
      const { error } = await client
        .from('wishlists')
        .upsert({
          user_id: user.id,
          product_id: productId,
          created_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,product_id'
        });

      if (error) {
        logger.error({ error }, 'Error adding to wishlist');
        throw new Response('Failed to add to wishlist', { status: 500 });
      }

      return { success: true, message: 'Added to wishlist' };
    }

    throw new Response('Invalid action', { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing shop action');
    throw new Response('Server error', { status: 500 });
  }
}

// Export the wrapped component for Magic Patterns integration
export default createMagicPatternsRoute(GearPage, {
  displayName: 'GearPage',
  pageType: 'commerce',
});