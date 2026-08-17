import { loadModels } from '../utils';

export async function seedBanners(force = false) {
  const { Banner } = await loadModels();
  const count = await Banner.countDocuments();
  if (count > 0 && !force) {
    console.log('Banners already exist. Use --force to re-seed.');
    return [];
  }

  if (force) {
    await Banner.deleteMany({});
  }

  const banners = [
    { title: 'Summer Sale', subtitle: 'Up to 50% off on all items', image: 'https://example.com/banner1.jpg', link: '/products', position: 0, isActive: true },
    { title: 'New Arrivals', subtitle: 'Check out the latest collection', image: 'https://example.com/banner2.jpg', link: '/products/new', position: 1, isActive: true },
  ];

  const created = await Banner.insertMany(banners);
  console.log(`Seeded ${created.length} banners`);
  return created;
}
