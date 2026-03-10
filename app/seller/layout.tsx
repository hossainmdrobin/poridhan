'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Package, ShoppingCart, BarChart3, LogOut } from 'lucide-react';

const nav = [
  { href: '/seller', label: 'Dashboard', icon: BarChart3 },
  { href: '/seller/products', label: 'Products', icon: Package },
  { href: '/seller/orders', label: 'Orders', icon: ShoppingCart },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

  useEffect(() => {
    if (!token || (user?.role !== 'seller' && user?.role !== 'admin')) {
      router.replace('/login?redirect=/seller');
    }
  }, [token, user, router]);

  if (!token) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-neutral-200 bg-white">
        <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col p-4">
          <h2 className="mb-6 text-lg font-bold">Seller Dashboard</h2>
          <nav className="flex-1 space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  pathname === item.href ? 'bg-neutral-100 font-medium' : 'hover:bg-neutral-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
