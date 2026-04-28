'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, Search, Phone, ChevronRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/app/CartContext';

// Color scheme based on newLogo - Navy Blue and Red
const COLORS = {
  navy: '#1e3a5f',
  navyLight: '#2d4a6f',
  red: '#c41e3a',
  redLight: '#d43a5a',
};

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { totalItems } = useCart();

  return (
    <>
      <nav className="bg-[#fbbf24]/95 backdrop-blur-xl border-b border-white/10 z-[9999] transition-all duration-500 ease-in-out relative">
        {/* Top Bar - Contact Info */}
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2 text-xs">
              <div className="text-gray-300">
                <span>Bienvenue sur Diesel-injecteurs.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-gray-400">|</span>
                <a href="tel:+33612429880" className="flex items-center gap-2 hover:text-white transition">
                  <Phone className="w-3 h-3" />
                  <span>Appelez-nous : +33 6 12 42 98 80</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Section - Full Width */}
        <div className="w-full flex justify-start py-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Link href="/" className="group block w-full max-w-[400px]">
            <img 
              src="/images/newLogo.svg" 
              alt="Injection Diesel Logo" 
              className="w-full h-auto max-h-[180px] sm:max-h-[250px] object-contain"
            />
          </Link>
        </div>

        {/* Main Navigation - Stacked Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Bottom Row - Navigation Tabs & Actions */}
          <div className="flex justify-between items-center">
            {/* Desktop Navigation - Tabs */}
            <div className="hidden lg:flex items-center gap-1 mx-auto">
              {[
                { name: 'Accueil', href: '/' },
                { name: 'Turbos', href: '/produits?category=turbos', hasDropdown: true, category: 'turbos' },
                { name: 'Injecteurs', href: '/produits?category=injecteurs', hasDropdown: true, category: 'injecteurs' },
                { name: 'Kit CHRA', href: '/produits?category=kit-turbo-chra', hasDropdown: true, category: 'kit-turbo-chra' },
                { name: 'Blog', href: '/blog' },
                { name: 'Retour Consigne', href: '/retour-consigne' },
                { name: 'À Propos', href: '/apropos' },
                { name: 'Contact', href: '/contact' },
              ].map((item) => (
                <div
                  key={item.name}
                  className="relative"
                >
                  {item.hasDropdown ? (
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.category ? null : item.category)}
                      className="relative px-4 py-2 text-sm text-gray-900 hover:text-gray-700 font-bold transition group flex items-center gap-1"
                    >
                      <span className="relative z-10">{item.name}</span>
                      <ChevronDown className="w-4 h-4" />
                      <div className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform" />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="relative px-4 py-2 text-sm text-gray-900 hover:text-gray-700 font-bold transition group flex items-center gap-1"
                    >
                      <span className="relative z-10">{item.name}</span>
                      <div className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform" />
                    </Link>
                  )}
                  
                  {/* Dropdown Menu */}
                  {item.hasDropdown && activeDropdown === item.category && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-[100]">
                      <div className="p-4">
                        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-semibold">Par marque</p>
                        <div className="space-y-2">
                          {item.category === 'turbos' && (
                            <>
                              <Link href={`/produits?category=turbos&brand=Renault`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Renault</Link>
                              <Link href={`/produits?category=turbos&brand=Peugeot`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Peugeot</Link>
                              <Link href={`/produits?category=turbos&brand=Citroën`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Citroën</Link>
                              <Link href={`/produits?category=turbos&brand=Volkswagen`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Volkswagen</Link>
                              <Link href={`/produits?category=turbos&brand=BMW`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">BMW</Link>
                              <Link href={`/produits?category=turbos&brand=Mercedes`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Mercedes</Link>
                              <Link href={`/produits?category=turbos&brand=Audi`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Audi</Link>
                              <Link href={`/produits?category=turbos&brand=Ford`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Ford</Link>
                              <Link href={`/produits?category=turbos&brand=Opel`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Opel</Link>
                            </>
                          )}
                          {item.category === 'injecteurs' && (
                            <>
                              <Link href={`/produits?category=injecteurs&brand=Renault`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Renault</Link>
                              <Link href={`/produits?category=injecteurs&brand=Peugeot`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Peugeot</Link>
                              <Link href={`/produits?category=injecteurs&brand=Citroën`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Citroën</Link>
                              <Link href={`/produits?category=injecteurs&brand=Volkswagen`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Volkswagen</Link>
                              <Link href={`/produits?category=injecteurs&brand=BMW`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">BMW</Link>
                              <Link href={`/produits?category=injecteurs&brand=Mercedes`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Mercedes</Link>
                              <Link href={`/produits?category=injecteurs&brand=Ford`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Ford</Link>
                            </>
                          )}
                          {item.category === 'kit-turbo-chra' && (
                            <>
                              <Link href={`/produits?category=kit-turbo-chra&brand=Renault`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Renault</Link>
                              <Link href={`/produits?category=kit-turbo-chra&brand=Peugeot`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Peugeot</Link>
                              <Link href={`/produits?category=kit-turbo-chra&brand=Citroën`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Citroën</Link>
                              <Link href={`/produits?category=kit-turbo-chra&brand=Audi`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Audi</Link>
                              <Link href={`/produits?category=kit-turbo-chra&brand=BMW`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">BMW</Link>
                              <Link href={`/produits?category=kit-turbo-chra&brand=Mercedes`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Mercedes</Link>
                              <Link href={`/produits?category=kit-turbo-chra&brand=Volkswagen`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Volkswagen</Link>
                              <Link href={`/produits?category=kit-turbo-chra&brand=Ford`} className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-yellow-50 rounded-lg transition">Ford</Link>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Spacer for centering */}
            <div className="hidden lg:block w-32" />

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Search Toggle */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 text-gray-900 hover:text-gray-700 hover:bg-black/10 rounded-xl transition relative z-[70]"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account */}
              <button className="hidden sm:flex p-2.5 text-gray-900 hover:text-gray-700 hover:bg-black/10 rounded-xl transition">
                <User className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link 
                href="/panier"
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-600/30 transition relative z-[70]"
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
                className="lg:hidden p-2.5 text-gray-900 hover:text-gray-700 hover:bg-black/10 rounded-xl transition relative z-[70]"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar - Expandable */}
        <div className={`overflow-hidden transition-all duration-300 ${isSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="border-t border-gray-200 bg-white">
            <div className="max-w-3xl mx-auto px-4 py-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une pièce (ex: Turbo Clio 3...)"
                  className="w-full pl-12 pr-24 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:border-yellow-500 transition"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Link 
                  href={searchQuery ? `/produits?search=${encodeURIComponent(searchQuery)}` : '/produits'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-yellow-500 text-gray-900 rounded-lg text-sm font-bold hover:bg-yellow-400 transition"
                >
                  Rechercher
                </Link>
              </div>
            </div>
          </div>
        </div>

      </nav>

      {/* Mobile Menu - Slide in from right */}
      <div 
        className={`lg:hidden fixed inset-0 z-[10000] transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Panel - Slide from right */}
        <div 
          className={`absolute top-0 right-0 bottom-0 w-[80%] max-w-sm bg-slate-900 shadow-2xl transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-end px-4 py-4 border-b border-white/10">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="px-4 py-4 space-y-1 overflow-y-auto h-[calc(100%-80px)]">
            {[
              { name: 'Accueil', href: '/', icon: '🏠' },
              { name: 'Turbos', href: '/produits?category=turbos', icon: '⚙️' },
              { name: 'Injecteurs', href: '/produits?category=injecteurs', icon: '⛽' },
              { name: 'Kit CHRA', href: '/produits?category=kit-turbo-chra', icon: '🔧' },
              { name: 'Blog', href: '/blog', icon: '📰' },
              { name: 'Retour Consigne', href: '/retour-consigne', icon: '♻️' },
              { name: 'À Propos', href: '/apropos', icon: 'ℹ️' },
              { name: 'Contact', href: '/contact', icon: '📞' },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-blue-600/20 rounded-xl transition group"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
                <ChevronRight className="w-5 h-5 ml-auto text-gray-500 group-hover:text-white transition" />
              </Link>
            ))}

            {/* Contact Info in Mobile Menu */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <a 
                href="tel:+33612429880" 
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition"
              >
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="font-medium">+33 6 12 42 98 80</span>
              </a>
              <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Service client disponible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
