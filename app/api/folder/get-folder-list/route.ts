import Folder from '@/models/folder.modal';
import dbConnect from '@/lib/dbConnect';
import File from '@/models/file.modal';

export async function POST(req: Request, res: Response) {
    await dbConnect();

    const { currentFolderId, userId } = await req.json();
    console.log("userMognoId", userId);
    
    try {
        const folders = await Folder.find({
            parentFolderId: currentFolderId || null,
            userId: userId
        })
        const files = await File.find({
            folderId: currentFolderId || null,
            userId: userId
        })


        if (!folders && !files) {
            return new Response(JSON.stringify(
                { message: "No Files/Folder Found" }
            ), { status: 400 });
        }
        
        return new Response(JSON.stringify(
            {
                message: "Folder fetched successfully",
                folders: folders,
                files: files
            },
        ), { status: 201 }
        )
    } catch (error) {
        console.error('Error Fetching Folders', error);
        return new Response(JSON.stringify(
            { message: "Error Fetching Folders" },
        ), { status: 500 }
        )
    }
} 
