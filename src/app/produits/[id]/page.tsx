'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { 
  ShoppingCart, Heart, Star, ChevronRight, Truck, Shield, 
  Check, AlertCircle, Info, Minus, Plus,
  Package, RotateCcw, Wrench
} from 'lucide-react';
import { useCart } from '@/app/CartContext';

const CORE_CHARGE_AMOUNT = 80;

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(Array.isArray(params.id) ? params.id[0].split('-')[0] : params.id?.split('-')[0]);
  const { addItem, items } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [coreChargeAccepted, setCoreChargeAccepted] = useState(false);
  const [showCoreChargeInfo, setShowCoreChargeInfo] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        console.log('Fetching product with ID:', productId);
        const response = await fetch(`/api/product/${productId}`);
        console.log('API response status:', response.status);
        
        if (response.ok) {
          const productData = await response.json();
          console.log('Parsed product data:', productData);
          setProduct(productData);
        } else {
          console.error('API response not OK');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const inCart = items.find(item => item.id === productId);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Produit non trouvé</h1>
            <Link href="/produits" className="text-blue-600 hover:underline">
              Retour aux produits
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const price = product.price || 0;
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  const formattedPrice = `${numericPrice.toFixed(2)} €`;

  // Get image URL - try id_default_image first, then associations
  let imageUrl = '';
  if (product.id_default_image) {
    imageUrl = `/api/product-image/${product.id}/${product.id_default_image}`;
  } else if (product.associations?.images && product.associations.images.length > 0) {
    const imageId = product.associations.images[0].id;
    imageUrl = `/api/product-image/${product.id}/${imageId}`;
  }

  console.log('Product data for display:', { product, price, numericPrice, formattedPrice, imageUrl });

  const totalPrice = numericPrice + (coreChargeAccepted ? CORE_CHARGE_AMOUNT : 0);
  const totalWithQuantity = totalPrice * quantity;

  const handleAddToCart = () => {
    if (!coreChargeAccepted) {
      setShowCoreChargeInfo(true);
      return;
    }
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: numericPrice,
        originalPrice: numericPrice,
        image: imageUrl || '🔧',
        brand: 'PrestaShop',
        category: 'Pièces',
        coreChargeAccepted,
        coreChargeAmount: CORE_CHARGE_AMOUNT,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/produits" className="hover:text-blue-600 transition">Produits</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <section className="py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200">
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-32 h-32 text-slate-400" />
                )}
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  En stock
                </span>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h1>

              {/* Core Charge Section - MANDATORY */}
              <div className={`rounded-xl p-6 mb-8 border-2 transition-all ${coreChargeAccepted ? 'bg-green-50 border-green-500' : 'bg-amber-50 border-amber-400'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${coreChargeAccepted ? 'bg-green-500' : 'bg-amber-500'}`}>
                    <RotateCcw className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1">
                      Frais de remboursement (Consigne)
                      <span className="text-red-500 ml-1">*</span>
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      Cette pièce nécessite le retour de votre ancienne pièce défectueuse. 
                      Un dépôt de garantie de <strong>{CORE_CHARGE_AMOUNT}€</strong> est ajouté au panier 
                      et vous sera remboursé après réception de votre ancienne pièce.
                    </p>
                    <button
                      onClick={() => setShowCoreChargeInfo(!showCoreChargeInfo)}
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Info className="w-4 h-4" />
                      Comment ça marche ?
                    </button>
                    
                    {showCoreChargeInfo && (
                      <div className="mt-4 p-4 bg-white rounded-lg text-sm text-slate-600">
                        <ol className="space-y-2 list-decimal list-inside">
                          <li>Vous payez le prix du produit + {CORE_CHARGE_AMOUNT}€ de consigne</li>
                          <li>Nous vous expédions la pièce neuve/reconditionnée</li>
                          <li>Vous remplacez la pièce sur votre véhicule</li>
                          <li>Vous nous renvoyez votre ancienne pièce (étiquette retour fournie)</li>
                          <li>Nous vous remboursons les {CORE_CHARGE_AMOUNT}€ sous 48h après réception</li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>

                {/* Checkbox */}
                <div className="mt-4 pt-4 border-t border-amber-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={coreChargeAccepted}
                      onChange={(e) => setCoreChargeAccepted(e.target.checked)}
                      className="w-5 h-5 mt-0.5 text-blue-600 border-2 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium text-slate-900">
                        J&apos;accepte les frais de remboursement de {CORE_CHARGE_AMOUNT}€
                      </span>
                      <p className="text-sm text-slate-500 mt-1">
                        Obligatoire pour ajouter au panier. Remboursé à réception de l&apos;ancienne pièce.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-slate-900 font-medium">Quantité:</span>
                <div className="flex items-center gap-3 bg-white border border-slate-300 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-slate-100 rounded-l-xl transition text-slate-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-slate-100 rounded-r-xl transition text-slate-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Prix unitaire</span>
                    <span>{formattedPrice}</span>
                  </div>
                  {coreChargeAccepted && (
                    <div className="flex justify-between text-green-600">
                      <span>Frais de remboursement (remboursable)</span>
                      <span>+{CORE_CHARGE_AMOUNT}€</span>
                    </div>
                  )}
                  {!coreChargeAccepted && (
                    <div className="flex justify-between text-amber-600 text-sm">
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Frais de remboursement requis
                      </span>
                      <span>+{CORE_CHARGE_AMOUNT}€</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-slate-900">Total</span>
                      <span className="text-3xl font-bold text-blue-600">{totalWithQuantity}€</span>
                    </div>
                    {quantity > 1 && (
                      <p className="text-sm text-slate-500 text-right">
                        ({totalPrice}€ × {quantity})
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-semibold transition ${
                    addedToCart 
                      ? 'bg-green-500 text-white' 
                      : !coreChargeAccepted
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Ajouté au panier !
                    </>
                  ) : !coreChargeAccepted ? (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      Accepter la consigne pour continuer
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Ajouter au panier
                    </>
                  )}
                </button>
                <button className="p-4 border border-slate-300 rounded-xl hover:bg-slate-50 transition">
                  <Heart className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-200">
                <div className="text-center">
                  <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-900">Livraison 24h</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-900">Garantie 2 ans</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-900">Retour 30 jours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
              Description du produit
            </h2>
            <div className="prose prose-lg max-w-none text-slate-600 leading-relaxed">
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              ) : (
                <p className="text-slate-400 italic">Aucune description disponible pour ce produit.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
