import dbConnect from "@/app/lib/dbConnect";
import UserModel, { IUser } from "@/app/models/user.models";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();

    const { username, fullname, phone,email } = await request.json();
    try {
        const existingUser = await UserModel.findOne({phone:phone })

        if (existingUser) {
            return NextResponse.json(new ApiResponse(400,null, "User already registered with this mobile number"), { status: 400 });
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        const user = await UserModel.create({
            username,
            fullname,
            phone,
            email,
            gender :'',
            verifyCode,
            verifyCodeExpiry: expiryDate,
        }) 

        const response = NextResponse.json(new ApiResponse(200, user, "User successfully registered. Please verify your account using the verification code."));
        return response;

    } catch (error) {
        console.error("Error while registering user:", error);
        return NextResponse.json(new ApiError(500, "Failed to register user"), { status: 500 });
    }
}
