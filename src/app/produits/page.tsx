'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  Search, ChevronDown, Heart, Star, ShoppingCart,
  SlidersHorizontal, X, Check, Grid3X3, List, ChevronRight
} from 'lucide-react';

// Mock product data - will be replaced with Prestashop API
const products = [
  { id: 1, name: 'Turbo Garrett GT1749V', category: 'Turbos', price: 349, originalPrice: 450, rating: 4.8, reviews: 124, inStock: true, brand: 'Garrett', model: 'GT1749V', image: '🔧', tags: ['Renault', 'Nissan'] },
  { id: 2, name: 'Injecteur Bosch 0445110', category: 'Injecteurs', price: 89, originalPrice: 120, rating: 4.9, reviews: 89, inStock: true, brand: 'Bosch', model: '0445110', image: '⚙️', tags: ['Mercedes', 'BMW'] },
  { id: 3, name: 'Pompe Denso HP3', category: 'Pompes', price: 289, originalPrice: 380, rating: 4.7, reviews: 56, inStock: true, brand: 'Denso', model: 'HP3', image: '🔩', tags: ['Toyota', 'Ford'] },
  { id: 4, name: 'Kit Réparation Turbo', category: 'Kits', price: 45, originalPrice: 65, rating: 4.6, reviews: 203, inStock: true, brand: 'Generic', model: 'Universal', image: '🛠️', tags: ['Universal'] },
  { id: 5, name: 'Turbo KKK K03', category: 'Turbos', price: 299, originalPrice: 380, rating: 4.7, reviews: 87, inStock: true, brand: 'KKK', model: 'K03', image: '🔧', tags: ['VW', 'Audi'] },
  { id: 6, name: 'Injecteur Delphi EJBR', category: 'Injecteurs', price: 125, originalPrice: 165, rating: 4.8, reviews: 45, inStock: true, brand: 'Delphi', model: 'EJBR', image: '⚙️', tags: ['Renault', 'Dacia'] },
  { id: 7, name: 'Pompe Bosch CP1', category: 'Pompes', price: 199, originalPrice: 250, rating: 4.5, reviews: 32, inStock: false, brand: 'Bosch', model: 'CP1', image: '🔩', tags: ['Opel', 'Fiat'] },
  { id: 8, name: 'Turbo Mitsubishi TD04', category: 'Turbos', price: 389, originalPrice: 490, rating: 4.9, reviews: 76, inStock: true, brand: 'Mitsubishi', model: 'TD04', image: '🔧', tags: ['Volvo', 'Saab'] },
  { id: 9, name: 'Injecteur Siemens 5WS4', category: 'Injecteurs', price: 79, originalPrice: 110, rating: 4.4, reviews: 28, inStock: true, brand: 'Siemens', model: '5WS4', image: '⚙️', tags: ['Ford', 'Peugeot'] },
  { id: 10, name: 'Pompe VP44', category: 'Pompes', price: 450, originalPrice: 590, rating: 4.7, reviews: 15, inStock: true, brand: 'Bosch', model: 'VP44', image: '🔩', tags: ['BMW', 'Land Rover'] },
  { id: 11, name: 'Kit Joints Turbo', category: 'Kits', price: 29, originalPrice: 45, rating: 4.3, reviews: 156, inStock: true, brand: 'Generic', model: 'Universal', image: '🛠️', tags: ['Universal'] },
  { id: 12, name: 'Turbo Holset HE221W', category: 'Turbos', price: 529, originalPrice: 680, rating: 4.8, reviews: 42, inStock: true, brand: 'Holset', model: 'HE221W', image: '🔧', tags: ['Cummins', 'Iveco'] },
];

