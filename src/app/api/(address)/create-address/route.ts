import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import AddressModel from '@/app/models/address.models';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { ApiResponse } from '@/utils/ApiResponse';


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!session || !userId) {
        return NextResponse.json(new ApiResponse(401, null, "Not authorized"), { status: 401 });
    }

    await dbConnect();

    let body;
    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json(new ApiResponse(400, null, "Invalid JSON body"), { status: 400 });
    }

    let { addressLine1, addressLine2, city, state, postalCode, country } = body;

    if (!addressLine1 ||  !addressLine2|| !city || !state || !postalCode || !country) {
        return NextResponse.json(new ApiResponse(400, null, "Address fields are required"), { status: 400 });
    }

    try {
        const newAddress = await AddressModel.create({
            user:userId,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country
        });

        return NextResponse.json(new ApiResponse(201, newAddress, "Address created successfully"), { status: 201 });
    } catch (error) {
        console.error("Error creating address:", error);
        return NextResponse.json(new ApiResponse(500, null, "Error creating address"), { status: 500 });
    }
}
