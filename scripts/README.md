# Import Pompes HP Products from Auto-Platinium

## Method 1: Automated Scraping (Puppeteer)

```bash
# Install dependencies
pnpm add puppeteer csv-parse @supabase/supabase-js dotenv

# Run the scraper
node scripts/scrape-pompes-hp.js
```

**Note:** If the website blocks scrapers, use Method 2.

## Method 2: CSV Import (Recommended)

### Step 1: Create a CSV file

Create `pompes-hp-products.csv` with this format:

```csv
name,price,reference,description,image_url
Pompe HP Bosch 0445010241,450.00,0445010241,Pompe à haute pression Bosch reconditionnée,https://example.com/img1.jpg
Pompe HP Denso HP3,520.00,DENSO-HP3-001,Pompe injection Denso HP3,https://example.com/img2.jpg
Pompe HP Siemens 5WS40156,380.00,5WS40156,Pompe haute pression Siemens,https://example.com/img3.jpg
```

### Step 2: Run the import

```bash
# Install dependency
pnpm add csv-parse @supabase/supabase-js

# Import the CSV
node scripts/import-products-csv.js pompes-hp-products.csv
```

### CSV Columns

- **name** (required): Product name
- **price** (required): Price in euros
- **reference** (optional): Product reference/SKU
- **description** (optional): Product description
- **image_url** (optional): URL to product image

## Method 3: Manual Entry via SQL

You can also insert products directly into Supabase:

```sql
INSERT INTO products (
  name, description, price, reference, 
  link_rewrite, id_category_default, category_name,
  supplier_reference, images
) VALUES (
  'Pompe HP Bosch 0445010241',
  'Pompe à haute pression Bosch reconditionnée',
  450.00,
  '0445010241',
  'pompe-hp-bosch-0445010241',
  999,
  'Pompes HP',
  'AUTO-PLATINIUM',
  '[{"id": "image-url-or-path"}]'
);
```

## What Was Added to Your Site

1. **Navigation**: New "Pompes HP" tab in the main menu
2. **Category Filter**: Products appear when filtering by "Pompes HP"
3. **Dropdown Brands**: Bosch, Denso, Siemens, Continental, Delphi, etc.
4. **API Support**: Products API recognizes pompes-hp category

## Category Code

- **URL Parameter**: `?category=pompes-hp`
- **Category ID in DB**: 999
- **Category Name**: Pompes HP
