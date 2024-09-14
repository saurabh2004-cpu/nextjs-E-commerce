import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import CartModel from "@/app/models/cart.models";
import ProductModel from "@/app/models/product.models";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!session || !userId) {
        return NextResponse.json(new ApiResponse(401, null, "Not authorized"), { status: 401 });
    }

    await dbConnect();

    try {
        // Find the cart for the user and populate product details
        const cart = await CartModel.findOne({ user: userId }).populate({ path: 'items.product',model: ProductModel,}).exec();


        if (!cart || cart.items.length === 0) {
            return NextResponse.json(new ApiResponse(400, null, "Cart is empty"));
        }

        return NextResponse.json(new ApiResponse(200, cart, "Cart items fetched successfully"), { status: 200 });

    } catch (error) {
        console.error("Error while fetching cart items:", error);
        return NextResponse.json(new ApiError(500, "Internal server error"), { status: 500 });
    }
}
