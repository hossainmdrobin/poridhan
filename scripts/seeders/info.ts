import { loadModels } from '../utils';
import { groqEmbed } from '../../lib/agent/modelManager';

export async function seedInfo(force = false) {
  const { Info } = await loadModels();
  const count = await Info.countDocuments();
  if (count > 0 && !force) {
    console.log('Info entries already exist. Use --force to re-seed.');
    return [];
  }

  if (force) {
    await Info.deleteMany({});
  }

  const info = [
    { text: 'Privacy Policy: We value your privacy. All personal information collected is used solely for processing orders and improving your shopping experience. We never share your data with third parties without consent.' },
    { text: 'Services: We offer fast delivery of clothes within 2 hours in your local area. Our dedicated team ensures you receive your orders promptly and in perfect condition.' },
    { text: 'Terms of Service: By using our platform, you agree to our terms. All products are subject to availability. Prices may change without notice.' },
    { text: 'Return Policy: Items can be returned within 7 days of delivery if unused and in original packaging. Refunds are processed within 5 business days.' },
    { text: 'Customer Support: Our support team is available 24/7 via WhatsApp, email, and phone to assist you with any queries or concerns.' },
  ];

  console.log('Generating embeddings for info entries...');
  const texts = info.map(item => item.text);
  const embeddings = await groqEmbed(texts);

  if (!embeddings || embeddings.length !== texts.length) {
    throw new Error('Failed to generate embeddings for info entries.');
  }

  const docs = info.map((item, index) => ({
    ...item,
    embedding: embeddings[index],
  }));

  const created = await Info.insertMany(docs);
  return created;
}
