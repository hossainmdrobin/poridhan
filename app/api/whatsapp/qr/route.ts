import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '1234567890';
const WHATSAPP_MESSAGE = process.env.WHATSAPP_MESSAGE || 'Hi! I scanned your QR code for a 10% discount.';

export async function GET() {
  try {
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    const qrDataUrl = await QRCode.toDataURL(url, { width: 256, margin: 2 });
    return NextResponse.json({ qr: qrDataUrl, url });
  } catch (error) {
    console.error('QR generation error:', error);
    return NextResponse.json({ error: 'Failed to generate QR' }, { status: 500 });
  }
}
