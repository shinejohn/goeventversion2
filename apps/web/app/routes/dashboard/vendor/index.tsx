import React from 'react';
import { json, redirect } from 'react-router';
import { useLoaderData } from 'react-router';
import type { Route } from '~/types/app/routes/dashboard/vendor/index';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';
import { VendorDashboard } from '~/components/magic-patterns/components/vendor/VendorDashboard';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return redirect('/auth/login');
    }

    // Get vendor profile
    const { data: vendorProfile } = await client
      .from('vendor_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!vendorProfile) {
      return json({ 
        needsVendorProfile: true,
        vendor: null,
        stats: {
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          averageRating: 0,
          pendingPayouts: 0
        },
        recentOrders: [],
        topProducts: [],
        recentPayouts: []
      });
    }

    // Get vendor statistics
    const [
      { count: totalProducts },
      { count: totalOrders },
      { data: orderItems },
      { data: recentOrders },
      { data: topProducts },
      { data: recentPayouts }
    ] = await Promise.all([
      // Total products
      client
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorProfile.id)
        .eq('status', 'active'),
      
      // Total orders
      client
        .from('order_items')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorProfile.id),
      
      // Order items for revenue calculation
      client
        .from('order_items')
        .select('vendor_commission')
        .eq('vendor_id', vendorProfile.id),
      
      // Recent orders (last 10)
      client
        .from('order_items')
        .select(`
          id,
          quantity,
          subtotal,
          vendor_commission,
          created_at,
          order:marketplace_orders!inner(
            id,
            order_number,
            status,
            user_id,
            email
          ),
          product:products!inner(
            id,
            name,
            images
          )
        `)
        .eq('vendor_id', vendorProfile.id)
        .order('created_at', { ascending: false })
        .limit(10),
      
      // Top selling products
      client
        .from('products')
        .select(`
          id,
          name,
          images,
          price,
          purchase_count,
          rating,
          review_count
        `)
        .eq('vendor_id', vendorProfile.id)
        .eq('status', 'active')
        .order('purchase_count', { ascending: false })
        .limit(5),
      
      // Recent payouts
      client
        .from('vendor_payouts')
        .select('*')
        .eq('vendor_id', vendorProfile.id)
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    // Calculate total revenue
    const totalRevenue = orderItems?.reduce((sum, item) => sum + (item.vendor_commission || 0), 0) || 0;

    // Calculate pending payouts
    const { data: pendingOrderItems } = await client
      .from('order_items')
      .select('vendor_commission')
      .eq('vendor_id', vendorProfile.id)
      .eq('fulfillment_status', 'fulfilled')
      .is('payout_id', null); // Not yet paid out

    const pendingPayouts = pendingOrderItems?.reduce((sum, item) => sum + (item.vendor_commission || 0), 0) || 0;

    // Transform data for component
    const stats = {
      totalProducts: totalProducts || 0,
      totalOrders: totalOrders || 0,
      totalRevenue,
      averageRating: vendorProfile.rating || 0,
      pendingPayouts
    };

    const transformedRecentOrders = (recentOrders || []).map(item => ({
      id: item.id,
      orderNumber: item.order.order_number,
      orderStatus: item.order.status,
      customerEmail: item.order.email,
      productName: item.product.name,
      productImage: item.product.images?.[0] || '',
      quantity: item.quantity,
      subtotal: item.subtotal,
      commission: item.vendor_commission,
      orderDate: item.created_at
    }));

    const transformedTopProducts = (topProducts || []).map(product => ({
      id: product.id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      sales: product.purchase_count || 0,
      rating: product.rating || 0,
      reviews: product.review_count || 0
    }));

    const transformedRecentPayouts = (recentPayouts || []).map(payout => ({
      id: payout.id,
      payoutNumber: payout.payout_number,
      amount: payout.amount,
      status: payout.status,
      method: payout.method,
      date: payout.created_at,
      processedAt: payout.processed_at
    }));

    return json({
      vendor: {
        id: vendorProfile.id,
        businessName: vendorProfile.business_name,
        vendorType: vendorProfile.vendor_type,
        isVerified: vendorProfile.is_verified,
        status: vendorProfile.status,
        rating: vendorProfile.rating,
        reviewCount: vendorProfile.review_count,
        totalSales: vendorProfile.total_sales,
        totalRevenue: vendorProfile.total_revenue,
        commissionRate: vendorProfile.commission_rate
      },
      stats,
      recentOrders: transformedRecentOrders,
      topProducts: transformedTopProducts,
      recentPayouts: transformedRecentPayouts
    });

  } catch (error) {
    logger.error({ error }, 'Error loading vendor dashboard');
    return json({ 
      vendor: null,
      stats: {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        averageRating: 0,
        pendingPayouts: 0
      },
      recentOrders: [],
      topProducts: [],
      recentPayouts: []
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

    if (action === 'create-vendor-profile') {
      const profileData = {
        user_id: user.id,
        vendor_type: formData.get('vendorType') as string,
        business_name: formData.get('businessName') as string,
        business_email: formData.get('businessEmail') as string,
        business_phone: formData.get('businessPhone') as string,
        tax_id: formData.get('taxId') as string,
        status: 'pending'
      };

      const { data, error } = await client
        .from('vendor_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        logger.error({ error }, 'Error creating vendor profile');
        return json({ success: false, error: error.message });
      }

      return json({ success: true, vendor: data });
    }

    if (action === 'update-vendor-profile') {
      const updates: any = {};
      
      if (formData.has('businessName')) updates.business_name = formData.get('businessName');
      if (formData.has('businessEmail')) updates.business_email = formData.get('businessEmail');
      if (formData.has('businessPhone')) updates.business_phone = formData.get('businessPhone');
      if (formData.has('taxId')) updates.tax_id = formData.get('taxId');
      
      updates.updated_at = new Date().toISOString();

      const { error } = await client
        .from('vendor_profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        logger.error({ error }, 'Error updating vendor profile');
        return json({ success: false, error: error.message });
      }

      return json({ success: true });
    }

    return json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing vendor action');
    return json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

/**
 * Vendor dashboard main page
 */
export default function VendorDashboardPage() {
  const data = useLoaderData<typeof loader>();
  return <VendorDashboard {...data} />;
}