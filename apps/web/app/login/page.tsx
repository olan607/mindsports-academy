'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setConfirmMessage(null);
    setLoading(true);

    const { error } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (mode === 'signup') {
      setConfirmMessage('Check your email to confirm your account, then log in.');
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6">
      <h1 className="font-display mb-1 text-2xl text-academy-gold">MindSports Academy</h1>
      <p className="mb-8 text-sm text-white/60">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-4 rounded-xl border border-white/10 bg-academy-charcoal p-6">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-academy-navy px-3 py-2 text-sm text-academy-ivory outline-none focus:border-academy-gold"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-white/50">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-academy-navy px-3 py-2 text-sm text-academy-ivory outline-none focus:border-academy-gold"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {confirmMessage && <p className="text-sm text-academy-goldLight">{confirmMessage}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-academy-gold px-4 py-2 text-sm font-semibold text-academy-navy transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Working...' : mode === 'login' ? 'Log in' : 'Sign up'}
        </button>
      </form>

      <button
        onClick={() => {
          setMode(mode === 'login' ? 'signup' : 'login');
          setError(null);
          setConfirmMessage(null);
        }}
        className="mt-4 text-xs text-white/50 underline"
      >
        {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
      </button>
    </main>
  );
}
