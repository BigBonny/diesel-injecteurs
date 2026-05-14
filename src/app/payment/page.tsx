'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { CreditCard, Loader2, ArrowRight } from 'lucide-react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const formToken = searchParams.get('formToken');
  const publicKey = searchParams.get('publicKey');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!formToken || !publicKey) {
      setError('Paramètres de paiement manquants');
      setLoading(false);
      return;
    }

    // The formToken is actually the hosted payment page URL from our API
    // Validate it looks like a Sogecommerce URL
    if (formToken.includes('sogecommerce.societegenerale.eu')) {
      setPaymentUrl(formToken);
      setLoading(false);
    } else {
      setError('URL de paiement invalide');
      setLoading(false);
    }
  }, [formToken, publicKey]);

  const handleRedirect = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-red-200">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur de paiement</h1>
        <p className="text-stone-600">{error}</p>
        <button
          onClick={() => router.push('/panier')}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Retour au panier
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Paiement sécurisé</h1>
          <p className="text-sm text-stone-500">Vous allez être redirigé vers notre banque</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <p className="text-stone-600">Préparation du paiement...</p>
        </div>
      ) : (
        <div className="py-8">
          <div className="bg-slate-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-slate-900 mb-2">Sécurité garantie</h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Paiement 3D Secure par Société Générale
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Vos données sont cryptées et sécurisées
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Confirmation immédiate par email
              </li>
            </ul>
          </div>
          
          <button
            onClick={handleRedirect}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all"
          >
            Procéder au paiement
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-center text-xs text-slate-400 mt-4">
            Vous serez redirigé vers sogecommerce.societegenerale.eu
          </p>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 w-full">
        <Suspense fallback={<div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">Chargement...</div>}>
          <PaymentContent />
        </Suspense>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
