#!/usr/bin/env tsx
import { Command } from 'commander';
import { connect, disconnect } from './utils';
import { seedUsers, seedCategories, seedProducts, seedOrders, seedDiscounts, seedBanners, seedTestimonials, seedReviews, seedNewsletters, clearAll } from './seeders';

const program = new Command();

program
  .name('seed')
  .description('Database seeder CLI for Poridhan')
  .version('1.0.0');

program
  .command('all')
  .description('Seed all initial data')
  .option('--force', 'Force re-seed even if data exists')
  .action(async (options) => {
    await connect();
    try {
      await seedUsers(options.force);
      await seedCategories(options.force);
      await seedProducts(options.force);
      await seedOrders(options.force);
      await seedDiscounts(options.force);
      await seedBanners(options.force);
      await seedTestimonials(options.force);
      await seedReviews(options.force);
      await seedNewsletters(options.force);
      console.log('Seed complete');
    } finally {
      await disconnect();
    }
  });

program
  .command('users')
  .description('Seed users')
  .option('--force', 'Force re-seed even if data exists')
  .action(async (options) => {
    await connect();
    try {
      await seedUsers(options.force);
    } finally {
      await disconnect();
    }
  });

program
  .command('categories')
  .description('Seed categories')
  .option('--force', 'Force re-seed even if data exists')
  .action(async (options) => {
    await connect();
    try {
      await seedCategories(options.force);
    } finally {
      await disconnect();
    }
  });

program
  .command('products')
  .description('Seed products')
  .option('--force', 'Force re-seed even if data exists')
  .action(async (options) => {
    await connect();
    try {
      await seedProducts(options.force);
    } finally {
      await disconnect();
    }
  });

program
  .command('orders')
  .description('Seed orders')
  .option('--force', 'Force re-seed even if data exists')
  .action(async (options) => {
    await connect();
    try {
      await seedOrders(options.force);
    } finally {
      await disconnect();
    }
  });

program
  .command('discounts')
  .description('Seed discount codes')
  .option('--force', 'Force re-seed even if data exists')
  .action(async (options) => {
    await connect();
    try {
      await seedDiscounts(options.force);
    } finally {
      await disconnect();
    }
  });

program
  .command('banners')
  .description('Seed banners')
  .option('--force', 'Force re-seed even if data exists')
  .action(async (options) => {
    await connect();
    try {
      await seedBanners(options.force);
    } finally {
      await disconnect();
    }
  });

program
  .command('testimonials')
  .description('Seed testimonials')
  .option('--force', 'Force re-seed even if data exists')
  .action(async (options) => {
    await connect();
    try {
      await seedTestimonials(options.force);
    } finally {
      await disconnect();
    }
  });

program
  .command('reviews')
  .description('Seed reviews')
  .option('--force', 'Force re-seed even if data exists')
  .action(async (options) => {
    await connect();
    try {
      await seedReviews(options.force);
    } finally {
      await disconnect();
    }
  });

program
  .command('newsletters')
  .description('Seed newsletters')
  .option('--force', 'Force re-seed even if data exists')
  .action(async (options) => {
    await connect();
    try {
      await seedNewsletters(options.force);
    } finally {
      await disconnect();
    }
  });

program
  .command('clear')
  .description('Clear all seeded data')
  .action(async () => {
    await connect();
    try {
      await clearAll();
      console.log('Clear complete');
    } finally {
      await disconnect();
    }
  });

program
  .command('reset')
  .description('Clear all data and re-seed everything')
  .option('--force', 'Force re-seed even if data exists')
  .action(async (options) => {
    await connect();
    try {
      await clearAll();
      await seedUsers(options.force);
      await seedCategories(options.force);
      await seedProducts(options.force);
      await seedOrders(options.force);
      await seedDiscounts(options.force);
      await seedBanners(options.force);
      await seedTestimonials(options.force);
      await seedReviews(options.force);
      await seedNewsletters(options.force);
      console.log('Reset complete');
    } finally {
      await disconnect();
    }
  });

program.parse();
