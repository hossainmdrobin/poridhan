import { loadModels } from '../utils';

export async function clearAll() {
  const { User, Category, Product, Order, DiscountCode, Banner, Testimonial, Review, Newsletter, WhatsAppLead, Info } = await loadModels();
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    DiscountCode.deleteMany({}),
    Banner.deleteMany({}),
    Testimonial.deleteMany({}),
    Review.deleteMany({}),
    Newsletter.deleteMany({}),
    WhatsAppLead.deleteMany({}),
    Info.deleteMany({}),
  ]);
  console.log('Cleared all collections');
}

export { seedUsers } from './users';
export { seedCategories } from './categories';
export { seedProducts } from './products';
export { seedOrders } from './orders';
export { seedDiscounts } from './discounts';
export { seedBanners } from './banners';
export { seedTestimonials } from './testimonials';
export { seedReviews } from './reviews';
export { seedNewsletters } from './newsletters';
export { seedInfo } from './info';
