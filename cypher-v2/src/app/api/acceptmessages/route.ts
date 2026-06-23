import dbConnect from "@/utils/dbConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import { User } from "next-auth";

export async function POST(req: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !session.user){
        return Response.json({message: "User not authenticated", success: false},{status: 400});
    }

    const userID = user?._id;
    const {acceptMessages} = await req.json();

    try {
        const newdata = await UserModel.findByIdAndUpdate(userID , {isAccepting: acceptMessages}, {new: true})


        if(!newdata){
            return Response.json({message: "Cant update the user toggle", success: false},{status: 400});
        }
        
        return Response.json({message: "Updated the accept message toggle value", newdata, success: true},{status: 200});
    } catch (error) {
        return Response.json({message: "Error while accepting messages", success: false},{status: 500});
    }
}

export async function GET(req: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !session.user){
        return Response.json({message: "User not authenticated", success: false},{status: 400});
    }

    const userID = user?._id;

    try {
        const user_found = await UserModel.findById(userID);

        if(!user_found){
            return Response.json({message: "User not found", success: false},{status: 400});
        }

        return Response.json({message: "Updated the accept message toggle value", isAccepting: user_found.isAccepting , success: true},{status: 200});
    } catch (error) {
        return Response.json({message: "Error while GET toggle accept messages", success: false},{status: 500});
    }
}