'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react';
import { api } from '@/services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([
      api.get<{ products: unknown[] }>('/products').catch(() => ({ products: [] })),
      api.get<unknown[]>('/orders').catch(() => []),
    ]).then(([productsRes, orders]) => {
      const products = productsRes.products || [];
      const ordersList = Array.isArray(orders) ? orders : [];
      const revenue = ordersList.reduce((sum: number, o: unknown) => sum + ((o as { total?: number }).total || 0), 0);
      setStats({
        products: products.length,
        users: 0,
        orders: ordersList.length,
        revenue,
      });
    });
  }, []);

  const cards = [
    { label: 'Products', value: stats.products, icon: Package },
    { label: 'Users', value: stats.users, icon: Users },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart },
    { label: 'Revenue (BDT)', value: stats.revenue.toLocaleString(), icon: DollarSign },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="mb-8 text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">{card.label}</p>
                <p className="mt-1 text-2xl font-bold">{card.value}</p>
              </div>
              <card.icon className="h-12 w-12 text-neutral-300" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
