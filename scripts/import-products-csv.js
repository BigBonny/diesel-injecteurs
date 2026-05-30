/**
 * Manual CSV Import Script for Pompes HP Products
 * 
 * Usage:
 * 1. Create a CSV file with columns: name, price, reference, description, image_url
 * 2. Run: node scripts/import-products-csv.js pompes-hp-products.csv
 */

const fs = require('fs');
const csv = require('csv-parse/sync');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function parsePrice(priceText) {
  if (!priceText) return 0;
  // Remove currency symbols, spaces, and convert comma to dot
  const cleaned = priceText
    .replace(/[^\d.,]/g, '')
    .replace(',', '.');
  return parseFloat(cleaned) || 0;
}

function generateLinkRewrite(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 128); // Limit length
}

async function importFromCSV(csvFilePath) {
  console.log(`Reading CSV file: ${csvFilePath}`);
  
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
  const records = csv.parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  console.log(`Found ${records.length} products in CSV`);

  for (const record of records) {
    try {
      const name = record.name || record.nom || record.product || record.produit;
      const priceText = record.price || record.prix || record.amount || record.montant;
      const reference = record.reference || record.ref || record.sku || `POMP-HP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const description = record.description || record.desc || name;
      const imageUrl = record.image_url || record.image || record.photo || record.img;

      if (!name) {
        console.log('Skipping row without name:', record);
        continue;
      }

      const price = parsePrice(priceText);
      const linkRewrite = generateLinkRewrite(name);

      const { data, error } = await supabase
        .from('products')
        .insert({
          name: name,
          description: description,
          price: price,
          reference: reference,
          link_rewrite: linkRewrite,
          id_category_default: 999, // Pompes HP category
          category_name: 'Pompes HP',
          images: imageUrl ? [{ id: imageUrl }] : [],
          supplier_reference: 'AUTO-PLATINIUM',
          compatible_references: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        if (error.code === '23505') { // Duplicate key
          console.log(`Skipping duplicate: ${name} (ref: ${reference})`);
        } else {
          console.error(`Error inserting ${name}:`, error);
        }
      } else {
        console.log(`✓ Imported: ${name} (${price}€)`);
      }
    } catch (err) {
      console.error('Error processing row:', err, record);
    }
  }

  console.log('\nImport completed!');
}

// Example CSV template
const exampleCSV = `name,price,reference,description,image_url
Pompe HP Bosch 0445010241,450.00,0445010241,Pompe à haute pression Bosch reconditionnée pour moteurs diesel,https://example.com/image1.jpg
Pompe HP Denso HP3,520.00,DENSO-HP3-001,Pompe injection Denso HP3 reconditionnée avec garantie 2 ans,https://example.com/image2.jpg
Pompe HP Siemens 5WS40156,380.00,5WS40156,Pompe haute pression Siemens reconditionnée testée sur banc,https://example.com/image3.jpg`;

// Main
const csvFile = process.argv[2];

if (!csvFile) {
  console.log('Usage: node import-products-csv.js <csv-file-path>');
  console.log('\nExample CSV format:');
  console.log(exampleCSV);
  console.log('\nRequired columns: name, price');
  console.log('Optional columns: reference, description, image_url');
  process.exit(0);
}

if (!fs.existsSync(csvFile)) {
  console.error(`File not found: ${csvFile}`);
  process.exit(1);
}

importFromCSV(csvFile).catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
