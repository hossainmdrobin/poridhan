'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductSection from '@/components/home/ProductSection';
import ProductCard from '@/components/ProductCard';
import { useGetProductsQuery } from '@/store/api';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: string[];
  sizes?: { size: string; quantity: number }[];
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const featured = searchParams.get('featured') === 'true';
  const newArrival = searchParams.get('newArrival') === 'true';
  const bestSeller = searchParams.get('bestSeller') === 'true';

  const { data, isLoading } = useGetProductsQuery({
    category,
    search,
    featured: featured || undefined,
    newArrival: newArrival || undefined,
    bestSeller: bestSeller || undefined,
    limit: 8,
  });

  const products = data?.products ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-neutral-900">
        {search ? `Search: ${search}` : category || featured || newArrival || bestSeller ? 'Shop' : 'All Products'}
      </h1>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded bg-neutral-200" />
          ))}
        </div>
      ) : products.length ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-neutral-600">No products found.</p>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
