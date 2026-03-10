'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <Heart className="mx-auto h-16 w-16 text-neutral-300" />
        <h2 className="mt-4 text-2xl font-bold">Your wishlist is empty</h2>
        <p className="mt-2 text-neutral-600">Save items you love for later.</p>
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
      <h1 className="mb-8 text-3xl font-bold">Wishlist</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="group relative overflow-hidden rounded-lg border border-neutral-200"
          >
            <Link href={item.slug ? `/products/${item.slug}` : `/products/id/${item.productId}`} className="block">
              <div className="relative aspect-[3/4] bg-neutral-100">
                <Image
                  src={item.image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400'}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
            <button
              onClick={() => removeItem(item.productId)}
              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow hover:bg-white"
            >
              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
            </button>
            <div className="p-4">
              <Link href={item.slug ? `/products/${item.slug}` : `/products/id/${item.productId}`}>
                <h3 className="font-medium hover:underline">{item.name}</h3>
              </Link>
              <p className="mt-1 font-semibold">
                {formatPrice(item.discountPrice || item.price)}
              </p>
              <Button
                size="sm"
                className="mt-3 w-full"
                onClick={() =>
                  addToCart({
                    productId: item.productId,
                    name: item.name,
                    price: item.discountPrice || item.price,
                    quantity: 1,
                    size: 'M',
                    image: item.image,
                  })
                }
              >
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
