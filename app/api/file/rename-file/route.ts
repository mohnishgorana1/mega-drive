import dbConnect from "@/lib/dbConnect";
import file from "@/models/file.modal";

export const POST = async (req: Request, res: Response) => {
    await dbConnect();
    const { fileIdToRename, fileNewName } = await req.json()

    if (!fileIdToRename || !fileNewName) {
        return new Response(JSON.stringify(
            { message: 'file Name and file ID are required' }
        ), { status: 400 });
    }

    try {
        const renamedFile = await file.findByIdAndUpdate(
            fileIdToRename,
            { fileName: fileNewName },
            { new: true }
        )
        if (!renamedFile) {
            console.error('Oops, Cannot Rename file:');
            return new Response(JSON.stringify(
                { message: `Error Renaming file` },
            ), { status: 500 }
            )
        }

        // successfully renamed file
        console.log("File renamed successfully", renamedFile);

        return new Response(JSON.stringify(
            { message: 'file renamed successfully', renamedFile: renamedFile }
        ), { status: 201 }
        );
    } catch (error) {
        console.error('Error Renaming File:', error);
        return new Response(JSON.stringify(
            { message: `Error Renaming File, ERROR : ${error}` },
        ), { status: 500 }
        )
    }

}