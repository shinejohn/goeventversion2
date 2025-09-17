import type { Route } from './+types/route.ts';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { ProductDetailPage } from '~/components/magic-patterns/pages/ProductDetailPage';

export async function loader(args: Route.LoaderArgs) {
  const { params } = args;
  const client = getSupabaseServerClient(args.request);
  
  try {
    // Fetch product from database
    const { data: product, error } = await client
      .from('products')
      .select('*')
      .eq('id', params.productId)
      .eq('is_active', true)
      .single();
    
    if (error || !product) {
      throw new Response('Product not found', { status: 404 });
    }
    
    // Fetch related products from same category
    const { data: relatedProducts } = await client
      .from('products')
      .select('*')
      .eq('category', product.category)
      .eq('is_active', true)
      .neq('id', product.id)
      .limit(4);
    
    // Transform product data to match ProductDetailPage component structure
    const transformedProduct = {
      id: product.id,
      name: product.name,
      description: product.description || '',
      image: product.images && product.images[0] ? product.images[0] : 'https://picsum.photos/seed/product/400/400',
      price: `$${product.price}`,
      category: product.category,
      stock_quantity: product.stock_count || 0,
      // Additional fields that might be in the product
      event: product.event || undefined,
      artist: product.artist || undefined,
      era: product.era || undefined,
      includes: product.includes || undefined,
      featured: product.is_featured ? 'Featured' : undefined,
    };
    
    const transformedRelated = (relatedProducts || []).map(p => ({
      id: p.id,
      name: p.name,
      image: p.images && p.images[0] ? p.images[0] : 'https://picsum.photos/seed/product/400/400',
      price: `$${p.price}`,
      category: p.category,
      stock_quantity: p.stock_count || 0,
    }));
    
    return { 
      product: transformedProduct,
      relatedProducts: transformedRelated
    };
    
  } catch (error) {
    console.error('Error loading product:', error);
    throw new Response('Product not found', { status: 404 });
  }
}

export const meta = ({ data }: Route.MetaArgs) => {
  if (!data?.product) {
    return [{ title: 'Product Not Found' }];
  }
  
  return [
    {
      title: `${data.product.name} | GoEventCity Shop`,
    },
    {
      name: 'description',
      content: data.product.description,
    },
  ];
};

export default function ProductDetailRoute({ loaderData }: Route.ComponentProps) {
  const { product, relatedProducts } = loaderData;
  
  return <ProductDetailPage product={product} relatedProducts={relatedProducts} />;
}