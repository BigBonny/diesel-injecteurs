import { redirect } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  // Redirect to the working product page at /produits/[id]
  redirect(`/produits/${id}`);
}
