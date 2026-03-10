'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';

export default function AccountPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!token) router.replace('/login?redirect=/account');
  }, [token, router]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold">My Account</h1>
      <div className="mt-8 rounded-lg border p-6">
        <p><strong>Name:</strong> {user.name}</p>
        <p className="mt-2"><strong>Email:</strong> {user.email}</p>
        <p className="mt-2"><strong>Role:</strong> {user.role}</p>
      </div>
      <div className="mt-6 flex gap-4">
        <Link href="/orders"><Button variant="outline">My Orders</Button></Link>
      </div>
    </div>
  );
}
