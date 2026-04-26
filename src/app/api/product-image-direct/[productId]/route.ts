import { NextResponse } from 'next/server';

const PRESTASHOP_API_URL = process.env.PRESTASHOP_API_URL || 'https://diesel-injecteurs.com/api';
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY || '';

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
    
    // Fetch the actual image from PrestaShop
    const imageUrl = `${PRESTASHOP_API_URL}/images/products/${productId}/${imageId}?ws_key=${PRESTASHOP_API_KEY}`;
    const imageResponse = await fetch(imageUrl, { signal: AbortSignal.timeout(10000) });
    
    if (!imageResponse.ok) {
      return new NextResponse(null, { status: 404 });
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
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
