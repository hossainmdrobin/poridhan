'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/services/api';

const SIZES = ['S', 'M', 'L', 'XL'];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    sizes: SIZES.map((s) => ({ size: s, quantity: 10 })),
    tags: '',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/products/create', {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
        category: form.category || undefined,
        sizes: form.sizes,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
        images: [],
        isFeatured: form.isFeatured,
        isNewArrival: form.isNewArrival,
        isBestSeller: form.isBestSeller,
      });
      router.push('/seller/products');
    } catch (err) {
      console.error(err);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Link href="/seller/products" className="mb-6 inline-block text-neutral-600 hover:underline">
        ← Back
      </Link>
      <h1 className="mb-8 text-2xl font-bold">Add Product</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <Input
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full rounded border border-neutral-300 px-4 py-2.5"
          rows={4}
          required
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            required
          />
          <Input
            type="number"
            placeholder="Discount Price (optional)"
            value={form.discountPrice}
            onChange={(e) => setForm((f) => ({ ...f, discountPrice: e.target.value }))}
          />
        </div>
        <Input
          placeholder="Category ID (optional)"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        />
        <Input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
        />
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))}
            />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isNewArrival}
              onChange={(e) => setForm((f) => ({ ...f, isNewArrival: e.target.checked }))}
            />
            New Arrival
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isBestSeller}
              onChange={(e) => setForm((f) => ({ ...f, isBestSeller: e.target.checked }))}
            />
            Best Seller
          </label>
        </div>
        <Button type="submit" loading={loading}>
          Create Product
        </Button>
      </form>
    </motion.div>
  );
}
