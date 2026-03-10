import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Newsletter from '@/models/Newsletter';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    await Newsletter.findOneAndUpdate({ email: email.toLowerCase() }, { email: email.toLowerCase(), isSubscribed: true }, { upsert: true });
    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }
}
