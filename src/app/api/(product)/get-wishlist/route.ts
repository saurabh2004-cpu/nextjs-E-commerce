import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import WishlistModel from "@/app/models/wishlist.models";
import ProductModel from "@/app/models/product.models";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!session || !userId) {
        return NextResponse.json(new ApiResponse(401, null, "Not authorized"), { status: 401 });
    }

    await dbConnect();

    try {
        const wishlist = await WishlistModel.findOne({ user: userId }).populate({ path: 'items.product',model:ProductModel}).exec();

        if (!wishlist || wishlist.items.length === 0) {
            return NextResponse.json(new ApiResponse(404, null, "No items found in wishlist"));
        }

        return NextResponse.json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"), { status: 200 });
    } catch (error) {
        console.error("Error while fetching user's wishlist: ", error);
        return NextResponse.json(new ApiResponse(500, null, "Internal server error"), { status: 500 });
    }
}
