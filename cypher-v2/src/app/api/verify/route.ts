import UserModel from "@/models/User";
import { UsernameSchema } from "@/schema/signupSchema";
import dbConnect from "@/utils/dbConfig";
import {z} from 'zod';

export async function POST(req: Request) {
    await dbConnect();
    try {
        const {username , code} = await req.json();
        const decodedUsername = decodeURIComponent(username);
        
        const user = await UserModel.findOne({username: decodedUsername});

        if(!user){
            return Response.json({message: "User not found", success: false},{status: 400});
        }

        const isCodeTrue = user.verifyCode === code;
        const isCodeExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeTrue && isCodeExpired){
            user.isVerified = true;
            await user.save()

            return Response.json({message: "Account Verified", success: true},{status: 200});
        }
        else if(!isCodeExpired){
            return Response.json({message: "Verification code Expired", success: false},{status: 400});
        }
        else{
            return Response.json({message: "Incorrect OTP", success: false},{status: 400});
        }

    } catch (error:any) {
        return Response.json({message: "Error while verifying code", success: false},{status: 500});
    }
}