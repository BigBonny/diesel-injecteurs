'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { 
  Target, Award, Users, Truck, Shield, Clock, 
  MapPin, Phone, Mail, ChevronRight, Star, 
  Wrench, Zap, CheckCircle, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

const values = [
  {
    icon: Target,
    title: 'Expertise',
    description: 'Notre équipe de techniciens qualifiés garantit la qualité de chaque produit diesel reconditionné.'
  },
  {
    icon: Award,
    title: 'Qualité',
    description: 'Toutes nos pièces sont testées et certifiées. Garantie 2 ans sur l\'ensemble de notre catalogue.'
  },
  {
    icon: Users,
    title: 'Service Client',
    description: 'Une équipe de spécialistes à votre écoute. Conseils personnalisés et devis gratuits en 2h.'
  },
  {
    icon: Truck,
    title: 'Logistique',
    description: 'Stock important pour une livraison express 24h partout en France et en Europe.'
  }
];

const milestones = [
  { year: '2019', title: 'Création', desc: 'Immatriculation de SAS France Injection le 11 février 2019, spécialiste pièces diesel' },
  { year: '2020', title: 'E-commerce', desc: 'Lancement de notre boutique en ligne diesel-turbo-injection.com' },
  { year: '2021', title: 'Expansion', desc: 'Élargissement du catalogue aux pompes haute pression et kits CHRA' },
  { year: '2022', title: 'Europe', desc: 'Livraison dans toute l\'Union Européenne' },
  { year: '2024', title: 'Croissance', desc: 'Renforcement de notre stock et de notre équipe technique' },
];

const stats = [
  { value: '2 ans', label: 'Garantie produits' },
  { value: '24-48h', label: 'Livraison express' },
  { value: 'UE', label: 'Livraison Europe' },
  { value: 'Échange', label: 'Standard reconditionné' }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      {/* Hero */}
      <section className="relative py-24 bg-[#1e2a4a] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/30 mb-6">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-200 text-sm font-medium">SAS France Injection</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Les experts du{' '}
            <span className="text-yellow-400">
              turbo reconditionné
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Spécialiste de la pièce diesel en échange standard. 
            Turbos, injecteurs et pompes reconditionnés, testés et garantis.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-yellow-500 mb-1">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Notre Mission</h2>
              <p className="text-lg text-slate-600 mb-6">
                Chez SAS France Injection, notre mission est simple : rendre les pièces auto de qualité professionnelle 
                accessibles à tous. Que vous soyez un garage professionnel ou un particulier passionné, 
                nous vous offrons les mêmes standards de qualité.
              </p>
              <p className="text-lg text-slate-600 mb-8">
                Notre équipe d&apos;experts sélectionne rigoureusement chaque produit. Tous nos turbos et injecteurs 
                sont testés sur banc avant expédition.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/produits" className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-[#1e2a4a] rounded-xl font-semibold hover:bg-yellow-300 transition">
                  Voir nos produits
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition">
                  Nous contacter
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-linear-to-r from-yellow-400/20 to-yellow-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center">
                    <Wrench className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div>
                        <div className="text-2xl font-bold text-slate-900">Catalogue</div>
                    <div className="text-slate-600">Pièces diesel en échange standard</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    'Turbos reconditionnés en échange standard',
                    'Injecteurs diesel tous types',
                    'Pompes à injection haute pression',
                    'Kits de réparation complets',
                    'Pièces testées sur banc avant expédition'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-yellow-500 font-semibold text-sm uppercase tracking-wider">Nos valeurs</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2">Pourquoi nous choisir ?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 hover:shadow-xl transition group">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <value.icon className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-yellow-500 font-semibold text-sm uppercase tracking-wider">Notre histoire</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2">Depuis 2019</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-yellow-300 hidden md:block" />
            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                <div key={idx} className={`flex items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 text-right md:text-right">
                    <div className={`bg-white rounded-xl p-6 shadow-md border border-slate-200 inline-block ${idx % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}`}>
                      <div className="text-2xl font-bold text-yellow-500 mb-1">{milestone.year}</div>
                      <div className="text-lg font-semibold text-slate-900 mb-1">{milestone.title}</div>
                      <div className="text-slate-600">{milestone.desc}</div>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full border-4 border-white shadow hidden md:block relative z-10" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team/Expertise */}
      <section className="py-20 bg-[#1e2a4a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Une équipe d&apos;<span className="text-yellow-400">experts passionnés</span>
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Notre équipe met son expertise du diesel au service de chaque client. 
                Chaque pièce est inspectée et testée avant expédition pour garantir sa fiabilité.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">2 ans</div>
                  <div className="text-slate-400">Garantie produits</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="text-3xl font-bold text-yellow-300 mb-2">Échange</div>
                  <div className="text-slate-400">Standard reconditionné</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Zap className="w-10 h-10 text-yellow-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Test rigoureux</h3>
                <p className="text-slate-400 text-sm">Chaque pièce est testée sur banc d&apos;essai avant expédition</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mt-8">
                <Shield className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Garantie 2 ans</h3>
                <p className="text-slate-400 text-sm">Sérénité totale avec notre garantie sur les défauts de fabrication</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Clock className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Livraison 24h</h3>
                <p className="text-slate-400 text-sm">Stock important pour une expédition express</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mt-8">
                <TrendingUp className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Prix compétitifs</h3>
                <p className="text-slate-400 text-sm">Prix compétitifs vs neuf</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Contactez-nous</h2>
            <p className="text-lg text-slate-600">Notre équipe est à votre disposition pour toute question</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Notre Adresse</h3>
              <p className="text-slate-600">
                SAS France Injection<br />
                158 Avenue Charles Floquet<br />
                93150 Le Blanc-Mesnil, France<br />
                SIRET : 848 214 359 00012<br />
                RCS : 848 214 359 R.C.S Bobigny
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Téléphone</h3>
              <p className="text-slate-600">
                <a href="tel:+33172517665" className="hover:text-yellow-600 transition">01 72 51 76 65</a><br />
                WhatsApp : <a href="https://wa.me/33612429880" className="hover:text-yellow-600 transition">06 12 42 98 80</a>
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
              <p className="text-slate-600">
                <a href="mailto:diesel.injecteurs@gmail.com" className="hover:text-yellow-600 transition">diesel.injecteurs@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
