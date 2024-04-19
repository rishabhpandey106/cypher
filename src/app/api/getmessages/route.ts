import dbConnect from "@/utils/dbConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function GET(req:Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const User = session?.user;

    if(!session || !session.user){
        return Response.json({message: "User not authenticated", success: false},{status: 400});
    }

    const userID = new mongoose.Types.ObjectId(User?._id);

    try {
        const user = await UserModel.aggregate([
            {$match: {id: userID}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])

        if(!user){
            return Response.json({message: "User not found", success: false},{status: 400})
        }

        return Response.json({messages: user[0].messages , success: true},{status: 200});

    } catch (error) {
        return Response.json({message: "Error while GET messages", success: false},{status: 500})
    }
}


