import { loadModels, hashPassword } from '../utils';

export async function seedUsers(force = false) {
  const { User } = await loadModels();
  const count = await User.countDocuments();
  if (count > 0 && !force) {
    console.log('Users already exist. Use --force to re-seed.');
    return [];
  }

  if (force) {
    await User.deleteMany({});
  }

  const users = [
    { name: 'Md Robin Hossain', email: 'admin@poridhan.com', password: await hashPassword('admin123'), role: 'admin', isActive: true },
    { name: 'Seller User', email: 'seller@poridhan.com', password: await hashPassword('seller123'), role: 'seller', isActive: true },
    { name: 'Customer User', email: 'customer@poridhan.com', password: await hashPassword('customer123'), role: 'customer', isActive: true },
  ];

  const created = await User.insertMany(users);
  console.log(`Seeded ${created.length} users`);
  return created;
}

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
