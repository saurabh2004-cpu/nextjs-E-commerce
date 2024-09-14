import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import ProductModel from "@/app/models/product.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId || !mongoose.isValidObjectId(productId)) {
    throw new ApiError(404, "Valid Product ID is required");
  }

  await dbConnect();

  const formData = await req.formData();
  const { name, price, description, category, stock, keywords } = Object.fromEntries(formData);

  const updateData: any = {};

  if (name) updateData.name = name;
  if (price) updateData.price = price;
  if (description) updateData.description = description;
  if (category) updateData.category = category;
  if (stock) updateData.stock = stock;
  if (keywords) updateData.keywords = keywords.split(',').map((keyword: string) => keyword.trim());

  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updateData, { new: true });

    if (!updatedProduct) {
      throw new ApiError(404, "Product not found");
    }

    return NextResponse.json(new ApiResponse(201, updatedProduct, 'Product updated successfully'));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Error updating product");
  }
}

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
