import Folder from '@/models/folder.modal';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: Request, res: Response) {
    await dbConnect();

    const { parentFolderId } = await req.json();

    try {
        // TODO: also fetch file
        // const parentFolder = await Folder.findById(parentFolderId).populate('folders').exec()

        const folders = await Folder.find({ parentFolderId: parentFolderId || null })

        if (!folders) {
            return new Response(JSON.stringify(
                { message: "No Folder Found" }
            ), { status: 400 });
        }

        return new Response(JSON.stringify(
            {
                message: "Folder fetched successfully",
                folders: folders
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
