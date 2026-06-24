import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: 'Not Authenticated' }, { status: 401 });
    }

    const { q, a, b } = await request.json();

    if (!q) {
      return NextResponse.json({ success: false, message: 'Question is required' }, { status: 400 });
    }

    const secret = process.env.NEXTAUTH_SECRET || 'default_secret_for_local_testing_only';
    
    // Create a strict string combination to sign
    // Format: "q|a|b"
    const dataToSign = `${q}|${a || ''}|${b || ''}`;
    
    const signature = crypto.createHmac('sha256', secret).update(dataToSign).digest('hex');

    return NextResponse.json({ success: true, signature }, { status: 200 });

  } catch (error: any) {
    console.error('Sign Embed Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
