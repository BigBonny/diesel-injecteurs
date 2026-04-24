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
    description: 'Plus de 15 ans d\'expérience dans les pièces diesel. Notre équipe d\'ingénieurs qualifiés garantit la qualité de chaque produit.'
  },
  {
    icon: Award,
    title: 'Qualité OEM',
    description: 'Toutes nos pièces sont testées et certifiées selon les standards OEM. Garantie 2 ans sur l\'ensemble de notre catalogue.'
  },
  {
    icon: Users,
    title: 'Service Client',
    description: 'Une équipe de spécialistes à votre écoute du lundi au samedi. Conseils personnalisés et devis gratuits en 2h.'
  },
  {
    icon: Truck,
    title: 'Logistique',
    description: 'Stock de 50 000+ pièces pour une livraison express 24h partout en France et en Europe.'
  }
];

const milestones = [
  { year: '2009', title: 'Création', desc: 'Fondation d\'Injection Diesel à Paris' },
  { year: '2012', title: 'Expansion', desc: 'Ouverture de notre entrepôt de 2000m²' },
  { year: '2015', title: 'E-commerce', desc: 'Lancement de notre boutique en ligne' },
  { year: '2018', title: 'Europe', desc: 'Livraison dans toute l\'Union Européenne' },
  { year: '2022', title: 'Innovation', desc: 'Laboratoire de test interne certifié' },
  { year: '2024', title: 'Leader', desc: '15 000+ clients professionnels et particuliers' }
];

const stats = [
  { value: '15+', label: 'Années d\'expérience' },
  { value: '50K+', label: 'Pièces en stock' },
  { value: '15K+', label: 'Clients satisfaits' },
  { value: '4.9/5', label: 'Note moyenne' }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      {/* Hero */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/30 mb-6">
            <Star className="w-4 h-4 text-blue-400" />
            <span className="text-blue-200 text-sm font-medium">Depuis 2009</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            À propos d&apos;<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Injection Diesel</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Votre spécialiste de confiance pour les turbos, injecteurs et pièces diesel. 
            Qualité professionnelle à prix compétitif depuis plus de 15 ans.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-1">{stat.value}</div>
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
                Chez Injection Diesel, notre mission est simple : rendre les pièces auto de qualité professionnelle 
                accessibles à tous. Que vous soyez un garage professionnel ou un particulier passionné, 
                nous vous offrons les mêmes standards de qualité.
              </p>
              <p className="text-lg text-slate-600 mb-8">
                Notre équipe d&apos;experts sélectionne rigoureusement chaque produit. Tous nos turbos et injecteurs 
                sont testés dans notre laboratoire certifié avant expédition.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/produits" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                  Voir nos produits
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition">
                  Nous contacter
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <Wrench className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">50 000+</div>
                    <div className="text-slate-600">Pièces référencées</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    'Turbos neufs et reconditionnés',
                    'Injecteurs diesel tous types',
                    'Pompes à injection haute pression',
                    'Kits de réparation complets',
                    'Pièces OEM et équivalentes'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
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
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Nos valeurs</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2">Pourquoi nous choisir ?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 hover:shadow-xl transition group">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <value.icon className="w-8 h-8 text-blue-600" />
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
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Notre histoire</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-2">15 ans d&apos;excellence</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-blue-200 hidden md:block" />
            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                <div key={idx} className={`flex items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 text-right md:text-right">
                    <div className={`bg-white rounded-xl p-6 shadow-md border border-slate-200 inline-block ${idx % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}`}>
                      <div className="text-2xl font-bold text-blue-600 mb-1">{milestone.year}</div>
                      <div className="text-lg font-semibold text-slate-900 mb-1">{milestone.title}</div>
                      <div className="text-slate-600">{milestone.desc}</div>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow hidden md:block relative z-10" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team/Expertise */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Une équipe d&apos;<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">experts passionnés</span>
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Nos techniciens et ingénieurs cumulent plus de 100 ans d&apos;expérience combinée dans le diesel. 
                Chaque membre de l&apos;équipe partage une passion commune : vous offrir le meilleur service possible.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="text-3xl font-bold text-blue-400 mb-2">25+</div>
                  <div className="text-slate-400">Experts techniques</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">98%</div>
                  <div className="text-slate-400">Taux de satisfaction</div>
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
                <p className="text-slate-400 text-sm">Sérénité totale avec notre garantie pièces et main d&apos;œuvre</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Clock className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Livraison 24h</h3>
                <p className="text-slate-400 text-sm">Stock important pour une expédition express</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mt-8">
                <TrendingUp className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Prix compétitifs</h3>
                <p className="text-slate-400 text-sm">Jusqu&apos;à -40% vs concessionnaire</p>
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
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Notre Adresse</h3>
              <p className="text-slate-600">
                123 Rue de l&apos;Industrie<br />
                75015 Paris, France
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Téléphone</h3>
              <p className="text-slate-600">
                +33 1 23 45 67 89<br />
                Lun-Ven : 8h-19h
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
              <p className="text-slate-600">
                contact@injection-diesel.fr<br />
                support@injection-diesel.fr
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
