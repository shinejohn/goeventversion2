import type { Route } from './+types/route.ts';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { ShopPage } from '~/components/magic-patterns/pages/shop/ShopPage';

export async function loader(args: Route.LoaderArgs) {
  const client = getSupabaseServerClient(args.request);
  
  try {
    // Try to fetch real products from database first
    const { data: dbProducts, error: dbError } = await client
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (!dbError && dbProducts && dbProducts.length > 0) {
      console.log('✅ Loaded', dbProducts.length, 'products from database');
      return { products: dbProducts };
    }
    
    console.log('📝 Using mock data - database products not available:', dbError?.message);
    
    // Fallback to mock data if database is not available
    const mockProducts = [
      {
        id: '1',
        name: 'GoEventCity Classic T-Shirt',
        description: 'Comfortable cotton t-shirt with our iconic logo',
        price: 24.99,
        image: 'https://picsum.photos/seed/tshirt1/400/400',
        category: 'T-Shirts',
        inStock: true,
        rating: 4.8,
        reviewCount: 127,
        seller: 'GoEventCity',
        tags: ['cotton', 'unisex', 'classic'],
        slug: 'goeventcity-classic-tshirt',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        features: ['100% Cotton', 'Machine Washable', 'Unisex Fit'],
        isNew: true,
        isSale: false,
        isFeatured: true,
        stockCount: 50,
        brand: 'GoEventCity',
        sku: 'GEC-TS-001',
        currency: 'USD',
        images: ['https://picsum.photos/seed/tshirt1/400/400'],
        subcategory: 'T-Shirts',
        compareAtPrice: null
      },
      {
        id: '2',
        name: 'Event Lover Hoodie',
        description: 'Cozy hoodie perfect for those chilly outdoor events',
        price: 49.99,
        image: 'https://picsum.photos/seed/hoodie1/400/400',
        category: 'Hoodies',
        inStock: true,
        rating: 4.9,
        reviewCount: 89,
        seller: 'GoEventCity',
        tags: ['warm', 'cozy', 'unisex'],
        slug: 'event-lover-hoodie',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        features: ['Fleece Lined', 'Kangaroo Pocket', 'Drawstring Hood'],
        isNew: false,
        isSale: true,
        isFeatured: true,
        stockCount: 25,
        brand: 'GoEventCity',
        sku: 'GEC-HD-001',
        currency: 'USD',
        images: ['https://picsum.photos/seed/hoodie1/400/400'],
        subcategory: 'Hoodies',
        compareAtPrice: 59.99
      },
      {
        id: '3',
        name: 'Local Music Supporter Cap',
        description: 'Show your support for local artists with this stylish cap',
        price: 19.99,
        image: 'https://picsum.photos/seed/cap1/400/400',
        category: 'Hats & Caps',
        inStock: true,
        rating: 4.6,
        reviewCount: 43,
        seller: 'GoEventCity',
        tags: ['adjustable', 'unisex', 'music'],
        slug: 'local-music-supporter-cap',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        features: ['Adjustable Strap', 'Curved Brim', 'Embroidered Logo'],
        isNew: false,
        isSale: false,
        isFeatured: false,
        stockCount: 30,
        brand: 'GoEventCity',
        sku: 'GEC-CP-001',
        currency: 'USD',
        images: ['https://picsum.photos/seed/cap1/400/400'],
        subcategory: 'Caps',
        compareAtPrice: null
      },
      {
        id: '4',
        name: 'Event Memories Sticker Pack',
        description: 'Decorate your laptop, water bottle, or anywhere with these fun stickers',
        price: 8.99,
        image: 'https://picsum.photos/seed/stickers1/400/400',
        category: 'Stickers',
        inStock: true,
        rating: 4.7,
        reviewCount: 156,
        seller: 'GoEventCity',
        tags: ['vinyl', 'weatherproof', 'variety'],
        slug: 'event-memories-sticker-pack',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        features: ['Weatherproof Vinyl', '10 Different Designs', 'Easy Peel'],
        isNew: true,
        isSale: false,
        isFeatured: false,
        stockCount: 100,
        brand: 'GoEventCity',
        sku: 'GEC-ST-001',
        currency: 'USD',
        images: ['https://picsum.photos/seed/stickers1/400/400'],
        subcategory: 'Stickers',
        compareAtPrice: null
      },
      {
        id: '5',
        name: 'Concert Poster Collection',
        description: 'High-quality prints of iconic local concert posters',
        price: 15.99,
        image: 'https://picsum.photos/seed/poster1/400/400',
        category: 'Posters',
        inStock: true,
        rating: 4.5,
        reviewCount: 72,
        seller: 'GoEventCity',
        tags: ['artwork', 'framed', 'collectible'],
        slug: 'concert-poster-collection',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        features: ['High-Quality Print', '11x17 Size', 'Glossy Finish'],
        isNew: false,
        isSale: false,
        isFeatured: true,
        stockCount: 15,
        brand: 'GoEventCity',
        sku: 'GEC-PS-001',
        currency: 'USD',
        images: ['https://picsum.photos/seed/poster1/400/400'],
        subcategory: 'Posters',
        compareAtPrice: null
      },
      {
        id: '6',
        name: 'Event Enthusiast Mug',
        description: 'Start your day with coffee and show your event passion',
        price: 12.99,
        image: 'https://picsum.photos/seed/mug1/400/400',
        category: 'Mugs & Drinkware',
        inStock: true,
        rating: 4.8,
        reviewCount: 91,
        seller: 'GoEventCity',
        tags: ['ceramic', 'dishwasher-safe', 'microwave-safe'],
        slug: 'event-enthusiast-mug',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        features: ['Dishwasher Safe', 'Microwave Safe', '11oz Capacity'],
        isNew: false,
        isSale: false,
        isFeatured: false,
        stockCount: 40,
        brand: 'GoEventCity',
        sku: 'GEC-MG-001',
        currency: 'USD',
        images: ['https://picsum.photos/seed/mug1/400/400'],
        subcategory: 'Mugs',
        compareAtPrice: null
      }
    ];

    console.log('✅ Loaded', mockProducts.length, 'mock products');
    return { products: mockProducts };
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