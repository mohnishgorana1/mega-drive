import dbConnect from "@/lib/dbConnect";
import File from "@/models/file.modal";

export const POST = async (req: Request, res: Response) => {
    await dbConnect();
    const { fileIdToDelete } = await req.json()

    if (!fileIdToDelete) {
        return new Response(JSON.stringify(
            { message: 'File ID is required' }
        ), { status: 400 });
    }

    try {
        const deletedFile = await File.findByIdAndDelete(fileIdToDelete, { new: true })
        if (!deletedFile) {
            console.error('Oops, Cannot Delete File:');
            return new Response(JSON.stringify(
                { message: `Error Delete File` },
            ), { status: 500 }
            )
        }

        // successfully deleted File
        console.log("File deleted successfully", deletedFile);

        return new Response(JSON.stringify(
            { message: 'File deleted successfully', deletedFile: deletedFile }
        ), { status: 201 }
        );
    } catch (error) {
        console.error('Error Deleting File:', error);
        return new Response(JSON.stringify(
            { message: `Error Deleting File, ERROR : ${error}` },
        ), { status: 500 }
        )
    }

}