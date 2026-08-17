import { loadModels } from '../utils';

export async function seedDiscounts(force = false) {
  const { DiscountCode } = await loadModels();
  const count = await DiscountCode.countDocuments();
  if (count > 0 && !force) {
    console.log('Discount codes already exist. Use --force to re-seed.');
    return [];
  }

  if (force) {
    await DiscountCode.deleteMany({});
  }

  const codes = [
    { code: 'WELCOME10', type: 'percentage', value: 10, isActive: true, usedCount: 0 },
    { code: 'FLAT50', type: 'fixed', value: 50, minPurchase: 200, isActive: true, usedCount: 0 },
  ];

  const created = await DiscountCode.insertMany(codes);
  console.log(`Seeded ${created.length} discount codes`);
  return created;
}
