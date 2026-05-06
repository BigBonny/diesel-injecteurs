'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KitTurboChraPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/produits?category=kit-turbo-chra');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <p className="text-slate-600">Chargement...</p>
      </div>
    </div>
  );
}
