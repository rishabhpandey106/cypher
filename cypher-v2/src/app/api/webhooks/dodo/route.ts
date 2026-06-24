import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConfig';
import UserModel, { Message } from '@/models/User';
import DodoPayments from 'dodopayments';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('dodopayments-signature') || request.headers.get('webhook-signature') || '';

    // If DODO_WEBHOOK_SECRET is provided in .env, you should verify the signature here
    // using the Dodo Payments SDK to prevent unauthorized requests.
    
    const event = JSON.parse(payload);
    
    // We only care about successful payments
    if (event.type === 'payment.succeeded' || event.type === 'checkout.succeeded') {
      const data = event.data;
      
      // Extract metadata passed during checkout creation
      const metadata = data.metadata || {};
      const username = metadata.username;
      const content = metadata.content;
      const amountStr = metadata.amount;
      
      if (!username || !content) {
        console.error('Webhook missing metadata:', metadata);
        return NextResponse.json({ success: false, message: 'Missing metadata' }, { status: 400 });
      }

      await dbConnect();
      const user = await UserModel.findOne({ username });
      
      if (!user) {
        console.error('User not found for webhook:', username);
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }

      // Read ACTUAL amount paid from Dodo (total_amount is in lowest denominator e.g. paise/cents)
      // Fallback to metadata.amount if missing for some reason
      const rawAmount = data.total_amount ? (data.total_amount / 100) : parseFloat(amountStr || '100');
      
      // Calculate platform fee (e.g. 10%)
      const platformFee = rawAmount * 0.10;
      const creatorEarnings = rawAmount - platformFee;

      // Create boosted message
      const newMessage = {
        content,
        createdAt: new Date(),
        isBoosted: true,
        amount: rawAmount,
      };

      user.messages.push(newMessage as Message);
      
      // Update wallet balance
      user.walletBalance = (user.walletBalance || 0) + creatorEarnings;
      
      await user.save();
      console.log(`Successfully processed CypherBoost for ${username}! Added ${creatorEarnings} to wallet.`);
    }

    return NextResponse.json({ success: true, message: 'Webhook received' }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json({ success: false, message: 'Webhook handler failed' }, { status: 500 });
  }
}
