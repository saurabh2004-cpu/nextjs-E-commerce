import dbConnect from "@/app/lib/dbConnect";
import WishlistModel, { IWishlist, IWishlistItem } from "@/app/models/wishlist.models";
import { ApiError } from "@/utils/ApiError";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    const { productId } = await req.json();

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
        let wishlist: IWishlist | null = await WishlistModel.findOne({ user: userId });

        if (!wishlist) {
            // Create a new wishlist if it doesn't exist
            wishlist = await WishlistModel.create({
                user: new mongoose.Types.ObjectId(userId),
                items: [{ product: new mongoose.Types.ObjectId(productId) }]  // Correct instantiation here
            });
        } else {
            const existingProductIndex = wishlist.items.findIndex((item: IWishlistItem) => item.product.toString() === productId);

            if (existingProductIndex >= 0) {
                return NextResponse.json(new ApiResponse(201, wishlist, "Product already added to wishlist"), { status: 201 });
            } else {
                // Add the product as a new item if it doesn't exist in the wishlist
                wishlist.items.push({ product: new mongoose.Types.ObjectId(productId) });  // Correct instantiation here
            }

            await wishlist.save();
        }

        return NextResponse.json(new ApiResponse(200, wishlist, "Product added to wishlist successfully"));
    } catch (error) {
        console.error("Error while adding product to wishlist:", error);
        return NextResponse.json(new ApiError(500, "Internal server error"), { status: 500 });
    }
}
