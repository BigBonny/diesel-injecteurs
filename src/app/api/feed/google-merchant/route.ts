import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch all products from Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(50000);

    if (error) {
      console.error('Error fetching products for merchant feed:', error);
      return new NextResponse('Error generating feed', { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://diesel-injecteurs.com';
    const merchantId = process.env.GOOGLE_MERCHANT_ID || '664430553';

    // Build RSS/XML feed for Google Merchant Center
    const feedItems = products?.map((product: any) => {
      const id = product.id;
      const title = escapeXml(product.name);
      const description = escapeXml(product.description?.replace(/<[^>]*>/g, '').substring(0, 5000) || product.name);
      const link = `${baseUrl}/produit/${product.link_rewrite || product.id}`;
      const imageLink = product.id_default_image 
        ? `${baseUrl}/api/product-image-direct/${product.id}` 
        : `${baseUrl}/images/placeholder-product.png`;
      const price = product.price ? parseFloat(product.price).toFixed(2) : '0.00';
      const brand = extractBrand(product.name);
      const mpn = product.reference || product.supplier_reference || id;
      const condition = 'new';
      const availability = product.quantity > 0 ? 'in stock' : 'out of stock';
      const googleProductCategory = '783';
      const productType = categorizeProduct(product.name);

      return `
    <item>
      <g:id>${id}</g:id>
      <title>${title}</title>
      <description>${description}</description>
      <link>${link}</link>
      <g:image_link>${imageLink}</g:image_link>
      <g:condition>${condition}</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${price} EUR</g:price>
      <g:brand>${brand}</g:brand>
      <g:mpn>${mpn}</g:mpn>
      <g:google_product_category>${googleProductCategory}</g:google_product_category>
      <g:product_type>${productType}</g:product_type>
      <g:shipping>
        <g:country>FR</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
      <g:shipping_label>FR_STANDARD</g:shipping_label>
    </item>`;
    }).join('') || '';

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Injection Diesel - Catalogue Produits</title>
    <link>${baseUrl}</link>
    <description>Turbos et injecteurs diesel neufs et reconditionnés OEM</description>
    <g:merchant_id>${merchantId}</g:merchant_id>
    ${feedItems}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error generating merchant feed:', error);
    return new NextResponse('Error generating feed', { status: 500 });
  }
}

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function extractBrand(name: string): string {
  const brands = ['Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'VW', 'BMW', 'Mercedes', 'Audi', 'Ford', 'Opel', 'Toyota', 'Fiat', 'Nissan', 'Hyundai', 'Kia', 'Seat', 'Skoda'];
  const lowerName = name.toLowerCase();
  for (const brand of brands) {
    if (lowerName.includes(brand.toLowerCase())) {
      return brand === 'vw' ? 'Volkswagen' : brand;
    }
  }
  return 'OEM';
}

function categorizeProduct(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('turbo')) return 'Véhicules et pièces > Pièces auto > Turbocompresseurs';
  if (lower.includes('injecteur')) return 'Véhicules et pièces > Pièces auto > Systèmes d\'injection';
  if (lower.includes('chra') || lower.includes('cartouche')) return 'Véhicules et pièces > Pièces auto > Turbocompresseurs > CHRA';
  if (lower.includes('pompe')) return 'Véhicules et pièces > Pièces auto > Pompes à carburant';
  if (lower.includes('vanne egr') || lower.includes('egr')) return 'Véhicules et pièces > Pièces auto > Vannes EGR';
  return 'Véhicules et pièces > Pièces auto';
}
