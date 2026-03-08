// app/api/items/revoke-access/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import File from "@/models/file.modal";
import Folder from "@/models/folder.modal";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { itemId, itemType } = await req.json();
    const Model = itemType === "folder" ? Folder : File;
    
    console.log(`Revoking access for ${itemType} with ID: ${itemId}`);

    const item = await Model.findById(itemId);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // 🚀 THE MAGIC FIX HERE
    await Model.findByIdAndUpdate(itemId, {
      $set: { isPublic: false }, // isPublic ko false karo
      $unset: { shareToken: 1 }  // shareToken field ko database se poori tarah DELETE kar do becaues of sparse unique index
    });

    return NextResponse.json({ message: "Access revoked" }, { status: 200 });
  } catch (error: any) {
    // Error ko console log kar lo taaki agli baar exact error dikhe
    console.error("Revoke Error Details:", error.message);
    return NextResponse.json({ error: "Revoke failed" }, { status: 500 });
  }
}