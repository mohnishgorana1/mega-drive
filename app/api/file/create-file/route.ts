import { UploadFileToCloudinary } from "@/lib/actions/cloudinary.action";
import dbConnect from "@/lib/dbConnect";
import FileModal from "@/models/file.modal";
import Folder from "@/models/folder.modal";
import mongoose from "mongoose";

let NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = String(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)

export async function POST(req: Request, res: Response) {
    await dbConnect();

    const formData = await req.formData();
    const userId = formData.get('userId') as string;
    const file = formData.get('file') as File;
    let currentFolderId = formData.get("currentFolderId") as string | null;


    if (!userId || !file || !currentFolderId) {
        return new Response(JSON.stringify(
            { message: "Invalid or Missing Data : Can't Create File" }
        ), { status: 400 });
    }
    console.log("FORMDATA: ", userId, file, currentFolderId);

    let parentFolderId: mongoose.Types.ObjectId | null = null;
    let isFileAtHome: boolean = true;

    if (currentFolderId !== null && currentFolderId !== 'null') {
        isFileAtHome = false;
        parentFolderId = new mongoose.Types.ObjectId(currentFolderId);
    }

    try {
        const data: any = await UploadFileToCloudinary(file, "megaDrive")
        console.log("data", data);

        const { asset_id, public_id, secure_url } = data;


        let downloadUrl;
        if (file.type == "text/plain" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            downloadUrl = `https://res.cloudinary.com/${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/${public_id}.${extension}`;
        } else {
            downloadUrl = `https://res-console.cloudinary.com/${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/media_explorer_thumbnails/${asset_id}/download`
        }

        console.log("DOWNLOAD URL ", downloadUrl);

        let newFile = await new FileModal({
            userId,
            fileName: file.name,
            type: file.type,
            folderId: parentFolderId,
            isFileAtHome: isFileAtHome,
            fileSize: file.size,
            databaseLocations: {
                public_id: data?.public_id,
                secure_url: data?.secure_url,
                download_url: downloadUrl
            },
        });
        console.log("File before saving", newFile);

        await newFile.save();

        if (parentFolderId) {
            const currentFolder = await Folder.findById(parentFolderId);
            if (currentFolder) {
                currentFolder.files.push(newFile);
                currentFolder.folderSize += file.size
                await currentFolder.save();
                console.log("File added to Folder:", currentFolder.name);
            }
        }

        console.log("File uploaded successfully", newFile);

        // Return success response
        return new Response(JSON.stringify({
            message: "File uploaded successfully",
            file: newFile,
        }), { status: 201 });



    } catch (error) {
        console.error("Error: Can't Create File", error);
        return new Response(JSON.stringify({ message: "Error: Can't Create File" }), { status: 500 });
    }
} 
