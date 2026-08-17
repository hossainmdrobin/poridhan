import { loadModels } from '../utils';

export async function seedProducts(force = false) {
  const { Product, Category, User } = await loadModels();
  const count = await Product.countDocuments();
  if (count > 0 && !force) {
    console.log('Products already exist. Use --force to re-seed.');
    return [];
  }

  if (force) {
    await Product.deleteMany({});
  }

  const category = await Category.findOne({ slug: 'men' });
  const seller = await User.findOne({ role: 'seller' });
  if (!category || !seller) {
    console.log('Required data (category/seller) not found. Run seed users and categories first.');
    return [];
  }

  const products = [
    { name: 'Classic Cotton T-Shirt', slug: 'classic-cotton-tshirt', description: 'Comfortable cotton t-shirt for everyday wear.', price: 29.99, discountPrice: 24.99, category: category._id, sizes: [{ size: 'M', quantity: 50 }, { size: 'L', quantity: 50 }], colors: [{ image: 'https://example.com/black.jpg', quantity: 50 }], stock: 100, images: ['https://example.com/black.jpg'], tags: ['cotton', 'casual'], seller: seller._id, isFeatured: true, isNewArrival: true, isActive: true },
    { name: 'Slim Fit Jeans', slug: 'slim-fit-jeans', description: 'Modern slim fit jeans with stretch comfort.', price: 59.99, discountPrice: 49.99, category: category._id, sizes: [{ size: 'M', quantity: 30 }, { size: 'L', quantity: 30 }], colors: [{ image: 'https://example.com/blue.jpg', quantity: 30 }], stock: 60, images: ['https://example.com/blue.jpg'], tags: ['jeans', 'denim'], seller: seller._id, isBestSeller: true, isActive: true },
    { name: 'Casual Hoodie', slug: 'casual-hoodie', description: 'Warm and cozy hoodie for chilly evenings.', price: 45.99, category: category._id, sizes: [{ size: 'L', quantity: 25 }, { size: 'XL', quantity: 25 }], colors: [{ image: 'https://example.com/grey.jpg', quantity: 25 }], stock: 50, images: ['https://example.com/grey.jpg'], tags: ['hoodie', 'casual'], seller: seller._id, isFeatured: true, isActive: true },
  ];

  const created = await Product.insertMany(products);
  console.log(`Seeded ${created.length} products`);
  return created;
}
