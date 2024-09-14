import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import { ApiError } from "@/utils/ApiError";
import AddressModel from "@/app/models/address.models";
import { ApiResponse } from "@/utils/ApiResponse";

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Authorization check
    if (!session || !userId) {
        return NextResponse.json(new ApiError(401, "Not authorized"), { status: 401 });
    }

     const { searchParams } = new URL(req.url);
    const addressId = searchParams.get('addressId');

    if(!addressId){
        return NextResponse.json(new ApiResponse(404,null,"Address id is required"))
    }

    await dbConnect();

    try {
        const deletedAddress = await AddressModel.findOneAndDelete({ _id: addressId, user: userId });

        if (!deletedAddress) {
            return NextResponse.json(new ApiError(404, "Address not found or not authorized to delete"), { status: 404 });
        }

        return NextResponse.json(new ApiResponse(200, deletedAddress, "Address deleted successfully"));
    } catch (error) {
        console.error("Error while deleting address:", error);
        return NextResponse.json(new ApiError(500, "Internal server error"), { status: 500 });
    }
}
