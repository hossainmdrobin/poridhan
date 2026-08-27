'use client';

import { useGetProductsQuery } from '@/store/api';
import ProductCard from '@/components/ProductCard';
import { IProduct } from '@/models/Product';

interface RelatedProductsProps {
  products: IProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <section className="mt-16">
      <h2 className="mb-8 text-2xl font-bold text-neutral-900">Similar Products</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {products.map((product: any, index: number) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
