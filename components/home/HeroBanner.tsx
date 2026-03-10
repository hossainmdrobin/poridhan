'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
}

interface HeroBannerProps {
  banner?: Banner | null;
}

export default function HeroBanner({ banner }: HeroBannerProps) {
  const content = banner || {
    title: 'New Season Collection',
    subtitle: 'Discover timeless pieces for the modern wardrobe',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600',
    link: '/products?newArrival=true',
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-neutral-200">
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0"
      >
        <img
          src={content.image}
          alt={content.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>
      <div className="relative flex h-full items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-6xl">
            {content.title}
          </h1>
          {content.subtitle && (
            <p className="mt-4 text-lg text-white/90 md:text-xl">{content.subtitle}</p>
          )}
          <Link href={content.link || '/products'}>
            <Button className="mt-8 bg-black text-neutral-100 hover:bg-neutral-100">
              Shop Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
