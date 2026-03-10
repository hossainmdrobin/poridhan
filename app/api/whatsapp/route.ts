import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import WhatsAppLead from '@/models/WhatsAppLead';

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '1234567890';
const WHATSAPP_MESSAGE = process.env.WHATSAPP_MESSAGE || 'Hi! I scanned your QR code for a discount.';

export function GET() {
  const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  return NextResponse.json({ url, message: WHATSAPP_MESSAGE });
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    await WhatsAppLead.create({
      phone: body.phone,
      discountCode: body.discountCode,
      source: body.source || 'qr',
      metadata: body.metadata,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WhatsApp lead error:', error);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
