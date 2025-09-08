import React from 'react';
import { json, redirect } from 'react-router';
import { useLoaderData } from 'react-router';
import type { Route } from '~/types/app/routes/dashboard/vendor/products';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';
import { VendorProductsManager } from '~/components/magic-patterns/components/vendor/VendorProductsManager';
import { z } from 'zod';

// Product management schema
const ProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(2000).optional(),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  price: z.coerce.number().min(0.01),
  compareAtPrice: z.coerce.number().min(0).optional(),
  brand: z.string().max(100).optional(),
  sku: z.string().max(100).optional(),
  inventoryCount: z.coerce.number().min(0).default(0),
  trackInventory: z.boolean().default(true),
  allowBackorder: z.boolean().default(false),
  lowStockThreshold: z.coerce.number().min(0).default(5),
  requiresShipping: z.boolean().default(true),
  shippingWeight: z.coerce.number().min(0).optional(),
  shippingClass: z.enum(['standard', 'fragile', 'oversized']).default('standard'),
  tags: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional()
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const search = url.searchParams.get('search') || '';
  const category = url.searchParams.get('category') || '';
  const status = url.searchParams.get('status') || 'all';
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return redirect('/auth/login');
    }

    // Get vendor profile
    const { data: vendorProfile } = await client
      .from('vendor_profiles')
      .select('id, business_name, status')
      .eq('user_id', user.id)
      .single();

    if (!vendorProfile) {
      return redirect('/dashboard/vendor');
    }

    // Build query for products
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
        track_inventory,
        inventory_count,
        allow_backorder,
        low_stock_threshold,
        requires_shipping,
        shipping_weight,
        shipping_class,
        tags,
        features,
        is_active,
        is_featured,
        is_new,
        is_sale,
        view_count,
        purchase_count,
        rating,
        review_count,
        meta_title,
        meta_description,
        published_at,
        created_at,
        updated_at
      `, { count: 'exact' })
      .eq('vendor_id', vendorProfile.id);

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (status !== 'all') {
      if (status === 'active') {
        query = query.eq('is_active', true);
      } else if (status === 'inactive') {
        query = query.eq('is_active', false);
      } else if (status === 'low-stock') {
        query = query.eq('track_inventory', true).lte('inventory_count', 5);
      } else if (status === 'out-of-stock') {
        query = query.eq('inventory_count', 0);
      }
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Order by created date
    query = query.order('created_at', { ascending: false });

    const { data: products, count, error } = await query;

    if (error) {
      logger.error({ error }, 'Error fetching vendor products');
      throw error;
    }

    // Get product variants for each product
    const productIds = (products || []).map(p => p.id);
    const { data: variants } = await client
      .from('product_variants')
      .select('*')
      .in('product_id', productIds);

    // Transform products for component
    const transformedProducts = (products || []).map(product => {
      const productVariants = variants?.filter(v => v.product_id === product.id) || [];
      
      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        category: product.category,
        subcategory: product.subcategory,
        price: product.price,
        compareAtPrice: product.compare_at_price,
        currency: product.currency || 'USD',
        images: product.images || [],
        thumbnailUrl: product.images?.[0] || '',
        brand: product.brand,
        sku: product.sku,
        trackInventory: product.track_inventory,
        inventoryCount: product.inventory_count || 0,
        allowBackorder: product.allow_backorder,
        lowStockThreshold: product.low_stock_threshold || 5,
        requiresShipping: product.requires_shipping,
        shippingWeight: product.shipping_weight,
        shippingClass: product.shipping_class,
        tags: product.tags || [],
        features: product.features || [],
        isActive: product.is_active,
        isFeatured: product.is_featured,
        isNew: product.is_new,
        isSale: product.is_sale,
        viewCount: product.view_count || 0,
        purchaseCount: product.purchase_count || 0,
        rating: product.rating || 0,
        reviewCount: product.review_count || 0,
        metaTitle: product.meta_title,
        metaDescription: product.meta_description,
        publishedAt: product.published_at,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        variants: productVariants.map(v => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          compareAtPrice: v.compare_at_price,
          inventoryCount: v.inventory_count || 0,
          options: v.options || {},
          imageUrl: v.image_url,
          position: v.position || 0,
          isActive: v.is_active
        }))
      };
    });

    // Get categories for filter dropdown
    const { data: categories } = await client
      .from('products')
      .select('category')
      .eq('vendor_id', vendorProfile.id)
      .not('category', 'is', null);

    const uniqueCategories = [...new Set(categories?.map(c => c.category) || [])];

    return json({
      vendor: {
        id: vendorProfile.id,
        businessName: vendorProfile.business_name,
        status: vendorProfile.status
      },
      products: transformedProducts,
      categories: uniqueCategories,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      filters: {
        search,
        category,
        status
      }
    });

  } catch (error) {
    logger.error({ error }, 'Error loading vendor products');
    return json({
      vendor: null,
      products: [],
      categories: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      filters: { search: '', category: '', status: 'all' }
    });
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
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get vendor profile
    const { data: vendorProfile } = await client
      .from('vendor_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!vendorProfile) {
      return json({ success: false, error: 'Vendor profile not found' }, { status: 404 });
    }

    if (action === 'create-product') {
      const productData = {
        name: formData.get('name'),
        description: formData.get('description'),
        category: formData.get('category'),
        subcategory: formData.get('subcategory'),
        price: formData.get('price'),
        compareAtPrice: formData.get('compareAtPrice'),
        brand: formData.get('brand'),
        sku: formData.get('sku'),
        inventoryCount: formData.get('inventoryCount'),
        trackInventory: formData.get('trackInventory') === 'true',
        allowBackorder: formData.get('allowBackorder') === 'true',
        lowStockThreshold: formData.get('lowStockThreshold'),
        requiresShipping: formData.get('requiresShipping') !== 'false',
        shippingWeight: formData.get('shippingWeight'),
        shippingClass: formData.get('shippingClass'),
        tags: JSON.parse(formData.get('tags') as string || '[]'),
        features: JSON.parse(formData.get('features') as string || '[]'),
        images: JSON.parse(formData.get('images') as string || '[]'),
        metaTitle: formData.get('metaTitle'),
        metaDescription: formData.get('metaDescription')
      };

      const result = ProductSchema.safeParse(productData);
      if (!result.success) {
        return json({ 
          success: false, 
          error: 'Invalid product data',
          errors: result.error.flatten()
        });
      }

      const validData = result.data;

      // Generate slug from name
      const slug = validData.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      const { data, error } = await client
        .from('products')
        .insert({
          vendor_id: vendorProfile.id,
          name: validData.name,
          slug,
          description: validData.description,
          category: validData.category,
          subcategory: validData.subcategory,
          price: validData.price,
          compare_at_price: validData.compareAtPrice,
          brand: validData.brand,
          sku: validData.sku,
          track_inventory: validData.trackInventory,
          inventory_count: validData.inventoryCount,
          allow_backorder: validData.allowBackorder,
          low_stock_threshold: validData.lowStockThreshold,
          requires_shipping: validData.requiresShipping,
          shipping_weight: validData.shippingWeight,
          shipping_class: validData.shippingClass,
          tags: validData.tags,
          features: validData.features,
          images: validData.images,
          meta_title: validData.metaTitle,
          meta_description: validData.metaDescription,
          is_active: true,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        logger.error({ error }, 'Error creating product');
        return json({ success: false, error: error.message });
      }

      return json({ success: true, product: data });
    }

    if (action === 'update-product') {
      const productId = formData.get('productId') as string;
      const updates: any = {};

      // Only update provided fields
      if (formData.has('name')) updates.name = formData.get('name');
      if (formData.has('description')) updates.description = formData.get('description');
      if (formData.has('category')) updates.category = formData.get('category');
      if (formData.has('price')) updates.price = parseFloat(formData.get('price') as string);
      if (formData.has('inventoryCount')) updates.inventory_count = parseInt(formData.get('inventoryCount') as string);
      if (formData.has('isActive')) updates.is_active = formData.get('isActive') === 'true';
      
      updates.updated_at = new Date().toISOString();

      const { error } = await client
        .from('products')
        .update(updates)
        .eq('id', productId)
        .eq('vendor_id', vendorProfile.id);

      if (error) {
        logger.error({ error }, 'Error updating product');
        return json({ success: false, error: error.message });
      }

      return json({ success: true });
    }

    if (action === 'delete-product') {
      const productId = formData.get('productId') as string;
      
      // Soft delete by setting inactive
      const { error } = await client
        .from('products')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)
        .eq('vendor_id', vendorProfile.id);

      if (error) {
        logger.error({ error }, 'Error deleting product');
        return json({ success: false, error: error.message });
      }

      return json({ success: true });
    }

    if (action === 'bulk-update-inventory') {
      const updates = JSON.parse(formData.get('updates') as string);
      
      for (const update of updates) {
        await client
          .from('products')
          .update({ 
            inventory_count: update.inventoryCount,
            updated_at: new Date().toISOString()
          })
          .eq('id', update.productId)
          .eq('vendor_id', vendorProfile.id);
      }

      return json({ success: true });
    }

    return json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing product action');
    return json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

/**
 * Vendor products management page
 */
export default function VendorProductsPage() {
  const data = useLoaderData<typeof loader>();
  return <VendorProductsManager {...data} />;
}