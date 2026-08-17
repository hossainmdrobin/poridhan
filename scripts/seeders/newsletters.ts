import { loadModels } from '../utils';

export async function seedNewsletters(force = false) {
  const { Newsletter } = await loadModels();
  const count = await Newsletter.countDocuments();
  if (count > 0 && !force) {
    console.log('Newsletters already exist. Use --force to re-seed.');
    return [];
  }

  if (force) {
    await Newsletter.deleteMany({});
  }

  const newsletters = [
    { email: 'subscriber1@example.com', isSubscribed: true },
    { email: 'subscriber2@example.com', isSubscribed: true },
  ];

  const created = await Newsletter.insertMany(newsletters);
  console.log(`Seeded ${created.length} newsletters`);
  return created;
}
