import { loadModels } from '../utils';

export async function seedCategories(force = false) {
  const { Category } = await loadModels();
  const count = await Category.countDocuments();
  if (count > 0 && !force) {
    console.log('Categories already exist. Use --force to re-seed.');
    return [];
  }

  if (force) {
    await Category.deleteMany({});
  }

  const categories = [
    { name: 'Men', slug: 'men', description: 'Men\'s fashion collection', isActive: true, order: 0 },
    { name: 'Women', slug: 'women', description: 'Women\'s fashion collection', isActive: true, order: 1 },
  ];

  const created = await Category.insertMany(categories);
  console.log(`Seeded ${created.length} categories`);
  return created;
}
