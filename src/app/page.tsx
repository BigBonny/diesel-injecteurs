'use client';

import { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import TurboHero from '@/components/TurboHero';
import { 
  Car, Wrench, Zap, Package, Truck, Shield, Clock, 
  ArrowRight, CheckCircle, Star, Phone, Mail, ChevronRight, 
  ArrowUpRight, ShoppingCart, Heart, Search, ChevronDown
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
    <div className="min-h-screen flex flex-col bg-slate-50 pb-16 md:pb-0">
      <Navigation />

      {/* Hero Section with Scroll-Triggered Turbo Animation */}
      <TurboHero />

      {/* Trust Bar - Like reference */}
      <section className="bg-white border-y border-slate-200 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, label: 'Livraison express', sublabel: '24/48h dans le monde entier', color: 'text-yellow-500' },
              { icon: Shield, label: 'Satisfait ou remboursé', sublabel: 'Jusqu\'à 15 jours', color: 'text-yellow-500' },
              { icon: CheckCircle, label: 'Paiement sécurisé', sublabel: '3x sans frais possible', color: 'text-yellow-500' },
              { icon: Star, label: 'Garantie qualité', sublabel: 'Pièces certifiées OEM', color: 'text-yellow-500' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center border border-yellow-200 group-hover:bg-yellow-100 group-hover:scale-110 transition-all duration-300">
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.sublabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Premium navy section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-yellow-500 font-bold text-sm uppercase tracking-[0.2em]">Choisissez la performance</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-3">
              Les experts du turbo <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-800">reconditionné</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories - Dark navy section */}
      <section id="categories" className="py-20 bg-[#1e2a4a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-yellow-400 font-bold text-sm uppercase tracking-[0.2em]">Catalogue</span>
              <h2 className="text-4xl font-black text-white mt-3">Nos catégories</h2>
            </div>
            <Link href="/produits" className="hidden md:flex items-center gap-2 text-yellow-400 font-bold hover:text-yellow-300 transition group">
              Voir tout
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
            <span className="text-yellow-500 font-bold text-sm uppercase tracking-[0.2em]">Nos vidéos</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-3">Découvrez nos produits en action</h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
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
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-yellow-500 font-bold text-sm uppercase tracking-[0.2em]">Injecteur échange standard & turbo pas cher</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-3">Solution fiable et rapide pour votre moteur diesel</h2>
            <p className="text-slate-500 mt-4 max-w-3xl mx-auto">
              Nos injecteurs Bosch, Delphi, Siemens et Denso. Qualité garantie et performance optimale.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Avantages */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-[#1e2a4a] rounded-xl flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Avantages</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm">Économique par rapport à une pièce neuve</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm">Testé et conforme aux normes constructeur</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm">Prêt à l&apos;emploi pour une expédition rapide</span>
                </li>
              </ul>
            </div>

            {/* Fonction */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-[#1e2a4a] rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-6">Fonction</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm">Injection précise du carburant</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm">Consommation réduite</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm">Puissance moteur maintenue</span>
                </li>
              </ul>
            </div>

            {/* Marques disponibles */}
            <div className="bg-[#1e2a4a] rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-[#1e2a4a]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-6">Marques disponibles</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Bosch', 'Delphi', 'Siemens', 'Denso'].map((brand) => (
                  <div key={brand} className="bg-white/10 rounded-xl p-3 text-center border border-white/10">
                    <span className="font-bold text-white text-sm">{brand}</span>
                  </div>
                ))}
              </div>
              <Link href="/produits?category=injecteurs" className="mt-6 block w-full text-center px-6 py-3.5 bg-yellow-400 text-[#1e2a4a] rounded-xl font-bold hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/30 transition-all">
                Commander un injecteur
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - With Animated Counters */}
      <section className="py-20 bg-[#1e2a4a] text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span className="text-yellow-400 font-bold text-sm uppercase tracking-[0.2em]">Nos chiffres</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">Ils nous font confiance</h2>
            <p className="text-slate-400 text-lg mt-4">Des milliers de professionnels nous font confiance chaque jour</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: 50000, suffix: '+', label: 'Pièces en stock', sublabel: 'Toutes marques disponibles' },
              { value: 15000, suffix: '+', label: 'Clients satisfaits', sublabel: 'Note moyenne 4.9/5' },
              { value: 15, suffix: '+', label: "Années d'expertise", sublabel: "Leader depuis 2009" },
            ].map((stat, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white/5 rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-500"
              >
                <div className="relative text-center">
                  <div className="text-5xl md:text-6xl font-black text-yellow-400 mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xl font-bold mb-1">{stat.label}</div>
                  <div className="text-sm text-slate-400">{stat.sublabel}</div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-yellow-400 group-hover:w-1/2 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Logos Marquee */}
      <section className="py-14 bg-white border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
          <span className="text-slate-400 text-sm font-semibold uppercase tracking-[0.2em]">Marques disponibles sur notre stock</span>
        </div>
        <div className="relative flex overflow-hidden">
          <div className="flex gap-12 animate-marquee whitespace-nowrap items-center">
            {['Bosch', 'Delphi', 'Siemens/VDO', 'Denso', 'Garrett', 'BorgWarner', 'Continental', 'Pierburg', 'Mitsubishi', 'IHI', 'Holset', 'Valeo'].map((brand) => (
              <span key={brand} className="text-2xl font-black text-slate-200 hover:text-slate-400 transition-colors px-4">{brand}</span>
            ))}
            {['Bosch', 'Delphi', 'Siemens/VDO', 'Denso', 'Garrett', 'BorgWarner', 'Continental', 'Pierburg', 'Mitsubishi', 'IHI', 'Holset', 'Valeo'].map((brand) => (
              <span key={`dup-${brand}`} className="text-2xl font-black text-slate-200 hover:text-slate-400 transition-colors px-4" aria-hidden="true">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-yellow-500 font-bold text-sm uppercase tracking-[0.2em]">Simple et rapide</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-3">
              Comment ça <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-800">marche ?</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">Recevez votre pièce en 3 étapes simples, livrée chez vous en 24-48h.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line desktop */}
            <div className="hidden md:block absolute top-14 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-0.5 bg-linear-to-r from-yellow-400 to-blue-500 z-0" />
            {[
              { step: '01', icon: Search, title: 'Trouvez votre pièce', desc: 'Recherchez par immatriculation, marque ou référence. Notre catalogue couvre 50 000+ références.' },
              { step: '02', icon: ShoppingCart, title: 'Commandez en ligne', desc: 'Paiement sécurisé, 3x sans frais. Vous recevez une confirmation immédiate par email ou SMS.' },
              { step: '03', icon: Package, title: 'Livraison express', desc: 'Expédié le jour même avant 14h. Emballé avec soin, suivi en temps réel. Livraison 24-48h.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 z-10">
                <div className="w-14 h-14 bg-[#1e2a4a] rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-[#1e2a4a]/20">
                  <Icon className="w-7 h-7 text-yellow-400" />
                </div>
                <div className="absolute top-6 right-6 text-5xl font-black text-slate-100 leading-none select-none">{step}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/produits" className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-[#1e2a4a] rounded-full font-bold text-lg hover:bg-yellow-300 hover:shadow-xl hover:shadow-yellow-400/30 hover:-translate-y-0.5 transition-all duration-300">
              Commencer ma recherche
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#1e2a4a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#facc15_25%,transparent_25%,transparent_75%,#facc15_75%)] bg-size-[80px_80px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-yellow-400 font-bold text-sm uppercase tracking-[0.2em]">Avis clients</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-3">Ce que disent <span className="text-yellow-400">nos clients</span></h2>
            <div className="flex items-center justify-center gap-2 mt-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              <span className="text-white font-bold ml-2">4.9/5</span>
              <span className="text-slate-400 text-sm">• 15 000+ avis</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Mehdi L.', vehicle: 'Renault Clio 4', text: 'Je suis venu chercher un injecteur en urgence. Accueil super pro, la pièce était prête et testée. Montage sans souci. Je recommande vivement, service rapide et efficace.', stars: 5 },
              { name: 'Antoine L.', vehicle: 'VW Touareg', text: 'Commande passée le lundi, reçue le mercredi. L\'injecteur fonctionne parfaitement. Bon rapport qualité-prix et consigne remboursée rapidement.', stars: 5 },
              { name: 'Youssef B.', vehicle: 'BMW Série 3', text: 'Très bonne expérience. Le turbo est arrivé bien emballé, conforme à la description. Mon mécano l\'a monté sans problème. Ça tourne nickel depuis 3 mois.', stars: 5 },
              { name: 'Stéphane R.', vehicle: 'Ford Transit', text: 'Turbo reconditionné impeccable. Livraison rapide, bien emballé, la pièce est conforme et fonctionne très bien. Je recommande ce site sans hésitation.', stars: 5 },
              { name: 'Gabriel M.', vehicle: 'Audi A3', text: 'Je suis très satisfait de mon achat. La pièce est très bien reconditionnée, on dirait qu\'elle est neuve. Envoyée et reçue rapidement. Merci !', stars: 5 },
              { name: 'Marco D.', vehicle: 'Iveco Daily', text: 'Deuxième commande, toujours aussi fiable. Injecteur Bosch pour mon Daily, prix imbattable par rapport au neuf. La consigne a été remboursée en 2 semaines.', stars: 5 },
            ].map(({ name, vehicle, text, stars }, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-yellow-400/30 hover:bg-white/10 transition-all duration-300 flex flex-col gap-4">
                <div className="flex gap-1">
                  {[...Array(stars)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-[#1e2a4a] font-black text-sm">{name.charAt(0)}</div>
                  <div>
                    <div className="font-semibold text-white text-sm">{name}</div>
                    <div className="text-slate-400 text-xs">{vehicle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

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
            <div className="w-3 h-20 bg-linear-to-b from-blue-500/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-3 h-32 bg-linear-to-b from-cyan-500/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="w-3 h-16 bg-linear-to-b from-blue-500/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%234f46e5%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M0%200h40v40H0V0zm20%2020h20v20H20V20zM0%2020h20v20H0V20z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-sm rounded-full border border-blue-500/30 mb-6">
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">24/7 Support Expert</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Parlons de votre <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">projet</span>
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
                <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
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
                <div className="absolute inset-0 bg-linear-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 bg-linear-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                    <p className="text-lg sm:text-xl font-bold text-cyan-400 mb-1 break-all">diesel.injecteurs@gmail.com</p>
                    <p className="text-sm text-gray-500">Réponse sous 2h</p>
                  </div>
                </div>
              </div>

              {/* Live Chat Card */}
              <div className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-green-500/50 transition-all duration-500 hover:bg-white/10">
                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
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
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-5 sm:p-8 md:p-10 border border-white/10 shadow-2xl overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-50" />
                
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
                      className="group w-full py-5 bg-linear-to-r from-blue-600 via-cyan-600 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Envoyer ma demande
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-cyan-600 via-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity" />
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

      {/* CTA Banner */}
      <section className="relative py-20 overflow-hidden bg-yellow-400">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#1e2a4a_25%,transparent_25%,transparent_75%,#1e2a4a_75%)] bg-size-[60px_60px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-[#1e2a4a] mb-6">
            Trouvez votre pièce en 3 clics
          </h2>
          
          <p className="text-xl text-[#1e2a4a]/70 mb-10 max-w-2xl mx-auto font-medium">
            Rejoignez 15,000+ professionnels et particuliers qui nous font confiance pour leurs pièces auto.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/produits" 
              className="group px-10 py-4 bg-[#1e2a4a] text-white rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-[#1e2a4a]/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
            >
              Explorer le catalogue
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            
            <a 
              href="tel:+33612429880" 
              className="group px-10 py-4 bg-white text-[#1e2a4a] rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
            >
              <Phone className="w-5 h-5" />
              06 12 42 98 80
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Mobile Sticky Call CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <a
          href="tel:+33612429880"
          className="flex items-center justify-center gap-3 w-full py-4 bg-yellow-400 text-[#1e2a4a] font-black text-lg shadow-2xl"
        >
          <Phone className="w-5 h-5" />
          Appeler maintenant — 06 12 42 98 80
        </a>
      </div>

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
      className={`bg-white rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group border border-slate-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDuration: '600ms', transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-14 h-14 bg-[#1e2a4a] rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-400 transition-colors duration-300">
        <feature.icon className="w-7 h-7 text-yellow-400 group-hover:text-[#1e2a4a] transition-colors duration-300" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
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
      className={`group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 hover:bg-white/10 hover:border-yellow-400/50 hover:-translate-y-1 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDuration: '600ms', transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-14 h-14 bg-yellow-400/10 border border-yellow-400/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-400 group-hover:border-yellow-400 transition-all duration-300">
        <category.icon className="w-7 h-7 text-yellow-400 group-hover:text-[#1e2a4a] transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
      <p className="text-slate-400 text-sm mb-4">{category.description}</p>
      <div className="flex items-center text-yellow-400 font-bold text-sm group-hover:gap-3 transition-all">
        Explorer <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
      <div className="relative h-48 bg-linear-to-br from-slate-200 to-slate-100 flex items-center justify-center">
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

// FAQ Section Component
function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      q: 'Quelle est la différence entre une pièce neuve et reconditionnée ?',
      a: 'Une pièce reconditionnée (échange standard) est une pièce usagée remise à neuf selon les normes OEM constructeur. Elle est démontée, nettoyée, les composants usés remplacés, puis testée sur banc. Le résultat est identique à une pièce neuve pour 30 à 60% moins cher.',
    },
    {
      q: 'Qu\'est-ce que la consigne et comment fonctionne-t-elle ?',
      a: 'La consigne est un dépôt de garantie (généralement 80€) versé à la commande. Elle vous est intégralement remboursée dès réception de votre ancienne pièce défectueuse. Vous avez 30 jours pour nous la retourner via notre page Retour Consigne.',
    },
    {
      q: 'Quels sont les délais de livraison ?',
      a: 'Les commandes passées avant 14h sont expédiées le jour même. La livraison est assurée en 24 à 48h ouvrés en France métropolitaine via Chronopost ou DHL. Vous recevez un numéro de suivi par email.',
    },
    {
      q: 'Comment trouver la bonne pièce pour mon véhicule ?',
      a: 'Trois méthodes : (1) Saisir votre immatriculation dans notre moteur de recherche, (2) Rechercher par marque/modèle/motorisation dans notre catalogue, (3) Nous appeler directement au 06 12 42 98 80 — nos experts identifient la pièce en quelques minutes.',
    },
    {
      q: 'Quelle garantie avez-vous sur vos pièces ?',
      a: 'Toutes nos pièces sont garanties 2 ans, qu\'elles soient neuves ou reconditionnées. En cas de défaillance, nous remplaçons ou remboursons la pièce sans frais. La garantie couvre les défauts de fabrication et de reconditionnement.',
    },
    {
      q: 'Puis-je payer en plusieurs fois ?',
      a: 'Oui, nous proposons le paiement en 3x sans frais par carte bancaire pour toute commande à partir de 100€. Le paiement est 100% sécurisé (chiffrement SSL). Nous acceptons aussi les virements bancaires et PayPal.',
    },
  ];
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-yellow-500 font-bold text-sm uppercase tracking-[0.2em]">Questions fréquentes</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-3">On répond à vos <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-800">questions</span></h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-900 text-sm sm:text-base">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm">Vous avez d&apos;autres questions ?{' '}
            <a href="tel:+33612429880" className="text-blue-600 font-semibold hover:underline">Appelez-nous</a>{' '}ou{' '}
            <a href="/contact" className="text-blue-600 font-semibold hover:underline">écrivez-nous</a>.
          </p>
        </div>
      </div>
    </section>
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
