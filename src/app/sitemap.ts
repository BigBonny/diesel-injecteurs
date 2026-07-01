import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://diesel-turbo-injection.com';

  // Static pages
  const staticPages = [
    '',
    '/produits',
    '/apropos',
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

  // Product pages — paginate to fetch all products
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const PAGE_SIZE = 1000;
  let allIds: number[] = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .range(from, from + PAGE_SIZE - 1);

    if (error || !data || data.length === 0) {
      hasMore = false;
    } else {
      allIds = allIds.concat(data.map((p: { id: number }) => p.id));
      from += PAGE_SIZE;
      if (data.length < PAGE_SIZE) hasMore = false;
    }
  }

  const productPages: MetadataRoute.Sitemap = allIds.map((id) => ({
    url: `${baseUrl}/produits/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages];
}
