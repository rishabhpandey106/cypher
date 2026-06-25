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
      
      // Payment gateways often lowercase metadata keys!
      const pollId = metadata.pollId || metadata.pollid;
      const optionId = metadata.optionId || metadata.optionid;
      const expectedVotesStr = metadata.expectedVotes || metadata.expectedvotes;

      await dbConnect();
      
      const taxAmount = data.tax ? (data.tax / 100) : 0;
      const rawAmount = data.total_amount ? ((data.total_amount / 100) - taxAmount) : parseFloat(amountStr || '100');
      
      const platformFee = rawAmount * 0.10;
      const creatorEarnings = rawAmount - platformFee;

      // --- POLL BOOST LOGIC ---
      if (pollId && optionId) {
        const PollModel = (await import('@/models/Poll')).default;
        const poll = await PollModel.findById(pollId);
        if (!poll) {
          console.error('Poll not found for webhook:', pollId);
          return NextResponse.json({ success: false, message: 'Poll not found' }, { status: 404 });
        }
        
        // Calculate exact votes strictly based on cold hard cash deposited!
        // 1 USD = 50 votes. 100 INR = 50 votes (so 1 INR = 0.5 votes).
        const currency = data.currency || 'USD';
        let actualVotesToAdd = 0;
        
        if (currency.toUpperCase() === 'INR') {
          actualVotesToAdd = Math.floor(rawAmount * 0.5);
        } else {
          actualVotesToAdd = Math.floor(rawAmount * 50);
        }

        // If for some reason they paid less than 1 vote worth, default to 1 so the UI doesn't break
        if (actualVotesToAdd < 1) actualVotesToAdd = 1;

        const result = await PollModel.updateOne(
          { _id: pollId, "options.id": optionId },
          { 
            $inc: { 
              "options.$.boostedVotes": actualVotesToAdd,
              totalRevenue: rawAmount 
            } 
          }
        );

        if (result.modifiedCount === 0) {
           console.error('Failed to update poll votes:', pollId);
        }

        // Add money to creator wallet
        const user = await UserModel.findById(poll.userId);
        if (user) {
            user.walletBalance = (user.walletBalance || 0) + creatorEarnings;
            await user.save();
        }

        return NextResponse.json({ success: true, message: 'Poll boosted successfully' });
      }

      // --- MESSAGE BOOST LOGIC (Original) ---
      if (!username || !content) {
        console.error('Webhook missing metadata for message:', metadata);
        return NextResponse.json({ success: false, message: 'Missing metadata' }, { status: 400 });
      }

      const user = await UserModel.findOne({ username });
      
      if (!user) {
        console.error('User not found for webhook:', username);
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
      }

      const newMessage = {
        content,
        createdAt: new Date(),
        isBoosted: true,
        amount: rawAmount,
      };

      user.messages.push(newMessage as any);
      
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
