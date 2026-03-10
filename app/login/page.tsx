'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post<{ user: { id: string; name: string; email: string; role: string }; token: string }>('/auth/login', { email, password });
      setAuth(
        { id: res.user.id, name: res.user.name, email: res.user.email, role: res.user.role as 'admin' | 'seller' | 'customer' },
        res.token
      );
      router.push(redirect);
    } catch (err: unknown) {
      setError((err as Error).message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-16"
    >
      <h1 className="text-3xl font-bold text-neutral-900">Sign In</h1>
      <p className="mt-2 text-neutral-600">Welcome back. Sign in to your account.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && <p className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-neutral-900 underline">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-16">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
