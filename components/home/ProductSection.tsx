'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ProductCard from '../ProductCard';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  sizes?: { size: string; quantity: number }[];
}

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}

export default function ProductSection({ title, subtitle, products, viewAllHref }: ProductSectionProps) {
  if (!products.length) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col items-center text-center md:flex-row md:justify-between md:text-left"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">{title}</h2>
            {subtitle && <p className="mt-2 text-neutral-600">{subtitle}</p>}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="mt-4 font-medium text-neutral-900 underline-offset-4 hover:underline md:mt-0"
            >
              View All
            </Link>
          )}
        </motion.div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
