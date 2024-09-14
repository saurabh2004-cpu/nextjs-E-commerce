import dbConnect from "@/app/lib/dbConnect";
import WishlistModel, { IWishlist, IWishlistItem } from "@/app/models/wishlist.models";
import { ApiError } from "@/utils/ApiError";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    
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
        let cart: IWishlist | null = await WishlistModel.findOne({ user: userId });

        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = await WishlistModel.create({
                user: new mongoose.Types.ObjectId(userId),
                items: [{ product: mongoose.Types.ObjectId.createFromHexString(productId)}]
            });
        } else {
            const existingProductIndex = cart.items.findIndex((item: IWishlistItem) => item.product.toString() === productId);

            if (existingProductIndex >= 0) {
                return NextResponse.json(new ApiResponse(201, cart, "Product alredy added in wishlist"), { status: 201 });
            } else {
                // Add the product as a new item if it doesn't exist in the cart
                cart.items.push({ product: mongoose.Types.ObjectId.createFromHexString(productId)});
            }

            await cart.save();
        }

        return NextResponse.json(new ApiResponse(200, cart, "Product added to cart successfully"), );
    } catch (error) {
        console.error("Error while adding product to cart:", error);
        return NextResponse.json(new ApiError(500, "Internal server error"), { status: 500 });
    }
}
