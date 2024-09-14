import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";
import UserModel from "@/app/models/user.models";
import { ApiError } from "@/utils/ApiError";
import dbConnect from "@/app/lib/dbConnect";


export async function POST(req:NextRequest){
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(new ApiResponse(400,null,"not authenticated"));
    }

    const {username,fullname,gender,phone,email} = await req.json()
    await dbConnect()
    try {
        const user = await UserModel.findById(session.user.id)
    
        if(!user){
            throw new ApiError(404,"use not found")
        }
    
        user.username = username ||user.username
        user.fullname = fullname || user.fullname
        user.gender = gender || user.gender
        user.phone = phone || user?.phone
        user.email = email || user?.email
    
        await user.save()
    
        return NextResponse.json(new ApiResponse(200,user,"user details updated successfully "))
        
    } catch (error) {
        console.log("error while updating user details",error)
        throw new ApiError(500,"internal server error")
    }
  

}