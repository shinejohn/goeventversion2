const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createProductsTable() {
  try {
    // Create products table
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          image VARCHAR(500),
          category VARCHAR(100),
          subcategory VARCHAR(100),
          brand VARCHAR(100),
          sku VARCHAR(100) UNIQUE,
          in_stock BOOLEAN DEFAULT true,
          stock_count INTEGER DEFAULT 0,
          rating DECIMAL(3,2) DEFAULT 0,
          review_count INTEGER DEFAULT 0,
          tags TEXT[],
          features TEXT[],
          is_new BOOLEAN DEFAULT false,
          is_sale BOOLEAN DEFAULT false,
          is_featured BOOLEAN DEFAULT false,
          compare_at_price DECIMAL(10,2),
          currency VARCHAR(3) DEFAULT 'USD',
          images TEXT[],
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies
        CREATE POLICY "products_read" ON public.products FOR SELECT
          TO authenticated, anon USING (true);
          
        CREATE POLICY "products_manage" ON public.products FOR ALL
          TO authenticated USING (true);
      `
    });

    if (createError) {
      console.error('Error creating table:', createError);
      return;
    }

    console.log('✅ Products table created successfully');

    // Insert sample products
    const products = [
      {
        name: 'GoEventCity Classic T-Shirt',
        description: 'Comfortable cotton t-shirt with our iconic logo',
        price: 24.99,
        image: 'https://picsum.photos/seed/tshirt1/400/400',
        category: 'T-Shirts',
        subcategory: 'T-Shirts',
        brand: 'GoEventCity',
        sku: 'GEC-TS-001',
        in_stock: true,
        stock_count: 50,
        rating: 4.8,
        review_count: 127,
        tags: ['cotton', 'unisex', 'classic'],
        features: ['100% Cotton', 'Machine Washable', 'Unisex Fit'],
        is_new: true,
        is_sale: false,
        is_featured: true,
        currency: 'USD',
        images: ['https://picsum.photos/seed/tshirt1/400/400']
      },
      {
        name: 'Event Lover Hoodie',
        description: 'Cozy hoodie perfect for those chilly outdoor events',
        price: 49.99,
        image: 'https://picsum.photos/seed/hoodie1/400/400',
        category: 'Hoodies',
        subcategory: 'Hoodies',
        brand: 'GoEventCity',
        sku: 'GEC-HD-001',
        in_stock: true,
        stock_count: 25,
        rating: 4.9,
        review_count: 89,
        tags: ['warm', 'cozy', 'event-lover'],
        features: ['Fleece Lined', 'Kangaroo Pocket', 'Drawstring Hood'],
        is_new: false,
        is_sale: true,
        is_featured: true,
        compare_at_price: 59.99,
        currency: 'USD',
        images: ['https://picsum.photos/seed/hoodie1/400/400']
      },
      {
        name: 'Local Music Supporter Cap',
        description: 'Show your support for local artists with this stylish cap',
        price: 19.99,
        image: 'https://picsum.photos/seed/cap1/400/400',
        category: 'Hats & Caps',
        subcategory: 'Caps',
        brand: 'GoEventCity',
        sku: 'GEC-CP-001',
        in_stock: true,
        stock_count: 30,
        rating: 4.6,
        review_count: 43,
        tags: ['adjustable', 'music', 'local'],
        features: ['Adjustable Strap', 'Curved Brim', 'Embroidered Logo'],
        is_new: false,
        is_sale: false,
        is_featured: false,
        currency: 'USD',
        images: ['https://picsum.photos/seed/cap1/400/400']
      },
      {
        name: 'Event Memories Sticker Pack',
        description: 'Decorate your laptop, water bottle, or anywhere with these fun stickers',
        price: 8.99,
        image: 'https://picsum.photos/seed/stickers1/400/400',
        category: 'Stickers',
        subcategory: 'Stickers',
        brand: 'GoEventCity',
        sku: 'GEC-ST-001',
        in_stock: true,
        stock_count: 100,
        rating: 4.7,
        review_count: 156,
        tags: ['vinyl', 'weatherproof', 'variety'],
        features: ['Weatherproof Vinyl', '10 Different Designs', 'Easy Peel'],
        is_new: true,
        is_sale: false,
        is_featured: false,
        currency: 'USD',
        images: ['https://picsum.photos/seed/stickers1/400/400']
      },
      {
        name: 'Concert Poster Collection',
        description: 'High-quality prints of iconic local concert posters',
        price: 15.99,
        image: 'https://picsum.photos/seed/poster1/400/400',
        category: 'Posters',
        subcategory: 'Posters',
        brand: 'GoEventCity',
        sku: 'GEC-PS-001',
        in_stock: true,
        stock_count: 15,
        rating: 4.5,
        review_count: 72,
        tags: ['artwork', 'framed', 'collectible'],
        features: ['High-Quality Print', '11x17 Size', 'Glossy Finish'],
        is_new: false,
        is_sale: false,
        is_featured: true,
        currency: 'USD',
        images: ['https://picsum.photos/seed/poster1/400/400']
      },
      {
        name: 'Event Enthusiast Mug',
        description: 'Start your day with coffee and show your event passion',
        price: 12.99,
        image: 'https://picsum.photos/seed/mug1/400/400',
        category: 'Mugs & Drinkware',
        subcategory: 'Mugs',
        brand: 'GoEventCity',
        sku: 'GEC-MG-001',
        in_stock: true,
        stock_count: 40,
        rating: 4.4,
        review_count: 91,
        tags: ['ceramic', 'dishwasher-safe', 'microwave-safe'],
        features: ['Dishwasher Safe', 'Microwave Safe', '11oz Capacity'],
        is_new: false,
        is_sale: false,
        is_featured: false,
        currency: 'USD',
        images: ['https://picsum.photos/seed/mug1/400/400']
      }
    ];

    const { error: insertError } = await supabase
      .from('products')
      .insert(products);

    if (insertError) {
      console.error('Error inserting products:', insertError);
      return;
    }

    console.log('✅ Products inserted successfully');

  } catch (error) {
    console.error('Error:', error);
  }
}

createProductsTable();
