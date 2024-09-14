import dbConnect from "@/app/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/utils/ApiResponse";
import ProductModel from "@/app/models/product.models";

export async function GET(req: Request) {
    try {
        await dbConnect();
       
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "7", 7);

        // Validate page and limit
        if (isNaN(page) || page <= 0) {
            return NextResponse.json(new ApiResponse(400, "Invalid page number"), { status: 400 });
        }
        if (isNaN(limit) || limit <= 0) {
            return NextResponse.json(new ApiResponse(400, "Invalid limit value"), { status: 400 });
        }

        const products = await ProductModel.find()
            .skip((page - 1) * limit)
            .limit(limit);

        const totalProducts = await ProductModel.countDocuments();

        return NextResponse.json(
            new ApiResponse(200, {
                products,
                totalPages: Math.ceil(totalProducts / limit),
                currentPage: page,
            }, "Products fetched successfully")
        );
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(new ApiResponse(400, `Failed to fetch products `,));
    }
}
