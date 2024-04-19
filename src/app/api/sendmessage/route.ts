import dbConnect from "@/utils/dbConfig";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(req: Request){
    await dbConnect();

    const {username, content} = await req.json();

    try {
        const user = await UserModel.findOne({ username }).exec();

        if(!user){
            return Response.json({message: "User not found", success: false},{status: 400})
        }
        
        if(!user.isAccepting){
            return Response.json({message: "User isn't accepting messages", success: false},{status: 400})
        }

        const newMessage = {
            content,
            createdAt: new Date()
        }

        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({message: "Message has been saved in database", success: true},{status: 200})
    } catch (error) {
        return Response.json({message: "Error while populating messages", success: false},{status: 500})
    }
}