'use client';

import { motion } from 'framer-motion';

interface Testimonial {
  _id: string;
  name: string;
  role?: string;
  content: string;
  rating: number;
  image?: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials.length) {
    testimonials = [
      { _id: '1', name: 'Sarah M.', role: 'Fashion Enthusiast', content: 'Absolutely love the quality and fit. The fabric feels premium and the design is timeless.', rating: 5 },
      { _id: '2', name: 'James K.', role: 'Regular Customer', content: 'Best online shopping experience. Fast delivery and the products exceeded my expectations.', rating: 5 },
      { _id: '3', name: 'Emma L.', role: 'Style Blogger', content: 'Poridhan has become my go-to for everyday essentials. Minimal, elegant, and affordable.', rating: 5 },
    ];
  }

  return (
    <section className="border-y border-neutral-200 bg-neutral-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-3xl font-bold text-neutral-900"
        >
          What Our Customers Say
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-lg bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-amber-500">★</span>
                ))}
              </div>
              <p className="text-neutral-600">&ldquo;{t.content}&rdquo;</p>
              <p className="mt-4 font-medium text-neutral-900">{t.name}</p>
              {t.role && <p className="text-sm text-neutral-500">{t.role}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
