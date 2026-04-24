'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { 
  Search, ShoppingCart, Heart, Star, 
  Check, ChevronRight, Info, Zap, Shield, 
  Wrench, Package, ArrowRight, Truck
} from 'lucide-react';
import Link from 'next/link';

const chraProducts = [
  {
    id: 1,
    name: 'CHRA Garrett GT1749V',
    brand: 'Garrett',
    reference: '454232-0001',
    price: 189,
    originalPrice: 249,
    rating: 4.8,
    reviews: 156,
    inStock: true,
    compatible: ['Renault Clio 1.5 dCi', 'Nissan Micra 1.5 dCi', 'Dacia Logan 1.5 dCi'],
    image: '⚙️',
    features: ['Genuine Garrett', 'Balanced', '2 ans garantie']
  },
  {
    id: 2,
    name: 'CHRA KKK K03',
    brand: 'KKK / BorgWarner',
    reference: '53039880029',
    price: 165,
    originalPrice: 220,
    rating: 4.7,
    reviews: 124,
    inStock: true,
    compatible: ['Audi A3 1.9 TDI', 'VW Golf IV 1.9 TDI', 'Seat Leon 1.9 TDI'],
    image: '🔧',
    features: ['OEM Quality', 'VNT repaired', 'Testé']
  },
  {
    id: 3,
    name: 'CHRA Mitsubishi TD04',
    brand: 'Mitsubishi',
    reference: '49177-02510',
    price: 219,
    originalPrice: 289,
    rating: 4.9,
    reviews: 89,
    inStock: true,
    compatible: ['Volvo S60 2.4 D5', 'Volvo V70 2.4 D5', 'Saab 9-3 1.9 TiD'],
    image: '⚙️',
    features: ['Original MHI', 'High flow', 'Renforcé']
  },
  {
    id: 4,
    name: 'CHRA Holset HE221W',
    brand: 'Holset / Cummins',
    reference: '4045878',
    price: 289,
    originalPrice: 380,
    rating: 4.8,
    reviews: 67,
    inStock: true,
    compatible: ['Cummins ISBe', 'Iveco Daily 3.0', 'Case IH'],
    image: '🔧',
    features: ['Heavy duty', 'Wastegate', 'Professionnel']
  },
  {
    id: 5,
    name: 'CHRA Garrett GTB1756VK',
    brand: 'Garrett',
    reference: '773720-0001',
    price: 245,
    originalPrice: 320,
    rating: 4.9,
    reviews: 203,
    inStock: true,
    compatible: ['BMW 320d E90', 'BMW 520d E60', 'BMW X3 2.0d'],
    image: '⚙️',
    features: ['Variable geometry', 'Electrovalve', 'Premium']
  },
  {
    id: 6,
    name: 'CHRA IHI RHF4',
    brand: 'IHI',
    reference: 'VC420014',
    price: 149,
    originalPrice: 199,
    rating: 4.6,
    reviews: 78,
    inStock: true,
    compatible: ['Isuzu D-Max 2.5', 'Mazda BT-50 2.5', 'Holden Rodeo'],
    image: '🔧',
    features: ['Japanese quality', 'Robuste', 'Économique']
  }
];

const brands = ['Toutes', 'Garrett', 'KKK', 'Mitsubishi', 'Holset', 'IHI'];
const compatibilities = ['Tous', 'Renault', 'VW/Audi', 'BMW', 'Volvo', 'Iveco', 'Ford'];

