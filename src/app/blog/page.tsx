'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { Calendar, Clock, ArrowUpRight, Search, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface BlogPost {
  id_leoblog_post: number;
  meta_title: string;
  short_description: string;
  content: string;
  link_rewrite: string;
  date_add: string;
  date_formatted: string;
  category_name: string | null;
  category_slug: string | null;
  image_url: string | null;
  read_time: string;
}

const LIMIT = 12;

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/blog?page=${page}&limit=${LIMIT}`);
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'Erreur API');
        setPosts(data.posts || []);
        setTotal(data.total || 0);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Impossible de charger les articles');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  const filtered = posts.filter(p =>
    searchQuery === '' ||
    p.meta_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.short_description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#1e2a4a]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-size-[60px_60px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">Actualités & Conseils</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mt-4">
              Notre <span className="text-yellow-400">Blog</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mt-6 max-w-2xl mx-auto">
              Découvrez nos conseils d&apos;experts sur les turbos, injecteurs et l&apos;entretien de votre moteur diesel.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:border-yellow-400 focus:outline-none transition"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400" />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center py-20 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <p className="text-slate-600 font-medium mb-1">Impossible de charger les articles</p>
              <p className="text-slate-400 text-sm mb-6">{error}</p>
              <button
                onClick={() => setPage(p => p)}
                className="px-6 py-2 bg-yellow-400 text-[#1e2a4a] rounded-xl font-semibold hover:bg-yellow-300 transition"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Posts grid */}
          {!loading && !error && (
            <>
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filtered.map((post) => (
                    <article
                      key={post.id_leoblog_post}
                      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/10 flex flex-col"
                    >
                      {/* Image */}
                      <div className="h-48 bg-gradient-to-br from-[#1e2a4a]/10 to-yellow-400/10 flex items-center justify-center relative overflow-hidden shrink-0">
                        {post.image_url ? (
                          <img
                            src={post.image_url}
                            alt={post.meta_title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <span className="text-6xl font-bold text-[#1e2a4a]/10 select-none">
                            {post.id_leoblog_post}
                          </span>
                        )}
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        {/* Category Badge */}
                        {post.category_name && (
                          <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full mb-3 w-fit">
                            {post.category_name}
                          </span>
                        )}

                        {/* Title */}
                        <h2 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                          {post.meta_title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">
                          {post.short_description}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{post.date_formatted}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{post.read_time}</span>
                          </div>
                        </div>

                        {/* Read More */}
                        <Link
                          href={`https://injection-diesel.com/fr/blog/${post.id_leoblog_post}-${post.link_rewrite}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-yellow-600 font-medium text-sm group-hover:gap-3 transition-all"
                        >
                          <span>Lire l&apos;article</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-slate-500 text-lg">Aucun article trouvé.</p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-4 text-yellow-600 hover:underline"
                    >
                      Effacer la recherche
                    </button>
                  )}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && !searchQuery && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-slate-500 hover:text-slate-900 transition disabled:opacity-40"
                  >
                    Précédent
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg font-medium transition border ${
                        p === page
                          ? 'bg-yellow-400 text-[#1e2a4a] border-yellow-400'
                          : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-slate-500 hover:text-slate-900 transition disabled:opacity-40"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-[#1e2a4a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Restez informé</h2>
          <p className="text-slate-300 mb-8">
            Recevez nos derniers articles et conseils d&apos;entretien directement dans votre boîte mail.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:border-yellow-400 focus:outline-none transition"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-yellow-400 text-[#1e2a4a] rounded-xl font-semibold hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/30 transition whitespace-nowrap"
            >
              S&apos;abonner
            </button>
          </form>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
