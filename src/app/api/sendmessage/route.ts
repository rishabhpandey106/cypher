import dbConnect from "@/utils/dbConfig";
import UserModel from "@/models/User";
import { Message } from "@/models/User";
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

        // --- Toxicity Filter ---
        try {
            const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash-lite' });
            const prompt = `Analyze the following message for toxicity, hate speech, cyberbullying, or severe negativity. Respond with ONLY 'TOXIC' if it violates these safety guidelines, or 'SAFE' if it is acceptable.\n\nMessage: "${content}"`;
            const result = await model.generateContent(prompt);
            const responseText = result.response.text().trim().toUpperCase();

            if (responseText.includes('TOXIC')) {
                return Response.json({message: "Message violates safety guidelines.", success: false},{status: 400})
            }
        } catch (filterError) {
            console.error("Toxicity filter failed:", filterError);
            // Fallback: allow the message if the AI check crashes, to avoid total outage
        }
        // ------------------------

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