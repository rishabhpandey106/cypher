import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConfig';
import UserModel from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.username !== 'rishabh' && session.user.username !== 'jaiyaxh')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    // Get all users who have a wallet balance > 0
    const users = await UserModel.find({ walletBalance: { $gt: 0 } }, 'username email walletBalance');

    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error: any) {
    console.error('Admin API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
