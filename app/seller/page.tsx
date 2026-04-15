'use client';

import { motion } from 'framer-motion';
import { Package, DollarSign, ShoppingCart } from 'lucide-react';
import { useGetProductsQuery, useGetOrdersQuery } from '@/store/api';

export default function SellerDashboard() {
  const { data: productsData } = useGetProductsQuery();
  const { data: ordersData } = useGetOrdersQuery();

  const productsCount = productsData?.products?.length ?? 0;
  const ordersCount = ordersData?.length ?? 0;
  const revenue = ordersData?.reduce((sum: number, order: any) => sum + (order?.total ?? 0), 0) ?? 0;

  const cards = [
    { label: 'Products', value: productsCount, icon: Package },
    { label: 'Orders', value: ordersCount, icon: ShoppingCart },
    { label: 'Revenue (BDT)', value: revenue.toLocaleString(), icon: DollarSign },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
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
