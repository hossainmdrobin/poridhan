'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function PromoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative overflow-hidden rounded-2xl"
        >
          <motion.div style={{ y }} className="absolute inset-0 h-[140%] -top-[20%]">
            <div 
              className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea113ec5?w=1600')] bg-cover bg-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/85 to-neutral-900/70" />
          </motion.div>
          
          <motion.div style={{ opacity }} className="relative px-8 py-16 md:px-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
              >
                Limited Time Offer
              </motion.span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h2 className="mt-6 text-4xl font-bold text-white md:text-6xl">Up to 30% Off</h2>
              <p className="mt-4 max-w-md text-lg text-neutral-300">On selected items. Limited time only.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link
                href="/products?featured=true"
                className="mt-8 inline-block border-2 border-white px-8 py-3 font-medium text-white transition-all duration-300 hover:bg-white hover:text-neutral-900 hover:scale-105"
              >
                Shop Sale
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
