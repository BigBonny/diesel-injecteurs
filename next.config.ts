import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.auto-platinium.com',
      },
      {
        protocol: 'https',
        hostname: 'auto-platinium.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'diesel-turbo-injection.com',
      },
    ],
  },
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
    ];
  },
};

export default nextConfig;
