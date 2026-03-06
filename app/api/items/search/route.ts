import dbConnect from "@/lib/dbConnect";
import File from "@/models/file.modal";
import Folder from "@/models/folder.modal";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { query, userId } = await req.json();

    // If query is empty, return empty arrays immediately
    if (!userId || !query || query.trim() === "") {
      return new Response(JSON.stringify({ folders: [], files: [] }), { status: 200 });
    }

    // Create a case-insensitive regex for partial matching
    const searchRegex = new RegExp(query, 'i');

    // Search both collections simultaneously, limiting to 5 results each to keep the UI clean
    const [folders, files] = await Promise.all([
      Folder.find({ 
        userId, 
        isTrashed: { $ne: true }, 
        folderName: searchRegex 
      }).limit(5),
      File.find({ 
        userId, 
        isTrashed: { $ne: true }, 
        fileName: searchRegex 
      }).limit(5)
    ]);

    return new Response(JSON.stringify({ folders, files }), { status: 200 });
  } catch (error) {
    console.error("Search API Error:", error);
    return new Response("Error searching items", { status: 500 });
  }
}