import dbConnect from "@/app/lib/dbConnect";
import ProductModel from "@/app/models/product.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, res: NextResponse) {

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    console.log(query);

    if (!query) {
        throw new ApiError(400, "query parameter is required");
    }
    await dbConnect();
    try {
        let products = await ProductModel.find(
            {
                $text: {
                    $search: query
                },

            }
        ).collation({ locale: 'en', strength: 2 });

        if (!products || products.length === 0) {
            products = await ProductModel.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } },
                    { query: { $regex: query, $options: 'i' } }
                ]
            });
            return NextResponse.json(new ApiResponse(200, products, "Products fetched successfully"));
        } else {
            return NextResponse.json(new ApiResponse(200, products, "Products fetched successfully"));
        }

    } catch (error) {
        throw new ApiError(500, "internal server error")
    }


}