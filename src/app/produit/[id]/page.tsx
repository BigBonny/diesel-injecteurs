import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error || !product) {
      console.error('Error fetching product:', error);
      return null;
    }

    return {
      id: String(product.id),
      name: product.name || 'Product',
      description: product.description || '',
      price: product.price ? String(product.price) : '0.00',
      reference: product.reference || '',
      link_rewrite: product.link_rewrite || '',
      id_default_image: product.id_default_image ? String(product.id_default_image) : null,
      images: product.images || [],
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  // Extract numeric ID from URL (format: {id}-{slug})
  const numericId = id.split('-')[0];
  const product = await getProduct(numericId);

  if (!product) {
    notFound();
  }

  const name = product.name || 'Product';
  const description = product.description || '';
  const price = product.price || 0;
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  const formattedPrice = `${numericPrice.toFixed(2)} €`;

  // Get image URL
  let imageUrl = '';
  if (product.id_default_image) {
    imageUrl = `/api/product-image/${product.id}/${product.id_default_image}`;
  } else if (product.images && product.images.length > 0) {
    imageUrl = `/api/product-image/${product.id}/${product.images[0].id}`;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition">
          <ArrowLeft className="w-5 h-5" />
          Retour à l&apos;accueil
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-32 h-32 text-gray-400" />
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{name}</h1>
            
            <p className="text-3xl font-bold text-blue-600 mb-6">{formattedPrice}</p>
            
            <div className="prose prose-lg max-w-none text-gray-600 mb-8">
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-linear-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-600/30 transition flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Ajouter au panier
              </button>
            </div>

            {/* Additional product info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations produit</h3>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <dt className="text-gray-500">Référence</dt>
                <dd className="text-gray-900">{product.reference || 'N/A'}</dd>
                <dt className="text-gray-500">Disponibilité</dt>
                <dd className="text-green-600">En stock</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
