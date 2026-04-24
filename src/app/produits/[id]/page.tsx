'use client';

import { useState } from 'react';
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

// Product data - same as produits page
const products = [
  { id: 1, name: 'Turbo Garrett GT1749V', category: 'Turbos', price: 349, originalPrice: 450, rating: 4.8, reviews: 124, inStock: true, brand: 'Garrett', model: 'GT1749V', image: '🔧', description: 'Turbo neuf Garrett GT1749V pour moteurs diesel 1.5 dCi. Performance OEM garantie.', specs: { 'Ref OEM': '454232-0001', 'Puissance': '105-110 CV', 'Années': '2003-2012', 'Garantie': '2 ans' }, compatible: ['Renault Clio III 1.5 dCi', 'Nissan Micra 1.5 dCi', 'Dacia Logan 1.5 dCi', 'Renault Kangoo 1.5 dCi'] },
  { id: 2, name: 'Injecteur Bosch 0445110', category: 'Injecteurs', price: 89, originalPrice: 120, rating: 4.9, reviews: 89, inStock: true, brand: 'Bosch', model: '0445110', image: '⚙️', description: 'Injecteur Bosch rénové et testé. Débit contrôlé sur banc d\'essai.', specs: { 'Ref OEM': '0445110015', 'Pression': '1600 bar', 'Type': 'Piézoélectrique', 'Garantie': '2 ans' }, compatible: ['Mercedes C220 CDI', 'BMW 320d E46', 'Audi A4 2.0 TDI'] },
  { id: 3, name: 'Pompe Denso HP3', category: 'Pompes', price: 289, originalPrice: 380, rating: 4.7, reviews: 56, inStock: true, brand: 'Denso', model: 'HP3', image: '🔩', description: 'Pompe à injection haute pression Denso HP3 reconditionnée.', specs: { 'Ref OEM': '294000-0120', 'Débit': '300 L/h', 'Pression': '2000 bar', 'Garantie': '2 ans' }, compatible: ['Toyota Hilux 2.5 D-4D', 'Ford Ranger 2.5 TDCi'] },
  { id: 4, name: 'Kit Réparation Turbo', category: 'Kits', price: 45, originalPrice: 65, rating: 4.6, reviews: 203, inStock: true, brand: 'Generic', model: 'Universal', image: '🛠️', description: 'Kit complet de réparation pour turbo K03/K04.', specs: { 'Contenu': 'Joints + paliers + clip', 'Universel': 'K03/K04 compatible', 'Qualité': 'OEM', 'Garantie': '1 an' }, compatible: ['VW Golf', 'Audi A3', 'Seat Leon', 'Skoda Octavia'] },
  { id: 5, name: 'Turbo KKK K03', category: 'Turbos', price: 299, originalPrice: 380, rating: 4.7, reviews: 87, inStock: true, brand: 'KKK', model: 'K03', image: '🔧', description: 'Turbo KKK K03 reconditionné avec vanne de régulation.', specs: { 'Ref OEM': '53039880029', 'Puissance': '90-115 CV', 'Vanne': 'VNT rénovée', 'Garantie': '2 ans' }, compatible: ['VW Golf IV 1.9 TDI', 'Audi A3 1.9 TDI', 'Seat Leon 1.9 TDI'] },
  { id: 6, name: 'Injecteur Delphi EJBR', category: 'Injecteurs', price: 125, originalPrice: 165, rating: 4.8, reviews: 45, inStock: true, brand: 'Delphi', model: 'EJBR', image: '⚙️', description: 'Injecteur Delphi EJBR pour moteurs Renault/Dacia.', specs: { 'Ref OEM': 'EJBR01801A', 'Pression': '1800 bar', 'Type': 'Common Rail', 'Garantie': '2 ans' }, compatible: ['Renault Clio 1.5 dCi', 'Dacia Logan 1.5 dCi', 'Renault Megane 1.5 dCi'] },
  { id: 7, name: 'Pompe Bosch CP1', category: 'Pompes', price: 199, originalPrice: 250, rating: 4.5, reviews: 32, inStock: false, brand: 'Bosch', model: 'CP1', image: '🔩', description: 'Pompe Bosch CP1 reconditionnée avec régulateur neuf.', specs: { 'Ref OEM': '0445010042', 'Débit': '400 L/h', 'Pression': '1600 bar', 'Garantie': '2 ans' }, compatible: ['Opel Astra 1.9 CDTI', 'Fiat Stilo 1.9 JTD'] },
  { id: 8, name: 'Turbo Mitsubishi TD04', category: 'Turbos', price: 389, originalPrice: 490, rating: 4.9, reviews: 76, inStock: true, brand: 'Mitsubishi', model: 'TD04', image: '🔧', description: 'Turbo Mitsubishi TD04 haute performance.', specs: { 'Ref OEM': '49177-02510', 'Puissance': '163-185 CV', 'Roulement': 'BB upgradé', 'Garantie': '2 ans' }, compatible: ['Volvo S60 2.4 D5', 'Volvo V70 2.4 D5', 'Saab 9-3 1.9 TiD'] },
  { id: 9, name: 'Injecteur Siemens 5WS4', category: 'Injecteurs', price: 79, originalPrice: 110, rating: 4.4, reviews: 28, inStock: true, brand: 'Siemens', model: '5WS4', image: '⚙️', description: 'Injecteur Siemens 5WS4 pour Ford et PSA.', specs: { 'Ref OEM': '5WS40156', 'Pression': '1650 bar', 'Type': 'Common Rail', 'Garantie': '2 ans' }, compatible: ['Ford Focus 1.6 TDCi', 'Peugeot 307 1.6 HDi', 'Citroen C4 1.6 HDi'] },
  { id: 10, name: 'Pompe VP44', category: 'Pompes', price: 450, originalPrice: 590, rating: 4.7, reviews: 15, inStock: true, brand: 'Bosch', model: 'VP44', image: '🔩', description: 'Pompe Bosch VP44 pour moteurs 5 cylindres.', specs: { 'Ref OEM': '0470504029', 'Débit': '500 L/h', 'Pression': '1800 bar', 'Garantie': '2 ans' }, compatible: ['BMW 525d E39', 'BMW X5 3.0d E53', 'Land Rover Defender'] },
  { id: 11, name: 'Kit Joints Turbo', category: 'Kits', price: 29, originalPrice: 45, rating: 4.3, reviews: 156, inStock: true, brand: 'Generic', model: 'Universal', image: '🛠️', description: 'Kit de joints pour turbo compresseur.', specs: { 'Contenu': 'Joints + circlips', 'Universel': 'Multi-marques', 'Qualité': 'Standard', 'Garantie': '1 an' }, compatible: ['Universel turbos'] },
  { id: 12, name: 'Turbo Holset HE221W', category: 'Turbos', price: 529, originalPrice: 680, rating: 4.8, reviews: 42, inStock: true, brand: 'Holset', model: 'HE221W', image: '🔧', description: 'Turbo Holset HE221W pour utilitaires et poids lourds.', specs: { 'Ref OEM': '4045878', 'Puissance': '200-250 CV', 'Wastegate': 'Électronique', 'Garantie': '2 ans' }, compatible: ['Cummins ISBe 4.5', 'Iveco Daily 3.0', 'Case IH Farmall'] },
];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);
  const { addItem, items } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [coreChargeAccepted, setCoreChargeAccepted] = useState(false);
  const [showCoreChargeInfo, setShowCoreChargeInfo] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = products.find(p => p.id === productId);
  const inCart = items.find(item => item.id === productId);

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

  const totalPrice = product.price + (coreChargeAccepted ? CORE_CHARGE_AMOUNT : 0);
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
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        brand: product.brand,
        category: product.category,
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
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <span className="text-9xl">{product.image}</span>
              </div>
              <div className="flex gap-4 mt-4">
                <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-blue-500">
                  <span className="text-3xl">{product.image}</span>
                </div>
                <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center opacity-50">
                  <Package className="w-8 h-8 text-slate-400" />
                </div>
                <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center opacity-50">
                  <Wrench className="w-8 h-8 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {product.brand}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
                  {product.category}
                </span>
                {product.inStock ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    En stock
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                    Rupture
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-slate-600">{product.rating} ({product.reviews} avis)</span>
              </div>

              <p className="text-lg text-slate-600 mb-8">{product.description}</p>

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
                <span className="text-slate-700 font-medium">Quantité:</span>
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-slate-100 rounded-l-xl transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-slate-100 rounded-r-xl transition"
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
                    <span>{product.price}€</span>
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
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-semibold transition ${
                    addedToCart 
                      ? 'bg-green-500 text-white' 
                      : !coreChargeAccepted
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                  } ${!product.inStock && 'opacity-50 cursor-not-allowed'}`}
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

          {/* Tabs Section */}
          <div className="mt-16">
            <div className="border-b border-slate-200 mb-8">
              <div className="flex gap-8">
                <button className="pb-4 border-b-2 border-blue-600 text-blue-600 font-medium">
                  Spécifications
                </button>
                <button className="pb-4 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
                  Compatibilité
                </button>
                <button className="pb-4 border-b-2 border-transparent text-slate-600 hover:text-slate-900">
                  Avis ({product.reviews})
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Specs */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Caractéristiques techniques</h3>
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  {Object.entries(product.specs).map(([key, value], index) => (
                    <div 
                      key={key} 
                      className={`flex justify-between p-4 ${index !== Object.keys(product.specs).length - 1 ? 'border-b border-slate-200' : ''} ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                    >
                      <span className="text-slate-600">{key}</span>
                      <span className="font-medium text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compatibility */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Véhicules compatibles</h3>
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <ul className="space-y-3">
                    {product.compatible.map((vehicle, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-slate-700">{vehicle}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-slate-500 mt-4">
                    Cette liste n&apos;est pas exhaustive. Contactez-nous pour vérifier la compatibilité avec votre véhicule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
