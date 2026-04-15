'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Minus, Plus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';
import Button from '@/components/ui/Button';
import { useGetProductBySlugQuery } from '@/store/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  sizes: { size: string; quantity: number }[];
  tags?: string[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { addItem, isInWishlist, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addItem);

  const inWishlist = product ? isInWishlist(product._id) : false;
  const availableSizes = product?.sizes?.filter((s) => s.quantity > 0).map((s) => s.size) || [];
  const displayPrice = product?.discountPrice && product.discountPrice < product.price ? product.discountPrice : product?.price;

  const { data, isLoading } = useGetProductBySlugQuery(slug, { skip: !slug });

  useEffect(() => {
    if (!data) return;
    setProduct(data);
    setSelectedSize(data.sizes?.find((s: { size: string; quantity: number }) => s.quantity > 0)?.size || '');
    addRecentlyViewed({
      productId: data._id,
      name: data.name,
      price: data.price,
      discountPrice: data.discountPrice,
      image: data.images?.[0],
    });
  }, [data, addRecentlyViewed]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-[3/4] animate-pulse rounded bg-neutral-200" />
          <div className="space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded bg-neutral-200" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-neutral-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      price: displayPrice!,
      quantity,
      size: selectedSize || availableSizes[0],
      image: product.images?.[0],
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100">
          <Image
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800'}
            alt={product.name}
            width={800}
            height={1000}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{product.name}</h1>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-2xl font-semibold text-neutral-900">{formatPrice(displayPrice!)}</span>
            {product.discountPrice && product.discountPrice < product.price && (
              <span className="text-lg text-neutral-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          <p className="mt-6 text-neutral-600">{product.description}</p>

          <div className="mt-8">
            <label className="block font-medium text-neutral-900">Size</label>
            <div className="mt-2 flex gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`flex h-12 w-12 items-center justify-center rounded border transition ${
                    selectedSize === size
                      ? 'border-neutral-900 bg-neutral-900 text-white'
                      : 'border-neutral-300 hover:border-neutral-900'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-neutral-300">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 hover:bg-neutral-100"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-3 hover:bg-neutral-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="flex-1"
            >
              Add to Cart
            </Button>
            <button
              onClick={() => (inWishlist ? removeItem(product._id) : addItem({ productId: product._id, slug: product.slug, name: product.name, price: product.price, discountPrice: product.discountPrice, image: product.images?.[0] }))}
              className="rounded-full border border-neutral-300 p-3 hover:bg-neutral-50"
            >
              <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