const categories = ['Tous', 'Turbos', 'Injecteurs', 'Pompes', 'Kits'];
const brands = ['Toutes', 'Garrett', 'Bosch', 'Denso', 'KKK', 'Delphi', 'Mitsubishi', 'Siemens', 'Holset'];
const sortOptions = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Meilleures notes' },
  { value: 'newest', label: 'Nouveautés' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'Tous';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState('Toutes');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
      const matchesBrand = selectedBrand === 'Toutes' || product.brand === selectedBrand;
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, selectedBrand, priceRange, sortBy]);

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

      {/* Hero Search Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Nos Produits</h1>
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit, une marque, un modèle..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-slate-900 placeholder-slate-500 focus:ring-4 focus:ring-blue-500/30 transition border border-slate-200"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-gray-300 mt-3">
              {filteredProducts.length} résultat{filteredProducts.length !== 1 ? 's' : ''} pour &quot;{searchQuery}&quot;
            </p>
          )}
        </div>
      </div>

      {/* Filters & Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-blue-500 transition md:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
            </button>
            <span className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredProducts.length}</span> produits trouvés
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2 pr-10 bg-white rounded-lg border border-slate-200 hover:border-blue-500 transition cursor-pointer text-slate-900"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex bg-white rounded-lg border border-slate-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
                <ShoppingCart className="w-4 h-4" />
                <span className="font-semibold">{cart.length}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-xl p-6 space-y-6 sticky top-24 border border-slate-200">
              <div className="flex items-center justify-between md:hidden">
                <h3 className="font-semibold text-gray-900">Filtres</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Catégorie</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${selectedCategory === cat ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                        {selectedCategory === cat && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="hidden"
                      />
                      <span className={`text-sm ${selectedCategory === cat ? 'text-blue-600 font-medium' : 'text-slate-600'}`}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Marque</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${selectedBrand === brand ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-400'}`}>
                        {selectedBrand === brand && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <input
                        type="radio"
                        name="brand"
                        value={brand}
                        checked={selectedBrand === brand}
                        onChange={() => setSelectedBrand(brand)}
                        className="hidden"
                      />
                      <span className={`text-sm ${selectedBrand === brand ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Prix</h3>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                    placeholder="Max"
                  />
                  <span className="text-gray-600">€</span>
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('Tous');
                  setSelectedBrand('Toutes');
                  setPriceRange({ min: 0, max: 1000 });
                  setSearchQuery('');
                }}
                className="w-full py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-slate-50 transition text-sm font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
                <button
                  onClick={() => {
                    setSelectedCategory('Tous');
                    setSelectedBrand('Toutes');
                    setPriceRange({ min: 0, max: 1000 });
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredProducts.map(product => (
                  <div 
                    key={product.id} 
                    className={`bg-white rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-xl border border-slate-200 ${viewMode === 'list' ? 'flex' : ''}`}
                  >
                    {/* Image - Link to detail */}
                    <Link 
                      href={`/produits/${product.id}`}
                      className={`${viewMode === 'list' ? 'w-48 shrink-0' : ''} relative h-48 bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center overflow-hidden block`}
                    >
                      <div className="text-6xl transform group-hover:scale-110 transition-transform duration-500">{product.image}</div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                          -{Math.round((product.originalPrice - product.price) / product.originalPrice * 100)}%
                        </span>
                        {!product.inStock && (
                          <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">
                            Rupture
                          </span>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition ${wishlist.includes(product.id) ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-50'}`}
                        >
                          <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{product.rating}</span>
                        <span className="text-sm text-gray-400">({product.reviews})</span>
                      </div>

                      <Link href={`/produits/${product.id}`}>
                        <h3 className="font-bold text-gray-900 mb-1 hover:text-blue-600 transition">{product.name}</h3>
                      </Link>
                      <p className="text-sm text-gray-500 mb-3">{product.brand} - {product.model}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-blue-600">{product.price}€</span>
                        <span className="text-sm text-gray-400 line-through">{product.originalPrice}€</span>
                      </div>

                      <div className="mt-auto space-y-2">
                        <Link
                          href={`/produits/${product.id}`}
                          className="w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Voir le produit
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                        {cart.includes(product.id) && (
                          <div className="w-full py-2 bg-green-100 text-green-700 rounded-lg text-center text-sm font-medium">
                            <Check className="w-4 h-4 inline mr-1" />
                            Dans le panier
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
