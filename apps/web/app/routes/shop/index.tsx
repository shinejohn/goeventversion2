import type { Route } from './+types/route.ts';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { ShopPage } from '~/components/magic-patterns/pages/ShopPage';

export async function loader(args: Route.LoaderArgs) {
  const client = getSupabaseServerClient(args.request);
  
  try {
    // Fetch products from the database
    const { data: products, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching products:', error);
      return { products: [] };
    }

    // Transform data for the UI component
    const transformedProducts = products?.map(product => ({
      id: product.id,
      name: product.name || 'Unnamed Product',
      description: product.description || 'No description available',
      price: product.price || 0,
      image: product.image_url || '/placeholder-product.jpg',
      category: product.category || 'General',
      inStock: product.in_stock !== false,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
      seller: product.seller_name || 'GoEventCity',
      tags: product.tags || [],
      slug: product.slug || `product-${product.id}`,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    })) || [];

    return { products: transformedProducts };
  } catch (error) {
    console.error('Shop loader error:', error);
    return { products: [] };
  }
}

export default function ShopRoute({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;
  
  return <ShopPage products={products} />;
}