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
          viewport={{ once: true, margin: '-100px' }}
          className="relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 h-[140%] -top-[20%] w-full">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?w=1600')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-rose-950 via-purple-950/90 to-slate-950" />
          </div>
          
          <motion.div className="relative px-8 py-16 md:px-16 md:py-24">
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
                className="animate-gradient inline-block rounded-full bg-gradient-to-r from-rose-500/30 to-cyan-500/30 bg-[length:200%_200%] px-5 py-2 text-sm font-semibold text-white backdrop-blur-md border border-white/20"
              >
                🔥 Limited Time Offer
              </motion.span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h2 className="mt-6 text-5xl font-bold text-white md:text-7xl">
                <span className="bg-gradient-to-r from-rose-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                  Up to 30% Off
                </span>
              </h2>
              <p className="mt-4 max-w-md text-lg text-rose-100/80">On selected items. Limited time only.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link
                href="/products?featured=true"
                className="group mt-8 inline-flex items-center gap-3 rounded-full border-2 border-white/30 bg-white/10 px-10 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:text-rose-600"
              >
                <span>Shop Sale</span>
                <motion.span 
                  className="text-lg"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1 }}
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-cyan-500/20 to-rose-500/20 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-br from-rose-500/20 to-purple-500/20 blur-3xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
