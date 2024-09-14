import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import OrderModel from "@/app/models/order.models";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!session || !userId) {
        return NextResponse.json(new ApiResponse(401, null, "Not authorized"), { status: 401 });
    }

    const { orderId } = await req.json();

    if (!orderId) {
        return NextResponse.json(new ApiResponse(400, null, "Order ID is required"), { status: 400 });
    }

    await dbConnect();

    try {
        const orderObjectId = new mongoose.Types.ObjectId(orderId);
        
        const order = await OrderModel.findByIdAndDelete(orderObjectId);

        if (!order) {
            return NextResponse.json(new ApiResponse(404, null, "Order not found"), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, null, "Order canceled successfully"), { status: 200 });
    } catch (error) {
        console.error("Error while canceling the order:", error);
        return NextResponse.json(new ApiResponse(500, null, "Internal server error"), { status: 500 });
    }
}
