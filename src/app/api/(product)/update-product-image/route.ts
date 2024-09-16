import { NextRequest, NextResponse } from "next/server";
// import { runMiddleware } from "../create-product/route";
import { upload } from "@/app/lib/multer";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import fs from 'fs';
import path from "path";
import { uploadOnCloudinary } from "@/utils/uploadOnCloudinary";
import ProductModel from "@/app/models/product.models";
import { ApiResponse } from "@/utils/ApiResponse";





export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");


  await dbConnect();

  const formData = await req.formData();
  const imageFile = formData.get('imageUrl');

  if (!imageFile || !(imageFile instanceof File)) {
    throw new ApiError(404, "Product image is missing or not a valid file");
  }

  let imageData;
  try {
    imageData = await uploadOnCloudinary(imageFile, "products");

    // Check if `secure_url` exists in the response
    if (!imageData?.secure_url) {
      throw new ApiError(500, "Error uploading image to Cloudinary");
    }
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new ApiError(500, "Failed to upload image to Cloudinary");
  }


  // const uploadsDir = path.join(process.cwd(), 'public/uploads');
  // const imagePath = path.join(uploadsDir, `${Date.now()}-${imageFile.name}`);

  // Ensure the uploads directory exists
  // if (!fs.existsSync(uploadsDir)) {
  //   fs.mkdirSync(uploadsDir, { recursive: true });
  // }

  // // Save the file locally
  // const buffer = Buffer.from(await imageFile.arrayBuffer());
  // fs.writeFileSync(imagePath, buffer);

  try {

    

    const updatedProduct = await ProductModel.findByIdAndUpdate(productId, { imageUrl: imageData?.secure_url }, { new: true })

    if (!updatedProduct) {
      throw new ApiError(404, "Product not found");
    }

    return NextResponse.json(new ApiResponse(201, updatedProduct, 'Product Image updated successfully'));
  } catch (error) {
    throw new ApiError(400, "Error updating product image")
  }



}

