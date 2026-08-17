import { loadModels } from '../utils';

export async function seedReviews(force = false) {
  const { Review, Product, User } = await loadModels();
  const count = await Review.countDocuments();
  if (count > 0 && !force) {
    console.log('Reviews already exist. Use --force to re-seed.');
    return [];
  }

  if (force) {
    await Review.deleteMany({});
  }

  const product = await Product.findOne();
  const user = await User.findOne({ role: 'customer' });
  if (!product || !user) {
    console.log('Required data (product/user) not found. Run seed users and products first.');
    return [];
  }

  const reviews = [
    { product: product._id, user: user._id, rating: 5, comment: 'Great product, highly recommended!', isApproved: true },
    { product: product._id, user: user._id, rating: 4, comment: 'Good quality for the price.', isApproved: true },
  ];

  const created = await Review.insertMany(reviews);
  console.log(`Seeded ${created.length} reviews`);
  return created;
}
