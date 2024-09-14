import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import ProductModel from '@/app/models/product.models';
import { ApiError } from '@/utils/ApiError';
import { ApiResponse } from '@/utils/ApiResponse';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const sortOrder = searchParams.get('sortOrder');
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

    

    await dbConnect();

    try {
        let sortField: string = 'createdAt';
        let sortDirection: 1 | -1 = -1; // Default to descending order

        switch (sortOrder) {
            case 'popularity':
                sortField = 'averageRating';
                sortDirection = -1;
                break;
            case 'priceLowToHigh':
                sortField = 'price';
                sortDirection = 1;
                break;
            case 'priceHighToLow':
                sortField = 'price';
                sortDirection = -1;
                break;
            case 'newestFirst':
                sortField = 'createdAt';
                sortDirection = -1;
                break;
            default:
                sortField = 'createdAt';
                sortDirection = -1;
                break;
        }

        
        const products = await ProductModel.aggregate([
            {
                $match: {
                    price: { $lte: maxPrice } ,
                    category:category
                }
            },
            {
                $sort: {
                    [sortField]: sortDirection,
                },
            },
           
        ]);


        if (!products || products.length === 0) {
            return NextResponse.json(new ApiResponse(404, null, "No products found"));
        }

        return NextResponse.json(
            new ApiResponse(
                200, 
                products,
                "Products fetched successfully")
        );
    } catch (error) {
        console.log("Error fetching products:", error);
        return NextResponse.json(new ApiError(500, "Failed to fetch products"));
    }
}
