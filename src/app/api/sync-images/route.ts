import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const PRESTASHOP_API_URL = process.env.PRESTASHOP_API_URL || 'https://diesel-turbo-injection.com/api';
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY || '';

// Fetch and update images for products from PrestaShop XML
export async function POST() {
  try {
    console.log('Starting image sync from PrestaShop...');
    
    // Get all products from Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('id');
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    let updated = 0;
    let errors = 0;
    let noImages = 0;
    
    // Process in small batches to avoid overwhelming PrestaShop
    const BATCH_SIZE = 20;
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      
      for (const product of batch) {
        try {
          // Fetch product from PrestaShop to get images
          const apiUrl = `${PRESTASHOP_API_URL}/products/${product.id}?ws_key=${PRESTASHOP_API_KEY}&display=full`;
          const response = await fetch(apiUrl, { signal: AbortSignal.timeout(10000) });
          
          if (!response.ok) {
            errors++;
            continue;
          }
          
          const xmlText = await response.text();
          
          // Extract id_default_image
          const idDefaultImageMatch = xmlText.match(/<id_default_image[^>]*>(?:<!\[CDATA\[)?(\d+)(?:\]\]>)?<\/id_default_image>/);
          const idDefaultImage = idDefaultImageMatch ? idDefaultImageMatch[1] : null;
          
          // Extract images from XML
          const images: Array<{ id: string }> = [];
          const imagesMatch = xmlText.match(/<images[^>]*>([\s\S]*?)<\/images>/);
          
          if (imagesMatch) {
            const imageMatches = imagesMatch[1].matchAll(/<image[^>]*>([\s\S]*?)<\/image>/g);
            for (const imgMatch of imageMatches) {
              const idTagMatch = imgMatch[1].match(/<id>(?:<!\[CDATA\[)?(\d+)(?:\]\]>)?<\/id>/);
              if (idTagMatch && idTagMatch[1]) {
                images.push({ id: idTagMatch[1] });
              }
            }
          }
          
          if (images.length === 0 && !idDefaultImage) {
            noImages++;
            continue;
          }
          
          // Update the product
          const { error: updateError } = await supabase
            .from('products')
            .update({ 
              id_default_image: idDefaultImage,
              images 
            })
            .eq('id', product.id);
          
          if (updateError) {
            console.error(`Error updating product ${product.id}:`, updateError);
            errors++;
          } else {
            updated++;
          }
        } catch (err) {
          console.error(`Error processing product ${product.id}:`, err);
          errors++;
        }
      }
      
      console.log(`Processed batch ${i}-${i + batch.length}, updated: ${updated}, errors: ${errors}, no images: ${noImages}`);
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Updated ${updated} products with images (${errors} errors, ${noImages} without images)`,
      total: products.length 
    });
    
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync images', details: (error as Error).message },
      { status: 500 }
    );
  }
}
