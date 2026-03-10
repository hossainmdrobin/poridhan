'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/services/api';
import Button from '@/components/ui/Button';

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api
      .get<Order[]>('/orders')
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">Please log in to view orders</h2>
        <Link href="/login?redirect=/orders">
          <Button className="mt-6">Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <h1 className="mb-8 text-3xl font-bold text-neutral-900">My Orders</h1>
      {success && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">Order placed successfully!</div>
      )}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded bg-neutral-200" />
          ))}
        </div>
      ) : orders.length ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="block rounded-lg border border-neutral-200 p-4 transition hover:border-neutral-400"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm capitalize">
                    {order.status}
                  </span>
                  <span className="font-semibold">{formatPrice(order.total)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-neutral-600">No orders yet.</p>
      )}
    </motion.div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12">Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
