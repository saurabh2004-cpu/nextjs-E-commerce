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
export const runMiddleware = (req: NextRequest, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, NextResponse.next(), (result: any) => {
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

  await runMiddleware(req, upload.fields([{ name: 'imageUrl', maxCount: 1 }]));

  await dbConnect();

  const formData = await req.formData();
  let {
    name, price, description, category, stock, keywords, highlight,
    ram, storage, color, battery,
    displaySize, launchYear, hdTechnology,
    clotheSize,clotheColor,

  } = Object.fromEntries(formData);
  const imageFile = formData.get('imageUrl');

  console.log("jwsjwsj",clotheColor,clotheSize)

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

  if (!name || !price || !description || !category || !stock || !highlight) {
    throw new ApiError(400, 'Missing required fields');
  }

  





  // Ensure `keywords` is split into an array
  if (keywords && typeof keywords === 'string') {
    keywords = keywords.split(',').map(keyword => keyword.trim());
  }

  try {
    const uploadedImage = await uploadOnCloudinary(imagePath, 'products');

    if (!uploadedImage) {
      throw new ApiError(500, 'Error uploading image');
    }

    const isAvailable = parseInt(stock as string, 10) > 0;

    const newProduct = new ProductModel({
      name,
      price,
      description,
      category,
      stock,
      imageUrl: uploadedImage.secure_url,
      productOwner: ownerId,
      keywords,
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

export const config = {
  api: {
    bodyParser: false,
  },
};
