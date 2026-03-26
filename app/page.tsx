import HeroBanner from '@/components/home/HeroBanner';
import ProductSection from '@/components/home/ProductSection';
import PromoSection from '@/components/home/PromoSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BrandStory from '@/components/home/BrandStory';
import { getBaseUrl } from '@/lib/constants';

async function getHomeData() {
  const base = getBaseUrl();
  try {
    const [bannersRes, productsRes, featuredRes, newArrivalRes, bestSellerRes, testimonialsRes] =
      await Promise.allSettled([
        fetch(`${base}/api/banners`),
        fetch(`${base}/api/products?limit=8`),
        fetch(`${base}/api/products?featured=true&limit=4`),
        fetch(`${base}/api/products?newArrival=true&limit=4`),
        fetch(`${base}/api/products?bestSeller=true&limit=4`),
        fetch(`${base}/api/testimonials`),
      ]);

    const banners = bannersRes.status === 'fulfilled' ? (await bannersRes.value.json()).filter(Boolean) : [];
    const products = productsRes.status === 'fulfilled' ? (await productsRes.value.json()).products || [] : [];
    const featured = featuredRes.status === 'fulfilled' ? (await featuredRes.value.json()).products || [] : [];
    const newArrival = newArrivalRes.status === 'fulfilled' ? (await newArrivalRes.value.json()).products || [] : [];
    const bestSeller = bestSellerRes.status === 'fulfilled' ? (await bestSellerRes.value.json()).products || [] : [];
    const testimonials = testimonialsRes.status === 'fulfilled' ? (await testimonialsRes.value.json()) || [] : [];
    return {
      banner: banners[0] || null,
      products,
      featured: featured.length ? featured : products.slice(0, 4),
      newArrival: newArrival.length ? newArrival : products.slice(0, 4),
      bestSeller: bestSeller.length ? bestSeller : products.slice(4, 8),
      testimonials,
    };
  } catch {
    return {
      banner: null,
      products: [],
      featured: [],
      newArrival: [],
      bestSeller: [],
      testimonials: [],
    };
  }
}

export default async function Home() {
  const { banner, featured, newArrival, bestSeller, testimonials } = await getHomeData();
console.log(featured, "Feature products")

  return (
    <>
      <HeroBanner banner={banner} />
      <ProductSection
        title="Featured"
        subtitle="Handpicked favorites"
        products={featured}
        viewAllHref="/products?featured=true"
      />
      <ProductSection
        title="New Arrivals"
        subtitle="Fresh styles for the season"
        products={newArrival}
        viewAllHref="/products?newArrival=true"
      />
      <PromoSection />
      <ProductSection
        title="Best Sellers"
        subtitle="Customer favorites"
        products={bestSeller}
        viewAllHref="/products?bestSeller=true"
      />
      <TestimonialsSection testimonials={testimonials} />
      <BrandStory />
    </>
  );
}
