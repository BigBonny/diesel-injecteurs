'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import { Calendar, Clock, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

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
  author_name: string | null;
}

export default function BlogPostPage() {
  const params = useParams();
  const id = params?.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/blog/${id}`);
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || 'Article introuvable');
        setPost(data.post);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Impossible de charger l\'article');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-yellow-600 transition mb-8 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>

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
              <p className="text-slate-600 font-medium mb-1">Article introuvable</p>
              <p className="text-slate-400 text-sm mb-6">{error}</p>
              <Link href="/blog" className="px-6 py-2 bg-yellow-400 text-[#1e2a4a] rounded-xl font-semibold hover:bg-yellow-300 transition">
                Retour au blog
              </Link>
            </div>
          )}

          {/* Post content */}
          {!loading && !error && post && (
            <article className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              {/* Cover image */}
              {post.image_url && (
                <div className="h-64 sm:h-80 overflow-hidden">
                  <img
                    src={post.image_url}
                    alt={post.meta_title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }}
                  />
                </div>
              )}

              <div className="p-6 sm:p-10">
                {/* Category */}
                {post.category_name && (
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full mb-4">
                    {post.category_name}
                  </span>
                )}

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                  {post.meta_title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date_formatted}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{post.read_time} de lecture</span>
                  </div>
                  {post.author_name && (
                    <span className="text-slate-500">Par <strong className="text-slate-700">{post.author_name}</strong></span>
                  )}
                </div>

                {/* Content */}
                <div
                  className="blog-content text-slate-600 leading-relaxed text-base sm:text-lg"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </article>
          )}
        </div>
      </div>

      <Footer />
      <ChatWidget />
    </div>
  );
}
