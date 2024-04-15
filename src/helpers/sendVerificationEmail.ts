import { resend } from "../utils/resend"
import VerificationEmail from "../../emails/verificationTemplate"
import { apiResponse } from "@/types/apiResponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<apiResponse>{
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({username: username, otp: verifyCode}),
          });

        return {success: true , message: "Sent verification mail succesfully"}
    } catch (error) {
        console.log("Error while sending verification mail", error);
        return {success: false , message: "Can't send verification mail"}
    }
}
