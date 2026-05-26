import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect old PrestaShop product URLs to new format
      {
        source: '/:id(\\d+)-:slug*.html',
        destination: '/produit/:id',
        permanent: true,
      },
      // Redirect old category/product URLs
      {
        source: '/:category(\\d+)-:slug*/:id(\\d+)-:productSlug*.html',
        destination: '/produit/:id',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
