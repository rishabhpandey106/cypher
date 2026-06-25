import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConfig';
import PollModel from '@/models/Poll';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ pollId: string }> | { pollId: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: 'Not Authenticated' }, { status: 401 });
    }

    const resolvedParams = await context.params;
    const pollId = resolvedParams.pollId;

    const poll = await PollModel.findById(pollId);

    if (!poll) {
      return NextResponse.json({ success: false, message: 'Poll not found' }, { status: 404 });
    }

    // Verify ownership
    if (poll.userId.toString() !== session.user._id) {
      return NextResponse.json({ success: false, message: 'Unauthorized to modify this poll' }, { status: 403 });
    }

    // Toggle isActive
    poll.isActive = !poll.isActive;
    await poll.save();

    return NextResponse.json({ 
      success: true, 
      message: `Poll is now ${poll.isActive ? 'Active' : 'Closed'}`,
      isActive: poll.isActive
    }, { status: 200 });

  } catch (error) {
    console.error('Error toggling poll status:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
