import dbConnect from "@/app/lib/dbConnect";
import { ProductAnalyticsmodel } from "@/app/models/analytics.models";
import ProductModel from "@/app/models/product.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
        throw new ApiError(404, "ProductId not found");
    }

    await dbConnect();

    try {
        const product = await ProductModel.findById(productId).populate("productOwner");

        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        return NextResponse.json(new ApiResponse(200,  product , "Product fetched successfully"));
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(new ApiResponse(400, null, "Failed to fetch product"), { status: 400 });
    }
}
