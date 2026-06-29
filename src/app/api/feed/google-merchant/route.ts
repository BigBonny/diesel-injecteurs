import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Debug: Check env vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return new NextResponse('Missing SUPABASE_URL', { status: 500 });
    }

    const PAGE_SIZE = 1000;
    let allProducts: any[] = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .range(from, from + PAGE_SIZE - 1);

      if (error) {
        return new NextResponse(`DB error: ${error.message}`, { status: 500 });
      }

      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        allProducts = allProducts.concat(data);
        from += PAGE_SIZE;
        if (data.length < PAGE_SIZE) hasMore = false;
      }
    }

    const products = allProducts;

    if (!products?.length) {
      return new NextResponse(`No products found. Count: ${products?.length}`, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://diesel-turbo-injection.com';
    const merchantId = process.env.GOOGLE_MERCHANT_ID || '5485884670';

    const feedItems = products.map((p: any) => {
      const id = String(p.id || '0');
      const name = p.name || 'Produit';
      const price = p.price ? parseFloat(p.price).toFixed(2) : '0.00';
      const brand = extractBrand(name);
      const mpn = p.reference || p.supplier_reference || id;
      const desc = escapeXml((p.description || name).replace(/<[^>]*>/g, '').slice(0, 5000));

      const category = getGoogleCategory(name);
      return `    <item>
      <g:id>${id}</g:id>
      <title>${escapeXml(name)}</title>
      <description>${desc}</description>
      <link>${baseUrl}/produits/${id}</link>
      <g:image_link>${baseUrl}/api/product-image-direct/${id}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${price} EUR</g:price>
      <g:brand>${brand}</g:brand>
      <g:mpn>${escapeXml(mpn)}</g:mpn>
      <g:identifier_exists>false</g:identifier_exists>
      <g:google_product_category>${category}</g:google_product_category>
      <g:product_type>${escapeXml(categorizeProduct(name))}</g:product_type>
${getShippingBlocks()}
    </item>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Diesel Turbo Injection</title>
    <link>${baseUrl}</link>
    <description>Catalogue turbos et injecteurs</description>
    <g:merchant_id>${merchantId}</g:merchant_id>
${feedItems}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });

  } catch (err: any) {
    return new NextResponse(`Error: ${err.message}`, { status: 500 });
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

function getGoogleCategory(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('turbo') || lower.includes('chra') || lower.includes('cartouche')) return '3577';
  if (lower.includes('injecteur')) return '8237';
  if (lower.includes('pompe')) return '8166';
  if (lower.includes('egr')) return '8471';
  return '3577';
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

function getShippingBlocks(): string {
  // Adjust prices per country if needed. Default is free standard shipping.
  const countries = [
    { code: 'FR', price: '0.00' },
    { code: 'BE', price: '0.00' },
    { code: 'LU', price: '0.00' },
    { code: 'DE', price: '0.00' },
    { code: 'ES', price: '0.00' },
    { code: 'IT', price: '0.00' },
    { code: 'PT', price: '0.00' },
    { code: 'NL', price: '0.00' },
  ];
  return countries.map(c => `      <g:shipping>
        <g:country>${c.code}</g:country>
        <g:service>Standard</g:service>
        <g:price>${c.price} EUR</g:price>
      </g:shipping>`).join('\n');
}
