/**
 * Remove duplicate Pompes HP products, keeping only the most recent ones (with full descriptions)
 */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deduplicate() {
  console.log('Fetching all Pompes HP products...');
  
  // Fetch all pompes HP products
  let allProducts = [];
  let from = 0;
  const PAGE_SIZE = 1000;
  
  while (true) {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, updated_at')
      .eq('category_name', 'Pompes HP')
      .order('updated_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    
    if (error) { console.error(error); break; }
    if (!data || data.length === 0) break;
    allProducts = allProducts.concat(data);
    from += PAGE_SIZE;
    if (data.length < PAGE_SIZE) break;
  }
  
  console.log(`Total Pompes HP products: ${allProducts.length}`);
  
  // Group by name and keep only the one with the longest description
  const byName = {};
  for (const p of allProducts) {
    const key = p.name.trim().toLowerCase();
    if (!byName[key]) {
      byName[key] = [];
    }
    byName[key].push(p);
  }
  
  const uniqueNames = Object.keys(byName).length;
  console.log(`Unique product names: ${uniqueNames}`);
  
  // Find duplicates to delete
  const idsToDelete = [];
  for (const [name, products] of Object.entries(byName)) {
    if (products.length > 1) {
      // Sort by description length (longest first), then by updated_at (newest first)
      products.sort((a, b) => {
        const lenDiff = (b.description?.length || 0) - (a.description?.length || 0);
        if (lenDiff !== 0) return lenDiff;
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
      // Keep first (best description), delete rest
      for (let i = 1; i < products.length; i++) {
        idsToDelete.push(products[i].id);
      }
    }
  }
  
  console.log(`Duplicates to delete: ${idsToDelete.length}`);
  
  // Delete in batches of 100
  for (let i = 0; i < idsToDelete.length; i += 100) {
    const batch = idsToDelete.slice(i, i + 100);
    const { error } = await supabase
      .from('products')
      .delete()
      .in('id', batch);
    
    if (error) {
      console.error(`Error deleting batch ${i}:`, error);
    } else {
      console.log(`  Deleted batch ${i}-${i + batch.length}`);
    }
  }
  
  // Verify
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_name', 'Pompes HP');
  
  console.log(`\n✓ Remaining Pompes HP products: ${count}`);
}

deduplicate().catch(console.error);
