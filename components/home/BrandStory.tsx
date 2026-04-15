'use client';

import { motion } from 'framer-motion';

export default function BrandStory() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-slate-50 to-rose-50/30">
      <motion.div 
        className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-rose-200/30 to-cyan-200/30 blur-3xl"
        animate={{ 
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-gradient-to-bl from-cyan-200/30 to-rose-200/30 blur-3xl"
        animate={{ 
          x: [0, -30, 0],
          y: [0, -20, 0],
        }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-200 shadow-2xl"
          >
            <motion.div
              className="absolute inset-0"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            >
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
                alt="Our brand"
                className="h-full w-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 via-transparent to-transparent" />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute bottom-6 left-6 right-6 rounded-xl bg-white/20 backdrop-blur-md"
            >
              <div className="flex items-center justify-around p-4">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white">15k+</span>
                  <span className="text-xs text-white/70">Customers</span>
                </div>
                <div className="h-10 w-px bg-white/30" />
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white">500+</span>
                  <span className="text-xs text-white/70">Products</span>
                </div>
                <div className="h-10 w-px bg-white/30" />
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white">98%</span>
                  <span className="text-xs text-white/70">Satisfaction</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-block text-sm font-medium uppercase tracking-widest text-rose-500"
            >
              Our Story
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl"
            >
              Crafting Timeless Fashion
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-6 text-lg leading-relaxed text-slate-600"
            >
              Poridhan was born from a simple idea: fashion should be accessible, sustainable, and timeless.
              We curate pieces that transcend seasons, crafted with care for both people and planet.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-4 text-lg leading-relaxed text-slate-600"
            >
              Every garment tells a story of quality materials, ethical production, and design that lasts.
              We believe in fewer, better things—clothes you&apos;ll love for years to come.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}