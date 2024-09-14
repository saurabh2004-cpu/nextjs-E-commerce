import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import OrderModel from "@/app/models/order.models";
import ProductModel from "@/app/models/product.models";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!session || !userId) {
        return NextResponse.json(new ApiResponse(401, null, "Not authorized"), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
        return NextResponse.json(new ApiResponse(400, null, "Order ID is required"), { status: 400 });
    }

    await dbConnect();

    try {
        const order = await OrderModel.findById(orderId).populate({
            path: 'items.product',
            model: ProductModel,
            select: '-__v -createdAt -updatedAt'
        }).exec();

        if (!order) {
            return NextResponse.json(new ApiResponse(404, null, "Order not found"), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, order, "Order fetched successfully"), { status: 200 });
    } catch (error) {
        console.error("Error while fetching order details: ", error);
        return NextResponse.json(new ApiError(500, "Internal server error"), { status: 500 });
    }
}
