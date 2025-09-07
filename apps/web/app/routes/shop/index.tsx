import React from 'react';
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
  subcategory: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().max(100000).optional(),
  inStock: z.coerce.boolean().optional(),
  onSale: z.coerce.boolean().optional(),
  isNew: z.coerce.boolean().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  sort: z.enum(['featured', 'newest', 'price-asc', 'price-desc', 'rating', 'popular']).optional().default('featured'),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const startTime = Date.now();
  
  try {
    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    const params = ShopQuerySchema.parse(queryParams);
    
    logger.info({ 
      loader: 'shop',
      params 
    }, '🛍️ Loading shop - time to gear up!');
    
    const client = getSupabaseServerClient(request);
    
    // Get current user for personalization
    const { data: { user } } = await client.auth.getUser();
    
    // For now, we'll use mock data since the shop/products table isn't in the schema
    // In production, this would fetch from a products table
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Professional PA System',
        description: 'High-quality sound system perfect for events up to 500 people',
        category: 'audio',
        subcategory: 'speakers',
        price: 1299.99,
        compareAtPrice: 1599.99,
        currency: 'USD',
        images: ['/images/pa-system.jpg'],
        brand: 'SoundPro',
        sku: 'SP-PA-500',
        inStock: true,
        stockCount: 15,
        rating: 4.5,
        reviewCount: 124,
        tags: ['professional', 'outdoor', 'indoor'],
        features: ['500W RMS', 'Bluetooth 5.0', 'Weather resistant'],
        isNew: false,
        isSale: true,
        isFeatured: true,
      },
      {
        id: '2',
        name: 'LED Stage Lighting Kit',
        description: 'Complete lighting solution for stages and venues',
        category: 'lighting',
        subcategory: 'stage-lights',
        price: 899.99,
        compareAtPrice: null,
        currency: 'USD',
        images: ['/images/led-lights.jpg'],
        brand: 'BrightStage',
        sku: 'BS-LED-KIT',
        inStock: true,
        stockCount: 8,
        rating: 4.8,
        reviewCount: 89,
        tags: ['led', 'dmx', 'programmable'],
        features: ['DMX compatible', 'RGB+W', 'App control'],
        isNew: true,
        isSale: false,
        isFeatured: true,
      },
      {
        id: '3',
        name: 'DJ Controller Pro',
        description: '4-channel DJ controller with built-in effects',
        category: 'dj-equipment',
        subcategory: 'controllers',
        price: 599.99,
        compareAtPrice: 699.99,
        currency: 'USD',
        images: ['/images/dj-controller.jpg'],
        brand: 'MixMaster',
        sku: 'MM-DJ-4CH',
        inStock: true,
        stockCount: 12,
        rating: 4.6,
        reviewCount: 156,
        tags: ['serato', 'rekordbox', 'professional'],
        features: ['4 channels', 'Touch-sensitive jogs', 'Built-in sound card'],
        isNew: false,
        isSale: true,
        isFeatured: false,
      },
    ];
    
    // Filter products based on query parameters
    let filteredProducts = [...mockProducts];
    
    if (params.search) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(params.search.toLowerCase()) ||
        p.description.toLowerCase().includes(params.search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(params.search.toLowerCase()))
      );
    }
    
    if (params.category) {
      filteredProducts = filteredProducts.filter(p => p.category === params.category);
    }
    
    if (params.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= params.minPrice!);
    }
    
    if (params.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= params.maxPrice!);
    }
    
    if (params.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.inStock === params.inStock);
    }
    
    if (params.onSale) {
      filteredProducts = filteredProducts.filter(p => p.isSale);
    }
    
    if (params.isNew) {
      filteredProducts = filteredProducts.filter(p => p.isNew);
    }
    
    if (params.rating !== undefined) {
      filteredProducts = filteredProducts.filter(p => (p.rating || 0) >= params.rating!);
    }
    
    // Sort products
    switch (params.sort) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
        filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        filteredProducts.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }
    
    // Apply pagination
    const totalProducts = filteredProducts.length;
    const offset = (params.page - 1) * params.limit;
    const paginatedProducts = filteredProducts.slice(offset, offset + params.limit);
    
    // Calculate shop metrics
    const shopMetrics = {
      totalProducts: totalProducts,
      productsOnSale: filteredProducts.filter(p => p.isSale).length,
      newProducts: filteredProducts.filter(p => p.isNew).length,
      averageRating: filteredProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / (filteredProducts.length || 1),
      priceRange: {
        min: Math.min(...filteredProducts.map(p => p.price)),
        max: Math.max(...filteredProducts.map(p => p.price)),
      },
      categories: filteredProducts.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      brands: [...new Set(filteredProducts.map(p => p.brand).filter(Boolean))],
    };
    
    // Get featured deals
    const featuredDeals = mockProducts
      .filter(p => p.isSale && p.compareAtPrice)
      .map(p => ({
        ...p,
        discount: Math.round(((p.compareAtPrice! - p.price) / p.compareAtPrice!) * 100),
      }))
      .slice(0, 3);
    
    const duration = Date.now() - startTime;
    logger.info({ 
      loader: 'shop',
      duration,
      productCount: paginatedProducts.length,
      totalProducts,
      metrics: shopMetrics
    }, '🎁 Shop loaded - ready to gear up!');
    
    return {
      products: paginatedProducts,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: totalProducts,
        totalPages: Math.ceil(totalProducts / params.limit),
        hasMore: totalProducts > (offset + params.limit),
      },
      filters: params,
      metrics: shopMetrics,
      featuredDeals,
      user: user ? {
        id: user.id,
        email: user.email,
      } : null,
    };
    
  } catch (error) {
    logger.error({ 
      error, 
      loader: 'shop',
      url: request.url 
    }, '😔 Error loading shop - no shopping today');
    
    // Return empty state with error
    return {
      products: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
      filters: ShopQuerySchema.parse({}),
      metrics: {
        totalProducts: 0,
        productsOnSale: 0,
        newProducts: 0,
        averageRating: 0,
        priceRange: { min: 0, max: 0 },
        categories: {},
        brands: [],
      },
      featuredDeals: [],
      user: null,
      error: error instanceof Error ? error.message : 'Failed to load shop',
    };
  }
};

// Component using the Magic Patterns wrapper
export default createMagicPatternsRoute({
  component: GearPage,
  transformData: (loaderData) => ({
    products: loaderData.products,
    pagination: loaderData.pagination,
    filters: loaderData.filters,
    metrics: loaderData.metrics,
    featuredDeals: loaderData.featuredDeals,
    user: loaderData.user,
    error: loaderData.error,
  }),
});

// SEO meta tags 🎯
export const meta = () => {
  return [
    { title: 'Shop Event Gear & Equipment | When The Fun' },
    { 
      name: 'description', 
      content: 'Shop professional audio, lighting, DJ equipment, and event gear. Everything you need to make your events unforgettable.' 
    },
    { property: 'og:title', content: 'Shop Event Gear - When The Fun' },
    { property: 'og:description', content: 'Professional equipment for unforgettable events' },
    { property: 'og:type', content: 'website' },
  ];
};

// Cache headers for performance 🚀
export const headers = () => {
  return {
    'Cache-Control': 'public, max-age=300, s-maxage=3600', // 5 min client, 1 hour CDN
  };
};