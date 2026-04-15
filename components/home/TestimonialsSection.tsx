'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  if (!testimonials.length) {
    testimonials = [
      { _id: '1', name: 'Sarah M.', role: 'Fashion Enthusiast', content: 'Absolutely love the quality and fit. The fabric feels premium and the design is timeless.', rating: 5 },
      { _id: '2', name: 'James K.', role: 'Regular Customer', content: 'Best online shopping experience. Fast delivery and the products exceeded my expectations.', rating: 5 },
      { _id: '3', name: 'Emma L.', role: 'Style Blogger', content: 'Poridhan has become my go-to for everyday essentials. Minimal, elegant, and affordable.', rating: 5 },
    ];
  }

  return (
    <section ref={containerRef} className="border-y border-neutral-200 bg-neutral-50 py-16 md:py-24 overflow-hidden">
      <motion.div style={{ y }} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block text-sm font-medium uppercase tracking-widest text-neutral-500"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-2 text-3xl font-bold text-neutral-900 md:text-4xl"
          >
            What Our Customers Say
          </motion.h2>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group rounded-xl bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <motion.span
                    key={j}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + j * 0.1, duration: 0.3 }}
                    className="text-amber-500"
                  >
                    ★
                  </motion.span>
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-neutral-600"
              >
                &ldquo;{t.content}&rdquo;
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-6"
              >
                <p className="font-medium text-neutral-900">{t.name}</p>
                {t.role && <p className="text-sm text-neutral-500">{t.role}</p>}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
