import dbConnect from "@/lib/dbConnect";
import Folder from "@/models/folder.modal";
import File from "@/models/file.modal";
import cloudinary from "@/lib/cloudinary";

export const POST = async (req: Request) => {
  await dbConnect();
  
  try {
    const { folderIdToDelete } = await req.json();

    if (!folderIdToDelete) {
      return new Response(JSON.stringify({ message: 'Folder ID is required' }), { status: 400 });
    }

    // 🔥 Fetch the target folder first to get its parentFolderId
    const targetFolder = await Folder.findById(folderIdToDelete);
    if (!targetFolder) {
      return new Response(JSON.stringify({ message: 'Folder not found' }), { status: 404 });
    }

    const getDescendantFolders = async (parentId: string) => {
      const descendants: string[] = [];
      let currentLevelIds = [parentId];
      
      while (currentLevelIds.length > 0) {
        const children = await Folder.find({ parentFolderId: { $in: currentLevelIds } }, '_id');
        const childIds = children.map(child => child._id.toString());
        descendants.push(...childIds);
        currentLevelIds = childIds;
      }
      return descendants;
    };

    const allFolderIdsToDelete = [folderIdToDelete, ...(await getDescendantFolders(folderIdToDelete))];
    const filesToDelete = await File.find({ folderId: { $in: allFolderIdsToDelete } });

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

    // Delete from MongoDB Collections
    await File.deleteMany({ folderId: { $in: allFolderIdsToDelete } });
    await Folder.deleteMany({ _id: { $in: allFolderIdsToDelete } });

    // 🔥 CLEANUP: Remove this top-level folder's ID from its parent's array
    if (targetFolder.parentFolderId) {
      await Folder.findByIdAndUpdate(targetFolder.parentFolderId, {
        $pull: { folders: folderIdToDelete }
      });
    }

    return new Response(JSON.stringify({ 
      message: 'Folder deleted and parent updated successfully' 
    }), { status: 201 });

  } catch (error) {
    console.error('Error Deleting Folder:', error);
    return new Response(JSON.stringify({ message: `Error Deleting Folder: ${error}` }), { status: 500 });
  }
}