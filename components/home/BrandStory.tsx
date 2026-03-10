'use client';

import { motion } from 'framer-motion';

export default function BrandStory() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200"
          >
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
              alt="Our brand"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Our Story</h2>
            <p className="mt-6 text-lg leading-relaxed text-neutral-600">
              Poridhan was born from a simple idea: fashion should be accessible, sustainable, and timeless.
              We curate pieces that transcend seasons, crafted with care for both people and planet.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-neutral-600">
              Every garment tells a story of quality materials, ethical production, and design that lasts.
              We believe in fewer, better things—clothes you&apos;ll love for years to come.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
