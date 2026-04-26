export interface PrestaShopProduct {
  id: number;
  id_manufacturer?: number;
  id_supplier?: number;
  id_category_default?: number;
  id_shop_default?: number;
  id_tax_rules_group?: number;
  on_sale?: boolean;
  online_only?: boolean;
  ean13?: string;
  upc?: string;
  quantity?: number;
  minimal_quantity?: number;
  price?: number;
  wholesale_price?: number;
  unity?: string;
  unit_price_ratio?: number;
  additional_shipping_cost?: number;
  reference?: string;
  supplier_reference?: string;
  location?: string;
  width?: number;
  height?: number;
  depth?: number;
  weight?: number;
  out_of_stock?: number;
  quantity_discount?: string;
  customizable?: number;
  uploadable_files?: number;
  text_fields?: number;
  active?: boolean;
  redirect_type?: string;
  id_type_redirected?: number;
  available_for_order?: boolean;
  available_date?: string;
  show_condition?: boolean;
  condition?: string;
  show_price?: boolean;
  indexed?: string;
  visibility?: string;
  advanced_stock_management?: boolean;
  date_add?: string;
  date_upd?: string;
  pack_stock_type?: number;
  meta_description?: string;
  meta_keywords?: string;
  meta_title?: string;
  link_rewrite?: string;
  name?: string | { language: string; value: string }[];
  description?: string | { language: string; value: string }[];
  description_short?: string | { language: string; value: string }[];
  available_now?: string | { language: string; value: string }[];
  available_later?: string | { language: string; value: string }[];
  associations?: {
    categories?: { id: number }[];
    images?: { id: number }[];
    manufacturers?: { id: number }[];
    suppliers?: { id: number }[];
    product_options?: { id: number }[];
    product_option_values?: { id: number }[];
  };
}

export interface PrestaShopImage {
  id: number;
  id_product: number;
  position: number;
  cover: boolean;
  legend?: string;
  source?: string;
}

export interface PrestaShopCategory {
  id: number;
  id_parent?: number;
  id_shop_default?: number;
  level_depth?: number;
  active?: boolean;
  date_add?: string;
  date_upd?: string;
  position?: number;
  is_root_category?: boolean;
  name?: string | { language: string; value: string }[];
  link_rewrite?: string | { language: string; value: string }[];
  description?: string | { language: string; value: string }[];
  meta_title?: string | { language: string; value: string }[];
  meta_description?: string | { language: string; value: string }[];
  meta_keywords?: string | { language: string; value: string }[];
  associations?: {
    categories?: { id: number }[];
    products?: { id: number }[];
  };
}

export interface PrestaShopAPIResponse<T> {
  [key: string]: T[];
}
