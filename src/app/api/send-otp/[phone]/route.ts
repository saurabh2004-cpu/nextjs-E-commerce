import dbConnect from "@/app/lib/dbConnect";
import twilio from 'twilio';
import { NextResponse } from "next/server";
import UserModel from "@/app/models/user.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";

export async function GET(request: Request, { params }: { params: { phone: string } }) {
    await dbConnect();
    console.log("request get")
    const phone = params.phone;

    try {
        const existingUser = await UserModel.findOne({ phone });

        if (!existingUser) {
            throw new ApiError(400, "User is not registered to get verification code");
        }

        const otp = existingUser.verifyCode;
        const accountSid = process.env.TWILIO_ACCOUNT_SID 
        const authToken = process.env.TWILIO_AUTH_TOKEN
        const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER 
        
        const client = twilio(accountSid, authToken);

        if (!accountSid || !authToken || !twilioPhoneNumber) {
            throw new ApiError(500, "Missing Twilio configuration");
        }

        console.log("twilio",accountSid,authToken,twilioPhoneNumber)

        const message = await client.messages.create({
            body: `Your verification code is ${otp}`,
            from: twilioPhoneNumber,
            to: `+91${phone}`,
        });

        if (!message) {
            throw new ApiError(500, "Error sending verification code");
        }

        return NextResponse.json(new ApiResponse(200, otp, "Verification code sent successfully"));
    } catch (error) {
        console.error("Error while sending OTP:", error);

        if (error instanceof ApiError) {
            return NextResponse.json({ error: error.message }, { status: error.statusCode });
        } else {
            return NextResponse.json({ error: "Error while sending OTP" }, { status: 500 });
        }
    }
}
