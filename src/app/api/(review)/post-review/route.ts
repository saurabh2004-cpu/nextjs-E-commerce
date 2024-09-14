import dbConnect from "@/app/lib/dbConnect";
import ReviewModel from "@/app/models/review.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import ProductModel from "@/app/models/product.models";
import mongoose from "mongoose";
import OrderModel from "@/app/models/order.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId || !session) {
        return NextResponse.json(new ApiResponse(400, null, "Not authorized"), { status: 400 });
    }

    if (!productId) {
        return NextResponse.json(new ApiResponse(400, null, "Product ID is required"), { status: 400 });
    }

    const { rating, comment } = await req.json();

    if (!rating || !comment) {
        return NextResponse.json(new ApiResponse(400, null, "All fields are required"), { status: 400 });
    }

    const numericRating = Number(rating);

    await dbConnect();

    try {
        const productInOrder = await OrderModel.findOne({
            user: userId,
            "items.product": new mongoose.Types.ObjectId(productId)
        });

        if (!productInOrder) {
            throw new ApiError(400,"No order found for this product")
        }


        console.log("products in order",productInOrder)

        const review = await ReviewModel.create({
            user: userId,
            product: productId,
            rating: numericRating,
            comment,
        });

        if (!review) {
            throw new ApiError(400, "Failed to post review");
        }

        const aggregatedRatings = await ReviewModel.aggregate([
            {
                $match: { product: new mongoose.Types.ObjectId(productId) } 
            },
            {
                $group: {
                    _id: "$product", 
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 } 
                }
            }
        ]);

        if (!aggregatedRatings || aggregatedRatings.length === 0) {
            return NextResponse.json(new ApiResponse(404, null, "No ratings found for this product"));
        }

        const { averageRating, totalReviews } = aggregatedRatings[0];

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            { averageRating, totalReviews },
            { new: true }
        );

        if (!updatedProduct) {
            throw new ApiError(404, "Product not found");
        }

        return NextResponse.json(new ApiResponse(200, { review, updatedProduct }, "Review posted successfully"), { status: 200 });
    } catch (error) {
        console.error("Error while posting review:", error);
        return NextResponse.json(new ApiResponse(500, null, "Internal server error"), { status: 500 });
    }
}
