import dbConnect from "@/lib/dbConnect";
import File from "@/models/file.modal";
import Folder from "@/models/folder.modal";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required" }), { status: 400 });
    }

    const trashedFolders = await Folder.find({ userId, isTrashed: true }, '_id');
    const trashedFolderIds = trashedFolders.map(f => f._id.toString());

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

    const allFolderIdsToDelete = [...trashedFolderIds, ...(await getDescendantFolders(trashedFolderIds))];

    const filesToDelete = await File.find({
      $or: [
        { userId, isTrashed: true },
        { folderId: { $in: allFolderIdsToDelete } }
      ]
    });

    // Delete from Cloudinary
    const cloudinaryPromises = filesToDelete.map(async (file) => {
      const publicId = file.databaseLocations?.public_id;
      if (!publicId) return Promise.resolve();

      let rType = 'image';
      if (file.type.startsWith('video/')) rType = 'video';
      else if (!file.type.startsWith('image/')) rType = 'raw';

      return cloudinary.uploader.destroy(publicId, { resource_type: rType })
        .catch(err => console.error(`Cloudinary Delete Error: ${publicId}`, err));
    });
    await Promise.all(cloudinaryPromises);

    const fileIdsToDelete = filesToDelete.map(f => f._id);
    
    // Delete from MongoDB
    if (fileIdsToDelete.length > 0) {
      await File.deleteMany({ _id: { $in: fileIdsToDelete } });
    }
    if (allFolderIdsToDelete.length > 0) {
      await Folder.deleteMany({ _id: { $in: allFolderIdsToDelete } });
    }

    // 🔥 CLEANUP: Globally wipe these IDs from any surviving parent folder arrays
    await Folder.updateMany(
      { userId }, // target all folders belonging to this user
      { 
        $pull: { 
          files: { $in: fileIdsToDelete }, 
          folders: { $in: allFolderIdsToDelete } 
        } 
      }
    );

    return new Response(JSON.stringify({ message: "Trash emptied successfully" }), { status: 200 });

  } catch (error) {
    console.error("Empty Trash Error:", error);
    return new Response(JSON.stringify({ message: "Error emptying trash" }), { status: 500 });
  }
}