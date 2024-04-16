import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/utils/dbConfig";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
          id: 'credentials',
          name: 'Credentials',
          credentials: {
            email: { label: 'Email', type: 'text' },
            password: { label: 'Password', type: 'password' },
          },
          async authorize(credentials: any): Promise<any> {
            await dbConnect();

            try {
              const user = await UserModel.findOne({
                $or: [
                  { email: credentials.identifier },
                  { username: credentials.identifier },
                ],
              });

              if (!user) {
                throw new Error('No user found with this email');
              }

              if (!user.isVerified) {
                throw new Error('Please verify your account before signing');
              }

              const isPasswordCorrect = await bcrypt.compare(
                credentials.password,
                user.password
              );

              if (isPasswordCorrect) {
                return user;
              } 
              else {
                throw new Error('Incorrect password');
              }

            } catch (err: any) {
              throw new Error(err);
            }
          },
        }),
      ],
    
    callbacks: {
        async jwt({ token, user }) {

            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAccepting = user.isAccepting
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAccepting = token.isAccepting
                session.user.username = token.username
            }
            return session
        }
        
    },
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/signin'
    },
    secret: process.env.NEXTAUTH_SECRET,
    
}