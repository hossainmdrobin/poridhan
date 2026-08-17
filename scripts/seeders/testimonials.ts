import { loadModels } from '../utils';

export async function seedTestimonials(force = false) {
  const { Testimonial } = await loadModels();
  const count = await Testimonial.countDocuments();
  if (count > 0 && !force) {
    console.log('Testimonials already exist. Use --force to re-seed.');
    return [];
  }

  if (force) {
    await Testimonial.deleteMany({});
  }

  const testimonials = [
    { name: 'Sarah M.', role: 'Fashion Enthusiast', content: 'Absolutely love the quality and fit.', rating: 5, isActive: true, order: 0 },
    { name: 'James K.', role: 'Regular Customer', content: 'Best online shopping experience.', rating: 5, isActive: true, order: 1 },
  ];

  const created = await Testimonial.insertMany(testimonials);
  console.log(`Seeded ${created.length} testimonials`);
  return created;
}
