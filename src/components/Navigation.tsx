'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, Search, Wrench, Phone, ChevronRight } from 'lucide-react';
import { useCart } from '@/app/CartContext';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();

  return (
    <>
      <nav className="bg-slate-950/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        {/* Top Bar - Contact Info */}
        <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2 text-xs">
              <div className="flex items-center gap-6 text-gray-400">
                <a href="tel:+33123456789" className="flex items-center gap-2 hover:text-white transition">
                  <Phone className="w-3 h-3" />
                  <span>+33 1 23 45 67 89</span>
                </a>
                <span className="hidden sm:inline text-blue-400">|</span>
                <span className="hidden sm:inline">Livraison 24-48h • Garantie 2 ans</span>
              </div>
              <div className="flex items-center gap-4 text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>En ligne</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-all">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Injection Diesel
                </span>
                <p className="text-[10px] text-gray-500 -mt-1">Premium Auto Parts</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { name: 'Accueil', href: '/' },
                { name: 'Produits', href: '/produits' },
                { name: 'Turbos', href: '/produits?category=turbos' },
                { name: 'Injecteurs', href: '/produits?category=injecteurs' },
                { name: 'Kit CHRA', href: '/kit-turbo-chra' },
                { name: 'À Propos', href: '/apropos' },
                { name: 'Contact', href: '#contact' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-4 py-2 text-sm text-gray-300 hover:text-white font-medium transition group"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform" />
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Search Toggle */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account */}
              <button className="hidden sm:flex p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition">
                <User className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link 
                href="/panier"
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-600/30 transition"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline text-sm">Panier</span>
                {totalItems > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{totalItems}</span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar - Expandable */}
        <div className={`overflow-hidden transition-all duration-300 ${isSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-white/10 bg-slate-900/50">
            <div className="max-w-3xl mx-auto px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une pièce (ex: Turbo Clio 3...)"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:bg-white/10 focus:border-blue-500 transition"
                  autoFocus={isSearchOpen}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Link 
                  href={searchQuery ? `/produits?search=${encodeURIComponent(searchQuery)}` : '/produits'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <span className="text-sm">Rechercher</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </nav>

      {/* Mobile Menu - Outside nav to avoid sticky/z-index issues */}
      <div 
        className={`lg:hidden fixed inset-0 top-[88px] z-40 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div 
          className={`absolute top-0 left-0 right-0 bg-slate-900 border-b border-white/10 shadow-2xl transition-transform duration-300 ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
            {[
              { name: 'Accueil', href: '/' },
              { name: 'Tous les produits', href: '/produits' },
              { name: 'Turbos', href: '/produits?category=turbos' },
              { name: 'Injecteurs', href: '/produits?category=injecteurs' },
              { name: 'Kit CHRA', href: '/kit-turbo-chra' },
              { name: 'Pompes', href: '/produits?category=pompes' },
              { name: 'À Propos', href: '/apropos' },
              { name: 'Contact', href: '#contact' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition"
              >
                <span className="font-medium">{item.name}</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
