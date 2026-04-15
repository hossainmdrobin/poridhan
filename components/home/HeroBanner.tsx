'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const content = banner || {
    title: 'New Season Collection',
    subtitle: 'Discover timeless pieces for the modern wardrobe',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600',
    link: '/products?newArrival=true',
  };

  return (
    <section ref={containerRef} className="relative h-[85vh] min-h-[600px] overflow-hidden bg-neutral-900">
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0"
      >
        <img
          src={content.image}
          alt={content.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </motion.div>
      
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
      />

      <div className="relative flex h-full items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
            >
              New Collection 2026
            </motion.span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
          >
            {content.title}
          </motion.h1>
          
          {content.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-6 text-lg text-white/80 md:text-xl lg:text-2xl"
            >
              {content.subtitle}
            </motion.p>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Link href={content.link || '/products'}>
              <Button className="mt-10 bg-white text-neutral-900 hover:bg-neutral-100 hover:scale-105 transition-transform duration-300">
                Shop Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-white/60"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
