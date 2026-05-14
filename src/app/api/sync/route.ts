import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY || '';

// Use server IP with Host header to bypass SSL and DNS issues
const PRESTASHOP_API_HOST = 'diesel-injecteurs.com';
const PRESTASHOP_API_URL = 'http://192.162.69.186/api';

// Category ID mapping
const CATEGORY_IDS: Record<string, string> = {
  'turbos': '4',
  'injecteurs': '464',
  'kit-turbo-chra': '1434'
};

function parseProductXml(productXml: string) {
  const extractValue = (tag: string) => {
    const cdataMatch = productXml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`));
    if (cdataMatch) return cdataMatch[1];
    const simpleMatch = productXml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`));
    return simpleMatch ? simpleMatch[1] : null;
  };

  const extractLanguageValue = (tag: string) => {
    const tagMatch = productXml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
    if (tagMatch) {
      const tagContent = tagMatch[1];
      const cdataMatch = tagContent.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
      if (cdataMatch) return cdataMatch[1];
    }
    return null;
  };

  const extractAssociations = () => {
    const imagesMatch = productXml.match(/<images>([\s\S]*?)<\/images>/);
    if (!imagesMatch) return [];
    const imageMatches = imagesMatch[1].matchAll(/<image[^>]*>([\s\S]*?)<\/image>/g);
    const images = [];
    for (const imgMatch of imageMatches) {
      // Try to get ID from <id> tag (with CDATA support)
      const idTagMatch = imgMatch[1].match(/<id>(?:<!\[CDATA\[)?(\d+)(?:\]\]>)?<\/id>/);
      if (idTagMatch && idTagMatch[1]) {
        images.push({ id: idTagMatch[1] });
      } else {
        // Try to get ID from xlink:href attribute (e.g., /api/images/products/8525/14585)
        const hrefMatch = imgMatch[0].match(/xlink:href="[^"]*\/([^\/"]+)"/);
        if (hrefMatch && hrefMatch[1]) {
          images.push({ id: hrefMatch[1] });
        }
      }
    }
    return images;
  };

  const id_default_image = extractValue('id_default_image');
  const id_category_default = extractValue('id_category_default');

  return {
    id: parseInt(extractValue('id') || '0'),
    name: extractLanguageValue('name') || extractValue('name') || '',
    description: extractLanguageValue('description') || extractValue('description') || null,
    price: parseFloat(extractValue('price') || '0') || null,
    reference: extractValue('reference') || null,
    link_rewrite: extractLanguageValue('link_rewrite') || extractValue('link_rewrite') || null,
    id_default_image: id_default_image ? parseInt(id_default_image) : null,
    id_category_default: id_category_default ? parseInt(id_category_default) : null,
    category_name: CATEGORY_IDS[Object.keys(CATEGORY_IDS).find(k => CATEGORY_IDS[k] === id_category_default) || ''] || null,
    images: extractAssociations(),
  };
}

async function fetchAllProducts(): Promise<any[]> {
  const productMap = new Map<string, any>();
  const BATCH_SIZE = 100;
  let offset = 0;
  let hasMore = true;
  
  const baseUrl = `${PRESTASHOP_API_URL}/products?ws_key=${PRESTASHOP_API_KEY}&display=full`;

  while (hasMore) {
    try {
      // PrestaShop WebService uses limit=[offset],[count]
      const apiUrl = `${baseUrl}&limit=${offset},${BATCH_SIZE}`;
      console.log(`Fetching batch: offset=${offset}, limit=${BATCH_SIZE}, url=${apiUrl.substring(0, 100)}...`);
      
      const response = await fetch(apiUrl, { 
        signal: AbortSignal.timeout(30000),
        headers: {
          'Host': PRESTASHOP_API_HOST
        }
      });

      if (!response.ok) {
        console.error(`Batch fetch error: ${response.status}`);
        const errorText = await response.text();
        console.error('Error response:', errorText.substring(0, 200));
        break;
      }

      const text = await response.text();
      console.log('Response preview:', text.substring(0, 500));
      const productsMatch = text.match(/<products>([\s\S]*?)<\/products>/);
      
      if (!productsMatch) {
        console.error('No products tag found in response');
        break;
      }

      const productsXml = productsMatch[1];
      const productMatches = productsXml.matchAll(/<product>([\s\S]*?)<\/product>/g);
      let batchCount = 0;
      
      for (const match of productMatches) {
        const product = parseProductXml(match[1]);
        if (product.id && product.id > 0 && !productMap.has(product.id.toString())) {
          productMap.set(product.id.toString(), product);
          batchCount++;
        }
      }

      if (batchCount === 0) {
        hasMore = false;
      } else {
        offset += BATCH_SIZE;
        console.log(`Fetched ${batchCount} new products, total unique: ${productMap.size}`);
        
        if (batchCount < BATCH_SIZE) {
          hasMore = false;
        }
      }
    } catch (error) {
      console.error(`Error fetching batch at offset ${offset}:`, error);
      break;
    }
  }

  return Array.from(productMap.values());
}

// POST /api/sync - Sync products from PrestaShop to Supabase
export async function POST() {
  try {
    console.log('Starting product sync...');
    console.log('API URL:', PRESTASHOP_API_URL);
    console.log('API Key exists:', !!PRESTASHOP_API_KEY);
    
    // Test first API call
    const testUrl = `${PRESTASHOP_API_URL}/products?ws_key=${PRESTASHOP_API_KEY}&display=full&limit=0,1`;
    console.log('Test URL:', testUrl);
    
    const testResponse = await fetch(testUrl, { 
      signal: AbortSignal.timeout(10000),
      headers: {
        'Host': PRESTASHOP_API_HOST
      }
    });
    console.log('Test response status:', testResponse.status);
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      return NextResponse.json({ 
        error: 'API test failed', 
        status: testResponse.status,
        preview: errorText.substring(0, 500)
      }, { status: 500 });
    }
    
    const testText = await testResponse.text();
    console.log('Test response preview:', testText.substring(0, 200));
    
    // Fetch all products from PrestaShop
    const products = await fetchAllProducts();
    console.log(`Fetched ${products.length} products from PrestaShop`);

    if (products.length === 0) {
      return NextResponse.json({ 
        error: 'No products fetched',
        testResponse: testText.substring(0, 500)
      }, { status: 500 });
    }

    // Insert products to Supabase in batches
    const BATCH_SIZE = 500;
    let inserted = 0;
    let errors = 0;
    
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      const { error } = await supabase
        .from('products')
        .upsert(batch, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error(`Error inserting batch ${i}-${i + batch.length}:`, error);
        errors++;
      } else {
        inserted += batch.length;
        console.log(`Inserted batch ${i}-${i + batch.length} (${inserted}/${products.length})`);
      }
    }

    return NextResponse.json({ 
      success: errors === 0, 
      message: `Synced ${inserted} products to Supabase (${errors} errors)`,
      count: inserted 
    });

  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync products', details: (error as Error).message },
      { status: 500 }
    );
  }
}
