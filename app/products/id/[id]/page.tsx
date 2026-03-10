'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ProductByIdRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then((p) => {
        if (p?.slug) router.replace(`/products/${p.slug}`);
        else router.replace('/products');
      })
      .catch(() => router.replace('/products'));
  }, [params.id, router]);

  return <div className="mx-auto max-w-7xl px-4 py-24 text-center">Loading...</div>;
}
