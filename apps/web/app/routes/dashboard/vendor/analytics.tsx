import React from 'react';
import { redirect, useLoaderData } from 'react-router';
import type { Route } from '~/types/app/routes/dashboard/vendor/analytics';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';
import { VendorAnalytics } from '~/components/magic-patterns/components/vendor/VendorAnalytics';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  const url = new URL(request.url);
  const period = url.searchParams.get('period') || '30d'; // 7d, 30d, 90d, 1y
  
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
      return redirect('/dashboard/vendor');
    }

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    let compareStartDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        compareStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        compareStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        compareStartDate = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
        break;
      default: // 30d
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        compareStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        break;
    }

    const compareEndDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);

    // Get current period data
    const [
      { count: totalOrders },
      { data: currentRevenue },
      { count: totalCustomers },
      { data: productViews },
      { data: topProducts },
      { data: categoryPerformance },
      { data: dailyStats }
    ] = await Promise.all([
      // Total orders
      client
        .from('order_items')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorProfile.id)
        .gte('created_at', startDate.toISOString()),

      // Revenue data
      client
        .from('order_items')
        .select('vendor_commission, created_at')
        .eq('vendor_id', vendorProfile.id)
        .gte('created_at', startDate.toISOString()),

      // Unique customers
      client
        .from('order_items')
        .select('order!inner(user_id)', { count: 'exact', head: true })
        .eq('vendor_id', vendorProfile.id)
        .gte('created_at', startDate.toISOString()),

      // Product views
      client
        .from('products')
        .select('view_count')
        .eq('vendor_id', vendorProfile.id),

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
        .gt('purchase_count', 0)
        .order('purchase_count', { ascending: false })
        .limit(10),

      // Category performance
      client
        .from('order_items')
        .select(`
          vendor_commission,
          product:products!inner(category)
        `)
        .eq('vendor_id', vendorProfile.id)
        .gte('created_at', startDate.toISOString()),

      // Daily stats for charts
      client
        .rpc('get_vendor_daily_stats', {
          p_vendor_id: vendorProfile.id,
          p_start_date: startDate.toISOString().split('T')[0],
          p_end_date: now.toISOString().split('T')[0]
        })
    ]);

    // Get comparison period data
    const [
      { count: compareOrders },
      { data: compareRevenue }
    ] = await Promise.all([
      client
        .from('order_items')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorProfile.id)
        .gte('created_at', compareStartDate.toISOString())
        .lt('created_at', compareEndDate.toISOString()),

      client
        .from('order_items')
        .select('vendor_commission')
        .eq('vendor_id', vendorProfile.id)
        .gte('created_at', compareStartDate.toISOString())
        .lt('created_at', compareEndDate.toISOString())
    ]);

    // Calculate metrics
    const currentTotalRevenue = currentRevenue?.reduce((sum, item) => sum + (item.vendor_commission || 0), 0) || 0;
    const compareTotalRevenue = compareRevenue?.reduce((sum, item) => sum + (item.vendor_commission || 0), 0) || 0;
    const totalViews = productViews?.reduce((sum, product) => sum + (product.view_count || 0), 0) || 0;
    
    // Calculate conversion rate (orders / views)
    const conversionRate = totalViews > 0 ? ((totalOrders || 0) / totalViews) * 100 : 0;
    
    // Calculate average order value
    const averageOrderValue = (totalOrders || 0) > 0 ? currentTotalRevenue / (totalOrders || 1) : 0;

    // Calculate growth rates
    const orderGrowth = compareOrders ? ((totalOrders || 0) - compareOrders) / compareOrders * 100 : 0;
    const revenueGrowth = compareTotalRevenue ? (currentTotalRevenue - compareTotalRevenue) / compareTotalRevenue * 100 : 0;

    // Process category performance
    const categoryStats: { [key: string]: { revenue: number, orders: number } } = {};
    categoryPerformance?.forEach(item => {
      const category = item.product?.category || 'Other';
      if (!categoryStats[category]) {
        categoryStats[category] = { revenue: 0, orders: 0 };
      }
      categoryStats[category].revenue += item.vendor_commission || 0;
      categoryStats[category].orders += 1;
    });

    const topCategories = Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        revenue: stats.revenue,
        orders: stats.orders,
        percentage: currentTotalRevenue > 0 ? (stats.revenue / currentTotalRevenue) * 100 : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Process daily stats for charts
    const chartData = dailyStats || [];

    // Get recent reviews
    const { data: recentReviews } = await client
      .from('product_reviews')
      .select(`
        id,
        rating,
        title,
        comment,
        created_at,
        product:products!inner(
          id,
          name,
          images
        )
      `)
      .eq('product.vendor_id', vendorProfile.id)
      .order('created_at', { ascending: false })
      .limit(5);

    const analytics = {
      summary: {
        totalRevenue: currentTotalRevenue,
        totalOrders: totalOrders || 0,
        totalCustomers: totalCustomers || 0,
        averageOrderValue,
        conversionRate,
        revenueGrowth,
        orderGrowth
      },
      charts: {
        revenue: chartData,
        orders: chartData,
        traffic: chartData
      },
      topProducts: (topProducts || []).map(product => ({
        id: product.id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        sales: product.purchase_count || 0,
        revenue: (product.purchase_count || 0) * product.price,
        rating: product.rating || 0,
        reviews: product.review_count || 0
      })),
      topCategories,
      recentReviews: (recentReviews || []).map(review => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        date: review.created_at,
        productName: review.product.name,
        productImage: review.product.images?.[0] || ''
      })),
      period
    };

    return {
      vendor: {
        id: vendorProfile.id,
        businessName: vendorProfile.business_name,
        status: vendorProfile.status,
        rating: vendorProfile.rating,
        totalSales: vendorProfile.total_sales,
        totalRevenue: vendorProfile.total_revenue
      },
      analytics
    };

  } catch (error) {
    logger.error({ error }, 'Error loading vendor analytics');
    return {
      vendor: null,
      analytics: {
        summary: {
          totalRevenue: 0,
          totalOrders: 0,
          totalCustomers: 0,
          averageOrderValue: 0,
          conversionRate: 0,
          revenueGrowth: 0,
          orderGrowth: 0
        },
        charts: { revenue: [], orders: [], traffic: [] },
        topProducts: [],
        topCategories: [],
        recentReviews: [],
        period: '30d'
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

    if (action === 'export-analytics') {
      const period = formData.get('period') as string;
      const format = formData.get('format') as string; // csv, pdf, excel
      
      // TODO: Generate analytics report
      // This would typically create a file and return a download URL
      
      return { 
        success: true, 
        message: 'Analytics export started. You will receive an email when ready.',
        exportId: `export-${Date.now()}`
      };
    }

    if (action === 'update-analytics-preferences') {
      const emailReports = formData.get('emailReports') === 'true';
      const reportFrequency = formData.get('reportFrequency') as string;
      
      // Update vendor preferences
      const { error } = await client
        .from('vendor_profiles')
        .update({
          policies: {
            ...vendorProfile.policies,
            analytics: {
              emailReports,
              reportFrequency
            }
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', vendorProfile.id);

      if (error) {
        logger.error({ error }, 'Error updating analytics preferences');
        throw new Response(error.message, { status: 500 });
      }

      return { success: true };
    }

    throw new Response('Invalid action', { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing analytics action');
    throw new Response('Server error', { status: 500 });
  }
}

/**
 * Vendor analytics and reporting page
 */
export default function VendorAnalyticsPage() {
  const data = useLoaderData<typeof loader>();
  return <VendorAnalytics {...data} />;
}