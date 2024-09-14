// src/app/api/auth/sign-out/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { ApiResponse } from "@/utils/ApiResponse";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const response = NextResponse.json({ message: "Signed out successfully" });

    if(!response){
      return NextResponse.json(new ApiResponse(404,null,"error while logging out "))
    }

    response.cookies.set('next-auth.session-token', '', {
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("Error signing out:", error);
    return NextResponse.json({ message: "Error signing out" }, { status: 500 });
  }
}
