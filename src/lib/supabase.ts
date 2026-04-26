import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  reference: string | null;
  link_rewrite: string | null;
  id_default_image: number | null;
  id_category_default: number | null;
  category_name: string | null;
  images: { id: string }[];
  created_at: string;
  updated_at: string;
}
