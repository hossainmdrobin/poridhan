import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const reviews = await Review.find({ product: productId, isApproved: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const stats = await Review.aggregate([
      { $match: { product: productId, isApproved: true } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      reviews,
      stats: stats[0] ? { avg: stats[0].avg, count: stats[0].count } : { avg: 0, count: 0 },
    });
  } catch (error) {
    console.error('Reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { productId, rating, comment } = await req.json();

    if (!productId || !rating) {
      return NextResponse.json({ error: 'Product and rating required' }, { status: 400 });
    }

    const review = await Review.create({
      product: productId,
      user: auth.userId,
      rating,
      comment,
      isApproved: false,
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Review create error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
