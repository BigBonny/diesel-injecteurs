import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect old PrestaShop .html URLs: /1234-product-name.html -> /produit/1234
      {
        source: '/:path(.*)-:id([0-9]+)\\.html',
        destination: '/produit/:id',
        permanent: true,
      },
      // Alternative PrestaShop format: /1234-product-name.html
      {
        source: '/:id([0-9]+)-:slug(.*)\\.html',
        destination: '/produit/:id',
        permanent: true,
      },
      // Old category/product .html URLs
      {
        source: '/:categoryId([0-9]+)-:categorySlug/:productId([0-9]+)-:productSlug(.*)\\.html',
        destination: '/produit/:productId',
        permanent: true,
      },
      // Redirect /produits/ID-slug (wrong format from old code) to /produit/ID
      {
        source: '/produits/:id([0-9]+)-:slug*',
        destination: '/produit/:id',
        permanent: true,
      },
      // Redirect /produits/ID (no slug) to /produit/ID
      {
        source: '/produits/:id([0-9]+)',
        destination: '/produit/:id',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
