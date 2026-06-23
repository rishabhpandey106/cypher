import { Message } from "@/models/User";

export interface apiResponse {
    message: string;
    success: boolean;
    messages?: Array<Message>;
    isAccepting?: boolean;
}