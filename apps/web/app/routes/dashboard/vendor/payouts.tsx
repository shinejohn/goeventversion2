import React from 'react';
import { redirect, useLoaderData } from 'react-router';
import type { Route } from '~/types/app/routes/dashboard/vendor/payouts';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { getLogger } from '@kit/shared/logger';
import { VendorPayouts } from '~/components/magic-patterns/components/vendor/VendorPayouts';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const logger = await getLogger();
  const client = getSupabaseServerClient(request);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const status = url.searchParams.get('status') || 'all';
  
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

    // Build query for payouts
    let query = client
      .from('vendor_payouts')
      .select('*', { count: 'exact' })
      .eq('vendor_id', vendorProfile.id);

    // Apply status filter
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    // Order by created date
    query = query.order('created_at', { ascending: false });

    const { data: payouts, count, error } = await query;

    if (error) {
      logger.error({ error }, 'Error fetching vendor payouts');
      throw error;
    }

    // Get payout statistics
    const [
      { data: pendingEarnings },
      { data: totalPaidOut },
      { data: nextPayoutAmount }
    ] = await Promise.all([
      // Pending earnings (fulfilled but not paid out)
      client
        .from('order_items')
        .select('vendor_commission')
        .eq('vendor_id', vendorProfile.id)
        .eq('fulfillment_status', 'fulfilled')
        .is('payout_id', null),

      // Total paid out
      client
        .from('vendor_payouts')
        .select('amount')
        .eq('vendor_id', vendorProfile.id)
        .eq('status', 'completed'),

      // Next payout calculation
      client
        .from('order_items')
        .select('vendor_commission, fulfilled_at')
        .eq('vendor_id', vendorProfile.id)
        .eq('fulfillment_status', 'fulfilled')
        .is('payout_id', null)
        .lte('fulfilled_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // 7 days ago
    ]);

    const pendingTotal = pendingEarnings?.reduce((sum, item) => sum + (item.vendor_commission || 0), 0) || 0;
    const totalPaid = totalPaidOut?.reduce((sum, payout) => sum + (payout.amount || 0), 0) || 0;
    const nextPayout = nextPayoutAmount?.reduce((sum, item) => sum + (item.vendor_commission || 0), 0) || 0;

    // Transform payouts for component
    const transformedPayouts = (payouts || []).map(payout => ({
      id: payout.id,
      payoutNumber: payout.payout_number,
      amount: payout.amount,
      currency: payout.currency,
      status: payout.status,
      method: payout.method,
      stripeTransferId: payout.stripe_transfer_id,
      periodStart: payout.period_start,
      periodEnd: payout.period_end,
      orderCount: payout.order_count,
      notes: payout.notes,
      createdAt: payout.created_at,
      processedAt: payout.processed_at
    }));

    const stats = {
      pendingEarnings: pendingTotal,
      totalPaidOut: totalPaid,
      nextPayoutAmount: nextPayout,
      totalPayouts: count || 0
    };

    return {
      vendor: {
        id: vendorProfile.id,
        businessName: vendorProfile.business_name,
        stripeAccountId: vendorProfile.stripe_account_id,
        bankAccount: vendorProfile.bank_account,
        status: vendorProfile.status
      },
      payouts: transformedPayouts,
      stats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      filters: { status }
    };

  } catch (error) {
    logger.error({ error }, 'Error loading vendor payouts');
    return {
      vendor: null,
      payouts: [],
      stats: {
        pendingEarnings: 0,
        totalPaidOut: 0,
        nextPayoutAmount: 0,
        totalPayouts: 0
      },
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
      filters: { status: 'all' }
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
      .select('id, stripe_account_id')
      .eq('user_id', user.id)
      .single();

    if (!vendorProfile) {
      throw new Response('Vendor profile not found', { status: 404 });
    }

    if (action === 'update-payout-settings') {
      const bankAccount = JSON.parse(formData.get('bankAccount') as string);
      const minimumPayout = parseFloat(formData.get('minimumPayout') as string);
      const payoutFrequency = formData.get('payoutFrequency') as string;
      
      const { error } = await client
        .from('vendor_profiles')
        .update({
          bank_account: bankAccount,
          policies: {
            ...vendorProfile.policies,
            payouts: {
              minimumPayout,
              frequency: payoutFrequency
            }
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', vendorProfile.id);

      if (error) {
        logger.error({ error }, 'Error updating payout settings');
        throw new Response(error.message, { status: 500 });
      }

      return { success: true };
    }

    if (action === 'connect-stripe') {
      // TODO: Integrate with Stripe Connect
      // This would redirect to Stripe's OAuth flow
      
      return { 
        success: true, 
        redirectUrl: 'https://connect.stripe.com/oauth/authorize?...'
      };
    }

    if (action === 'request-payout') {
      // Check if vendor has sufficient pending earnings
      const { data: pendingEarnings } = await client
        .from('order_items')
        .select('vendor_commission')
        .eq('vendor_id', vendorProfile.id)
        .eq('fulfillment_status', 'fulfilled')
        .is('payout_id', null);

      const pendingTotal = pendingEarnings?.reduce((sum, item) => sum + (item.vendor_commission || 0), 0) || 0;

      if (pendingTotal < 10) { // Minimum $10 payout
        throw new Response('Minimum payout amount is $10', { status: 400 });
      }

      if (!vendorProfile.stripe_account_id) {
        throw new Response('Please connect your Stripe account first', { status: 400 });
      }

      // Create payout request
      const payoutNumber = `PAY-${Date.now()}-${vendorProfile.id.slice(-4)}`;
      
      const { data: payout, error } = await client
        .from('vendor_payouts')
        .insert({
          vendor_id: vendorProfile.id,
          payout_number: payoutNumber,
          amount: pendingTotal,
          currency: 'USD',
          status: 'pending',
          method: 'stripe',
          period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          period_end: new Date().toISOString().split('T')[0],
          order_count: pendingEarnings?.length || 0
        })
        .select()
        .single();

      if (error) {
        logger.error({ error }, 'Error creating payout request');
        throw new Response(error.message, { status: 500 });
      }

      // TODO: Process with Stripe
      // For now, mark as processing
      await client
        .from('vendor_payouts')
        .update({ status: 'processing' })
        .eq('id', payout.id);

      return { success: true, payoutId: payout.id };
    }

    throw new Response('Invalid action', { status: 400 });

  } catch (error) {
    logger.error({ error }, 'Error processing payout action');
    throw new Response('Server error', { status: 500 });
  }
}

/**
 * Vendor payouts management page
 */
export default function VendorPayoutsPage() {
  const data = useLoaderData<typeof loader>();
  return <VendorPayouts {...data} />;
}