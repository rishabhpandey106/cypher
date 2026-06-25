import dbConnect from "@/utils/dbConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import PollModel from "@/models/Poll";
import { NextResponse as res } from "next/server";

export async function GET(req: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !user){
        return res.json({message: "User not authenticated", success: false},{status: 400});
    }

    try {
        const polls = await PollModel.find({ userId: user._id }).sort({ createdAt: -1 });

        return res.json({message: "Polls fetched successfully", success: true, polls},{status: 200});

    } catch (error) {
        console.error("Failed to fetch polls", error);
        return res.json({message: "Internal server error", success: false},{status: 500});
    }
}
