import dbConnect from "@/utils/dbConfig";
import UserModel from "@/models/User";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request)
{
    await dbConnect();

    try {
        const {username, email, password} = await req.json();
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingVerifiedUser)
            {
                return Response.json({success : false, message: "Username is already registered"},{status: 400})
            }
        
        const existingUser = await UserModel.findOne({
            email
        })

        const verifyCode = Math.floor(10000 + Math.random() * 900000).toString();

        if(existingUser){
            if(existingUser.isVerified){
                return Response.json({success : false, message: "Email is already registered"},{status: 400})
            }
            else{
                const hashedPassword = await bcrypt.hash(password , 10);
                existingUser.password = hashedPassword;
                existingUser.verifyCode = verifyCode;
                existingUser.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUser.save();
            }

        }
        else {
            
            const hashedPassword = await bcrypt.hash(password , 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newData = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAccepting: true,
                messages: []
            })

            await newData.save();

        }

        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if(!emailResponse.success){
            return Response.json({success : false, message: emailResponse.message},{status: 400})
        }

        return Response.json({success : true, message: "User registered succesfully"},{status: 200})

    } catch (error) {
        console.log("Error while registering user", error)
        return Response.json({success : false, message: "Error while registering User"},{status: 500})
    }
}