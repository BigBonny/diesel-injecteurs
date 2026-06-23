'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Mail, Check, Tag } from 'lucide-react';

const STORAGE_KEY = 'di_newsletter_popup';
const SHOW_DELAY_MS = 15000; // 15s on page before timed trigger

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export default function EmailCapturePopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const alreadyHandled = useCallback(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(STORAGE_KEY) !== null;
  }, []);

  const dismiss = useCallback((reason: 'closed' | 'subscribed') => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ reason, at: Date.now() }));
    } catch {
      /* ignore storage errors (private mode) */
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (alreadyHandled()) return;

    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);

    // Exit-intent: cursor leaves the top of the viewport (desktop)
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !alreadyHandled()) setOpen(true);
    };
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [alreadyHandled]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'popup' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Une erreur est survenue');
      }
      // Fire conversion event for Google Tag Manager / Ads
      const w = window as DataLayerWindow;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event: 'newsletter_signup', email_domain: email.split('@')[1] || '' });
      setStatus('success');
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ reason: 'subscribed', at: Date.now() })); } catch { /* ignore */ }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={() => dismiss('closed')}
      role="dialog"
      aria-modal="true"
      aria-label="Offre de bienvenue"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => dismiss('closed')}
          aria-label="Fermer"
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header band */}
        <div className="bg-[#1e2a4a] px-8 pt-8 pb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-400/15 border border-yellow-400/30 rounded-full mb-4">
            <Tag className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-300 text-xs font-bold uppercase tracking-widest">Offre de bienvenue</span>
          </div>
          <h2 className="text-2xl font-black text-white leading-tight">
            -5% sur votre 1ère commande
          </h2>
          <p className="text-slate-300 text-sm mt-2">
            Recevez votre code promo + nos meilleures offres sur les turbos & injecteurs.
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-7">
          {status === 'success' ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">C&apos;est enregistré !</h3>
              <p className="text-slate-600 text-sm mb-5">
                Votre code promo arrive dans votre boîte mail. Pensez à vérifier vos spams.
              </p>
              <button
                onClick={() => dismiss('subscribed')}
                className="w-full py-3 bg-[#1e2a4a] text-white font-bold rounded-xl hover:bg-[#16203a] transition"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="relative mb-3">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition"
                />
              </div>
              {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3.5 bg-yellow-400 text-[#1e2a4a] font-black rounded-xl hover:bg-yellow-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Envoi…' : 'Recevoir mon code -5%'}
              </button>
              <button
                type="button"
                onClick={() => dismiss('closed')}
                className="w-full mt-3 text-slate-400 text-xs hover:text-slate-600 transition"
              >
                Non merci, je paie le prix fort
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
