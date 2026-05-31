/**
 * Check if descriptions were saved correctly
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDescriptions() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, description, category_name')
    .eq('category_name', 'Pompes HP')
    .limit(5);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${products.length} Pompes HP products\n`);
  
  for (const p of products) {
    const descLength = p.description ? p.description.length : 0;
    console.log(`ID: ${p.id}`);
    console.log(`Name: ${p.name.substring(0, 60)}...`);
    console.log(`Description length: ${descLength} chars`);
    console.log(`Description preview: ${p.description ? p.description.substring(0, 150) : 'NULL'}...`);
    console.log('---\n');
  }
}

checkDescriptions();
