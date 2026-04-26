'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { XCircle, ShoppingBag, Home, RefreshCw } from 'lucide-react';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-lg">
      {/* Cancel Icon */}
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-10 h-10 text-red-600" />
      </div>

      <h1 className="text-3xl font-bold text-center text-stone-900 mb-4">
        Paiement annulé
      </h1>

      <p className="text-center text-stone-600 mb-8">
        Votre paiement a été annulé. Aucun montant n&apos;a été débité de votre compte.
      </p>

      {orderId && (
        <div className="bg-slate-50 rounded-xl p-4 mb-8">
          <p className="text-sm text-stone-500 mb-1">Numéro de commande</p>
          <p className="font-mono font-bold text-stone-900">{orderId}</p>
        </div>
      )}

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3 text-stone-600">
          <RefreshCw className="w-5 h-5 text-blue-600" />
          <span>Vous pouvez réessayer votre paiement à tout moment</span>
        </div>
        <div className="flex items-center gap-3 text-stone-600">
          <XCircle className="w-5 h-5 text-red-600" />
          <span>Votre panier a été conservé</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/panier"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          <ShoppingBag className="w-5 h-5" />
          Retourner au panier
        </Link>
        <Link
          href="/"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-100 text-stone-900 rounded-xl font-semibold hover:bg-stone-200 transition"
        >
          <Home className="w-5 h-5" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <Suspense fallback={<div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-lg">Chargement...</div>}>
          <PaymentCancelContent />
        </Suspense>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
