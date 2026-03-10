'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Input from './ui/Input';
import Button from './ui/Button';
import { api } from '@/services/api';

const footerLinks = {
  Shop: [
    { href: '/products', label: 'All Products' },
    { href: '/products?newArrival=true', label: 'New Arrivals' },
    { href: '/products?bestSeller=true', label: 'Best Sellers' },
    { href: '/products?featured=true', label: 'Featured' },
  ],
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/faq', label: 'FAQ' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/newsletter', { email });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tight text-neutral-900">
              PORIDHAN
            </Link>
            <p className="mt-4 max-w-sm text-sm text-neutral-600">
              Premium fashion for the modern lifestyle. Quality fabrics, timeless design, and sustainable choices.
            </p>
            <form onSubmit={handleNewsletter} className="mt-6 flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="max-w-xs"
              />
              <Button type="submit" loading={status === 'loading'}>
                Subscribe
              </Button>
            </form>
            {status === 'success' && <p className="mt-2 text-sm text-green-600">Thanks for subscribing!</p>}
            {status === 'error' && <p className="mt-2 text-sm text-red-600">Something went wrong. Try again.</p>}
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-neutral-900">{title}</h4>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 transition hover:text-neutral-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} Poridhan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
