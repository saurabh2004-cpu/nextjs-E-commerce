import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import AddressModel from '@/app/models/address.models';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { ApiResponse } from '@/utils/ApiResponse';
import { ApiError } from '@/utils/ApiError';

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!session) {
        return NextResponse.json(new ApiResponse(404, "Not authorized"), { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get('addressId');

    if(!addressId){
        return NextResponse.json(new ApiResponse(404,null,"Address id is required"))
    }

    await dbConnect();

    try {
        const { addressLine1, addressLine2, city, state, postalCode, country } = await req.json();

        if (!addressId) {
            return NextResponse.json(new ApiResponse(400, null, "Address ID is required"), { status: 400 });
        }

        const address = await AddressModel.findOne({ _id: addressId, user: userId });

        if (!address) {
            return NextResponse.json(new ApiResponse(404, null, "Address not found or not authorized to update"), { status: 404 });
        }

        // Update the address fields
        address.addressLine1 = addressLine1 ?? address.addressLine1;
        address.addressLine2 = addressLine2 ?? address.addressLine2;
        address.city = city ?? address.city;
        address.state = state ?? address.state;
        address.postalCode = postalCode ?? address.postalCode;
        address.country = country ?? address.country;

        // Save the updated address
        await address.save();

        return NextResponse.json(new ApiResponse(200, address, "Address updated successfully"), { status: 200 });
    } catch (error) {
        console.error("Error updating address:", error);
        return NextResponse.json(new ApiError(500, "Internal server error"), { status: 500 });
    }
}
