'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { CreditCard, Lock, Check } from 'lucide-react';

function TestPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '0';
  const orderId = searchParams.get('orderId') || '';
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTestPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create order in Supabase
    try {
      const response = await fetch('/api/payment/notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          transId: `TEST-${Date.now()}`,
          amount,
          currency: 'EUR',
          orderId,
          status: 'success',
          signature: 'test-signature',
        }),
      });

      if (response.ok) {
        router.push(`/payment/success?orderId=${orderId}`);
      } else {
        alert('Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Test Payment</h1>
          <p className="text-sm text-stone-500">Simulate a payment for testing</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-stone-600">Amount</span>
          <span className="text-2xl font-bold text-stone-900">{amount} €</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-stone-600">Order ID</span>
          <span className="font-mono text-sm text-stone-900">{orderId}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
          <Lock className="w-4 h-4" />
          <span>Test mode - no real payment</span>
        </div>
      </div>

      <button
        onClick={handleTestPayment}
        disabled={isProcessing}
        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Check className="w-5 h-5" />
            Simulate Successful Payment
          </>
        )}
      </button>

      <button
        onClick={() => router.push('/panier')}
        className="w-full mt-3 py-3 bg-stone-100 text-stone-900 rounded-xl font-semibold hover:bg-stone-200 transition"
      >
        Cancel
      </button>
    </div>
  );
}

export default function TestPaymentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <Suspense fallback={<div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg">Chargement...</div>}>
          <TestPaymentContent />
        </Suspense>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}
