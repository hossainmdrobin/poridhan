import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { groqEmbed } from '@/lib/agent/modelManager';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const threshold = parseFloat(searchParams.get('threshold') || '0.5');

    if (!q || typeof q !== 'string') {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    await connectDB();

    let queryEmbedding: number[];
    try {
      const embedding = await groqEmbed(q);
      const normalized = Array.isArray(embedding)
        ? embedding.filter((v): v is number => typeof v === 'number')
        : [];

      if (!normalized.length || normalized.length !== (embedding as number[])?.length) {
        return NextResponse.json({ error: 'Failed to generate embedding for query' }, { status: 500 });
      }
      queryEmbedding = normalized;
    } catch (error) {
      console.error('Vector search embedding error:', error);
      return NextResponse.json({ error: 'Failed to generate embedding for query' }, { status: 500 });
    }

    const products = await Product.aggregate([
      {
        $vectorSearch: {
          index: 'product_embedding_vector',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit,
        },
      },
      {
        $match: { isActive: true },
      },
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
        $match: { score: { $gte: threshold } },
      },
    ]);

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Product vector search error:', error);
    return NextResponse.json({ error: 'Failed to perform vector search' }, { status: 500 });
  }
}
