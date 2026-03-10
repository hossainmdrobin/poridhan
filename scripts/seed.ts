/**
 * Seed script to populate initial data.
 * Run with: npm run seed
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/poridhan';

async function seed() {
  await mongoose.connect(MONGODB_URI);

  // Use dynamic imports to avoid Next.js-specific code
  const { default: User } = await import('../models/User');
  const { default: Category } = await import('../models/Category');
  const { default: DiscountCode } = await import('../models/DiscountCode');
  const { default: Testimonial } = await import('../models/Testimonial');

  const hashedPassword = await bcrypt.hash('admin123', 12);
  await User.findOneAndUpdate(
    { email: 'admin@poridhan.com' },
    { name: 'Admin', email: 'admin@poridhan.com', password: hashedPassword, role: 'admin', isActive: true },
    { upsert: true }
  );
  console.log('Admin user: admin@poridhan.com / admin123');

  await Category.findOneAndUpdate({ slug: 'men' }, { name: 'Men', slug: 'men', isActive: true, order: 0 }, { upsert: true });
  await Category.findOneAndUpdate({ slug: 'women' }, { name: 'Women', slug: 'women', isActive: true, order: 1 }, { upsert: true });
  console.log('Categories created');

  await DiscountCode.findOneAndUpdate(
    { code: 'WHATSAPP10' },
    { code: 'WHATSAPP10', type: 'percentage', value: 10, isActive: true, usedCount: 0 },
    { upsert: true }
  );
  console.log('Discount code: WHATSAPP10 (10% off)');

  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.insertMany([
      { name: 'Sarah M.', role: 'Fashion Enthusiast', content: 'Absolutely love the quality and fit.', rating: 5, isActive: true, order: 0 },
      { name: 'James K.', role: 'Regular Customer', content: 'Best online shopping experience.', rating: 5, isActive: true, order: 1 },
    ]);
    console.log('Testimonials created');
  }

  await mongoose.disconnect();
  console.log('Seed complete');
}

seed().catch(console.error);
