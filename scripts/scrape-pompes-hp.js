const puppeteer = require('puppeteer');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials.');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function scrapePompesHP() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set user agent to avoid being blocked
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Go to the pompes hp section
    console.log('Navigating to auto-platinium.com...');
    await page.goto('https://www.auto-platinium.com/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Wait for the page to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Look for "pompes hp" link and click it
    console.log('Looking for pompes hp section...');
    
    // First, try to find by text content (more reliable)
    const links = await page.$$eval('a', links => 
      links.filter(link => {
        const text = link.textContent.toLowerCase();
        return text.includes('pompe') || text.includes('hp') || text.includes('haute pression');
      }).map(link => ({ text: link.textContent.trim(), href: link.href }))
    );
    
    console.log('Found links with pompe/hp:', links.slice(0, 5));
    
    // Navigate directly if we found a matching link
    if (links.length > 0 && links[0].href) {
      console.log('Navigating to:', links[0].href);
      await page.goto(links[0].href, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      // Try to find by text content
      const links = await page.$$eval('a', links => 
        links.filter(link => 
          link.textContent.toLowerCase().includes('pompe') || 
          link.textContent.toLowerCase().includes('hp')
        ).map(link => ({ text: link.textContent.trim(), href: link.href }))
      );
      console.log('Found links:', links);
      
      if (links.length > 0) {
        await page.goto(links[0].href, { waitUntil: 'networkidle2' });
      }
    }

    // Extract product data from all pages
    console.log('Extracting products from all pages...');
    let allProducts = [];
    let hasNextPage = true;
    let pageNum = 1;
    const maxPages = 20; // Safety limit
    
    while (hasNextPage && pageNum <= maxPages) {
      console.log(`Scraping page ${pageNum}...`);
      
      const products = await page.evaluate(() => {
        const products = [];
        
        // Common selectors for product listings
        const productSelectors = [
          '.product-item',
          '.product',
          '.product-card',
          '[data-product]',
          '.item-product',
          '.grid-item',
          '.product-container',
          '.product-list-item',
          '.js-product-miniature',
          '.thumbnail-container'
        ];
        
        // Also look for any article or div that contains product-like info
        const allArticles = document.querySelectorAll('article, .product-miniature, .item');
        
        for (const selector of productSelectors) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            elements.forEach(el => {
              const name = el.querySelector('.product-name, .product-title, h2, h3, .name, [data-name], .h3.product-title a')?.textContent?.trim();
              const price = el.querySelector('.price, .product-price, .amount, [data-price], .current-price')?.textContent?.trim();
              
              // Use local placeholder image for all pompes HP products
              const image = '/assets/pompeImg.jpg';
              
              const link = el.querySelector('a')?.href;
              const reference = el.querySelector('.reference, .sku, .ref, [data-sku], .product-reference')?.textContent?.trim();
              const description = el.querySelector('.description, .desc, .short-desc')?.textContent?.trim();
              
              if (name && price) {
                products.push({
                  name,
                  price,
                  image,
                  link,
                  reference,
                  description: description || name, // Will be updated with full description from product page
                  category: 'pompes-hp'
                });
              }
            });
            break; // Found products with this selector
          }
        }
        
        return products;
      });
      
      console.log(`Found ${products.length} products on page ${pageNum}`);
      allProducts = allProducts.concat(products);
      
      // Check for next page
      const hasNext = await page.evaluate(() => {
        const nextLinks = document.querySelectorAll('.pagination a[rel="next"], .next a, a.next, [aria-label="Next"], .pagination-next');
        return nextLinks.length > 0;
      });
      
      if (hasNext && products.length > 0) {
        pageNum++;
        // Try to click next page
        try {
          const nextClicked = await page.evaluate(() => {
            const nextLink = document.querySelector('.pagination a[rel="next"], .next a, a.next, [aria-label="Next"], .pagination-next');
            if (nextLink) {
              nextLink.click();
              return true;
            }
            return false;
          });
          
          if (nextClicked) {
            await new Promise(resolve => setTimeout(resolve, 3000));
          } else {
            hasNextPage = false;
          }
        } catch (e) {
          hasNextPage = false;
        }
      } else {
        hasNextPage = false;
      }
    }

    console.log(`Total: Found ${allProducts.length} products across ${pageNum} pages`);
    
    // Now fetch detailed descriptions from each product page
    console.log('\nFetching detailed descriptions from product pages...');
    let processedCount = 0;
    
    for (let i = 0; i < allProducts.length; i++) {
      const product = allProducts[i];
      if (product.link) {
        try {
          console.log(`[${i + 1}/${allProducts.length}] Fetching: ${product.name.substring(0, 50)}...`);
          
          await page.goto(product.link, { waitUntil: 'networkidle2', timeout: 30000 });
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const pageData = await page.evaluate(() => {
            // --- Description ---
            const descSelectors = [
              '.product-description p',
              '.description-content',
              '#product-description',
              '.product-info__description',
              '.product-details__description',
              '.tab-content .description',
              '[data-tab="description"] .content',
              '.product-tabs .tab-pane p',
              '.product-content__description',
              '#description p'
            ];
            
            let description = '';
            for (const selector of descSelectors) {
              const elements = document.querySelectorAll(selector);
              if (elements.length > 0) {
                description = Array.from(elements)
                  .map(el => el.textContent?.trim())
                  .filter(text => text && text.length > 50)
                  .join('\n\n');
                if (description.length > 100) break;
              }
            }
            
            const infoSection = document.querySelector('.product-info, .product-details, .product-attributes');
            if (infoSection && !description.includes('Marque') && !description.includes('Type')) {
              const infoText = infoSection.textContent?.trim();
              if (infoText && infoText.length > 20) {
                description += '\n\n' + infoText;
              }
            }
            
            // --- Car Image (vehicle image in "Mon véhicule" section) ---
            let carImage = null;
            // Look for car/vehicle images - typically larger images in the product info area
            const carImgSelectors = [
              '.vehicle-image img',
              '.car-image img',
              '.product-vehicle img',
              '#myVehicle img',
              '.mon-vehicule img',
              '.product-sheet img[src*="car"]',
              '.product-sheet img[src*="vehicule"]',
              'img[alt*="véhicule"]',
              'img[alt*="vehicle"]'
            ];
            for (const sel of carImgSelectors) {
              const img = document.querySelector(sel);
              if (img && img.src) { carImage = img.src; break; }
            }
            // Fallback: find images that look like car images (large, not logos, not product)
            if (!carImage) {
              const allImgs = document.querySelectorAll('img');
              for (const img of allImgs) {
                const src = img.src || '';
                const alt = (img.alt || '').toLowerCase();
                // Look for car-related images by URL pattern or alt text
                if ((src.includes('/car') || src.includes('/vehic') || src.includes('/voiture') || 
                     alt.includes('véhicule') || alt.includes('voiture') || alt.includes('car')) &&
                    img.naturalWidth > 100) {
                  carImage = src;
                  break;
                }
              }
            }
            
            // --- Brand/Pump Logo ---
            let brandLogo = null;
            const logoSelectors = [
              '.manufacturer-logo img',
              '.brand-logo img',
              '.product-manufacturer img',
              'img[alt*="BOSCH"]',
              'img[alt*="Bosch"]',
              'img[alt*="DELPHI"]',
              'img[alt*="Delphi"]',
              'img[alt*="SIEMENS"]',
              'img[alt*="Siemens"]',
              'img[alt*="CONTINENTAL"]',
              'img[alt*="Continental"]',
              'img[alt*="DENSO"]',
              'img[alt*="Denso"]',
              'img[alt*="VDO"]'
            ];
            for (const sel of logoSelectors) {
              const img = document.querySelector(sel);
              if (img && img.src) { brandLogo = img.src; break; }
            }
            // Fallback: look for brand logos by src pattern
            if (!brandLogo) {
              const allImgs = document.querySelectorAll('img');
              for (const img of allImgs) {
                const src = (img.src || '').toLowerCase();
                if (src.includes('bosch') || src.includes('delphi') || src.includes('siemens') || 
                    src.includes('continental') || src.includes('denso') || src.includes('vdo')) {
                  brandLogo = img.src;
                  break;
                }
              }
            }
            
            return { description, carImage, brandLogo };
          });
          
          if (pageData.description && pageData.description.length > 100) {
            product.description = pageData.description;
            processedCount++;
          }
          if (pageData.carImage) {
            product.carImage = pageData.carImage;
          }
          if (pageData.brandLogo) {
            product.brandLogo = pageData.brandLogo;
          }
          
        } catch (error) {
          console.log(`  Error fetching description: ${error.message}`);
          // Keep the default description
        }
      }
    }
    
    console.log(`\nUpdated ${processedCount} products with full descriptions`);
    
    if (allProducts.length === 0) {
      // Take a screenshot for debugging
      await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
      console.log('No products found. Screenshot saved to debug-screenshot.png');
      
      // Log page structure
      const pageStructure = await page.evaluate(() => {
        return {
          title: document.title,
          url: window.location.href,
          allLinks: Array.from(document.querySelectorAll('a')).map(a => ({
            text: a.textContent.trim().substring(0, 50),
            href: a.href
          })).filter(a => a.text.toLowerCase().includes('pompe') || a.href.toLowerCase().includes('pompe'))
        };
      });
      console.log('Page structure:', JSON.stringify(pageStructure, null, 2));
    }

    // Save to JSON file
    fs.writeFileSync('pompes-hp-products.json', JSON.stringify(allProducts, null, 2));
    console.log('Products saved to pompes-hp-products.json');

    return allProducts;

  } catch (error) {
    console.error('Error scraping:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function importToSupabase(products) {
  console.log(`Importing ${products.length} products to Supabase...`);
  
  for (const product of products) {
    try {
      // Parse price (remove currency symbols and convert to number)
      const priceText = product.price.replace(/[^\d.,]/g, '').replace(',', '.');
      const price = parseFloat(priceText) || 0;
      
      // Generate link_rewrite
      const linkRewrite = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Generate a unique ID (since Supabase doesn't auto-increment)
      const productId = Math.floor(Math.random() * 1000000) + 100000; // Random ID between 100000-1100000
      
      const { data, error } = await supabase
        .from('products')
        .insert({
          id: productId,
          name: product.name,
          description: product.description || product.name,
          price: price,
          reference: product.reference || `POMP-HP-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          link_rewrite: linkRewrite,
          id_category_default: 999,
          category_name: 'Pompes HP',
          images: [
            { id: product.image || '/assets/pompeImg.jpg' },
            ...(product.carImage ? [{ id: product.carImage, type: 'car' }] : []),
            ...(product.brandLogo ? [{ id: product.brandLogo, type: 'brand' }] : [])
          ],
          supplier_reference: 'AUTO-PLATINIUM',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error('Error inserting product:', error);
      } else {
        console.log(`Imported: ${product.name}`);
      }
    } catch (err) {
      console.error('Error processing product:', err);
    }
  }
}

// Main execution
(async () => {
  try {
    const products = await scrapePompesHP();
    
    if (products.length > 0) {
      await importToSupabase(products);
      console.log('Import completed!');
    } else {
      console.log('No products to import');
    }
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
})();
