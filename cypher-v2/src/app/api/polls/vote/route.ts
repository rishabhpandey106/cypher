import dbConnect from "@/utils/dbConfig";
import PollModel from "@/models/Poll";
import { NextResponse as res } from "next/server";
import mongoose from "mongoose";

export async function POST(req: Request){
    await dbConnect();

    try {
        const { pollId, optionId } = await req.json();

        if (!mongoose.Types.ObjectId.isValid(pollId) || !optionId) {
            return res.json({message: "Invalid Poll ID or Option", success: false},{status: 400});
        }

        // IP Check logic
        const ip = req.headers.get("x-forwarded-for") || req.headers.get("remote-addr") || "unknown";
        
        // In a production app, we would query a VotedIPs collection here.
        // For simplicity and to not bloat the database immediately, we will just rely on localStorage 
        // on the frontend for V1, but we still do the DB increment here safely.

        const poll = await PollModel.findById(pollId);

        if (!poll) {
             return res.json({message: "Poll not found", success: false},{status: 404});
        }

        if (!poll.isActive) {
            return res.json({message: "Poll is closed", success: false},{status: 400});
        }

        const optionIndex = poll.options.findIndex(opt => opt.id === optionId);
        if (optionIndex === -1) {
            return res.json({message: "Invalid Option", success: false},{status: 400});
        }

        poll.options[optionIndex].freeVotes += 1;
        await poll.save();

        return res.json({message: "Vote cast successfully", success: true, poll},{status: 200});

    } catch (error) {
        console.error("Failed to cast vote", error);
        return res.json({message: "Internal server error", success: false},{status: 500});
    }
}
