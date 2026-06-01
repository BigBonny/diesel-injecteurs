'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowRight, Phone, Shield, Truck, Star, Zap } from 'lucide-react';
import Link from 'next/link';

const BRANDS = ['Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'BMW', 'Mercedes', 'Audi', 'Ford', 'Opel', 'Toyota', 'Fiat'];
const MODELS: Record<string, string[]> = {
  Renault: ['Clio', 'Mégane', 'Scenic', 'Laguna', 'Espace', 'Trafic', 'Master'],
  Peugeot: ['206', '207', '208', '307', '308', '407', '508', 'Partner', 'Expert'],
  Citroën: ['C3', 'C4', 'C5', 'Berlingo', 'Jumpy', 'Dispatch'],
  Volkswagen: ['Golf', 'Passat', 'Polo', 'Tiguan', 'Transporter', 'Caddy'],
  BMW: ['Série 1', 'Série 2', 'Série 3', 'Série 5', 'X1', 'X3', 'X5'],
  Mercedes: ['Classe A', 'Classe C', 'Classe E', 'Sprinter', 'Vito'],
  Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
  Ford: ['Fiesta', 'Focus', 'Mondeo', 'Transit', 'C-Max'],
  Opel: ['Astra', 'Corsa', 'Zafira', 'Vivaro', 'Movano'],
  Toyota: ['Yaris', 'Corolla', 'Avensis', 'HiLux', 'ProAce'],
  Fiat: ['Punto', 'Bravo', 'Ducato', 'Scudo'],
};
const ENGINES: Record<string, string[]> = {
  default: ['1.5 dCi', '1.6 TDI', '1.9 TDI', '2.0 HDi', '2.2 HDi', '2.0 TDI', '3.0 TDI', '1.4 HDi', '2.5 TDi'],
};
const PIECES = ['Turbo', 'Injecteur', 'Kit CHRA', 'Pompe injection', 'Vanne EGR'];

export default function TurboHero() {
  const [query, setQuery] = useState('');
  const [plate, setPlate] = useState('');
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'plaque' | 'vehicule'>('plaque');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [engine, setEngine] = useState('');
  const [piece, setPiece] = useState('');
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => { setMounted(true); }, []); // intentional mount animation trigger

  useEffect(() => {
    fetch('/api/products?limit=1&count=true')
      .then(r => r.json())
      .then(d => { if (d.total) setProductCount(d.total); })
      .catch(() => {});
  }, []);

  const formatPlate = (value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5, 7)}`;
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(formatPlate(e.target.value));
  };

  const vehiculeSearchUrl = () => {
    const parts = [brand, model, engine, piece].filter(Boolean).join(' ');
    return parts ? `/produits?search=${encodeURIComponent(parts)}` : '/produits';
  };

  return (
    <section className="relative min-h-screen bg-[#0d1b3e] overflow-hidden flex flex-col">

      {/* ── Background: giant turbo SVG + glows ── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_50%,#1e3a7a55,transparent)]" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[100px]" />

        <img
          src="/assets/turbo.svg"
          alt=""
          aria-hidden="true"
          className={`absolute right-[-8%] top-1/2 -translate-y-1/2 w-[55vw] max-w-[780px] opacity-[0.18] transition-opacity duration-1000 ${mounted ? 'opacity-[0.18]' : 'opacity-0'}`}
          style={{ filter: 'drop-shadow(0 0 60px #facc1540)' }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[60px_60px]" />
      </div>

      {/* ── HERO CONTENT ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* LEFT: Text Content */}
            <div className="max-w-2xl">
              <div className={`inline-flex items-center gap-2.5 px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-yellow-400 font-semibold text-xs sm:text-sm tracking-widest uppercase">Spécialiste Injection Diesel</span>
              </div>

              <h1 className={`font-black leading-[0.92] mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <span className="block text-white text-4xl sm:text-5xl md:text-6xl lg:text-8xl">Remplacez vos</span>
                <span className="block text-yellow-400 text-4xl sm:text-5xl md:text-6xl lg:text-8xl">pièces diesel</span>
                <span className="block text-white/60 text-2xl sm:text-3xl md:text-4xl lg:text-6xl mt-1">sans vous ruiner.</span>
              </h1>

              <p className={`text-slate-300 text-base sm:text-lg leading-relaxed mb-6 max-w-xl transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                Turbos & injecteurs neufs et reconditionnés OEM. <span className="text-yellow-400 font-semibold">Garantie 2 ans</span> · Livraison <span className="text-white font-semibold">24-48h</span> · Paiement 3x sans frais.
              </p>

              <div className={`flex flex-col sm:flex-row gap-3 mb-8 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Marque, modèle, référence… ex: Renault Clio 1.5 dCi"
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400 focus:bg-white/15 transition-all text-sm sm:text-base"
                  />
                </div>
                <Link
                  href={`/produits${query ? `?search=${encodeURIComponent(query)}` : ''}`}
                  className="group flex items-center justify-center gap-2 px-8 py-4 bg-yellow-400 text-[#0d1b3e] font-black text-base rounded-xl hover:bg-yellow-300 hover:shadow-2xl hover:shadow-yellow-400/30 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
                >
                  Trouver ma pièce
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className={`flex flex-wrap gap-2 mb-8 transition-all duration-700 delay-400 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                <span className="text-slate-400 text-sm self-center mr-1">Populaire :</span>
                {['Turbos Renault', 'Injecteurs Bosch', 'Kit CHRA Peugeot', 'Turbos BMW'].map(t => (
                  <Link
                    key={t}
                    href={`/produits?search=${encodeURIComponent(t)}`}
                    className="px-3 py-1.5 bg-white/8 border border-white/15 text-white/70 hover:text-yellow-400 hover:border-yellow-400/40 rounded-lg text-xs font-medium transition-all"
                  >
                    {t}
                  </Link>
                ))}
              </div>

              <div className={`flex flex-col sm:flex-row gap-3 mb-6 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Link
                  href="/produits"
                  className="group inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-[#0d1b3e] font-bold rounded-xl hover:bg-yellow-400 hover:shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300"
                >
                  Voir le catalogue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="tel:+33612429880"
                  className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-transparent border-2 border-white/20 text-white font-bold rounded-xl hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  06 12 42 98 80
                </a>
              </div>

              <div className={`flex flex-wrap gap-x-8 gap-y-3 transition-all duration-700 delay-600 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                {[
                  { icon: Shield, text: 'Garantie 2 ans' },
                  { icon: Truck, text: 'Livraison 24-48h' },
                  { icon: Star, text: '4.9/5 · 15 000 avis' },
                  { icon: Zap, text: 'Paiement 3× sans frais' },
                ].map(({ icon: Icon, text }) => (
                  <span key={text} className="flex items-center gap-2 text-slate-400 text-sm">
                    <Icon className="w-4 h-4 text-yellow-400" />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT: Two-tab search bar — hidden on mobile */}
            <div className={`hidden lg:block transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

              {/* Label above */}
              <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-yellow-400/60" />
                Trouvez votre pièce rapidement
                <span className="w-6 h-px bg-yellow-400/60" />
              </p>

              {/* Tab header */}
              <div className="flex rounded-t-2xl overflow-hidden border border-white/10">
                <button
                  onClick={() => setActiveTab('plaque')}
                  className={`flex-1 py-3.5 px-5 text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                    activeTab === 'plaque'
                      ? 'bg-yellow-400 text-[#0d1b3e]'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  Votre plaque
                </button>
                <div className="w-px bg-white/10" />
                <button
                  onClick={() => setActiveTab('vehicule')}
                  className={`flex-1 py-3.5 px-5 text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                    activeTab === 'vehicule'
                      ? 'bg-yellow-400 text-[#0d1b3e]'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                  }`}
                >
                  Par véhicule
                </button>
              </div>

              {/* Tab content */}
              <div className="bg-[#1e2a4a]/80 backdrop-blur-md border border-white/10 border-t-0 rounded-b-2xl shadow-2xl shadow-black/40 overflow-hidden">
                {activeTab === 'plaque' ? (
                  <div className="flex items-stretch">
                    {/* EU plate badge */}
                    <div className="flex flex-col items-center justify-center bg-blue-800 px-4 shrink-0 gap-0.5">
                      <div className="flex gap-0.5">
                        {['★','★','★'].map((s,i) => <span key={i} className="text-yellow-300 text-[8px]">{s}</span>)}
                      </div>
                      <span className="text-white font-black text-base leading-none">F</span>
                    </div>
                    <input
                      type="text"
                      value={plate}
                      onChange={handlePlateChange}
                      placeholder="AA-123-AA"
                      maxLength={9}
                      className="flex-1 px-5 py-5 bg-white/95 text-[#1e2a4a] placeholder-slate-400/60 font-mono text-2xl font-black tracking-[0.3em] uppercase focus:outline-none focus:bg-white transition-colors"
                    />
                    <Link
                      href={plate ? `/produits?immatriculation=${encodeURIComponent(plate)}` : '/produits'}
                      className="flex items-center justify-center px-6 bg-yellow-400 hover:bg-yellow-300 text-[#0d1b3e] transition-all duration-200 group"
                    >
                      <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-stretch flex-col sm:flex-row">
                    {[
                      { value: brand, onChange: (v: string) => { setBrand(v); setModel(''); }, placeholder: 'Marque', options: BRANDS },
                      { value: model, onChange: (v: string) => setModel(v), placeholder: 'Modèle', options: MODELS[brand] || [], disabled: !brand },
                      { value: engine, onChange: (v: string) => setEngine(v), placeholder: 'Moteur', options: ENGINES.default },
                      { value: piece, onChange: (v: string) => setPiece(v), placeholder: 'Pièce', options: PIECES },
                    ].map((sel, i) => (
                      <div key={i} className="flex-1 min-w-0 relative border-r border-white/10 last:border-r-0">
                        <select
                          value={sel.value}
                          onChange={e => sel.onChange(e.target.value)}
                          disabled={sel.disabled}
                          className="w-full h-full pl-3 pr-6 py-4 bg-white/95 text-[#1e2a4a] text-xs font-bold uppercase focus:outline-none focus:bg-white cursor-pointer appearance-none disabled:opacity-30 transition-colors truncate"
                        >
                          <option value="">{sel.placeholder}</option>
                          {sel.options.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">▾</span>
                      </div>
                    ))}
                    <Link
                      href={vehiculeSearchUrl()}
                      className="flex items-center justify-center px-6 bg-yellow-400 hover:bg-yellow-300 text-[#0d1b3e] transition-all duration-200 group shrink-0"
                    >
                      <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Bottom hint */}
              <p className="text-slate-500 text-xs mt-3 text-center">
                {productCount !== null ? (
                  <><span className="text-yellow-400 font-semibold">{productCount.toLocaleString('fr-FR')} références</span> disponibles · Livraison 24-48h</>
                ) : (
                  <>Plus de <span className="text-yellow-400 font-semibold">50 000 références</span> disponibles · Livraison 24-48h</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM STATS BAR ── */}
      <div className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { value: '50 000+', label: 'Pièces en stock' },
            { value: '15 000+', label: 'Clients satisfaits' },
            { value: '15 ans', label: "D'expertise" },
            { value: '48 h', label: 'Livraison express' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-xl sm:text-2xl font-black text-yellow-400">{value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
