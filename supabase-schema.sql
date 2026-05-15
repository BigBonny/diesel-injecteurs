-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  reference TEXT,
  supplier_reference TEXT,
  link_rewrite TEXT,
  id_default_image BIGINT,
  id_category_default BIGINT,
  category_name TEXT,
  images JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL DEFAULT 'sogecommerce',
  transaction_id TEXT,
  prestashop_order_id BIGINT,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for orders
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_prestashop ON orders(prestashop_order_id);

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(id_category_default);

-- Create index for name search (brand filtering)
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('french', name));

-- Create index for reference search
CREATE INDEX IF NOT EXISTS idx_products_reference ON products USING gin(to_tsvector('french', reference));

-- Create index for supplier_reference search (compatible references)
CREATE INDEX IF NOT EXISTS idx_products_supplier_ref ON products USING gin(to_tsvector('french', supplier_reference));

-- Enable Row Level Security (but allow all for now)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all on products" ON products;
DROP POLICY IF EXISTS "Allow all on orders" ON orders;

CREATE POLICY "Allow all on products" ON products
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all on orders" ON orders
  FOR ALL USING (true) WITH CHECK (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;

-- Create triggers
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
