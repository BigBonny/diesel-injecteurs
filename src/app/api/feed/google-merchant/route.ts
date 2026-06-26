import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Debug: Check env vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return new NextResponse('Missing SUPABASE_URL', { status: 500 });
    }

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(50000);

    if (error) {
      return new NextResponse(`DB error: ${error.message}`, { status: 500 });
    }

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

      return `    <item>
      <g:id>${id}</g:id>
      <title>${escapeXml(name)}</title>
      <description>${desc}</description>
      <link>${baseUrl}/produit/${id}</link>
      <g:image_link>${baseUrl}/api/product-image-direct/${id}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>${price} EUR</g:price>
      <g:brand>${brand}</g:brand>
      <g:mpn>${mpn}</g:mpn>
      <g:google_product_category>783</g:google_product_category>
      <g:product_type>${categorizeProduct(name)}</g:product_type>
      <g:shipping>
        <g:country>FR</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
    </item>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Injection Diesel</title>
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

function categorizeProduct(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('turbo')) return 'Véhicules et pièces > Pièces auto > Turbocompresseurs';
  if (lower.includes('injecteur')) return 'Véhicules et pièces > Pièces auto > Systèmes d\'injection';
  if (lower.includes('chra') || lower.includes('cartouche')) return 'Véhicules et pièces > Pièces auto > Turbocompresseurs > CHRA';
  if (lower.includes('pompe')) return 'Véhicules et pièces > Pièces auto > Pompes à carburant';
  if (lower.includes('vanne egr') || lower.includes('egr')) return 'Véhicules et pièces > Pièces auto > Vannes EGR';
  return 'Véhicules et pièces > Pièces auto';
}
