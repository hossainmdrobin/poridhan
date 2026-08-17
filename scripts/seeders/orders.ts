import { loadModels } from '../utils';

export async function seedOrders(force = false) {
  const { Order, Product, User } = await loadModels();
  const count = await Order.countDocuments();
  if (count > 0 && !force) {
    console.log('Orders already exist. Use --force to re-seed.');
    return [];
  }

  if (force) {
    await Order.deleteMany({});
  }

  const customer = await User.findOne({ role: 'customer' });
  const product = await Product.findOne();
  if (!customer || !product) {
    console.log('Required data (customer/product) not found. Run seed users and products first.');
    return [];
  }

  const orders = [
    { orderNumber: 'ORD-001', customer: customer._id, items: [{ product: product._id, name: product.name, price: product.price, quantity: 2, size: 'M', image: product.images[0] }], subtotal: 59.98, discount: 5.0, discountCode: 'WELCOME5', shippingAddress: { name: customer.name, phone: '01700000000', address: '123 Main St', city: 'Dhaka' }, paymentMethod: 'cod', paymentStatus: 'pending', status: 'pending', total: 54.98 },
    { orderNumber: 'ORD-002', customer: customer._id, items: [{ product: product._id, name: product.name, price: product.price, quantity: 1, size: 'L', image: product.images[0] }], subtotal: 29.99, discount: 0, shippingAddress: { name: customer.name, phone: '01700000000', address: '456 Oak Ave', city: 'Chittagong' }, paymentMethod: 'online', paymentStatus: 'paid', status: 'processing', total: 29.99 },
  ];

  const created = await Order.insertMany(orders);
  console.log(`Seeded ${created.length} orders`);
  return created;
}
