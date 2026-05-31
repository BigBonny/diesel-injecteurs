/**
 * Scrape car images and brand logos from auto-platinium product pages
 * and update existing Pompes HP products in Supabase.
 * 
 * Strategy: Use the site's search to find each product by its reference code,
 * then extract the car image and brand logo from the product detail page.
 */
const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BASE_URL = 'https://www.auto-platinium.com';

async function scrapeImagesForProducts() {
  // Fetch all Pompes HP products
  let allProducts = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, images')
      .eq('category_name', 'Pompes HP')
      .range(from, from + 999);
    if (error) { console.error(error); break; }
    if (!data || data.length === 0) break;
    allProducts = allProducts.concat(data);
    from += 1000;
    if (data.length < 1000) break;
  }

  console.log(`Found ${allProducts.length} Pompes HP products to update`);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // First, collect ALL product links by paginating through the listing
  console.log('Collecting all product links from listing pages...');
  let allLinks = [];
  let pageNum = 1;
  const LISTING_URL = `${BASE_URL}/pompes-a-haute-pression/`;

  while (true) {
    const pageUrl = pageNum === 1 ? LISTING_URL : `${LISTING_URL}?p=${pageNum}`;
    await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const pageLinks = await page.evaluate(() => {
      const results = [];
      const items = document.querySelectorAll('.product-miniature, article.product-miniature, .product-container, .product_list_item');
      items.forEach(item => {
        const link = item.querySelector('a[href]');
        const nameEl = item.querySelector('.product-title a, h2 a, .product-name a, a.product_name, .product-title, h3 a');
        if (link && nameEl) {
          results.push({
            name: nameEl.textContent.trim(),
            url: link.href
          });
        }
      });
      return results;
    });
    
    if (pageLinks.length === 0) break;
    
    allLinks = allLinks.concat(pageLinks);
    console.log(`  Page ${pageNum}: found ${pageLinks.length} products (total: ${allLinks.length})`);

    // Check if there's a next page
    const hasNext = await page.evaluate((currentPage) => {
      const nextLink = document.querySelector(`a[href*="?p=${currentPage + 1}"]`);
      return !!nextLink;
    }, pageNum);

    if (!hasNext) break;
    pageNum++;
  }

  console.log(`\nTotal product links collected: ${allLinks.length}`);

  // Match products to links
  let updated = 0;
  let skipped = 0;

  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i];
    
    // Check if already has car/brand images
    const existingImages = product.images || [];
    const hasCar = existingImages.some(img => img.type === 'car');
    const hasBrand = existingImages.some(img => img.type === 'brand');
    if (hasCar && hasBrand) { skipped++; continue; }

    // Extract ref from product name: e.g. "(0445010799)" 
    const refMatch = product.name.match(/\(([^)]+)\)\s*$/);
    const ref = refMatch ? refMatch[1] : null;
    
    // Find matching URL from collected links
    let productUrl = null;
    if (ref) {
      const match = allLinks.find(l => l.name.includes(ref));
      if (match) productUrl = match.url;
    }
    if (!productUrl) {
      // Try matching by significant words
      const words = product.name.toLowerCase().split(/\s+/).filter(w => w.length > 4);
      const match = allLinks.find(l => {
        const lowerName = l.name.toLowerCase();
        const matchCount = words.filter(w => lowerName.includes(w)).length;
        return matchCount >= Math.min(words.length * 0.5, 4);
      });
      if (match) productUrl = match.url;
    }

    if (!productUrl) {
      if (i < 5) console.log(`  No URL found for: ${product.name.substring(0, 60)}`);
      skipped++;
      continue;
    }

    try {
      process.stdout.write(`[${i + 1}/${allProducts.length}] `);
      
      await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 800));

      const imageData = await page.evaluate(() => {
        let carImage = null;
        let brandLogo = null;

        // --- Car Image: look for vehicle/car images ---
        const allImgs = Array.from(document.querySelectorAll('img'));
        
        // Strategy 1: Find images with car-related attributes
        for (const img of allImgs) {
          const src = (img.src || '').toLowerCase();
          const alt = (img.alt || '').toLowerCase();
          const cls = (img.className || '').toLowerCase();
          const parentCls = (img.parentElement?.className || '').toLowerCase();
          
          if (alt.includes('véhicule') || alt.includes('voiture') || alt.includes('vehicle') ||
              cls.includes('vehicle') || cls.includes('car') ||
              parentCls.includes('vehicle') || parentCls.includes('car') || parentCls.includes('vehicule')) {
            if (img.src && img.naturalWidth > 50) { carImage = img.src; break; }
          }
        }
        
        // Strategy 2: Look for images with typical car photo URLs
        if (!carImage) {
          for (const img of allImgs) {
            const src = (img.src || '');
            if ((src.includes('/modules/') && (src.includes('vehicle') || src.includes('car'))) ||
                src.includes('cdn.imagin.studio') || src.includes('carpics')) {
              carImage = src;
              break;
            }
          }
        }

        // --- Brand Logo ---
        for (const img of allImgs) {
          const src = (img.src || '').toLowerCase();
          const alt = (img.alt || '').toLowerCase();
          
          if (alt.includes('bosch') || alt.includes('delphi') || alt.includes('siemens') ||
              alt.includes('continental') || alt.includes('denso') || alt.includes('vdo') ||
              src.includes('bosch') || src.includes('delphi') || src.includes('siemens') ||
              src.includes('continental') || src.includes('denso') || src.includes('vdo')) {
            // Make sure it's a logo (not too large)
            if (img.src && (img.naturalWidth < 300 || img.naturalHeight < 200)) {
              brandLogo = img.src;
              break;
            }
          }
        }

        return { carImage, brandLogo };
      });

      if (imageData.carImage || imageData.brandLogo) {
        const newImages = existingImages.filter(img => img.type !== 'car' && img.type !== 'brand');
        if (imageData.carImage) newImages.push({ id: imageData.carImage, type: 'car' });
        if (imageData.brandLogo) newImages.push({ id: imageData.brandLogo, type: 'brand' });

        const { error } = await supabase
          .from('products')
          .update({ images: newImages, updated_at: new Date().toISOString() })
          .eq('id', product.id);

        if (!error) {
          updated++;
          console.log(`✓ Car:${imageData.carImage ? 'yes' : 'no'} Logo:${imageData.brandLogo ? 'yes' : 'no'}`);
        } else {
          console.log(`Error: ${error.message}`);
        }
      } else {
        console.log('no images found');
      }
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\n✓ Done! Updated: ${updated}, Skipped: ${skipped}, Total: ${allProducts.length}`);
}

scrapeImagesForProducts().catch(console.error);
