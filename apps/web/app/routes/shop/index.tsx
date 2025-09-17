import type { Route } from './+types/route.ts';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { ShopPage } from '~/components/magic-patterns/pages/shop/ShopPage';

export async function loader(args: Route.LoaderArgs) {
  const client = getSupabaseServerClient(args.request);
  
  try {
    // Fetch real products from Supabase cloud database
    const { data: dbProducts, error: dbError } = await client
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (!dbError && dbProducts && dbProducts.length > 0) {
      console.log('✅ Loaded', dbProducts.length, 'products from database');
      
      // Transform database products to match ShopPage component structure
      const transformedProducts = dbProducts.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        category: product.category,
        subcategory: product.subcategory,
        price: Number(product.price),
        compareAtPrice: product.compare_at_price ? Number(product.compare_at_price) : null,
        currency: product.currency || 'USD',
        images: product.images || [],
        brand: product.brand,
        sku: product.sku || '',
        inStock: product.in_stock,
        stockCount: product.stock_count || 0,
        rating: product.rating ? Number(product.rating) : null,
        reviewCount: product.review_count || 0,
        tags: product.tags || [],
        features: product.features || [],
        isNew: product.is_new || false,
        isSale: product.is_sale || false,
        isFeatured: product.is_featured || false,
      }));
      
      return { products: transformedProducts };
    }
    
    console.log('📝 Database query result:', dbError?.message || 'No products found');
    
    // Return empty products array if no data from database
    return { products: [] };
  } catch (error) {
    console.error('Shop loader error:', error);
    return { products: [] };
  }
}

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: 'GoEventCity Fan Shop | Merchandise & Apparel',
    },
    {
      name: 'description',
      content: 'Show your love for local events with our exclusive merchandise. T-shirts, hoodies, accessories, and more.',
    },
  ];
};

export default function ShopRoute({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;
  
  return <ShopPage products={products} />;
}