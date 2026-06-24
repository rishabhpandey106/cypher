import mongoose , {Schema , Document, Mongoose} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
    isBoosted?: boolean;
    amount?: number;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    isBoosted: {
        type: Boolean,
        default: false
    },
    amount: {
        type: Number,
        default: 0
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAccepting: boolean;
    walletBalance: number;
    messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/ , 'Please use valid Email address']
    },
    password: {
        type: String,
        required: true,
    },
    verifyCode: {
        type: String,
    },
    verifyCodeExpiry: {
        type: Date,
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    isAccepting: {
        type: Boolean,
        default: true,
    },
    walletBalance: {
        type: Number,
        default: 0,
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User" , UserSchema))

export default UserModel;