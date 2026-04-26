'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { CreditCard, Loader2 } from 'lucide-react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const formToken = searchParams.get('formToken');
  const publicKey = searchParams.get('publicKey');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!formToken || !publicKey) {
      setError('Missing payment parameters');
      setLoading(false);
      return;
    }

    // Set public key as global variable before loading SDK
    (window as any).krPublicKey = publicKey;
    (window as any).krFormToken = formToken;

    // Load Sogecommerce JavaScript SDK
    const script = document.createElement('script');
    script.src = 'https://static-sogecommerce.societegenerale.eu/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js';
    script.async = true;
    script.onload = () => {
      setLoading(false);
      // Initialize KR object after SDK loads
      if ((window as any).KR) {
        const KR = (window as any).KR;
        KR.setFormToken(formToken);
        KR.onSubmit(() => {
          return true;
        });
      }
    };
    script.onerror = () => {
      setError('Failed to load payment form');
      setLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [formToken, publicKey]);

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-red-200">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h1>
        <p className="text-stone-600">{error}</p>
        <button
          onClick={() => router.push('/panier')}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl"
        >
          Return to Cart
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
          <h1 className="text-2xl font-bold text-stone-900">Secure Payment</h1>
          <p className="text-sm text-stone-500">Complete your payment securely</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
          <p className="text-stone-600">Loading payment form...</p>
        </div>
      ) : (
        <div 
          id="kr-payment-form" 
          className="min-h-[400px]"
          data-kr-public-key={publicKey}
          data-kr-form-token={formToken}
        />
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
