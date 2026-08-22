import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const product = await Product.findOne({ slug, isActive: true })
      .lean();

    if (!product || !product.embedding) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const relatedProducts = await Product.aggregate([
      {
        $vectorSearch: {
          index: 'autoembed_index',
          path: 'embedding',
          queryVector: product.embedding,
          numCandidates: 100,
          limit: 5,
        },
      },
      // {
      //   $match: { isActive: true },
      // },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          price: 1,
          discountPrice: 1,
          images: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
      {
        $match: {
          score: {
            $gte: 0.5,
            $lt: 1
          }
        }
      }
    ]);


    return NextResponse.json({ ...product, embedding: [], relatedProducts });
  } catch (error) {
    console.error('Product error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
