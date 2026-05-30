/**
 * Fix images for all Pompes HP products to use local pompeImg.jpg
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPompesImages() {
  console.log('Fetching all Pompes HP products...');
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, images, category_name')
    .eq('category_name', 'Pompes HP');

  if (error) {
    console.error('Error fetching:', error);
    return;
  }

  console.log(`Found ${products.length} Pompes HP products`);

  for (const product of products) {
    // Check if image needs fixing
    const currentImage = product.images?.[0]?.id;
    
    if (currentImage && currentImage.startsWith('http')) {
      console.log(`Fixing: ${product.name.substring(0, 50)}...`);
      
      const { error: updateError } = await supabase
        .from('products')
        .update({
          images: [{ id: '/assets/pompeImg.jpg' }],
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (updateError) {
        console.error(`  Error updating ${product.id}:`, updateError);
      } else {
        console.log(`  ✓ Fixed`);
      }
    } else if (!currentImage || currentImage !== '/assets/pompeImg.jpg') {
      console.log(`Setting image for: ${product.name.substring(0, 50)}...`);
      
      const { error: updateError } = await supabase
        .from('products')
        .update({
          images: [{ id: '/assets/pompeImg.jpg' }],
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (updateError) {
        console.error(`  Error updating ${product.id}:`, updateError);
      } else {
        console.log(`  ✓ Updated`);
      }
    }
  }

  console.log('\nDone! Refresh your browser to see changes.');
}

fixPompesImages().catch(console.error);
