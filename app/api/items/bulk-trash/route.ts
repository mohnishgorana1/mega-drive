import dbConnect from "@/lib/dbConnect";
import File from "@/models/file.modal";
import Folder from "@/models/folder.modal";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { items, isTrashed } = await req.json();

    if (!items || !Array.isArray(items)) {
      return new Response("Invalid request", { status: 400 });
    }

    // Separate IDs by type
    const fileIds = items.filter((i) => i.type === "File").map((i) => i.id);
    const folderIds = items.filter((i) => i.type === "Folder").map((i) => i.id);

    // Payload: Toggle trash, and if trashing, remove from favourites
    const updatePayload = {
      isTrashed: isTrashed,
      ...(isTrashed && { isFavourite: false }) 
    };

    // Update everything concurrently
    await Promise.all([
      fileIds.length > 0 ? File.updateMany({ _id: { $in: fileIds } }, updatePayload) : Promise.resolve(),
      folderIds.length > 0 ? Folder.updateMany({ _id: { $in: folderIds } }, updatePayload) : Promise.resolve()
    ]);

    return new Response(JSON.stringify({ message: "Bulk action successful" }), { status: 200 });
  } catch (error) {
    console.error("Bulk trash error:", error);
    return new Response("Error updating items", { status: 500 });
  }
}