import dbConnect from "@/lib/dbConnect";
import File from "@/models/file.modal";
import Folder from "@/models/folder.modal";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { userId } = await req.json();
    if (!userId) return new Response("User ID required", { status: 400 });

    const [folders, files] = await Promise.all([
      Folder.find({ userId, isTrashed: true }).sort({ updatedAt: -1 }),
      File.find({ userId, isTrashed: true }).sort({ updatedAt: -1 })
    ]);

    return new Response(JSON.stringify({ folders, files }), { status: 200 });
  } catch (error) {
    return new Response("Error fetching trash", { status: 500 });
  }
}