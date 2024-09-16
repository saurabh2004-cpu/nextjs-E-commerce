import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.models";
import { ApiError } from "@/utils/ApiError";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
      },
      async authorize(credentials: any) {
        await dbConnect();
        console.log(credentials.phone)
        try {
          const user = await UserModel.findOne({ phone: credentials.phone });
          console.log("User Found:", user);
          if (!user) {
            throw new ApiError(400, "Invalid phone number");
          }

          // Generate verification code and expiry logic
          const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
          const expiryDate = new Date();
          expiryDate.setHours(expiryDate.getHours() + 1);

          // Update user document with verification code and expiry
          user.verifyCode = verifyCode;
          user.verifyCodeExpiry = expiryDate;
          await user.save();
          
          return {
            id: user._id.toString(), // Ensure id is mapped correctly
            isVerified: user.isVerified,
            username: user.username,
            fullname: user.fullname,
            phone: user.phone,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          if (error instanceof ApiError) {
            throw error;
          }
          throw new ApiError(500, "Error while logging in");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.fullname = user.fullname;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
        session.user.fullname = token.fullname;
        session.user.phone = token.phone;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 240 * 60 * 60, // 1 day in seconds
  },
  secret: process.env.NEXTAUTH_SECRET ,
  pages: {
    signIn: "/sign-in",
  },
};


// Types
import { DefaultSession } from "next-auth";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isVerified: boolean;
      username: string;
      fullname: string;
      phone: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    isVerified: boolean;
    username: string;
    fullname: string;
    phone: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isVerified: boolean;
    username: string;
    fullname: string;
    phone: string;
  }
}
