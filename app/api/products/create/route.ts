import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { getAuthUser } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || (auth.role !== 'admin' && auth.role !== 'seller')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const slug = body.slug || slugify(body.name) + '-' + Date.now();

    const product = await Product.create({
      ...body,
      slug,
      seller: auth.userId,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product create error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
