'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { api } from '@/services/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ products: Product[] }>('/products')
      .then((res) => setProducts(res.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Products</h1>
      {loading ? (
        <div className="h-48 animate-pulse rounded bg-neutral-200" />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="flex items-center gap-4 px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-neutral-100">
                      <Image src={p.images?.[0] || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100'} alt="" fill className="object-cover" />
                    </div>
                    {p.name}
                  </td>
                  <td className="px-4 py-3">{formatPrice(p.discountPrice || p.price)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
