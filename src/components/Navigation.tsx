'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Menu, X, ShoppingCart, Search, Phone, ChevronRight, ChevronDown, Zap, User, LogIn } from 'lucide-react';
import { useCart } from '@/app/CartContext';

const NAV_ITEMS = [
  { name: 'Accueil', href: '/' },
  { name: 'Turbos', href: '/produits?category=turbos', hasDropdown: true, category: 'turbos' },
  { name: 'Injecteurs', href: '/produits?category=injecteurs', hasDropdown: true, category: 'injecteurs' },
  { name: 'Kit CHRA', href: '/produits?category=kit-turbo-chra', hasDropdown: true, category: 'kit-turbo-chra' },
  { name: 'Pompes HP', href: '/produits?category=pompes-hp', hasDropdown: true, category: 'pompes-hp' },
  { name: 'Blog', href: '/blog' },
  { name: 'À propos', href: '/apropos' },
  { name: 'Contact', href: '/contact' },
  { name: 'Retour consigne', href: '/retour-consigne' },
];


const DROPDOWN_BRANDS: Record<string, string[]> = {
  turbos: ['Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'BMW', 'Mercedes', 'Audi', 'Ford', 'Opel'],
  injecteurs: ['Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'BMW', 'Mercedes', 'Ford'],
  'kit-turbo-chra': ['Renault', 'Peugeot', 'Citroën', 'Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Ford'],
  'pompes-hp': ['Bosch', 'Denso', 'Siemens', 'Continental', 'Delphi', 'Renault', 'Peugeot', 'Volkswagen'],
};

function NavigationInner() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = searchParams.get('category');

  // Initialize user as null to avoid hydration mismatch
  const [user, setUser] = useState<{ firstname: string; lastname: string } | null>(null);
  
  // Load user from localStorage only on client side after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ps_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch { 
      // Ignore localStorage errors
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) router.push(`/produits?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Remove the old getUserFromStorage function - now handled in useEffect above

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setActiveDropdown(null);
    if (activeDropdown) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [activeDropdown]);

  return (
    <>
      <nav className={`sticky top-0 z-[9999] transition-shadow duration-300 ${scrolled ? 'shadow-xl shadow-slate-900/10' : ''}`}>
        {/* Promo Banner */}
        <div className="bg-yellow-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-bold text-slate-900">
              <Zap className="w-4 h-4" />
              <span>Promo spéciale <strong>-20% sur les turbos Garrett</strong> Livraison express 24/48h</span>
              <Zap className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Top Bar */}
        <div className="bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2 gap-3">
              <div className="text-slate-400 text-xs font-medium hidden sm:flex items-center gap-4">
                <span className="flex items-center gap-1"><span className="text-yellow-400">✓</span> Garantie 2 ans</span>
                <span className="flex items-center gap-1"><span className="text-yellow-400">✓</span> Livraison gratuite 24-48h</span>
                <span className="flex items-center gap-1"><span className="text-yellow-400">✓</span> Paiement sécurisé SSL</span>
                <span className="flex items-center gap-1"><span className="text-yellow-400">✓</span> Retour 14 jours</span>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <a href="tel:+33612429880" className="flex items-center gap-2 text-white hover:text-yellow-400 transition text-xs sm:text-sm font-semibold">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">+33 6 12 42 98 80</span>
                </a>
                <div className="w-px h-4 bg-white/20" />
                {/* Cart in top bar */}
                <Link href="/panier" className="relative flex items-center gap-1.5 text-white hover:text-yellow-400 transition text-xs font-semibold">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Panier</span>
                  {totalItems > 0 && (
                    <span className="w-4 h-4 bg-yellow-400 text-[#1e2a4a] rounded-full text-[9px] font-black flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <div className="w-px h-4 bg-white/20" />
                {/* Connexion / Account */}
                {user ? (
                  <Link href="/compte" className="flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 transition text-xs font-semibold">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.firstname}</span>
                  </Link>
                ) : (
                  <Link href="/connexion" className="flex items-center gap-1.5 text-white hover:text-yellow-400 transition text-xs font-semibold">
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Connexion</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar - White background */}
        <div className="bg-white relative overflow-visible">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Logo row */}
            <div className="flex items-center justify-between">
              <Link href="/" className="shrink-0 mx-auto lg:mx-0 relative h-28 sm:h-40 w-32 sm:w-48 block">
                <Image 
                  src="/assets/logo.png" 
                  alt="Diesel Turbo Injection Logo" 
                  fill
                  priority
                  className="object-contain object-left"
                  sizes="(max-width: 640px) 128px, 192px"
                />
              </Link>

              {/* Desktop right side: search bar + stars */}
              <div className="hidden lg:flex items-center gap-4 flex-1 justify-end">
                {/* Search bar left of stars */}
                <form onSubmit={handleSearch} className="relative w-72">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 text-sm placeholder-slate-400 focus:bg-white focus:border-yellow-400 focus:outline-none transition-all"
                  />
                  <button type="submit" className="absolute left-2.5 top-1/2 -translate-y-1/2">
                    <Search className="w-4 h-4 text-slate-400 hover:text-yellow-500 transition" />
                  </button>
                </form>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-[#1e2a4a]">4.8/5</span>
                  <span className="text-xs text-slate-500">(+200 avis)</span>
                </div>
              </div>

              {/* Mobile actions (shown only on small screens) */}
              <div className="flex lg:hidden items-center gap-2">
                <button
                  className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                  onClick={() => {
                    const q = prompt('Rechercher un produit...');
                    if (q) window.location.href = `/produits?search=${encodeURIComponent(q)}`;
                  }}
                >
                  <Search className="w-5 h-5" />
                </button>
                <Link href="/panier" className="relative p-2.5 text-slate-700 hover:text-[#1e2a4a] transition">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-yellow-400 text-[#1e2a4a] rounded-full text-[10px] font-black flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Nav bar row: tabs + search + cart (desktop) */}
        <div className="bg-[#1e2a4a] border-b border-[#1e2a4a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="hidden lg:flex items-center h-12 gap-1">

              {/* Nav links */}
              {NAV_ITEMS.map((item) => {
                const isActive = item.category
                  ? pathname === '/produits' && currentCategory === item.category
                  : pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.category!)}
                    onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
                  >
                    {item.hasDropdown ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === item.category ? null : item.category!);
                        }}
                        className={`relative h-12 px-4 text-[13px] font-semibold uppercase tracking-wide transition-all duration-200 flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-yellow-400 text-[#1e2a4a]'
                            : 'text-white/85 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {item.name}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === item.category ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`relative h-12 px-4 text-[13px] font-semibold uppercase tracking-wide transition-all duration-200 flex items-center ${
                          isActive
                            ? 'bg-yellow-400 text-[#1e2a4a]'
                            : 'text-white/85 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}

                    {/* Dropdown */}
                    {item.hasDropdown && activeDropdown === item.category && (
                      <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-b-xl shadow-2xl overflow-hidden z-[100] border-t-2 border-yellow-400">
                        <div className="py-2">
                          <p className="px-4 py-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">Par marque</p>
                          {DROPDOWN_BRANDS[item.category!]?.map((brand) => (
                            <Link
                              key={brand}
                              href={`/produits?category=${item.category}&brand=${brand}`}
                              className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-yellow-50 hover:text-slate-900 hover:pl-6 transition-all duration-200 font-medium"
                            >
                              {brand}
                            </Link>
                          ))}
                        </div>
                        <Link
                          href={item.href}
                          className="block px-4 py-3 text-sm font-bold text-[#1e2a4a] bg-slate-50 hover:bg-yellow-50 transition border-t border-slate-100"
                        >
                          Voir tous les {item.name.toLowerCase()} →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Spacer */}
              <div className="flex-1" />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-[10000] transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        <div
          className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#1e2a4a] shadow-2xl transition-transform duration-300 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
              <div className="bg-white rounded-lg px-2.5 py-1 relative h-8 w-20">
                <Image src="/assets/logo.png" alt="Diesel Turbo Injection Logo" fill className="object-contain" sizes="80px" />
              </div>
            </Link>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="px-5 py-4">
            <form onSubmit={(e) => { e.preventDefault(); if (mobileSearchQuery.trim()) { setIsMenuOpen(false); router.push(`/produits?search=${encodeURIComponent(mobileSearchQuery.trim())}`); }}}>
              <div className="relative">
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder-slate-400 focus:border-yellow-400 focus:outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-yellow-400 text-[#1e2a4a] rounded-lg text-xs font-bold">OK</button>
              </div>
            </form>
          </div>

          {/* Mobile Nav Items */}
          <div className="px-3 py-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-200px)]">
            {NAV_ITEMS.map((item) => {
              const isMobileActive = item.category
                ? pathname === '/produits' && currentCategory === item.category
                : pathname === item.href;
              
              if (item.hasDropdown && item.category) {
                const isExpanded = mobileExpanded === item.category;
                const brands = DROPDOWN_BRANDS[item.category] || [];
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => setMobileExpanded(isExpanded ? null : item.category!)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                        isMobileActive
                          ? 'bg-yellow-400 text-[#1e2a4a]'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Link href={item.href} onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-400">{item.name}</Link>
                      </span>
                      <ChevronDown className={`w-4 h-4 opacity-70 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-yellow-400/30 pl-3">
                        {brands.map((brand) => (
                          <Link
                            key={brand}
                            href={`/produits?category=${item.category}&brand=${brand}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-yellow-400 hover:bg-white/5 transition-all"
                          >
                            <ChevronRight className="w-3 h-3" />
                            {brand}
                          </Link>
                        ))}
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-yellow-400 font-semibold hover:bg-white/5 transition-all"
                        >
                          <ChevronRight className="w-3 h-3" />
                          Voir tous les {item.name.toLowerCase()} →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                    isMobileActive
                      ? 'bg-yellow-400 text-[#1e2a4a]'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.name}
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}
          </div>

          {/* Mobile Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-white/10 bg-[#1e2a4a]">
            <a href="tel:+33612429880" className="flex items-center gap-3 text-yellow-400 font-bold text-sm mb-3">
              <Phone className="w-4 h-4" />
              +33 6 12 42 98 80
            </a>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Service client disponible
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Navigation() {
  return (
    <Suspense fallback={null}>
      <NavigationInner />
    </Suspense>
  );
}
