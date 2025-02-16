import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/models/user.models";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { redisClient } from "../redis/redis";


export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let currentuser = await redisClient.get("currentUser");

    if (currentuser) {
        return NextResponse.json(new ApiResponse(200,JSON.parse(currentuser),"user details fetched successfully"))
    } 

    await dbConnect()
    try {
        currentuser = await UserModel.findById(session.user.id)

        if (!currentuser) {
            return NextResponse.json(new ApiResponse(400,null,"user not found"));
        }
        
        await redisClient.set("currentUser",JSON.stringify(currentuser))

        return NextResponse.json(new ApiResponse(200,currentuser,"user details fetched successfully"))
    } catch (error) {
        console.log("error during fetching current logged in users deytails")
        throw new ApiError(500,"Internal server error")
    }

}
