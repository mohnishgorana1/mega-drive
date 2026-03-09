// app/api/user/storage/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.modal";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId } = await req.json(); // Ye user ka MongoDB ID hai

    if (!userId) {
      return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    // Sirf storage fields fetch karenge (fast query)
    const user = await User.findById(userId).select("storageUsed storageLimit");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      used: user.storageUsed, 
      limit: user.storageLimit 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Storage Fetch Error:", error.message);
    return NextResponse.json({ error: "Failed to fetch storage" }, { status: 500 });
  }
}