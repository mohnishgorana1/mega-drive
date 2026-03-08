import dbConnect from "@/lib/dbConnect";
import File from "@/models/file.modal";
import Folder from "@/models/folder.modal";
import cloudinary from "@/lib/cloudinary";

// 🛡️ HELPER 1: Prevent Infinite Loops
async function isDestInsideSource(sourceId: string, destId: string | null) {
  if (!destId) return false;
  if (sourceId === destId) return true; 
  
  let currentFolder = await Folder.findById(destId);
  while (currentFolder && currentFolder.parentFolderId) {
      if (currentFolder.parentFolderId.toString() === sourceId) return true; 
      currentFolder = await Folder.findById(currentFolder.parentFolderId);
  }
  return false;
}

// ☁️ HELPER 2: Duplicate file on Cloudinary
async function duplicateCloudinaryFile(fileDoc: any) {
    let rType: "image" | "video" | "raw" | "auto" = "auto";
    if (!fileDoc.type.startsWith("image/") && !fileDoc.type.startsWith("video/")) {
        rType = "raw"; 
    } else if (fileDoc.type.startsWith("video/")) {
        rType = "video";
    }

    try {
      const result = await cloudinary.uploader.upload(fileDoc.databaseLocations.secure_url, {
          resource_type: rType,
          folder: "megaDrive" // Apna cloudinary folder name yahan daal dena agar alag ho
      });

      const downloadUrl = result.secure_url.replace("/upload/", "/upload/fl_attachment/");

      return {
          public_id: result.public_id,
          secure_url: result.secure_url,
          download_url: downloadUrl
      };
    } catch (error) {
      console.error("Cloudinary duplicate failed:", error);
      return null;
    }
}

// 📂 HELPER 3: Recursive Deep-Copy Folder Logic
async function copyFolderRecursive(originalFolderId: string, newParentId: string | null, userId: string, isTopLevel: boolean = false) {
  const originalFolder = await Folder.findById(originalFolderId);
  if (!originalFolder) return null;

  const newName = (isTopLevel && originalFolder.parentFolderId?.toString() === newParentId?.toString()) 
    ? `${originalFolder.folderName} (Copy)` 
    : originalFolder.folderName;

  const newFolder = await Folder.create({
    ...originalFolder.toObject(),
    _id: undefined, 
    parentFolderId: newParentId,
    folderName: newName,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    files: [],
    folders: []
  });

  if (newParentId) {
    await Folder.findByIdAndUpdate(newParentId, { $push: { folders: newFolder._id } });
  }

  const originalFiles = await File.find({ folderId: originalFolderId });
  const subFolders = await Folder.find({ parentFolderId: originalFolderId });

  for (const file of originalFiles) {
    const newCloudinaryData = await duplicateCloudinaryFile(file);
    if (!newCloudinaryData) continue; 

    const newFile = await File.create({
      ...file.toObject(),
      _id: undefined,
      folderId: newFolder._id,
      databaseLocations: newCloudinaryData, 
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    await Folder.findByIdAndUpdate(newFolder._id, { $push: { files: newFile._id } });
  }

  for (const subFolder of subFolders) {
    await copyFolderRecursive(subFolder._id.toString(), newFolder._id.toString(), userId, false);
  }

  return newFolder;
}

// 🚀 MAIN API ROUTE
export async function POST(req: Request) {
  await dbConnect();

  try {
    const { action, items, destinationFolderId, userId } = await req.json();

    if (!items || !Array.isArray(items) || !action || !userId) {
      return new Response(JSON.stringify({ message: "Missing required data" }), { status: 400 });
    }

    const destId = destinationFolderId || null;

    for (const item of items) {
      const { id: itemId, type: itemType } = item;

      // === CUT (Move) ===
      if (action === "cut") {
        if (itemType === "File") {
          const file = await File.findById(itemId);
          if (file) {
            const oldFolderId = file.folderId;
            await File.findByIdAndUpdate(itemId, { folderId: destId });
            if (oldFolderId) await Folder.findByIdAndUpdate(oldFolderId, { $pull: { files: itemId } });
            if (destId) await Folder.findByIdAndUpdate(destId, { $push: { files: itemId } });
          }
        } else if (itemType === "Folder") {
          const isInvalidMove = await isDestInsideSource(itemId, destId);
          if (isInvalidMove) continue; 

          const folder = await Folder.findById(itemId);
          if (folder) {
            const oldParentId = folder.parentFolderId;
            await Folder.findByIdAndUpdate(itemId, { parentFolderId: destId });
            if (oldParentId) await Folder.findByIdAndUpdate(oldParentId, { $pull: { folders: itemId } });
            if (destId) await Folder.findByIdAndUpdate(destId, { $push: { folders: itemId } });
          }
        }
      } 
      
      // === COPY (Duplicate) ===
      else if (action === "copy") {
        if (itemType === "File") {
          const file = await File.findById(itemId);
          if (file) {
            const newCloudinaryData = await duplicateCloudinaryFile(file);
            if (!newCloudinaryData) continue; 

            const newName = file.folderId?.toString() === destId?.toString() 
                ? `${file.fileName} (Copy)` : file.fileName;

            const newFile = await File.create({
              ...file.toObject(),
              _id: undefined,
              folderId: destId,
              fileName: newName,
              databaseLocations: newCloudinaryData, 
              createdAt: Date.now(),
              updatedAt: Date.now()
            });

            if (destId) await Folder.findByIdAndUpdate(destId, { $push: { files: newFile._id } });
          }
        } else if (itemType === "Folder") {
          const isInvalidCopy = await isDestInsideSource(itemId, destId);
          if (isInvalidCopy) continue; 

          await copyFolderRecursive(itemId, destId, userId, true);
        }
      }
    }

    return new Response(JSON.stringify({ message: "Bulk paste successful" }), { status: 200 });

  } catch (error) {
    console.error("Bulk Paste Error:", error);
    return new Response(JSON.stringify({ message: "Error pasting items" }), { status: 500 });
  }
}