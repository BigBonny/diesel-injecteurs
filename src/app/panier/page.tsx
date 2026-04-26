'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { useCart } from '@/app/CartContext';
import { 
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package, 
  Truck, ShieldCheck, CreditCard, Gift, ChevronRight, RotateCcw, Loader2
} from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, coreChargeTotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');

  const discount = promoApplied ? subtotal * 0.1 : 0;
  // Temporarily disable shipping and core charge for testing
  const shipping = 0;
  const finalTotal = subtotal - discount + shipping;

  const applyPromo = () => {
    if (promoCode.toLowerCase() === 'id10' || promoCode.toLowerCase() === 'welcome10') {
      setPromoApplied(true);
    }
  };

  const handleCheckout = async () => {
    if (!customerEmail || !customerName) {
      alert('Veuillez remplir votre email et votre nom');
      return;
    }

    if (items.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          currency: 'EUR',
          orderId,
          customerEmail,
          customerName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const data = await response.json();
      
      // Clear cart and redirect to Sogecommerce payment page
      clearCart();
      window.location.href = data.formToken;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Une erreur est survenue lors de la création du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-stone-500">
            <Link href="/" className="hover:text-blue-600 transition">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-stone-900 font-medium">Panier</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-3xl font-bold text-stone-900 mb-8 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          Votre Panier
          <span className="text-lg font-normal text-stone-500">({items.length} articles)</span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-stone-400" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Votre panier est vide</h2>
            <p className="text-stone-500 mb-8">Découvrez nos produits et ajoutez-les à votre panier</p>
            <Link 
              href="/produits" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
            >
              Continuer les achats
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition group"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-slate-200 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image.startsWith('/api/') ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className="text-4xl">{item.image}</span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-stone-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-stone-500 mb-2">{item.brand}</p>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                              <Package className="w-3 h-3" />
                              En stock
                            </span>
                            {item.coreChargeAccepted && (
                              <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                <RotateCcw className="w-3 h-3" />
                                Consigne incluse
                              </span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-slate-300 bg-white rounded-lg hover:border-blue-500 hover:text-blue-600 transition text-slate-900 font-bold"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-bold text-slate-900">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-slate-300 bg-white rounded-lg hover:border-blue-500 hover:text-blue-600 transition text-slate-900 font-bold"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-stone-900">
                            {((item.price + (item.coreChargeAccepted ? item.coreChargeAmount : 0)) * item.quantity).toFixed(2)} €
                          </p>
                          {item.coreChargeAccepted && (
                            <p className="text-xs text-amber-600">dont {item.coreChargeAmount}€ consigne</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Core Charge Info */}
              {coreChargeTotal > 0 && (
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                  <h3 className="font-semibold text-stone-900 mb-2 flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-amber-600" />
                    Frais de remboursement (Consigne)
                  </h3>
                  <p className="text-sm text-stone-600 mb-3">
                    Des frais de consigne de {coreChargeTotal.toFixed(2)}€ sont inclus dans votre total. 
                    Ces frais vous seront remboursés sous 48h après réception de votre ancienne pièce.
                  </p>
                  <Link 
                    href="#" 
                    className="text-sm text-blue-600 hover:underline"
                  >
                    En savoir plus sur le processus de remboursement →
                  </Link>
                </div>
              )}

              {/* Promo Code */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-blue-600" />
                  Code promo
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Entrez votre code (ex: ID10)"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white transition outline-none text-slate-900"
                  />
                  <button 
                    onClick={() => {
                      if (promoCode.toLowerCase() === 'id10' || promoCode.toLowerCase() === 'welcome10') {
                        setPromoApplied(true);
                      }
                    }}
                    className="px-6 py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition"
                  >
                    Appliquer
                  </button>
                </div>
                {promoApplied && (
                  <p className="mt-3 text-sm text-green-600 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Code promo appliqué : -10% de réduction
                  </p>
                )}
              </div>

              {/* Continue Shopping */}
              <Link 
                href="/produits" 
                className="inline-flex items-center gap-2 text-stone-600 hover:text-blue-600 transition"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Continuer les achats
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 sticky top-24">
                <h2 className="text-xl font-bold text-stone-900 mb-6">Récapitulatif</h2>

                {/* Customer Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white transition outline-none text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Nom complet *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Jean Dupont"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white transition outline-none text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-stone-600">
                    <span>Sous-total produits</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>
                  
                  {coreChargeTotal > 0 && (
                    <div className="flex justify-between text-amber-600">
                      <span className="flex items-center gap-1">
                        <RotateCcw className="w-4 h-4" />
                        Consigne (remboursable)
                      </span>
                      <span>+{coreChargeTotal.toFixed(2)} €</span>
                    </div>
                  )}
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Réduction</span>
                      <span>-{discount.toFixed(2)} €</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      Livraison
                    </span>
                    <span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}</span>
                  </div>

                  {shipping === 0 && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Livraison gratuite dès 150€ d&apos;achat
                    </p>
                  )}
                </div>

                <div className="border-t border-stone-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-stone-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">{finalTotal.toFixed(2)} €</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">TTC • Taxes incluses</p>
                  {coreChargeTotal > 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      Dont {coreChargeTotal.toFixed(2)}€ de consigne remboursable
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Commander
                    </>
                  )}
                </button>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-stone-500">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span>Paiement sécurisé SSL</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-stone-500">
                    <Truck className="w-5 h-5 text-blue-500" />
                    <span>Livraison 24-48h</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-stone-500">
                    <Package className="w-5 h-5 text-purple-500" />
                    <span>Retour gratuit 30 jours</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-stone-200">
                  <p className="text-xs text-stone-400 text-center mb-3">Moyens de paiement acceptés</p>
                  <div className="flex justify-center gap-2">
                    {['CB', 'Visa', 'MC', 'PayPal', 'Apple Pay'].map((method) => (
                      <div key={method} className="px-3 py-1 bg-stone-100 rounded text-xs font-medium text-stone-600">
                        {method}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
