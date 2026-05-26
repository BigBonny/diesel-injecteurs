import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect old PrestaShop product URLs: /1234-product-name.html -> /produit/1234
      {
        source: '/:path(.*)-:id([0-9]+)\\.html',
        destination: '/produit/:id',
        permanent: true,
      },
      // Alternative PrestaShop format with numeric ID at start: /1234-product-name.html
      {
        source: '/:id([0-9]+)-:slug(.*)\\.html',
        destination: '/produit/:id',
        permanent: true,
      },
      // Old category/product URLs: /12-category/34-product.html
      {
        source: '/:categoryId([0-9]+)-:categorySlug/:productId([0-9]+)-:productSlug(.*)\\.html',
        destination: '/produit/:productId',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
