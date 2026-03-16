import { NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Knowledge base for common e-commerce queries
const knowledgeBase: { keywords: string[]; response: string }[] = [
  {
    keywords: ['men', 'mens', 'man', 'male', 'boys'],
    response: "We have a great selection of men's clothing! Browse our collection at /products?category=men. We offer shirts, pants, jackets, and more in various styles and sizes. Would you like me to help you find something specific?",
  },
  {
    keywords: ['women', 'womens', 'woman', 'female', 'girls', 'ladies'],
    response: "Our women's collection features elegant dresses, stylish tops, comfortable bottoms, and accessories. Check it out at /products?category=women. What type of items are you looking for?",
  },
  {
    keywords: ['shipping', 'deliver', 'delivery', 'time', 'days'],
    response: "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Free shipping is available on orders over $100. Orders are processed within 1-2 business days.",
  },
  {
    keywords: ['return', 'refund', 'exchange', 'money back'],
    response: "We want you to love your purchase! You can return most items within 30 days of delivery for a full refund. Items must be unworn with tags attached. Visit our returns page for more details.",
  },
  {
    keywords: ['size', 'sizing', 'fit', 'measurement'],
    response: "Our sizing guide helps you find the perfect fit. You can find it on each product page. We offer sizes XS to XL in most items. If you're between sizes, we recommend sizing up for a comfortable fit.",
  },
  {
    keywords: ['payment', 'pay', 'card', 'cash', 'money'],
    response: "We accept all major credit/debit cards (Visa, MasterCard, American Express), PayPal, and cash on delivery. All transactions are secure and encrypted.",
  },
  {
    keywords: ['discount', 'coupon', 'promo', 'code', 'sale', 'offer', 'deal'],
    response: "We regularly offer discounts and promotions! Sign up for our newsletter to receive exclusive offers. You can also check our homepage for current sales and use discount codes at checkout.",
  },
  {
    keywords: ['track', 'order status', 'where'],
    response: "You can track your order by logging into your account and visiting the Orders section. You'll receive tracking information via email once your order ships.",
  },
  {
    keywords: ['contact', 'support', 'help', 'customer service', 'email', 'phone'],
    response: "You can reach our customer support team at support@poridhan.com or through the contact form on our Contact page. We're available Monday to Friday, 9 AM to 6 PM.",
  },
  {
    keywords: ['quality', 'material', 'fabric', 'organic', 'sustainable'],
    response: "At Poridhan, we prioritize quality! Our garments are made from premium materials including organic cotton, linen, and sustainably sourced fabrics. Each piece is carefully crafted for durability and comfort.",
  },
  {
    keywords: ['new', 'latest', 'arrival', 'collection', 'fresh'],
    response: "Check out our latest arrivals at /products! We regularly update our collection with new styles. Don't forget to sign up for notifications about new arrivals.",
  },
  {
    keywords: ['price', 'cost', 'expensive', 'cheap', 'affordable'],
    response: "Our prices reflect the quality of our products. We offer a range of price points to suit different budgets. Sign up for our newsletter to get exclusive discounts!",
  },
];

// Default responses for unrecognized queries
const defaultResponses: string[] = [
  "I'd be happy to help! Could you tell me more about what you're looking for? You can ask about our products, shipping, returns, or anything else.",
  "That's a great question! Let me help you find what you need. Are you interested in our men's or women's collection?",
  "Thanks for reaching out! You can browse our full collection at /products, or I can help you with specific questions about sizing, shipping, or returns.",
  "I'm here to help! You can explore our products at /products, check out our About page for more info, or Contact us for specific inquiries.",
];

function getResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Check knowledge base for matching keywords
  for (const item of knowledgeBase) {
    for (const keyword of item.keywords) {
      if (lowerMessage.includes(keyword)) {
        return item.response;
      }
    }
  }

  // Return random default response
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export async function POST(request: Request) {
  try {
    const body: { message: string; history: ChatMessage[] } = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Simulate some processing time for more natural feel
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

    const response = getResponse(message);

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
    message: 'Poridhan Assistant API',
    status: 'active',
    capabilities: [
      'Product inquiries',
      'Shipping information',
      'Returns and refunds',
      'Sizing guidance',
      'Payment methods',
      'Discount codes',
      'Order tracking',
    ],
  });
}
