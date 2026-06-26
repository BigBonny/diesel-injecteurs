import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://diesel-turbo-injection.com';

  // Static pages
  const staticPages = [
    '',
    '/produits',
    '/a-propos',
    '/retour-consigne',
    '/cgv',
    '/mentions-legales',
    '/confidentialite',
    '/contact',
    '/livraison',
    '/garantie',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return staticPages;
}
