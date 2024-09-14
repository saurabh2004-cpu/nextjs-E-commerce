import dbConnect from "@/app/lib/dbConnect"
import ProductModel from "@/app/models/product.models"
import { ApiError } from "@/utils/ApiError"
import { ApiResponse } from "@/utils/ApiResponse"
import { NextResponse } from "next/server"

export async function GET(req:Request,){
    const {searchParams} = new URL(req.url)
    const category = searchParams.get('category')
    const categories = []
    await dbConnect()

    try {
        const products = await ProductModel.find({ category });
    
        if (!products || products.length === 0) {
          return Response.json(new ApiResponse(404,null, "Products not found with the provided category"));
        }
    
        return NextResponse.json(new ApiResponse(200, products, "Products fetched successfully"));
      } catch (error) {
        console.error("Error fetching products:", error);
        throw new ApiError(500,"Internal server Error")
      }
}