import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import CartModel from "@/app/models/cart.models";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!session || !userId) {
        return NextResponse.json(new ApiResponse(401, null, "Not authorized"), { status: 401 });
    }

    await dbConnect();

    try {
        // Find the cart for the user
        const cart = await CartModel.findOne({ user: userId })

        if (!cart ) {
            return NextResponse.json(new ApiResponse(404, null, "Cart not found"), { status: 404 });
        }

        cart.items=[]

        await cart.save()

        return NextResponse.json(new ApiResponse(200, cart, "Cart items removed successfully"), { status: 200 });

    } catch (error) {
        console.error("Error while fremoving cart items:", error);
        return NextResponse.json(new ApiError(500, "Internal server error"), { status: 500 });
    }
}
