const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.QkmwMNZG-puMK7Rze6jtMM118bXb9mRK87Je9XhRgwI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createShopProducts() {
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
          sku VARCHAR(100),
          stock_quantity INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          is_featured BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies
        CREATE POLICY "products_read" ON public.products FOR SELECT
          TO authenticated USING (is_active = true);
          
        CREATE POLICY "products_manage" ON public.products FOR ALL
          TO authenticated USING (true);
      `
    });

    if (createError) {
      console.error('Error creating products table:', createError);
      return;
    }

    console.log('Products table created successfully');

    // Insert sample products
    const products = [
      {
        name: 'GoEvent T-Shirt',
        description: 'Comfortable cotton t-shirt with GoEvent logo',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Apparel',
        subcategory: 'T-Shirts',
        brand: 'GoEvent',
        sku: 'GE-TS-001',
        stock_quantity: 100,
        is_active: true,
        is_featured: true
      },
      {
        name: 'Event Planner Notebook',
        description: 'Premium leather-bound notebook for event planning',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Accessories',
        subcategory: 'Notebooks',
        brand: 'GoEvent',
        sku: 'GE-NB-001',
        stock_quantity: 50,
        is_active: true,
        is_featured: true
      },
      {
        name: 'Concert Poster',
        description: 'High-quality poster for your favorite concerts',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Merchandise',
        subcategory: 'Posters',
        brand: 'GoEvent',
        sku: 'GE-PS-001',
        stock_quantity: 200,
        is_active: true,
        is_featured: false
      },
      {
        name: 'Event Badge Holder',
        description: 'Professional badge holder for events',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Accessories',
        subcategory: 'Badges',
        brand: 'GoEvent',
        sku: 'GE-BH-001',
        stock_quantity: 150,
        is_active: true,
        is_featured: false
      },
      {
        name: 'Music Festival Cap',
        description: 'Stylish cap perfect for music festivals',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Apparel',
        subcategory: 'Caps',
        brand: 'GoEvent',
        sku: 'GE-CP-001',
        stock_quantity: 75,
        is_active: true,
        is_featured: true
      },
      {
        name: 'Event Stickers Pack',
        description: 'Fun sticker pack with various event themes',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'Merchandise',
        subcategory: 'Stickers',
        brand: 'GoEvent',
        sku: 'GE-ST-001',
        stock_quantity: 300,
        is_active: true,
        is_featured: false
      }
    ];

    const { error: insertError } = await supabase
      .from('products')
      .insert(products);

    if (insertError) {
      console.error('Error inserting products:', insertError);
      return;
    }

    console.log('Products inserted successfully');

    // Verify the products were inserted
    const { data: insertedProducts, error: selectError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (selectError) {
      console.error('Error selecting products:', selectError);
      return;
    }

    console.log('Products in database:', insertedProducts.length);
    console.log('Sample product:', insertedProducts[0]);

  } catch (error) {
    console.error('Error:', error);
  }
}

createShopProducts();
