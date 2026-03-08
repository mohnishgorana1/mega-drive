// app/api/items/share/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import File from "@/models/file.modal";
import Folder from "@/models/folder.modal";

// Browser & Edge compatible random token generator
function generateToken(length: number) {
  const array = new Uint8Array(length);
  globalThis.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { itemId, itemType } = await req.json(); // itemType: 'file' | 'folder'

    const Model = itemType === "folder" ? Folder : File;
    const shareToken = generateToken(16);
    
    const updatedItem = await Model.findByIdAndUpdate(
      itemId,
      { isPublic: true, shareToken },
      { new: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    // Share URL ab type bhi contain kar sakta hai ya universal ho sakta hai
    const shareUrl = `${baseUrl}/share/${shareToken}?type=${itemType}`;

    return NextResponse.json({ shareUrl }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to share" }, { status: 500 });
  }
}