import React from 'react';
import { json, redirect } from 'react-router';
import { useLoaderData } from 'react-router';
import type { Route } from './+types/cart/index';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { ShoppingCartPage } from '~/components/magic-patterns/pages/ShoppingCartPage';
import { getLogger } from '@kit/shared/logger';

export async function loader({ request }: Route.LoaderArgs) {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    // For guests, cart is managed client-side
    if (!user) {
      return json({ 
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        marketplaceFee: 0,
        total: 0,
        isAuthenticated: false
      });
    }

    // Load cart items for authenticated user
    const { data: cartItems } = await client
      .from('cart_items')
      .select(`
        id,
        quantity,
        price,
        added_at,
        product:products!inner(
          id,
          name,
          slug,
          images,
          category,
          vendor_id,
          shipping_weight,
          shipping_class,
          vendor:vendor_profiles!inner(
            id,
            business_name,
            commission_rate
          )
        ),
        variant:product_variants(
          id,
          name,
          sku,
          options
        )
      `)
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });

    if (!cartItems || cartItems.length === 0) {
      return json({ 
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        marketplaceFee: 0,
        total: 0,
        isAuthenticated: true
      });
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.0875; // 8.75% tax
    const shipping = 15; // Simplified flat rate
    const marketplaceFee = subtotal * 0.05; // 5% buyer fee
    const total = subtotal + tax + shipping + marketplaceFee;

    // Transform cart items for component
    const transformedItems = cartItems.map(item => ({
      id: item.id,
      productId: item.product.id,
      productName: item.product.name,
      productSlug: item.product.slug,
      image: item.product.images?.[0] || '',
      category: item.product.category,
      variantName: item.variant?.name,
      variantId: item.variant?.id,
      sku: item.variant?.sku || '',
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
      vendorName: item.product.vendor?.business_name || 'Unknown Vendor',
      vendorId: item.product.vendor_id
    }));

    return json({ 
      items: transformedItems,
      subtotal,
      tax,
      shipping,
      marketplaceFee,
      total,
      isAuthenticated: true
    });

  } catch (error) {
    logger.error({ error }, 'Error loading cart');
    return json({ 
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      marketplaceFee: 0,
      total: 0,
      isAuthenticated: false
    });
  }
}

export async function action({ request }: Route.ActionArgs) {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  const action = formData.get('_action');
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return json({ success: false, error: 'Please log in to continue' }, { status: 401 });
    }

    if (action === 'update-quantity') {
      const itemId = formData.get('itemId') as string;
      const quantity = parseInt(formData.get('quantity') as string);

      if (quantity <= 0) {
        // Remove item if quantity is 0
        const { error } = await client
          .from('cart_items')
          .delete()
          .eq('id', itemId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Update quantity
        const { error } = await client
          .from('cart_items')
          .update({ 
            quantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', itemId)
          .eq('user_id', user.id);

        if (error) throw error;
      }

      return json({ success: true });
    }

    if (action === 'remove-item') {
      const itemId = formData.get('itemId') as string;

      const { error } = await client
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;

      return json({ success: true });
    }

    if (action === 'clear-cart') {
      const { error } = await client
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      return json({ success: true });
    }

    if (action === 'checkout') {
      // Validate cart items are still in stock
      const { data: cartItems } = await client
        .from('cart_items')
        .select(`
          id,
          quantity,
          product_id,
          product:products!inner(
            id,
            inventory_count,
            track_inventory
          )
        `)
        .eq('user_id', user.id);

      if (!cartItems || cartItems.length === 0) {
        return json({ success: false, error: 'Cart is empty' });
      }

      // Check inventory
      for (const item of cartItems) {
        if (item.product.track_inventory && item.product.inventory_count < item.quantity) {
          return json({ 
            success: false, 
            error: `Not enough inventory for ${item.product.name}` 
          });
        }
      }

      // Create order in database
      // Then redirect to checkout page
      return redirect('/shop/checkout');
    }

    return json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing cart action');
    return json({ success: false, error: 'Failed to update cart' }, { status: 500 });
  }
}

export default function ShoppingCartRoute() {
  const data = useLoaderData<typeof loader>();
  return <ShoppingCartPage {...data} />;
}