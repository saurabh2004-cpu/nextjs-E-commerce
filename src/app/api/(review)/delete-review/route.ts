import dbConnect from "@/app/lib/dbConnect";
import ReviewModel from "@/app/models/review.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
        return NextResponse.json(new ApiResponse(400, null, "review ID required"), { status: 400 });
    }

    await dbConnect();

    try {
        const deletedReview = await ReviewModel.findByIdAndDelete(reviewId)

        if(!deletedReview){
            throw new ApiError(400,"error while deleting review")
        }

        return NextResponse.json(new ApiResponse (200,deletedReview,"review deleted successfully"))
    } catch (error) {
        console.log("error while deleting review",error)
        throw new ApiError(500,"internal server error")
    }


    
}