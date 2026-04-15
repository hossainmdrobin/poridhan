'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useGetProductsQuery, useDeleteProductMutation } from '@/store/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
}

export default function SellerProductsPage() {
  const { data: productsData, isLoading, refetch } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const products = productsData?.products ?? [];

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id).unwrap();
      await refetch();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/seller/products/new"
          className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </Link>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded bg-neutral-200" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-neutral-200">
                  <td className="flex items-center gap-4 px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-neutral-100">
                      <Image
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100'}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {p.name}
                  </td>
                  <td className="px-4 py-3">
                    {formatPrice(p.discountPrice || p.price)}
                    {p.discountPrice && <span className="ml-1 text-sm text-neutral-400 line-through">{formatPrice(p.price)}</span>}
                  </td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/seller/products/${p._id}`} className="rounded p-2 hover:bg-neutral-100">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button onClick={() => handleDelete(p._id)} className="rounded p-2 text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
