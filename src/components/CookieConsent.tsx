'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import Link from 'next/link';
import { X, Cookie, ChevronDown, ChevronUp, Check } from 'lucide-react';

const CONSENT_KEY = 'diesel-injecteurs-cookie-consent';

interface Consent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}


export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [preferences, setPreferences] = useState<Consent>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) {
        setVisible(true);
      } else {
        const parsed = JSON.parse(stored) as Partial<Consent>;
        setPreferences((prev: Consent) => ({
          ...prev,
          analytics: parsed.analytics ?? false,
          marketing: parsed.marketing ?? false,
        }));
        pushConsentToDataLayer(parsed);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const pushConsentToDataLayer = (consent: Partial<Consent>) => {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'consent_update',
      consent: {
        ad_storage: consent.marketing ? 'granted' : 'denied',
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        functionality_storage: 'granted',
        personalization_storage: consent.marketing ? 'granted' : 'denied',
        security_storage: 'granted',
      },
    });
  };

  const saveConsent = (consent: Consent) => {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    } catch {
      // ignore
    }
    pushConsentToDataLayer(consent);
    setVisible(false);
  };

  const acceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(consent);
    saveConsent(consent);
  };

  const rejectOptional = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(consent);
    saveConsent(consent);
  };

  const savePreferences = () => {
    saveConsent({
      necessary: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slideUp">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-12 h-12 bg-yellow-400/10 rounded-xl items-center justify-center shrink-0">
              <Cookie className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Nous utilisons des cookies
                </h3>
                <button
                  onClick={rejectOptional}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Ce site utilise des cookies essentiels au fonctionnement du site, ainsi que des cookies analytiques et de marketing pour améliorer votre expérience et mesurer nos campagnes publicitaires. Vous pouvez accepter tous les cookies, les refuser ou personnaliser vos choix. Pour en savoir plus, consultez notre{' '}
                <Link
                  href="/confidentialite#cookies"
                  className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 font-medium underline"
                  onClick={() => setVisible(false)}
                >
                  politique de cookies
                </Link>
                .
              </p>

              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Masquer les préférences
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Personnaliser les cookies
                  </>
                )}
              </button>

              {expanded && (
                <div className="mt-4 space-y-3 border-t border-slate-100 dark:border-slate-700 pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className="mt-0.5 w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Cookies essentiels</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Toujours actifs. Nécessaires au fonctionnement du site (panier, session).</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPreferences((prev: Consent) => ({ ...prev, analytics: e.target.checked }))}
                      className="mt-0.5 w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-yellow-500 focus:ring-yellow-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Cookies analytiques</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Google Analytics — mesure d&apos;audience et amélioration du site.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setPreferences((prev: Consent) => ({ ...prev, marketing: e.target.checked }))}
                      className="mt-0.5 w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-yellow-500 focus:ring-yellow-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Cookies marketing</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Google Tag Manager — suivi des conversions publicitaires.</p>
                    </div>
                  </label>
                </div>
              )}

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                {expanded ? (
                  <>
                    <button
                      onClick={savePreferences}
                      className="flex-1 px-5 py-2.5 bg-[#1e2a4a] text-white font-semibold rounded-xl hover:bg-[#2a3a66] transition"
                    >
                      Enregistrer mes choix
                    </button>
                    <button
                      onClick={rejectOptional}
                      className="flex-1 px-5 py-2.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      Tout refuser
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={acceptAll}
                      className="flex-1 px-5 py-2.5 bg-yellow-400 text-[#1e2a4a] font-semibold rounded-xl hover:bg-yellow-500 transition"
                    >
                      Tout accepter
                    </button>
                    <button
                      onClick={rejectOptional}
                      className="flex-1 px-5 py-2.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      Tout refuser
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
