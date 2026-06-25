import dbConnect from "@/utils/dbConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import PollModel from "@/models/Poll";
import { NextResponse as res } from "next/server";

export async function POST(req: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !session.user){
        return res.json({message: "User not authenticated", success: false},{status: 400});
    }

    try {
        const { question, options } = await req.json();

        if (!question || !options || !Array.isArray(options) || options.length < 2 || options.length > 4) {
             return res.json({message: "Invalid poll data. Need a question and 2-4 options.", success: false},{status: 400});
        }

        const newPoll = new PollModel({
            userId: user._id,
            question,
            options: options.map((opt: string, index: number) => ({
                id: String.fromCharCode(65 + index), // 'A', 'B', 'C', 'D'
                text: opt,
                freeVotes: 0,
                boostedVotes: 0
            }))
        });

        await newPoll.save();

        return res.json({message: "Poll created successfully", success: true, poll: newPoll},{status: 201});

    } catch (error) {
        console.error("Failed to create poll", error);
        return res.json({message: "Internal server error", success: false},{status: 500});
    }
}
