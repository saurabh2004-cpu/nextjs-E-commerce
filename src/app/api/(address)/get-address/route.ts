import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import AddressModel from "@/app/models/address.models";
import { ApiError } from "@/utils/ApiError";
import { ApiResponse } from "@/utils/ApiResponse";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!session || !userId) {
        return NextResponse.json(new ApiError(401, "Not authorized"), { status: 401 });
    }
    
    await dbConnect();
    try {
        const addresses = await AddressModel.find({ user: userId });

        if (!addresses) {
            return NextResponse.json(new ApiError(404, "No addresses found"), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, addresses, "Addresses fetched successfully"));
    } catch (error) {
        console.error("Error while fetching addresses:", error);
        return NextResponse.json(new ApiError(500, "Internal server error"), { status: 500 });
    }
}
