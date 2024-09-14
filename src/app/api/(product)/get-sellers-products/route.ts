import dbConnect from "@/app/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import ProductModel from "@/app/models/product.models";
import mongoose from "mongoose";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!session || !userId) {
        return NextResponse.json(new ApiResponse(401, "Not authorized"), { status: 401 });
    }

    await dbConnect();

    try {
        const products = await ProductModel.find({ productOwner: new mongoose.Types.ObjectId(userId) });

        if (!products || products.length === 0) {
            return NextResponse.json(new ApiResponse(404,products, "Products not found"));
        }

        return NextResponse.json(new ApiResponse(200, products, "All products fetched successfully"));
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(new ApiResponse(400, "Failed to fetch all products"));
    }
}
