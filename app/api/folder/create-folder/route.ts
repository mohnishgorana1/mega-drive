import { NextApiRequest, NextApiResponse } from 'next';
import Folder from '@/models/folder.modal';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request, res: Response) {
    await dbConnect();

    const { folderName, userId, parentFolderId } = await req.json();
    // console.log("Request for creating folder", folderName, userId, parentFolderId);

    if (!folderName || !userId) {
        return new Response(JSON.stringify(
            { message: 'Folder name and user ID are required' }
        ), { status: 400 });
    }

    try {
        // Create a new folder instance
        const newFolder = new Folder({
            folderName,
            userId,
            parentFolderId: parentFolderId || null, // Set to null if no parentFolderId is provided
        });

        if (!newFolder) {
            console.log("Error Creating folder");
        }

        // Save the folder to the database
        await newFolder.save();
        console.log("Folder Created Successfully", newFolder);


        // If the folder has a parent folder, add this new folder to the parent folder's folders array
        if (parentFolderId) {
            // console.log("finding and Updating parentFolder");

            const parentFolder = await Folder.findById(parentFolderId);
            if (parentFolder) {
                parentFolder.folders.push(newFolder._id);
                await parentFolder.save();
            }
            // console.log("parentFolder updated", parentFolder);

        }

        return new Response(JSON.stringify(
            { message: "Folder Created Successfully", folder: newFolder },
        ), { status: 201 }
        )
    } catch (error) {
        console.error('Error creating folder:', error);
        return new Response(JSON.stringify(
            { message: "Error Created Folder" },
        ), { status: 500 }
        )
    }
} 
