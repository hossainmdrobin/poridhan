'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetProductByIdQuery } from '@/store/api';

export default function ProductByIdRedirect() {
  const params = useParams();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { data, isSuccess } = useGetProductByIdQuery(productId ?? skipToken, {
    skip: !productId,
  });

  useEffect(() => {
    if (!isSuccess || !data) return;
    if (data.slug) {
      router.replace(`/products/${data.slug}`);
    } else {
      router.replace('/products');
    }
  }, [data, isSuccess, router]);

  return <div className="mx-auto max-w-7xl px-4 py-24 text-center">Loading...</div>;
}
