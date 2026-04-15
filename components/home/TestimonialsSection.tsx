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

export default function TestimonialsSection({ testimonials: initialTestimonials }: TestimonialsSectionProps) {
  const testimonials = initialTestimonials.length ? initialTestimonials : [
    { _id: '1', name: 'Sarah M.', role: 'Fashion Enthusiast', content: 'Absolutely love the quality and fit. The fabric feels premium and the design is timeless.', rating: 5 },
    { _id: '2', name: 'James K.', role: 'Regular Customer', content: 'Best online shopping experience. Fast delivery and the products exceeded my expectations.', rating: 5 },
    { _id: '3', name: 'Emma L.', role: 'Style Blogger', content: 'Poridhan has become my go-to for everyday essentials. Minimal, elegant, and affordable.', rating: 5 },
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-rose-50/50 to-cyan-50/50">
      <motion.div 
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
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
            className="inline-block text-sm font-medium uppercase tracking-widest text-rose-500"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl"
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
              className="group rounded-2xl bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-rose-200/30"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <motion.span
                    key={j}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + j * 0.1, duration: 0.3 }}
                    className="text-amber-400 text-xl"
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
                className="text-slate-600"
              >
                &ldquo;{t.content}&rdquo;
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-6 flex items-center gap-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-cyan-400 text-lg font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  {t.role && <p className="text-sm text-slate-500">{t.role}</p>}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}