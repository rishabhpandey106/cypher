import { NextRequest, NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';
import UserModel from '@/models/User';
import dbConnect from '@/utils/dbConfig';

// Initialize Dodo client
// To go live: Change DODO_ENVIRONMENT to 'live_mode' and use your Live API Key
const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENT_KEY || process.env.DODO_PAYMENT_TEST_KEY || '',
  environment: (process.env.DODO_ENVIRONMENT as 'live_mode' | 'test_mode') || 'test_mode',
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { username, content, amount, return_url, pollId, optionId, expectedVotes } = await request.json();

    if (!amount) {
      return NextResponse.json({ message: 'Missing amount' }, { status: 400 });
    }

    if (!pollId && (!username || !content)) {
      return NextResponse.json({ message: 'Missing required fields for message boost' }, { status: 400 });
    }

    if (pollId && !optionId) {
      return NextResponse.json({ message: 'Missing optionId for poll boost' }, { status: 400 });
    }

    if (!pollId) {
      // Verify user exists for message boost
      const user = await UserModel.findOne({ username, isAccepting: true });
      if (!user) {
        return NextResponse.json({ message: 'User not found or not accepting messages' }, { status: 404 });
      }
    }

    // Metadata payload to pass to the webhook
    const metadata: Record<string, string> = {
      amount: amount.toString()
    };
    if (pollId) {
      metadata.pollId = pollId;
      metadata.optionId = optionId;
      if (expectedVotes) {
        metadata.expectedVotes = expectedVotes.toString();
      }
    } else {
      metadata.username = username;
      metadata.content = content;
    }

    const productId = pollId 
      ? process.env.DODO_PRODUCT_ID_2 
      : process.env.DODO_PRODUCT_ID;

    if (!productId) {
      return NextResponse.json({ message: 'Product ID configuration missing' }, { status: 500 });
    }

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
      return_url: return_url || (pollId ? `${baseUrl}/poll/${pollId}` : `${baseUrl}/u/${username}`),
      metadata: metadata, // Pass metadata securely
    });

    return NextResponse.json({ 
      success: true, 
      checkout_url: (session as any).checkout_url || (session as any).payment_link || (session as any).url
    });

  } catch (error: any) {
    console.error('Checkout API Error:', error);

    // Advanced debugging for 401 Unauthorized errors
    const isLiveKey = !!process.env.DODO_PAYMENT_KEY;
    const isTestKey = !!process.env.DODO_PAYMENT_TEST_KEY;
    const environmentConfig = (process.env.DODO_ENVIRONMENT as 'live_mode' | 'test_mode') || 'test_mode';

    return NextResponse.json({ 
      success: false, 
      message: error.message || 'Internal Server Error',
      diagnostic_info: {
        using_live_key: isLiveKey,
        using_test_key: isTestKey,
        environment: environmentConfig,
        hint: "If you are getting a 401 Unauthorized, it means your API key does not match the environment. For example, passing a Live Key when environment is 'test_mode', or passing a Test Key when environment is 'live_mode'."
      }
    }, { status: 500 });
  }
}
