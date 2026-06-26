import dbConnect from "@/utils/dbConfig";
import PollModel from "@/models/Poll";
import { NextResponse as res } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function POST(req: Request){
    await dbConnect();

    try {
        const { pollId, optionId } = await req.json();

        if (!mongoose.Types.ObjectId.isValid(pollId) || !optionId) {
            return res.json({message: "Invalid Poll ID or Option", success: false},{status: 400});
        }

        // Cookie Check logic
        const cookieStore = await cookies();
        const hasVotedCookie = cookieStore.get(`voted_poll_${pollId}`);
        
        if (hasVotedCookie) {
            return res.json({message: "You have already voted.", success: false},{status: 429});
        }

        // IP Check logic
        const ip = req.headers.get("x-forwarded-for") || req.headers.get("remote-addr") || "unknown";
        
        if (ip !== "unknown") {
            const redisKey = `poll_${pollId}_ip_${ip}`;
            const hasVotedIP = await redis.get(redisKey);
            
            if (hasVotedIP) {
                return res.json({message: "You have already voted.", success: false},{status: 429});
            }
        }

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

        if (ip !== "unknown") {
            const redisKey = `poll_${pollId}_ip_${ip}`;
            // Set expiry to 24 hours (86400 seconds)
            await redis.setex(redisKey, 86400, "voted");
        }

        const response = res.json({message: "Vote cast successfully", success: true, poll},{status: 200});
        
        response.cookies.set(`voted_poll_${pollId}`, 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 86400 // 24 hours
        });

        return response;

    } catch (error) {
        console.error("Failed to cast vote", error);
        return res.json({message: "Internal server error", success: false},{status: 500});
    }
}
