'use client';

import Navigation from '@/components/Navigation';
import { Calendar, User, ArrowUpRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const blogPosts = [
  {
    id: 1,
    title: 'Problèmes d\'injecteurs et de turbo : symptômes et diagnostics',
    excerpt: 'Apprenez à identifier les signes avant-coureurs des problèmes d\'injecteurs et de turbo. Nos experts vous expliquent comment diagnostiquer ces pannes courantes.',
    author: 'Rachid Goubi',
    date: '15 Jan 2025',
    category: 'Conseils',
    readTime: '5 min'
  },
  {
    id: 2,
    title: 'Capteur de pression d\'admission : rôle, soin et remplacement',
    excerpt: 'Le capteur de pression d\'admission est essentiel pour le bon fonctionnement de votre moteur. Découvrez son rôle et comment l\'entretenir.',
    author: 'Emanuel Abizimi',
    date: '12 Jan 2025',
    category: 'Conseils',
    readTime: '4 min'
  },
  {
    id: 3,
    title: 'La pompe à carburant : rôle, pannes possibles et coût',
    excerpt: 'La pompe à carburant est le cœur du système d\'alimentation. Comprenez son fonctionnement et les signes de défaillance à surveiller.',
    author: 'Emanuel Abizimi',
    date: '10 Jan 2025',
    category: 'Conseils',
    readTime: '6 min'
  },
  {
    id: 4,
    title: 'Comment réaliser l\'équilibrage d\'un turbo ?',
    excerpt: 'L\'équilibrage est crucial pour la durée de vie de votre turbo. Nos experts vous expliquent cette procédure technique essentielle.',
    author: 'Emanuel Abizimi',
    date: '8 Jan 2025',
    category: 'Conseils',
    readTime: '7 min'
  },
  {
    id: 5,
    title: 'Que faire si votre véhicule émet une odeur d\'essence ?',
    excerpt: 'Une odeur d\'essence anormale peut indiquer une fuite. Découvrez les causes possibles et les solutions pour votre sécurité.',
    author: 'Emanuel Abizimi',
    date: '5 Jan 2025',
    category: 'Conseils',
    readTime: '4 min'
  },
  {
    id: 6,
    title: 'Comprendre le mode dégradé du moteur : origines, conséquences et solutions efficaces',
    excerpt: 'Le mode dégradé protège votre moteur mais limite ses performances. Apprenez à identifier les causes et résoudre le problème.',
    author: 'Emanuel Abizimi',
    date: '3 Jan 2025',
    category: 'Conseils',
    readTime: '8 min'
  },
  {
    id: 7,
    title: 'Calamine dans les injecteurs : les informations clés à savoir',
    excerpt: 'La calamine peut obstruer vos injecteurs et affecter les performances. Découvrez comment prévenir et traiter ce problème.',
    author: 'Emanuel Abizimi',
    date: '1 Jan 2025',
    category: 'Conseils',
    readTime: '5 min'
  },
  {
    id: 8,
    title: 'Tout comprendre sur l\'intercooler : rôle, maintenance et prix',
    excerpt: 'L\'intercooler améliore l\'efficacité de votre turbo. Nos experts vous expliquent son fonctionnement et son entretien.',
    author: 'Emanuel Abizimi',
    date: '28 Déc 2024',
    category: 'Conseils',
    readTime: '6 min'
  }
];

const categories = ['Tous', 'Conseils', 'Turbos', 'Injecteurs', 'Entretien'];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-[#fbbf24] via-[#2d4a6f] to-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Actualités & Conseils</span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mt-4">
              Notre{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Blog
              </span>
            </h1>
            <p className="text-xl text-slate-400 mt-6 max-w-2xl mx-auto">
              Découvrez nos conseils d&apos;experts sur les turbos, injecteurs et l&apos;entretien de votre moteur diesel.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article 
                key={post.id}
                className="group bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer" />
                  <span className="text-6xl font-bold text-blue-500/20">{post.id}</span>
                </div>

                <div className="p-6">
                  {/* Category Badge */}
                  <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full mb-4">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  {/* Read More */}
                  <button className="flex items-center gap-2 text-blue-400 font-medium group-hover:gap-3 transition-all">
                    <span>Lire l&apos;article</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">Aucun article trouvé pour votre recherche.</p>
              <button 
                onClick={() => {setSearchQuery(''); setSelectedCategory('Tous');}}
                className="mt-4 text-blue-400 hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-12">
            <button className="px-4 py-2 text-slate-400 hover:text-white transition">
              Précédent
            </button>
            <button className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium">
              1
            </button>
            <button className="w-10 h-10 bg-slate-900 text-slate-400 hover:text-white rounded-lg font-medium transition">
              2
            </button>
            <button className="w-10 h-10 bg-slate-900 text-slate-400 hover:text-white rounded-lg font-medium transition">
              3
            </button>
            <span className="text-slate-500">...</span>
            <button className="w-10 h-10 bg-slate-900 text-slate-400 hover:text-white rounded-lg font-medium transition">
              12
            </button>
            <button className="px-4 py-2 text-slate-400 hover:text-white transition">
              Prochain
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Restez informé</h2>
          <p className="text-slate-400 mb-8">
            Recevez nos derniers articles et conseils d&apos;entretien directement dans votre boîte mail.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-6 py-4 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition whitespace-nowrap"
            >
              S&apos;abonner
            </button>
          </form>
          <p className="text-slate-500 text-sm mt-4">
            Vous pouvez vous désinscrire à tout moment.
          </p>
        </div>
      </section>
    </div>
  );
}
