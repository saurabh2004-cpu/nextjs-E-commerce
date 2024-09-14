import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";


export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await dbConnect()
    try {
        
    } catch (error) {
        throw new ApiError(500,"interbal server error")
    }

}