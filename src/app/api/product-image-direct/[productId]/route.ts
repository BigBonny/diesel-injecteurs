import { NextResponse } from 'next/server';

const PRESTASHOP_API_URL = process.env.PRESTASHOP_API_URL || 'http://192.162.69.186/api';
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY || '';
const PRESTASHOP_FRONT_URL = 'http://192.162.69.186';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    
    // Fetch product from PrestaShop to get image info
    const apiUrl = `${PRESTASHOP_API_URL}/products/${productId}?ws_key=${PRESTASHOP_API_KEY}&display=full`;
    const response = await fetch(apiUrl, { signal: AbortSignal.timeout(10000) });
    
    if (!response.ok) {
      return new NextResponse(null, { status: 404 });
    }
    
    const text = await response.text();
    
    // Extract image ID from the XML
    // Look for images node and get the first image ID
    const imagesMatch = text.match(/<images[^>]*>([\s\S]*?)<\/images>/);
    if (!imagesMatch) {
      return new NextResponse(null, { status: 404 });
    }
    
    // Try to get first image ID
    const imageIdMatch = imagesMatch[1].match(/<id>(?:<!\[CDATA\[)?(\d+)(?:\]\]>)?<\/id>/);
    if (!imageIdMatch) {
      return new NextResponse(null, { status: 404 });
    }
    
    const imageId = imageIdMatch[1];

    // Try the front-end JPEG URL first (Google requires JPEG/PNG/GIF)
    let imageUrl = `${PRESTASHOP_FRONT_URL}/${imageId}/${productId}.jpg`;
    let imageResponse = await fetch(imageUrl, { signal: AbortSignal.timeout(10000) });

    if (!imageResponse.ok) {
      // Try to extract the product rewrite URL and build the named JPEG URL
      const rewriteMatch = text.match(/<link_rewrite>(?:<!\[CDATA\[)?([^\]]+?)(?:\]\])?<\/link_rewrite>/);
      if (rewriteMatch) {
        const productName = rewriteMatch[1].trim();
        imageUrl = `${PRESTASHOP_FRONT_URL}/${imageId}/${productName}.jpg`;
        imageResponse = await fetch(imageUrl, { signal: AbortSignal.timeout(10000) });
      }
    }

    if (!imageResponse.ok) {
      // Fallback to the PrestaShop API binary endpoint
      imageUrl = `${PRESTASHOP_API_URL}/images/products/${productId}/${imageId}?ws_key=${PRESTASHOP_API_KEY}`;
      imageResponse = await fetch(imageUrl, { signal: AbortSignal.timeout(10000) });
    }

    if (!imageResponse.ok) {
      return new NextResponse(null, { status: 404 });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    let contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Google Merchant Center only accepts JPEG, PNG, GIF
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!acceptedTypes.includes(contentType.toLowerCase())) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    });
  } catch (error) {
    console.error('Error fetching product image:', error);
    return new NextResponse(null, { status: 500 });
  }
}
