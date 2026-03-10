import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const newArrival = searchParams.get('newArrival');
    const bestSeller = searchParams.get('bestSeller');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { isActive: true };

    if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug }).lean();
      if (cat) filter.category = cat._id;
    }
    if (featured === 'true') filter.isFeatured = true;
    if (newArrival === 'true') filter.isNewArrival = true;
    if (bestSeller === 'true') filter.isBestSeller = true;

    let query = Product.find(filter).populate('category', 'name slug').populate('seller', 'name').sort({ createdAt: -1 });

    if (search) {
      query = Product.find({ ...filter, $text: { $search: search } }).populate('category', 'name slug').populate('seller', 'name').sort({ score: { $meta: 'textScore' } });
    }

    const [products, total] = await Promise.all([
      query.skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
