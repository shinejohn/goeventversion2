const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gbcjlsnbamjchdtgrquu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiY2psc25iYW1qY2hkdGdycXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY4MDM5NSwiZXhwIjoyMDcyMjU2Mzk1fQ.WXjKWdFTFOrxMqF62A7fEzblbGHcl3SYPu7bDWXFFgc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createShopTablesManually() {
  console.log('🚀 Creating shop tables manually...');
  
  try {
    // First, let's try to create a simple product to see if the table exists
    console.log('🔍 Testing if products table exists...');
    
    const { data: testProducts, error: testError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.log('❌ Products table does not exist:', testError.message);
      console.log('📝 Need to create tables through Supabase dashboard or CLI');
      
      // Let's try to create some sample data that might trigger table creation
      console.log('🔄 Attempting to create sample data...');
      
      // Try to insert a product (this might fail but could give us more info)
      const { data: insertData, error: insertError } = await supabase
        .from('products')
        .insert({
          name: 'Test Product',
          price: 19.99,
          category: 'Test',
          description: 'Test product for table creation'
        })
        .select();
      
      if (insertError) {
        console.log('❌ Insert failed:', insertError.message);
        console.log('💡 Tables need to be created manually in Supabase dashboard');
        console.log('📋 Please run the SQL from apps/web/supabase/schemas/19-shop-products.sql in your Supabase SQL editor');
      } else {
        console.log('✅ Product created successfully:', insertData);
      }
    } else {
      console.log('✅ Products table exists:', testProducts.length, 'products found');
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
  }
}

createShopTablesManually();
