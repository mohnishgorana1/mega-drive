import dbConnect from "@/lib/dbConnect";
import Folder from "@/models/folder.modal";

export const POST = async (req: Request, res: Response) => {
    await dbConnect();
    const { folderIdToDelete } = await req.json()

    if (!folderIdToDelete) {
        return new Response(JSON.stringify(
            { message: 'Folder ID is required' }
        ), { status: 400 });
    }

    try {
        const deletedFolder = await Folder.findByIdAndDelete(folderIdToDelete, { new: true })
        if (!deletedFolder) {
            console.error('Oops, Cannot Delete folder:');
            return new Response(JSON.stringify(
                { message: `Error Delete Folder` },
            ), { status: 500 }
            )
        }

        // successfully deleted folder
        console.log("Folder deleted successfully", deletedFolder);

        return new Response(JSON.stringify(
            { message: 'Folder deleted successfully', deletedFolder: deletedFolder }
        ), { status: 201 }
        );
    } catch (error) {
        console.error('Error Deleting folder:', error);
        return new Response(JSON.stringify(
            { message: `Error Deleting Folder, ERROR : ${error}` },
        ), { status: 500 }
        )
    }

}