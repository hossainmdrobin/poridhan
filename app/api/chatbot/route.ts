import { NextResponse } from 'next/server';
import { invokeAgent } from '@/lib/agent/index.js';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  try {
    const body: { message: string; history: ChatMessage[] } = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const allMessages = [
        ...history.map((msg) => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: message }
    ];

    const response = await invokeAgent(allMessages, 'chatbot');

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Styrob Assistant API',
    status: 'active',
    capabilities: [
      'Product inquiries',
      'Shipping information',
      'Returns and refunds',
      'Sizing guidance',
      'Payment methods',
      'Discount codes',
      'Order tracking',
      'Store policies and info (via AI agent)',
    ],
  });
}
