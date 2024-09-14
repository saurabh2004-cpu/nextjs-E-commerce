import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import CartModel, { ICartItem } from "@/app/models/cart.models";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!session || !userId) {
        return NextResponse.json(new ApiResponse(401, null, "Not authorized"), { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
        return NextResponse.json(new ApiResponse(400, null, "Product ID is required"), { status: 400 });
    }

    await dbConnect();

    try {
        // Find the cart of the authenticated user
        const cart = await CartModel.findOne({ user: userId });

        if (!cart) {
            return NextResponse.json(new ApiResponse(404, null, "Cart not found"), { status: 404 });
        }

        // Find the product in the cart
        const existingProductIndex = cart.items.findIndex((item: ICartItem) => item.product.toString() === productId);

        if (existingProductIndex === -1) {
            return NextResponse.json(new ApiResponse(404, null, "Product not found in cart"), { status: 404 });
        }

        // Remove the product from the items array
        cart.items.splice(existingProductIndex, 1);

        // Save the updated cart
        await cart.save();

        return NextResponse.json(new ApiResponse(200, cart, "Product removed from cart"), { status: 200 });
    } catch (error) {
        console.error("Error while removing product from cart:", error);
        return NextResponse.json(new ApiError(500, "Internal server error"), { status: 500 });
    }
}
