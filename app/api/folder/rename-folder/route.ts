import dbConnect from "@/lib/dbConnect";
import Folder from "@/models/folder.modal";

export const POST = async (req: Request, res: Response) => {
    await dbConnect();
    const { folderIdToRename, folderNewName } = await req.json()

    if (!folderIdToRename || !folderNewName) {
        return new Response(JSON.stringify(
            { message: 'Folder Name and Folder ID are required' }
        ), { status: 400 });
    }

    try {
        const renamedFolder = await Folder.findByIdAndUpdate(
            folderIdToRename,
            { folderName: folderNewName },
            { new: true }
        )
        if (!renamedFolder) {
            console.error('Oops, Cannot Rename folder:');
            return new Response(JSON.stringify(
                { message: `Error Renaming Folder` },
            ), { status: 500 }
            )
        }

        // successfully renamed folder
        console.log("Folder renamed successfully", renamedFolder);

        return new Response(JSON.stringify(
            { message: 'Folder renamed successfully', renamedFolder: renamedFolder }
        ), { status: 201 }
        );
    } catch (error) {
        console.error('Error Renaming folder:', error);
        return new Response(JSON.stringify(
            { message: `Error Renaming Folder, ERROR : ${error}` },
        ), { status: 500 }
        )
    }

}