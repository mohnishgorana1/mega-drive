import dbConnect from "@/lib/dbConnect";
import Folder from "@/models/folder.modal";

export async function POST(req: Request, res: Response) {
    await dbConnect();

    const { folderId } = await req.json();
    
    if (!folderId) {
        return new Response(JSON.stringify(
            { message: "Invalid or Missing Data : Can't Fetch BreadCrumb Details" }
        ), { status: 400 });
    }

    try {
        const folder = await Folder.findById(folderId).populate('parentFolderId');
        if (!folder) {
            return new Response(JSON.stringify({
                message: "Folder Not Found",
            }), { status: 201 });
        }

        // Return success response
        return new Response(JSON.stringify({
            message: "Folder Found successfully",
            folder
        }), { status: 201 });

    } catch (error) {
        console.error("Error: Can't found Folder", error);
        return new Response(JSON.stringify({ message: "Error:  Can't found Folder" }), { status: 500 });
    }
} 
