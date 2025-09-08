import React from 'react';
import { redirect, useLoaderData } from 'react-router';
import type { Route } from '~/types/app/routes/dashboard/vendor/orders';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';
import { VendorOrdersManager } from '~/components/magic-patterns/components/vendor/VendorOrdersManager';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const status = url.searchParams.get('status') || 'all';
  const search = url.searchParams.get('search') || '';
  
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

    // Build query for order items
    let query = client
      .from('order_items')
      .select(`
        id,
        product_name,
        product_sku,
        quantity,
        price,
        subtotal,
        vendor_commission,
        platform_commission,
        fulfillment_status,
        fulfilled_at,
        metadata,
        created_at,
        order:marketplace_orders!inner(
          id,
          order_number,
          status,
          email,
          phone,
          total_amount,
          shipping_address,
          billing_address,
          payment_status,
          shipping_method,
          tracking_number,
          shipped_at,
          delivered_at,
          created_at
        ),
        product:products(
          id,
          name,
          images,
          category
        )
      `, { count: 'exact' })
      .eq('vendor_id', vendorProfile.id);

    // Apply filters
    if (status !== 'all') {
      if (status === 'pending') {
        query = query.eq('fulfillment_status', 'unfulfilled');
      } else if (status === 'fulfilled') {
        query = query.eq('fulfillment_status', 'fulfilled');
      } else if (status === 'shipped') {
        query = query.not('order.shipped_at', 'is', null);
      } else if (status === 'delivered') {
        query = query.not('order.delivered_at', 'is', null);
      }
    }

    if (search) {
      query = query.or(`order.order_number.ilike.%${search}%,order.email.ilike.%${search}%,product_name.ilike.%${search}%`);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Order by created date
    query = query.order('created_at', { ascending: false });

    const { data: orderItems, count, error } = await query;

    if (error) {
      logger.error({ error }, 'Error fetching vendor orders');
      throw error;
    }

    // Get order statistics
    const [
      { count: totalOrders },
      { count: pendingOrders },
      { count: fulfilledOrders },
      { data: revenueData }
    ] = await Promise.all([
      client
        .from('order_items')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorProfile.id),
      
      client
        .from('order_items')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorProfile.id)
        .eq('fulfillment_status', 'unfulfilled'),
      
      client
        .from('order_items')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorProfile.id)
        .eq('fulfillment_status', 'fulfilled'),
      
      client
        .from('order_items')
        .select('vendor_commission, created_at')
        .eq('vendor_id', vendorProfile.id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    const totalRevenue = revenueData?.reduce((sum, item) => sum + (item.vendor_commission || 0), 0) || 0;

    // Transform orders for component
    const transformedOrders = (orderItems || []).map(item => {
      const shippingAddress = item.order.shipping_address as any;
      const customerName = shippingAddress 
        ? `${shippingAddress.firstName} ${shippingAddress.lastName}`
        : 'N/A';

      return {
        id: item.id,
        orderNumber: item.order.order_number,
        orderStatus: item.order.status,
        fulfillmentStatus: item.fulfillment_status,
        customerEmail: item.order.email,
        customerName,
        customerPhone: item.order.phone,
        productName: item.product_name,
        productSku: item.product_sku,
        productImage: item.product?.images?.[0] || '',
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
        commission: item.vendor_commission,
        platformFee: item.platform_commission,
        orderTotal: item.order.total_amount,
        paymentStatus: item.order.payment_status,
        shippingMethod: item.order.shipping_method,
        trackingNumber: item.order.tracking_number,
        orderDate: item.created_at,
        shippedAt: item.order.shipped_at,
        deliveredAt: item.order.delivered_at,
        fulfilledAt: item.fulfilled_at,
        shippingAddress,
        billingAddress: item.order.billing_address,
        notes: item.metadata?.notes || ''
      };
    });

    const stats = {
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      fulfilledOrders: fulfilledOrders || 0,
      monthlyRevenue: totalRevenue
    };

    return {
      vendor: {
        id: vendorProfile.id,
        businessName: vendorProfile.business_name,
        status: vendorProfile.status
      },
      orders: transformedOrders,
      stats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      filters: {
        status,
        search
      }
    };

  } catch (error) {
    logger.error({ error }, 'Error loading vendor orders');
    return {
      vendor: null,
      orders: [],
      stats: {
        totalOrders: 0,
        pendingOrders: 0,
        fulfilledOrders: 0,
        monthlyRevenue: 0
      },
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      filters: { status: 'all', search: '' }
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
      throw new Response('Unauthorized', { status: 401 });
    }

    // Get vendor profile
    const { data: vendorProfile } = await client
      .from('vendor_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!vendorProfile) {
      throw new Response('Vendor profile not found', { status: 404 });
    }

    if (action === 'fulfill-order') {
      const orderItemId = formData.get('orderItemId') as string;
      const trackingNumber = formData.get('trackingNumber') as string;
      const notes = formData.get('notes') as string;
      
      // Update order item fulfillment
      const { error: itemError } = await client
        .from('order_items')
        .update({
          fulfillment_status: 'fulfilled',
          fulfilled_at: new Date().toISOString(),
          metadata: { notes, trackingNumber }
        })
        .eq('id', orderItemId)
        .eq('vendor_id', vendorProfile.id);

      if (itemError) {
        logger.error({ error: itemError }, 'Error fulfilling order item');
        throw new Response(itemError.message, { status: 500 });
      }

      // Update main order tracking if provided
      if (trackingNumber) {
        const { data: orderItem } = await client
          .from('order_items')
          .select('order_id')
          .eq('id', orderItemId)
          .single();

        if (orderItem) {
          await client
            .from('marketplace_orders')
            .update({
              tracking_number: trackingNumber,
              shipped_at: new Date().toISOString()
            })
            .eq('id', orderItem.order_id);
        }
      }

      // TODO: Send notification to customer

      return { success: true };
    }

    if (action === 'update-tracking') {
      const orderItemId = formData.get('orderItemId') as string;
      const trackingNumber = formData.get('trackingNumber') as string;
      
      // Get order ID from order item
      const { data: orderItem } = await client
        .from('order_items')
        .select('order_id')
        .eq('id', orderItemId)
        .eq('vendor_id', vendorProfile.id)
        .single();

      if (!orderItem) {
        throw new Response('Order item not found', { status: 404 });
      }

      // Update order tracking
      const { error } = await client
        .from('marketplace_orders')
        .update({
          tracking_number: trackingNumber,
          shipped_at: trackingNumber ? new Date().toISOString() : null
        })
        .eq('id', orderItem.order_id);

      if (error) {
        logger.error({ error }, 'Error updating tracking');
        throw new Response(error.message, { status: 500 });
      }

      return { success: true };
    }

    if (action === 'mark-delivered') {
      const orderItemId = formData.get('orderItemId') as string;
      
      // Get order ID from order item
      const { data: orderItem } = await client
        .from('order_items')
        .select('order_id')
        .eq('id', orderItemId)
        .eq('vendor_id', vendorProfile.id)
        .single();

      if (!orderItem) {
        throw new Response('Order item not found', { status: 404 });
      }

      // Update order delivery status
      const { error } = await client
        .from('marketplace_orders')
        .update({
          delivered_at: new Date().toISOString()
        })
        .eq('id', orderItem.order_id);

      if (error) {
        logger.error({ error }, 'Error marking as delivered');
        throw new Response(error.message, { status: 500 });
      }

      return { success: true };
    }

    if (action === 'add-order-note') {
      const orderItemId = formData.get('orderItemId') as string;
      const note = formData.get('note') as string;
      
      // Get current metadata
      const { data: orderItem } = await client
        .from('order_items')
        .select('metadata')
        .eq('id', orderItemId)
        .eq('vendor_id', vendorProfile.id)
        .single();

      if (!orderItem) {
        throw new Response('Order item not found', { status: 404 });
      }

      const currentMetadata = orderItem.metadata || {};
      const updatedMetadata = {
        ...currentMetadata,
        notes: note,
        noteUpdatedAt: new Date().toISOString()
      };

      const { error } = await client
        .from('order_items')
        .update({ metadata: updatedMetadata })
        .eq('id', orderItemId)
        .eq('vendor_id', vendorProfile.id);

      if (error) {
        logger.error({ error }, 'Error adding order note');
        throw new Response(error.message, { status: 500 });
      }

      return { success: true };
    }

    if (action === 'bulk-fulfill') {
      const orderItemIds = JSON.parse(formData.get('orderItemIds') as string);
      
      const { error } = await client
        .from('order_items')
        .update({
          fulfillment_status: 'fulfilled',
          fulfilled_at: new Date().toISOString()
        })
        .in('id', orderItemIds)
        .eq('vendor_id', vendorProfile.id);

      if (error) {
        logger.error({ error }, 'Error bulk fulfilling orders');
        throw new Response(error.message, { status: 500 });
      }

      return { success: true, fulfilled: orderItemIds.length };
    }

    throw new Response('Invalid action', { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing order action');
    throw new Response('Server error', { status: 500 });
  }
}

/**
 * Vendor orders management page
 */
export default function VendorOrdersPage() {
  const data = useLoaderData<typeof loader>();
  return <VendorOrdersManager {...data} />;
}