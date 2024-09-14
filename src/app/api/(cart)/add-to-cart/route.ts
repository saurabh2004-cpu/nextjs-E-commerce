import dbConnect from "@/app/lib/dbConnect";
import CartModel, { ICart, ICartItem } from "@/app/models/cart.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!session || !userId) {
        return NextResponse.json(new ApiResponse(401, null, "Not authorized"), { status: 401 });
    }

    const { productId, quantity } = await req.json();

    if (!productId || !quantity || quantity <= 0) {
        return NextResponse.json(new ApiResponse(400, null, "Invalid product ID or quantity"), { status: 400 });
    }

    await dbConnect();

    try {
        // Find the existing cart for the user
        let cart: ICart | null = await CartModel.findOne({ user: userId });

        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = await CartModel.create({
                user: new mongoose.Types.ObjectId(userId),
                items: [{ product: mongoose.Types.ObjectId.createFromHexString(productId), quantity }]
            });
        } else {
            // Check if the product already exists in the cart
            const existingProductIndex = cart.items.findIndex((item: ICartItem) => item.product.toString() === productId);

            if (existingProductIndex >= 0) {
                // Update the quantity if the product already exists in the cart
                cart.items[existingProductIndex].quantity ++;
            } else {
                // Add the product as a new item if it doesn't exist in the cart
                cart.items.push({ product: mongoose.Types.ObjectId.createFromHexString(productId), quantity });
            }

            await cart.save();
        }

        

        return NextResponse.json(new ApiResponse(201, cart, "Product added to cart successfully"), { status: 201 });
    } catch (error) {
        console.error("Error while adding product to cart:", error);
        return NextResponse.json(new ApiError(500, "Internal server error"), { status: 500 });
    }
}
