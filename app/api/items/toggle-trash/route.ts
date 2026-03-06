import dbConnect from "@/lib/dbConnect";
import File from "@/models/file.modal";
import Folder from "@/models/folder.modal";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { itemId, itemType, isTrashed } = await req.json();

    const Model = itemType === "File" ? File : Folder;
    
    // Toggle the trashed status. We also set isFavourite to false if it's being trashed.
    const updatedItem = await Model.findByIdAndUpdate(
      itemId,
      { 
        isTrashed: !isTrashed,
        ...( !isTrashed && { isFavourite: false } ) // Remove from favourites if throwing away
      },
      { new: true }
    );

    return new Response(JSON.stringify({ message: "Trash status updated" }), { status: 200 });
  } catch (error) {
    return new Response("Error toggling trash", { status: 500 });
  }
}