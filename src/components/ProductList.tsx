'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Package } from 'lucide-react';
import Link from 'next/link';

interface APIProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  reference: string;
  link_rewrite: string;
  id_default_image: string;
  id_category_default: string;
  associations: {
    images: Array<{ id: string }>;
  };
}

export default function ProductList({ limit = 6 }: { limit?: number }) {
  const [products, setProducts] = useState<APIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(`/api/products?limit=${limit}&display=full`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        
        console.log('ProductList received data:', data);
        
        // PrestaShop API returns data in format: { products: [...] }
        const productsData = data.products || [];
        console.log('ProductList products count:', productsData.length);
        setProducts(productsData);
      } catch (err) {
        console.error('ProductList error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [limit]);

  const getProductName = (product: APIProduct): string => {
    return product.name || 'Product';
  };

  const getProductPrice = (product: APIProduct): string => {
    const price = parseFloat(product.price) || 0;
    return `${price.toFixed(2)} €`;
  };

  const getImageUrl = (product: APIProduct): string => {
    if (product.id_default_image) {
      return `/api/product-image/${product.id}/${product.id_default_image}`;
    } else if (product.associations?.images && product.associations.images.length > 0) {
      const imageId = product.associations.images[0].id;
      return `/api/product-image/${product.id}/${imageId}`;
    }
    return '';
  };

  const getProductUrl = (product: APIProduct): string => {
    if (product.link_rewrite) {
      return `/produits/${product.id}-${product.link_rewrite}`;
    }
    return `/produits/${product.id}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-2xl p-6 animate-pulse">
            <div className="w-full h-48 bg-white/10 rounded-xl mb-4" />
            <div className="h-4 bg-white/10 rounded mb-2" />
            <div className="h-4 bg-white/10 rounded w-2/3 mb-4" />
            <div className="h-6 bg-white/10 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">Error loading products: {error}</p>
        <p className="text-gray-400">Please check your PrestaShop API configuration.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No products found in PrestaShop.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={getProductUrl(product)}
          className="block"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 border border-white/10 h-full">
            <div className="w-full h-48 bg-white/10 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              {getImageUrl(product) ? (
                <img
                  src={getImageUrl(product)}
                  alt={getProductName(product)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <Package className="w-20 h-20 text-blue-400" />
              )}
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
              {getProductName(product)}
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-400">
                {getProductPrice(product)}
              </span>
              
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-blue-600/30 transition flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
