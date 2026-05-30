'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  Search, ChevronDown, Heart, 
  SlidersHorizontal, X, Check, Grid3X3, List, Package
} from 'lucide-react';

interface PrestaShopProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  reference: string;
  link_rewrite: string;
  id_default_image: string;
  id_category_default: string;
  associations?: {
    images: Array<{ id: string }>;
  };
  images?: Array<{ id: string }>;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [allProducts, setAllProducts] = useState<PrestaShopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Get category and brand directly from URL
  const selectedCategory = searchParams.get('category') || 'Tous';
  const selectedBrand = searchParams.get('brand') || 'Toutes';

  // Sync searchQuery with URL params when they change (e.g., from navbar search)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryParam = selectedCategory && selectedCategory !== 'Tous' ? `&category=${selectedCategory}` : '';
        const brandParam = selectedBrand && selectedBrand !== 'Toutes' ? `&brand=${selectedBrand}` : '';
        const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
        const url = `/api/products?limit=500${categoryParam}${brandParam}${searchParam}`;
        console.log('Fetching products:', url);
        const startTime = Date.now();
        
        const response = await fetch(url);
        const duration = Date.now() - startTime;
        console.log(`API response time: ${duration}ms`);
        
        if (response.ok) {
          const data = await response.json();
          const products = data.products || [];
          console.log('Products received:', products.length);
          
          setAllProducts(products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [selectedCategory, selectedBrand, searchQuery]);

  // Extract brands and models from product names for hierarchical filtering
  const brandModelStructure = useMemo(() => {
    const structure: Record<string, Record<string, number>> = {};
    
    allProducts.forEach(product => {
      const name = product.name.toLowerCase();
      
      // Extract brand from product name
      let brand = 'Autres';
      if (name.includes('renault')) brand = 'Renault';
      else if (name.includes('audi')) brand = 'Audi';
      else if (name.includes('bmw')) brand = 'BMW';
      else if (name.includes('peugeot')) brand = 'Peugeot';
      else if (name.includes('citroën') || name.includes('citroen')) brand = 'Citroën';
      else if (name.includes('volkswagen') || name.includes('vw')) brand = 'Volkswagen';
      else if (name.includes('mercedes')) brand = 'Mercedes';
      else if (name.includes('ford')) brand = 'Ford';
      else if (name.includes('opel')) brand = 'Opel';
      else if (name.includes('toyota')) brand = 'Toyota';
      else if (name.includes('hyundai')) brand = 'Hyundai';
      else if (name.includes('kia')) brand = 'Kia';
      else if (name.includes('mazda')) brand = 'Mazda';
      else if (name.includes('nissan')) brand = 'Nissan';
      else if (name.includes('honda')) brand = 'Honda';
      else if (name.includes('volvo')) brand = 'Volvo';
      else if (name.includes('alfa romeo') || name.includes('alfa')) brand = 'Alfa Romeo';
      else if (name.includes('fiat')) brand = 'Fiat';
      else if (name.includes('seat')) brand = 'Seat';
      else if (name.includes('skoda')) brand = 'Skoda';
      else if (name.includes('suzuki')) brand = 'Suzuki';
      else if (name.includes('mitsubishi')) brand = 'Mitsubishi';
      else if (name.includes('chevrolet')) brand = 'Chevrolet';
      else if (name.includes('dodge')) brand = 'Dodge';
      else if (name.includes('jeep')) brand = 'Jeep';
      else if (name.includes('land rover')) brand = 'Land Rover';
      else if (name.includes('mini')) brand = 'Mini';
      else if (name.includes('smart')) brand = 'Smart';
      else if (name.includes('saab')) brand = 'Saab';
      else if (name.includes('jaguar')) brand = 'Jaguar';
      else if (name.includes('iveco')) brand = 'Iveco';
      else if (name.includes('subaru')) brand = 'Subaru';
      else if (name.includes('porsche')) brand = 'Porsche';
      else if (name.includes('rover')) brand = 'Rover';
      else if (name.includes('lotus')) brand = 'Lotus';
      else if (name.includes('ds')) brand = 'DS';
      else if (name.includes('pontiac')) brand = 'Pontiac';
      else if (name.includes('infiniti')) brand = 'Infiniti';
      else if (name.includes('hitachi')) brand = 'Hitachi';
      else if (name.includes('isuzu')) brand = 'Isuzu';
      else if (name.includes('ferrari')) brand = 'Ferrari';
      else if (name.includes('dacia')) brand = 'Dacia';
      else if (name.includes('lancia')) brand = 'Lancia';
      else if (name.includes('chrysler')) brand = 'Chrysler';
      else if (name.includes('ssang-yong')) brand = 'Ssang-Yong';
      else if (name.includes('daihatsu')) brand = 'Daihatsu';
      else if (name.includes('cadillac')) brand = 'Cadillac';
      else if (name.includes('mercury')) brand = 'Mercury';
      else if (name.includes('lexus')) brand = 'Lexus';
      
      // Extract model from product name (simplified)
      let model = 'Autres';
      const modelPatterns = [
        'clio', 'megane', 'laguna', 'scenic', 'espace', 'trafic', 'kangoo', 'master', 'vel satis', 'twingo', 'mascott', 'modus', 'koleos', 'grand modus', 'avantime', 'safrane', 'captur', 'sofim', 'r 19', 'messenger', 'r 11', 'r 5', 'r 25', 'r 21',
        'a3', 'a4', 'a5', 'a6', 'a8', 'a2', 'a1', 'tt',
        'série 1', 'série 3', 'série 5', 'série 7', 'x3', 'x5', 'x1', 'x6', 'm3', 'm5', 'm6', 'z4', 'm4', 'm550d', 'm140 i', 'm240 i', 'x4', 'm135i', 'm2', 'm235i',
        '307', '407', '308', '207', '807', '607', '206', '3008', '5008', '406', 'partner', '4008', 'boxer', 'expert', '1007', '208', '107', 'j5', '806', '4007', 'rcz', '508', '306', 'bipper', '405', '605', '312', '408', '313', '310', '311', '205', '2008', '309', 'rifter', 'traveller',
        'c4', 'picasso', 'berlingo', 'c8', 'c5', 'aircross', 'xsara', 'c3', 'jumpy', 'c1', 'crosser', 'jumper', 'c6', 'c2', 'ds3', 'nemo', 'c25', 'ds 3', 'xantia', 'evasion', 'ds 5', 'ds 7', 'zx', 'xm', 'ds 4', 'bx', 'spacetourer',
        'rav4', 'yaris', 'corolla', 'auris', 'previa', 'avensis', 'landcruiser', 'hilux', 'picnic', 'verso', 'hiace', 'supra', 'camry', '4 runner', 'celica', 'caldina', 'ritz', 'iq', 'proace',
        'golf', 'touran', 'tiguan', 'passat', 'transporter', 'touareg', 'scirocco', 'caddy', 'bora', 'eos', 'sharan', 'beetle', 'polo', 'crafter', 'amarok', 'jetta', 'lt', 'lupo', 'fox', 'parati', 'cc', 'teramont', 'arteon', 'phaeton', 'vento', 'l80', 'marine',
        'tucson', 'ix35', 'santa fe', 'h-1', 'sonata', 'i30', 'trajet', 'getz', 'starex', 'matrix', 'terracan', 'coupe s', 'mighty', 'van', 'grandeur', 'xg', 'elantra', 'accent', 'gallopper', 'veloster', 'ix55', 'veracruz', 'i20',
        'astra', 'zafira', 'meriva', 'vectra', 'vivaro', 'corsa', 'insignia', 'antara', 'signum', 'frontera', 'combo', 'movano', 'omega', 'grandland x', 'agila', 'speedster', 'sintra', 'adam', 'cascada', 'mokka', 'crossland x', 'kadett', 'monterey', 'campo', 'calibra', 'rekord', 'senator', 'tigra',
        'qashqai', 'x-trail', 'juke', 'navara', 'atleon', 'pathfinder', 'terrano', 'patrol', 'almera', 'primera', 'cabstar', 'trade', 'interstar', 'micra', '200sx', 'sunny', '300zx', 'murano', 'evalia', 'nv200', 'primastar', 'nv400', 'nv300', 'gt-r',
        's40', 'c30', 'v70', 'v50', 'xc90', 'c70', 'xc70', 's60', 's80', 'v60', 'v40', '240', '760', '765', '940', '960', '740', '780', '480', '850', 's70', 'cross country',
        'c-max', 'focus', 'transit', 'fiesta', 'kuga', 's-max', 'galaxy', 'mondeo', 'fusion', 'maverick', 'ranger', 'tourneo', 'f450', 'f550', 'escort', 'orion', 'sierra', 'scorpio', 'probe', 'ka', 'mustang',
        '6', '3', '5', '2', 'premacy', 'cx-5', 'cx-7', '626', '323', 'mpv', 'b2500',
        'altea', 'leon', 'ibiza', 'alhambra', 'toledo', 'cordoba', 'exeo', 'ateca', 'arosa',
        'vitara', 'sx4', 'ignis', 'swift', 'baleno', 'samurai', 'splash', 'wagon r+', 'jimny', 'liana',
        'classe m', 'vito', 'classe c', 'classe e', 'sprinter', 'viano', 'classe s', 'classe r', 'classe b', 'classe a', 'glk', 'gt', 'cls', 'vaneo', 'classe 5', 'classe g', 'classe gl', 'classe cl', 'amg gt', 'classe sl', 'gle',
        'range rover', 'freelander', 'defender', 'discovery', 'evoque', 'velar',
        '300c', 'voyager', 'pt cruiser', 'sebring', 'le baron',
        'logan', 'duster', 'sandero', 'lodgy',
        'civic', 'accord', 'cr-5',
        'grande punto', 'stilo', 'doblo', 'bravo', 'scudo', 'ulysse', 'sedici', 'panda', 'linea', '500', 'multipla', 'punto', 'ducato', 'fiorino', 'croma', 'idea', 'coupe', 'marea', 'brava', 'tempra', 'uno', 'palio', 'regata', 'ritmo', 'tipo', 'argenta', 'cinquecento', 'viaggio', 'freemont', 'talento',
        'asx', 'carisma', 'l200', 'space star', 'pajero', 'grandis', 'lancer', 'galant', 'canter', 'colt', 'l 300', 'space gear', 'space wagon', '3000 gt', 'eclipse', 'starion', 'outlander',
        'captiva', 'cruze', 'pick-up', 'lacetti', 'nubira', 'orlando', 'aveo', 'express', 'silverado', 'trax',
        'journey', 'caliber', 'avenger', 'ram', 'neon', 'sprinter', 'dart',
        'sorento', 'sportage', 'cerato', 'carens', 'ceed', 'picanto', 'rio', 'magentis', 'retona', 'soul', 'carnival', 'pregio', 'optima', 'stinger',
        '9-3', '9-5', '9000', '900',
        'grand cherokee', 'cherokee', 'patriot', 'renegade', 'compass', 'wrangler', 'liberty',
        'superb', 'octavia', 'yeti', 'fabia', 'roomster', 'rapid', 'karoq', 'kodiaq',
        'delta', 'phedra', 'musa', 'kappa', 'zeta', 'thema', 'dedra', 'ypsilon', 'prisma', 'lybra', 'thesis', 'y10',
        'x type', 's type', 'xf', 'f-pace', 'xe', 'xj',
        'daily', 'eurotech',
        'forester', 'impreza', 'outback', 'legacy', 'sedan',
        'forfour', 'fortwo',
        'kyron', 'rexton', 'musso', 'rodius', 'actyon', 'korando',
        'charade', 'rocky', 'mira', 'move', 'copen',
        'bls', 'srx',
        'gs', 'nx', 'rc', 'is',
        '718', 'cayenne', 'panamera', '930', '997', '991', '996', '993', '924', '956', '944', '959', '935', '964',
        '200', '220', '420', '600', '620', '75', 'mg r75', 'mg zt',
        'esprit',
        'solstice', '530 d', 'b5',
        'q50', 'q60',
        'ex200', 'ex120', 'ex150', 'ex300', 'sh220', 'zx330', 'zx350', 'zx450', 'lx160', 'sh300', 'zx600', 'zx800', 'zx850', 'lx210e', 'zx200', 'sh330', 'sh350', 'zx140w', 'zx160lc', 'zx120', 'zx160', 'ex220', 'ex270',
        'trooper', 'bighorn', 'd-max', 'kb 300', 'rodeo', 'nkr', 'npr',
        'f40'
      ];
      
      for (const pattern of modelPatterns) {
        if (name.includes(pattern)) {
          model = pattern.charAt(0).toUpperCase() + pattern.slice(1);
          break;
        }
      }
      
      if (!structure[brand]) {
        structure[brand] = {};
      }
      if (!structure[brand][model]) {
        structure[brand][model] = 0;
      }
      structure[brand][model]++;
    });
    
    return structure;
  }, [allProducts]);

  const brands = Object.keys(brandModelStructure).sort();
  const modelsForSelectedBrand = selectedBrand !== 'Toutes' ? Object.keys(brandModelStructure[selectedBrand] || {}).sort() : [];

  const sortOptions = [
    { value: 'relevance', label: 'Pertinence' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Meilleures notes' },
    { value: 'newest', label: 'Nouveautés' },
  ];

  // Filter and sort products (brand is already filtered by API)
  const filteredProducts = useMemo(() => {
    const result = allProducts.filter(product => {
      const price = parseFloat(product.price) || 0;
      
      // Apply client-side search filtering for all fields including compatible_references
      // Server only searches name, reference, supplier_reference
      // We need to filter by compatible_references client-side
      let matchesSearch = true;
      
      if (searchQuery !== '') {
        const searchLower = searchQuery.toLowerCase();
        // Extract base pattern for fuzzy matching (e.g., "03L130270B" -> "03L13027")
        const basePattern = searchLower.length >= 8 ? searchLower.substring(0, 8) : searchLower;
        // Extract suffix letter if present (e.g., "03L130270B" -> "b")
        const suffixMatch = searchLower.match(/[a-z]$/);
        const suffix = suffixMatch ? suffixMatch[0] : null;
        
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const refMatch = product.reference ? product.reference.toLowerCase().includes(searchLower) : false;
        const supplierRefMatch = (product as any).supplier_reference ? (product as any).supplier_reference.toLowerCase().includes(searchLower) : false;
        // Use base pattern + suffix for fuzzy matching in compatible_references
        const compatibleRefsMatch = (product as any).compatible_references && Array.isArray((product as any).compatible_references) 
          ? (product as any).compatible_references.some((ref: string) => {
              const refLower = ref.toLowerCase();
              // Must contain base pattern AND end with suffix if suffix was specified
              const hasBase = refLower.includes(basePattern);
              const hasSuffix = suffix ? refLower.endsWith(suffix) : true;
              return hasBase && hasSuffix;
            })
          : false;
        matchesSearch = nameMatch || refMatch || supplierRefMatch || compatibleRefsMatch;
      }
      
      const matchesPrice = price >= priceRange.min && price <= priceRange.max;
      
      return matchesSearch && matchesPrice;
    });

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => parseFloat(a.price || '0') - parseFloat(b.price || '0'));
        break;
      case 'price-desc':
        result.sort((a, b) => parseFloat(b.price || '0') - parseFloat(a.price || '0'));
        break;
      default:
        break;
    }

    return result;
  }, [allProducts, searchQuery, priceRange, sortBy, searchParams]);

  const toggleWishlist = (productId: string) => {
    const id = parseInt(productId);
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(i => i !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const getImageUrl = (product: PrestaShopProduct): string => {
    // Check id_default_image first
    if (product.id_default_image) {
      return `/api/product-image/${product.id}/${product.id_default_image}`;
    }
    // Check associations.images (from old PrestaShop format or scraped products)
    else if (product.associations?.images && product.associations.images.length > 0) {
      const imageId = product.associations.images[0].id;
      // Check if it's an external URL or local asset path
      if (imageId && (imageId.startsWith('http') || imageId.startsWith('/'))) {
        return imageId;
      }
      return `/api/product-image/${product.id}/${imageId}`;
    }
    // Check images array directly (from Supabase)
    else if (product.images && product.images.length > 0) {
      const imageId = product.images[0].id;
      // Check if it's an external URL or local asset path
      if (imageId && (imageId.startsWith('http') || imageId.startsWith('/'))) {
        return imageId;
      }
      return `/api/product-image/${product.id}/${imageId}`;
    }
    // Fallback: fetch image directly from PrestaShop
    else {
      return `/api/product-image-direct/${product.id}`;
    }
  };

  const getProductUrl = (product: PrestaShopProduct): string => {
    return `/produits/${product.id}`;
  };

  const formatPrice = (price: string): string => {
    const num = parseFloat(price) || 0;
    return `${num.toFixed(2)} €`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      {/* Hero Search Banner */}
      <div className="bg-[#1e2a4a] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Nos Produits</h1>
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit, une marque, un modèle..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl text-slate-900 placeholder-slate-500 focus:ring-4 focus:ring-yellow-400/30 transition border border-slate-200"
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
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 hover:border-yellow-400 transition md:hidden"
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
                className="appearance-none px-4 py-2 pr-10 bg-white rounded-lg border border-slate-200 hover:border-yellow-400 transition cursor-pointer text-slate-900"
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
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-yellow-100 text-yellow-700' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-yellow-100 text-yellow-700' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
            <div className="bg-white rounded-xl p-6 space-y-6 sticky top-24 border border-slate-200">
              <div className="flex items-center justify-between md:hidden">
                <h3 className="font-semibold text-gray-900">Filtres</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Brand Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Marque</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${selectedBrand === brand ? 'bg-yellow-400 border-yellow-400' : 'border-slate-300 group-hover:border-yellow-400'}`}>
                        {selectedBrand === brand && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <input
                        type="radio"
                        name="brand"
                        value={brand}
                        checked={selectedBrand === brand}
                        onChange={() => router.push(`/produits?category=${selectedCategory}&brand=${brand}`)}
                        className="hidden"
                      />
                      <span className={`text-sm ${selectedBrand === brand ? 'text-yellow-700 font-medium' : 'text-gray-600'}`}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Model Filter (shows when brand is selected) */}
              {selectedBrand !== 'Toutes' && modelsForSelectedBrand.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Modèle</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {modelsForSelectedBrand.map(model => (
                      <label key={model} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${selectedCategory === model ? 'bg-yellow-400 border-yellow-400' : 'border-slate-300 group-hover:border-yellow-400'}`}>
                          {selectedCategory === model && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <input
                          type="radio"
                          name="model"
                          value={model}
                          checked={selectedCategory === model}
                          onChange={() => router.push(`/produits?category=${model}&brand=${selectedBrand}`)}
                          className="hidden"
                        />
                        <span className={`text-sm ${selectedCategory === model ? 'text-yellow-700 font-medium' : 'text-gray-600'}`}>{model}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

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
                  router.push('/produits');
                  setPriceRange({ min: 0, max: 1000 });
                  setSearchQuery('');
                }}
                className="w-full py-2 text-[#1e2a4a] border border-yellow-400 rounded-lg hover:bg-yellow-50 transition text-sm font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
                <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche</p>
                <button
                  onClick={() => {
                    router.push('/produits');
                    setPriceRange({ min: 0, max: 1000 });
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 bg-yellow-400 text-[#1e2a4a] rounded-lg hover:bg-yellow-300 transition"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                {/* No category selected */}
                {!loading && !selectedCategory && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Sélectionnez une catégorie</h2>
                    <p className="text-slate-600 mb-4">Utilisez le menu de navigation pour choisir entre Turbos, Injecteurs ou Kit CHRA</p>
                    <div className="flex gap-4">
                      <Link href="/produits?category=turbos" className="px-6 py-3 bg-yellow-400 text-[#1e2a4a] rounded-lg hover:bg-yellow-300 transition font-semibold">
                        Turbos
                      </Link>
                      <Link href="/produits?category=injecteurs" className="px-6 py-3 bg-yellow-400 text-[#1e2a4a] rounded-lg hover:bg-yellow-300 transition font-semibold">
                        Injecteurs
                      </Link>
                      <Link href="/produits?category=kit-turbo-chra" className="px-6 py-3 bg-yellow-400 text-[#1e2a4a] rounded-lg hover:bg-yellow-300 transition font-semibold">
                        Kit CHRA
                      </Link>
                    </div>
                  </div>
                )}
                
                {/* Products Grid */}
                {!loading && filteredProducts.length > 0 && (
                  <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                    {filteredProducts.map(product => (
                      <div 
                        key={product.id} 
                        className={`bg-white rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-xl border border-slate-200 ${viewMode === 'list' ? 'flex' : ''}`}
                      >
                        {/* Image - Link to detail */}
                        <Link 
                          href={getProductUrl(product)}
                          className={`${viewMode === 'list' ? 'w-48 shrink-0' : ''} relative h-48 bg-linear-to-br from-slate-200 to-slate-100 flex items-center justify-center overflow-hidden`}
                        >
                          {getImageUrl(product) ? (
                            <img 
                              src={getImageUrl(product)} 
                              alt={product.name}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Package className="w-20 h-20 text-slate-400 transform group-hover:scale-110 transition-transform duration-500" />
                          )}

                          {/* Quick Actions */}
                          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition ${wishlist.includes(parseInt(product.id)) ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-50'}`}
                            >
                              <Heart className={`w-5 h-5 ${wishlist.includes(parseInt(product.id)) ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </Link>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col">
                          <Link href={getProductUrl(product)}>
                            <h3 className="font-bold text-gray-900 mb-1 hover:text-yellow-600 transition line-clamp-2">{product.name}</h3>
                          </Link>
                          
                          {product.reference && (
                            <p className="text-sm text-gray-500 mb-2">Ref: {product.reference}</p>
                          )}

                          <div className="mt-auto pt-3 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-[#1e2a4a]">{formatPrice(product.price)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductsContent />
    </Suspense>
  );
}
