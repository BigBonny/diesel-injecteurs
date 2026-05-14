import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Use server IP directly to avoid SSL and DNS issues
const PRESTASHOP_API_URL = 'http://192.162.69.186/api';
const PRESTASHOP_API_KEY = process.env.PRESTASHOP_API_KEY || '';

async function getProduct(id: string) {
  try {
    const response = await fetch(`${PRESTASHOP_API_URL}/products/${id}?ws_key=${PRESTASHOP_API_KEY}&display=full`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    
    // PrestaShop API returns XML, parse it
    const productMatch = text.match(/<product>([\s\S]*?)<\/product>/);
    if (!productMatch) {
      return null;
    }

    const productXml = productMatch[1];
    
    // Helper to extract XML values
    const extractValue = (tag: string) => {
      const match = productXml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`));
      return match ? match[1] : null;
    };

    const extractLanguageValue = (tag: string) => {
      const match = productXml.match(new RegExp(`<${tag}[^>]*><language[^>]*>([^<]*)</language></${tag}>`));
      return match ? match[1] : null;
    };

    // Extract associations
    const extractAssociations = () => {
      const imagesMatch = productXml.match(/<images>([\s\S]*?)<\/images>/);
      if (!imagesMatch) return { images: [] };
      
      const imageMatches = imagesMatch[1].matchAll(/<image>([\s\S]*?)<\/image>/g);
      const images = [];
      for (const match of imageMatches) {
        const idMatch = match[1].match(/<id>([^<]*)<\/id>/);
        if (idMatch) {
          images.push({ id: idMatch[1] });
        }
      }
      return { images };
    };

    return {
      id: extractValue('id'),
      name: extractLanguageValue('name') || extractValue('name'),
      description: extractLanguageValue('description') || extractValue('description'),
      price: extractValue('price'),
      reference: extractValue('reference'),
      link_rewrite: extractLanguageValue('link_rewrite') || extractValue('link_rewrite'),
      associations: extractAssociations(),
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
  if (product.associations?.images && product.associations.images.length > 0) {
    const imageId = product.associations.images[0].id;
    imageUrl = `/api/product-image/${product.id}/${imageId}`;
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
