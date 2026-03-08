import dbConnect from "@/lib/dbConnect";
import File from "@/models/file.modal";
import Folder from "@/models/folder.modal";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { items, userId } = await req.json();
    
    if (!userId || !items || !Array.isArray(items)) {
      return new Response("Invalid request", { status: 400 });
    }

    const topLevelFileIds = items.filter(i => i.type === "File").map(i => i.id);
    const topLevelFolderIds = items.filter(i => i.type === "Folder").map(i => i.id);

    // 1. Recursive Helper: Get all sub-folders of the selected folders
    const getDescendantFolders = async (parentIds: string[]) => {
      const descendants: string[] = [];
      let currentIds = parentIds;
      while (currentIds.length > 0) {
        const children = await Folder.find({ parentFolderId: { $in: currentIds } }, '_id');
        const childIds = children.map(c => c._id.toString());
        descendants.push(...childIds);
        currentIds = childIds;
      }
      return descendants;
    };

    const allFolderIdsToDelete = [...topLevelFolderIds, ...(await getDescendantFolders(topLevelFolderIds))];

    // 2. Find ALL files to delete (explicitly selected + inside deleted folders)
    const filesToDelete = await File.find({
      $or: [
        { _id: { $in: topLevelFileIds } },
        { folderId: { $in: allFolderIdsToDelete } }
      ]
    });

    // 3. Delete from Cloudinary
    const cloudinaryPromises = filesToDelete.map(async (file) => {
      const publicId = file.databaseLocations?.public_id;
      if (!publicId) return Promise.resolve();
      let rType = 'image';
      if (file.type.startsWith('video/')) rType = 'video';
      else if (!file.type.startsWith('image/')) rType = 'raw';
      
      return cloudinary.uploader.destroy(publicId, { resource_type: rType })
        .catch(err => console.error(`Cloudinary error for ${publicId}:`, err));
    });
    await Promise.all(cloudinaryPromises);

    // 4. Delete from MongoDB
    const allFileIdsToDelete = filesToDelete.map(f => f._id);
    if (allFileIdsToDelete.length > 0) await File.deleteMany({ _id: { $in: allFileIdsToDelete } });
    if (allFolderIdsToDelete.length > 0) await Folder.deleteMany({ _id: { $in: allFolderIdsToDelete } });

    // 5. Cleanup references from surviving parent folders
    await Folder.updateMany(
      { userId },
      { $pull: { files: { $in: topLevelFileIds }, folders: { $in: topLevelFolderIds } } }
    );

    return new Response(JSON.stringify({ message: "Bulk delete successful" }), { status: 200 });
  } catch (error) {
    console.error("Bulk delete error:", error);
    return new Response("Error deleting items", { status: 500 });
  }
}