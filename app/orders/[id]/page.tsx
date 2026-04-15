'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetOrderByIdQuery } from '@/store/api';
import Button from '@/components/ui/Button';

interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  total: number;
  status: string;
  shippingAddress: { name: string; phone: string; address: string; city: string };
  createdAt: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { token } = useAuthStore();
  const { data: order, isLoading } = useGetOrderByIdQuery(orderId ?? skipToken, {
    skip: !token || !orderId,
  });

  if (!token) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">Please log in</h2>
        <Link href="/login">
          <Button className="mt-6">Login</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-12">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">Order not found</h2>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <h1 className="mb-8 text-3xl font-bold">Order {order.orderNumber}</h1>
      <p className="text-neutral-500">
        Placed on {new Date(order.createdAt).toLocaleDateString()}
      </p>
      <span className="mt-2 inline-block rounded-full bg-neutral-100 px-3 py-1 text-sm capitalize">
        {order.status}
      </span>

      <div className="mt-8 space-y-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4 rounded border p-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-neutral-100">
              <Image
                src={item.image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200'}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-neutral-500">Size: {item.size} × {item.quantity}</p>
            </div>
            <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount {order.discountCode && `(${order.discountCode})`}</span>
            <span>-{formatPrice(order.discount)}</span>
          </div>
        )}
        <div className="mt-2 flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-neutral-50 p-4">
        <h3 className="font-semibold">Shipping Address</h3>
        <p>{order.shippingAddress.name}</p>
        <p>{order.shippingAddress.phone}</p>
        <p>{order.shippingAddress.address}</p>
        <p>{order.shippingAddress.city}</p>
      </div>

      <Link href="/orders">
        <Button variant="outline" className="mt-8">Back to Orders</Button>
      </Link>
    </motion.div>
  );
}
