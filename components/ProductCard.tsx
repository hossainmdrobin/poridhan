'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import Button from './ui/Button';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  sizes?: { size: string; quantity: number }[];
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, isInWishlist, removeItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);
  const inWishlist = isInWishlist(product._id);
  const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400';
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const sizes = product.sizes?.filter((s) => s.quantity > 0).map((s) => s.size) || ['S', 'M', 'L', 'XL'];

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeItem(product._id);
    } else {
      addItem({
        productId: product._id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        image: imageUrl,
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product._id,
      name: product.name,
      price: displayPrice,
      quantity: 1,
      size: sizes[0] || 'M',
      image: imageUrl,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/products/${product.slug}`}>
        <div className="group relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <button
            onClick={handleWishlist}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm transition hover:bg-white"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-neutral-600'}`}
            />
          </button>
          {hasDiscount && (
            <span className="absolute left-3 top-3 bg-black px-2 py-1 text-xs font-medium text-white">
              SALE
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-white/95 p-4 transition-transform duration-300 group-hover:translate-y-0">
            <Button
              size="sm"
              className="w-full"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </div>
        <div className="mt-4 space-y-1">
          <h3 className="font-medium text-neutral-900 group-hover:underline">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">{formatPrice(displayPrice)}</span>
            {hasDiscount && (
              <span className="text-sm text-neutral-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
