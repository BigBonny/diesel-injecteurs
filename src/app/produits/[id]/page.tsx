'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { 
  ShoppingCart, Heart, ChevronRight, Truck, Shield, 
  Check, AlertCircle, Info, Minus, Plus,
  Package, RotateCcw
} from 'lucide-react';
import { useCart } from '@/app/CartContext';

const CORE_CHARGE_AMOUNT = 80;

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(Array.isArray(params.id) ? params.id[0].split('-')[0] : params.id?.split('-')[0]);
  const { addItem, items } = useCart();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const _inCart = items.find(item => item.id === productId);

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

  // Get image URL - handle internal PrestaShop images, external URLs, and local assets
  let imageUrl = '';
  if (product.id_default_image) {
    imageUrl = `/api/product-image/${product.id}/${product.id_default_image}`;
  } else if (product.associations?.images && product.associations.images.length > 0) {
    const imageId = product.associations.images[0].id;
    // Check if it's an external URL (from scraped products) or local asset path
    if (imageId && (imageId.startsWith('http') || imageId.startsWith('/'))) {
      imageUrl = imageId;
    } else {
      imageUrl = `/api/product-image/${product.id}/${imageId}`;
    }
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
              <div className="aspect-square bg-linear-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center overflow-hidden">
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
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${coreChargeAccepted ? 'bg-green-500' : 'bg-amber-500'}`}>
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

          {/* Pompes HP Full Description Layout */}
          {product.category_name === 'Pompes HP' && (() => {
            // Parse product name to extract vehicle & pump info
            const nameMatch = product.name.match(/Pompe à haute pression\s+(.+?)(?:\s+(?:BOSCH|SIEMENS|CONTINENTAL|DELPHI|DENSO|VDO|SIEMENS\/VDO|CONTINENTAL\/VDO)\s*\()/i);
            const vehicleInfo = nameMatch ? nameMatch[1].trim() : product.name.replace('Pompe à haute pression ', '');
            const pumpBrandMatch = product.name.match(/(BOSCH|SIEMENS\/VDO|CONTINENTAL\/VDO|SIEMENS|CONTINENTAL|DELPHI|DENSO)\s*\(/i);
            const pumpBrand = pumpBrandMatch ? pumpBrandMatch[1] : null;
            const refMatch = product.name.match(/\(([^)]+)\)\s*$/);
            const refCode = refMatch ? refMatch[1] : product.reference;

            // Get car image from images array
            const images = product.associations?.images || product.images || [];
            const carImageObj = images.find((img: { type?: string }) => img.type === 'car');
            const carImage = carImageObj?.id || null;

            // Brand logo mapping from auto-platinium
            const brandLogoMap: Record<string, string> = {
              'BOSCH': 'https://www.auto-platinium.com/img/su/1.jpg',
              'DELPHI': 'https://www.auto-platinium.com/img/su/6.jpg',
              'SIEMENS/VDO': 'https://www.auto-platinium.com/img/su/15.jpg',
              'SIEMENS': 'https://www.auto-platinium.com/img/su/15.jpg',
              'CONTINENTAL/VDO': 'https://www.auto-platinium.com/img/su/8.jpg',
              'CONTINENTAL': 'https://www.auto-platinium.com/img/su/8.jpg',
              'VDO': 'https://www.auto-platinium.com/img/su/8.jpg',
              'DENSO': 'https://www.auto-platinium.com/img/su/9.jpg',
            };
            const brandLogo = pumpBrand ? (brandLogoMap[pumpBrand.toUpperCase()] || null) : null;

            // Parse vehicle specs from name
            const carBrand = vehicleInfo.split(' ')[0];
            const modelMatch = vehicleInfo.match(/^(\w+)\s+(.+?)\s+(\d+\.?\d*\s*(?:HDi|TDCi|TDI|dCi|JTDM|CRDi|CDTi|D|CRDI|BlueHDi|Blue dCi|GTi|THP|DI|JTD|Multijet|CRD|CDTI)[^[]*)/i);
            const carModel = modelMatch ? modelMatch[2] : vehicleInfo.replace(carBrand, '').trim().split(/\d+\.?\d*\s*(HDi|TDCi|TDI)/)[0].trim();
            const motorMatch = vehicleInfo.match(/(\d+\.?\d*\s*(?:HDi|TDCi|TDI|dCi|JTDM|CRDi|CDTi|D|CRDI|BlueHDi|Blue dCi|GTi|THP|DI|JTD|Multijet|CRD|CDTI)[^[]*)/i);
            const motorisation = motorMatch ? motorMatch[1].trim() : '';
            const cvMatch = vehicleInfo.match(/(\d+)\s*CV/i);
            const puissanceDIN = cvMatch ? `${cvMatch[1]} CV` : '';
            const dateMatch = vehicleInfo.match(/\[([^\]]+)\]/);
            const annee = dateMatch ? `[${dateMatch[1]}]` : '';

            // Split description into paragraphs
            const descParagraphs = product.description ? product.description.split('\n\n').filter((p: string) => p.trim().length > 0) : [];

            return (
              <>
                {/* Mon véhicule + Fiche technique */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Mon véhicule */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-1m8 1V6a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16" />
                      </svg>
                      Mon véhicule
                    </h3>
                    <p className="text-sm text-slate-700 font-medium mb-4">{product.name}</p>

                    {/* Car Image */}
                    {carImage && (
                      <div className="mb-5 flex justify-center">
                        <img src={carImage} alt={vehicleInfo} className="max-h-40 object-contain rounded-lg" />
                      </div>
                    )}

                    {/* Vehicle Specs Table */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="flex items-center gap-2 py-1.5 border-b border-slate-100">
                        <span className="text-blue-600">●</span>
                        <span className="text-slate-500">Marque</span>
                        <span className="ml-auto font-medium text-slate-900">{carBrand}</span>
                      </div>
                      <div className="flex items-center gap-2 py-1.5 border-b border-slate-100">
                        <span className="text-blue-600">●</span>
                        <span className="text-slate-500">Modèle</span>
                        <span className="ml-auto font-medium text-slate-900">{carModel || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 py-1.5 border-b border-slate-100">
                        <span className="text-blue-600">●</span>
                        <span className="text-slate-500">Motorisation</span>
                        <span className="ml-auto font-medium text-slate-900">{motorisation || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 py-1.5 border-b border-slate-100">
                        <span className="text-blue-600">●</span>
                        <span className="text-slate-500">Puissance DIN</span>
                        <span className="ml-auto font-medium text-slate-900">{puissanceDIN || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 py-1.5 border-b border-slate-100">
                        <span className="text-blue-600">●</span>
                        <span className="text-slate-500">Année</span>
                        <span className="ml-auto font-medium text-slate-900">{annee || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 py-1.5 border-b border-slate-100">
                        <span className="text-blue-600">●</span>
                        <span className="text-slate-500">Énergie</span>
                        <span className="ml-auto font-medium text-slate-900">Diesel</span>
                      </div>
                    </div>
                  </div>

                  {/* Fiche technique */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-5">Fiche technique</h3>

                    {/* Pump Brand Logo */}
                    <div className="mb-6 flex items-center justify-center">
                      {brandLogo ? (
                        <img src={brandLogo} alt={pumpBrand || 'Pump brand'} className="max-h-16 object-contain" />
                      ) : pumpBrand ? (
                        <div className="px-6 py-3 bg-slate-900 rounded-xl">
                          <span className="text-lg font-bold text-white tracking-wide">{pumpBrand}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Marque Pompe</span>
                        <span className="font-medium text-slate-900">{pumpBrand || '—'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Type</span>
                        <span className="font-medium text-slate-900">Pompe Haute Pression (CR)</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Origine</span>
                        <span className="font-medium text-slate-900">Reconditionné</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Poids</span>
                        <span className="font-medium text-slate-900">≈ 6 kg</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Référence</span>
                        <span className="font-medium text-blue-600 font-mono">{refCode || '—'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-500">Ce que contient ce colis</span>
                        <span className="font-medium text-slate-900">Étiquette de retour</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate-500">Garantie</span>
                        <span className="font-medium text-green-600">2 ans</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations détaillées */}
                <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-blue-100">
                    Informations détaillées
                  </h2>
                  <div className="space-y-6">
                    {descParagraphs.length > 0 ? (
                      descParagraphs.map((paragraph: string, index: number) => {
                        // Check if paragraph looks like a heading (short and ends without period)
                        const isHeading = paragraph.length < 120 && !paragraph.endsWith('.') && (
                          paragraph.includes('?') || 
                          paragraph.startsWith('Quelle') ||
                          paragraph.startsWith('Quand') ||
                          paragraph.startsWith('Pourquoi') ||
                          paragraph.startsWith('Comment') ||
                          paragraph.startsWith('Pompe à injection')
                        );
                        
                        if (isHeading) {
                          return (
                            <h3 key={index} className="text-lg font-bold text-slate-900 mt-8 mb-2 first:mt-0">
                              {paragraph}
                            </h3>
                          );
                        }
                        return (
                          <p key={index} className="text-slate-600 leading-7">
                            {paragraph}
                          </p>
                        );
                      })
                    ) : (
                      <p className="text-slate-400 italic">Aucune description disponible pour ce produit.</p>
                    )}
                  </div>
                </div>

                {/* Les plus du produit */}
                <div className="mt-6 bg-slate-900 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-white mb-4">Les plus du produit</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 text-white/90">
                      <span className="text-blue-400">→</span>
                      <span className="text-sm">Reconditionnée en France dans nos ateliers de production</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <span className="text-blue-400">→</span>
                      <span className="text-sm">Techniciens formés régulièrement</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <span className="text-blue-400">→</span>
                      <span className="text-sm">Des réglages certifiés en usine</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <span className="text-blue-400">→</span>
                      <span className="text-sm">Une garantie fabricant de deux ans</span>
                    </div>
                  </div>
                </div>

                {/* Références compatibles */}
                {refCode && (
                  <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Références compatibles</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-mono text-slate-700 border border-slate-200">{refCode}</span>
                      {product.reference && product.reference !== refCode && (
                        <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-mono text-slate-700 border border-slate-200">{product.reference.replace('Ref. ', '')}</span>
                      )}
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {/* Generic Description Section (for non-Pompes HP products) */}
          {product.category_name !== 'Pompes HP' && (
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
          )}
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
