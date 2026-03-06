// /api/items/toggle-favourite/route.ts
import dbConnect from "@/lib/dbConnect";
import File from "@/models/file.modal";
import Folder from "@/models/folder.modal";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { itemId, itemType, isFavourite } = await req.json();

    if (!itemId || !itemType) {
      return new Response(JSON.stringify({ message: "Missing data" }), { status: 400 });
    }

    const Model = itemType === "File" ? File : Folder;
    
    // Toggle the existing boolean
    const updatedItem = await Model.findByIdAndUpdate(
      itemId,
      { isFavourite: !isFavourite },
      { new: true }
    );

    return new Response(JSON.stringify({ 
      message: "Favourite status updated", 
      item: updatedItem 
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ message: "Error toggling favourite" }), { status: 500 });
  }
}