import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse, GoogleGenerativeAIStream } from 'ai';
import { GoogleGenerativeAI } from '@google/generative-ai';
 
// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-to-prevent-build-crash',
});

// Create a Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
 
export const runtime = 'edge';
 
export async function POST(req: Request) {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
      
    try {
        const response = await openai.completions.create({
          model: 'gpt-3.5-turbo-instruct',
          max_tokens: 400,
          stream: true,
          prompt,
        });
       
        const stream = OpenAIStream(response);
        
        return new StreamingTextResponse(stream);

    } catch (error) {
        console.log("OpenAI failed, falling back to Gemini", error instanceof Error ? error.message : String(error));
        try {
            // Fallback to Gemini
            const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash-lite' });
            
            // Generate content stream using Gemini
            const response = await model.generateContentStream(prompt);
            const stream = GoogleGenerativeAIStream(response);
            
            return new StreamingTextResponse(stream);
        } catch (geminiError) {
            console.log("Gemini fallback also failed", geminiError);
            return Response.json({message: "Failed to generate suggestions", success: false},{status: 500});
        }
    }
}