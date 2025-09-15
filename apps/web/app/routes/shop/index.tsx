import type { Route } from './+types/route.ts';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { ShopPage } from '~/components/magic-patterns/pages/ShopPage';

export async function loader(args: Route.LoaderArgs) {
  const client = getSupabaseServerClient(args.request);
  
  try {
    // For now, return mock merchandise data since products table may not exist
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
        reviews: 127,
        seller: 'GoEventCity',
        tags: ['cotton', 'unisex', 'classic'],
        slug: 'goeventcity-classic-tshirt',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
        reviews: 89,
        seller: 'GoEventCity',
        tags: ['warm', 'cozy', 'unisex'],
        slug: 'event-lover-hoodie',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
        reviews: 43,
        seller: 'GoEventCity',
        tags: ['adjustable', 'unisex', 'music'],
        slug: 'local-music-supporter-cap',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
        reviews: 156,
        seller: 'GoEventCity',
        tags: ['vinyl', 'weatherproof', 'variety'],
        slug: 'event-memories-sticker-pack',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
        reviews: 72,
        seller: 'GoEventCity',
        tags: ['artwork', 'framed', 'collectible'],
        slug: 'concert-poster-collection',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
        reviews: 91,
        seller: 'GoEventCity',
        tags: ['ceramic', 'dishwasher-safe', 'microwave-safe'],
        slug: 'event-enthusiast-mug',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return { products: mockProducts };
  } catch (error) {
    console.error('Shop loader error:', error);
    return { products: [] };
  }
}

export const meta = ({ data }: Route.MetaArgs) => {
  return [
    {
      title: 'Event Equipment & Gear Shop | GoEventCity',
    },
    {
      name: 'description',
      content: 'Everything you need to make your events unforgettable. Audio equipment, lighting, stage gear, instruments, and more.',
    },
  ];
};

export default function ShopRoute({ loaderData }: Route.ComponentProps) {
  const { products } = loaderData;
  
  return <ShopPage products={products} />;
}