import dbConnect from "@/lib/dbConnect";
import FileModal from "@/models/file.modal";
import Folder from "@/models/folder.modal";
import User from "@/models/user.modal";
import mongoose from "mongoose";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { userId, fileName, fileType, fileSize, currentFolderId, cloudinaryData } = body;

    if (!userId || !cloudinaryData) {
      return new Response(JSON.stringify({ error: "Missing required data" }), { status: 400 });
    }

    // 🛑 1. CHECK STORAGE LIMIT (Backend Security Guard)
    const user = await User.findById(userId);
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    if (user.storageUsed + fileSize > user.storageLimit) {
      return new Response(JSON.stringify({ error: "Storage limit exceeded." }), { status: 403 });
    }

    // 📁 2. SET FOLDER ID
    let parentFolderId: mongoose.Types.ObjectId | null = null;
    let isFileAtHome: boolean = true;

    if (currentFolderId && currentFolderId !== "null" && currentFolderId !== "undefined") {
      isFileAtHome = false;
      parentFolderId = new mongoose.Types.ObjectId(currentFolderId);
    }

    // 🔗 3. CREATE DOWNLOAD URL (Cloudinary trick for direct download)
    const downloadUrl = cloudinaryData.secure_url.replace("/upload/", "/upload/fl_attachment/");

    // 💾 4. SAVE FILE IN MONGODB
    let newFile = await new FileModal({
      userId,
      fileName,
      type: fileType,
      folderId: parentFolderId,
      isFileAtHome: isFileAtHome,
      fileSize: fileSize,
      databaseLocations: {
        public_id: cloudinaryData.public_id,
        secure_url: cloudinaryData.secure_url,
        download_url: downloadUrl,
      },
    });
    
    await newFile.save();

    // 📂 5. UPDATE PARENT FOLDER (Agar kisi folder ke andar upload hua hai)
    if (parentFolderId) {
      await Folder.findByIdAndUpdate(parentFolderId, {
        $push: { files: newFile._id },
        $inc: { folderSize: fileSize }
      });
    }

    // 📈 6. UPDATE USER STORAGE
    await User.findByIdAndUpdate(userId, {
      $inc: { storageUsed: fileSize }
    });

    return new Response(JSON.stringify({ message: "File saved successfully", file: newFile }), { status: 201 });

  } catch (error) {
    console.error("Database Save Error:", error);
    return new Response(JSON.stringify({ message: "Failed to save file in DB" }), { status: 500 });
  }
}