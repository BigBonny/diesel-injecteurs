import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const PRESTASHOP_API_URL = process.env.PRESTASHOP_API_URL || 'https://diesel-injecteurs.com/api';
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY || '';

// Webhook secret for verifying requests from PrestaShop
const WEBHOOK_SECRET = process.env.PRESTASHOP_WEBHOOK_SECRET || '';

// Category ID mapping
const CATEGORY_IDS: Record<string, string> = {
  '4': 'turbos',
  '464': 'injecteurs',
  '1434': 'kit-turbo-chra'
};

interface WebhookPayload {
  event: 'product.created' | 'product.updated' | 'product.deleted';
  productId: string;
  timestamp: string;
}

// Verify webhook signature (simple implementation)
function verifyWebhookSignature(payload: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET) {
    console.log('No webhook secret configured, skipping verification');
    return true;
  }
  
  if (!signature) return false;
  
  // Simple HMAC verification - in production, use proper crypto
  // This is a placeholder - implement proper verification based on how PrestaShop sends webhooks
  return true;
}

// Fetch product details from PrestaShop API
async function fetchProductDetails(productId: string) {
  try {
    const url = `${PRESTASHOP_API_URL}/products/${productId}?ws_key=${PRESTASHOP_API_KEY}`;
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(30000),
      headers: { 'Accept': 'application/xml' }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch product ${productId}:`, response.status);
      return null;
    }
    
    const xmlText = await response.text();
    
    // Parse product XML
    const extractValue = (tag: string) => {
      const cdataMatch = xmlText.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`));
      if (cdataMatch) return cdataMatch[1];
      const simpleMatch = xmlText.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`));
      return simpleMatch ? simpleMatch[1] : null;
    };

    const extractLanguageValue = (tag: string) => {
      const tagMatch = xmlText.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
      if (tagMatch) {
        const tagContent = tagMatch[1];
        const cdataMatch = tagContent.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
        if (cdataMatch) return cdataMatch[1];
      }
      return null;
    };

    const extractImages = () => {
      const imagesMatch = xmlText.match(/<images>([\s\S]*?)<\/images>/);
      if (!imagesMatch) return [];
      const imageMatches = imagesMatch[1].matchAll(/<image[^>]*>([\s\S]*?)<\/image>/g);
      const images = [];
      for (const imgMatch of imageMatches) {
        const idTagMatch = imgMatch[1].match(/<id>(?:<!\[CDATA\[)?(\d+)(?:\]\]>)?<\/id>/);
        if (idTagMatch && idTagMatch[1]) {
          images.push({ id: idTagMatch[1] });
        }
      }
      return images;
    };

    const id_default_image = extractValue('id_default_image');
    const id_category_default = extractValue('id_category_default');
    
    return {
      id: parseInt(productId),
      name: extractLanguageValue('name') || extractValue('name') || '',
      description: extractLanguageValue('description') || extractValue('description') || null,
      price: parseFloat(extractValue('price') || '0') || null,
      reference: extractValue('reference') || null,
      link_rewrite: extractLanguageValue('link_rewrite') || extractValue('link_rewrite') || null,
      id_default_image: id_default_image ? parseInt(id_default_image) : null,
      id_category_default: id_category_default ? parseInt(id_category_default) : null,
      category_name: CATEGORY_IDS[id_category_default || ''] || null,
      images: extractImages(),
      active: extractValue('active') === '1',
    };
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    return null;
  }
}

// POST /api/prestashop/webhook - Receive webhooks from PrestaShop
export async function POST(request: Request) {
  try {
    // Verify signature if configured
    const signature = request.headers.get('X-PrestaShop-Signature') || 
                     request.headers.get('X-Webhook-Signature');
    
    const body = await request.text();
    
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse webhook payload
    let payload: WebhookPayload;
    try {
      payload = JSON.parse(body);
    } catch {
      console.error('Invalid JSON payload');
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    console.log('Received PrestaShop webhook:', payload);

    const { event, productId } = payload;

    switch (event) {
      case 'product.created':
      case 'product.updated': {
        // Fetch product details from PrestaShop
        const product = await fetchProductDetails(productId);
        
        if (!product) {
          return NextResponse.json(
            { error: 'Failed to fetch product details' },
            { status: 500 }
          );
        }

        // Only sync if product is active
        if (!product.active) {
          console.log(`Product ${productId} is inactive, skipping sync`);
          // Delete from Supabase if it exists
          await supabase.from('products').delete().eq('id', parseInt(productId));
          return NextResponse.json({ success: true, action: 'skipped_inactive' });
        }

        // Upsert product to Supabase
        const { error } = await supabase
          .from('products')
          .upsert(product, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });

        if (error) {
          console.error('Error syncing product to Supabase:', error);
          return NextResponse.json(
            { error: 'Failed to sync product', details: error.message },
            { status: 500 }
          );
        }

        console.log(`Product ${productId} synced successfully`);
        return NextResponse.json({ 
          success: true, 
          action: event === 'product.created' ? 'created' : 'updated',
          product: { id: product.id, name: product.name }
        });
      }

      case 'product.deleted': {
        // Delete product from Supabase
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', parseInt(productId));

        if (error) {
          console.error('Error deleting product from Supabase:', error);
          return NextResponse.json(
            { error: 'Failed to delete product', details: error.message },
            { status: 500 }
          );
        }

        console.log(`Product ${productId} deleted successfully`);
        return NextResponse.json({ success: true, action: 'deleted' });
      }

      default:
        return NextResponse.json({ error: 'Unknown event type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// GET /api/prestashop/webhook - Health check or manual sync trigger
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (action === 'sync') {
    // Trigger full sync via the sync endpoint
    try {
      const response = await fetch(new URL('/api/sync', request.url).toString(), {
        method: 'POST',
      });
      const result = await response.json();
      return NextResponse.json(result);
    } catch (error) {
      return NextResponse.json(
        { error: 'Sync failed', details: (error as Error).message },
        { status: 500 }
      );
    }
  }
  
  return NextResponse.json({ 
    status: 'ok',
    webhook: 'Use POST to receive product webhooks from PrestaShop',
    sync: 'Use GET ?action=sync to trigger manual sync'
  });
}
