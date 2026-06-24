import { NextRequest, NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import UserModel from '@/models/User';
import dbConnect from '@/utils/dbConfig';

// Initialize Dodo client (Ensure DODO_PAYMENT_TEST_KEY is in .env)
const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENT_TEST_KEY,
  environment: 'test_mode',
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { username, content, amount } = await request.json();

    if (!username || !content || !amount) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Verify user exists
    const user = await UserModel.findOne({ username, isAccepting: true });
    if (!user) {
      return NextResponse.json({ message: 'User not found or not accepting messages' }, { status: 404 });
    }

    // Metadata payload to pass to the webhook so we know WHAT message to save later!
    const metadata = {
      username: username,
      content: content,
      amount: amount.toString()
    };

    const productId = process.env.DODO_PRODUCT_ID || "prod_PLACEHOLDER";

    // Dynamically get the domain so it works perfectly on localhost and Vercel without env vars
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    // We omit 'amount' here so Dodo uses the Product's default pricing
    // If the Product is set to "Pay What You Want" in the dashboard, 
    // it will let the user type the amount!
    const session = await client.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1
        }
      ],
      return_url: `${baseUrl}/u/${username}?payment_success=true`,
      metadata: metadata, // Pass metadata securely
    });

    return NextResponse.json({ 
      success: true, 
      checkout_url: (session as any).checkout_url || (session as any).payment_link || (session as any).url
    });

  } catch (error: any) {
    console.error('Dodo Payments Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Payment initiation failed' }, { status: 500 });
  }
}
