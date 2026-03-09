// app/api/items/delete/route.ts
import dbConnect from "@/lib/dbConnect";
import File from "@/models/file.modal";
import Folder from "@/models/folder.modal";
import User from "@/models/user.modal";
import cloudinary from "@/lib/cloudinary";

export const POST = async (req: Request) => {
  await dbConnect();

  try {
    const { fileIdToDelete } = await req.json();

    if (!fileIdToDelete) {
      return new Response(JSON.stringify({ message: "File ID is required" }), {
        status: 400,
      });
    }

    const fileToDelete = await File.findById(fileIdToDelete);

    if (!fileToDelete) {
      return new Response(JSON.stringify({ message: `File not found` }), {
        status: 404,
      });
    }

    const publicId = fileToDelete.databaseLocations?.public_id;
    const parentFolderId = fileToDelete.folderId;
    const userId = fileToDelete.userId; // 🚀 User ID nikal liya
    const sizeFreed = fileToDelete.fileSize || 0; // 🚀 File ka size nikal liya

    // Delete from Cloudinary
    if (publicId) {
      let rType = "image";
      if (fileToDelete.type.startsWith("video/")) rType = "video";
      else if (!fileToDelete.type.startsWith("image/")) rType = "raw";

      await cloudinary.uploader.destroy(publicId, { resource_type: rType });
    }

    // Delete from MongoDB File Collection
    const deletedFile = await File.findByIdAndDelete(fileIdToDelete, {
      new: true,
    });

    // CLEANUP: Remove this file's ID from its parent folder's array
    if (parentFolderId) {
      await Folder.findByIdAndUpdate(parentFolderId, {
        $pull: { files: fileIdToDelete },
      });
    }

    // 🚀 DECREMENT STORAGE
    if (userId && sizeFreed > 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: { storageUsed: -Math.abs(sizeFreed) }, // - (Minus) size
      });
    }

    return new Response(
      JSON.stringify({
        message: "File deleted successfully and storage freed",
        deletedFile,
      }),
      { status: 201 },
    );
  } catch (error) {
    console.error("Error Deleting File:", error);
    return new Response(
      JSON.stringify({ message: `Error Deleting File: ${error}` }),
      { status: 500 },
    );
  }
};
