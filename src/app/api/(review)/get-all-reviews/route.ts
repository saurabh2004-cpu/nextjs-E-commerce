import dbConnect from "@/app/lib/dbConnect";
import ReviewModel, { IReview } from "@/app/models/review.models";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { HydratedDocument } from "mongoose";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId)  {
        return NextResponse.json(new ApiResponse(400, null, "Product ID required"), { status: 400 });
    }

    await dbConnect();

    try {
        // Use populate with proper typing
        const allReviews: HydratedDocument<IReview>[] = await ReviewModel.find({ product: productId })
            .populate("user", "username _id"); // Populate only the username field

        if (!allReviews || allReviews.length === 0) {
            return NextResponse.json(new ApiResponse(404, null, "No reviews found for this product"));
        }

        return NextResponse.json(new ApiResponse(200, allReviews, "Reviews fetched successfully"), { status: 200 });
    } catch (error) {
        console.log("Error while fetching all reviews:", error);
        return NextResponse.json(new ApiResponse(500, null, "Internal server error"));
    }
}
