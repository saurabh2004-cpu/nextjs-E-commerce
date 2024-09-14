import dbConnect from "@/app/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import ProductModel from "@/app/models/product.models";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(new ApiResponse(401, "Not authorized"), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    // const userId = "66af78c7b9411590c86f049e"

    if (!userId) {
        return NextResponse.json(new ApiResponse(400, "User ID is required"), { status: 400 });
    }

    await dbConnect();

    try {
        // Find the top 6 highest-rated products for the specific user
        const productsByHigherRatings = await ProductModel.aggregate([
            {
                $match: { productOwner: new mongoose.Types.ObjectId(userId) }
            },
            {
                $sort: { averageRating: -1 }
            },
            {
                $limit: 6
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    imageUrl: 1,
                    price: 1,
                    averageRating: 1,
                    totalReviews: 1
                }
            }
        ]);
        

        if (!productsByHigherRatings || productsByHigherRatings.length === 0) {
            return NextResponse.json(new ApiResponse(404,productsByHigherRatings, "No products found"));
        }

        return NextResponse.json(new ApiResponse(200, productsByHigherRatings, "Products fetched successfully"));
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(new ApiResponse(400, "Failed to fetch products"), { status: 400 });
    }
}
