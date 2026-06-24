import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConfig';
import UserModel from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.username !== 'rishabh' && session.user.username !== 'jaiyaxh')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { username } = await request.json();
    if (!username) {
      return NextResponse.json({ message: 'Username required' }, { status: 400 });
    }

    await dbConnect();
    
    // Reset wallet balance to 0
    await UserModel.updateOne({ username }, { $set: { walletBalance: 0 } });

    return NextResponse.json({ success: true, message: 'Balance reset to zero.' }, { status: 200 });
  } catch (error: any) {
    console.error('Admin API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
