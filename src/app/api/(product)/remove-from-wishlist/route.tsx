import dbConnect from "@/app/lib/dbConnect";
import { ApiResponse } from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiError } from "@/utils/ApiError";
import WishlistModel from "@/app/models/wishlist.models";
import mongoose from "mongoose";


export async function POST(req:NextRequest){
    const {productId} = await req.json();

    if (!productId) {
        return NextResponse.json(new ApiResponse(400, null, "Product ID is required"), { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!session || !userId) {
        return NextResponse.json(new ApiResponse(401, null, "Not authorized"), { status: 401 });
    }

    await dbConnect();

    try {
        const result = await WishlistModel.findOneAndUpdate(
            {user:userId},
            {
                $pull:{items:{product: mongoose.Types.ObjectId.createFromHexString(productId) }}
            },
            {new :true}
        )

        if(!result){
            throw new ApiError(400,"error while removing product from wishlist ")
        }

        return NextResponse.json(new ApiResponse(200,result,"Product sucessfully removed from wishlist "))

    } catch (error) {
        console.log("error while removing product from wishlist ")
        throw new ApiError(500,"internal server error ")
    }

}