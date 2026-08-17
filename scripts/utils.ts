import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectToDB from '../lib/db';

export async function connect() {
  await connectToDB();
}

export async function disconnect() {
  await mongoose.disconnect();
}

export async function loadModels() {
  const { default: User } = await import('../models/User');
  const { default: Category } = await import('../models/Category');
  const { default: Product } = await import('../models/Product');
  const { default: Order } = await import('../models/Order');
  const { default: DiscountCode } = await import('../models/DiscountCode');
  const { default: Banner } = await import('../models/Banner');
  const { default: Testimonial } = await import('../models/Testimonial');
  const { default: Review } = await import('../models/Review');
  const { default: Newsletter } = await import('../models/Newsletter');
  const { default: WhatsAppLead } = await import('../models/WhatsAppLead');

  return { User, Category, Product, Order, DiscountCode, Banner, Testimonial, Review, Newsletter, WhatsAppLead };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
