import React from 'react';
import { ProductDetailPage } from '~/components/magic-patterns/pages/ProductDetailPage';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import type { Route } from '~/types/app/routes/shop/product/$id/+types';

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const client = getSupabaseServerClient(request);
  const productId = params.id;
  
  try {
    // Load product with full details
    const { data: product, error } = await client
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .single();
      
    if (error || !product) {
      console.warn('Product not found:', { error, productId });
      return { product: null, relatedProducts: [] };
    }
    
    // Load related products (same category, excluding current product)
    const { data: relatedProducts } = await client
      .from('products')
      .select('*')
      .eq('category', product.category)
      .neq('id', productId)
      .eq('is_active', true)
      .limit(4);
    
    // Transform product to match UI expectations
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      price: `$${product.price.toFixed(2)}`,
      category: product.category,
      stock_quantity: product.stock_quantity,
      // Include optional metadata fields
      ...(product.event && { event: product.event }),
      ...(product.artist && { artist: product.artist }),
      ...(product.era && { era: product.era }),
      ...(product.includes && { includes: product.includes }),
      ...(product.featured && { featured: product.featured })
    };

    // Transform related products
    const transformedRelatedProducts = relatedProducts?.map(relProduct => ({
      id: relProduct.id,
      name: relProduct.name,
      image: relProduct.image,
      price: `$${relProduct.price.toFixed(2)}`,
      category: relProduct.category,
      // Include optional metadata fields
      ...(relProduct.event && { event: relProduct.event }),
      ...(relProduct.artist && { artist: relProduct.artist }),
      ...(relProduct.era && { era: relProduct.era }),
      ...(relProduct.includes && { includes: relProduct.includes }),
      ...(relProduct.featured && { featured: relProduct.featured })
    })) || [];
    
    return {
      product: transformedProduct,
      relatedProducts: transformedRelatedProducts
    };
    
  } catch (error) {
    console.error('Error loading product:', error);
    return { product: null, relatedProducts: [] };
  }
};

export const meta = ({ data }: Route.MetaArgs) => {
  const productName = data?.product?.name || 'Product';
  
  return [
    {
      title: `${productName} - GoEventCity Shop`,
    },
    {
      name: 'description',
      content: data?.product?.description || `Shop for ${productName} and more at GoEventCity`,
    },
  ];
};

export default function ProductDetailRoute({ loaderData }: Route.ComponentProps) {
  const { product, relatedProducts } = loaderData;
  
  return (
    <ProductDetailPage 
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}