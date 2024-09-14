import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import OrderModel from "@/app/models/order.models";
import ProductModel from "@/app/models/product.models";


export async function GET(req:NextRequest){
    const session = await getServerSession(authOptions)
    const userId  = session?.user.id

    if (!session || !userId) {
        return NextResponse.json(new ApiResponse(401, null, "Not authorized"), { status: 401 });
    }

    await dbConnect()
    
    try {
        const orders = await OrderModel.find({user:userId}).populate({
             path: 'items.product',
             model: ProductModel,
             select: '-__v -createdAt -updatedAt'
            }).exec();

            if (!orders || orders.length === 0) {
                return NextResponse.json(new ApiResponse(404, null, "No orders found"), { status: 404 });
            }

            return NextResponse.json(new ApiResponse(200, orders, "Orders fetched successfully"), { status: 200 });
        } catch (error) {
            console.error("Error while fetching user's orders: ", error);
            return NextResponse.json(new ApiError(500, "Internal server error"), { status: 500 });
        }
    }