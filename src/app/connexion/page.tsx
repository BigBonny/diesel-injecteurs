'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { LogIn, UserPlus, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

export default function ConnexionPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await resp.json();
      if (!resp.ok) { setError(data.error || 'Erreur de connexion'); return; }
      localStorage.setItem('ps_user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('ps_user_changed'));
      router.push('/compte');
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }
    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstname: form.firstname,
          lastname: form.lastname,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) { setError(data.error || 'Erreur lors de la création du compte'); return; }
      localStorage.setItem('ps_user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('ps_user_changed'));
      setSuccess('Compte créé avec succès !');
      setTimeout(() => router.push('/compte'), 1000);
    } catch {
      setError('Erreur serveur. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex">
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  mode === 'login'
                    ? 'bg-[#1e2a4a] text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Connexion
              </button>
              <button
                onClick={() => { setMode('register'); setError(''); }}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  mode === 'register'
                    ? 'bg-[#1e2a4a] text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Créer un compte
              </button>
            </div>

            <div className="p-8">
              {/* Trust badge */}
              <div className="flex items-center gap-2 mb-6 p-3 bg-green-50 rounded-lg border border-green-100">
                <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-xs text-green-700 font-medium">Compte lié à votre espace PrestaShop</span>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {success}
                </div>
              )}

              {mode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-yellow-400 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mot de passe</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        placeholder="••••••••"
                        className="w-full px-4 py-3 pr-10 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-yellow-400 focus:outline-none transition"
                      />
                      <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-yellow-400 text-[#1e2a4a] font-bold rounded-lg hover:bg-yellow-300 transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                    Se connecter
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prénom</label>
                      <input
                        type="text"
                        name="firstname"
                        value={form.firstname}
                        onChange={handleChange}
                        required
                        placeholder="Jean"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-yellow-400 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom</label>
                      <input
                        type="text"
                        name="lastname"
                        value={form.lastname}
                        onChange={handleChange}
                        required
                        placeholder="Dupont"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-yellow-400 focus:outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-yellow-400 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mot de passe</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                        placeholder="Minimum 8 caractères"
                        className="w-full px-4 py-3 pr-10 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-yellow-400 focus:outline-none transition"
                      />
                      <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirmer le mot de passe</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg text-slate-800 text-sm focus:border-yellow-400 focus:outline-none transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-yellow-400 text-[#1e2a4a] font-bold rounded-lg hover:bg-yellow-300 transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                    Créer mon compte
                  </button>
                </form>
              )}

              <p className="mt-6 text-center text-xs text-slate-400">
                En créant un compte, vous acceptez nos{' '}
                <Link href="/cgv" className="text-[#1e2a4a] hover:underline">conditions générales</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
