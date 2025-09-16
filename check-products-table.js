const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProductsTable() {
  console.log('🔍 Checking products table...');
  
  try {
    // Check if products table exists
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('❌ Products table error:', productsError.message);
      
      // Check if product_categories table exists
      const { data: categories, error: categoriesError } = await supabase
        .from('product_categories')
        .select('*')
        .limit(5);
      
      if (categoriesError) {
        console.error('❌ Product categories table error:', categoriesError.message);
        console.log('📝 Need to create shop tables first');
        return;
      } else {
        console.log('✅ Product categories table exists:', categories.length, 'categories found');
      }
    } else {
      console.log('✅ Products table exists:', products.length, 'products found');
      console.log('Sample product:', JSON.stringify(products[0], null, 2));
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
  }
}

checkProductsTable();
