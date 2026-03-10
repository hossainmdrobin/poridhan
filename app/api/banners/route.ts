import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Banner from '@/models/Banner';

export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find({ isActive: true }).sort({ position: 1 }).lean();
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Banners error:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}
