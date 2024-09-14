import dbConnect from "@/app/lib/dbConnect";
import ProductModel from "@/app/models/product.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const keywords = searchParams.get('keywords');

    if (!keywords) {
        return NextResponse.json(new ApiResponse(400, null, "Keywords parameter is required"), { status: 400 });
    }

    await dbConnect();

    try {
        // Split keywords by comma and trim spaces
        const keywordsArray = keywords.split(',').map(keyword => keyword.trim());

        const products = await ProductModel.find({ keywords: { $in: keywordsArray } });

        if (products.length === 0) {
            return NextResponse.json(new ApiResponse(404, null, "Products not found"), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, products, "Products fetched successfully"));
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(new ApiResponse(500, null, "Error fetching products"), { status: 500 });
    }
}
