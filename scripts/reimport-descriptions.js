/**
 * Re-import products from JSON with full descriptions
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function reimport() {
  // Load products from JSON
  const products = JSON.parse(fs.readFileSync('pompes-hp-products.json', 'utf8'));
  console.log(`Loaded ${products.length} products from JSON`);
  
  // Check first product description
  console.log('\nFirst product description length:', products[0].description?.length || 0);
  console.log('Preview:', products[0].description?.substring(0, 200));
  
  console.log('\nImporting to Supabase...');
  let imported = 0;
  
  for (const product of products) {
    try {
      const priceText = product.price.replace(/[^\d.,]/g, '').replace(',', '.');
      const price = parseFloat(priceText) || 0;
      
      const linkRewrite = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      const productId = Math.floor(Math.random() * 1000000) + 100000;
      
      const { error } = await supabase
        .from('products')
        .insert({
          id: productId,
          name: product.name,
          description: product.description || product.name, // Use the full description from JSON
          price: price,
          reference: product.reference || `POMP-HP-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          link_rewrite: linkRewrite,
          id_category_default: 999,
          category_name: 'Pompes HP',
          images: [
            { id: '/assets/pompeImg.jpg' },
            ...(product.carImage ? [{ id: product.carImage, type: 'car' }] : []),
            ...(product.brandLogo ? [{ id: product.brandLogo, type: 'brand' }] : [])
          ],
          supplier_reference: 'AUTO-PLATINIUM',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error(`Error importing ${product.name.substring(0, 40)}:`, error.message);
      } else {
        imported++;
        if (imported % 50 === 0) {
          console.log(`  Imported ${imported}/${products.length}...`);
        }
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  }
  
  console.log(`\n✓ Imported ${imported} products with full descriptions!`);
}

reimport().catch(console.error);
