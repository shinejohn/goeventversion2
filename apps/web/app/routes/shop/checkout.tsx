import React from 'react';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/checkout';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    // Get current user
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return { cartItems: [], user: null, account: null };
    }
    
    // Load user account
    const { data: account } = await client
      .from('accounts')
      .select('*')
      .eq('id', user.id)
      .single();
    
    // Load cart items
    const { data: cartItems, error } = await client
      .from('cart_items')
      .select(`
        *,
        product:shop_products(*)
      `)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error loading cart items:', error);
      return { cartItems: [], user, account };
    }
    
    return { cartItems: cartItems || [], user, account };
  } catch (error) {
    console.error('Checkout loader error:', error);
    return { cartItems: [], user: null, account: null };
  }
};

export const action = async ({ request }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'Please log in to complete checkout' };
    }
    
    // Get cart items
    const { data: cartItems, error: cartError } = await client
      .from('cart_items')
      .select(`
        *,
        product:shop_products(*)
      `)
      .eq('user_id', user.id);
    
    if (cartError || !cartItems || cartItems.length === 0) {
      return { success: false, error: 'No items in cart' };
    }
    
    // Calculate total
    const total = cartItems.reduce((sum: number, item: any) => {
      return sum + (item.product?.price || 0) * item.quantity;
    }, 0);
    
    // Create order
    const { data: order, error: orderError } = await client
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: total,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single();
    
    if (orderError) {
      return { success: false, error: orderError.message };
    }
    
    // Create order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product?.price || 0
    }));
    
    const { error: itemsError } = await client
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      return { success: false, error: itemsError.message };
    }
    
    // Clear cart
    const { error: clearError } = await client
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);
    
    if (clearError) {
      console.error('Error clearing cart:', clearError);
    }
    
    // Update product stock
    for (const item of cartItems) {
      if (item.product?.stock_quantity !== null) {
        await client
          .from('shop_products')
          .update({
            stock_quantity: (item.product.stock_quantity || 0) - item.quantity
          })
          .eq('id', item.product_id);
      }
    }
    
    return { 
      success: true, 
      orderId: order.id,
      message: 'Order placed successfully!' 
    };
  } catch (error) {
    return { success: false, error: 'Failed to process order' };
  }
};

export default function CheckoutPage({ loaderData, actionData }: Route.ComponentProps) {
  const total = loaderData.cartItems.reduce((sum: number, item: any) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);
  
  if (actionData?.success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Your order #{actionData.orderId} has been received and is being processed.
            </p>
            <div className="space-x-4">
              <a
                href="/shop"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Continue Shopping
              </a>
              <a
                href="/account/orders"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View Orders
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!loaderData.user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Log In</h1>
            <p className="text-gray-600 mb-6">You need to be logged in to complete checkout.</p>
            <a
              href="/auth/sign-in"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  if (loaderData.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add some items to get started!</p>
            <a
              href="/shop"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Complete your purchase</p>
        </div>
        
        {actionData?.error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {actionData.error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {loaderData.cartItems.map((item: any) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-12 w-12">
                        {item.product?.image_url ? (
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={item.product.image_url}
                            alt={item.product.name}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">📦</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.product?.name || 'Unknown Product'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × ${item.product?.price || 0}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between text-base font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
                <form method="post" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={loaderData.user.email}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Complete Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}