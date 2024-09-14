import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import UserModel from "@/app/models/user.models";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId) {
        return NextResponse.json(new ApiResponse(400, null, "User not found"), { status: 400 });
    }

    await dbConnect();

    try {
        const user = await UserModel.findByIdAndDelete(userId);

        if (!user) {
            return NextResponse.json(new ApiResponse(400, null, "User account not deleted"), { status: 400 });
        }

        return NextResponse.json(new ApiResponse(200, null, "User account deleted successfully"), { status: 200 });
    } catch (error) {
        console.log("Error while deleting account", error);
        throw new ApiError(500, "Internal server error");
    }
}
