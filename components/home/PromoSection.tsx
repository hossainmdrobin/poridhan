'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PromoSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-neutral-900 px-8 py-16 text-white md:px-16 md:py-24"
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea113ec5?w=1600')] bg-cover bg-center opacity-30" />
          <div className="relative">
            <h2 className="text-3xl font-bold md:text-5xl">Up to 30% Off</h2>
            <p className="mt-4 max-w-md text-lg text-neutral-300">On selected items. Limited time only.</p>
            <Link
              href="/products?featured=true"
              className="mt-8 inline-block border-2 border-white px-8 py-3 font-medium transition hover:bg-white hover:text-neutral-900"
            >
              Shop Sale
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
