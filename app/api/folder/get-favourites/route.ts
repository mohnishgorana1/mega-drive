// /api/folder/get-favourites/route.ts

import dbConnect from "@/lib/dbConnect";
import File from "@/models/file.modal";
import Folder from "@/models/folder.modal";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required" }), { status: 400 });
    }

    // Fetch all folders and files marked as favourite for this user
    const [folders, files] = await Promise.all([
      Folder.find({ userId, isFavourite: true }),
      File.find({ userId, isFavourite: true })
    ]);

    return new Response(JSON.stringify({ folders, files }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching favourites" }), { status: 500 });
  }
}