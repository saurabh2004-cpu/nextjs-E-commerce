import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import CartModel from "@/app/models/cart.models";


export async function PATCH(req:NextRequest){
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!session || !userId) {
        return NextResponse.json(new ApiResponse(401, null, "Not authorized"), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
        return NextResponse.json(new ApiResponse(400, null, "Product ID is required"), { status: 400 });
    }

    const { quantityChange } = await req.json();

    if ( typeof quantityChange !== 'number') {
        return NextResponse.json(new ApiResponse(400, null, "Invalid quantity change"), { status: 400 });
    }

    await dbConnect();
    try {
        const cart = await CartModel.findOne({user:userId})
        if (!cart) {
            return NextResponse.json(new ApiResponse(404, null, "Cart not found"), { status: 404 });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return NextResponse.json(new ApiResponse(404, null, "Product not found in cart"), { status: 404 });
        }

        cart.items[itemIndex].quantity += quantityChange;

        if (cart.items[itemIndex].quantity <= 0) {
            return NextResponse.json(new ApiError(400,"product quentity not be zero or lesss than zero"), { status: 400 });
        }

        await cart.save();

        return NextResponse.json(new ApiResponse(200, cart, "Cart updated successfully"), { status: 200 });
        
    } catch (error) {
        console.error("Error while updating quentity of product:", error);
        throw new ApiError(500, "Internal server error");

    }




}