'use client';

import { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import ProductList from '@/components/ProductList';
import { 
  Search, Car, Wrench, Zap, Package, Truck, Shield, Clock, 
  ArrowRight, CheckCircle, Star, Phone, Mail, ChevronRight, 
  Sparkles, ArrowUpRight, ShoppingCart, Heart, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// Scroll Reveal Hook
function useScrollReveal<T extends HTMLElement>() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

export default function Home() {
  const [licensePlate, setLicensePlate] = useState('');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const categories = [
    { name: 'Turbos', icon: Zap, color: 'bg-blue-500', description: 'Turbos reconditionnés et neufs' },
    { name: 'Injecteurs', icon: Wrench, color: 'bg-green-500', description: 'Injecteurs diesel haute qualité' },
    { name: 'Pompes', icon: Package, color: 'bg-purple-500', description: 'Pompes à injection' },
    { name: 'Kits', icon: Car, color: 'bg-orange-500', description: 'Kits de réparation complets' },
  ];

  const features = [
    { icon: Truck, title: 'Livraison Rapide', description: 'Livraison en 24-48h partout en France' },
    { icon: Shield, title: 'Garantie 2 Ans', description: 'Toutes nos pièces sont garanties 2 ans' },
    { icon: Clock, title: 'Commande Rapide', description: 'Trouvez votre pièce en quelques clics' },
    { icon: CheckCircle, title: 'Qualité Certifiée', description: 'Pièces testées et certifiées OEM' },
  ];

  const featuredProducts = [
    { name: 'Turbo Garrett GT1749V', price: '349€', originalPrice: '450€', rating: 4.8, reviews: 124, image: '🔧' },
    { name: 'Injecteur Bosch 0445110', price: '89€', originalPrice: '120€', rating: 4.9, reviews: 89, image: '⚙️' },
    { name: 'Pompe Denso HP3', price: '289€', originalPrice: '380€', rating: 4.7, reviews: 56, image: '🔩' },
    { name: 'Kit Réparation Turbo', price: '45€', originalPrice: '65€', rating: 4.6, reviews: 203, image: '🛠️' },
  ];

  const testimonials = [
    { name: "Jean Dupont", text: "Service impeccable, livraison rapide. Le turbo fonctionne parfaitement sur ma Clio 3.", rating: 5, date: "Il y a 2 jours" },
    { name: "Marie Lefebvre", text: "Excellent rapport qualité-prix. Je recommande vivement Injection Diesel !", rating: 5, date: "Il y a 1 semaine" },
    { name: "Pierre Martin", text: "Commande facile, produit de qualité. Mon garage n'achète plus qu'ici.", rating: 5, date: "Il y a 2 semaines" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      {/* Hero Section - 3D Animated */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
        {/* Animated Background Grid */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        {/* Floating 3D Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main Turbo 3D - Left Side with Mouse Reactivity */}
          <div 
            className="absolute left-[5%] top-1/2 -translate-y-1/2 hidden lg:block opacity-60 transition-transform duration-200 ease-out"
            style={{
              transform: `translate(-50%, -50%) rotateY(${mousePos.x * 15}deg) rotateX(${-mousePos.y * 15}deg) translateX(${mousePos.x * 20}px) translateY(${mousePos.y * 20}px)`,
            }}
          >
            <div className="relative w-[400px] h-[400px]">
              {/* Outer Ring */}
              <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                      <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="90" fill="none" stroke="url(#ringGradient)" strokeWidth="1" strokeDasharray="10 5" />
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.3" />
                </svg>
              </div>

              {/* Middle Ring - Reverse */}
              <div className="absolute inset-8 animate-[spin_15s_linear_infinite_reverse]">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="20 10" />
                </svg>
              </div>

              {/* Inner Turbo */}
              <div className="absolute inset-16 animate-[spin_10s_linear_infinite]">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="turboGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  {/* Turbo Blades */}
                  {[...Array(8)].map((_, i) => (
                    <path
                      key={i}
                      d="M100 100 L100 20 A80 80 0 0 1 170 50 Z"
                      fill="url(#turboGradient)"
                      opacity="0.8"
                      transform={`rotate(${i * 45} 100 100)`}
                    />
                  ))}
                  <circle cx="100" cy="100" r="25" fill="#1e293b" stroke="#3b82f6" strokeWidth="3" />
                </svg>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            </div>
          </div>

          {/* Floating Particles - Predefined positions */}
          {[
            { l: 10, t: 20, d: 0 }, { l: 85, t: 15, d: 1 }, { l: 70, t: 80, d: 2 },
            { l: 25, t: 60, d: 0.5 }, { l: 90, t: 40, d: 1.5 }, { l: 15, t: 85, d: 2.5 },
            { l: 50, t: 30, d: 0.8 }, { l: 75, t: 65, d: 1.8 }, { l: 35, t: 45, d: 2.2 },
            { l: 60, t: 90, d: 0.3 }, { l: 5, t: 70, d: 1.2 }, { l: 95, t: 25, d: 2.8 },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
              style={{
                left: `${p.l}%`,
                top: `${p.t}%`,
                animationDelay: `${p.d}s`,
                animationDuration: `${5 + (i % 3)}s`,
              }}
            />
          ))}

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" y1="50%" x2="40%" y2="50%" stroke="url(#lineGrad)" strokeWidth="1" className="animate-pulse" />
            <line x1="60%" y1="30%" x2="90%" y2="60%" stroke="url(#lineGrad)" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          {/* Background Images - Split Left and Right */}
          <div className="absolute left-0 -top-10 w-[600px] h-[600px] opacity-40 pointer-events-none z-0 hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=800&fit=crop" 
              alt="Turbo Diesel" 
              className="w-full h-full object-cover rounded-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/50 to-slate-950 rounded-3xl" />
          </div>
          <div className="absolute -right-70 top-32 w-[500px] h-[500px] opacity-35 pointer-events-none z-0 hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=800&fit=crop" 
              alt="Moteur Diesel" 
              className="w-full h-full object-cover rounded-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-slate-950/50 to-slate-950 rounded-3xl" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full border border-blue-500/30">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-blue-200 text-sm font-medium">Les experts du turbo reconditionné</span>
              </div>

              <div>
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  Turbos et{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    Injecteurs
                  </span>
                </h1>
                <p className="text-xl text-slate-400 mt-6 max-w-lg">
                  Solution fiable et rapide pour votre moteur diesel avec nos injecteurs Bosch, Delphi, Siemens et Denso. Qualité garantie et performance optimale.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/produits" className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition hover:scale-105">
                  Découvrir nos produits
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
                <a href="#quick-finder" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 text-white rounded-full font-semibold hover:bg-slate-800 transition backdrop-blur-sm border border-slate-700">
                  <Search className="w-5 h-5" />
                  Trouver ma pièce
                </a>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-8 pt-4">
                {[
                  { value: '50K+', label: 'Pièces' },
                  { value: '15K+', label: 'Clients' },
                  { value: '24h', label: 'Livraison' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Vehicle Finder */}
            <div className="relative">
              {/* Vehicle Finder Card - Glassmorphism */}
              <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl shadow-blue-500/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Trouver votre pièce</h3>
                  <p className="text-slate-400 text-sm">Sélectionnez votre véhicule</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-white font-medium mb-2">SÉLECTIONNER VOTRE VÉHICULE :</p>
                  <p className="text-slate-400 text-sm">Saisissez votre plaque d&apos;immatriculation</p>
                </div>

                <input 
                  type="text" 
                  value={licensePlate} 
                  onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                  placeholder="AB-123-CD"
                  maxLength={9}
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-center text-2xl font-bold tracking-wider placeholder-slate-500 focus:bg-slate-800 focus:border-blue-500 transition uppercase"
                />

                <div className="text-center">
                  <span className="text-slate-400 text-sm">OU</span>
                </div>

                <Link 
                  href="/produits" 
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Rechercher par marque/modèle
                </Link>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ... */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, label: 'Garantie 2 ans', sublabel: 'Toutes nos pièces' },
              { icon: Truck, label: 'Livraison 24h', sublabel: 'Gratuite dès 150€' },
              { icon: Star, label: 'Qualité OEM', sublabel: 'Certifié & testé' },
              { icon: CheckCircle, label: '-30% en moyenne', sublabel: 'vs concessionnaire' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{item.label}</div>
                  <div className="text-sm text-stone-500">{item.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Nos avantages</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Pourquoi nous choisir ?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Catalogue</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2">Nos catégories</h2>
            </div>
            <Link href="/produits" className="hidden md:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition">
              Voir tout
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={index} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Nos vidéos</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Découvrez nos produits en action</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Vidéos explicatives et démonstrations de nos turbos et injecteurs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Video 1 */}
            <div className="relative group">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-xl">
                <video 
                  src="/assets/vid1.mp4" 
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                  poster="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&fit=crop"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">Installation Turbo 1.9</h3>
                <p className="text-gray-600 text-sm">Guide complet d&apos;installation pas à pas</p>
              </div>
            </div>
            
            {/* Video 2 - Placeholder until added */}
            <div className="relative group">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-xl">
                <video 
                  src="/assets/vid2.mp4" 
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                  poster="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&fit=crop"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">Test Injecteur Bosch</h3>
                <p className="text-gray-600 text-sm">Test de performance sur banc d&apos;essai</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Injecteur Échange Standard Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Injecteur échange standard & turbo pas cher</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Solution fiable et rapide pour votre moteur diesel</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
              Nos injecteurs Bosch, Delphi, Siemens et Denso. Qualité garantie et performance optimale.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Avantages */}
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Avantages</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Économique par rapport à une pièce neuve</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Testé et conforme aux normes constructeur</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Prêt à l&apos;emploi pour une expédition rapide</span>
                </li>
              </ul>
            </div>

            {/* Fonction */}
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Fonction</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Injection précise du carburant</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Consommation réduite</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Puissance moteur maintenue</span>
                </li>
              </ul>
            </div>

            {/* Marques disponibles */}
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Marques disponibles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <span className="font-semibold text-gray-900">Bosch</span>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <span className="font-semibold text-gray-900">Delphi</span>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <span className="font-semibold text-gray-900">Siemens</span>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <span className="font-semibold text-gray-900">Denso</span>
                </div>
              </div>
              <Link href="/produits?category=injecteurs" className="mt-6 block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
                Commander un injecteur
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - With Animated Counters */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-6">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Nos chiffres en temps réel</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ils nous font confiance</h2>
            <p className="text-gray-400 text-lg">Des milliers de professionnels nous font confiance chaque jour</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: 50000, suffix: '+', label: 'Pièces en stock', sublabel: 'Toutes marques disponibles' },
              { value: 15000, suffix: '+', label: 'Clients satisfaits', sublabel: 'Note moyenne 4.9/5' },
              { value: 15, suffix: '+', label: "Années d'expertise", sublabel: "Leader depuis 2009" },
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative text-center">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xl font-semibold mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-400">{stat.sublabel}</div>
                </div>
                
                {/* Animated border effect */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-1/2 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact - Stunning Industrial Design */}
      <section id="contact" className="relative py-24 overflow-hidden bg-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900" />
          {/* Animated Gear-like Circles */}
          <div className="absolute top-20 -left-20 w-96 h-96 border-[3px] border-blue-500/20 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }}>
            <div className="absolute inset-4 border-2 border-dashed border-cyan-500/30 rounded-full" />
          </div>
          <div className="absolute bottom-20 -right-20 w-80 h-80 border-[3px] border-cyan-500/20 rounded-full animate-spin-slow" style={{ animationDuration: '25s', animationDirection: 'reverse' }}>
            <div className="absolute inset-6 border-2 border-dashed border-blue-500/30 rounded-full" />
          </div>
          {/* Floating Piston-like Bars */}
          <div className="absolute top-1/4 right-1/4 flex gap-2">
            <div className="w-3 h-20 bg-gradient-to-b from-blue-500/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-3 h-32 bg-gradient-to-b from-cyan-500/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="w-3 h-16 bg-gradient-to-b from-blue-500/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%234f46e5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M0%200h40v40H0V0zm20%2020h20v20H20V20zM0%2020h20v20H0V20z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full border border-blue-500/30 mb-6">
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">24/7 Support Expert</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Parlons de votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">projet</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Besoin d&apos;aide pour trouver la pièce parfaite ? Notre équipe d&apos;ingénieurs est là pour vous guider.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Cards - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Phone Card */}
              <div className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:bg-white/10">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Appelez-nous</h3>
                    <p className="text-2xl font-bold text-blue-400 mb-1">+33 6 12 42 98 80</p>
                    <p className="text-sm text-gray-500">Lun-Ven • 8h-19h</p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-500 hover:bg-white/10">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                    <p className="text-xl font-bold text-cyan-400 mb-1">diesel.injecteurs@gmail.com</p>
                    <p className="text-sm text-gray-500">Réponse sous 2h</p>
                  </div>
                </div>
              </div>

              {/* Live Chat Card */}
              <div className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-green-500/50 transition-all duration-500 hover:bg-white/10">
                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                    <div className="relative">
                      <div className="w-3 h-3 bg-white rounded-full" />
                      <div className="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                      Chat Live
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">En ligne</span>
                    </h3>
                    <p className="text-gray-400">Réponse instantanée garantie</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form - Right Side */}
            <div className="lg:col-span-3">
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-50" />
                
                <div className="relative">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Wrench className="w-6 h-6 text-blue-400" />
                    Demande de devis gratuit
                  </h3>
                  
                  <form className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="relative group">
                        <input 
                          type="text" 
                          placeholder=" "
                          className="peer w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:border-blue-500 focus:bg-white/10 transition-all outline-none" 
                        />
                        <label className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400 peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs">
                          Prénom
                        </label>
                      </div>
                      <div className="relative group">
                        <input 
                          type="text" 
                          placeholder=" "
                          className="peer w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:border-blue-500 focus:bg-white/10 transition-all outline-none" 
                        />
                        <label className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400 peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs">
                          Nom
                        </label>
                      </div>
                    </div>

                    <div className="relative group">
                      <input 
                        type="email" 
                        placeholder=" "
                        className="peer w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:border-blue-500 focus:bg-white/10 transition-all outline-none" 
                      />
                      <label className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400 peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs">
                        Email
                      </label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="relative group">
                        <input 
                          type="tel" 
                          placeholder=" "
                          className="peer w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:border-blue-500 focus:bg-white/10 transition-all outline-none" 
                        />
                        <label className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400 peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs">
                          Téléphone
                        </label>
                      </div>
                      <select className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-gray-400 focus:border-blue-500 focus:bg-white/10 transition-all outline-none">
                        <option value="">Type de demande</option>
                        <option value="turbo">Turbo</option>
                        <option value="injecteur">Injecteur</option>
                        <option value="pompe">Pompe à injection</option>
                        <option value="autre">Autre pièce</option>
                      </select>
                    </div>

                    <div className="relative group">
                      <textarea 
                        rows={4} 
                        placeholder=" "
                        className="peer w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:border-blue-500 focus:bg-white/10 transition-all outline-none resize-none" 
                      />
                      <label className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-400 peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs">
                        Décrivez votre besoin (modèle, moteur, références...)
                      </label>
                    </div>

                    <button 
                      type="submit" 
                      className="group w-full py-5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Envoyer ma demande
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <p className="text-center text-sm text-gray-500">
                      Réponse garantie sous 2 heures ouvrées • Gratuit et sans engagement
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner - Dynamic Design */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-slate-900 to-cyan-900">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-blue-500/30 rounded-full animate-pulse" />
          <div className="absolute bottom-10 right-20 w-32 h-32 border-2 border-cyan-500/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/4 w-40 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-shimmer" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-white/90 text-sm font-medium">Livraison express disponible</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trouvez votre pièce en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              3 clics
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Rejoignez 15,000+ professionnels et particuliers qui nous font confiance pour leurs pièces auto.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/produits" 
              className="group relative px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-white/20 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explorer le catalogue
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </Link>
            
            <a 
              href="tel:+33123456789" 
              className="group px-8 py-4 bg-white/10 text-white rounded-full font-bold text-lg border border-white/30 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm flex items-center gap-3"
            >
              <div className="relative">
                <Phone className="w-5 h-5" />
                <div className="absolute inset-0 w-5 h-5 bg-blue-400 rounded-full animate-ping opacity-50" />
              </div>
              Appeler maintenant
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t border-white/10">
            {[
              { value: '4.9/5', label: 'Trustpilot' },
              { value: '15k+', label: 'Clients' },
              { value: '24h', label: 'Livraison' },
            ].map((badge, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl font-bold text-white">{badge.value}</div>
                <div className="text-sm text-gray-400">{badge.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}

// Feature Card Component with Scroll Animation
function FeatureCard({ feature, index }: { feature: { icon: React.ElementType; title: string; description: string }; index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  
  return (
    <div 
      ref={ref}
      className={`bg-white rounded-2xl p-8 hover:shadow-xl transition group transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDuration: '600ms', transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
        <feature.icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
      <p className="text-slate-600">{feature.description}</p>
    </div>
  );
}

// Category Card Component with Scroll Animation
function CategoryCard({ category, index }: { category: { name: string; icon: React.ElementType; color: string; description: string }; index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLAnchorElement>();
  
  return (
    <Link 
      ref={ref}
      href={`/produits?category=${category.name.toLowerCase()}`} 
      className={`group relative overflow-hidden rounded-2xl bg-slate-800 p-8 hover:shadow-xl transition transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDuration: '600ms', transitionDelay: `${index * 100}ms` }}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${category.color} opacity-10 rounded-bl-full`} />
      <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
        <category.icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
      <p className="text-slate-600 mb-4">{category.description}</p>
      <div className="flex items-center text-blue-600 font-medium">
        Explorer <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition" />
      </div>
    </Link>
  );
}

// Product Card Component with Scroll Animation
function ProductCard({ product, index }: { product: { name: string; price: string; originalPrice: string; rating: number; reviews: number; image: string }; index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  
  return (
    <div 
      ref={ref}
      className={`bg-white rounded-2xl overflow-hidden group hover:shadow-xl transition transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDuration: '600ms', transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center">
        <div className="text-6xl">{product.image}</div>
        <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">-22%</span>
        <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition"><Heart className="w-5 h-5" /></button>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-slate-600">{product.rating}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-blue-600">{product.price}</span>
          <span className="text-sm text-slate-400 line-through">{product.originalPrice}</span>
        </div>
        <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2">
          <ShoppingCart className="w-5 h-5" /> Ajouter
        </button>
      </div>
    </div>
  );
}

// Testimonial Card Component with Scroll Animation
function TestimonialCard({ testimonial, index }: { testimonial: { name: string; text: string; rating: number; date: string }; index: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  
  return (
    <div 
      ref={ref}
      className={`bg-slate-100 rounded-2xl p-8 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDuration: '600ms', transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
      </div>
      <p className="text-slate-700 mb-6 italic">&ldquo;{testimonial.text}&rdquo;</p>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{testimonial.name}</div>
          <div className="text-sm text-slate-500">{testimonial.date}</div>
        </div>
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">{testimonial.name.charAt(0)}</div>
      </div>
    </div>
  );
}
