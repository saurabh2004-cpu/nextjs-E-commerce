import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import OrderModel from "@/app/models/order.models";
import mongoose from "mongoose";
import ProductModel from "@/app/models/product.models";

export async function POST(req:NextRequest){
    const session = await getServerSession(authOptions)
    const userId  = session?.user.id

    if (!session || !userId) {
        return NextResponse.json(new ApiResponse(401, null, "Not authorized"), { status: 401 });
    }

    const { productId, quantity } = await req.json();

    if (!productId || !quantity || quantity <= 0) {
        return NextResponse.json(new ApiResponse(400, null, "Invalid product ID or quantity"), { status: 400 });
    }

    await dbConnect();

    try {

        const product = await ProductModel.findById(productId)

        if(!product){
            return NextResponse.json(new ApiResponse(404,false,"product not found"))
        }
        
        const total = product?.price*quantity

        const order = await OrderModel.create({
            user: new mongoose.Types.ObjectId(userId),
            items: [{ product: mongoose.Types.ObjectId.createFromHexString(productId), quantity }],
            total,
            status: "pending"
        });

        return NextResponse.json(new ApiResponse(200, order, "Order created successfully"), { status: 200 });

        
    } catch (error) {
        console.log("error while creating order",error)
        throw new ApiError(500,"internal server error")
    }

}