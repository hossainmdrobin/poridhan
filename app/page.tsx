'use client';

import HeroBanner from '@/components/home/HeroBanner';
import ProductSection from '@/components/home/ProductSection';
import PromoSection from '@/components/home/PromoSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BrandStory from '@/components/home/BrandStory';
import { useGetBannersQuery, useGetProductsQuery, useGetTestimonialsQuery } from '@/store/api';

export default function Home() {
  const { data: bannersData } = useGetBannersQuery();
  const { data: productsData } = useGetProductsQuery({ limit: 8 });
  const { data: featuredData } = useGetProductsQuery({ featured: true, limit: 4 });
  const { data: newArrivalData } = useGetProductsQuery({ newArrival: true, limit: 4 });
  const { data: bestSellerData } = useGetProductsQuery({ bestSeller: true, limit: 4 });
  const { data: testimonials = [] } = useGetTestimonialsQuery();

  console.log(newArrivalData)

  const banner = bannersData?.[0] ?? null;
  const products = productsData?.products ?? [];
  const featured = featuredData?.products ?? [];
  const newArrival = newArrivalData?.products ?? [];
  const bestSeller = bestSellerData?.products ?? [];

  return (
    <>
      <HeroBanner banner={banner} />
      <ProductSection
        title="Featured"
        subtitle="Handpicked favorites"
        products={featured.length ? featured : products.slice(0, 4)}
        viewAllHref="/products?featured=true"
      />
      <ProductSection
        title="New Arrivals"
        subtitle="Fresh styles for the season"
        products={newArrival.length ? newArrival : products.slice(0, 4)}
        viewAllHref="/products?newArrival=true"
      />
      <PromoSection />
      <ProductSection
        title="Best Sellers"
        subtitle="Customer favorites"
        products={bestSeller.length ? bestSeller : products.slice(4, 8)}
        viewAllHref="/products?bestSeller=true"
      />
      <TestimonialsSection testimonials={testimonials} />
      <BrandStory />
    </>
  );
}
