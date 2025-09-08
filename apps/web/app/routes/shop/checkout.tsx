import React from 'react';
import { redirect, useLoaderData } from 'react-router';
import type { Route } from './+types/checkout';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';
import { z } from 'zod';

// Magic Patterns imports - using PaymentPage for checkout
import { PaymentPage } from '~/components/magic-patterns/pages/PaymentPage';
import { createMagicPatternsRoute } from '~/lib/magic-patterns/route-wrapper';

// Validation schemas
const ShippingAddressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(2).max(2),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  country: z.string().default('US'),
});

const PaymentMethodSchema = z.object({
  type: z.enum(['card', 'paypal', 'applepay', 'googlepay']),
  // Additional payment details handled by Stripe
});

export async function loader({ request }: Route.LoaderArgs) {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      // Redirect to login with return URL
      const url = new URL(request.url);
      return redirect(`/auth/login?redirectTo=${encodeURIComponent(url.pathname)}`);
    }

    // Load cart items with full product details
    const { data: cartItems } = await client
      .from('cart_items')
      .select(`
        id,
        quantity,
        price,
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
      // No items in cart, redirect back to shop
      return redirect('/shop');
    }

    // Calculate totals using the marketplace calculation function
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = 0.0875; // 8.75% tax
    
    // Calculate shipping based on weight and shipping class
    let shippingAmount = 0;
    const totalWeight = cartItems.reduce((sum, item) => {
      const weight = item.product.shipping_weight || 1; // Default 1 lb if not specified
      return sum + (weight * item.quantity);
    }, 0);

    // Basic shipping calculation
    if (totalWeight <= 5) {
      shippingAmount = 9.99;
    } else if (totalWeight <= 20) {
      shippingAmount = 14.99;
    } else {
      shippingAmount = 19.99 + ((totalWeight - 20) * 0.5);
    }

    // Apply marketplace fees
    const marketplaceFee = subtotal * 0.05; // 5% buyer fee
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount + shippingAmount + marketplaceFee;

    // Get user's saved addresses
    const { data: savedAddresses } = await client
      .from('user_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    // Get user's saved payment methods (if implemented)
    const { data: savedPaymentMethods } = await client
      .from('user_payment_methods')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('is_default', { ascending: false });

    // Transform cart items for the component
    const transformedItems = cartItems.map(item => ({
      id: item.id,
      productId: item.product.id,
      productName: item.product.name,
      productSlug: item.product.slug,
      image: item.product.images?.[0] || '',
      variantName: item.variant?.name,
      sku: item.variant?.sku || '',
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
      vendorName: item.product.vendor?.business_name || 'Unknown Vendor',
      vendorId: item.product.vendor_id,
      shippingClass: item.product.shipping_class || 'standard'
    }));

    return {
      items: transformedItems,
      subtotal,
      taxAmount,
      shippingAmount,
      marketplaceFee,
      total,
      savedAddresses: savedAddresses || [],
      savedPaymentMethods: savedPaymentMethods || [],
      userEmail: user.email || '',
    };

  } catch (error) {
    logger.error({ error }, 'Error loading checkout page');
    return redirect('/shop/cart');
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
      throw new Response('Please log in to continue', { status: 401 });
    }

    if (action === 'place-order') {
      // Validate shipping address
      const shippingData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address1: formData.get('address1'),
        address2: formData.get('address2'),
        city: formData.get('city'),
        state: formData.get('state'),
        zipCode: formData.get('zipCode'),
        country: formData.get('country') || 'US',
      };

      const addressResult = ShippingAddressSchema.safeParse(shippingData);
      if (!addressResult.success) {
        throw new Response(JSON.stringify({ 
          error: 'Invalid shipping address',
          errors: addressResult.error.flatten() 
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const shippingAddress = addressResult.data;

      // Get cart items again to ensure fresh data
      const { data: cartItems } = await client
        .from('cart_items')
        .select(`
          id,
          quantity,
          price,
          product_id,
          variant_id,
          product:products!inner(
            id,
            name,
            inventory_count,
            track_inventory,
            vendor_id,
            vendor:vendor_profiles!inner(
              commission_rate
            )
          )
        `)
        .eq('user_id', user.id);

      if (!cartItems || cartItems.length === 0) {
        throw new Response('Cart is empty', { status: 400 });
      }

      // Validate inventory again
      for (const item of cartItems) {
        if (item.product.track_inventory && item.product.inventory_count < item.quantity) {
          throw new Response(`Not enough inventory for ${item.product.name}`, { status: 400 });
        }
      }

      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const taxAmount = subtotal * 0.0875;
      const marketplaceFee = subtotal * 0.05;
      const shippingAmount = 15; // Simplified for now
      const total = subtotal + taxAmount + shippingAmount + marketplaceFee;

      // Calculate platform commission (10% of vendor sales)
      const platformCommission = subtotal * 0.10;

      // Create the order
      const { data: order, error: orderError } = await client
        .from('marketplace_orders')
        .insert({
          user_id: user.id,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          status: 'pending',
          subtotal,
          tax_amount: taxAmount,
          shipping_amount: shippingAmount,
          marketplace_fee: marketplaceFee,
          platform_commission: platformCommission,
          total_amount: total,
          billing_address: shippingAddress,
          shipping_address: shippingAddress,
          payment_method: formData.get('paymentMethod') || 'card',
          payment_status: 'pending',
          shipping_method: 'standard',
          notes: formData.get('notes') as string || null,
        })
        .select()
        .single();

      if (orderError || !order) {
        logger.error({ error: orderError }, 'Error creating order');
        throw new Response('Failed to create order', { status: 500 });
      }

      // Create order items
      const orderItems = cartItems.map(item => {
        const vendorCommissionRate = item.product.vendor?.commission_rate || 10;
        const itemSubtotal = item.price * item.quantity;
        const platformCommissionAmount = itemSubtotal * (vendorCommissionRate / 100);
        const vendorAmount = itemSubtotal - platformCommissionAmount;

        return {
          order_id: order.id,
          vendor_id: item.product.vendor_id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: itemSubtotal,
          vendor_commission: vendorAmount,
          platform_commission: platformCommissionAmount,
        };
      });

      const { error: itemsError } = await client
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        logger.error({ error: itemsError }, 'Error creating order items');
        // Should rollback order creation here
        throw new Response('Failed to create order items', { status: 500 });
      }

      // Update inventory
      for (const item of cartItems) {
        if (item.product.track_inventory) {
          const { error: inventoryError } = await client
            .from('products')
            .update({ 
              inventory_count: item.product.inventory_count - item.quantity,
              updated_at: new Date().toISOString()
            })
            .eq('id', item.product_id);

          if (inventoryError) {
            logger.error({ error: inventoryError }, 'Error updating inventory');
          }
        }
      }

      // Clear the cart
      const { error: clearError } = await client
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (clearError) {
        logger.error({ error: clearError }, 'Error clearing cart');
      }

      // TODO: Process payment with Stripe
      // For now, we'll simulate a successful payment
      await client
        .from('marketplace_orders')
        .update({
          payment_status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', order.id);

      // Redirect to order confirmation page
      return redirect(`/shop/order-confirmation/${order.order_number}`);
    }

    if (action === 'save-address') {
      const addressData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        address1: formData.get('address1'),
        address2: formData.get('address2'),
        city: formData.get('city'),
        state: formData.get('state'),
        zipCode: formData.get('zipCode'),
        country: formData.get('country') || 'US',
        isDefault: formData.get('isDefault') === 'true'
      };

      const { error } = await client
        .from('user_addresses')
        .insert({
          user_id: user.id,
          ...addressData
        });

      if (error) {
        logger.error({ error }, 'Error saving address');
        throw new Response('Failed to save address', { status: 500 });
      }

      return { success: true };
    }

    throw new Response('Invalid action', { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing checkout');
    throw new Response('Failed to process checkout', { status: 500 });
  }
}

export default createMagicPatternsRoute(PaymentPage, {
  displayName: 'CheckoutPage',
  pageType: 'commerce',
});