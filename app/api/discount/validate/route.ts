import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import DiscountCode from '@/models/DiscountCode';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code required' }, { status: 400 });
    }

    const discountCode = await DiscountCode.findOne({ code: code.toUpperCase(), isActive: true });

    if (!discountCode) {
      return NextResponse.json({ valid: false, error: 'Invalid discount code' });
    }

    if (discountCode.expiresAt && new Date() > discountCode.expiresAt) {
      return NextResponse.json({ valid: false, error: 'Discount code expired' });
    }

    if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
      return NextResponse.json({ valid: false, error: 'Discount code limit reached' });
    }

    const total = subtotal || 0;
    if (discountCode.minPurchase && total < discountCode.minPurchase) {
      return NextResponse.json({
        valid: false,
        error: `Minimum purchase of ${discountCode.minPurchase} required`,
      });
    }

    const discount =
      discountCode.type === 'percentage' ? (total * discountCode.value) / 100 : Math.min(discountCode.value, total);

    return NextResponse.json({
      valid: true,
      discount,
      code: discountCode.code,
      type: discountCode.type,
      value: discountCode.value,
    });
  } catch (error) {
    console.error('Validate discount error:', error);
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
  }
}
