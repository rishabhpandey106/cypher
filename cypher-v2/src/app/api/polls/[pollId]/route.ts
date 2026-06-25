import dbConnect from "@/utils/dbConfig";
import PollModel from "@/models/Poll";
import { NextResponse as res } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request, context: any){
    await dbConnect();
    
    try {
        const params = await context.params;
        const { pollId } = params;
        
        console.log("Fetching poll ID:", pollId);

        if (!pollId || !mongoose.Types.ObjectId.isValid(pollId)) {
            return res.json({message: "Invalid Poll ID", success: false},{status: 400});
        }

        const poll = await PollModel.findById(pollId).populate("userId", "username"); // populate username if needed

        if (!poll) {
             return res.json({message: "Poll not found", success: false},{status: 404});
        }

        return res.json({message: "Poll fetched successfully", success: true, poll},{status: 200});

    } catch (error) {
        console.error("Failed to fetch poll", error);
        return res.json({message: "Internal server error", success: false},{status: 500});
    }
}
