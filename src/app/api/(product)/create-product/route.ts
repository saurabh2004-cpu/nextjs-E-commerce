import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import ProductModel from '@/app/models/product.models';
import { uploadOnCloudinary } from '@/utils/uploadOnCloudinary';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';
import { upload } from '@/app/lib/multer';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

// Helper to run middleware
const runMiddleware = (
  req: NextRequest,
  fn: (req: NextRequest, res: NextResponse, next: (result?: any) => void) => void
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    fn(req, NextResponse.next(), (result?: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};


// Define POST handler
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json(new ApiResponse(404, "not authorized"));
  }

  const ownerId = session?.user?.id;

  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }


  await dbConnect();

  const formData = await req.formData();
  let {
    name, price, description, category, stock, keywords, highlight,
    ram, storage, color, battery,
    displaySize, launchYear, hdTechnology,
    clotheSize,clotheColor,

  } = Object.fromEntries(formData);
  
  const imageFile = formData.get('imageUrl') as unknown as File;


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
 

  if (!name || !price || !description || !category || !stock || !highlight) {
    throw new ApiError(400, 'Missing required fields');
  }


  // Ensure `keywords` is split into an array
  let keywordArray: string[] = [];
  if (keywords && typeof keywords === 'string') {
    keywordArray = keywords.split(',').map(keyword => keyword.trim());
  }

  try {

    const isAvailable = parseInt(stock as string, 10) > 0;

    const newProduct = new ProductModel({
      name,
      price,
      description,
      category,
      stock,
      imageUrl: imageData?.secure_url,
      productOwner: ownerId,
      keywords:keywordArray,
      isAvailable,
      highlight,
    });

    //mobiles and tablets
    if (category === 'mobiles and tablets') {
      if (!color || !ram || !storage || !battery) {
        throw new ApiError(400, 'Missing required mobiles and tablets fields');
      }
      
      newProduct.ram = Number(ram);       // Ensure it's a number
      newProduct.storage = Number(storage);
      newProduct.battery = Number(battery);
      newProduct.color = color as string;   // color is a string
    }
    
    //'tv and appliances'
    if (category === 'tv and appliances') {
      if (!displaySize || !launchYear || !hdTechnology) {
          throw new ApiError(400, 'Missing required tv and appliances fields');
      }
  
      newProduct.displaySize = Number(displaySize);
      newProduct.launchYear = Number(launchYear);
      newProduct.hdTechnology = hdTechnology as string;
  }

    //'fashion'
    if (category === 'fashion') {
      if (!clotheSize || !clotheColor ) {
          throw new ApiError(400, 'Missing required clothe fields');
      }
  
      newProduct.clotheSize= clotheSize as string;
      newProduct.clotheColor = clotheColor as string;
  }
  
    await newProduct.save();

    if (!newProduct) {
      throw new ApiError(400, "error while creating product")
    }



    return NextResponse.json(new ApiResponse(200, newProduct, 'Product created successfully'));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, 'Error creating product');
  }
}

export const runtime = 'nodejs'; 