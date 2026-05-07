'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Car, ArrowRight, Phone, Shield, Clock, Award, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function TurboHero() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [licensePlate, setLicensePlate] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / (windowHeight * 1.5), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation values
  const contentOpacity = Math.max(0, 1 - scrollProgress * 1.5);
  const aboutOpacity = Math.max(0, Math.min((scrollProgress - 0.4) * 2, 1));
  
  // Turbo slides completely off screen left
  const turboX = -scrollProgress * 800; 
  const turboOpacity = Math.max(0, 1 - scrollProgress * 1.5);
  
  // Injecteur slides completely off screen right
  const injecteurX = scrollProgress * 800;
  const injecteurOpacity = Math.max(0, 1 - scrollProgress * 1.5);

  return (
    <section 
      ref={heroRef}
      className="relative bg-white" 
      style={{ height: '350vh' }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-size-[80px_80px]" />

        {/* Turbo - Behind content, centered bottom on mobile, left on desktop */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 bottom-8 md:left-0 md:translate-x-0 md:bottom-auto md:top-[60%] md:-translate-y-1/2 transition-all duration-1000 ease-out z-0"
          style={{
            transform: `translateX(${turboX}px)`,
            opacity: turboOpacity,
          }}
        >
          <img 
            src="/assets/turbo.png" 
            alt="" 
            className="w-[180px] h-[180px] md:w-[500px] md:h-[500px] object-contain opacity-10 md:opacity-20"
            aria-hidden="true"
          />
        </div>

        {/* Injecteur - Behind content, slides off right (hidden on mobile) */}
        <div 
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out z-0"
          style={{
            transform: `translateX(${injecteurX}px) translateY(-50%)`,
            opacity: injecteurOpacity,
          }}
        >
          <img 
            src="/assets/injecteur.png" 
            alt="" 
            className="w-[400px] h-[400px] object-contain opacity-15"
            aria-hidden="true"
          />
        </div>

        {/* PHASE 1: Hero Content */}
        <div 
          className="absolute inset-0 flex items-center z-10 transition-all duration-700"
          style={{ 
            opacity: contentOpacity,
            pointerEvents: contentOpacity < 0.1 ? 'none' : 'auto',
          }}
        >
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 border border-blue-100 rounded-full mb-8">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="text-blue-700 font-semibold text-sm tracking-wide uppercase">Spécialiste Injection Diesel</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.9] mb-6">
                Turbos &
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-blue-700 to-blue-800">
                  Injecteurs
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 mb-10 mx-auto leading-relaxed lg:whitespace-nowrap">
                Pièces neuves et reconditionnées aux normes OEM. <span className="text-blue-600 font-semibold">Garantie 2 ans</span> incluse.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link 
                  href="/produits"
                  className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Explorer nos produits
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <a 
                  href="tel:0612429880" 
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-full hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                >
                  <Phone className="w-5 h-5" />
                  06 12 42 98 80
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  Garantie 2 ans
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Livraison 24-48h
                </span>
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  48 marques
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PHASE 2: Vehicle Finder + About Combined */}
        <div 
          className="absolute inset-0 z-10 transition-all duration-1000 overflow-y-auto"
          style={{ 
            opacity: aboutOpacity,
            transform: `translateY(${(1 - aboutOpacity) * 50}px)`,
            pointerEvents: aboutOpacity < 0.3 ? 'none' : 'auto',
          }}
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-16 lg:pt-0 lg:min-h-screen lg:flex lg:items-center">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center pb-8 lg:pb-0">
              
              {/* Left - Vehicle Finder Card */}
              <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-2xl border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Car className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900">Trouver votre pièce</h3>
                    <p className="text-slate-500">Sélectionnez votre véhicule</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-slate-900 font-bold text-sm mb-2 tracking-wide uppercase">Saisissez votre immatriculation</p>
                    <p className="text-slate-400 text-sm">Nous trouvons la pièce compatible</p>
                  </div>

                  <input 
                    type="text" 
                    value={licensePlate} 
                    onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                    placeholder="AB-123-CD"
                    maxLength={9}
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 text-center text-2xl font-bold tracking-[0.2em] placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all uppercase"
                  />

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-slate-400 text-sm font-medium">OU</span>
                    </div>
                  </div>

                  <Link 
                    href="/produits" 
                    className="w-full py-5 bg-linear-to-r from-yellow-400 to-yellow-500 text-slate-900 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <Search className="w-5 h-5" />
                    Rechercher par marque
                  </Link>
                </div>
              </div>

              {/* Right - About Content */}
              <div>
                <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 font-semibold text-sm rounded-full mb-6">
                  Qui sommes-nous
                </span>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[0.95] mb-4 md:mb-6">
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-800">L&apos;EXPERTISE</span>
                  <span className="block mt-2">DIESEL</span>
                </h2>
                
                <p className="text-base md:text-lg text-slate-600 mb-6 md:mb-8 leading-relaxed">
                  Diesel Injecteurs est votre spécialiste de l&apos;injection diesel en France. Injecteurs et turbos neufs et reconditionnés aux normes OEM constructeur. Chaque pièce est testée et certifiée conforme avant expédition.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                  <div className="bg-slate-50 rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-100">
                    <div className="text-2xl md:text-3xl font-black text-blue-600">4,000+</div>
                    <div className="text-slate-500 text-xs md:text-sm font-medium">Turbos & injecteurs</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-100">
                    <div className="text-2xl md:text-3xl font-black text-yellow-500">48</div>
                    <div className="text-slate-500 text-xs md:text-sm font-medium">Marques compatibles</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-100">
                    <div className="text-2xl md:text-3xl font-black text-blue-600">2<span className="text-lg md:text-xl">ans</span></div>
                    <div className="text-slate-500 text-xs md:text-sm font-medium">Garantie pièces</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl md:rounded-2xl p-3 md:p-5 border border-slate-100">
                    <div className="text-2xl md:text-3xl font-black text-yellow-500">48<span className="text-lg md:text-xl">h</span></div>
                    <div className="text-slate-500 text-xs md:text-sm font-medium">Livraison express</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link 
                    href="/produits"
                    className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
                  >
                    Découvrir nos produits
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute inset-x-0 bottom-10 z-20 flex justify-center"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 3) }}
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs uppercase tracking-[0.4em] text-slate-400 font-medium">Scroll</span>
            <div className="h-16 w-px bg-linear-to-b from-blue-500 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
