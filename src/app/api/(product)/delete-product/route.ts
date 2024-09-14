import { NextRequest, NextResponse } from "next/server";
import { runMiddleware } from "../create-product/route";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import ProductModel from "@/app/models/product.models";
import { ApiResponse } from "@/utils/ApiResponse";

export async function POST(req:NextRequest){
    const {searchParams}= new URL(req.url)
    const productId = searchParams.get('productId')

    if(!productId){
        return NextResponse.json(new ApiResponse(404,null,"product is is required"))
    }

    await dbConnect()

    try {
        const product  = await ProductModel.findByIdAndDelete(productId)

        if(product){
            return NextResponse.json(new ApiResponse(200,product,"product successfully removed "))
        }
    } catch (error) {
        throw new ApiError(400,"error while deleting product !")
    }
}