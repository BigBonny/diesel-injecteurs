'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Facebook, Instagram, Linkedin, Twitter, Youtube, 
  Mail, Phone, ChevronRight,
  Wrench, Zap, ShieldCheck, Clock, CreditCard,
  Send
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const footerLinks = {
    produits: [
      { name: 'Turbos', href: '/produits?category=turbos' },
      { name: 'Injecteurs', href: '/produits?category=injecteurs' },
      { name: 'Pompes à Injection', href: '/produits?category=pompes' },
      { name: 'Kits de Réparation', href: '/produits?category=kits' },
      { name: 'Pièces Moteur', href: '/produits' },
    ],
    service: [
      { name: 'Commande Rapide', href: '#quick-finder' },
      { name: 'Livraison & Retours', href: '#' },
      { name: 'Garantie 2 Ans', href: '#' },
      { name: 'FAQ', href: '#' },
      { name: 'Support Technique', href: '#contact' },
    ],
    entreprise: [
      { name: 'À Propos', href: '/apropos' },
      { name: 'Blog', href: '/blog' },
      { name: 'Retour Consigne', href: '/retour-consigne' },
      { name: 'Contact', href: '/contact' },
    ],
  };

  const trustBadges = [
    { icon: ShieldCheck, label: 'Paiement Sécurisé' },
    { icon: Clock, label: 'Expédition 24h' },
    { icon: CreditCard, label: 'CB & Paypal' },
    { icon: Zap, label: 'Retour Gratuit' },
  ];

  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-900 via-slate-950 to-black" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%234f46e5%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-64 h-64 border border-blue-500/10 rounded-full animate-spin-slow" style={{ animationDuration: '30s' }} />
        <div className="absolute bottom-40 right-20 w-48 h-48 border border-cyan-500/10 rounded-full animate-spin-slow" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Trust Bar */}
        <div className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustBadges.map((badge, idx) => (
                <div 
                  key={idx} 
                  className="group flex items-center gap-3 hover:bg-white/5 rounded-xl p-3 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <badge.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12 bg-linear-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <Wrench className="w-7 h-7 text-white" />
                  <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Injection Diesel
                  </span>
                  <p className="text-xs text-gray-500">Premium Auto Parts</p>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                Les experts du turbo reconditionné. Solution fiable et rapide 
                pour votre moteur diesel avec injecteurs Bosch, Delphi, Siemens et Denso.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a href="tel:+33612429880" className="group flex items-center gap-3 text-gray-400 hover:text-white transition">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-blue-600/20 transition">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Assistance 24/7</p>
                    <p className="font-semibold">+33 6 12 42 98 80</p>
                  </div>
                </a>
                <a href="mailto:diesel.injecteurs@gmail.com" className="group flex items-center gap-3 text-gray-400 hover:text-white transition">
                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-cyan-600/20 transition">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold">diesel.injecteurs@gmail.com</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-5 grid grid-cols-3 gap-8">
              {/* Produits */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Produits</h4>
                <ul className="space-y-2">
                  {footerLinks.produits.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="group flex items-center text-sm text-gray-400 hover:text-white transition-all duration-300"
                      >
                        <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-400" />
                        <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Service */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Service</h4>
                <ul className="space-y-2">
                  {footerLinks.service.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="group flex items-center text-sm text-gray-400 hover:text-white transition-all duration-300"
                      >
                        <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-400" />
                        <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Entreprise */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Entreprise</h4>
                <ul className="space-y-2">
                  {footerLinks.entreprise.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="group flex items-center text-sm text-gray-400 hover:text-white transition-all duration-300"
                      >
                        <ChevronRight className="w-4 h-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-blue-400" />
                        <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter Column */}
            <div className="lg:col-span-3">
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-4">
                Recevez nos offres exclusives et nouveautés.
              </p>
              
              <form className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:bg-white/10 transition-all outline-none text-sm"
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-linear-to-r from-blue-600 to-cyan-600 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  En vous inscrivant, vous acceptez notre politique de confidentialité.
                </p>
              </form>

              {/* Social Links */}
              <div className="mt-6">
                <h5 className="text-xs font-semibold text-gray-500 mb-3 uppercase">Suivez-nous</h5>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, href: '#', color: 'hover:bg-blue-600' },
                    { icon: Instagram, href: '#', color: 'hover:bg-pink-600' },
                    { icon: Linkedin, href: '#', color: 'hover:bg-blue-700' },
                    { icon: Twitter, href: '#', color: 'hover:bg-sky-500' },
                    { icon: Youtube, href: '#', color: 'hover:bg-red-600' },
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      className={`w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 ${social.color} hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Injection Diesel. Tous droits réservés.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <a href="#" className="hover:text-white transition">Mentions légales</a>
                <a href="#" className="hover:text-white transition">CGV</a>
                <a href="#" className="hover:text-white transition">Confidentialité</a>
                <a href="#" className="hover:text-white transition">Cookies</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
