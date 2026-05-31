const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, description, updated_at')
    .eq('category_name', 'Pompes HP')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total Pompes HP products: ${products.length}\n`);
  
  // Check 5 most recent
  console.log('=== 5 MOST RECENT ===');
  for (const p of products.slice(0, 5)) {
    console.log(`ID: ${p.id} | Updated: ${p.updated_at}`);
    console.log(`Desc length: ${p.description?.length || 0}`);
    console.log(`Preview: ${p.description?.substring(0, 100)}...\n`);
  }
  
  // Count by description length
  const withLongDesc = products.filter(p => p.description && p.description.length > 500).length;
  console.log(`\nProducts with detailed descriptions (>500 chars): ${withLongDesc}/${products.length}`);
}

verify();
