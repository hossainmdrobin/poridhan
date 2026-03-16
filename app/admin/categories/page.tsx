'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface Category {
  _id: string;
  name: string;
}

const SIZES = ['S', 'M', 'L', 'XL'];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    api
      .get<Category[]>('/categories')
      .then(setCategories)
      .catch(console.error);
  }, []);

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
      setShowModal(false);
      setForm({
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
      alert('Product created successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={() => setShowModal(true)}>
          + Add Product
        </Button>
      </div>
      <p className="text-neutral-600">Category management - add and edit product categories.</p>

      {/* Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Product</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded border border-neutral-300 px-4 py-2.5"
              >
                <option value="">Select Category (optional)</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              />
              <div className="flex flex-wrap gap-6">
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
              <div className="flex gap-4 pt-4">
                <Button type="button" onClick={() => setShowModal(false)} variant="secondary">
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  Create Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
