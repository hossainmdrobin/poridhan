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
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const content = banner || {
    title: 'New Season Collection',
    subtitle: 'Discover timeless pieces for the modern wardrobe',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600',
    link: '/products?newArrival=true',
  };

  return (
    <section ref={containerRef} className="relative h-[85vh] min-h-[650px] overflow-hidden">
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0"
      >
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          src={content.image}
          alt={content.title}
          className="h-full w-full object-cover"
        />
        <motion.div
          style={{ opacity }}
          className="absolute inset-0 bg-gradient-to-b from-rose-950/70 via-rose-900/50 to-rose-950/80"
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute inset-0 bg-gradient-to-t from-rose-950/60 via-transparent to-transparent"
      />

      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '15%']) }}
        className="relative flex h-full items-center justify-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-3xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="animate-gradient inline-block rounded-full bg-gradient-to-r from-rose-500 to-cyan-500 bg-[length:200%_200%] px-5 py-2 text-sm font-semibold text-white shadow-lg">
              New Collection 2026
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-8 text-6xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl"
          >
            <span className="bg-gradient-to-r from-rose-200 via-white to-cyan-200 bg-clip-text text-transparent">
              {content.title}
            </span>
          </motion.h1>
          
          {content.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mt-6 text-lg text-rose-100 md:text-xl lg:text-2xl"
            >
              {content.subtitle}
            </motion.p>
          )}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.6, type: 'spring', stiffness: 200 }}
          >
            <Link href={content.link || '/products'}>
              <Button className="mt-10 animate-pulse-glow rounded-full bg-gradient-to-r from-rose-500 to-rose-600 px-10 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-rose-500/50">
                Shop Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-rose-300"
        >
          <span className="text-xs font-medium uppercase tracking-[0.3em]">Explore</span>
          <motion.div 
            className="h-10 w-6 rounded-full border-2 border-rose-300"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <motion.div 
              className="mx-auto mt-2 h-2 w-1 rounded-full bg-rose-300"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
