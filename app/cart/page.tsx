'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  if (!items.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-neutral-900">Your cart is empty</h2>
        <p className="mt-2 text-neutral-600">Add some items to get started.</p>
        <Link href="/products">
          <Button className="mt-6">Shop Now</Button>
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
      <h1 className="mb-8 text-3xl font-bold text-neutral-900">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex gap-4 rounded-lg border border-neutral-200 p-4"
            >
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded bg-neutral-100">
                <Image
                  src={item.image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200'}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-neutral-500">Size: {item.size}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                      className="rounded p-1 hover:bg-neutral-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                      className="rounded p-1 hover:bg-neutral-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="sticky top-24 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="mt-4 flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Link href="/checkout">
              <Button className="mt-6 w-full">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
