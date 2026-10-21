'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Bot, ArrowRight, Sparkles, ShieldCheck, UserCheck } from 'lucide-react';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('student@kite.test');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid login credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (targetEmail: string, role: UserRole) => {
    setIsSubmitting(true);
    await login(targetEmail, role);
    if (role === 'teacher') router.push('/teacher/dashboard');
    else if (role === 'school_admin') router.push('/school/dashboard');
    else if (role === 'admin') router.push('/admin');
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-500/20">
            <Bot className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Sign In to ProjectVerse</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your practical robotics, IoT, and coding workspaces
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">Password</label>
              <a href="#" className="text-cyan-400 hover:underline text-[11px]">Forgot password?</a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In to Workspace'}
          </button>
        </form>

        {/* Quick Demo Personas */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
            One-Click Demo Personas:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('student@kite.test', 'student')}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition-colors"
            >
              <div className="font-bold text-white">🎓 Student</div>
              <div className="text-[10px] text-slate-400">Aarav (Class 8)</div>
            </button>
            <button
              onClick={() => handleQuickLogin('teacher@kite.test', 'teacher')}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition-colors"
            >
              <div className="font-bold text-white">👩‍🏫 Teacher</div>
              <div className="text-[10px] text-slate-400">Priya Raman</div>
            </button>
            <button
              onClick={() => handleQuickLogin('schooladmin@kite.test', 'school_admin')}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition-colors"
            >
              <div className="font-bold text-white">🏫 School Admin</div>
              <div className="text-[10px] text-slate-400">Vikram Seth</div>
            </button>
            <button
              onClick={() => handleQuickLogin('admin@kite.test', 'admin')}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-left transition-colors"
            >
              <div className="font-bold text-white">⚡ KITE Admin</div>
              <div className="text-[10px] text-slate-400">Platform HQ</div>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-cyan-400 font-semibold hover:underline">
            Register Student Account
          </Link>
        </div>
      </div>
    </div>
  );
}
