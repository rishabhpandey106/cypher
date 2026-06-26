import { Metadata } from 'next';
import dbConnect from '@/utils/dbConfig';
import PollModel from '@/models/Poll';
import mongoose from 'mongoose';

export const revalidate = 86400; // Cache for 24 hours

export async function generateMetadata(
  context: { params: Promise<{ pollId: string }> | { pollId: string } }
): Promise<Metadata> {
  try {
    const resolvedParams = await context.params;
    const pollId = resolvedParams.pollId;

    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return { title: 'Cypher Poll' };
    }

    await dbConnect();
    const poll = await PollModel.findById(pollId);

    if (!poll) {
      return { title: 'Poll Not Found | Cypher' };
    }

    const title = `Cypher Poll: ${poll.question}`;
    const description = `Vote on ${poll.question} - Cypher`;
    const ogUrl = `https://cypher.itsrishabh.tech/api/og/poll/${pollId}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: ogUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogUrl],
      },
    };
  } catch (error) {
    return { title: 'Cypher Poll' };
  }
}

export default function PollLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
