'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, User, Search, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Shop' },
  { href: '/products?category=men', label: 'Men' },
  { href: '/products?category=women', label: 'Women' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const { user } = useAuthStore();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link href="/" className="text-2xl font-bold tracking-tight text-neutral-900">
          PORIDHAN
        </Link>

        <nav className="hidden lg:flex lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            className="p-2"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link href="/wishlist" className="p-2" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Link>
          <Link href="/cart" className="relative p-2">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <Link
              href={user.role === 'admin' ? '/admin' : user.role === 'seller' ? '/seller' : '/account'}
              className="p-2"
            >
              <User className="h-5 w-5" />
            </Link>
          ) : (
            <Link href="/login" className="p-2">
              <User className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-neutral-200"
          >
            <div className="p-4">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full rounded border border-neutral-300 px-4 py-2 focus:border-neutral-900 focus:outline-none"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          // <motion.div
          //   initial={{ opacity: 0 }}
          //   animate={{ opacity: 1 }}
          //   exit={{ opacity: 0 }}
          //   className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          //   onClick={() => setMobileOpen(false)}
          // >
          //   <motion.nav
          //     initial={{ x: '-100%' }}
          //     animate={{ x: 0 }}
          //     exit={{ x: '-100%' }}
          //     className="flex h-full w-72 flex-col gap-6 bg-white p-6"
          //     onClick={(e) => e.stopPropagation()}
          //   >
          //     <button onClick={() => setMobileOpen(false)} className="self-end">
          //       <X className="h-6 w-6" />
          //     </button>
          //     {navLinks.map((link) => (
          //       <Link
          //         key={link.href}
          //         href={link.href}
          //         className="text-lg font-medium"
          //         onClick={() => setMobileOpen(false)}
          //       >
          //         {link.label}
          //       </Link>
          //     ))}
          //   </motion.nav>
          // </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed h-screen left-0 top-0 z-[100] flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative h-screen max-w-sm bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 rounded-full p-1 hover:bg-neutral-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className='flex flex-col min-w-[250px]'>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium block h-[50px] hover:bg-gray-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
