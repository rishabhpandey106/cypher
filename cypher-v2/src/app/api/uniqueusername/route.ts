import UserModel from "@/models/User";
import { UsernameSchema } from "@/schema/signupSchema";
import dbConnect from "@/utils/dbConfig";
import {z} from 'zod';

const UsernameQuerySchema = z.object({
    username: UsernameSchema
})

export async function GET(req: Request) {
    await dbConnect();

    try {
        
        const {searchParams} = new URL(req.url);
        const usernameParam = {username: searchParams.get('username')};

        const unique = UsernameQuerySchema.safeParse(usernameParam);

        if(!unique.success){
            const usernmaeError = unique.error.format().username?._errors || [];
            return Response.json({message: usernmaeError?.length > 0 ? usernmaeError.join(", ") : "Incorrect username format" , success: false},{status: 400});
        }

        const {username} = unique.data;

        // is user is not verified, username iwll be given to another user
        const existingUser = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUser){
            return Response.json({message: "Username is already taken", success: false},{status: 400});
        }

        return Response.json({message: "Username is available", success: true},{status: 200});

    } catch (error:any) {

        console.log("Error in username uniqueness", error);
        return Response.json({message: "Error in username uniqueness" , success: false},{status: 500});
    }
}