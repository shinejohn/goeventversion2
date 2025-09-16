import React from 'react';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from './+types/cart';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  
  try {
    // Get current user
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return { cartItems: [], user: null };
    }
    
    // Load cart items from database
    const { data: cartItems, error } = await client
      .from('cart_items')
      .select(`
        *,
        product:shop_products(*)
      `)
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error loading cart items:', error);
      return { cartItems: [], user };
    }
    
    return { cartItems: cartItems || [], user };
  } catch (error) {
    console.error('Cart loader error:', error);
    return { cartItems: [], user: null };
  }
};

export const action = async ({ request }: Route.ActionArgs) => {
  const client = getSupabaseServerClient(request);
  const formData = await request.formData();
  const action = formData.get('action') as string;
  const productId = formData.get('productId') as string;
  const quantity = parseInt(formData.get('quantity') as string) || 1;
  
  try {
    const { data: { user } } = await client.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'Please log in to manage your cart' };
    }
    
    if (action === 'add') {
      // Check if item already exists in cart
      const { data: existingItem } = await client
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();
      
      if (existingItem) {
        // Update quantity
        const { error } = await client
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);
        
        if (error) {
          return { success: false, error: error.message };
        }
      } else {
        // Add new item
        const { error } = await client
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity
          });
        
        if (error) {
          return { success: false, error: error.message };
        }
      }
      
      return { success: true, message: 'Item added to cart' };
    } else if (action === 'update') {
      const { error } = await client
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, message: 'Cart updated' };
    } else if (action === 'remove') {
      const { error } = await client
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true, message: 'Item removed from cart' };
    }
    
    return { success: false, error: 'Invalid action' };
  } catch (error) {
    return { success: false, error: 'Failed to update cart' };
  }
};

export default function CartPage({ loaderData, actionData }: Route.ComponentProps) {
  const total = loaderData.cartItems.reduce((sum: number, item: any) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-gray-600">Review your items before checkout</p>
        </div>
        
        {actionData?.success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {actionData.message}
          </div>
        )}
        
        {actionData?.error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {actionData.error}
          </div>
        )}
        
        {!loaderData.user ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Please Log In</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your cart.</p>
            <a
              href="/auth/sign-in"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign In
            </a>
          </div>
        ) : loaderData.cartItems.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some items to get started!</p>
            <a
              href="/shop"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Cart Items</h2>
                  <div className="space-y-4">
                    {loaderData.cartItems.map((item: any) => (
                      <div key={item.id} className="flex items-center space-x-4 border-b border-gray-200 pb-4">
                        <div className="flex-shrink-0 h-16 w-16">
                          {item.product?.image_url ? (
                            <img
                              className="h-16 w-16 rounded-lg object-cover"
                              src={item.product.image_url}
                              alt={item.product.name}
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-lg">📦</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900">
                            {item.product?.name || 'Unknown Product'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            ${item.product?.price || 0} each
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <form method="post" className="flex items-center space-x-2">
                            <input type="hidden" name="action" value="update" />
                            <input type="hidden" name="productId" value={item.product_id} />
                            <input
                              type="number"
                              name="quantity"
                              min="1"
                              defaultValue={item.quantity}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <button
                              type="submit"
                              className="text-sm text-indigo-600 hover:text-indigo-900"
                            >
                              Update
                            </button>
                          </form>
                          
                          <form method="post">
                            <input type="hidden" name="action" value="remove" />
                            <input type="hidden" name="productId" value={item.product_id} />
                            <button
                              type="submit"
                              className="text-sm text-red-600 hover:text-red-900"
                            >
                              Remove
                            </button>
                          </form>
                        </div>
                        
                        <div className="text-sm font-medium text-gray-900">
                          ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">$0.00</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-base font-medium">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <a
                      href="/shop/checkout"
                      className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Proceed to Checkout
                    </a>
                  </div>
                  
                  <div className="mt-4">
                    <a
                      href="/shop"
                      className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Continue Shopping
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
