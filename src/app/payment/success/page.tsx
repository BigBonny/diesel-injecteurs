'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { CheckCircle, ShoppingBag, Home, Package } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Verify order status with Supabase
    const verifyOrder = async () => {
      if (orderId) {
        try {
          const response = await fetch(`/api/orders/${orderId}`);
          if (response.ok) {
            const order = await response.json();
            console.log('Order verified:', order);
          }
        } catch (error) {
          console.error('Error verifying order:', error);
        }
      }
    };

    verifyOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-lg">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-center text-stone-900 mb-4">
            Paiement réussi !
          </h1>

          <p className="text-center text-stone-600 mb-8">
            Merci pour votre commande. Nous avons bien reçu votre paiement.
          </p>

          {orderId && (
            <div className="bg-slate-50 rounded-xl p-4 mb-8">
              <p className="text-sm text-stone-500 mb-1">Numéro de commande</p>
              <p className="font-mono font-bold text-stone-900">{orderId}</p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-stone-600">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Votre commande sera traitée sous 24-48h</span>
            </div>
            <div className="flex items-center gap-3 text-stone-600">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Un email de confirmation vous sera envoyé</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              <Home className="w-5 h-5" />
              Retour à l'accueil
            </Link>
            <Link
              href="/produits"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-100 text-stone-900 rounded-xl font-semibold hover:bg-stone-200 transition"
            >
              <ShoppingBag className="w-5 h-5" />
              Continuer mes achats
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
