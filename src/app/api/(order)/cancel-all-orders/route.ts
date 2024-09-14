import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import OrderModel from "@/app/models/order.models";


export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!session || !userId) {
        return NextResponse.json(new ApiResponse(401, null, "Not authorized"), { status: 401 });
    }

    await dbConnect();

    try {
        // Delete all orders for the authenticated user
        const result = await OrderModel.deleteMany({ user: userId });

        if (result.deletedCount === 0) {
            return NextResponse.json(new ApiResponse(404, null, "No orders found to cancel"), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, null, "All orders canceled successfully"), { status: 200 });

    } catch (error) {
        console.error("Error while canceling all orders:", error);
        return NextResponse.json(new ApiError(500, "Internal server error"), { status: 500 });
    }
}
