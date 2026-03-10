import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import DiscountCode from '@/models/DiscountCode';
import { getAuthUser } from '@/lib/auth';
import { Types } from 'mongoose';

function generateOrderNumber(): string {
  return 'ORD' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { items, shippingAddress, paymentMethod, discountCode } = await req.json();

    if (!items?.length || !shippingAddress) {
      return NextResponse.json({ error: 'Items and shipping address required' }, { status: 400 });
    }

    let subtotal = 0;
    const orderItems = items.map((item: { productId: string; name: string; price: number; quantity: number; size: string; image?: string }) => {
      subtotal += item.price * item.quantity;
      return {
        product: new Types.ObjectId(item.productId),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.image,
      };
    });

    let discount = 0;
    let validCode: { type: string; value: number; minPurchase?: number } | null = null;

    if (discountCode) {
      const code = await DiscountCode.findOne({ code: discountCode.toUpperCase(), isActive: true });
      if (code) {
        if (code.expiresAt && new Date() > code.expiresAt) {
          return NextResponse.json({ error: 'Discount code expired' }, { status: 400 });
        }
        if (code.maxUses && code.usedCount >= code.maxUses) {
          return NextResponse.json({ error: 'Discount code limit reached' }, { status: 400 });
        }
        if (code.minPurchase && subtotal < code.minPurchase) {
          return NextResponse.json({ error: `Minimum purchase of ${code.minPurchase} required` }, { status: 400 });
        }
        validCode = { type: code.type, value: code.value, minPurchase: code.minPurchase };
      } else {
        return NextResponse.json({ error: 'Invalid discount code' }, { status: 400 });
      }
    }

    if (validCode) {
      discount = validCode.type === 'percentage' ? (subtotal * validCode.value) / 100 : Math.min(validCode.value, subtotal);
    }

    const total = Math.max(0, subtotal - discount);

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: auth.userId,
      items: orderItems,
      subtotal,
      discount,
      discountCode: discountCode || undefined,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      total,
    });

    if (validCode && discountCode) {
      await DiscountCode.updateOne({ code: discountCode.toUpperCase() }, { $inc: { usedCount: 1 } });
    }

    return NextResponse.json({ order, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Order create error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const role = auth.role;
    const filter: Record<string, string> = {};

    if (role === 'customer') {
      filter.customer = auth.userId;
    } else if (role === 'seller') {
      // Sellers see orders containing their products - handled in aggregation
    }

    let orders;
    if (role === 'customer') {
      orders = await Order.find(filter).sort({ createdAt: -1 }).populate('items.product', 'name images').lean();
    } else {
      orders = await Order.find().sort({ createdAt: -1 }).populate('items.product', 'name images seller').populate('customer', 'name email').lean();
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
