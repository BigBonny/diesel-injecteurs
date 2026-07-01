'use client';

import { ShieldCheck, Truck, CreditCard, RotateCcw } from 'lucide-react';

export default function TrustBanner() {
  return (
    <div className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center md:justify-between gap-4 md:gap-6 py-2.5 overflow-x-auto scrollbar-hide">
          {[
            { icon: ShieldCheck, text: 'Garantie 2 ans' },
            { icon: Truck, text: 'Livraison gratuite 24-48h' },
            { icon: CreditCard, text: 'Paiement sécurisé SSL' },
            { icon: RotateCcw, text: 'Retour 14 jours' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-300 whitespace-nowrap">
              <item.icon className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
