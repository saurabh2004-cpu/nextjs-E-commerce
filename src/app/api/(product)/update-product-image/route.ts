import { NextRequest, NextResponse } from "next/server";
import { runMiddleware } from "../create-product/route";
import { upload } from "@/app/lib/multer";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import fs from 'fs';
import path from "path";
import { uploadOnCloudinary } from "@/utils/uploadOnCloudinary";
import ProductModel from "@/app/models/product.models";
import { ApiResponse } from "@/utils/ApiResponse";

export async function POST(req:NextRequest){
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

  await runMiddleware(req, upload.fields([{ name: 'imageUrl', maxCount: 1 }]));

  await dbConnect();

  const formData = await req.formData();
  const imageFile = formData.get('imageUrl');


  if (!imageFile || !(imageFile instanceof File)) {
    throw new ApiError(404, "Product image is missing or not a valid file");
  }

  const uploadsDir = path.join(process.cwd(), 'public/uploads');
  const imagePath = path.join(uploadsDir, `${Date.now()}-${imageFile.name}`);

  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Save the file locally
  const buffer = Buffer.from(await imageFile.arrayBuffer());
  fs.writeFileSync(imagePath, buffer);

  try {
    const uploadedImage = await uploadOnCloudinary(imagePath, 'products')

    if (!uploadedImage) {
        throw new ApiError(500, 'Error uploading image');
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(productId,{imageUrl:uploadedImage.secure_url},{ new: true })

    if (!updatedProduct) {
        throw new ApiError(404, "Product not found");
      }
  
      return NextResponse.json(new ApiResponse(201, updatedProduct, 'Product Image updated successfully'));
  } catch (error) {
    throw new ApiError(400,"Error updating product image")
  }

  

}

