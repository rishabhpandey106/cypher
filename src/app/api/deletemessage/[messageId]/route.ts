import dbConnect from "@/utils/dbConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User";

export async function DELETE(req:Request, {params}: {params: {messageId: string}}) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const User = session?.user;
    const messageID = params.messageId;

    if(!session || !session.user){
        return Response.json({message: "User not authenticated", success: false},{status: 400});
    }

    try {
        const res = await UserModel.updateOne({_id: User?._id},{$pull: {messages: {_id: messageID}}})
        if(res.modifiedCount == 0){
            return Response.json({message: "Message not found or already deleted", success: false},{status: 400})
        }
        return Response.json({message: "Message Deleted", success: true},{status: 200})
    } catch (error) {
        return Response.json({message: "Error while deleting messages", success: false},{status: 500})
    }
}