export default function KitTurboChraPage() {
  const [selectedBrand, setSelectedBrand] = useState('Toutes');
  const [selectedCompat, setSelectedCompat] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const filteredProducts = chraProducts.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBrand = selectedBrand === 'Toutes' || product.brand.includes(selectedBrand);
    const matchesCompat = selectedCompat === 'Tous' || 
      product.compatible.some(c => c.toLowerCase().includes(selectedCompat.toLowerCase()));
    
    return matchesSearch && matchesBrand && matchesCompat;
  });

  const addToCart = (productId: number) => {
    if (!cart.includes(productId)) {
      setCart([...cart, productId]);
    }
  };

  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      {/* Hero Banner */}
      <section className="relative py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
            <Link href="/" className="hover:text-blue-400 transition">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-400">Kit Turbo CHRA</span>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/30 mb-4">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-blue-200 text-sm font-medium">Spécialiste CHRA</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Kits Turbo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">CHRA</span>
              </h1>
              <p className="text-lg text-slate-400 mb-6">
                Cartouches de turbos neuves et reconditionnées. Solution économique 
                pour remplacer uniquement le cœur de votre turbo. Garantie 2 ans.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#products" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                  Voir les CHRA
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link href="/produits" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 text-slate-300 rounded-xl font-semibold hover:bg-slate-800 transition">
                  Tous les produits
                </Link>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Wrench className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">-40%</div>
                    <div className="text-slate-400">Vs turbo complet</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    'Prix compétitif',
                    'Installation simplifiée',
                    'Même performance',
                    'Écologique'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-8 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-white">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <span className="font-medium">Garantie 2 ans</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6" />
              <span className="font-medium">Livraison 24h</span>
            </div>
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6" />
              <span className="font-medium">Stock immédiat</span>
            </div>
            <div className="flex items-center gap-3">
              <Info className="w-6 h-6" />
              <span className="font-medium">Support technique</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par référence ou modèle..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white transition"
                />
              </div>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 transition"
              >
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <select
                value={selectedCompat}
                onChange={(e) => setSelectedCompat(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 transition"
              >
                {compatibilities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600">
              <span className="font-semibold text-slate-900">{filteredProducts.length}</span> CHRA trouvé{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            {cart.length > 0 && (
              <Link href="/panier" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                <ShoppingCart className="w-4 h-4" />
                <span>{cart.length} dans le panier</span>
              </Link>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition border border-slate-200 group">
                {/* Image Area */}
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="text-6xl">{product.image}</div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                      -{Math.round((product.originalPrice - product.price) / product.originalPrice * 100)}%
                    </span>
                  </div>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow transition ${wishlist.includes(product.id) ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-50'}`}
                  >
                    <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">{product.brand}</span>
                    <span className="text-xs text-slate-500">Ref: {product.reference}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{product.name}</h3>
                  
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-slate-500">({product.reviews} avis)</span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.features.map((feature, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Compatibility */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-1">Compatible avec:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.compatible.slice(0, 3).map((compat, i) => (
                        <span key={i} className="text-xs text-slate-600">{compat}{i < 2 ? ',' : ''}</span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{product.price}€</span>
                      <span className="text-sm text-slate-400 line-through ml-2">{product.originalPrice}€</span>
                    </div>
                    <button
                      onClick={() => addToCart(product.id)}
                      className={`p-3 rounded-xl transition ${cart.includes(product.id) ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Aucun CHRA trouvé</h3>
              <p className="text-slate-600 mb-4">Essayez de modifier vos critères de recherche</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedBrand('Toutes'); setSelectedCompat('Tous'); }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CHRA Info */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Qu&apos;est-ce qu&apos;un CHRA ?</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Le CHRA (Cartridge) est le cœur du turbo compresseur. Remplacer uniquement 
              le CHRA plutôt que le turbo complet est une solution économique et écologique.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Économique</h3>
              <p className="text-slate-600">Jusqu&apos;à 40% moins cher qu&apos;un turbo neuf complet. Même performance garantie.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Facile à installer</h3>
              <p className="text-slate-600">Conservation du carter d&apos;origine. Intervention simplifiée pour le garage.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Qualité OEM</h3>
              <p className="text-slate-600">Tous nos CHRA sont équilibrés et testés sur banc d&apos;essai. Garantie 2 ans.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
