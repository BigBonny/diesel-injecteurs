'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { User, Package, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';

interface PSUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export default function ComptePage() {
  const router = useRouter();
  const [user] = useState<PSUser | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('ps_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (!user) router.replace('/connexion');
  }, [user, router]);

  const handleLogout = () => {
    localStorage.removeItem('ps_user');
    window.dispatchEvent(new Event('ps_user_changed'));
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-[#1e2a4a] rounded-2xl p-6 mb-6 text-white flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center">
              <User className="w-7 h-7 text-[#1e2a4a]" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{user.firstname} {user.lastname}</h1>
              <p className="text-slate-300 text-sm">{user.email}</p>
            </div>
            <div className="ml-auto flex items-center gap-1 bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-300 text-xs font-semibold">Connecté</span>
            </div>
          </div>

          {/* Menu */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
            <Link
              href={`http://192.162.69.186/index.php?controller=history`}
              target="_blank"
              className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition border-b border-slate-100"
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm">Mes commandes</p>
                <p className="text-xs text-slate-400">Suivre et gérer vos commandes</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 bg-white rounded-2xl shadow-sm hover:bg-red-50 text-red-500 hover:text-red-600 transition font-semibold text-sm"
          >
            <LogOut className="w-5 h-5" />
            Se déconnecter
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
