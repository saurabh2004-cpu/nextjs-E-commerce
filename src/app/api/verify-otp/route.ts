import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();
    const { otp, phone } = await request.json();


    try {
        if (!otp || !phone) {
            throw new ApiError(400, "OTP and phone No is required");
        }

        const user = await UserModel.findOne({ phone });
        if (!user) {
            throw new ApiError(400, "User does not exist with this phone number");
        }

        const isCodeValid = user.verifyCode === otp;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (!isCodeValid) {
            return NextResponse.json(new ApiResponse(400,null, "Please enter the correct OTP"), );
        } else if (!isCodeNotExpired) {
            return NextResponse.json(new ApiResponse(400,null, "Verification code has expired. Click to send again"));
        } else {
            user.isVerified = true;
            await user.save();

            return NextResponse.json(new ApiResponse(200, true, "Verification completed"), { status: 200 });
        }
    } catch (error) {
        console.error("Error while verifying code:", error);
        return NextResponse.json(new ApiError(500, "Failed to verify code"), { status: 500 });
    }
}
