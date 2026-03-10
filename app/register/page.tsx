'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post<{ user: { id: string; name: string; email: string; role: string }; token: string }>('/auth/register', { name, email, password });
      setAuth(
        { id: res.user.id, name: res.user.name, email: res.user.email, role: res.user.role as 'admin' | 'seller' | 'customer' },
        res.token
      );
      router.push('/');
    } catch (err: unknown) {
      setError((err as Error).message || 'Registration failed');
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
      <h1 className="text-3xl font-bold text-neutral-900">Create Account</h1>
      <p className="mt-2 text-neutral-600">Join Poridhan for the best shopping experience.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && <p className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          Create Account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-neutral-900 underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
