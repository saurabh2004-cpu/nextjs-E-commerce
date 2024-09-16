import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import CartModel from "@/app/models/cart.models";
import OrderModel from "@/app/models/order.models";
import ProductModel from "@/app/models/product.models";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!session || !userId) {
        return NextResponse.json(new ApiResponse(401, null, "Not authorized"), { status: 401 });
    }

    await dbConnect();

    try {
        // Fetch the user's cart
        const cart = await CartModel.findOne({ user: userId }).populate({
            path:'items.product',
            model:ProductModel,
            select: 'price' 
        });

        if (!cart || cart.items.length === 0) {
            return NextResponse.json(new ApiResponse(404, null, "Cart is empty"), { status: 404 });
        }

        // Create a new order
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price:(item.product as any).price,
        }));

        const total = orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

        const order = await OrderModel.create({
            user: userId,
            items: orderItems,
            total: total,
            status: "pending"
        });

        // Clear the cart
        // cart.items = [];
        // await cart.save();

        return NextResponse.json(new ApiResponse(200, order, "Order placed successfully"), { status: 200 });

    } catch (error) {
        console.error("Error while placing order:", error);
        return NextResponse.json(new ApiError(500, "Internal server error"), { status: 500 });
    }
}
